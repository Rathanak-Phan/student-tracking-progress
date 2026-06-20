import Joi from "joi";

export const createClassSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  description: Joi.string().allow("", null).max(500),
  code: Joi.string().min(5).max(20), // Optional if we generate it, but let's allow it
  cover_image: Joi.any(),
});

export const updateClassSchema = Joi.object({
  name: Joi.string().min(3).max(100),
  description: Joi.string().allow("", null).max(500),
  is_active: Joi.boolean(),
  cover_image: Joi.any(),
});

export const joinClassSchema = Joi.object({
  code: Joi.string().required().min(5).max(20),
});
