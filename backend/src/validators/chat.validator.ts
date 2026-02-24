import Joi from "joi";

export const chatMessageSchema = Joi.object({
    query: Joi.string().min(1).max(2000).required(),
    conversationId: Joi.string().uuid().optional(),
});
