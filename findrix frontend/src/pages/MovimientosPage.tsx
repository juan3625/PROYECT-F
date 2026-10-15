import { useMemo, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { FilterTabs, type FiltroMovimiento } from "../components/movimientos/FilterTabs";
import { MovimientosList } from "../components/movimientos/MovimientosList";
import { etiquetaGrupoFecha } from "../utils/format";

export function MovimientosPage() {
  const { movimientos } = useAppData();
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
    <div className="flex flex-col gap-5 px-5 pt-6">
      <p className="font-display text-xl text-primary-dark">Movimientos</p>
      <FilterTabs valor={filtro} onChange={setFiltro} />
      <MovimientosList grupos={grupos} />
    </div>
  );
}