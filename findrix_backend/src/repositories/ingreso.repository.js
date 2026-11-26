import { pool } from "../config/db.js";

const COLUMNAS_INGRESO = "id, monto, descripcion, categoria_id, fecha";

function aCamel(row) {
  return {
    id: row.id,
    monto: Number(row.monto),
    descripcion: row.descripcion,
    categoriaId: row.categoria_id,
    fecha: row.fecha,
  };
}

export async function listar(usuarioId) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS_INGRESO}
     FROM ingreso
     WHERE usuario_id = $1
     ORDER BY fecha DESC, creado_en DESC`,
    [usuarioId]
  );
  return rows.map(aCamel);
}

export async function crear(usuarioId, datos) {
  const { rows } = await pool.query(
    `INSERT INTO ingreso (usuario_id, categoria_id, monto, descripcion, fecha)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNAS_INGRESO}`,
    [usuarioId, datos.categoriaId, datos.monto, datos.descripcion, datos.fecha]
  );
  return aCamel(rows[0]);
}

export async function actualizar(usuarioId, ingresoId, datos) {
  const { rows } = await pool.query(
    `UPDATE ingreso
     SET categoria_id = $3, monto = $4, descripcion = $5, fecha = $6
     WHERE id = $1 AND usuario_id = $2
     RETURNING ${COLUMNAS_INGRESO}`,
    [ingresoId, usuarioId, datos.categoriaId, datos.monto, datos.descripcion, datos.fecha]
  );
  return rows[0] ? aCamel(rows[0]) : null;
}
