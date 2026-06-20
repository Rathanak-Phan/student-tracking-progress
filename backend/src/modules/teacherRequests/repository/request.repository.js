import db from "../../../database/index.js";

export const createTeacherRequest = async (requestData) => {
    const {
        user_id, phone, degree, major, university, graduation_year,
        experience_years, previous_workplace, subjects, documents
    } = requestData;

    const request = await db.models.teacher_requests.create({
        user_id, phone, degree, major, university, graduation_year,
        experience_years, previous_workplace, 
        subjects: subjects, 
        documents: documents
    });

    return request.id;
};

export const findRequestByUserId = async (userId) => {
    return await db.models.teacher_requests.findOne({
        where: { user_id: userId },
        order: [['created_at', 'DESC']],
        raw: true
    });
};

export const findAllPendingRequests = async () => {
    const requests = await db.models.teacher_requests.findAll({
        where: { status: 'pending' },
        include: [{
            model: db.models.users,
            as: 'user',
            attributes: ['username', 'email'],
            include: [{ model: db.models.user_profiles, as: 'user_profile', attributes: ['first_name', 'last_name', 'avatar_url'] }]
        }],
        order: [['created_at', 'ASC']]
    });
    return requests.map(r => {
        const data = r.toJSON();
        return {
            ...data,
            username: data.user?.username,
            email: data.user?.email,
            first_name: data.user?.user_profile?.first_name,
            last_name: data.user?.user_profile?.last_name,
            avatar_url: data.user?.user_profile?.avatar_url
        };
    });
};

export const findRequestById = async (id) => {
    const request = await db.models.teacher_requests.findByPk(id, {
        include: [{
            model: db.models.users,
            as: 'user',
            attributes: ['username', 'email'],
            include: [{ model: db.models.user_profiles, as: 'user_profile', attributes: ['first_name', 'last_name', 'avatar_url'] }]
        }]
    });
    if (!request) return null;
    const data = request.toJSON();
    return {
        ...data,
        username: data.user?.username,
        email: data.user?.email,
        first_name: data.user?.user_profile?.first_name,
        last_name: data.user?.user_profile?.last_name,
        avatar_url: data.user?.user_profile?.avatar_url
    };
};

export const updateRequestStatus = async (id, status, adminNote, adminId) => {
    await db.models.teacher_requests.update({
        status, admin_note: adminNote, reviewed_by: adminId, reviewed_at: new Date()
    }, { where: { id } });
};
