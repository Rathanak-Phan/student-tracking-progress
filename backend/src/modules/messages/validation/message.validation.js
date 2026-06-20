import Joi from "joi";

export const messageSchema = Joi.object({
  receiver_id: Joi.number().required(),
  content: Joi.string().allow('', null).optional(),
  reply_to_id: Joi.number().allow(null).optional(),
});

export const announcementSchema = Joi.object({
  title: Joi.string().required().max(255),
  content: Joi.string().required(),
});
