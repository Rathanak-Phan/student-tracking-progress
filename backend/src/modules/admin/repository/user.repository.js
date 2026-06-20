import db from "../../../database/index.js";
import { Op } from "sequelize";

export const findAllUsers = async ({ search, role, status, page = 1, limit = 10 }) => {
    const where = { is_deleted: false };
    
    if (search) {
        where[Op.or] = [
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
        ];
    }
    
    if (status !== undefined && status !== '') {
        where.status = status;
    }

    const roleInclude = {
        model: db.models.roles,
        as: 'role',
        attributes: ['name']
    };
    
    if (role) {
        roleInclude.where = { name: role };
    }

    const users = await db.models.users.findAll({
        where,
        include: [roleInclude],
        attributes: ['id', 'username', 'email', 'is_active', 'is_validated', 'is_deleted', 'status', 'last_login_at', 'created_at'],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
    });

    return users.map(u => {
        const data = u.toJSON();
        return {
            ...data,
            role_name: data.role?.name
        };
    });
};

export const findUserById = async (id) => {
    const user = await db.models.users.findOne({
        where: { id, is_deleted: false },
        include: [{ model: db.models.roles, as: 'role', attributes: ['name'] }]
    });
    if (!user) return null;
    const data = user.toJSON();
    return { ...data, role_name: data.role?.name };
};

export const updateUser = async (id, data) => {
    await db.models.users.update(data, { where: { id } });
};

export const softDeleteUser = async (id) => {
    await db.models.users.update({ is_deleted: true }, { where: { id } });
};

export const bulkActionUsers = async (userIds, action, data = null) => {
    if (!userIds || userIds.length === 0) return;
    
    const where = { id: { [Op.in]: userIds } };
    
    if (action === 'delete') {
        await db.models.users.update({ is_deleted: true }, { where });
    } else if (action === 'update_status' && data?.status) {
        await db.models.users.update({ status: data.status }, { where });
    } else if (action === 'update_role' && data?.role_id) {
        await db.models.users.update({ role_id: data.role_id }, { where });
    }
};

export const getStudentAcademicRecord = async (studentId) => {
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

    const enrollments = await db.models.enrollments.findAll({
        where: { student_id: studentId },
        include: [{ model: db.models.classes, as: 'class', attributes: ['name'] }]
    });

    const formattedEnrollments = enrollments.map(e => {
        const data = e.toJSON();
        return {
            name: data.class?.name,
            enrolled_at: data.enrolled_at,
            status: data.status
        };
    });

    return { grades: formattedGrades, goals, enrollments: formattedEnrollments };
};
