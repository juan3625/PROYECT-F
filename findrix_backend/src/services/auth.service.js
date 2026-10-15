import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { ErrorApi } from "../utils/respuestas.js";

const RONDAS_BCRYPT = 12;
const CONTRASENA_PLANA = process.env.GUARDAR_CONTRASENA_PLANA === "true";

function firmarToken(usuario) {
  return jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  });
}

function usuarioPublico(row) {
  return { id: row.id, nombre: row.nombre, correo: row.correo };
}

export async function registrar({ nombre, correo, contrasena }) {
  const existente = await pool.query("SELECT id FROM usuario WHERE correo = $1", [correo]);
  if (existente.rowCount > 0) {
    throw new ErrorApi(409, "Ya existe una cuenta con ese correo.");
  }

  const hash = CONTRASENA_PLANA ? contrasena : await bcrypt.hash(contrasena, RONDAS_BCRYPT);

  const { rows } = await pool.query(
    `INSERT INTO usuario (nombre, correo, contrasena)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, correo`,
    [nombre, correo, hash]
  );

  const usuario = usuarioPublico(rows[0]);
  return { usuario, token: firmarToken(usuario) };
}

export async function login({ correo, contrasena }) {
  const { rows } = await pool.query(
    "SELECT id, nombre, correo, contrasena FROM usuario WHERE correo = $1",
    [correo]
  );
  const encontrado = rows[0];

  // Mismo mensaje genérico si el correo no existe o si la contraseña no
  // coincide — no revelamos cuál de las dos falló.
  if (!encontrado) {
    throw new ErrorApi(401, "Correo o contraseña incorrectos.");
  }

  // bcrypt.compare, nunca === — defecto crítico ya detectado antes.
  const coincide = CONTRASENA_PLANA
    ? contrasena === encontrado.contrasena
    : await bcrypt.compare(contrasena, encontrado.contrasena);
      if (!coincide) {
    throw new ErrorApi(401, "Correo o contraseña incorrectos.");
  }

  const usuario = usuarioPublico(encontrado);
  return { usuario, token: firmarToken(usuario) };
}
