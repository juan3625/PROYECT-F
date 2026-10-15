import { Router } from "express";
import { getGastos, postGasto, patchMarcarPagado } from "../controllers/gasto.controller.js";

export const gastoRoutes = Router();

/**
 * @openapi
 * /api/gastos:
 *   get:
 *     summary: Lista todos los gastos del usuario, orden descendente por fecha
 *     tags: [Gastos]
 *   post:
 *     summary: Crea un gasto nuevo
 *     tags: [Gastos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [monto, descripcion, categoriaId, fecha, esPagoPendiente, prioridad]
 *             properties:
 *               monto:
 *                 type: number
 *                 example: 120000
 *               descripcion:
 *                 type: string
 *                 example: Recarga de gasolina
 *               categoriaId:
 *                 type: string
 *                 format: uuid
 *                 example: 3fa85f64-5717-4562-b3fc-2c963f66afa6
 *               fecha:
 *                 type: string
 *                 example: 2026-09-23
 *               esPagoPendiente:
 *                 type: boolean
 *                 example: false
 *               prioridad:
 *                 type: string
 *                 enum: [alta, media, baja]
 *                 example: media
 *               fechaVencimiento:
 *                 type: string
 *                 nullable: true
 *                 description: Obligatorio solo si esPagoPendiente es true
 *                 example: 2026-10-01
 * /api/gastos/{id}/marcar-pagado:
 *   patch:
 *     summary: Marca un gasto pendiente como pagado
 *     tags: [Gastos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del gasto
 */
gastoRoutes.get("/", getGastos);
gastoRoutes.post("/", postGasto);
gastoRoutes.patch("/:id/marcar-pagado", patchMarcarPagado);
