import { Router } from "express";
import { deleteSuscripcion, postSuscripcion } from "../controllers/notificacion.controller.js";

export const notificacionRoutes = Router();

/**
 * @openapi
 * /api/notificaciones/suscripciones:
 *   post:
 *     summary: Guarda una suscripción Web Push del dispositivo actual
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [endpoint, p256dh, auth]
 *             properties:
 *               endpoint: { type: string, format: uri }
 *               p256dh: { type: string }
 *               auth: { type: string }
 *               diasAnticipacion: { type: integer, enum: [0, 1, 2, 3, 7], default: 1 }
 *     responses:
 *       201:
 *         description: Suscripción guardada.
 */
notificacionRoutes.post("/suscripciones", postSuscripcion);

/**
 * @openapi
 * /api/notificaciones/suscripciones:
 *   delete:
 *     summary: Elimina la suscripción Web Push del dispositivo actual
 *     tags: [Notificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [endpoint]
 *             properties:
 *               endpoint: { type: string, format: uri }
 */
notificacionRoutes.delete("/suscripciones", deleteSuscripcion);
