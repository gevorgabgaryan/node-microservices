import Joi from 'joi'

export const objectIdParamsSchema = Joi.object({
  id: Joi.string().hex().length(24).required()
})
