import * as prestamoRepository from "../repositories/prestamo.repository.js";
import { ErrorApi } from "../utils/respuestas.js";

export async function listar(usuarioId) {
  return prestamoRepository.listar(usuarioId);
}

export async function crear(usuarioId, datos) {
  return prestamoRepository.crear(usuarioId, datos);
}

export async function abonar(usuarioId, prestamoId, monto) {
  const prestamo = await prestamoRepository.abonar(usuarioId, prestamoId, monto);
  if (!prestamo) {
    throw new ErrorApi(404, "No se encontró ese préstamo.");
  }
  return prestamo;
}

export async function actualizar(usuarioId, prestamoId, datos) {
  const prestamo = await prestamoRepository.actualizar(usuarioId, prestamoId, datos);
  if (!prestamo) {
    throw new ErrorApi(404, "No se encontró ese préstamo.");
  }
  return prestamo;
}
