import { crearIngresoSchema } from "../schemas/ingreso.schema.js";
import * as ingresoService from "../services/ingreso.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getIngresos = asyncHandler(async (req, res) => {
  const ingresos = await ingresoService.listar(req.usuarioId);
  res.status(200).json(ingresos);
});

export const postIngreso = asyncHandler(async (req, res) => {
  const datos = await crearIngresoSchema.validateAsync(req.body);
  const ingreso = await ingresoService.crear(req.usuarioId, datos);
  res.status(201).json(ingreso);
});

export const putIngreso = asyncHandler(async (req, res) => {
  const datos = await crearIngresoSchema.validateAsync(req.body);
  const ingreso = await ingresoService.actualizar(req.usuarioId, req.params.id, datos);
  res.status(200).json(ingreso);
});
