-- Migración aditiva: no elimina ni modifica datos existentes.
CREATE TABLE IF NOT EXISTS recuperacion_contrasena (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expira_en TIMESTAMPTZ NOT NULL,
  usado_en TIMESTAMPTZ,
  creado_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recuperacion_contrasena_usuario
  ON recuperacion_contrasena(usuario_id);

CREATE INDEX IF NOT EXISTS idx_recuperacion_contrasena_activo
  ON recuperacion_contrasena(token_hash, expira_en, usado_en);
