-- Migración aditiva para instalaciones existentes.
-- No elimina tablas ni datos. Las restricciones se agregan como NOT VALID para
-- no bloquear una base que ya tenga registros históricos; se validan después
-- de corregir cualquier fila reportada.

BEGIN;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_usuario_metodo_acceso'
      AND conrelid = 'usuario'::regclass
  ) THEN
    ALTER TABLE usuario
      ADD CONSTRAINT chk_usuario_metodo_acceso
      CHECK (contrasena IS NOT NULL OR google_sub IS NOT NULL)
      NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_gasto_vencimiento_coherente'
      AND conrelid = 'gasto'::regclass
  ) THEN
    ALTER TABLE gasto
      ADD CONSTRAINT chk_gasto_vencimiento_coherente
      CHECK (
        (es_pago_pendiente = true AND fecha_vencimiento IS NOT NULL)
        OR
        (es_pago_pendiente = false AND fecha_vencimiento IS NULL)
      ) NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_meta_monto_actual_no_supera_meta'
      AND conrelid = 'meta_ahorro'::regclass
  ) THEN
    ALTER TABLE meta_ahorro
      ADD CONSTRAINT chk_meta_monto_actual_no_supera_meta
      CHECK (monto_actual >= 0 AND monto_actual <= monto_meta)
      NOT VALID;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_prestamo_monto_actual_no_supera_total'
      AND conrelid = 'prestamo'::regclass
  ) THEN
    ALTER TABLE prestamo
      ADD CONSTRAINT chk_prestamo_monto_actual_no_supera_total
      CHECK (monto_actual >= 0 AND monto_actual <= monto_total)
      NOT VALID;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_gasto_pendiente_vencimiento
  ON gasto(usuario_id, fecha_vencimiento)
  WHERE es_pago_pendiente = true AND estado = 'pendiente';

CREATE INDEX IF NOT EXISTS idx_prestamo_progreso
  ON prestamo(usuario_id, monto_actual, monto_total);

COMMIT;

-- Para revisar filas históricas que no cumplan las reglas antes de validar:
-- SELECT id FROM usuario WHERE contrasena IS NULL AND google_sub IS NULL;
-- SELECT id FROM gasto
-- WHERE NOT ((es_pago_pendiente = true AND fecha_vencimiento IS NOT NULL)
--       OR (es_pago_pendiente = false AND fecha_vencimiento IS NULL));
--
-- SELECT id FROM meta_ahorro WHERE monto_actual < 0 OR monto_actual > monto_meta;
-- SELECT id FROM prestamo WHERE monto_actual < 0 OR monto_actual > monto_total;
--
-- Cuando las consultas anteriores no devuelvan filas, validar manualmente:
-- ALTER TABLE usuario VALIDATE CONSTRAINT chk_usuario_metodo_acceso;
-- ALTER TABLE gasto VALIDATE CONSTRAINT chk_gasto_vencimiento_coherente;
-- ALTER TABLE meta_ahorro VALIDATE CONSTRAINT chk_meta_monto_actual_no_supera_meta;
-- ALTER TABLE prestamo VALIDATE CONSTRAINT chk_prestamo_monto_actual_no_supera_total;
