import Joi from "joi";

export const suscripcionSchema = Joi.object({
  endpoint: Joi.string().uri({ scheme: ["https"] }).required(),
  p256dh: Joi.string().trim().min(20).required(),
  auth: Joi.string().trim().min(10).required(),
  diasAnticipacion: Joi.number().valid(0, 1, 2, 3, 7).default(1),
});

export const eliminarSuscripcionSchema = Joi.object({
  endpoint: Joi.string().uri({ scheme: ["https"] }).required(),
});
