// Tipos centrales de Findrix.
// Estos tipos son el "contrato" único entre pantallas y datos simulados.
// Cuando se construya el backend real (Fase 3), el modelo SQL y el schema
// de validación deben calcar exactamente estos campos — ninguno de más,
// ninguno de menos. Esa fue la falla raíz de la entrega anterior.

export type EstadoGasto = "pendiente" | "pagado";
export type PrioridadGasto = "alta" | "media" | "baja";

export interface Categoria {
  id: string;
  nombre: string;
  tipo: "gasto" | "ingreso";
  icono: string; // nombre de icono lucide-react
  color: string; // token de color, ej. "primary" | "green" | "gold"
}

export interface Gasto {
  id: string;
  monto: number;
  descripcion: string;
  categoriaId: string;
  fecha: string; // ISO
  esPagoPendiente: boolean;
  estado: EstadoGasto;
  prioridad: PrioridadGasto;
  fechaVencimiento?: string; // ISO, solo si esPagoPendiente
}

export interface Ingreso {
  id: string;
  monto: number;
  descripcion: string;
  categoriaId: string;
  fecha: string; // ISO
}

export type Movimiento =
  | ({ tipo: "gasto" } & Gasto)
  | ({ tipo: "ingreso" } & Ingreso);

export interface MetaAhorro {
  id: string;
  nombre: string;
  montoActual: number;
  montoMeta: number;
  fechaMeta?: string; // ISO, opcional
  icono: string;
}

export interface Prestamo {
  id: string;
  nombre: string;
  montoActual: number;
  montoTotal: number;
  fechaMeta?: string;
  icono: string;
  tipo: "presto" | "debo"; // yo presté / yo debo
}

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
}
