import type { ReactNode } from "react";

export function Sheet({
  abierto,
  onCerrar,
  children,
}: {
  abierto: boolean;
  onCerrar: () => void;
  children: ReactNode;
}) {
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center md:items-center md:p-6">
      <button
        aria-label="Cerrar"
        onClick={onCerrar}
        className="absolute inset-0 bg-primary-dark/40"
      />
      <div className="relative z-10 max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-surface px-5 pb-6 pt-3 shadow-2xl md:max-w-lg md:rounded-3xl md:px-7 md:pt-5">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-secondary/60 md:hidden" />
        {children}
      </div>
    </div>
  );
}
