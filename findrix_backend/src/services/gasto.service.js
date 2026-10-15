import { pool } from "../config/db.js";
import { ErrorApi } from "../utils/respuestas.js";

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
    `SELECT id, monto, descripcion, categoria_id, fecha, es_pago_pendiente, estado, prioridad, fecha_vencimiento
     FROM gasto
     WHERE usuario_id = $1
     ORDER BY fecha DESC, creado_en DESC`,
    [usuarioId]
  );
  return rows.map(aCamel);
}

export async function crear(usuarioId, datos) {
  const categoria = await pool.query(
    "SELECT id FROM categoria WHERE id = $1 AND usuario_id = $2",
    [datos.categoriaId, usuarioId]
  );
  if (categoria.rowCount === 0) {
    throw new ErrorApi(400, "La categoría indicada no existe.");
  }

  const estado = datos.esPagoPendiente ? "pendiente" : "pagado";

  const { rows } = await pool.query(
    `INSERT INTO gasto
       (usuario_id, categoria_id, monto, descripcion, fecha, es_pago_pendiente, estado, prioridad, fecha_vencimiento)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id, monto, descripcion, categoria_id, fecha, es_pago_pendiente, estado, prioridad, fecha_vencimiento`,
    [
      usuarioId,
      datos.categoriaId,
      datos.monto,
      datos.descripcion,
      datos.fecha,
      datos.esPagoPendiente,
      estado,
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
     RETURNING id, monto, descripcion, categoria_id, fecha, es_pago_pendiente, estado, prioridad, fecha_vencimiento`,
    [gastoId, usuarioId]
  );
  if (rows.length === 0) {
    throw new ErrorApi(404, "No se encontró ese gasto.");
  }
  return aCamel(rows[0]);
}
