export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRoles = req.user.roles || (req.user.role ? [req.user.role] : []);
            
            if (userRoles.length === 0) {
                return res.status(403).json({
                    message: "Access denied: No roles found",
                });
            }

            const hasRole = userRoles.some(role =>
                allowedRoles.includes(role)
            );

            if (!hasRole) {
                return res.status(403).json({
                    message: "Access denied: Insufficient permissions",
                });
            }

            next();
        } catch (err) {
            next(err);
        }
    };
};
