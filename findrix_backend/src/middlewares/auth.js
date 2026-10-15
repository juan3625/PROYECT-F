import jwt from "jsonwebtoken";
import { ErrorApi } from "../utils/respuestas.js";

// Header: Authorization: Bearer <token> — obligatorio en todos los endpoints
// excepto /api/auth/*, según el contrato.
export function requiereAuth(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return next(new ErrorApi(401, "No se encontró un token de autenticación."));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuarioId = payload.sub;
    next();
  } catch {
    next(new ErrorApi(401, "Token inválido o expirado."));
  }
}
