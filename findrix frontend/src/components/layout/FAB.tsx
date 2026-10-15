import { Plus } from "lucide-react";

export function FAB({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Registrar movimiento"
      className="absolute bottom-20 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-surface shadow-lg shadow-primary/30 transition-transform active:scale-95"
    >
      <Plus size={26} strokeWidth={2.5} />
    </button>
  );
}
