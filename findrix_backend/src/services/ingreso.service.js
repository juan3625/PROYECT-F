import { pool } from "../config/db.js";
import { ErrorApi } from "../utils/respuestas.js";

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
    `SELECT id, monto, descripcion, categoria_id, fecha
     FROM ingreso
     WHERE usuario_id = $1
     ORDER BY fecha DESC, creado_en DESC`,
    [usuarioId]
  );
  return rows.map(aCamel);
}

export async function crear(usuarioId, datos) {
  const categoria = await pool.query(
    "SELECT id FROM categoria WHERE id = $1 AND usuario_id = $2",
    [datos.categoriaId, usuarioId]
  );
  if (categoria.rowCount === 0) {
    throw new ErrorApi(400, "La categoría indicada no existe.");
  }

  const { rows } = await pool.query(
    `INSERT INTO ingreso (usuario_id, categoria_id, monto, descripcion, fecha)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, monto, descripcion, categoria_id, fecha`,
    [usuarioId, datos.categoriaId, datos.monto, datos.descripcion, datos.fecha]
  );
  return aCamel(rows[0]);
}
