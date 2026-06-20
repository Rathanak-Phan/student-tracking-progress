import * as repo from "../repository/teacher.repository.js";
import * as userRepo from "../repository/user.repository.js";
import { addNotification } from "../../notifications/service/notification.service.js";
import db from "../../../database/index.js";

export const getPendingTeachers = async () => {
    return await repo.findPendingTeachers();
};

export const validateTeacher = async (id, isValidated) => {
    const user = await userRepo.findUserById(id);
    if (!user) throw new Error("Teacher not found");
    
    if (isValidated) {
        await userRepo.updateUser(id, { is_validated: true });
        
        // Notify the teacher that their account is activated
        try {
            await addNotification(id, {
                title: "Account Approved 🚀",
                message: "Congratulations! Your teacher registration request has been approved by the admin. You now have full dashboard access.",
                type: "system",
                link: "/teacher"
            });
        } catch (notificationErr) {
            console.error("Failed to create approval notification", notificationErr);
        }
    } else {
        const studentRole = await db.models.roles.findOne({ where: { name: 'student' } });
        
        await userRepo.updateUser(id, { is_validated: true, role_id: studentRole.id });
        
        // Also mark any approved teacher_requests as rejected so they can re-apply
        await db.models.teacher_requests.update(
            { status: 'rejected', admin_note: 'Teacher status was manually revoked by an administrator.' },
            { where: { user_id: id } }
        );
        
        try {
            await addNotification(id, {
                title: "Teacher Request Rejected",
                message: "Your request to become a teacher was reviewed and rejected. You remain on the standard student account.",
                type: "system",
                link: "/student"
            });
        } catch (notificationErr) {
            console.error("Failed to create rejection notification", notificationErr);
        }
    }
    
    return { message: isValidated ? "Teacher approved" : "Teacher rejected" };
};
