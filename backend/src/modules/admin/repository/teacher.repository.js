import db from "../../../database/index.js";

export const findPendingTeachers = async () => {
    const users = await db.models.users.findAll({
        where: { is_validated: false, is_deleted: false },
        include: [{
            model: db.models.roles,
            as: 'role',
            where: { name: 'teacher' },
            attributes: []
        }],
        attributes: ['id', 'username', 'email', 'created_at'],
        raw: true
    });
    return users;
};
