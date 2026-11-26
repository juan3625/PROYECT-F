import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as usuarioRepository from "../repositories/usuario.repository.js";
import { ErrorApi } from "../utils/respuestas.js";
import { verificarIdToken } from "./googleAuth.service.js";

const RONDAS_BCRYPT = 12;

function firmarToken(usuario) {
  return jwt.sign({ sub: usuario.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  });
}

function usuarioPublico(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo };
}

export async function registrar({ nombre, correo, contrasena }) {
  const existente = await usuarioRepository.buscarPorCorreo(correo);
  if (existente) {
    throw new ErrorApi(409, "Ya existe una cuenta con ese correo.");
  }

  const hash = await bcrypt.hash(contrasena, RONDAS_BCRYPT);
  const usuarioCreado = await usuarioRepository.crear({
    nombre,
    correo,
    contrasena: hash,
  });
  const usuario = usuarioPublico(usuarioCreado);

  return { usuario, token: firmarToken(usuario) };
}

export async function login({ correo, contrasena }) {
  const encontrado = await usuarioRepository.buscarPorCorreo(correo);
  if (!encontrado || !encontrado.contrasena) {
    throw new ErrorApi(401, "Correo o contraseña incorrectos.");
  }

  const coincide = await bcrypt.compare(contrasena, encontrado.contrasena);
  if (!coincide) {
    throw new ErrorApi(401, "Correo o contraseña incorrectos.");
  }

  const usuario = usuarioPublico(encontrado);
  return { usuario, token: firmarToken(usuario) };
}

export async function loginConGoogle({ idToken }) {
  const identidad = await verificarIdToken(idToken);
  const vinculado = await usuarioRepository.buscarPorGoogleSub(identidad.googleSub);

  if (vinculado) {
    const usuario = usuarioPublico(vinculado);
    return { usuario, token: firmarToken(usuario) };
  }

  const existente = await usuarioRepository.buscarPorCorreo(identidad.correo);
  if (existente) {
    throw new ErrorApi(
      409,
      "Ya existe una cuenta con ese correo. Inicia sesión con tu contraseña para vincular Google de forma segura."
    );
  }

  try {
    const creado = await usuarioRepository.crearConGoogle(identidad);
    const usuario = usuarioPublico(creado);
    return { usuario, token: firmarToken(usuario) };
  } catch (error) {
    if (error?.code === "23505") {
      throw new ErrorApi(409, "No se pudo crear la cuenta de Google porque el correo ya está registrado.");
    }
    throw error;
  }
}
