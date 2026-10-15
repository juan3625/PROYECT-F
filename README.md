## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Entorno de ejecución | Node.js (ES Modules) |
| Framework | Express 4 |
| Base de datos | PostgreSQL (driver `pg`, UUID con `pgcrypto`) |
| Autenticación | JWT (`jsonwebtoken`) + `bcrypt` para contraseñas |
| Validación | Joi |
| Documentación de la API | Swagger (`swagger-jsdoc` + `swagger-ui-express`) en `/api/docs` |
| Configuración | `dotenv`, `cors` |

**Arquitectura:** rutas → controladores → servicios, con esquemas de validación (Joi) y middlewares de autenticación y manejo de errores.

### Scripts
- `npm run dev`: servidor con recarga automática (`node --watch`)
- `npm start`: servidor en modo normal

### Variables de entorno
Copia `.env.example` a `.env` y completa: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`.

### Base de datos
El esquema está en `sql/schema.sql` (usuario, categoría, gasto, ingreso, meta de ahorro y préstamo).
