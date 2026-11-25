# Findrix Backend — Reorganización interna

Este README documenta la reorganización interna aplicada al backend de Findrix. El objetivo fue separar responsabilidades y reducir la duplicación sin cambiar el contrato público de la API.

## Qué se mantuvo igual

La reorganización no cambia:

- Los endpoints ni sus métodos HTTP.
- Los nombres de los campos de entrada y salida.
- La estructura de las respuestas JSON.
- Los códigos de estado HTTP.
- Los mensajes de error existentes.
- El aislamiento de datos por usuario.
- Las reglas de negocio de gastos, categorías, metas, préstamos y abonos.
- El esquema de PostgreSQL.

El frontend debe seguir consumiendo las mismas rutas y respuestas.

## Estructura actual

```text
findrix_backend/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── sql/
│   └── schema.sql
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── db.js
    ├── constants/
    │   └── categorias.js
    ├── controllers/
    ├── middlewares/
    ├── repositories/
    │   ├── usuario.repository.js
    │   ├── categoria.repository.js
    │   ├── gasto.repository.js
    │   ├── ingreso.repository.js
    │   ├── metaAhorro.repository.js
    │   └── prestamo.repository.js
    ├── routes/
    ├── schemas/
    ├── services/
    └── utils/
        ├── asyncHandler.js
        └── respuestas.js
```

La carpeta `models/` fue eliminada porque no se utiliza. El acceso a datos está concentrado en `repositories/`.

## Responsabilidad de cada capa

### `config/`

Contiene la configuración de infraestructura. `db.js` crea y exporta el pool de conexiones de PostgreSQL.

### `constants/`

Contiene valores constantes compartidos. `constants/categorias.js` define la paleta fija de colores para categorías:

- Gastos: `primary`, `gold`, `danger`.
- Ingresos: `green`, `primary`, `gold`.

El color lo asigna el backend; el cliente no lo envía.

### `routes/`

Declara las rutas HTTP y conserva la documentación de Swagger. Las rutas conectan cada endpoint con su controller.

### `controllers/`

Representan la entrada y salida HTTP:

1. Reciben la solicitud.
2. Validan el cuerpo mediante un schema Joi.
3. Llaman al service.
4. Devuelven la respuesta con el mismo código y formato que antes.

Los controllers ya no repiten bloques `try/catch`. Usan `asyncHandler` para enviar los errores al middleware global.

### `schemas/`

Contiene las validaciones Joi de los cuerpos recibidos por la API. Esta reorganización no cambia los campos ni las reglas de validación existentes.

### `repositories/`

Es la capa de acceso a datos. Hay un archivo por tabla o recurso persistido:

- `usuario.repository.js`: búsquedas y creación de usuarios.
- `categoria.repository.js`: conteo, búsqueda por usuario, listado, creación y actualización de categorías.
- `gasto.repository.js`: listado, creación, actualización y marcado como pagado.
- `ingreso.repository.js`: listado, creación y actualización de ingresos.
- `metaAhorro.repository.js`: listado, creación, abonos y actualización de metas.
- `prestamo.repository.js`: listado, creación, abonos y actualización de préstamos.

Los repositories contienen:

- Todo el SQL.
- Los parámetros de las consultas.
- Los filtros por `usuario_id`.
- Las columnas de `SELECT` y `RETURNING`.
- Los mapeos de filas PostgreSQL a los nombres camelCase de la API.

Las listas de columnas repetidas se definen como constantes locales, por ejemplo `COLUMNAS_GASTO`, para reutilizarlas en `SELECT` y `RETURNING`.

### `services/`

Contiene las reglas de negocio y coordina repositories. Los services no deben importar `pool`, ejecutar `pool.query` ni contener mapeos de filas.

Reglas que permanecen en esta capa:

- Registro y login con bcrypt y JWT.
- Asignación del color de las categorías.
- Verificación de que una categoría pertenece al usuario autenticado.
- Derivación del estado de un gasto: `pendiente` o `pagado`.
- Marcado de gastos como pagados.
- Manejo de recursos inexistentes con los mismos mensajes de error.
- Coordinación de abonos a metas y préstamos.

La verificación de propiedad de categorías está en `services/categoria.service.js` y se reutiliza desde los services de gastos e ingresos.

### `middlewares/`

Contiene autenticación, manejo global de errores y respuesta para rutas inexistentes.

### `utils/`

Contiene utilidades transversales:

- `asyncHandler.js`: captura errores de funciones asíncronas de los controllers y los pasa a `errorHandler`.
- `respuestas.js`: define `ErrorApi` y mantiene el formato `{ "error": "mensaje" }`.

## Flujo de una solicitud

```text
Ruta
  ↓
Controller
  ↓
Schema Joi
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

Los errores regresan por el flujo asíncrono hasta el middleware global:

```text
Error en cualquier capa
  ↓
asyncHandler
  ↓
errorHandler
  ↓
{ "error": "mensaje en español" }
```

## Seguridad de contraseñas y entorno

Las contraseñas siempre se almacenan con bcrypt usando 12 rondas. Se eliminó completamente la opción `GUARDAR_CONTRASENA_PLANA` y no debe agregarse nuevamente.

El backend necesita un `.env` local con variables como:

```env
PORT=3000
DATABASE_URL=postgres://usuario:contrasena@localhost:5432/findrix
JWT_SECRET=coloca_aqui_un_secreto_largo_y_aleatorio
JWT_EXPIRES_IN=7d
```

El archivo `.env` real no debe subirse al repositorio ni incluirse en ZIP. Solo se distribuye `.env.example`, sin credenciales reales.

## Cómo ejecutar

Desde la carpeta `findrix_backend/`:

```bash
npm install
cp .env.example .env
npm run dev
```

La API queda disponible, por defecto, en:

```text
http://localhost:3000
```

La documentación Swagger queda disponible en:

```text
http://localhost:3000/api/docs
```

## Comprobaciones realizadas

Durante la reorganización se verificó que:

- No existe `pool.query` fuera de `repositories/`.
- No existen funciones `aCamel` dentro de `services/`.
- Los controllers no contienen bloques repetidos `try/catch`.
- Todos los archivos JavaScript pasan `node --check`.
- La opción de contraseñas planas fue eliminada.
- `models/` no existe porque estaba vacía y no se utiliza.
- `utils/categorias.js` no existe; la verificación está en `categoria.service.js`.
- Swagger responde y el servidor puede iniciar con variables de entorno configuradas.
- El paquete final no contiene `.env` ni `node_modules/`.

## Prueba manual en Swagger

1. Inicia el backend con `npm run dev`.
2. Abre `/api/docs`.
3. Ejecuta `POST /api/auth/registro` o `POST /api/auth/login`.
4. Copia el token recibido.
5. Pulsa **Authorize** y usa `Bearer TU_TOKEN`.
6. Prueba los endpoints existentes de categorías, gastos, ingresos, metas de ahorro y préstamos.
7. Comprueba que las respuestas mantengan los mismos campos camelCase, códigos HTTP y mensajes de error.
8. Prueba también los casos de abono, marcado de gasto como pagado y actualización de registros.
