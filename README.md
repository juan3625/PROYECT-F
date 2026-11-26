# FINDRIX — Plataforma de finanzas personales

FINDRIX es una aplicación web de finanzas personales orientada a registrar, organizar y comprender la vida financiera del usuario. El proyecto combina un frontend React/Vite, un backend Node.js/Express y una base de datos PostgreSQL.

Esta rama documentada es `release/findrix-app-completa`. El README funciona como guía técnica, mapa del repositorio y libreto de apoyo para la presentación del proyecto.

- **Repositorio:** https://github.com/juan3625/PROYECT-F
- **Rama de referencia:** `release/findrix-app-completa`
- **Commit funcional más reciente:** `3010fe5` — corrección de temas y animación del zorrito flotante
- **Commit anterior de consolidación:** `987b703` — personalización y economía cash-first

---

## 1. ¿Qué problema resuelve FINDRIX?

FINDRIX permite que una persona registre y consulte sus gastos, ingresos, metas de ahorro, préstamos y movimientos de efectivo desde un solo lugar. La aplicación no se limita a operaciones bancarias: también contempla la economía informal y el uso cotidiano de efectivo, como propinas, trabajos extras, ventas por WhatsApp, oficios y pequeños negocios.

La propuesta se apoya en cuatro ideas principales:

1. **Registro sencillo:** registrar una operación debe requerir pocos pasos.
2. **Visibilidad:** el usuario puede revisar resúmenes, categorías y gráficas.
3. **Personalización:** la interfaz se adapta mediante tema, color de acento y tamaño de texto.
4. **Acompañamiento:** el zorrito animado ofrece una capa visual de orientación y retroalimentación.

---

## 2. Estructura general del repositorio

```text
PROYECT-F/
├── findrix frontend/       # Aplicación web React/Vite y experiencia de usuario
├── findrix_backend/        # API Express, autenticación, reglas de negocio y PostgreSQL
├── EJECUTAR.md             # Guía breve para levantar el proyecto
├── package.json            # Comandos generales para instalar y ejecutar ambos módulos
└── README.md               # Este documento: mapa técnico y guía de presentación
```

### 2.1 `findrix frontend/`

Contiene la aplicación que utiliza directamente el usuario.

| Carpeta o archivo | Qué contiene | Para qué sirve en la sustentación |
|---|---|---|
| `src/pages/` | Pantallas principales: inicio, movimientos, metas, categorías, economía, ajustes, reportes, perfil y autenticación. | Mostrar el recorrido funcional de la aplicación. |
| `src/components/layout/` | Estructura visual, navegación, botón `+`, barra inferior y zorrito flotante. | Explicar la experiencia global y el registro rápido. |
| `src/components/quickadd/` | Formularios rápidos para gastos, ingresos y abonos. | Demostrar cómo se registra una operación sin navegar por varias pantallas. |
| `src/components/categorias/` | Formulario para crear y editar categorías. | Explicar la administración de categorías. |
| `src/components/metas/` | Tarjetas y formulario de metas de ahorro. | Demostrar creación, avance y abonos de metas. |
| `src/components/movimientos/` | Filtros, listado y elementos individuales de movimientos. | Mostrar consulta y filtrado de gastos e ingresos. |
| `src/components/charts/` | Gráficas de categorías, resumen mensual y progreso. | Explicar cómo la aplicación convierte registros en información visual. |
| `src/components/auth/` | Carga inicial del zorro, autenticación, protección de rutas y Google Sign-In. | Presentar el acceso seguro y la experiencia de inicio. |
| `src/components/notifications/` | Notificaciones financieras dentro de la aplicación. | Mostrar recordatorios y alertas. |
| `src/components/ui/` | Componentes reutilizables: mensajes, estados vacíos, barras de progreso, hojas y encabezados. | Explicar consistencia visual y reutilización de interfaz. |
| `src/context/` | Estado global de autenticación, datos de la aplicación y preferencias. | Ubicar la lógica transversal que comparten las pantallas. |
| `src/hooks/` | Hooks de notificaciones y Web Push. | Explicar comportamiento reactivo y suscripciones. |
| `src/utils/` | Utilidades de formato, notificaciones y economía cash-first. | Ubicar cálculos y persistencia auxiliar. |
| `src/api/client.ts` | Cliente HTTP del frontend. | Explicar la comunicación con el backend. |
| `src/types/` | Tipos TypeScript compartidos en el frontend. | Mostrar control de tipos y contratos de datos. |
| `src/index.css` | Variables, temas, acentos, tamaños y estilos globales. | Sustentar los modos claro, oscuro y automático. |
| `public/` | Manifest, service worker, íconos y recursos de PWA. | Explicar instalación como aplicación y comportamiento offline básico. |
| `.env.example` | Plantilla de variables del frontend. | Indicar cómo configurar la URL de la API sin publicar secretos. |
| `package.json` | Scripts de desarrollo, build y lint. | Ejecutar y verificar el frontend. |

