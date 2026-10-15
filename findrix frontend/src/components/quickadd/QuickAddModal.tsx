import { useEffect, useState } from "react";
import { Sheet } from "../ui/Sheet";
import { GastoForm } from "./GastoForm";
import { IngresoForm } from "./IngresoForm";
import { AbonoForm } from "./AbonoForm";
import type { AbonoOrigen } from "../layout/AppShell";

type Tab = "gasto" | "ingreso" | "abono";

const tabs: { id: Tab; label: string }[] = [
  { id: "gasto", label: "Gasto" },
  { id: "ingreso", label: "Ingreso" },
  { id: "abono", label: "Abono" },
];

export function QuickAddModal({
  abierto,
  onCerrar,
  tabInicial = "gasto",
  origenAbono,
}: {
  abierto: boolean;
  onCerrar: () => void;
  tabInicial?: Tab;
  origenAbono?: AbonoOrigen;
}) {
  const [tab, setTab] = useState<Tab>(tabInicial);

  // Cada vez que se abre el sheet, sincroniza la pestaña con la que pidió
  // quien lo invocó (por ejemplo "Abonar" en una meta o en un préstamo).
  useEffect(() => {
    if (abierto) setTab(tabInicial);
  }, [abierto, tabInicial]);

  return (
    <Sheet abierto={abierto} onCerrar={onCerrar}>
      <div className="mb-4 flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-primary text-surface"
                : "bg-base-soft text-neutral"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "gasto" && <GastoForm onListo={onCerrar} />}
      {tab === "ingreso" && <IngresoForm onListo={onCerrar} />}
      {tab === "abono" && <AbonoForm onListo={onCerrar} origen={origenAbono} />}
    </Sheet>
  );
}
