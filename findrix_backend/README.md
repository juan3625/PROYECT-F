# Findrix Backend

Backend de Findrix construido con Node.js, Express y PostgreSQL.

## Funcionalidades

- Registro e inicio de sesión con bcrypt y JWT.
- Autenticación con Google mediante verificación server-side del ID token.
- Recuperación de contraseña con token hash de un solo uso.
- CRUD de categorías, gastos, ingresos, metas y préstamos.
- Abonos a metas y préstamos.
- Suscripciones Web Push por dispositivo.
- Programador diario de recordatorios financieros.
- Documentación Swagger.

## Estructura

```text
findrix_backend/
├── .env.example
├── package.json
├── sql/
│   ├── schema.sql
│   ├── README.md
│   ├── modelo_datos.mmd
│   ├── modelo_datos.png
│   └── migrations/
└── src/
    ├── config/
    ├── constants/
    ├── controllers/
    ├── middlewares/
    ├── repositories/
    ├── routes/
    ├── schemas/
    ├── services/
    └── utils/
```

Los repositories contienen el SQL y los mapeos a camelCase. Los services contienen las reglas de negocio. Los controllers coordinan validación y respuestas HTTP.

## Base de datos

La instalación y actualización están documentadas en:

```text
sql/README.md
```

Para una base nueva, ejecuta `sql/schema.sql` y después las migraciones numeradas en orden. Para una base existente, ejecuta únicamente las migraciones pendientes; no uses `schema.sql` como actualización destructiva.

## Variables de entorno

Copia `.env.example` a `.env` y completa al menos:

```env
PORT=3000
DATABASE_URL=postgres://usuario:contrasena@localhost:5432/findrix
JWT_SECRET=coloca_aqui_un_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Google, SMTP y VAPID requieren configuración propia del entorno. No se guardan credenciales reales en el repositorio.

## Ejecutar

Desde la raíz del proyecto:

```bash
npm run dev:backend
```

O desde esta carpeta:

```bash
npm install
npm run dev
```

La API queda disponible en `http://localhost:3000` y Swagger en `http://localhost:3000/api/docs`.
