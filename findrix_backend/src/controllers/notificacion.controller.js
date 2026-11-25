import {
  eliminarSuscripcionSchema,
  suscripcionSchema,
} from "../schemas/notificacion.schema.js";
import * as notificacionService from "../services/notificacion.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const postSuscripcion = asyncHandler(async (req, res) => {
  const datos = await suscripcionSchema.validateAsync(req.body);
  const resultado = await notificacionService.guardarSuscripcion(req.usuarioId, datos);
  res.status(201).json(resultado);
});

export const deleteSuscripcion = asyncHandler(async (req, res) => {
  const datos = await eliminarSuscripcionSchema.validateAsync(req.body);
  const resultado = await notificacionService.eliminarSuscripcion(req.usuarioId, datos.endpoint);
  res.status(200).json(resultado);
});
