import Joi from "joi";

export const crearPrestamoSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(100).required(),
  montoTotal: Joi.number().positive().required(),
  tipo: Joi.string().valid("presto", "debo").required(),
  icono: Joi.string().trim().min(1).required(),
});

export const abonoSchema = Joi.object({
  monto: Joi.number().positive().required(),
});
