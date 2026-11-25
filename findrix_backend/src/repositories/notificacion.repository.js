import { pool } from "../config/db.js";

export async function guardarSuscripcion({ usuarioId, endpoint, p256dh, auth, diasAnticipacion }) {
  await pool.query(
    `INSERT INTO notificacion_suscripcion
       (usuario_id, endpoint, p256dh, auth, dias_anticipacion, actualizada_en)
     VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (endpoint) DO UPDATE SET
       usuario_id = EXCLUDED.usuario_id,
       p256dh = EXCLUDED.p256dh,
       auth = EXCLUDED.auth,
       dias_anticipacion = EXCLUDED.dias_anticipacion,
       actualizada_en = now()`,
    [usuarioId, endpoint, p256dh, auth, diasAnticipacion]
  );
}

export async function eliminarSuscripcion({ usuarioId, endpoint }) {
  await pool.query(
    `DELETE FROM notificacion_suscripcion WHERE usuario_id = $1 AND endpoint = $2`,
    [usuarioId, endpoint]
  );
}

export async function eliminarPorEndpoint(endpoint) {
  await pool.query(`DELETE FROM notificacion_suscripcion WHERE endpoint = $1`, [endpoint]);
}

export async function listarSuscripciones() {
  const { rows } = await pool.query(
    `SELECT id, usuario_id, endpoint, p256dh, auth, dias_anticipacion
     FROM notificacion_suscripcion`
  );
  return rows;
}

export async function buscarPendientes(usuarioId, diasAnticipacion) {
  const [gastos, prestamos] = await Promise.all([
    pool.query(
      `SELECT id, descripcion, monto, fecha_vencimiento
       FROM gasto
       WHERE usuario_id = $1
         AND es_pago_pendiente = true
         AND estado = 'pendiente'
         AND fecha_vencimiento IS NOT NULL
         AND fecha_vencimiento <= CURRENT_DATE + ($2 * INTERVAL '1 day')
       ORDER BY fecha_vencimiento ASC`,
      [usuarioId, diasAnticipacion]
    ),
    pool.query(
      `SELECT id, nombre, monto_actual, monto_total
       FROM prestamo
       WHERE usuario_id = $1 AND monto_actual < monto_total
       ORDER BY creado_en ASC`,
      [usuarioId]
    ),
  ]);

  return { gastos: gastos.rows, prestamos: prestamos.rows };
}
