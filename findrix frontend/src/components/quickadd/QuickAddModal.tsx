import { useEffect, useState } from "react";
import { Sheet } from "../ui/Sheet";
import { GastoForm } from "./GastoForm";
import { IngresoForm } from "./IngresoForm";
import { AbonoForm } from "./AbonoForm";
import type { AbonoOrigen } from "../layout/AppShell";

type Tab = "gasto" | "ingreso" | "abono";

const tabs: { id: Tab; label: string; ayuda: string }[] = [
  { id: "gasto", label: "Registrar gasto", ayuda: "Dinero que sale" },
  { id: "ingreso", label: "Registrar ingreso", ayuda: "Dinero que entra" },
  { id: "abono", label: "Agregar o pagar", ayuda: "Meta o préstamo" },
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
      <div className="mb-4">
        <p className="mb-3 font-display text-lg text-primary-dark">¿Qué quieres registrar?</p>
        <div className="flex gap-2">
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
            <span>{t.label}</span>
            <span className="mt-0.5 block text-[10px] font-normal opacity-80">{t.ayuda}</span>
          </button>
        ))}
        </div>
      </div>

      {tab === "gasto" && <GastoForm onListo={onCerrar} />}
      {tab === "ingreso" && <IngresoForm onListo={onCerrar} />}
      {tab === "abono" && <AbonoForm onListo={onCerrar} origen={origenAbono} />}
    </Sheet>
  );
}
