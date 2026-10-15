import { crearCategoriaSchema } from "../schemas/categoria.schema.js";
import * as categoriaService from "../services/categoria.service.js";

export async function getCategorias(req, res, next) {
  try {
    const categorias = await categoriaService.listar(req.usuarioId);
    res.status(200).json(categorias);
  } catch (err) {
    next(err);
  }
}

export async function postCategoria(req, res, next) {
  try {
    const datos = await crearCategoriaSchema.validateAsync(req.body);
    const categoria = await categoriaService.crear(req.usuarioId, datos);
    res.status(201).json(categoria);
  } catch (err) {
    next(err);
  }
}
