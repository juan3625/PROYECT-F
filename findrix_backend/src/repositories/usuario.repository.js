import { pool } from "../config/db.js";

const COLUMNAS_USUARIO = "id, nombre, correo, contrasena, google_sub, correo_verificado";

function aCamel(row) {
  return {
    id: row.id,
    nombre: row.nombre,
    correo: row.correo,
    contrasena: row.contrasena,
    googleSub: row.google_sub,
    correoVerificado: row.correo_verificado,
  };
}

export async function buscarPorCorreo(correo) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS_USUARIO} FROM usuario WHERE correo = $1`,
    [correo]
  );
  return rows[0] ? aCamel(rows[0]) : null;
}

export async function crear({ nombre, correo, contrasena }) {
  const { rows } = await pool.query(
    `INSERT INTO usuario (nombre, correo, contrasena)
     VALUES ($1, $2, $3)
     RETURNING ${COLUMNAS_USUARIO}`,
    [nombre, correo, contrasena]
  );
  return aCamel(rows[0]);
}

export async function buscarPorGoogleSub(googleSub) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS_USUARIO} FROM usuario WHERE google_sub = $1`,
    [googleSub]
  );
  return rows[0] ? aCamel(rows[0]) : null;
}

export async function crearConGoogle({ nombre, correo, googleSub }) {
  const { rows } = await pool.query(
    `INSERT INTO usuario (nombre, correo, contrasena, google_sub, correo_verificado)
     VALUES ($1, $2, NULL, $3, true)
     RETURNING ${COLUMNAS_USUARIO}`,
    [nombre, correo, googleSub]
  );
  return aCamel(rows[0]);
}
