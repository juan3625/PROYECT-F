import { crearMetaSchema, abonoSchema } from "../schemas/metaAhorro.schema.js";
import * as metaService from "../services/metaAhorro.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getMetas = asyncHandler(async (req, res) => {
  const metas = await metaService.listar(req.usuarioId);
  res.status(200).json(metas);
});

export const postMeta = asyncHandler(async (req, res) => {
  const datos = await crearMetaSchema.validateAsync(req.body);
  const meta = await metaService.crear(req.usuarioId, datos);
  res.status(201).json(meta);
});

export const postAbono = asyncHandler(async (req, res) => {
  const { monto } = await abonoSchema.validateAsync(req.body);
  const meta = await metaService.abonar(req.usuarioId, req.params.id, monto);
  res.status(200).json(meta);
});

export const putMeta = asyncHandler(async (req, res) => {
  const datos = await crearMetaSchema.validateAsync(req.body);
  const meta = await metaService.actualizar(req.usuarioId, req.params.id, datos);
  res.status(200).json(meta);
});
