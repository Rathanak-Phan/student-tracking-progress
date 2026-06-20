import db from "../../../database/index.js";

export const findById = async (id) => {
    const user = await db.models.users.findByPk(id, {
        include: [
            { model: db.models.roles, as: 'role', attributes: ['name'] },
            { model: db.models.user_profiles, as: 'user_profile' }
        ]
    });
    if (!user) return null;
    const data = user.toJSON();
    return {
        id: data.id,
        username: data.username,
        email: data.email,
        is_validated: data.is_validated,
        is_active: data.is_active,
        role: data.role?.name,
        first_name: data.user_profile?.first_name,
        last_name: data.user_profile?.last_name,
        phone: data.user_profile?.phone,
        avatar_url: data.user_profile?.avatar_url
    };
};

export const updateProfile = async (userId, data) => {
    const allowedFields = ['first_name', 'last_name', 'phone'];
    const updateData = {};
    
    for (const key of allowedFields) {
        if (data[key] !== undefined) {
            updateData[key] = data[key];
        }
    }

    if (Object.keys(updateData).length === 0) return;

    await db.models.user_profiles.update(updateData, { where: { user_id: userId } });
};

export const updateAvatar = async (userId, avatarUrl) => {
    await db.models.user_profiles.update(
        { avatar_url: avatarUrl },
        { where: { user_id: userId } }
    );
};

export const getAcademicRecord = async (studentId) => {
    const grades = await db.models.grades.findAll({
        include: [{
            model: db.models.submissions,
            as: 'submission',
            where: { student_id: studentId },
            include: [{
                model: db.models.assignments,
                as: 'assignment',
                include: [{ model: db.models.classes, as: 'class', attributes: ['name'] }]
            }]
        }],
        order: [['graded_at', 'DESC']]
    });
    
    const formattedGrades = grades.map(g => {
        const data = g.toJSON();
        return {
            ...data,
            assignment_title: data.submission?.assignment?.title,
            class_name: data.submission?.assignment?.class?.name
        };
    });

    const goals = await db.models.goals.findAll({
        where: { student_id: studentId },
        attributes: {
            include: [
                [db.sequelize.literal(`IF(status = 'completed', 1, 0)`), 'is_completed']
            ]
        },
        raw: true
    });

    return { grades: formattedGrades, goals };
};

export const updateRoleAndValidation = async (userId, roleName, isValidated) => {
    const role = await db.models.roles.findOne({ where: { name: roleName } });
    if (!role) throw new Error(`Role ${roleName} not found`);

    await db.models.users.update(
        { role_id: role.id, is_validated: isValidated },
        { where: { id: userId } }
    );
};

export const findAdminUsers = async () => {
    const admins = await db.models.users.findAll({
        where: { is_active: true, is_deleted: false },
        include: [{
            model: db.models.roles,
            as: 'role',
            where: { name: 'admin' },
            attributes: []
        }],
        attributes: ['id'],
        raw: true
    });
    return admins;
};