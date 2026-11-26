import * as categoriaRepository from "../repositories/categoria.repository.js";
import { ErrorApi } from "./respuestas.js";

export async function verificarCategoriaDelUsuario(usuarioId, categoriaId) {
  const pertenece = await categoriaRepository.existeParaUsuario(categoriaId, usuarioId);
  if (!pertenece) {
    throw new ErrorApi(400, "La categoría indicada no existe.");
  }
}
