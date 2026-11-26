-- Findrix — Esquema completo de PostgreSQL para la aplicación actualizada
-- Instalación limpia: ejecutar este archivo y luego las migraciones numeradas.
-- Las contraseñas siempre se almacenan como hash bcrypt; nunca en texto plano.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuario (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre              TEXT NOT NULL,
  correo              TEXT NOT NULL UNIQUE,
  contrasena          TEXT,
  google_sub          TEXT UNIQUE,
  correo_verificado   BOOLEAN NOT NULL DEFAULT false,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_usuario_metodo_acceso
    CHECK (contrasena IS NOT NULL OR google_sub IS NOT NULL)
);

-- Categorías propias de cada usuario.
CREATE TABLE IF NOT EXISTS categoria (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  tipo        TEXT NOT NULL CHECK (tipo IN ('gasto', 'ingreso')),
  icono       TEXT NOT NULL,
  color       TEXT NOT NULL,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categoria_usuario
  ON categoria(usuario_id);

CREATE TABLE IF NOT EXISTS gasto (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id          UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  categoria_id        UUID NOT NULL REFERENCES categoria(id),
  monto               NUMERIC(14, 2) NOT NULL CHECK (monto > 0),
  descripcion         TEXT NOT NULL,
  fecha               DATE NOT NULL,
  es_pago_pendiente   BOOLEAN NOT NULL DEFAULT false,
  estado              TEXT NOT NULL CHECK (estado IN ('pendiente', 'pagado')),
  prioridad           TEXT NOT NULL CHECK (prioridad IN ('alta', 'media', 'baja')),
  fecha_vencimiento   DATE,
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_gasto_vencimiento_coherente
    CHECK (
      (es_pago_pendiente = true AND fecha_vencimiento IS NOT NULL)
      OR
      (es_pago_pendiente = false AND fecha_vencimiento IS NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_gasto_usuario
  ON gasto(usuario_id);

CREATE INDEX IF NOT EXISTS idx_gasto_fecha
  ON gasto(usuario_id, fecha DESC);

CREATE INDEX IF NOT EXISTS idx_gasto_pendiente_vencimiento
  ON gasto(usuario_id, fecha_vencimiento)
  WHERE es_pago_pendiente = true AND estado = 'pendiente';

CREATE TABLE IF NOT EXISTS ingreso (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  categoria_id  UUID NOT NULL REFERENCES categoria(id),
  monto         NUMERIC(14, 2) NOT NULL CHECK (monto > 0),
  descripcion   TEXT NOT NULL,
  fecha         DATE NOT NULL,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ingreso_usuario
  ON ingreso(usuario_id);

CREATE INDEX IF NOT EXISTS idx_ingreso_fecha
  ON ingreso(usuario_id, fecha DESC);

CREATE TABLE IF NOT EXISTS meta_ahorro (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL,
  monto_actual  NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (monto_actual >= 0),
  monto_meta    NUMERIC(14, 2) NOT NULL CHECK (monto_meta > 0),
  fecha_meta    DATE,
  icono         TEXT NOT NULL,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_meta_monto_actual_no_supera_meta
    CHECK (monto_actual <= monto_meta)
);

CREATE INDEX IF NOT EXISTS idx_meta_ahorro_usuario
  ON meta_ahorro(usuario_id);

CREATE TABLE IF NOT EXISTS prestamo (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL,
  monto_actual  NUMERIC(14, 2) NOT NULL DEFAULT 0 CHECK (monto_actual >= 0),
  monto_total   NUMERIC(14, 2) NOT NULL CHECK (monto_total > 0),
  tipo          TEXT NOT NULL CHECK (tipo IN ('presto', 'debo')),
  icono         TEXT NOT NULL,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_prestamo_monto_actual_no_supera_total
    CHECK (monto_actual <= monto_total)
);

CREATE INDEX IF NOT EXISTS idx_prestamo_usuario
  ON prestamo(usuario_id);

CREATE INDEX IF NOT EXISTS idx_prestamo_progreso
  ON prestamo(usuario_id, monto_actual, monto_total);

-- Tokens de recuperación: solo se guarda token_hash, nunca el token original.
CREATE TABLE IF NOT EXISTS recuperacion_contrasena (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,
  expira_en   TIMESTAMPTZ NOT NULL,
  usado_en    TIMESTAMPTZ,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recuperacion_contrasena_usuario
  ON recuperacion_contrasena(usuario_id);

CREATE INDEX IF NOT EXISTS idx_recuperacion_contrasena_activo
  ON recuperacion_contrasena(token_hash, expira_en, usado_en);

-- Suscripciones Web Push por usuario y dispositivo.
CREATE TABLE IF NOT EXISTS notificacion_suscripcion (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id          UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  endpoint            TEXT NOT NULL UNIQUE,
  p256dh              TEXT NOT NULL,
  auth                TEXT NOT NULL,
  dias_anticipacion   INTEGER NOT NULL DEFAULT 1 CHECK (dias_anticipacion IN (0, 1, 2, 3, 7)),
  creada_en           TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizada_en      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notificacion_suscripcion_usuario
  ON notificacion_suscripcion(usuario_id);

COMMENT ON TABLE usuario IS 'Cuentas locales con bcrypt o cuentas vinculadas con Google';
COMMENT ON TABLE recuperacion_contrasena IS 'Tokens hash de un solo uso para restablecer contraseñas';
COMMENT ON TABLE notificacion_suscripcion IS 'Suscripciones Web Push por usuario y dispositivo';
