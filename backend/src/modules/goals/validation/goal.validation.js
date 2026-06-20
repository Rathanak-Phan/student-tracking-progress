import Joi from "joi";

export const goalSchema = Joi.object({
  title: Joi.string().required().max(255),
  target_date: Joi.date().required(),
  target_value: Joi.number().optional().min(1),
  type: Joi.string().valid("grade", "assignment", "hours").optional(),
  assignment_id: Joi.number().optional().allow(null),
  progress: Joi.number().optional().min(0).max(100),
});

export const updateGoalSchema = Joi.object({
  title: Joi.string().max(255),
  target_date: Joi.date(),
  target_value: Joi.number().min(1),
  current_value: Joi.number().min(0),
  type: Joi.string().valid("grade", "assignment", "hours"),
  status: Joi.string().valid("pending", "in_progress", "completed"),
  assignment_id: Joi.number().optional().allow(null),
  progress: Joi.number().optional().min(0).max(100),
});
