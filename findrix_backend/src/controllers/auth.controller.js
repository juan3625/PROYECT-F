import { registroSchema, loginSchema } from "../schemas/auth.schema.js";
import * as authService from "../services/auth.service.js";

export async function postRegistro(req, res, next) {
  try {
    const datos = await registroSchema.validateAsync(req.body);
    const resultado = await authService.registrar(datos);
    res.status(201).json(resultado);
  } catch (err) {
    next(err);
  }
}

export async function postLogin(req, res, next) {
  try {
    const datos = await loginSchema.validateAsync(req.body);
    const resultado = await authService.login(datos);
    res.status(200).json(resultado);
  } catch (err) {
    next(err);
  }
}
