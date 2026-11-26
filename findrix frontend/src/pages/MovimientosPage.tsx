import { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { ShellContext } from "../components/layout/AppShell";
import { useAppData } from "../context/AppDataContext";
import { FilterTabs, type FiltroMovimiento } from "../components/movimientos/FilterTabs";
import { MovimientosList } from "../components/movimientos/MovimientosList";
import { etiquetaGrupoFecha } from "../utils/format";

export function MovimientosPage() {
  const { movimientos } = useAppData();
  const { abrirRegistro } = useOutletContext<ShellContext>();
  const [filtro, setFiltro] = useState<FiltroMovimiento>("todos");

  const filtrados = useMemo(
    () => (filtro === "todos" ? movimientos : movimientos.filter((m) => m.tipo === filtro)),
    [movimientos, filtro]
  );

  const grupos = useMemo(() => {
    const mapa = new Map<string, typeof filtrados>();
    for (const m of filtrados) {
      const etiqueta = etiquetaGrupoFecha(m.fecha);
      if (!mapa.has(etiqueta)) mapa.set(etiqueta, []);
      mapa.get(etiqueta)!.push(m);
    }
    return Array.from(mapa.entries());
  }, [filtrados]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 pt-6 sm:px-8 lg:px-10">
      <p className="font-display text-xl text-primary-dark">Movimientos</p>
      <FilterTabs valor={filtro} onChange={setFiltro} />
      <MovimientosList grupos={grupos} onRegistrar={() => abrirRegistro()} />
    </div>
  );
}