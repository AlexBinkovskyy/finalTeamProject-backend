import Joi from 'joi'

export const addWaterDataSchema = Joi.object({
  date: Joi.string()
    .pattern(/^\d{2}\.\d{2}\.\d{4}$/)
    .required()
    .messages({
      'any.required': "Поле date є обов'язковим",
      'string.empty': 'Поле date не може бути пустим',
      'string.pattern.base': 'Поле date має бути у форматі "dd.mm.yyyy"',
    }),
  time: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .required()
    .messages({
      'any.required': "Поле time є обов'язковим",
      'string.empty': 'Поле time не може бути пустим',
      'string.pattern.base': 'Поле time має бути у форматі "hh:mm"',
    }),
  amount: Joi.number().positive().required().messages({
    'any.required': 'Поле amount є обовязковим',
    'number.base': 'Поле amount повинно бути числом',
    'number.positive': 'Значення поля amount повинно бути позитивним числом',
  }),
})

export const updateWaterDataSchema = Joi.object({
  time: Joi.string()
    .pattern(/^\d{2}:\d{2}$/)
    .messages({
      'any.required': "Поле time є обов'язковим",
      'string.empty': 'Поле time не може бути пустим',
      'string.pattern.base': 'Поле time має бути у форматі "hh:mm"',
    }),
  amount: Joi.number().positive().messages({
    'any.required': 'Поле amount є обовязковим',
    'number.base': 'Поле amount повинно бути числом',
    'number.positive': 'Значення поля amount повинно бути позитивним числом',
  }),
})

export const validateParamsDateDay = Joi.object({
  date: Joi.string()
    .pattern(/^\d{2}\.\d{2}\.\d{4}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Невірний формат дати. Використовуйте формат "dd-mm-yyyy"',
      'string.empty': 'Поле дати не може бути порожнім',
      'any.required': 'Поле дати є обовязковим',
    }),
})

export const validateParamsDateMounth = Joi.object({
  date: Joi.string()
    .pattern(/^\d{2}\.\d{4}$/)
    .required()
    .messages({
      'string.pattern.base':
        'Невірний формат дати. Використовуйте формат "mm-yyyy"',
      'string.empty': 'Поле дати не може бути порожнім',
      'any.required': "Поле дати є обов'язковим",
    }),
})
