import Joi from "joi";

export const crearMetaSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(100).required(),
  montoMeta: Joi.number().positive().required(),
  fechaMeta: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .allow(null),
  icono: Joi.string().trim().min(1).required(),
});

export const abonoSchema = Joi.object({
  monto: Joi.number().positive().required(),
});
