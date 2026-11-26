import { useMemo } from "react";
import { useAppData } from "../context/AppDataContext";
import { SubPageHeader } from "../components/ui/SubPageHeader";
import { Icon } from "../components/ui/Icon";
import { formatoMoneda } from "../utils/format";
import { ProgressBar } from "../components/ui/ProgressBar";
import { EmptyState } from "../components/ui/EmptyState";
import { useOutletContext } from "react-router-dom";
import type { ShellContext } from "../components/layout/AppShell";

export function ReportesPage() {
  const { gastosDelMes, categorias, totalGastosMes } = useAppData();
  const { abrirRegistro } = useOutletContext<ShellContext>();

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const g of gastosDelMes) {
      mapa.set(g.categoriaId, (mapa.get(g.categoriaId) ?? 0) + g.monto);
    }
    return Array.from(mapa.entries())
      .map(([categoriaId, total]) => ({
        categoria: categorias.find((c) => c.id === categoriaId),
        total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [gastosDelMes, categorias]);

  return (
    <div className="flex flex-col gap-5 pb-4">
      <SubPageHeader titulo="Reportes" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 sm:px-8 lg:px-10">
        <p className="text-sm text-neutral">Gastos por categoría este mes</p>
        {porCategoria.length === 0 ? (
          <EmptyState
            titulo="Aún no hay gastos este mes"
            descripcion="Registra un gasto para ver cómo se distribuye tu dinero."
            accion={<button onClick={() => abrirRegistro({ tab: "gasto" })} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface">Registrar gasto</button>}
          />
        ) : (
          <div className="flex flex-col gap-4">
          {porCategoria.map(({ categoria, total }) => (
            <div key={categoria?.id}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-primary-dark">
                  <Icon nombre={categoria?.icono ?? "Wallet"} size={15} className="text-neutral" />
                  {categoria?.nombre ?? "Otro"}
                </span>
                <span className="text-neutral">{formatoMoneda(total)}</span>
              </div>
              <ProgressBar valor={totalGastosMes ? total / totalGastosMes : 0} />
            </div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
