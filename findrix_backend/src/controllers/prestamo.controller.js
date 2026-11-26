import { crearPrestamoSchema, abonoSchema } from "../schemas/prestamo.schema.js";
import * as prestamoService from "../services/prestamo.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPrestamos = asyncHandler(async (req, res) => {
  const prestamos = await prestamoService.listar(req.usuarioId);
  res.status(200).json(prestamos);
});

export const postPrestamo = asyncHandler(async (req, res) => {
  const datos = await crearPrestamoSchema.validateAsync(req.body);
  const prestamo = await prestamoService.crear(req.usuarioId, datos);
  res.status(201).json(prestamo);
});

export const postAbono = asyncHandler(async (req, res) => {
  const { monto } = await abonoSchema.validateAsync(req.body);
  const prestamo = await prestamoService.abonar(req.usuarioId, req.params.id, monto);
  res.status(200).json(prestamo);
});

export const putPrestamo = asyncHandler(async (req, res) => {
  const datos = await crearPrestamoSchema.validateAsync(req.body);
  const prestamo = await prestamoService.actualizar(req.usuarioId, req.params.id, datos);
  res.status(200).json(prestamo);
});