### 2.2 `findrix_backend/`

Contiene la API y la lógica de servidor.

| Carpeta o archivo | Qué contiene | Para qué sirve en la sustentación |
|---|---|---|
| `src/server.js` | Punto de entrada del servidor. | Explicar cómo inicia la API. |
| `src/app.js` | Configuración de Express, middlewares y rutas. | Mostrar la composición de la API. |
| `src/routes/` | Rutas de autenticación, categorías, gastos, ingresos, metas, préstamos y notificaciones. | Ubicar los endpoints de cada módulo. |
| `src/controllers/` | Controladores que reciben solicitudes y construyen respuestas. | Explicar el flujo HTTP desde la petición hasta la respuesta. |
| `src/services/` | Reglas de negocio y coordinación de operaciones. | Sustentar validaciones y decisiones del dominio. |
| `src/repositories/` | Consultas de acceso a PostgreSQL. | Explicar la separación entre negocio y persistencia. |
| `src/schemas/` | Validaciones Joi para las entradas de la API. | Mostrar control de datos recibidos. |
| `src/middlewares/` | Autenticación JWT, manejo de errores y protección de recuperación. | Explicar seguridad y manejo uniforme de fallos. |
| `src/config/db.js` | Conexión con PostgreSQL. | Ubicar la configuración de base de datos. |
| `src/constants/` y `src/utils/` | Constantes, categorías y respuestas reutilizables. | Mostrar centralización de reglas comunes. |
| `sql/schema.sql` | Esquema inicial de la base de datos. | Presentar tablas y relaciones principales. |
| `sql/migrations/` | Cambios incrementales para recuperación, Google, notificaciones e integridad. | Explicar evolución controlada del modelo. |
| `sql/modelo_datos.mmd` | Fuente Mermaid del modelo de datos. | Modificar o regenerar el diagrama cuando sea necesario. |
| `sql/modelo_datos.png` | Imagen del modelo de datos. | Usar como evidencia visual en la sustentación. |
| `sql/README.md` | Documentación específica de la base de datos. | Consultar orden de ejecución y detalles SQL. |
| `.env.example` | Variables de entorno del backend. | Configurar base de datos, JWT, Google, correo y Web Push. |
| `package.json` | Scripts de desarrollo y producción del backend. | Ejecutar la API. |

### 2.3 Archivos de apoyo de la raíz

- **`EJECUTAR.md`:** pasos resumidos para instalar dependencias, preparar PostgreSQL y levantar frontend/backend.
- **`package.json`:** comandos generales como `install:all`, `dev:frontend`, `dev:backend` y `build:frontend`.
- **`.gitignore` y archivos `.env`:** los secretos deben permanecer fuera del control de versiones.

---

## 3. Mapa exacto de funcionalidades

