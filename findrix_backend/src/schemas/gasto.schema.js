import Joi from "joi";

// fechaVencimiento es obligatorio solo si esPagoPendiente: true — regla
// explícita del contrato, resuelta con Joi .when().
export const crearGastoSchema = Joi.object({
  monto: Joi.number().positive().required(),
  descripcion: Joi.string().trim().min(1).max(200).required(),
  categoriaId: Joi.string().uuid().required(),
  fecha: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required(),
  esPagoPendiente: Joi.boolean().required(),
  prioridad: Joi.string().valid("alta", "media", "baja").required(),
  fechaVencimiento: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .when("esPagoPendiente", {
      is: true,
      then: Joi.required(),
      otherwise: Joi.optional().allow(null),
    }),
});
