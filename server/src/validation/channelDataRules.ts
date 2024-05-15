import Joi from "joi";

export const channelNameRules = Joi.string().min(3).max(30).required().messages({
  "string.min": "Channel name must be at least 3 characters long",
  "string.max": "Channel name must be less than 30 characters long",
  "any.required": "Channel name is required",
});
