import Joi from "joi";

export const assignmentSchema = Joi.object({
  class_id: Joi.number().required(),
  title: Joi.string().required().max(255),
  description: Joi.string().allow("", null),
  available_from: Joi.date().allow(null, ""),
  due_date: Joi.date().required(),
  max_score: Joi.number().default(100),
  submission_type: Joi.string().valid('file', 'text', 'both').default('file'),
});

export const updateAssignmentSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().allow("", null),
  available_from: Joi.date().allow(null, ""),
  due_date: Joi.date(),
  max_score: Joi.number(),
  class_id: Joi.any(),
  submission_type: Joi.string().valid('file', 'text', 'both'),
});


export const gradeSchema = Joi.object({
  grade: Joi.number().min(0).required(),
  feedback: Joi.string().allow("", null),
});
