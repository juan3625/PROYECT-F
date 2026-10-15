import { useAppData } from "../../context/AppDataContext";
import { Icon } from "../ui/Icon";
import { formatoMoneda } from "../../utils/format";
import type { Movimiento } from "../../types";

export function MovimientoItem({ movimiento }: { movimiento: Movimiento }) {
  const { categoriaPorId, marcarGastoPagado } = useAppData();
  const categoria = categoriaPorId(movimiento.categoriaId);
  const esIngreso = movimiento.tipo === "ingreso";
  // Solo un gasto puede estar pendiente de pago — un ingreso nunca tiene "estado".
  const esGastoPendiente = movimiento.tipo === "gasto" && movimiento.estado === "pendiente";

  return (
    <div className="flex items-center gap-3 rounded-xl px-1 py-2">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          esIngreso ? "bg-green/15 text-green" : "bg-primary/15 text-primary"
        }`}
      >
        <Icon nombre={categoria?.icono ?? "Wallet"} size={18} />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block truncate text-sm font-medium text-primary-dark">
          {movimiento.descripcion}
        </span>
        <span className="block text-xs text-neutral">{categoria?.nombre ?? "Otro"}</span>
      </span>
      {esGastoPendiente && (
        <button
          onClick={() => marcarGastoPagado(movimiento.id)}
          className="shrink-0 rounded-lg border border-primary/50 px-2.5 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Marcar pagado
        </button>
      )}
      <span className={`shrink-0 text-sm font-semibold ${esIngreso ? "text-green" : "text-danger"}`}>
        {esIngreso ? "+" : "-"}
        {formatoMoneda(movimiento.monto)}
      </span>
    </div>
  );
}
