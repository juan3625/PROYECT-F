import { Router } from "express";
import { getIngresos, postIngreso } from "../controllers/ingreso.controller.js";

export const ingresoRoutes = Router();

/**
 * @openapi
 * /api/ingresos:
 *   get:
 *     summary: Lista todos los ingresos del usuario
 *     tags: [Ingresos]
 *   post:
 *     summary: Crea un ingreso nuevo
 *     tags: [Ingresos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [monto, descripcion, categoriaId, fecha]
 *             properties:
 *               monto:
 *                 type: number
 *                 example: 2500000
 *               descripcion:
 *                 type: string
 *                 example: Pago de nómina
 *               categoriaId:
 *                 type: string
 *                 format: uuid
 *                 example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *               fecha:
 *                 type: string
 *                 example: 2026-09-23
 */
ingresoRoutes.get("/", getIngresos);
ingresoRoutes.post("/", postIngreso);
