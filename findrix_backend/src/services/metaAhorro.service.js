import { pool } from "../config/db.js";
import { ErrorApi } from "../utils/respuestas.js";

function aCamel(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    montoActual: Number(row.monto_actual),
    montoMeta: Number(row.monto_meta),
    fechaMeta: row.fecha_meta,
    icono: row.icono,
  };
}

export async function listar(usuarioId) {
  const { rows } = await pool.query(
    `SELECT id, nombre, monto_actual, monto_meta, fecha_meta, icono
     FROM meta_ahorro
     WHERE usuario_id = $1
     ORDER BY creado_en ASC`,
    [usuarioId]
  );
  return rows.map(aCamel);
}

export async function crear(usuarioId, datos) {
  const { rows } = await pool.query(
    `INSERT INTO meta_ahorro (usuario_id, nombre, monto_meta, fecha_meta, icono)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nombre, monto_actual, monto_meta, fecha_meta, icono`,
    [usuarioId, datos.nombre, datos.montoMeta, datos.fechaMeta ?? null, datos.icono]
  );
  return aCamel(rows[0]);
}

// Tope: si monto_actual + monto >= monto_meta, se deja en monto_meta —
// igual que hace hoy abonarMeta() en el frontend (Math.min).
export async function abonar(usuarioId, metaId, monto) {
  const { rows } = await pool.query(
    `UPDATE meta_ahorro
     SET monto_actual = LEAST(monto_actual + $3, monto_meta)
     WHERE id = $1 AND usuario_id = $2
     RETURNING id, nombre, monto_actual, monto_meta, fecha_meta, icono`,
    [metaId, usuarioId, monto]
  );
  if (rows.length === 0) {
    throw new ErrorApi(404, "No se encontró esa meta de ahorro.");
  }
  return aCamel(rows[0]);
}
