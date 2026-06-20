import * as repo from "../repository/grade.repository.js";
import * as submissionRepo from "../../submissions/repository/submission.repository.js";
import { logActivity } from "../../logs/service/log.service.js";
import { addNotification } from "../../notifications/service/notification.service.js";

export const gradeSubmission = async (data, userId) => {
  const info = await repo.findTeacherBySubmissionId(data.submission_id);
  if (!info) {
    throw new Error("Submission not found");
  }

  if (info.teacher_id !== userId) {
    throw new Error("Unauthorized: Only the class teacher can grade this submission");
  }

  if (data.score > info.max_score) {
    throw new Error(`Score cannot exceed maximum score of ${info.max_score}`);
  }

  const gradeId = await repo.createGrade(data);
  
  // Update submission status to 'graded'
  try {
    await submissionRepo.updateStatus(data.submission_id, 'graded');
    
    // Create a real student notification
    try {
      await addNotification(info.student_id, {
        title: "Grade Received",
        message: `Your submission for "${info.assignment_title}" has been graded: ${data.score}%`,
        type: "grade"
      });
    } catch (notificationErr) {
      console.error("Failed to create grade notification", notificationErr);
    }
    
    // Log activity for the student
    await logActivity(info.student_id, `Received grade for: ${info.assignment_title}`);
  } catch (err) {
    console.error("Failed to update submission status or log activity", err);
  }

  return {
    message: "Submission graded successfully",
    gradeId
  };
};

export const getGradeBySubmission = async (submissionId) => {
  return await repo.findBySubmissionId(submissionId);
};
