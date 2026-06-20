import * as repo from "../repository/index.js";

export const getProfile = async (id) => {
    return await repo.findById(id);
};

export const updateProfile = async (id, data) => {
    return await repo.updateProfile(id, data);
};

export const uploadAvatar = async (id, file) => {
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    await repo.updateAvatar(id, avatarUrl);
    return avatarUrl;
};

export const getAcademicRecord = async (studentId) => {
    return await repo.getAcademicRecord(studentId);
};

import { addNotification } from "../../notifications/service/notification.service.js";

export const requestTeacher = async (userId) => {
    const user = await repo.findById(userId);
    if (!user) throw new Error("User not found");
    if (user.role === 'teacher' || user.role === 'admin') {
        throw new Error("User is already a teacher or admin");
    }

    await repo.updateRoleAndValidation(userId, 'teacher', false);

    const admins = await repo.findAdminUsers();
    for (const admin of admins) {
        await addNotification(admin.id, {
            title: "Teacher Role Request",
            message: `User ${user.username} (${user.email}) has requested to become a teacher and is pending approval.`,
            type: "system",
            link: "/admin/users"
        });
    }

    return { message: "Teacher role requested successfully. Your account is now pending admin approval." };
};