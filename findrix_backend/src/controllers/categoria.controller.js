import { crearCategoriaSchema, actualizarCategoriaSchema } from "../schemas/categoria.schema.js";
import * as categoriaService from "../services/categoria.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getCategorias = asyncHandler(async (req, res) => {
  const categorias = await categoriaService.listar(req.usuarioId);
  res.status(200).json(categorias);
});

export const postCategoria = asyncHandler(async (req, res) => {
  const datos = await crearCategoriaSchema.validateAsync(req.body);
  const categoria = await categoriaService.crear(req.usuarioId, datos);
  res.status(201).json(categoria);
});

export const putCategoria = asyncHandler(async (req, res) => {
  const datos = await actualizarCategoriaSchema.validateAsync(req.body);
  const categoria = await categoriaService.actualizar(req.usuarioId, req.params.id, datos);
  res.status(200).json(categoria);
});
