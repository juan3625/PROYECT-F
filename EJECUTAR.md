# Ejecutar Findrix

Esta rama contiene la aplicación completa: frontend, backend y archivos SQL de la base de datos.

## 1. Instalar dependencias

Desde la raíz del repositorio:

```bash
npm run install:all
```

## 2. Preparar PostgreSQL

Crea una base de datos llamada `findrix` desde pgAdmin.

En una base nueva, ejecuta desde pgAdmin los siguientes archivos, en orden:

```text
findrix_backend/sql/schema.sql
findrix_backend/sql/migrations/001_recuperacion_contrasena.sql
findrix_backend/sql/migrations/002_auth_google.sql
findrix_backend/sql/migrations/003_notificacion_suscripcion.sql
findrix_backend/sql/migrations/004_integridad_app_actualizada.sql
```

Si la base ya contiene datos, no ejecutes `schema.sql` como actualización. Usa únicamente las migraciones pendientes.

## 3. Configurar el backend

Copia el archivo de ejemplo:

```bash
cp findrix_backend/.env.example findrix_backend/.env
```

En PowerShell:

```powershell
Copy-Item findrix_backend/.env.example findrix_backend/.env
```

Configura `DATABASE_URL`, `JWT_SECRET` y `FRONTEND_URL`. Google, SMTP y VAPID se agregan cuando se quieran probar esas funciones.

## 4. Configurar el frontend

Copia el archivo de entorno:

```bash
cp "findrix frontend/.env.example" "findrix frontend/.env"
```

En PowerShell:

```powershell
Copy-Item "findrix frontend/.env.example" "findrix frontend/.env"
```

El valor mínimo esperado es:

```env
VITE_API_URL=http://localhost:3000/api
```

## 5. Ejecutar backend y frontend

Abre dos terminales en la raíz `PROYECT-F`.

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

Direcciones:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api/docs`

## 6. Comprobar la aplicación

Prueba registro, inicio de sesión, categorías, movimientos, metas, préstamos, abonos, gráficas, ajustes, actualización de listas y recuperación de contraseña.

Para validar el build:

```bash
npm run build:frontend
```
