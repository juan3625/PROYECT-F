import { Router } from "express";
import { getMetas, postMeta, postAbono } from "../controllers/metaAhorro.controller.js";

export const metaAhorroRoutes = Router();

/**
 * @openapi
 * /api/metas-ahorro:
 *   get:
 *     summary: Lista las metas de ahorro del usuario
 *     tags: [Metas de ahorro]
 *   post:
 *     summary: Crea una meta de ahorro nueva
 *     tags: [Metas de ahorro]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, montoMeta, icono]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Vacaciones
 *               montoMeta:
 *                 type: number
 *                 example: 500000
 *               fechaMeta:
 *                 type: string
 *                 nullable: true
 *                 example: 2026-12-31
 *               icono:
 *                 type: string
 *                 example: avion
 * /api/metas-ahorro/{id}/abonos:
 *   post:
 *     summary: Abona a una meta de ahorro (con tope en montoMeta)
 *     tags: [Metas de ahorro]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la meta de ahorro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [monto]
 *             properties:
 *               monto:
 *                 type: number
 *                 example: 50000
 */
metaAhorroRoutes.get("/", getMetas);
metaAhorroRoutes.post("/", postMeta);
metaAhorroRoutes.post("/:id/abonos", postAbono);
