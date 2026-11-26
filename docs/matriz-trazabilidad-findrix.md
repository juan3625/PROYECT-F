# Matriz de trazabilidad de FINDRIX

| Requisito / PBI | Caso de uso | Casos de prueba | Criterio de aceptación resumido | Responsable | Estado actual |
|---|---|---|---|---|---|
| PBI001 Registro | Registrarse | CP-AUTH-001, CP-AUTH-002, CP-AUTH-003 | Cuenta válida creada; datos inválidos rechazados; duplicados controlados | Desarrollo + QA | Pendiente de validación en producción |
| PBI002 Login | Iniciar sesión | CP-AUTH-004, CP-AUTH-005 | Credenciales válidas permiten acceso; inválidas son rechazadas | Desarrollo + QA | Pendiente de validación en producción |
| PBI003 Cierre de sesión | Cerrar sesión | CP-AUTH-006 | Sesión eliminada y rutas protegidas bloqueadas | Desarrollo + QA | Pendiente de validación |
| PBI004 Gastos | Registrar gasto | CP-FIN-001, CP-FIN-002 | Gasto válido persistido; valor inválido rechazado | Desarrollo | Implementado; requiere prueba completa |
| PBI005 Ingresos | Registrar ingreso | CP-FIN-003, CP-FIN-004 | Ingreso válido visible en movimientos y resumen | Desarrollo | Implementado; requiere prueba completa |
| PBI006 Movimientos | Consultar movimientos | CP-FIN-005 | Solo se muestran datos del usuario y filtros correctos | Desarrollo + QA | Implementado; requiere prueba |
| PBI007 Categorías | Gestionar categorías | CP-FIN-006, CP-FIN-007 | Crear, editar y controlar eliminación | Desarrollo | Implementado; requiere prueba |
| PBI008 Metas | Gestionar metas de ahorro | CP-FIN-008, CP-FIN-009 | Meta y abono actualizan progreso | Desarrollo | Implementado; requiere prueba |
| PBI009 Préstamos | Gestionar préstamos y pagos | CP-FIN-010, CP-FIN-011 | Pago reduce saldo sin inconsistencia | Desarrollo | Implementado; requiere prueba |
| PBI010 Cash-first | Gestionar economía cash-first | CP-FIN-012, CP-FIN-013 | Efectivo y caja chica se reflejan en la aplicación | Desarrollo + QA | Implementado; requiere prueba |
| PBI011 Reportes | Consultar gráficas y reportes | CP-REP-001, CP-REP-002 | Totales y gráficas coinciden con datos | Desarrollo + QA | Implementado; requiere prueba |
| PBI012 Preferencias | Personalizar preferencias | CP-UX-001, CP-UX-002 | Tema, acento y tamaño se aplican y conservan | Frontend + QA | Implementado; requiere prueba |
| PBI013 PWA/responsive | Usar FINDRIX en móvil | CP-UX-003, CP-UX-004 | No hay desbordamiento ni superposición; manifest disponible | Frontend + QA | Implementado; requiere prueba |
| PBI014 Despliegue | Configurar despliegue | CP-OPS-001, CP-OPS-002 | Variables separadas y secretos fuera de GitHub | Desarrollo + DevOps | Variables configuradas; conexión por confirmar |
| PBI015 Calidad | Ejecutar pruebas funcionales | CP-QA-001, CP-QA-002 | Casos críticos ejecutados y evidencias conservadas | QA + Product Owner | Pendiente |

## Catálogo inicial de casos

| ID | Descripción | Datos inválidos incluidos |
|---|---|---|
| CP-AUTH-001 | Registro con datos válidos | No |
| CP-AUTH-002 | Registro con correo inválido | Sí |
| CP-AUTH-003 | Registro con contraseña menor de 8 caracteres | Sí |
| CP-AUTH-004 | Login con credenciales válidas | No |
| CP-AUTH-005 | Login con credenciales inválidas | Sí |
| CP-AUTH-006 | Cierre de sesión y acceso protegido | No |
| CP-FIN-001 | Crear gasto positivo | No |
| CP-FIN-002 | Crear gasto vacío, textual o negativo | Sí |
| CP-FIN-003 | Crear ingreso válido | No |
| CP-FIN-004 | Crear ingreso inválido | Sí |
| CP-FIN-005 | Consultar y filtrar movimientos | Sí: filtro sin resultados |
| CP-FIN-006 | Crear y editar categoría | No |
| CP-FIN-007 | Eliminar categoría utilizada | Sí: operación no permitida |
| CP-FIN-008 | Crear meta y abono | No |
| CP-FIN-009 | Abono inválido o superior al objetivo | Sí |
| CP-FIN-010 | Crear préstamo y registrar pago | No |
| CP-FIN-011 | Pago mayor al saldo permitido | Sí |
| CP-FIN-012 | Registrar efectivo y caja chica | No |
| CP-FIN-013 | Efectivo con valor inválido | Sí |
| CP-REP-001 | Validar resumen y gráficas | No |
| CP-REP-002 | Consultar periodo sin datos | Sí |
| CP-UX-001 | Cambiar tema y preferencias | No |
| CP-UX-002 | Recargar y conservar preferencias | No |
| CP-UX-003 | Recorrido responsive | No |
| CP-UX-004 | Manifest, PWA y superposición visual | No |
| CP-OPS-001 | Verificar variables y URL de API | Sí: variable ausente |
| CP-OPS-002 | Verificar conexión API–PostgreSQL | Sí: conexión inválida |
| CP-QA-001 | Ejecutar regresión de módulos | No |
| CP-QA-002 | Consolidar evidencias y defectos | No |
