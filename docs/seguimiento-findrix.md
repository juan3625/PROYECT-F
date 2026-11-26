# Seguimiento del proyecto FINDRIX

> Tabla de seguimiento de la aplicación web de finanzas personales FINDRIX. Las fases describen el trabajo realizado sobre el frontend React/Vite, el backend Node.js/Express, PostgreSQL, el despliegue y la documentación de sustentación.
>
> **Criterio de lectura:** las fechas de fases terminadas corresponden al orden de seguimiento del proyecto. Las fechas de las fases pendientes son fechas de planificación. Una fase pendiente no debe presentarse como una funcionalidad validada.

## Tabla de fases

| Fecha | Fase | Aplicación / entregable relacionado | Comentario de seguimiento | Estado |
|---|---|---|---|---|
| 21/08/2026 | Actas y organización inicial | Alcance general de FINDRIX | Se registraron reuniones, acuerdos y actividades iniciales para organizar el proyecto de finanzas personales. | Realizado |
| 23/08/2026 | Historias de usuario | Registro de gastos, ingresos, metas, préstamos y efectivo | Se documentaron las necesidades de los usuarios y las acciones principales que debía cubrir la aplicación. | Realizado |
| 25/08/2026 | Requisitos y requerimientos funcionales | Flujo general de la aplicación | Se definieron las funciones esperadas y los criterios que deben comprobarse durante las pruebas. | Realizado |
| 28/08/2026 | Casos de uso y documento SRS | Acceso, movimientos, categorías, metas y préstamos | Se organizaron las interacciones entre usuario y sistema y se consolidó la especificación del proyecto. | Realizado |
| 01/09/2026 | Modelo de dominio | Entidades principales de FINDRIX | Se trabajó el modelo de dominio para representar usuarios, movimientos, categorías, metas y demás elementos del sistema. | Realizado |
| 04/09/2026 | MER, MR y diccionario de datos | Estructura de PostgreSQL | Se documentaron entidades, relaciones, campos y transformación del modelo conceptual hacia el modelo relacional. | Realizado |
| 08/09/2026 | Prototipo y diseño de interfaz | Pantallas de inicio, movimientos, metas, categorías, economía y ajustes | Se construyeron y revisaron las pantallas y el recorrido visual de la aplicación. | Realizado |
| 15/09/2026 | Desarrollo del frontend | React, TypeScript y Vite | Se organizó la aplicación web con páginas, componentes reutilizables, contextos, hooks, temas, PWA y navegación. | Realizado |
| 22/09/2026 | Desarrollo del backend | Node.js, Express, rutas, controladores y servicios | Se integró la API para autenticación, categorías, gastos, ingresos, metas, préstamos y notificaciones. | Realizado |
| 29/09/2026 | Base de datos y migraciones | PostgreSQL, `schema.sql` y migraciones | Se preparó el esquema y la documentación de la base de datos para soportar los módulos de la aplicación. | Realizado |
| 15/11/2026 | Revisión del repositorio | GitHub `juan3625/PROYECT-F` | Se revisó el código publicado, la estructura del frontend y backend, y los archivos de ejecución y documentación. | Realizado |
| 18/11/2026 | Revisión de la aplicación desplegada | Frontend y API publicados | Se revisó el despliegue existente y se identificaron los puntos que debían comprobarse en el entorno publicado. | Realizado |
| 20/11/2026 | Variables de entorno y configuración | `VITE_API_URL`, `DATABASE_URL`, JWT y URL del frontend | Se configuraron las variables del entorno de despliegue y se esperó la finalización del deploy. Los secretos no se guardan en GitHub. | Realizado |
| 22/11/2026 | Corrección de la base de datos | Base de datos PostgreSQL de Render | Se eliminó y se creó nuevamente la base de datos porque la configuración anterior estaba dando problemas. | Realizado |
| 24/11/2026 | Revisión de conexión | Frontend → backend → PostgreSQL | Se revisaron los ajustes de conexión después de recrear la base de datos. La conexión completa todavía necesita una prueba reproducible. | En proceso |
| 25/11/2026 | Documentación de sustentación | Google Drive y documentos del proyecto | Se actualizó la carpeta de sustentación y se corrigió el documento de calidad. | Realizado |
| 26/11/2026 | Identidad visual | `logo-findrix.png` y documentos revisados | Se cargó el logo oficial de FINDRIX y se aplicó en 36 archivos y páginas/documentos revisados. | Realizado |
| 27/11/2026 | Validación de registro | Pantalla de registro y rutas de autenticación | Debe comprobarse que un usuario nuevo pueda registrarse en la aplicación desplegada y que el registro quede guardado correctamente. | Pendiente |
| 28/11/2026 | Validación de inicio de sesión | Login, JWT y protección de rutas | Debe comprobarse el inicio de sesión, la respuesta del backend, la persistencia de sesión y el acceso a las páginas protegidas. | Pendiente |
| 29/11/2026 | Pruebas funcionales de la aplicación | Gastos, ingresos, categorías, metas, préstamos, gráficas y economía cash-first | Se deben ejecutar pruebas en producción y registrar evidencias de resultados, errores y correcciones. | Pendiente |
| 30/11/2026 | Revisión final de calidad | Frontend, backend, base de datos y documentos | Se debe verificar que la versión publicada, la documentación, los diagramas y el logo correspondan a la misma versión del proyecto. | Pendiente |
| 01/12/2026 | Preparación de sustentación | Evidencias, capturas, modelo de datos y guion | Se deben ordenar las evidencias finales y preparar la demostración de FINDRIX sin presentar como funcional algo que no haya sido validado. | Pendiente |

## Estado técnico resumido

### Funcionalidades implementadas en el proyecto

- Registro e inicio de sesión mediante el frontend y la API de autenticación.
- Protección de rutas y manejo de sesión con JWT.
- Gestión de gastos, ingresos, categorías, metas de ahorro y préstamos.
- Registro rápido mediante el botón `+`.
- Gráficas y resúmenes financieros.
- Economía informal y enfoque `cash-first`, incluyendo caja chica y proyecciones.
- Preferencias de tema, color de acento y tamaño de texto.
- Zorrito animado, experiencia de bienvenida y recursos PWA.
- Backend separado por rutas, controladores, servicios, repositorios y validaciones.
- Esquema PostgreSQL, migraciones y modelo visual de datos.

### Validaciones que todavía no deben darse por terminadas

Aunque el código y las rutas de autenticación están implementados, en el entorno publicado todavía debe comprobarse de forma reproducible la creación de usuarios y el inicio de sesión. Por esta razón, las fases de conexión definitiva, registro, login y pruebas funcionales permanecen como **En proceso** o **Pendientes**.

## Evidencias y archivos relacionados

- Repositorio: <https://github.com/juan3625/PROYECT-F>
- Guía de ejecución: [`EJECUTAR.md`](../EJECUTAR.md)
- Documentación técnica principal: [`README.md`](../README.md)
- Backend y base de datos: [`findrix_backend/README.md`](../findrix_backend/README.md)
- Modelo de datos: [`findrix_backend/sql/modelo_datos.mmd`](../findrix_backend/sql/modelo_datos.mmd)
- Seguimiento visual complementario: tablero de Trello [Seguimiento Findrix](https://trello.com/b/xvC7IYsY/seguimiento-findrix)
