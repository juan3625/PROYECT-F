import type { MetaAhorro, Prestamo } from "../../types";
import { formatoMoneda } from "../../utils/format";
import { ProgressBar } from "../ui/ProgressBar";
import { ChartEmptyState } from "./ChartEmptyState";

function porcentaje(actual: number, total: number) {
  return total > 0 ? Math.min(1, Math.max(0, actual / total)) : 0;
}

export function ProgressOverview({
  metas,
  prestamos,
}: {
  metas: MetaAhorro[];
  prestamos: Prestamo[];
}) {
  const elementos = [
    ...metas.map((meta) => ({
      id: `meta-${meta.id}`,
      nombre: meta.nombre,
      tipo: "Meta de ahorro",
      actual: meta.montoActual,
      total: meta.montoMeta,
      accion: "Falta",
    })),
    ...prestamos.map((prestamo) => ({
      id: `prestamo-${prestamo.id}`,
      nombre: prestamo.nombre,
      tipo: prestamo.tipo === "presto" ? "Te deben" : "Debes",
      actual: prestamo.montoActual,
      total: prestamo.montoTotal,
      accion: prestamo.tipo === "presto" ? "Pendiente de devolución" : "Pendiente de pago",
    })),
  ];

  return (
    <section className="rounded-2xl border border-secondary/40 bg-surface p-4" aria-label="Progreso de metas y préstamos">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-primary-dark">Progreso financiero</h2>
        <p className="text-xs text-neutral">Metas de ahorro y préstamos en seguimiento</p>
      </div>
      {elementos.length === 0 ? (
        <ChartEmptyState
          titulo="No hay metas ni préstamos todavía"
          descripcion="Crea uno para ver aquí cuánto llevas y cuánto falta."
        />
      ) : (<>
        <div className="flex flex-col gap-4">
          {elementos.slice(0, 5).map((elemento) => {
            const avance = porcentaje(elemento.actual, elemento.total);
            return (
              <div key={elemento.id}>
                <div className="mb-1.5 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-primary-dark">{elemento.nombre}</p>
                    <p className="text-neutral">{elemento.tipo} · {elemento.accion} {formatoMoneda(Math.max(0, elemento.total - elemento.actual))}</p>
                  </div>
                  <span className="shrink-0 font-semibold text-primary-dark">{Math.round(avance * 100)}%</span>
                </div>
                <ProgressBar valor={avance} />
                <p className="mt-1 text-right text-[11px] text-neutral">{formatoMoneda(elemento.actual)} de {formatoMoneda(elemento.total)}</p>
              </div>
            );
          })}
        </div>
        {elementos.length > 5 && (
          <p className="mt-3 text-xs text-neutral">Mostrando los cinco primeros elementos. Consulta Metas para ver el resto.</p>
        )}
      </>)}
    </section>
  );
}
