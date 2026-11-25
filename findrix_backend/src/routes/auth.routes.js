import { Router } from "express";
import { postRegistro, postLogin } from "../controllers/auth.controller.js";
import {
  postOlvideContrasena,
  postRestablecerContrasena,
} from "../controllers/recuperacionContrasena.controller.js";
import { limitarRecuperacion } from "../middlewares/rateLimitRecuperacion.js";

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

/**
 * @openapi
 * /api/auth/olvide-contrasena:
 *   post:
 *     summary: Solicita un enlace para restablecer la contraseña
 *     description: Devuelve la misma respuesta exista o no una cuenta con ese correo.
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo]
 *             properties:
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: juan@correo.com
 *     responses:
 *       200:
 *         description: Respuesta uniforme para evitar revelar cuentas existentes.
 */
authRoutes.post("/olvide-contrasena", limitarRecuperacion, postOlvideContrasena);

/**
 * @openapi
 * /api/auth/restablecer-contrasena:
 *   post:
 *     summary: Cambia la contraseña usando un token de un solo uso
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, contrasena]
 *             properties:
 *               token:
 *                 type: string
 *                 minLength: 64
 *                 maxLength: 64
 *               contrasena:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Contraseña actualizada.
 *       400:
 *         description: Token inválido, usado o expirado.
 */
authRoutes.post("/restablecer-contrasena", limitarRecuperacion, postRestablecerContrasena);
