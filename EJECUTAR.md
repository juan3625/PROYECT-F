# Ejecutar Findrix

Esta rama contiene el frontend y el backend en el mismo repositorio.

## Instalación inicial

Desde la carpeta raíz `PROYECT-F`:

```bash
npm run install:all
```

Configura las variables reales del backend en `findrix_backend/.env`. Si todavía no existe:

```bash
cp findrix_backend/.env.example findrix_backend/.env
```

Completa ese archivo con la configuración real de PostgreSQL, JWT y el puerto del entorno. No pongas claves inventadas en el repositorio.

## Ejecutar frontend y backend

Abre dos terminales, ambas ubicadas en la raíz `PROYECT-F`.

Terminal 1, backend:

```bash
npm run dev:backend
```

Terminal 2, frontend:

```bash
npm run dev:frontend
```

También puedes ejecutar `npm run dev` para iniciar solamente el frontend.

- Frontend: `http://localhost:5173`
- Backend/API: `http://localhost:3000/api`

## Error común evitado por esta rama

No ejecutes `npm run dev` desde `main` esperando que la raíz tenga el script. Tampoco uses `cd PROYECT-F/findrix_backend` si ya estás dentro de `PROYECT-F`; en ese caso la ruta correcta sería `cd findrix_backend`. Con los scripts raíz de esta rama no necesitas cambiar de carpeta.
