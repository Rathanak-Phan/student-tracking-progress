import * as repo from "../repository/class.repository.js";
import * as pendingRepo from "../repository/pending-enrollment.repository.js";
import { logActivity } from "../../logs/service/log.service.js";

export const createClass = async (data, user) => {
  if (user.role !== "teacher") {
    throw new Error("Only teacher can create class");
  }

  // Generate a random class code if not provided
  const code = data.code || Math.random().toString(36).substring(2, 8).toUpperCase();

  const classId = await repo.createClass({
    ...data,
    teacher_id: user.id,
    code,
  });

  return { classId, code };
};

export const getAllClasses = async (user) => {
  if (user.role === "teacher") {
    return await repo.findByTeacher(user.id);
  } else if (user.role === "student") {
    return await repo.findByStudent(user.id);
  }
  return await repo.findAll();
};

export const getClassById = async (id) => {
  const data = await repo.findById(id);
  if (!data) throw new Error("Class not found");
  return data;
};

export const deleteClass = async (id, user) => {
  if (user.role !== "teacher" && user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  await repo.deleteClass(id);
};

export const updateClass = async (id, data, user) => {
  const classData = await repo.findById(id);
  if (!classData) throw new Error("Class not found");

  if (user.role !== "admin" && String(classData.teacher_id) !== String(user.id)) {
    throw new Error("Unauthorized: Only the class teacher can update details");
  }

  await repo.updateClass(id, data);
  return { message: "Class updated successfully" };
};

export const joinClass = async (code, studentId) => {
  const classData = await repo.findByCode(code);
  if (!classData) {
    throw new Error("Class not found with this code");
  }

  const isEnrolled = await pendingRepo.checkExistingEnrollment(classData.id, studentId);
  if (isEnrolled) {
    throw new Error("You already have a pending or active enrollment in this class");
  }

  // Create a pending enrollment request instead of direct enrollment
  await pendingRepo.createPendingEnrollment(classData.id, studentId);
  await logActivity(studentId, `Requested to join class: ${classData.name}`);

  return {
    message: "Join request submitted. Waiting for teacher approval.",
    class: classData,
  };
};

export const removeStudentFromClass = async (classId, studentId, user) => {
  const classData = await repo.findById(classId);
  if (!classData) throw new Error("Class not found");

  // Only the teacher of the class or admin can remove a student
  if (user.role !== "admin" && String(classData.teacher_id) !== String(user.id)) {
    throw new Error("Unauthorized: Only the class teacher can remove students");
  }

  await repo.removeStudent(classId, studentId);
  return { message: "Student removed from class successfully" };
};

export const getEnrolledStudents = async (classId, user) => {
  const classData = await repo.findById(classId);
  if (!classData) throw new Error("Class not found");

  const isTeacher = String(classData.teacher_id) === String(user.id);
  const isAdmin = user.role === "admin";
  
  let isEnrolled = false;
  if (user.role === "student") {
    isEnrolled = await repo.checkEnrollment(classId, user.id);
  }

  if (!isAdmin && !isTeacher && !isEnrolled) {
    throw new Error("Unauthorized");
  }

  return await repo.findEnrolledStudents(classId);
};

// Get pending join requests for a class (Teacher only)
export const getPendingJoinRequests = async (classId, user) => {
  const classData = await repo.findById(classId);
  if (!classData) throw new Error("Class not found");

  // Only the teacher of the class can see pending requests
  if (String(classData.teacher_id) !== String(user.id) && user.role !== "admin") {
    throw new Error("Unauthorized: Only the class teacher can view join requests");
  }

  return await pendingRepo.getPendingRequests(classId);
};

// Approve a student join request (Teacher only)
export const approvePendingRequest = async (requestId, classId, user) => {
  const classData = await repo.findById(classId);
  if (!classData) throw new Error("Class not found");

  // Only the teacher of the class can approve requests
  if (String(classData.teacher_id) !== String(user.id) && user.role !== "admin") {
    throw new Error("Unauthorized: Only the class teacher can approve join requests");
  }

  // Convert to integers for database query
  const numRequestId = parseInt(requestId);
  const numClassId = parseInt(classId);

  console.log(`[DEBUG] Approving request: requestId=${numRequestId}, classId=${numClassId}`);

  // Get the specific pending request
  const request = await pendingRepo.getPendingRequestById(numRequestId, numClassId);

  console.log(`[DEBUG] Found request:`, request);

  if (!request) {
    throw new Error(`Pending request not found (ID: ${numRequestId}, Class: ${numClassId})`);
  }

  console.log(`[DEBUG] Approving for student: ${request.student_id}`);

  await pendingRepo.approvePendingRequest(numRequestId, numClassId, request.student_id);
  await logActivity(user.id, `Approved join request from student ${request.student_id} to class: ${classData.name}`);

  return { message: "Join request approved successfully" };
};

// Reject a student join request (Teacher only)
export const rejectPendingRequest = async (requestId, classId, user) => {
  const classData = await repo.findById(classId);
  if (!classData) throw new Error("Class not found");

  // Only the teacher of the class can reject requests
  if (String(classData.teacher_id) !== String(user.id) && user.role !== "admin") {
    throw new Error("Unauthorized: Only the class teacher can reject join requests");
  }

  // Convert to integers for database query
  const numRequestId = parseInt(requestId);
  const numClassId = parseInt(classId);

  // Get the specific pending request
  const request = await pendingRepo.getPendingRequestById(numRequestId, numClassId);

  if (!request) {
    throw new Error("Pending request not found");
  }

  await pendingRepo.rejectPendingRequest(numRequestId);
  await logActivity(user.id, `Rejected join request to class: ${classData.name}`);

  return { message: "Join request rejected successfully" };
};