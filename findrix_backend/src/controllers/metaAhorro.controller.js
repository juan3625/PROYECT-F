import { crearMetaSchema, abonoSchema } from "../schemas/metaAhorro.schema.js";
import * as metaService from "../services/metaAhorro.service.js";

export async function getMetas(req, res, next) {
  try {
    const metas = await metaService.listar(req.usuarioId);
    res.status(200).json(metas);
  } catch (err) {
    next(err);
  }
}

export async function postMeta(req, res, next) {
  try {
    const datos = await crearMetaSchema.validateAsync(req.body);
    const meta = await metaService.crear(req.usuarioId, datos);
    res.status(201).json(meta);
  } catch (err) {
    next(err);
  }
}

export async function postAbono(req, res, next) {
  try {
    const { monto } = await abonoSchema.validateAsync(req.body);
    const meta = await metaService.abonar(req.usuarioId, req.params.id, monto);
    res.status(200).json(meta);
  } catch (err) {
    next(err);
  }
}
