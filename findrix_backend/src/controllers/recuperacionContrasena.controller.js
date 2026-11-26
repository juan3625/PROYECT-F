import {
  olvideContrasenaSchema,
  restablecerContrasenaSchema,
} from "../schemas/recuperacionContrasena.schema.js";
import * as recuperacionService from "../services/recuperacionContrasena.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const postOlvideContrasena = asyncHandler(async (req, res) => {
  const datos = await olvideContrasenaSchema.validateAsync(req.body);
  const resultado = await recuperacionService.solicitarRecuperacion(datos);
  res.status(200).json(resultado);
});

export const postRestablecerContrasena = asyncHandler(async (req, res) => {
  const datos = await restablecerContrasenaSchema.validateAsync(req.body);
  const resultado = await recuperacionService.restablecerContrasena(datos);
  res.status(200).json(resultado);
});
