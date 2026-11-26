import { pool } from "../config/db.js";

const COLUMNAS_META_AHORRO = "id, nombre, monto_actual, monto_meta, fecha_meta, icono";

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
    `SELECT ${COLUMNAS_META_AHORRO}
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
     RETURNING ${COLUMNAS_META_AHORRO}`,
    [usuarioId, datos.nombre, datos.montoMeta, datos.fechaMeta ?? null, datos.icono]
  );
  return aCamel(rows[0]);
}

export async function abonar(usuarioId, metaId, monto) {
  const { rows } = await pool.query(
    `UPDATE meta_ahorro
     SET monto_actual = LEAST(monto_actual + $3, monto_meta)
     WHERE id = $1 AND usuario_id = $2
     RETURNING ${COLUMNAS_META_AHORRO}`,
    [metaId, usuarioId, monto]
  );
  return rows[0] ? aCamel(rows[0]) : null;
}

export async function actualizar(usuarioId, metaId, datos) {
  const { rows } = await pool.query(
    `UPDATE meta_ahorro
     SET nombre = $3, monto_meta = $4, fecha_meta = $5, icono = $6,
         monto_actual = LEAST(monto_actual, $4)
     WHERE id = $1 AND usuario_id = $2
     RETURNING ${COLUMNAS_META_AHORRO}`,
    [metaId, usuarioId, datos.nombre, datos.montoMeta, datos.fechaMeta ?? null, datos.icono]
  );
  return rows[0] ? aCamel(rows[0]) : null;
}
