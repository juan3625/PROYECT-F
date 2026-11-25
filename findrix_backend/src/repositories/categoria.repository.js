import { pool } from "../config/db.js";

const COLUMNAS_CATEGORIA = "id, nombre, tipo, icono, color";

export async function contarPorTipo(usuarioId, tipo) {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS total FROM categoria WHERE usuario_id = $1 AND tipo = $2",
    [usuarioId, tipo]
  );
  return rows[0].total;
}

export async function existeParaUsuario(categoriaId, usuarioId) {
  const { rowCount } = await pool.query(
    "SELECT id FROM categoria WHERE id = $1 AND usuario_id = $2",
    [categoriaId, usuarioId]
  );
  return rowCount > 0;
}

export async function listar(usuarioId) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS_CATEGORIA}
     FROM categoria
     WHERE usuario_id = $1
     ORDER BY creado_en ASC`,
    [usuarioId]
  );
  return rows;
}

export async function crear(usuarioId, { nombre, tipo, icono, color }) {
  const { rows } = await pool.query(
    `INSERT INTO categoria (usuario_id, nombre, tipo, icono, color)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${COLUMNAS_CATEGORIA}`,
    [usuarioId, nombre, tipo, icono, color]
  );
  return rows[0];
}

export async function actualizar(usuarioId, categoriaId, { nombre, icono }) {
  const { rows } = await pool.query(
    `UPDATE categoria
     SET nombre = $3, icono = $4
     WHERE id = $1 AND usuario_id = $2
     RETURNING ${COLUMNAS_CATEGORIA}`,
    [categoriaId, usuarioId, nombre, icono]
  );
  return rows[0] ?? null;
}
