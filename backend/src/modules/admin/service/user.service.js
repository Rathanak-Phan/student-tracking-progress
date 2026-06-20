import * as repo from "../repository/user.repository.js";

export const getAllUsers = async (filters) => {
    return await repo.findAllUsers(filters);
};

export const getUserById = async (id) => {
    const user = await repo.findUserById(id);
    if (!user) throw new Error("User not found");
    return user;
};

export const updateUser = async (id, data, adminId) => {
    if (parseInt(id) === adminId && data.is_active === false) {
        throw new Error("Admin cannot deactivate themselves");
    }
    
    await repo.updateUser(id, data);
    return { message: "User updated successfully" };
};

export const deleteUser = async (id, adminId) => {
    if (parseInt(id) === adminId) {
        throw new Error("Admin cannot delete themselves");
    }
    await repo.softDeleteUser(id);
    return { message: "User deleted successfully" };
};

export const bulkActionUsers = async (userIds, action, data, adminId) => {
    if (!Array.isArray(userIds) || userIds.length === 0) {
        throw new Error("No users provided");
    }
    if (action === 'delete' && userIds.includes(adminId)) {
        throw new Error("Admin cannot delete themselves in a bulk action");
    }
    
    await repo.bulkActionUsers(userIds, action, data);
    return { message: `Bulk action '${action}' applied successfully to ${userIds.length} users` };
};

export const validateTeacher = async (id, isValidated) => {
    const user = await repo.findUserById(id);
    if (!user) throw new Error("User not found");
    if (user.role_name !== "teacher") throw new Error("User is not a teacher");

    await repo.updateUser(id, { is_validated: isValidated });
    return { 
        message: isValidated ? "Teacher account validated successfully" : "Teacher account invalidated" 
    };
};

export const getStudentDetails = async (id) => {
    const user = await repo.findUserById(id);
    if (!user) throw new Error("Student not found");
    if (user.role_name !== "student") throw new Error("User is not a student");

    const record = await repo.getStudentAcademicRecord(id);
    return { ...user, ...record };
};
