import { crearGastoSchema } from "../schemas/gasto.schema.js";
import * as gastoService from "../services/gasto.service.js";

export async function getGastos(req, res, next) {
  try {
    const gastos = await gastoService.listar(req.usuarioId);
    res.status(200).json(gastos);
  } catch (err) {
    next(err);
  }
}

export async function postGasto(req, res, next) {
  try {
    const datos = await crearGastoSchema.validateAsync(req.body);
    const gasto = await gastoService.crear(req.usuarioId, datos);
    res.status(201).json(gasto);
  } catch (err) {
    next(err);
  }
}

export async function patchMarcarPagado(req, res, next) {
  try {
    const gasto = await gastoService.marcarPagado(req.usuarioId, req.params.id);
    res.status(200).json(gasto);
  } catch (err) {
    next(err);
  }
}
