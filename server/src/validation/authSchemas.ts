import Joi from "joi";

const email = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .trim()
  .lowercase()
  .messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  });

const password = Joi.string()
  .min(8)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])"))
  .required()
  .messages({
    "string.min": "Password must be at least 8 characters long",
    "string.pattern.base":
      "Password must include at least one lowercase letter, one uppercase letter, one digit, and one special character",
    "any.required": "Password is required",
  });

const name = Joi.string()
  .min(3)
  .max(30)
  .pattern(new RegExp("^[a-zA-Z ]+$"))
  .required()
  .trim()
  .messages({
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name must be less than 30 characters long",
    "string.pattern.base": "Name can only contain letters and spaces",
    "any.required": "Name is required",
  });

export const loginSchema = Joi.object({
  email,
  password,
});

export const registerSchema = Joi.object({
  name,
  email,
  password,
});
