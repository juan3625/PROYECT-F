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
