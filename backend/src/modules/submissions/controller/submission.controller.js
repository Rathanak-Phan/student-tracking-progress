import * as service from "../service/submission.service.js";
import { logActivity } from "../../logs/service/log.service.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

export const submitAssignment = asyncHandler(async (req, res) => {
  if (!req.file && !req.body.content) throw new Error("No file or text content provided");

  const result = await service.submitAssignment({
    assignment_id: req.body.assignment_id,
    student_id: req.user.id,
    file_path: req.file ? `/uploads/submissions/${req.file.filename}` : null,
    content: req.body.content || null
  });
  
  await logActivity(req.user.id, `Submitted assignment ID: ${req.body.assignment_id}`);
  res.status(201).json(result);
});

export const getSubmissions = asyncHandler(async (req, res) => {
  const { assignment_id } = req.query;
  if (!assignment_id) return res.status(400).json({ message: "assignment_id is required" });

  const result = await service.getSubmissionsByAssignment(assignment_id);
  res.json(result);
});

export const getMySubmissions = asyncHandler(async (req, res) => {
  const result = await service.getSubmissionsByStudent(req.user.id);
  res.json(result);
});
