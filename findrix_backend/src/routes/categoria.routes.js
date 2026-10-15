import { Router } from "express";
import { getCategorias, postCategoria } from "../controllers/categoria.controller.js";

export const categoriaRoutes = Router();

/**
 * @openapi
 * /api/categorias:
 *   get:
 *     summary: Lista las categorías del usuario autenticado
 *     tags: [Categorías]
 *   post:
 *     summary: Crea una categoría nueva
 *     tags: [Categorías]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, tipo, icono]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Transporte
 *               tipo:
 *                 type: string
 *                 enum: [gasto, ingreso]
 *                 example: gasto
 *               icono:
 *                 type: string
 *                 example: carro
 */
categoriaRoutes.get("/", getCategorias);
categoriaRoutes.post("/", postCategoria);
