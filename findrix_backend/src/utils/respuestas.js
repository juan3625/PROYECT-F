// Formato de error del contrato: { "error": "mensaje en español, legible" }

export function error(res, status, mensaje) {
  return res.status(status).json({ error: mensaje });
}

export class ErrorApi extends Error {
  constructor(status, mensaje) {
    super(mensaje);
    this.status = status;
  }
}
