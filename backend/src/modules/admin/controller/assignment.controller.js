import * as assignmentService from "../../assignments/service/assignment.service.js";

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const getAllAssignments = asyncHandler(async (req, res) => {
  const assignments = await assignmentService.getAllAssignments();
  res.json(assignments);
});
