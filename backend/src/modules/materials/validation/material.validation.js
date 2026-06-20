import Joi from "joi";

export const materialSchema = Joi.object({
  class_id: Joi.number().required(),
  title: Joi.string().required().max(255),
  description: Joi.string().allow("", null),
  file_path: Joi.string().required(),
});

export const updateMaterialSchema = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string().allow("", null),
  file_path: Joi.string(),
});
