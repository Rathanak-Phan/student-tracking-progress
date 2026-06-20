import * as repo from "../repository/auth.repository.js";
import { hashPassword, comparePassword } from "../../../shared/utils/hash.js";
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../../shared/utils/jwt.js";
import { logActivity } from "../../logs/service/log.service.js";
import { addNotification } from "../../notifications/service/notification.service.js";

export const register = async (data) => {
    const { email, password, username, role = "student" } = data;

    if (role === "admin") {
        throw new Error("Cannot register as admin via public endpoint");
    }

    const existing = await repo.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    const role_id = await repo.findRoleIdByName(role);
    if (!role_id) throw new Error(`Role ${role} not found`);

    const password_hash = await hashPassword(password);

    // Students are validated by default, teachers need admin approval
    const is_validated = role === "student";

    const userId = await repo.createUser({
        email,
        username,
        password_hash,
        role_id,
        is_validated
    });

    await repo.createProfile(userId);

    let accessToken = null;
    let refreshToken = null;

    if (is_validated) {
        accessToken = generateAccessToken({ id: userId, role: role, role_id: role_id });
        refreshToken = generateRefreshToken({ id: userId });

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await repo.saveRefreshToken(userId, refreshToken, expiresAt);
    } else if (role === "teacher") {
        // Notify all admins about the new pending teacher
        const admins = await repo.findAdminUsers();
        for (const admin of admins) {
            await addNotification(admin.id, {
                title: "New Teacher Registration",
                message: `Teacher ${username} (${email}) has registered and is pending approval.`,
                type: "system",
                link: "/admin/verification"
            });
        }
    }

    return { 
        userId, 
        accessToken, 
        refreshToken,
        message: role === "teacher" ? "Registration successful. Please wait for admin validation." : "Registration successful."
    };
};

export const login = async ({ email, password }) => {
    const user = await repo.findByEmail(email);
    if (!user) throw new Error("User not found");

    if (user.is_deleted || !user.is_active || !user.is_validated) {
        await logActivity(user.id, "Failed login attempt: Account status restricted");
        if (user.is_deleted) {
            throw new Error("Account has been deleted");
        }

        if (!user.is_active) {
            throw new Error("Account is inactive. Please contact support.");
        }

        if (!user.is_validated) {
            throw new Error("Account pending admin validation.");
        }
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
        await logActivity(user.id, "Failed login attempt: Invalid password");
        throw new Error("Invalid password");
    }

    const accessToken = generateAccessToken({ id: user.id, role: user.role_name, role_id: user.role_id });
    const refreshToken = generateRefreshToken({ id: user.id });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await repo.saveRefreshToken(user.id, refreshToken, expiresAt);

    await logActivity(user.id, "User logged in successfully");

    return { 
        userId: user.id, 
        role: user.role_name,
        name: user.first_name || user.username,
        avatar_url: user.avatar_url,
        accessToken, 
        refreshToken 
    };
};

export const refreshAccessToken = async (refreshToken) => {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) throw new Error("Invalid or expired refresh token");

    const tokenData = await repo.findRefreshToken(refreshToken);
    if (!tokenData) throw new Error("Refresh token revoked or not found");

    const user = await repo.findById(decoded.id);
    if (!user) throw new Error("User no longer exists");

    if (user.is_deleted || !user.is_active || !user.is_validated) {
        throw new Error("User account is no longer valid or active");
    }

    const newAccessToken = generateAccessToken({ id: user.id, role: user.role_name, role_id: user.role_id });

    return { accessToken: newAccessToken };
};