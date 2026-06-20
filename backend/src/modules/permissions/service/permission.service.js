import * as repo from "../repository/permission.repository.js";

const permissionCache = new Map();

export const getPermissionsByRole = async (roleId) => {
    if (permissionCache.has(roleId)) {
        return permissionCache.get(roleId);
    }

    const permissions = await repo.findPermissionsByRoleId(roleId);
    permissionCache.set(roleId, permissions);
    return permissions;
};

export const hasPermission = async (roleId, requiredPermission) => {
    const permissions = await getPermissionsByRole(roleId);
    return permissions.includes(requiredPermission);
};

export const clearCache = () => {
    permissionCache.clear();
};
