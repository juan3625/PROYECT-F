import cron from "node-cron";
import webpush from "web-push";
import * as notificacionRepository from "../repositories/notificacion.repository.js";

const DIAS_VALIDOS = new Set([0, 1, 2, 3, 7]);
let pushConfigurado = false;

function configurarPush() {
  if (pushConfigurado) return true;
  const { VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY } = process.env;
  if (!VAPID_SUBJECT || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return false;
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  pushConfigurado = true;
  return true;
}

export async function guardarSuscripcion(usuarioId, datos) {
  const diasAnticipacion = DIAS_VALIDOS.has(datos.diasAnticipacion) ? datos.diasAnticipacion : 1;
  await notificacionRepository.guardarSuscripcion({ usuarioId, ...datos, diasAnticipacion });
  return { mensaje: "Suscripción de notificaciones guardada." };
}

export async function eliminarSuscripcion(usuarioId, endpoint) {
  await notificacionRepository.eliminarSuscripcion({ usuarioId, endpoint });
  return { mensaje: "Suscripción de notificaciones eliminada." };
}

function textoGasto(gasto) {
  const fecha = new Date(`${gasto.fecha_vencimiento}T00:00:00`);
  const hoy = new Date();
  const dias = Math.round((fecha - new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())) / 86_400_000);
  const vencimiento = dias < 0
    ? `Vencido hace ${Math.abs(dias)} día(s)`
    : dias === 0 ? "Vence hoy" : dias === 1 ? "Vence mañana" : `Vence en ${dias} días`;
  return `${gasto.descripcion}: ${vencimiento} · $${Number(gasto.monto).toLocaleString("es-CO")}`;
}

function construirMensaje(pendientes) {
  const partes = [
    ...pendientes.gastos.map(textoGasto),
    ...pendientes.prestamos.map((prestamo) => `Préstamo pendiente: ${prestamo.nombre}`),
  ];
  if (partes.length === 0) return null;
  return partes.length === 1
    ? partes[0]
    : `${partes[0]} y ${partes.length - 1} pendiente(s) más.`;
}

export async function enviarRecordatoriosPush() {
  if (!configurarPush()) {
    console.warn("Web Push no iniciado: faltan VAPID_SUBJECT, VAPID_PUBLIC_KEY o VAPID_PRIVATE_KEY.");
    return;
  }

  const suscripciones = await notificacionRepository.listarSuscripciones();
  for (const suscripcion of suscripciones) {
    const pendientes = await notificacionRepository.buscarPendientes(
      suscripcion.usuario_id,
      suscripcion.dias_anticipacion
    );
    const body = construirMensaje(pendientes);
    if (!body) continue;

    try {
      await webpush.sendNotification(
        {
          endpoint: suscripcion.endpoint,
          keys: { p256dh: suscripcion.p256dh, auth: suscripcion.auth },
        },
        JSON.stringify({
          title: "Findrix: recordatorio financiero",
          body,
          url: "/",
        })
      );
    } catch (error) {
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await notificacionRepository.eliminarPorEndpoint(suscripcion.endpoint);
      } else {
        console.error("No se pudo enviar una notificación push:", error.message);
      }
    }
  }
}

export function iniciarProgramadorNotificaciones() {
  const expresion = process.env.NOTIFICATIONS_CRON_SCHEDULE ?? "0 9 * * *";
  const zonaHoraria = process.env.NOTIFICATIONS_TIMEZONE ?? "America/Bogota";
  if (!configurarPush()) {
    console.warn("Programador de notificaciones no iniciado: faltan las claves VAPID.");
    return null;
  }
  if (!cron.validate(expresion)) {
    console.error(`NOTIFICATIONS_CRON_SCHEDULE no es válida: ${expresion}`);
    return null;
  }
  const tarea = cron.schedule(expresion, () => {
    enviarRecordatoriosPush().catch((error) => console.error("Error en recordatorios push:", error));
  }, { timezone: zonaHoraria });
  console.log(`Programador de notificaciones configurado: ${expresion} (${zonaHoraria})`);
  return tarea;
}
