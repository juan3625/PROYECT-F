# Base de datos de Findrix

Este directorio contiene el esquema y las migraciones de PostgreSQL para la aplicación actualizada.

## Tablas principales

- `usuario`: cuentas locales con bcrypt o cuentas vinculadas con Google.
- `categoria`: categorías de gastos e ingresos por usuario.
- `gasto`: movimientos de gasto, incluyendo pagos pendientes, prioridad y vencimiento.
- `ingreso`: movimientos de ingreso.
- `meta_ahorro`: metas, monto acumulado, monto objetivo y fecha opcional.
- `prestamo`: préstamos que el usuario prestó o debe, con progreso de abonos.
- `recuperacion_contrasena`: hashes de tokens de recuperación de un solo uso.
- `notificacion_suscripcion`: suscripciones Web Push por usuario y dispositivo.

Las gráficas de Inicio no requieren tablas adicionales: se calculan con gastos, ingresos, metas y préstamos que ya carga el backend.

## Instalación limpia

Crear la base de datos `findrix` y ejecutar, desde la raíz del repositorio:

```bash
psql -U postgres -d findrix -f findrix_backend/sql/schema.sql
psql -U postgres -d findrix -f findrix_backend/sql/migrations/001_recuperacion_contrasena.sql
psql -U postgres -d findrix -f findrix_backend/sql/migrations/002_auth_google.sql
psql -U postgres -d findrix -f findrix_backend/sql/migrations/003_notificacion_suscripcion.sql
psql -U postgres -d findrix -f findrix_backend/sql/migrations/004_integridad_app_actualizada.sql
```

El esquema base ya incluye las tablas de las migraciones para que una instalación nueva quede completa. Las migraciones `001` a `003` se mantienen por compatibilidad con instalaciones anteriores; son aditivas e idempotentes en las operaciones que crean objetos.

## Actualizar una base existente

No ejecutes `schema.sql` sobre una base existente como mecanismo de actualización. En una base que ya tiene datos, ejecuta solo las migraciones que aún no se hayan aplicado y, finalmente:

```bash
psql -U postgres -d findrix -f findrix_backend/sql/migrations/004_integridad_app_actualizada.sql
```

La migración 004 no elimina datos. Sus restricciones nuevas se agregan como `NOT VALID` para no bloquear registros históricos. Revisa las consultas comentadas al final del archivo, corrige filas antiguas si aparecen y luego ejecuta los `VALIDATE CONSTRAINT` indicados.

## Preferencias de la interfaz

El tema, el color de acento, el tamaño de texto y la anticipación de recordatorios dentro de la aplicación se guardan actualmente en `localStorage` del dispositivo. No se crea una tabla de preferencias porque el frontend actual no las sincroniza con el servidor.

## Seguridad

- Nunca guardar contraseñas en texto plano.
- Nunca guardar el token original de recuperación; solo `token_hash`.
- Mantener `DATABASE_URL`, `JWT_SECRET`, SMTP y claves VAPID fuera del repositorio.
- La cuenta Google se valida en el backend mediante `GOOGLE_CLIENT_ID`.
