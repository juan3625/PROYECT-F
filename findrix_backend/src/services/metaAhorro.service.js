import * as metaAhorroRepository from "../repositories/metaAhorro.repository.js";
import { ErrorApi } from "../utils/respuestas.js";

export async function listar(usuarioId) {
  return metaAhorroRepository.listar(usuarioId);
}

export async function crear(usuarioId, datos) {
  return metaAhorroRepository.crear(usuarioId, datos);
}

export async function abonar(usuarioId, metaId, monto) {
  const meta = await metaAhorroRepository.abonar(usuarioId, metaId, monto);
  if (!meta) {
    throw new ErrorApi(404, "No se encontró esa meta de ahorro.");
  }
  return meta;
}

export async function actualizar(usuarioId, metaId, datos) {
  const meta = await metaAhorroRepository.actualizar(usuarioId, metaId, datos);
  if (!meta) {
    throw new ErrorApi(404, "No se encontró esa meta de ahorro.");
  }
  return meta;
}
