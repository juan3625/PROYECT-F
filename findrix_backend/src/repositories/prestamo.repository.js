import { pool } from "../config/db.js";

const COLUMNAS_PRESTAMO = "id, nombre, monto_actual, monto_total, tipo, icono";

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
    `SELECT ${COLUMNAS_PRESTAMO}
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
     RETURNING ${COLUMNAS_PRESTAMO}`,
    [usuarioId, datos.nombre, datos.montoTotal, datos.tipo, datos.icono]
  );
  return aCamel(rows[0]);
}

export async function abonar(usuarioId, prestamoId, monto) {
  const { rows } = await pool.query(
    `UPDATE prestamo
     SET monto_actual = LEAST(monto_actual + $3, monto_total)
     WHERE id = $1 AND usuario_id = $2
     RETURNING ${COLUMNAS_PRESTAMO}`,
    [prestamoId, usuarioId, monto]
  );
  return rows[0] ? aCamel(rows[0]) : null;
}

export async function actualizar(usuarioId, prestamoId, datos) {
  const { rows } = await pool.query(
    `UPDATE prestamo
     SET nombre = $3, monto_total = $4, tipo = $5, icono = $6,
         monto_actual = LEAST(monto_actual, $4)
     WHERE id = $1 AND usuario_id = $2
     RETURNING ${COLUMNAS_PRESTAMO}`,
    [prestamoId, usuarioId, datos.nombre, datos.montoTotal, datos.tipo, datos.icono]
  );
  return rows[0] ? aCamel(rows[0]) : null;
}
