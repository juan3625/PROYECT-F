-- Migración aditiva para cuentas Google. No elimina ni modifica credenciales existentes.
ALTER TABLE usuario
  ALTER COLUMN contrasena DROP NOT NULL;

ALTER TABLE usuario
  ADD COLUMN IF NOT EXISTS google_sub TEXT,
  ADD COLUMN IF NOT EXISTS correo_verificado BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS uq_usuario_google_sub
  ON usuario(google_sub)
  WHERE google_sub IS NOT NULL;
