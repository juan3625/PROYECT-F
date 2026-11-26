import { crearGastoSchema } from "../schemas/gasto.schema.js";
import * as gastoService from "../services/gasto.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getGastos = asyncHandler(async (req, res) => {
  const gastos = await gastoService.listar(req.usuarioId);
  res.status(200).json(gastos);
});

export const postGasto = asyncHandler(async (req, res) => {
  const datos = await crearGastoSchema.validateAsync(req.body);
  const gasto = await gastoService.crear(req.usuarioId, datos);
  res.status(201).json(gasto);
});

export const patchMarcarPagado = asyncHandler(async (req, res) => {
  const gasto = await gastoService.marcarPagado(req.usuarioId, req.params.id);
  res.status(200).json(gasto);
});

export const putGasto = asyncHandler(async (req, res) => {
  const datos = await crearGastoSchema.validateAsync(req.body);
  const gasto = await gastoService.actualizar(req.usuarioId, req.params.id, datos);
  res.status(200).json(gasto);
});
