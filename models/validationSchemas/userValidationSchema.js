import Joi from "joi";

export const registerLoginUserSchema = Joi.object({
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

export const changeUserCredsSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).messages({
    "string.email": "Uncorrect email name or domain",
    "any.required": "Missed required email field",
  }),
  name: Joi.string().min(2).max(20),
  gender: Joi.string().valid("male", "female"),
  dailyNorma: Joi.number().min(500).max(5000),
  weight: Joi.number(),
  activeTime: Joi.number(),
  goal: Joi.number(),
  avatar: Joi.object({
    filename: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().required()
  }),
});

export const emailSendPassRecoverySchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required().messages({
    "string.email": "Uncorrect email name or domain",
    "any.required": "Missed required email field",
  }),
});