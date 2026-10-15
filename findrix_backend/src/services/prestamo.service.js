import { pool } from "../config/db.js";
import { ErrorApi } from "../utils/respuestas.js";

function aCamel(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    montoActual: Number(row.monto_actual),
    montoTotal: Number(row.monto_total),
    tipo: row.tipo,
    icono: row.icono,
  };
}

export async function listar(usuarioId) {
  const { rows } = await pool.query(
    `SELECT id, nombre, monto_actual, monto_total, tipo, icono
     FROM prestamo
     WHERE usuario_id = $1
     ORDER BY creado_en ASC`,
    [usuarioId]
  );
  return rows.map(aCamel);
}

export async function crear(usuarioId, datos) {
  const { rows } = await pool.query(
    `INSERT INTO prestamo (usuario_id, nombre, monto_total, tipo, icono)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nombre, monto_actual, monto_total, tipo, icono`,
    [usuarioId, datos.nombre, datos.montoTotal, datos.tipo, datos.icono]
  );
  return aCamel(rows[0]);
}

// Mismo tope que las metas de ahorro: LEAST(monto_actual + abono, monto_total).
export async function abonar(usuarioId, prestamoId, monto) {
  const { rows } = await pool.query(
    `UPDATE prestamo
     SET monto_actual = LEAST(monto_actual + $3, monto_total)
     WHERE id = $1 AND usuario_id = $2
     RETURNING id, nombre, monto_actual, monto_total, tipo, icono`,
    [prestamoId, usuarioId, monto]
  );
  if (rows.length === 0) {
    throw new ErrorApi(404, "No se encontró ese préstamo.");
  }
  return aCamel(rows[0]);
}
