import db from "../../../database/index.js";
import { Op } from "sequelize";

export const findByEmail = async (email) => {
    const user = await db.models.users.findOne({
        where: { email },
        include: [
            { model: db.models.roles, as: 'role', attributes: ['name'] },
            { model: db.models.user_profiles, as: 'user_profile' }
        ]
    });
    if (!user) return null;
    const data = user.toJSON();
    return {
        ...data,
        role_name: data.role?.name,
        avatar_url: data.user_profile?.avatar_url,
        first_name: data.user_profile?.first_name,
        last_name: data.user_profile?.last_name
    };
};

export const createUser = async ({ email, username, password_hash, role_id, is_validated = false }) => {
    const user = await db.models.users.create({
        email, username, password_hash, role_id, is_validated
    });
    return user.id;
};

export const createProfile = async (userId) => {
    await db.models.user_profiles.create({ user_id: userId });
};

export const findRoleIdByName = async (roleName) => {
    const role = await db.models.roles.findOne({ where: { name: roleName } });
    return role ? role.id : null;
};

export const findById = async (id) => {
    const user = await db.models.users.findByPk(id, {
        include: [{ model: db.models.roles, as: 'role' }]
    });
    if (!user) return null;
    const data = user.toJSON();
    return { ...data, role_name: data.role?.name };
};

export const saveRefreshToken = async (userId, token, expiresAt) => {
    await db.models.refresh_tokens.create({
        user_id: userId, token, expires_at: expiresAt
    });
};

export const findRefreshToken = async (token) => {
    return await db.models.refresh_tokens.findOne({
        where: { 
            token, 
            revoked: false, 
            expires_at: { [Op.gt]: new Date() } 
        },
        raw: true
    });
};

export const revokeRefreshToken = async (token) => {
    await db.models.refresh_tokens.update(
        { revoked: true },
        { where: { token } }
    );
};

export const findAdminUsers = async () => {
    const admins = await db.models.users.findAll({
        where: { is_deleted: false },
        include: [{
            model: db.models.roles,
            as: 'role',
            where: { name: 'admin' }
        }],
        attributes: ['id'],
        raw: true
    });
    return admins;
};