import { Icon } from "../ui/Icon";
import { ProgressBar } from "../ui/ProgressBar";
import { formatoMoneda } from "../../utils/format";

export function MetaCard({
  nombre,
  icono,
  montoActual,
  montoTotal,
  etiquetaFecha,
  onAbonar,
}: {
  nombre: string;
  icono: string;
  montoActual: number;
  montoTotal: number;
  etiquetaFecha?: string;
  onAbonar: () => void;
}) {
  return (
    <div className="rounded-2xl border border-secondary/40 bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/40 text-primary-dark">
            <Icon nombre={icono} size={18} />
          </span>
          <span className="text-sm font-semibold text-primary-dark">{nombre}</span>
        </div>
        <span className="text-xs text-neutral">{etiquetaFecha ?? "Sin fecha"}</span>
      </div>

      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-semibold text-primary-dark">{formatoMoneda(montoActual)}</span>
        <span className="text-neutral">{formatoMoneda(montoTotal)}</span>
      </div>
      <ProgressBar valor={montoActual / montoTotal} />

      <button
        onClick={onAbonar}
        className="mt-3 w-full rounded-xl border border-primary py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-surface"
      >
        Abonar
      </button>
    </div>
  );
}
