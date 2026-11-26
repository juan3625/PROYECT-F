# Plan de Pruebas de FINDRIX

**Versión:** 1.0  
**Fecha:** 26/11/2026  
**Referencia metodológica:** estructura de plan de pruebas basada en ISO/IEC/IEEE 29119-3.  
**Producto:** aplicación web FINDRIX.

## 1. Introducción y alcance

FINDRIX es una aplicación web de finanzas personales con frontend React/TypeScript/Vite, backend Node.js/Express y PostgreSQL. Permite registrar y consultar gastos, ingresos, categorías, metas de ahorro, préstamos, movimientos de efectivo y reportes, además de configurar preferencias de la interfaz.

### Dentro del alcance

- Registro, inicio y cierre de sesión, protección de rutas y recuperación de contraseña.
- Comunicación frontend–backend y persistencia en PostgreSQL.
- Gastos, ingresos, categorías, metas, préstamos, abonos y movimientos de efectivo.
- Resúmenes, gráficas, filtros, preferencias, PWA y responsive.
- Despliegue, variables de entorno y manejo de errores.
- Evidencias, documentación y criterios de aceptación del Product Backlog.

### Fuera del alcance de esta versión

- Pruebas de carga masiva o certificación de rendimiento para producción.
- Auditoría formal de seguridad o penetración.
- Validación de proveedores externos fuera del control del proyecto, salvo la integración básica de Google o correo cuando esté habilitada.
- Presentar el registro o login como exitosos sin una ejecución reproducible en el entorno publicado.

## 2. Objetivos y criterios de éxito

### Objetivos

1. Detectar defectos que impidan usar los módulos principales de FINDRIX.
2. Confirmar que los datos del usuario se validan y persisten correctamente.
3. Comprobar la comunicación entre frontend, backend y base de datos.
4. Generar evidencias útiles para la sustentación.

### Criterios de entrada

- Código de la rama de trabajo disponible.
- Variables de entorno configuradas sin publicar secretos.
- Base de datos de prueba creada y migraciones aplicadas.
- Backend y frontend desplegados o disponibles localmente.
- Casos de prueba y datos ficticios preparados.

### Criterios de salida

- Todos los casos críticos ejecutados.
- Registro, login, rutas protegidas y persistencia con resultado reproducible.
- No quedan defectos críticos abiertos.
- Los defectos no bloqueantes tienen responsable y seguimiento.
- Evidencias asociadas a los casos ejecutados.

### Métricas

- Porcentaje de casos ejecutados y aprobados.
- Número de defectos por severidad.
- Porcentaje de requisitos con trazabilidad a casos de prueba.
- Porcentaje de flujos críticos validados en producción.

## 3. Tipos de pruebas y orden

1. **Pruebas unitarias:** validadores Joi, transformaciones y funciones aisladas. Se ejecutan primero porque localizan errores con bajo costo.
2. **Pruebas de integración:** rutas, controladores, servicios, repositorios y PostgreSQL. Confirman que los módulos colaboran correctamente.
3. **Pruebas de API:** respuestas HTTP, códigos de error, validaciones y autorización de endpoints.
4. **Pruebas de sistema:** recorrido completo desde la interfaz hasta la base de datos.
5. **Pruebas de datos inválidos:** campos vacíos, correo inválido, contraseñas cortas, valores negativos, duplicados y registros inexistentes.
6. **Pruebas responsive y PWA:** móvil, escritorio, manifest, navegación y superposición de componentes.
7. **Pruebas de aceptación (UAT):** escenarios Given-When-Then sobre los flujos que se presentarán en la sustentación.

## 4. Estrategia y herramientas

- **Backend:** Node.js `node:test`, validadores Joi y pruebas de endpoints.
- **Frontend:** build TypeScript/Vite, lint existente y pruebas manuales de navegación.
- **Base de datos:** PostgreSQL de prueba, esquema y migraciones versionadas.
- **API:** Swagger en `/api/docs`, cliente HTTP y registros del servidor.
- **Evidencias:** capturas, respuesta HTTP, datos antes/después y referencia al caso de prueba.
- **Datos:** cuentas y operaciones ficticias; nunca usar contraseñas reales ni información financiera real.

## 5. Escenarios Given-When-Then

### Registro válido

