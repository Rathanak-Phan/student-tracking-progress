import * as classRepo from "../../classes/repository/class.repository.js";
import * as userRepo from "../../users/repository/index.js";

export const getMyStudents = async (teacherId) => {
    return await classRepo.findStudentsByTeacher(teacherId);
};

export const getStudentProfile = async (studentId, teacherId) => {
    // Verify teacher teaches this student
    const students = await classRepo.findStudentsByTeacher(teacherId);
    const isMyStudent = students.some(s => s.id === parseInt(studentId));
    
    if (!isMyStudent) {
        throw new Error("Unauthorized: Student not in your classes");
    }

    const details = await userRepo.getAcademicRecord(studentId);
    const user = await userRepo.findById(studentId);
    
    return { ...user, ...details };
};
