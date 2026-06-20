import Joi from "joi";

export const submissionSchema = Joi.object({
  assignment_id: Joi.number().integer().required(),
  file_path: Joi.string().allow(null, ""),
  content: Joi.string().allow(null, ""),
}).or('file_path', 'content');
