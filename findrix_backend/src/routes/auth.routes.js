import { Router } from "express";
import { postRegistro, postLogin } from "../controllers/auth.controller.js";

export const authRoutes = Router();

/**
 * @openapi
 * /api/auth/registro:
 *   post:
 *     summary: Crea una cuenta nueva
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, correo, contrasena]
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               correo:
 *                 type: string
 *                 example: juan@correo.com
 *               contrasena:
 *                 type: string
 *                 example: contrasena123
 */
authRoutes.post("/registro", postRegistro);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, contrasena]
 *             properties:
 *               correo:
 *                 type: string
 *                 example: juan@correo.com
 *               contrasena:
 *                 type: string
 *                 example: contrasena123
 */
authRoutes.post("/login", postLogin);
