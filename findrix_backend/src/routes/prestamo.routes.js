import { Router } from "express";
import { getPrestamos, postPrestamo, postAbono } from "../controllers/prestamo.controller.js";

export const prestamoRoutes = Router();

/**
 * @openapi
 * /api/prestamos:
 *   get:
 *     summary: Lista los préstamos del usuario
 *     tags: [Préstamos]
 *   post:
 *     summary: Crea un préstamo nuevo
 *     tags: [Préstamos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, montoTotal, tipo, icono]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Préstamo carro
 *               montoTotal:
 *                 type: number
 *                 example: 8000000
 *               tipo:
 *                 type: string
 *                 enum: [presto, debo]
 *                 example: debo
 *               icono:
 *                 type: string
 *                 example: banco
 * /api/prestamos/{id}/abonos:
 *   post:
 *     summary: Abona a un préstamo (con tope en montoTotal)
 *     tags: [Préstamos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del préstamo
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
 *                 example: 500000
 */
prestamoRoutes.get("/", getPrestamos);
prestamoRoutes.post("/", postPrestamo);
prestamoRoutes.post("/:id/abonos", postAbono);
