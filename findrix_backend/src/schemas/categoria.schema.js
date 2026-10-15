import Joi from "joi";

// El frontend nunca manda "color" — lo asigna el backend. Ver nota en el
// contrato de API: agregarCategoria() en el cliente lo hardcodea a "primary"
// hoy, pero eso es responsabilidad del backend, no una decisión del cliente.
export const crearCategoriaSchema = Joi.object({
  nombre: Joi.string().trim().min(1).max(60).required(),
  tipo: Joi.string().valid("gasto", "ingreso").required(),
  icono: Joi.string().trim().min(1).required(),
});
