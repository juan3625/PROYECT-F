import { MovimientoItem } from "./MovimientoItem";
import type { Movimiento } from "../../types";
import { EmptyState } from "../ui/EmptyState";

type GrupoMovimientos = [string, Movimiento[]];

export function MovimientosList({ grupos, onRegistrar }: { grupos: GrupoMovimientos[]; onRegistrar: () => void }) {
  if (grupos.length === 0) {
    return (
      <EmptyState
        titulo="Aún no hay movimientos"
        descripcion="Registra un gasto o un ingreso para empezar a ver tu actividad aquí."
        accion={
          <button onClick={onRegistrar} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface">
            Registrar movimiento
          </button>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {grupos.map(([etiqueta, items]) => (
        <div key={etiqueta}>
          <p className="mb-1 text-xs font-medium text-neutral">{etiqueta}</p>
          <div className="divide-y divide-secondary/20 rounded-xl bg-surface px-3">
            {items.map((m) => (
              <MovimientoItem key={`${m.tipo}-${m.id}`} movimiento={m} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}