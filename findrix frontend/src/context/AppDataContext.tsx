import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "../api/client";
import type { Categoria, Gasto, Ingreso, MetaAhorro, Movimiento, Prestamo } from "../types";

interface NuevoGastoInput {
  monto: number;
  descripcion: string;
  categoriaId: string;
  esPagoPendiente: boolean;
  prioridad: Gasto["prioridad"];
  fechaVencimiento?: string;
}

interface NuevoIngresoInput {
  monto: number;
  descripcion: string;
  categoriaId: string;
}

interface NuevaCategoriaInput {
  nombre: string;
  tipo: "gasto" | "ingreso";
  icono: string;
}

interface NuevaMetaInput {
  nombre: string;
  montoMeta: number;
  fechaMeta?: string;
  icono: string;
}

interface NuevoPrestamoInput {
  nombre: string;
  montoTotal: number;
  tipo: Prestamo["tipo"];
  icono: string;
}

interface AppDataContextValue {
  categorias: Categoria[];
  gastos: Gasto[];
  ingresos: Ingreso[];
  gastosDelMes: Gasto[];
  metasAhorro: MetaAhorro[];
  prestamos: Prestamo[];
  movimientos: Movimiento[];
  totalIngresosMes: number;
  totalGastosMes: number;
  balanceMes: number;
  proximosAVencer: Gasto[];
  cargando: boolean;
  agregarGasto: (input: NuevoGastoInput) => Promise<void>;
  agregarIngreso: (input: NuevoIngresoInput) => Promise<void>;
  abonarMeta: (metaId: string, monto: number) => Promise<void>;
  abonarPrestamo: (prestamoId: string, monto: number) => Promise<void>;
  marcarGastoPagado: (gastoId: string) => Promise<void>;
  agregarCategoria: (input: NuevaCategoriaInput) => Promise<void>;
  crearMeta: (input: NuevaMetaInput) => Promise<void>;
  crearPrestamo: (input: NuevoPrestamoInput) => Promise<void>;
  categoriaPorId: (id: string) => Categoria | undefined;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

function fechaLocalISO(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dia}`;
}

function mesActualISO(): string {
  return fechaLocalISO().slice(0, 7);
}

function esDeEsteMes(fechaISO: string): boolean {
  return fechaISO.startsWith(mesActualISO());
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  // AppDataProvider solo se monta dentro de <RequireAuth>, que ya garantiza
  // que hay una sesión activa (y por lo tanto un token) — por eso el "!" es
  // seguro aquí y no en cualquier otro lugar del árbol.
  const { token } = useAuth();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [metasAhorro, setMetasAhorro] = useState<MetaAhorro[]>([]);
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [cargando, setCargando] = useState(true);

  // Carga inicial: las 5 listas en paralelo contra el backend real.
  useEffect(() => {
    if (!token) return;
    let cancelado = false;

    setCargando(true);
    Promise.all([
      apiFetch<Categoria[]>("/categorias", {}, token),
      apiFetch<Gasto[]>("/gastos", {}, token),
      apiFetch<Ingreso[]>("/ingresos", {}, token),
      apiFetch<MetaAhorro[]>("/metas-ahorro", {}, token),
      apiFetch<Prestamo[]>("/prestamos", {}, token),
    ])
      .then(([cat, gas, ing, metas, prest]) => {
        if (cancelado) return;
        setCategorias(cat);
        setGastos(gas);
        setIngresos(ing);
        setMetasAhorro(metas);
        setPrestamos(prest);
      })
      .catch((err) => {
        // Si falla la carga inicial (ej. backend caído), lo dejamos en
        // consola — las pantallas simplemente ven listas vacías.
        console.error("No se pudieron cargar los datos de Findrix:", err);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [token]);

  const categoriaPorId = (catId: string) => categorias.find((c) => c.id === catId);

  const agregarGasto = async (input: NuevoGastoInput) => {
    const nuevo = await apiFetch<Gasto>(
      "/gastos",
      { method: "POST", body: JSON.stringify({ ...input, fecha: fechaLocalISO() }) },
      token
    );
    setGastos((prev) => [nuevo, ...prev]);
  };

  const agregarIngreso = async (input: NuevoIngresoInput) => {
    const nuevo = await apiFetch<Ingreso>(
      "/ingresos",
      { method: "POST", body: JSON.stringify({ ...input, fecha: fechaLocalISO() }) },
      token
    );
    setIngresos((prev) => [nuevo, ...prev]);
  };

  const abonarMeta = async (metaId: string, monto: number) => {
    const actualizada = await apiFetch<MetaAhorro>(
      `/metas-ahorro/${metaId}/abonos`,
      { method: "POST", body: JSON.stringify({ monto }) },
      token
    );
    setMetasAhorro((prev) => prev.map((m) => (m.id === metaId ? actualizada : m)));
  };

  const abonarPrestamo = async (prestamoId: string, monto: number) => {
    const actualizado = await apiFetch<Prestamo>(
      `/prestamos/${prestamoId}/abonos`,
      { method: "POST", body: JSON.stringify({ monto }) },
      token
    );
    setPrestamos((prev) => prev.map((p) => (p.id === prestamoId ? actualizado : p)));
  };

  const marcarGastoPagado = async (gastoId: string) => {
    const actualizado = await apiFetch<Gasto>(
      `/gastos/${gastoId}/marcar-pagado`,
      { method: "PATCH" },
      token
    );
    setGastos((prev) => prev.map((g) => (g.id === gastoId ? actualizado : g)));
  };

  const agregarCategoria = async (input: NuevaCategoriaInput) => {
    const nueva = await apiFetch<Categoria>(
      "/categorias",
      { method: "POST", body: JSON.stringify(input) },
      token
    );
    setCategorias((prev) => [...prev, nueva]);
  };

  const crearMeta = async (input: NuevaMetaInput) => {
    const nueva = await apiFetch<MetaAhorro>(
      "/metas-ahorro",
      { method: "POST", body: JSON.stringify(input) },
      token
    );
    setMetasAhorro((prev) => [...prev, nueva]);
  };

  const crearPrestamo = async (input: NuevoPrestamoInput) => {
    const nuevo = await apiFetch<Prestamo>(
      "/prestamos",
      { method: "POST", body: JSON.stringify(input) },
      token
    );
    setPrestamos((prev) => [...prev, nuevo]);
  };

  const movimientos: Movimiento[] = useMemo(() => {
    const g: Movimiento[] = gastos.map((x) => ({ tipo: "gasto", ...x }));
    const i: Movimiento[] = ingresos.map((x) => ({ tipo: "ingreso", ...x }));
    return [...g, ...i].sort((a, b) => (a.fecha < b.fecha ? 1 : -1));
  }, [gastos, ingresos]);

  const gastosDelMes = useMemo(() => gastos.filter((g) => esDeEsteMes(g.fecha)), [gastos]);
  const ingresosDelMes = useMemo(() => ingresos.filter((i) => esDeEsteMes(i.fecha)), [ingresos]);
  const totalGastosMes = useMemo(
    () => gastosDelMes.reduce((sum, g) => sum + g.monto, 0),
    [gastosDelMes]
  );
  const totalIngresosMes = useMemo(
    () => ingresosDelMes.reduce((sum, i) => sum + i.monto, 0),
    [ingresosDelMes]
  );
  const balanceMes = totalIngresosMes - totalGastosMes;

  const proximosAVencer = useMemo(
    () =>
      gastos
        .filter((g) => g.estado === "pendiente" && g.fechaVencimiento)
        .sort((a, b) => (a.fechaVencimiento! < b.fechaVencimiento! ? -1 : 1)),
    [gastos]
  );

  const value: AppDataContextValue = {
    categorias,
    gastos,
    ingresos,
    gastosDelMes,
    metasAhorro,
    prestamos,
    movimientos,
    totalIngresosMes,
    totalGastosMes,
    balanceMes,
    proximosAVencer,
    cargando,
    agregarGasto,
    agregarIngreso,
    abonarMeta,
    abonarPrestamo,
    marcarGastoPagado,
    agregarCategoria,
    crearMeta,
    crearPrestamo,
    categoriaPorId,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData debe usarse dentro de <AppDataProvider>");
  return ctx;
}
