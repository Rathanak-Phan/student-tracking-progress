import * as service from "../service/goal.service.js";
import { logActivity } from "../../logs/service/log.service.js";
import { asyncHandler } from "../../../shared/utils/asyncHandler.js";

export const createGoal = asyncHandler(async (req, res) => {
  const result = await service.createGoal({
    ...req.body,
    student_id: req.user.id
  });
  await logActivity(req.user.id, `Set a new goal: ${req.body.title}`);
  res.status(201).json(result);
});

export const getGoalsByStudent = asyncHandler(async (req, res) => {
  const result = await service.getGoalsByStudent(req.user.id);
  res.json(result);
});

export const getGoalById = asyncHandler(async (req, res) => {
  const result = await service.getGoalById(req.params.id, req.user.id);
  res.json(result);
});

export const updateGoal = asyncHandler(async (req, res) => {
  const result = await service.updateGoal(req.params.id, req.body, req.user.id);
  res.json(result);
});

export const deleteGoal = asyncHandler(async (req, res) => {
  const result = await service.deleteGoal(req.params.id, req.user.id);
  res.json(result);
});

export const markGoalComplete = asyncHandler(async (req, res) => {
  const result = await service.markGoalComplete(req.params.id, req.user.id);
  await logActivity(req.user.id, `Completed goal ID: ${req.params.id}`);
  res.json(result);
});
