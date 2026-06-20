import db from "../../../database/index.js";
import { Op } from "sequelize";

export const findActivityLogs = async (filter) => {
    const { userId, action, page = 1, limit = 20 } = filter;
    
    const where = {};
    if (userId) {
        where.user_id = userId;
    }
    if (action) {
        where.action = { [Op.like]: `%${action}%` };
    }

    const logs = await db.models.activity_logs.findAll({
        where,
        include: [{
            model: db.models.users,
            as: 'user',
            attributes: ['username', 'email']
        }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
    });

    return logs.map(l => {
        const data = l.toJSON();
        return {
            ...data,
            username: data.user?.username,
            email: data.user?.email
        };
    });
};
