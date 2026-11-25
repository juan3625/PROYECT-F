# Findrix — Frontend (Fase 2)

Frontend real y navegable, con datos simulados (sin backend todavía), construido
sobre la definición funcional acordada tras el análisis de la entrega anterior.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (por defecto `http://localhost:5173`).

```bash
npm run build   # build de producción en dist/
```

## Paleta aplicada

"Cobre Temperado": `#B85C38` (Terracota Sutil, acción primaria), `#E0B99B`
(Beige Rosado), `#7D7D6F` (Gris Oliva), `#FAF7F2` (Lino Natural, fondo). Están
declarados como CSS variables en `src/index.css` (`@theme`), no hardcodeados
en cada componente — cambiar la marca a futuro es cambiar un solo archivo.

## Qué corrige esta versión frente a la anterior

Cada punto responde directamente a algo señalado por los evaluadores:

1. **Frontend y backend separados de verdad.** Este repo es *solo* frontend.
   No hay carpeta `back/` ni `.env` mezclados aquí.
2. **Contrato único de datos.** `src/types/index.ts` es la única definición
   de qué campos existen (`Gasto`, `Ingreso`, `MetaAhorro`, `Prestamo`,
   `Categoria`). Cuando se construya el backend, el modelo SQL y el schema
   de validación deben calcar exactamente estos campos — ni uno más, ni uno
   menos. Así no vuelve a pasar lo de `prioridad`/`estado` guardándose en el
   formulario y perdiéndose antes de llegar a la base de datos.
3. **Ruteo real con `react-router-dom`**, ya no un `switch` con
   `useState('dashboard')`. Cada pantalla tiene su URL (`/`, `/movimientos`,
   `/metas`, `/mas`, `/mas/categorias`, etc.), el botón "atrás" del navegador
   funciona y un refresh no te devuelve siempre al dashboard.
4. **Componentes separados por responsabilidad**, no un archivo de 600+
   líneas: cada pantalla vive en `src/pages/`, y la UI reutilizable
   (tarjetas de meta, ítems de movimiento, formularios del modal, barra de
   progreso) vive en `src/components/`, dividida por dominio.
5. **Estado centralizado en un solo lugar** (`src/context/AppDataContext.tsx`)
   en vez de que cada pantalla maneje su propia copia de los datos. Es el
   mismo rol que cumplirá la API una vez exista el backend — hoy simula esa
   capa con `useState` en memoria.

## Estructura

```
src/
  types/            contrato de datos (Gasto, Ingreso, MetaAhorro, Prestamo, Categoria)
  data/mockData.ts  datos simulados iniciales
  context/          estado global (reemplazo temporal de la API)
  utils/format.ts   formateo de moneda y fechas en es-CO
  components/
    layout/         AppShell (marco de teléfono), BottomNav, FAB
    ui/             piezas genéricas (Icon, ProgressBar, Sheet, SubPageHeader)
    movimientos/    FilterTabs, MovimientoItem
    metas/          MetaCard
    quickadd/       QuickAddModal + GastoForm / IngresoForm / AbonoForm
  pages/            una pantalla por archivo, mapeadas 1:1 a las rutas
```

## Qué falta (Fase 3, fuera del alcance de este entregable)

- Backend real: rutas → controladores → servicios → modelos, con el mismo
  contrato de `src/types/index.ts`.
- Autenticación con `bcrypt` real (hash, no texto plano) y JWT firmado.
- Persistencia en base de datos — hoy todo vive en memoria y se reinicia al
  recargar la página.
