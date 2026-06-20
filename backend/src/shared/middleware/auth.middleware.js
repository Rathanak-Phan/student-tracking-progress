import { verifyAccessToken } from "../../shared/utils/jwt.js";
import db from "../../database/index.js";

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access token required",
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid or expired token",
            });
        }

        const user = await db.models.users.findByPk(decoded.id, {
            include: [{ model: db.models.roles, as: 'role', attributes: ['name'] }]
        });

        if (!user) {
            return res.status(401).json({ message: "User no longer exists" });
        }
        if (user.is_deleted || !user.is_active) {
            return res.status(403).json({ message: "Account is inactive or deleted" });
        }

        req.user = {
            ...decoded,
            role: user.role?.name
        };
        next();
    } catch (err) {
        next(err);
    }
};