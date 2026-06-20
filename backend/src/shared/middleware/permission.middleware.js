import * as permissionService from "../../modules/permissions/service/permission.service.js";

export const authorizePermission = (permission) => {
    return async (req, res, next) => {
        try {
            /*
            if (!req.user || !req.user.role_id) {
                return res.status(401).json({ message: "Unauthorized: No role information" });
            }

            const allowed = await permissionService.hasPermission(req.user.role_id, permission);
            
            if (!allowed) {
                return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
            }
            */

            next();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
};
