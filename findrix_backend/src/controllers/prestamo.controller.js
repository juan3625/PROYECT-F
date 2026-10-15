import { crearPrestamoSchema, abonoSchema } from "../schemas/prestamo.schema.js";
import * as prestamoService from "../services/prestamo.service.js";

export async function getPrestamos(req, res, next) {
  try {
    const prestamos = await prestamoService.listar(req.usuarioId);
    res.status(200).json(prestamos);
  } catch (err) {
    next(err);
  }
}

export async function postPrestamo(req, res, next) {
  try {
    const datos = await crearPrestamoSchema.validateAsync(req.body);
    const prestamo = await prestamoService.crear(req.usuarioId, datos);
    res.status(201).json(prestamo);
  } catch (err) {
    next(err);
  }
}

export async function postAbono(req, res, next) {
  try {
    const { monto } = await abonoSchema.validateAsync(req.body);
    const prestamo = await prestamoService.abonar(req.usuarioId, req.params.id, monto);
    res.status(200).json(prestamo);
  } catch (err) {
    next(err);
  }
}
