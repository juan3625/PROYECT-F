import { pool } from "../config/db.js";

export async function invalidarActivosDeUsuario(usuarioId) {
  await pool.query(
    `UPDATE recuperacion_contrasena
     SET usado_en = now()
     WHERE usuario_id = $1 AND usado_en IS NULL AND expira_en > now()`,
    [usuarioId]
  );
}

export async function crear({ usuarioId, tokenHash, expiraEn }) {
  await pool.query(
    `INSERT INTO recuperacion_contrasena (usuario_id, token_hash, expira_en)
     VALUES ($1, $2, $3)`,
    [usuarioId, tokenHash, expiraEn]
  );
}

export async function actualizarContrasenaConToken({ tokenHash, contrasenaHash }) {
  const cliente = await pool.connect();
  try {
    await cliente.query("BEGIN");
    const token = await cliente.query(
      `SELECT usuario_id
       FROM recuperacion_contrasena
       WHERE token_hash = $1 AND usado_en IS NULL AND expira_en > now()
       FOR UPDATE`,
      [tokenHash]
    );

    if (!token.rows[0]) {
      await cliente.query("ROLLBACK");
      return false;
    }

    const usuario = await cliente.query(
      `UPDATE usuario SET contrasena = $1 WHERE id = $2 RETURNING id`,
      [contrasenaHash, token.rows[0].usuario_id]
    );

    if (!usuario.rows[0]) {
      await cliente.query("ROLLBACK");
      return false;
    }

    await cliente.query(
      `UPDATE recuperacion_contrasena SET usado_en = now() WHERE token_hash = $1`,
      [tokenHash]
    );
    await cliente.query("COMMIT");
    return true;
  } catch (error) {
    await cliente.query("ROLLBACK");
    throw error;
  } finally {
    cliente.release();
  }
}
