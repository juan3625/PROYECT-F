import { pool } from "../config/db.js";

// Paleta fija que el backend rota — el cliente nunca elige el color.
// Coincide con los tokens que ya usa el frontend (primary, green, gold, ...).
const PALETA = {
  gasto: ["primary", "gold", "danger"],
  ingreso: ["green", "primary", "gold"],
};

async function siguienteColor(usuarioId, tipo) {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS total FROM categoria WHERE usuario_id = $1 AND tipo = $2",
    [usuarioId, tipo]
  );
  const paleta = PALETA[tipo];
  return paleta[rows[0].total % paleta.length];
}

export async function listar(usuarioId) {
  const { rows } = await pool.query(
    `SELECT id, nombre, tipo, icono, color
     FROM categoria
     WHERE usuario_id = $1
     ORDER BY creado_en ASC`,
    [usuarioId]
  );
  return rows;
}

export async function crear(usuarioId, { nombre, tipo, icono }) {
  const color = await siguienteColor(usuarioId, tipo);

  const { rows } = await pool.query(
    `INSERT INTO categoria (usuario_id, nombre, tipo, icono, color)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, nombre, tipo, icono, color`,
    [usuarioId, nombre, tipo, icono, color]
  );
  return rows[0];
}
