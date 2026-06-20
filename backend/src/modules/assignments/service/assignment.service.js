import * as repo from "../repository/assignment.repository.js";
import * as classRepo from "../../classes/repository/class.repository.js";
import * as notificationService from "../../notifications/service/notification.service.js";

export const createAssignment = async (data, userId) => {
  const classData = await classRepo.findById(data.class_id);
  if (!classData) throw new Error("Class not found");

  if (classData.teacher_id !== userId) {
    throw new Error("Unauthorized: Only the class teacher can create assignments");
  }

  const assignmentId = await repo.createAssignment(data);

  try {
    const now = new Date();
    const appearTime = data.available_from ? new Date(data.available_from) : now;
    
    if (appearTime <= now) {
      const students = await classRepo.findEnrolledStudents(data.class_id);
      const notificationPromises = students
        .filter(s => s.status === 'active')
        .map(student => 
          notificationService.addNotification(student.id, {
            title: "New Assignment",
            message: `A new assignment "${data.title}" has been posted in ${classData.name}.`,
            type: "assignment",
            link: `/student/assignments`,
            target_role: "student"
          })
        );
      await Promise.all(notificationPromises);
    }
  } catch (err) {
    console.error("Failed to notify students of new assignment:", err);
  }

  return { assignmentId };
};

export const updateAssignment = async (id, data, userId) => {
  const assignment = await repo.findAssignmentById(id);
  if (!assignment) throw new Error("Assignment not found");

  const classData = await classRepo.findById(assignment.class_id);
  if (classData.teacher_id !== userId) {
    throw new Error("Unauthorized");
  }

  await repo.updateAssignment(id, data);
  return { message: "Assignment updated successfully" };
};

export const deleteAssignment = async (id, userId) => {
  const assignment = await repo.findAssignmentById(id);
  if (!assignment) throw new Error("Assignment not found");

  const classData = await classRepo.findById(assignment.class_id);
  if (classData.teacher_id !== userId) {
    throw new Error("Unauthorized");
  }

  await repo.deleteAssignment(id);
  return { message: "Assignment deleted successfully" };
};

export const getAssignmentsByClass = async (classId) => {
  return await repo.findAssignmentsByClass(classId);
};

export const getAssignmentById = async (id) => {
  const assignment = await repo.findAssignmentById(id);
  if (!assignment) throw new Error("Assignment not found");
  return assignment;
};

export const getAssignmentsByUser = async (userId, role) => {
  if (role === 'teacher') {
    return await repo.findAssignmentsForTeacher(userId);
  } else if (role === 'student') {
    return await repo.findAssignmentsForStudent(userId);
  }
  return [];
};

export const getAllAssignments = async () => {
  return await repo.findAllAssignments();
};

