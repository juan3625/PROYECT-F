import * as categoriaRepository from "../repositories/categoria.repository.js";
import { PALETA_CATEGORIAS } from "../constants/categorias.js";
import { ErrorApi } from "../utils/respuestas.js";

export async function verificarCategoriaDelUsuario(usuarioId, categoriaId) {
  const pertenece = await categoriaRepository.existeParaUsuario(categoriaId, usuarioId);
  if (!pertenece) {
    throw new ErrorApi(400, "La categoría indicada no existe.");
  }
}

async function siguienteColor(usuarioId, tipo) {
  const total = await categoriaRepository.contarPorTipo(usuarioId, tipo);
  const paleta = PALETA_CATEGORIAS[tipo];
  return paleta[total % paleta.length];
}

export async function listar(usuarioId) {
  return categoriaRepository.listar(usuarioId);
}

export async function crear(usuarioId, { nombre, tipo, icono }) {
  const color = await siguienteColor(usuarioId, tipo);
  return categoriaRepository.crear(usuarioId, { nombre, tipo, icono, color });
}

export async function actualizar(usuarioId, categoriaId, datos) {
  const categoria = await categoriaRepository.actualizar(usuarioId, categoriaId, datos);
  if (!categoria) {
    throw new ErrorApi(404, "No se encontró esa categoría.");
  }
  return categoria;
}

export async function eliminar(usuarioId, categoriaId) {
  await verificarCategoriaDelUsuario(usuarioId, categoriaId);
  const usos = await categoriaRepository.contarMovimientos(usuarioId, categoriaId);
  if (usos.gastos + usos.ingresos > 0) {
    throw new ErrorApi(409, "No puedes eliminar una categoría que ya tiene movimientos. Edítala para conservar tu historial.");
  }
  const eliminada = await categoriaRepository.eliminar(usuarioId, categoriaId);
  if (!eliminada) throw new ErrorApi(404, "No se encontró esa categoría.");
  return eliminada;
}
