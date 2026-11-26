import { registroSchema, loginSchema, googleSchema } from "../schemas/auth.schema.js";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const postRegistro = asyncHandler(async (req, res) => {
  const datos = await registroSchema.validateAsync(req.body);
  const resultado = await authService.registrar(datos);
  res.status(201).json(resultado);
});

export const postLogin = asyncHandler(async (req, res) => {
  const datos = await loginSchema.validateAsync(req.body);
  const resultado = await authService.login(datos);
  res.status(200).json(resultado);
});

export const postGoogle = asyncHandler(async (req, res) => {
  const datos = await googleSchema.validateAsync(req.body);
  const resultado = await authService.loginConGoogle(datos);
  res.status(200).json(resultado);
});
