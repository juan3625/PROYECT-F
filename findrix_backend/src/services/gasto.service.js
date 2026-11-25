import * as gastoRepository from "../repositories/gasto.repository.js";
import { verificarCategoriaDelUsuario } from "./categoria.service.js";
import { ErrorApi } from "../utils/respuestas.js";

export async function listar(usuarioId) {
  return gastoRepository.listar(usuarioId);
}

export async function crear(usuarioId, datos) {
  await verificarCategoriaDelUsuario(usuarioId, datos.categoriaId);
  const estado = datos.esPagoPendiente ? "pendiente" : "pagado";
  return gastoRepository.crear(usuarioId, { ...datos, estado });
}

export async function marcarPagado(usuarioId, gastoId) {
  const gasto = await gastoRepository.marcarPagado(usuarioId, gastoId);
  if (!gasto) {
    throw new ErrorApi(404, "No se encontró ese gasto.");
  }
  return gasto;
}

export async function actualizar(usuarioId, gastoId, datos) {
  await verificarCategoriaDelUsuario(usuarioId, datos.categoriaId);
  const estado = datos.esPagoPendiente ? "pendiente" : "pagado";
  const gasto = await gastoRepository.actualizar(usuarioId, gastoId, { ...datos, estado });
  if (!gasto) {
    throw new ErrorApi(404, "No se encontró ese gasto.");
  }
  return gasto;
}
