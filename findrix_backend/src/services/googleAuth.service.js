import { OAuth2Client } from "google-auth-library";
import { ErrorApi } from "../utils/respuestas.js";

let clienteGoogle;

function obtenerClienteGoogle() {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new ErrorApi(503, "La autenticación con Google no está configurada en el servidor.");
  }
  clienteGoogle ??= new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  return clienteGoogle;
}

export async function verificarIdToken(idToken) {
  try {
    const ticket = await obtenerClienteGoogle().verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email || payload.email_verified !== true) {
      throw new ErrorApi(401, "La cuenta de Google no tiene un correo verificado.");
    }

    return {
      googleSub: payload.sub,
      correo: payload.email.toLowerCase(),
      nombre: payload.name?.trim() || payload.email.split("@")[0],
    };
  } catch (error) {
    if (error instanceof ErrorApi) throw error;
    throw new ErrorApi(401, "El token de Google no es válido o expiró.");
  }
}