- **Given:** el visitante está en el formulario de registro y usa un correo no existente.
- **When:** introduce nombre válido, correo válido y contraseña de al menos 8 caracteres y envía el formulario.
- **Then:** el sistema valida los datos, crea la cuenta y devuelve una respuesta que permite continuar al acceso.

### Registro inválido

- **Given:** el visitante está en el formulario de registro.
- **When:** introduce un correo inválido o una contraseña menor de 8 caracteres.
- **Then:** se muestra un error de validación y no se crea ningún usuario.

### Inicio de sesión válido

- **Given:** existe un usuario registrado y la API está conectada a la base de datos.
- **When:** introduce sus credenciales correctas.
- **Then:** recibe sesión válida y puede acceder a las rutas protegidas.

### Inicio de sesión inválido

- **Given:** el usuario está en la pantalla de acceso.
- **When:** envía contraseña incorrecta o correo inexistente.
- **Then:** el acceso se rechaza sin revelar información sensible.

### Registro de gasto

- **Given:** el usuario tiene una sesión válida.
- **When:** registra un gasto con valor positivo, categoría y fecha.
- **Then:** el gasto se persiste y aparece en movimientos, resumen y gráficas correspondientes.

### Dato financiero inválido

- **Given:** el usuario abre el formulario de gasto o ingreso.
- **When:** introduce valor vacío, texto no numérico o valor negativo no permitido.
- **Then:** el formulario informa el error y no envía un registro inválido a la API.

### Meta y abono

- **Given:** el usuario autenticado crea una meta con objetivo válido.
- **When:** registra un abono positivo.
- **Then:** el progreso y el saldo se actualizan sin superar el objetivo de forma inconsistente.

### Responsive y PWA

- **Given:** la aplicación está abierta en móvil y escritorio.
- **When:** el usuario navega, registra una operación y cambia preferencias.
- **Then:** no hay desbordamiento horizontal, los controles son utilizables y el botón `+` no se superpone con el zorrito.

## 6. Riesgos y mitigación

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Registro o login no funcionan en producción | Alto | Probar endpoints, revisar variables, logs, URL de API y conexión de base de datos; conservar evidencia. |
| Base de datos recreada sin migraciones completas | Alto | Ejecutar `schema.sql` y migraciones en orden en un entorno de prueba y comparar tablas. |
| Variables o secretos incorrectos | Alto | Usar `.env.example`, revisar nombres y nunca subir `.env`. |
| Diferencia entre modelo/documentación y código | Medio | Revisar SRS, diccionario, MER/MR y esquema antes de la sustentación. |
| Datos de prueba insuficientes | Medio | Preparar cuentas y datos ficticios para cada módulo. |
| Cambios visuales rompen móvil | Medio | Ejecutar recorrido en viewport móvil y escritorio. |

## 7. Roles y responsabilidades

- **Desarrollador:** corrige defectos, conserva la separación frontend/backend y agrega pruebas unitarias.
- **Responsable de base de datos:** verifica esquema, migraciones, conexión y datos de prueba.
- **Tester o responsable de calidad:** ejecuta casos, registra resultados y conserva evidencias.
- **Product Owner del proyecto:** valida prioridades, alcance y criterios de aceptación.
- **Responsable de sustentación:** organiza capturas, documentos, diagramas y recorrido de demostración.

## 8. Cronograma indicativo

| Fecha | Actividad | Entregable |
|---|---|---|
| 27/11/2026 | Validación de configuración y conexión | Variables, logs y respuesta de salud revisados |
| 28/11/2026 | Registro e inicio de sesión | Resultados de casos AUTH y evidencias |
| 29/11/2026 | Módulos financieros | Casos de gastos, ingresos, categorías, metas y préstamos |
| 30/11/2026 | Responsive, PWA y datos inválidos | Evidencias visuales y matriz actualizada |
| 01/12/2026 | UAT y revisión de calidad | Acta de aceptación o lista de defectos |
| 02/12/2026 | Cierre de sustentación | Guion, capturas y documentación final |

## 9. Registro de resultados

Cada ejecución debe registrar: identificador del caso, fecha, ambiente, datos utilizados, pasos, resultado esperado, resultado obtenido, evidencia, severidad y responsable del defecto cuando aplique.

La autenticación y la conexión con la base de datos deben permanecer en estado **pendiente** hasta que se obtenga una ejecución exitosa y reproducible en la aplicación publicada.
