import Joi from "joi";

export const crearIngresoSchema = Joi.object({
  monto: Joi.number().positive().required(),
  descripcion: Joi.string().trim().min(1).max(200).required(),
  categoriaId: Joi.string().uuid().required(),
  fecha: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
});
