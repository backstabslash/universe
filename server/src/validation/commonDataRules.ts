import Joi from "joi";

export const uuidRules = Joi.string().length(24).required().messages({
  "string.length": "Invalid user ID",
  "any.required": "User ID is required",
});
