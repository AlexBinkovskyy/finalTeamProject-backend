import Joi from "joi";

export const registerUserSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.email": "Uncorrect email name or domain",
    "any.required": "Missed required email field",
  }),
  password: Joi.string().min(6).max(16).required().messages({
    "string.min": "Password must have at least {#limit} symbols",
    "string.max": "Password must have maximum {#limit} symbols",
    "any.required": "Missed required password field",
  }),
});

export const resendEmailSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).messages({
    "string.email": "Uncorrect email name or domain",
  }),
});