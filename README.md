# Findrix — aplicación completa actualizada

Findrix es una aplicación web de finanzas personales con frontend React/Vite y backend Node/Express/PostgreSQL.

## Funcionalidades incluidas

- Registro e inicio de sesión con JWT y contraseñas protegidas con bcrypt.
- Recuperación de contraseña mediante token de un solo uso.
- Inicio de sesión y registro con Google Identity Services.
- Diseño responsive para celular, tablet y computador.
- Categorías, gastos, ingresos, metas de ahorro y préstamos.
- Gráficas financieras en la pantalla de Inicio usando Recharts.
- Ajustes de tema, color de acento y tamaño de texto.
- Recordatorios financieros dentro de la aplicación.
- Notificaciones del navegador y Web Push.
- PWA con manifest y service worker.
- Suscripciones por dispositivo y programador diario de notificaciones.
- Esquema PostgreSQL y migraciones actualizadas.

## Requisitos

- Node.js y npm.
- PostgreSQL con pgAdmin o `psql`.
- Git.
- Un navegador moderno.

## Instalación

Desde la raíz del repositorio:

```bash
npm run install:all
```

Este comando instala las dependencias del frontend y del backend.

## Base de datos

Crea una base de datos llamada `findrix` desde pgAdmin o PostgreSQL. En una instalación nueva, ejecuta estos archivos en orden:

```text
findrix_backend/sql/schema.sql
findrix_backend/sql/migrations/001_recuperacion_contrasena.sql
findrix_backend/sql/migrations/002_auth_google.sql
findrix_backend/sql/migrations/003_notificacion_suscripcion.sql
findrix_backend/sql/migrations/004_integridad_app_actualizada.sql
```

Si ya tienes una base de datos con información, no ejecutes `schema.sql` como actualización. Ejecuta solo las migraciones pendientes, especialmente `004_integridad_app_actualizada.sql`.

La documentación detallada está en:

```text
findrix_backend/sql/README.md
```

El modelo visual está en:

```text
findrix_backend/sql/modelo_datos.png
```

## Variables del backend

Copia el archivo de ejemplo:

```bash
cp findrix_backend/.env.example findrix_backend/.env
```

En Windows PowerShell:

```powershell
Copy-Item findrix_backend/.env.example findrix_backend/.env
```

Configura como mínimo:

```env
PORT=3000
DATABASE_URL=postgres://postgres:TU_CONTRASEÑA@localhost:5432/findrix
JWT_SECRET=una_clave_larga_y_privada
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Para Google configura `GOOGLE_CLIENT_ID`. Para Web Push configura las tres variables VAPID. SMTP es opcional durante el desarrollo; sin SMTP, el enlace de recuperación se muestra en la consola del backend.

Nunca subas `.env` al repositorio.

## Variables del frontend

Copia el archivo de ejemplo:

```bash
cp "findrix frontend/.env.example" "findrix frontend/.env"
```

Configura al menos:

```env
VITE_API_URL=http://localhost:3000/api
```

Para Google y Web Push agrega los valores correspondientes de `VITE_GOOGLE_CLIENT_ID` y `VITE_VAPID_PUBLIC_KEY`.

## Ejecutar la aplicación

Abre dos terminales en la raíz del repositorio.

Terminal 1, backend:

```bash
npm run dev:backend
```

Terminal 2, frontend:

```bash
npm run dev:frontend
```

Abre:

```text
http://localhost:5173
```

Swagger queda disponible en:

```text
http://localhost:3000/api/docs
```

## Verificación rápida

1. Registra un usuario.
2. Inicia sesión.
3. Crea una categoría.
4. Crea un gasto y un ingreso.
5. Crea una meta y registra un abono.
6. Crea un préstamo y registra un pago.
7. Comprueba las gráficas de Inicio.
8. Cambia las preferencias en Ajustes y recarga la página.
9. Prueba los botones `Actualizar` en Metas, Categorías y Movimientos.
10. Prueba recuperación de contraseña; sin SMTP, revisa la consola del backend.
11. Revisa la versión responsive desde las herramientas de desarrollo del navegador.

## Build de producción del frontend

```bash
npm run build:frontend
```

## Estructura principal

```text
PROYECT-F/
├── findrix frontend/   # React, Vite, Tailwind, gráficas, PWA y UI
├── findrix_backend/    # Express, servicios, repositories, Swagger y SQL
├── EJECUTAR.md         # guía breve de ejecución
└── package.json        # comandos raíz
```

## Seguridad

No se incluyen credenciales reales, claves Google, claves VAPID, contraseñas SMTP ni secretos JWT. Cada entorno debe configurar sus propios valores mediante `.env`.
