-- Findrix — Schema de PostgreSQL (Fase 4)
-- Calcado 1:1 del contrato de API (Fase 3) y de los tipos de types/index.ts.
-- Regla: si un campo no lo manda ni lo lee el frontend, no está aquí.

CREATE EXTENSION IF NOT EXISTS pgcrypto; -- para gen_random_uuid()

CREATE TABLE usuario (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre      TEXT NOT NULL,
  correo      TEXT NOT NULL UNIQUE,
  contrasena  TEXT NOT NULL, -- hash de bcrypt, nunca texto plano
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Categoria: propia de cada usuario (no es catálogo global).
-- El campo "color" lo asigna el backend, nunca lo manda el cliente.
CREATE TABLE categoria (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  tipo        TEXT NOT NULL CHECK (tipo IN ('gasto', 'ingreso')),
  icono       TEXT NOT NULL,
  color       TEXT NOT NULL,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categoria_usuario ON categoria(usuario_id);

CREATE TABLE gasto (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id          UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  categoria_id        UUID NOT NULL REFERENCES categoria(id),
  monto               NUMERIC(14, 2) NOT NULL CHECK (monto > 0),
  descripcion         TEXT NOT NULL,
  fecha               DATE NOT NULL, -- la manda el cliente, el backend nunca calcula "hoy"
  es_pago_pendiente   BOOLEAN NOT NULL DEFAULT false,
  estado              TEXT NOT NULL CHECK (estado IN ('pendiente', 'pagado')),
  prioridad           TEXT NOT NULL CHECK (prioridad IN ('alta', 'media', 'baja')),
  fecha_vencimiento   DATE, -- obligatorio si es_pago_pendiente = true (se valida en Joi, no aquí)
  creado_en           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gasto_usuario ON gasto(usuario_id);
CREATE INDEX idx_gasto_fecha ON gasto(usuario_id, fecha DESC);

CREATE TABLE ingreso (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  categoria_id  UUID NOT NULL REFERENCES categoria(id),
  monto         NUMERIC(14, 2) NOT NULL CHECK (monto > 0),
  descripcion   TEXT NOT NULL,
  fecha         DATE NOT NULL,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ingreso_usuario ON ingreso(usuario_id);
CREATE INDEX idx_ingreso_fecha ON ingreso(usuario_id, fecha DESC);

CREATE TABLE meta_ahorro (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL,
  monto_actual  NUMERIC(14, 2) NOT NULL DEFAULT 0,
  monto_meta    NUMERIC(14, 2) NOT NULL CHECK (monto_meta > 0),
  fecha_meta    DATE, -- opcional
  icono         TEXT NOT NULL,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_meta_ahorro_usuario ON meta_ahorro(usuario_id);

-- Préstamo: progreso acumulado (montoActual/montoTotal), NO binario
-- pendiente/pagado — así lo implementó el frontend, el backend sigue ese
-- modelo, no el original de la Fase 1.
CREATE TABLE prestamo (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id    UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL,
  monto_actual  NUMERIC(14, 2) NOT NULL DEFAULT 0,
  monto_total   NUMERIC(14, 2) NOT NULL CHECK (monto_total > 0),
  tipo          TEXT NOT NULL CHECK (tipo IN ('presto', 'debo')),
  icono         TEXT NOT NULL,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_prestamo_usuario ON prestamo(usuario_id);
