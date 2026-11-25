-- Migración aditiva para Web Push. No elimina datos existentes.
CREATE TABLE IF NOT EXISTS notificacion_suscripcion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  dias_anticipacion INTEGER NOT NULL DEFAULT 1 CHECK (dias_anticipacion IN (0, 1, 2, 3, 7)),
  creada_en TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizada_en TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notificacion_suscripcion_usuario
  ON notificacion_suscripcion(usuario_id);
