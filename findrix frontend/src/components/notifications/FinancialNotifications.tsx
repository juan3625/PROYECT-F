import { AlertTriangle, Bell, X } from "lucide-react";
import { useState } from "react";
import { useFinancialNotifications } from "../../hooks/useFinancialNotifications";

export function FinancialNotifications() {
  const avisos = useFinancialNotifications();
  const [ocultos, setOcultos] = useState<string[]>([]);
  const visibles = avisos.filter((aviso) => !ocultos.includes(aviso.clave)).slice(0, 4);

  if (visibles.length === 0) return null;

  return (
    <section className="mx-4 mt-4 rounded-2xl border border-secondary/50 bg-surface p-3 shadow-sm md:mx-8" aria-label="Recordatorios financieros">
      <div className="mb-2 flex items-center gap-2">
        <Bell size={17} className="text-primary" />
        <h2 className="text-sm font-semibold text-primary-dark">Recordatorios</h2>
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
          {avisos.length}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        {visibles.map((aviso) => (
          <div key={aviso.clave} className="flex items-start gap-2 rounded-xl bg-base-soft px-3 py-2.5">
            {aviso.urgente ? <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" /> : <Bell size={16} className="mt-0.5 shrink-0 text-primary" />}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-primary-dark">{aviso.titulo}</p>
              <p className={`mt-0.5 text-[11px] ${aviso.urgente ? "font-semibold text-danger" : "text-neutral"}`}>{aviso.detalle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOcultos((actuales) => [...actuales, aviso.clave])}
              aria-label={`Ocultar recordatorio de ${aviso.titulo}`}
              className="shrink-0 rounded-md p-1 text-neutral hover:bg-surface hover:text-primary-dark"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {avisos.length > visibles.length && (
        <p className="mt-2 text-center text-[11px] text-neutral">Hay {avisos.length - visibles.length} recordatorio(s) más.</p>
      )}
    </section>
  );
}
