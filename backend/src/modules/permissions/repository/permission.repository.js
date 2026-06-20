import db from "../../../database/index.js";

export const findPermissionsByRoleId = async (roleId) => {
    const role = await db.models.roles.findByPk(roleId, {
        include: [{
            model: db.models.permissions,
            as: 'permission_id_permissions'
        }]
    });
    return role ? role.permission_id_permissions.map(p => p.name) : [];
};

export const findAllPermissions = async () => {
    return await db.models.permissions.findAll({ raw: true });
};
