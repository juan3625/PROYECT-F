import nodemailer from "nodemailer";

function smtpConfigurado() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

function crearTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export async function enviarEnlaceRestablecimiento({ correo, enlace }) {
  if (!smtpConfigurado()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[Findrix] Enlace de recuperación para ${correo}: ${enlace}`);
      return;
    }
    throw new Error("SMTP no está configurado.");
  }

  await crearTransporter().sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: correo,
    subject: "Restablece tu contraseña de Findrix",
    text: `Abre este enlace para crear una nueva contraseña: ${enlace}\n\nEl enlace expira en ${process.env.PASSWORD_RESET_TOKEN_MINUTES ?? 30} minutos y solo puede usarse una vez.`,
    html: `<p>Solicitaste restablecer tu contraseña de Findrix.</p><p><a href="${enlace}">Crear nueva contraseña</a></p><p>El enlace expira en ${process.env.PASSWORD_RESET_TOKEN_MINUTES ?? 30} minutos y solo puede usarse una vez.</p>`,
  });
}
