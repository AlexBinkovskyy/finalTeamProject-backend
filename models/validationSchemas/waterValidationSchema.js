import Joi from 'joi'

export const addWaterDataSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{2}\.\d{2}\.\d{4}$/)
    .required()
    .messages({
      'any.required': 'The date field is required',
      'string.empty': 'The date field cannot be empty',
      'string.pattern.base': 'The date field must be in the format dd.mm.yyyy',
    }),
  time: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      'any.required': 'The time field is required',
      'string.empty': 'The time field cannot be empty',
      'string.pattern.base': 'The time field must be in the format hh:mm',
    }),
  amount: Joi.number().positive().required().messages({
    'any.required': 'The amount field is required',
    'number.base': 'The amount field must be a number',
    'number.positive':
      'The value of the amount field must be a positive number',
  }),
})

export const updateWaterDataSchema = Joi.object({
  time: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .messages({
      'any.required': 'The time field is required',
      'string.empty': 'The time field cannot be empty',
      'string.pattern.base': 'The time field must be in the format hh:mm',
    }),
  amount: Joi.number().positive().messages({
    'any.required': 'The amount field is required',
    'number.base': 'The amount field must be a number',
    'number.positive':
      'The value of the amount field must be a positive number',
  }),
})

export const validateParamsDateDay = Joi.object({
  date: Joi.string()
    .pattern(/^\d{2}\.\d{2}\.\d{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid date format. Use the format dd.mm.yyyy',
      'string.empty': 'The date field cannot be empty',
      'any.required': 'The date field is required',
    }),
})

export const validateParamsDateMounth = Joi.object({
  date: Joi.string()
    .pattern(/^\d{2}\.\d{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid date format. Use the format mm.yyyy',
      'string.empty': 'The date field cannot be empty',
      'any.required': 'The date field is required',
    }),
})
