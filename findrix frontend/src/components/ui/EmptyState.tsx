import type { ReactNode } from "react";

export function EmptyState({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string;
  descripcion: string;
  accion?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-secondary/50 bg-base-soft px-5 py-7 text-center">
      <p className="text-sm font-semibold text-primary-dark">{titulo}</p>
      <p className="mt-1 text-sm text-neutral">{descripcion}</p>
      {accion && <div className="mt-4">{accion}</div>}
    </div>
  );
}
