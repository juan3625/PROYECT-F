import { ErrorApi } from "../utils/respuestas.js";

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ErrorApi) {
    return res.status(err.status).json({ error: err.message });
  }

  // Errores de validación de Joi que no se hayan capturado antes.
  if (err.isJoi) {
    return res.status(400).json({ error: err.details[0].message });
  }

  console.error(err);
  return res.status(500).json({ error: "Ocurrió un error inesperado. Intenta de nuevo." });
}

export function rutaNoEncontrada(req, res) {
  res.status(404).json({ error: "Ruta no encontrada." });
}
