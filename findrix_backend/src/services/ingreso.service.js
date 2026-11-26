import * as ingresoRepository from "../repositories/ingreso.repository.js";
import { verificarCategoriaDelUsuario } from "./categoria.service.js";
import { ErrorApi } from "../utils/respuestas.js";

export async function listar(usuarioId) {
  return ingresoRepository.listar(usuarioId);
}

export async function crear(usuarioId, datos) {
  await verificarCategoriaDelUsuario(usuarioId, datos.categoriaId);
  return ingresoRepository.crear(usuarioId, datos);
}

export async function actualizar(usuarioId, ingresoId, datos) {
  await verificarCategoriaDelUsuario(usuarioId, datos.categoriaId);
  const ingreso = await ingresoRepository.actualizar(usuarioId, ingresoId, datos);
  if (!ingreso) {
    throw new ErrorApi(404, "No se encontró ese ingreso.");
  }
  return ingreso;
}
