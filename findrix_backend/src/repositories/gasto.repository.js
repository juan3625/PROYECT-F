import { pool } from "../config/db.js";

const COLUMNAS_GASTO =
  "id, monto, descripcion, categoria_id, fecha, es_pago_pendiente, estado, prioridad, fecha_vencimiento";

function aCamel(row) {
  return {
    id: row.id,
    monto: Number(row.monto),
    descripcion: row.descripcion,
    categoriaId: row.categoria_id,
    fecha: row.fecha,
    esPagoPendiente: row.es_pago_pendiente,
    estado: row.estado,
    prioridad: row.prioridad,
    fechaVencimiento: row.fecha_vencimiento,
  };
}

export async function listar(usuarioId) {
  const { rows } = await pool.query(
    `SELECT ${COLUMNAS_GASTO}
     FROM gasto
     WHERE usuario_id = $1
     ORDER BY fecha DESC, creado_en DESC`,
    [usuarioId]
  );
  return rows.map(aCamel);
}

export async function crear(usuarioId, datos) {
  const { rows } = await pool.query(
    `INSERT INTO gasto
       (usuario_id, categoria_id, monto, descripcion, fecha, es_pago_pendiente, estado, prioridad, fecha_vencimiento)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${COLUMNAS_GASTO}`,
    [
      usuarioId,
      datos.categoriaId,
      datos.monto,
      datos.descripcion,
      datos.fecha,
      datos.esPagoPendiente,
      datos.estado,
      datos.prioridad,
      datos.esPagoPendiente ? datos.fechaVencimiento : null,
    ]
  );
  return aCamel(rows[0]);
}

export async function marcarPagado(usuarioId, gastoId) {
  const { rows } = await pool.query(
    `UPDATE gasto
     SET estado = 'pagado', es_pago_pendiente = false
     WHERE id = $1 AND usuario_id = $2
     RETURNING ${COLUMNAS_GASTO}`,
    [gastoId, usuarioId]
  );
  return rows[0] ? aCamel(rows[0]) : null;
}

export async function actualizar(usuarioId, gastoId, datos) {
  const { rows } = await pool.query(
    `UPDATE gasto
     SET categoria_id = $3, monto = $4, descripcion = $5, fecha = $6,
         es_pago_pendiente = $7, estado = $8, prioridad = $9, fecha_vencimiento = $10
     WHERE id = $1 AND usuario_id = $2
     RETURNING ${COLUMNAS_GASTO}`,
    [
      gastoId,
      usuarioId,
      datos.categoriaId,
      datos.monto,
      datos.descripcion,
      datos.fecha,
      datos.esPagoPendiente,
      datos.estado,
      datos.prioridad,
      datos.esPagoPendiente ? datos.fechaVencimiento : null,
    ]
  );
  return rows[0] ? aCamel(rows[0]) : null;
}
