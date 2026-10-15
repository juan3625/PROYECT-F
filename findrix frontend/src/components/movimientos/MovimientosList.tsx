import { MovimientoItem } from "./MovimientoItem";
import type { Movimiento } from "../../types";

type GrupoMovimientos = [string, Movimiento[]];

export function MovimientosList({ grupos }: { grupos: GrupoMovimientos[] }) {
  if (grupos.length === 0) {
    return (
      <p className="rounded-xl bg-base-soft px-4 py-6 text-center text-sm text-neutral">
        Todavía no hay movimientos en esta categoría.
      </p>
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