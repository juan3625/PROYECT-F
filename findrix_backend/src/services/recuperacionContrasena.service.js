import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import * as usuarioRepository from "../repositories/usuario.repository.js";
import * as recuperacionRepository from "../repositories/recuperacionContrasena.repository.js";
import { enviarEnlaceRestablecimiento } from "./correo.service.js";
import { ErrorApi } from "../utils/respuestas.js";

const RONDAS_BCRYPT = 12;
const MENSAJE_SOLICITUD = "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.";

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export async function solicitarRecuperacion({ correo }) {
  const usuario = await usuarioRepository.buscarPorCorreo(correo);

  if (usuario) {
    await recuperacionRepository.invalidarActivosDeUsuario(usuario.id);
    const token = randomBytes(32).toString("hex");
    const minutos = Number(process.env.PASSWORD_RESET_TOKEN_MINUTES ?? 30) || 30;
    const expiraEn = new Date(Date.now() + minutos * 60 * 1000);
    await recuperacionRepository.crear({
      usuarioId: usuario.id,
      tokenHash: hashToken(token),
      expiraEn,
    });

    const base = process.env.FRONTEND_URL ?? "http://localhost:5173";
    const enlace = `${base.replace(/\/$/, "")}/restablecer-contrasena?token=${token}`;
    try {
      await enviarEnlaceRestablecimiento({ correo: usuario.correo, enlace });
    } catch (error) {
      console.error("No se pudo enviar el correo de recuperación:", error);
    }
  }

  return { mensaje: MENSAJE_SOLICITUD };
}

export async function restablecerContrasena({ token, contrasena }) {
  const contrasenaHash = await bcrypt.hash(contrasena, RONDAS_BCRYPT);
  const actualizado = await recuperacionRepository.actualizarContrasenaConToken({
    tokenHash: hashToken(token),
    contrasenaHash,
  });

  if (!actualizado) {
    throw new ErrorApi(400, "El enlace no es válido, ya fue utilizado o expiró.");
  }

  return { mensaje: "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión." };
}