| Funcionalidad | Dónde se ve | Ubicación principal en el proyecto |
|---|---|---|
| Registro e inicio de sesión | Pantallas de acceso | `findrix frontend/src/pages/LoginPage.tsx`, `RegistroPage.tsx`, `context/AuthContext.tsx`; backend `routes/auth.routes.js` |
| Protección de rutas | Antes de entrar a la aplicación | `findrix frontend/src/components/auth/RequireAuth.tsx` |
| Resumen y gráficas | Inicio | `findrix frontend/src/pages/InicioPage.tsx`, `src/components/charts/` |
| Gastos e ingresos | Movimientos y botón `+` | `src/pages/MovimientosPage.tsx`, `src/components/quickadd/`, backend `gasto` e `ingreso` |
| Registro rápido | Botón `+` global | `src/components/layout/FAB.tsx`, `src/components/quickadd/QuickAddModal.tsx` |
| Metas de ahorro | Metas | `src/pages/MetasPage.tsx`, `src/components/metas/`, backend `metaAhorro` |
| Préstamos y pagos | Préstamos | `src/pages/MasPage.tsx` y `src/components/quickadd/AbonoForm.tsx`, backend `prestamo` |
| Crear, editar y eliminar categorías | Categorías | `src/pages/CategoriasPage.tsx`, `src/components/categorias/NuevaCategoriaForm.tsx`, backend `categoria` |
| Economía informal / cash-first | Economía | `src/pages/EconomiaPage.tsx`, `src/utils/cashFirst.ts` |
| Caja chica digital | Economía | `src/pages/EconomiaPage.tsx` y `src/utils/cashFirst.ts` |
| Huella de inflación personal | Economía | `src/pages/EconomiaPage.tsx` |
| Proyección de agotamiento de efectivo | Economía | `src/pages/EconomiaPage.tsx` y `src/utils/cashFirst.ts` |
| Tema claro, oscuro y automático | Ajustes | `src/pages/AjustesPage.tsx`, `context/PreferencesContext.tsx`, `src/index.css` |
| Color de acento y tamaño de texto | Ajustes | `src/pages/AjustesPage.tsx`, `context/PreferencesContext.tsx`, `src/index.css` |
| Zorrito animado | Esquina inferior derecha | `src/components/layout/FoxCompanion.tsx` y `FoxCompanion.css` |
| Animación y sonido de bienvenida | Carga inicial | `src/components/auth/FoxLoadingTransition.tsx` y `FoxLoadingTransition.css` |
| Notificaciones | Ajustes y componentes financieros | `src/hooks/`, `src/components/notifications/`, backend `notificacion` |
| PWA | Instalación del navegador | `public/manifest.webmanifest`, `public/sw.js`, íconos PWA |

---

## 4. Preparación del entorno

### Requisitos

- Node.js y npm.
- PostgreSQL y pgAdmin o `psql`.
- Git.
- Navegador moderno.

### Instalación

Desde la raíz del repositorio:

```bash
npm run install:all
```

### Configuración del backend

```bash
cp findrix_backend/.env.example findrix_backend/.env
```

Configura como mínimo:

