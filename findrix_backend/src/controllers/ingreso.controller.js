import { crearIngresoSchema } from "../schemas/ingreso.schema.js";
import * as ingresoService from "../services/ingreso.service.js";

export async function getIngresos(req, res, next) {
  try {
    const ingresos = await ingresoService.listar(req.usuarioId);
    res.status(200).json(ingresos);
  } catch (err) {
    next(err);
  }
}

export async function postIngreso(req, res, next) {
  try {
    const datos = await crearIngresoSchema.validateAsync(req.body);
    const ingreso = await ingresoService.crear(req.usuarioId, datos);
    res.status(201).json(ingreso);
  } catch (err) {
    next(err);
  }
}
