import * as repo from "../repository/request.repository.js";
import * as userRepo from "../../admin/repository/user.repository.js";
import { addNotification } from "../../notifications/service/notification.service.js";
import db from "../../../database/index.js";

export const createRequest = async (userId, data, files) => {
    // Check if user already has a pending request
    const existing = await repo.findRequestByUserId(userId);
    if (existing && existing.status === 'pending') {
        throw new Error("You already have a pending verification request.");
    }

    const documents = {
        degree_cert: files.degree_cert ? `/uploads/documents/${files.degree_cert[0].filename}` : null,
        id_card: files.id_card ? `/uploads/documents/${files.id_card[0].filename}` : null,
        other_certs: files.other_certs ? `/uploads/documents/${files.other_certs[0].filename}` : null,
    };

    if (!documents.degree_cert || !documents.id_card) {
        throw new Error("Degree certificate and ID card are required.");
    }

    const requestData = {
        user_id: userId,
        phone: data.phone,
        degree: data.degree,
        major: data.major,
        university: data.university,
        graduation_year: data.graduation_year,
        experience_years: data.experience_years,
        previous_workplace: data.previous_workplace,
        subjects: typeof data.subjects === 'string' ? JSON.parse(data.subjects) : data.subjects,
        documents
    };

    const requestId = await repo.createTeacherRequest(requestData);

    // Notify admins
    const admins = await db.models.users.findAll({
        include: [{ model: db.models.roles, as: 'role', where: { name: 'admin' }, attributes: [] }],
        attributes: ['id']
    });
    
    for (const admin of admins) {
        await addNotification(admin.id, {
            title: "New Teacher Verification",
            message: `A new teacher verification request has been submitted and requires your review.`,
            type: "system",
            link: "/admin/verification"
        });
    }

    return requestId;
};

export const getMyRequest = async (userId) => {
    return await repo.findRequestByUserId(userId);
};

export const getPendingRequests = async () => {
    return await repo.findAllPendingRequests();
};

export const getRequestDetails = async (id) => {
    return await repo.findRequestById(id);
};

export const approveRequest = async (id, adminId) => {
    const request = await repo.findRequestById(id);
    if (!request) throw new Error("Request not found");

    await repo.updateRequestStatus(id, 'approved', null, adminId);
    
    const role = await db.models.roles.findOne({ where: { name: 'teacher' } });
    await userRepo.updateUser(request.user_id, { is_validated: true, role_id: role.id });

    await addNotification(request.user_id, {
        title: "Instructor Account Approved 🚀",
        message: "Congratulations! Your teacher verification request has been approved. You now have full instructor access.",
        type: "system",
        link: "/teacher"
    });

    return { message: "Request approved successfully" };
};

export const rejectRequest = async (id, adminNote, adminId) => {
    const request = await repo.findRequestById(id);
    if (!request) throw new Error("Request not found");

    if (!adminNote) throw new Error("Rejection reason is required.");

    await repo.updateRequestStatus(id, 'rejected', adminNote, adminId);

    await addNotification(request.user_id, {
        title: "Instructor Account Rejected",
        message: `Your teacher verification request was rejected. Reason: ${adminNote}`,
        type: "system",
        link: "/student/settings/upgrade"
    });

    return { message: "Request rejected successfully" };
};