```env
PORT=3000
DATABASE_URL=postgres://postgres:TU_CONTRASEÑA@localhost:5432/findrix
JWT_SECRET=una_clave_larga_y_privada
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

Las variables de Google, SMTP y Web Push son opcionales según el alcance de la demostración. Nunca publiques el archivo `.env`.

### Configuración del frontend

```bash
cp "findrix frontend/.env.example" "findrix frontend/.env"
```

Valor mínimo:

```env
VITE_API_URL=http://localhost:3000/api
```

### Base de datos

Crea una base llamada `findrix`. En una instalación nueva, ejecuta en este orden:

```text
findrix_backend/sql/schema.sql
findrix_backend/sql/migrations/001_recuperacion_contrasena.sql
findrix_backend/sql/migrations/002_auth_google.sql
findrix_backend/sql/migrations/003_notificacion_suscripcion.sql
findrix_backend/sql/migrations/004_integridad_app_actualizada.sql
```

Si la base ya tiene datos, no ejecutes nuevamente `schema.sql`; aplica solo las migraciones pendientes. La documentación completa está en `findrix_backend/sql/README.md`.

---

## 5. Ejecutar FINDRIX

Abre dos terminales desde la raíz del repositorio.

**Terminal 1 — backend:**

```bash
npm run dev:backend
```

**Terminal 2 — frontend:**

```bash
npm run dev:frontend
```

Direcciones locales:

- Aplicación: http://localhost:5173
- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

Para compilar el frontend:

```bash
npm run build:frontend
```

Para revisar el código del frontend directamente:

```bash
cd "findrix frontend"
npm run lint
npm run build
```

---

## 6. Guion recomendado para la presentación

La siguiente secuencia permite explicar el producto de forma clara y relacionar cada pantalla con el código.

### Paso 1 — Problema y propuesta

Explicar que FINDRIX centraliza las finanzas personales y que su diferencial es contemplar el efectivo y la economía informal, no solamente movimientos bancarios.

### Paso 2 — Acceso y resumen

Mostrar registro o inicio de sesión, entrar al resumen y explicar las gráficas. Relacionar la pantalla con `InicioPage.tsx` y los componentes de `charts`.

### Paso 3 — Registro rápido

Presionar el botón `+`, crear un gasto y un ingreso ficticios, y mostrar cómo aparecen en los movimientos y el resumen. Señalar `FAB.tsx`, `QuickAddModal.tsx` y los formularios de `quickadd`.

### Paso 4 — Economía cash-first

Entrar a Economía y mostrar:

1. Caja chica digital.
2. Registro de efectivo, propina o trabajo extra.
3. Huella de inflación personal.
4. Proyección de cuándo puede agotarse el efectivo.

La ubicación que se debe mencionar es `src/pages/EconomiaPage.tsx` y `src/utils/cashFirst.ts`.

### Paso 5 — Categorías

Crear una categoría de prueba, editarla y mostrar el botón de eliminación. Explicar que el backend protege categorías utilizadas por movimientos mediante `categoria.service.js` y `categoria.repository.js`.

### Paso 6 — Metas y préstamos

Crear una meta, registrar un abono y presentar el progreso. Después mostrar un préstamo y un pago, utilizando datos ficticios.

### Paso 7 — Personalización

En Ajustes demostrar en este orden:

1. Tema claro.
2. Tema oscuro.
3. Tema automático.
4. Color de acento.
5. Tamaño de texto.

La lógica se encuentra en `PreferencesContext.tsx` y los estilos/variables en `index.css`.

### Paso 8 — Zorrito y experiencia visual

Mostrar el zorrito animado en la esquina inferior derecha y comprobar que no interfiera con el botón `+`. Explicar que está implementado en `FoxCompanion.tsx` y `FoxCompanion.css`, mientras que la animación inicial está en `FoxLoadingTransition.tsx`.

### Paso 9 — Arquitectura técnica

Abrir el modelo de datos de `findrix_backend/sql/modelo_datos.png`, mostrar Swagger y explicar la separación entre rutas, controladores, servicios, repositorios y PostgreSQL.

### Paso 10 — Cierre

Mostrar responsive en móvil y escritorio, mencionar PWA, revisar el repositorio y señalar la rama `release/findrix-app-completa` junto con los commits de referencia.

---

## 7. Checklist previo a la sustentación

- [ ] La base de datos `findrix` está creada y las migraciones aplicadas.
- [ ] El backend responde en `http://localhost:3000`.
- [ ] El frontend abre en `http://localhost:5173`.
- [ ] Existe un usuario de demostración o se puede registrar uno.
- [ ] Hay datos ficticios preparados para gastos, ingresos, metas y préstamos.
- [ ] Hay movimientos de efectivo para demostrar Caja chica y proyección.
- [ ] Se probaron temas claro, oscuro y automático.
- [ ] Se probaron edición y eliminación de categorías.
- [ ] El zorrito y el botón `+` no se superponen.
- [ ] Se verificó la vista responsive.
- [ ] Se ejecutó el build del frontend.
- [ ] Se revisó Swagger en `/api/docs`.
- [ ] No se muestran archivos `.env`, contraseñas ni tokens.
- [ ] Las capturas de la sustentación corresponden a esta rama.

---

## 8. Seguridad y buenas prácticas

Los archivos `.env` no deben subirse al repositorio. Usa únicamente `.env.example` como plantilla. No incluyas en capturas ni en la presentación contraseñas, tokens JWT, claves de Google, claves VAPID, credenciales SMTP ni información financiera real.

Si se modifica una funcionalidad antes de la defensa, actualiza en este orden:

1. Código de la rama de trabajo.
2. Pruebas y build.
3. Capturas y evidencias.
4. Este README y los manuales de sustentación.
5. Commit y referencia de la nueva versión.

---

## 9. Documentación relacionada

- `EJECUTAR.md` — ejecución rápida.
- `findrix frontend/README.md` — notas específicas del frontend.
- `findrix_backend/README.md` — notas específicas del backend.
- `findrix_backend/sql/README.md` — base de datos y migraciones.
- `findrix_backend/sql/modelo_datos.png` — modelo visual de datos.
- `docs/seguimiento-findrix.md` — fases del proyecto, fechas, comentarios y estado real de la aplicación.
- `docs/product-backlog-findrix.docx` — Product Backlog en Word con PBI, historias de usuario y criterios de aceptación.
- `docs/product-backlog-findrix.md` — fuente Markdown del Product Backlog.
- `docs/casos-de-uso-findrix.puml` — casos de uso en PlantUML.
- `docs/plan-de-pruebas-findrix.md` — Plan de Pruebas basado en la estructura de IEEE 29119-3.
- `docs/matriz-trazabilidad-findrix.md` — requisitos, casos de prueba, criterios y responsables.
- `findrix_backend/tests/auth.schema.test.js` — pruebas unitarias de los esquemas de autenticación.
