import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { MetaCard } from "../components/metas/MetaCard";
import { NuevaMetaForm } from "../components/metas/NuevaMetaForm";
import { Sheet } from "../components/ui/Sheet";
import type { ShellContext } from "../components/layout/AppShell";

type Tab = "ahorros" | "prestamos";

export function MetasPage() {
  const { metasAhorro, prestamos } = useAppData();
  const { abrirRegistro } = useOutletContext<ShellContext>();
  const [tab, setTab] = useState<Tab>("ahorros");
  const [creando, setCreando] = useState(false);

  return (
    <div className="flex flex-col gap-5 px-5 pt-6">
      <p className="font-display text-xl text-primary-dark">Metas</p>

      <div className="flex gap-2 rounded-xl bg-base-soft p-1">
        <button
          onClick={() => setTab("ahorros")}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
            tab === "ahorros" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"
          }`}
        >
          Ahorros
        </button>
        <button
          onClick={() => setTab("prestamos")}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
            tab === "prestamos" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"
          }`}
        >
          Préstamos
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {tab === "ahorros"
          ? metasAhorro.map((m) => (
              <MetaCard
                key={m.id}
                nombre={m.nombre}
                icono={m.icono}
                montoActual={m.montoActual}
                montoTotal={m.montoMeta}
                etiquetaFecha={m.fechaMeta ? `Meta: ${etiquetaMes(m.fechaMeta)}` : undefined}
                onAbonar={() =>
                  abrirRegistro({ tab: "abono", origenAbono: { tipo: "ahorro", id: m.id } })
                }
              />
            ))
          : prestamos.map((p) => (
              <MetaCard
                key={p.id}
                nombre={p.nombre}
                icono={p.icono}
                montoActual={p.montoActual}
                montoTotal={p.montoTotal}
                etiquetaFecha={p.tipo === "presto" ? "Te deben" : "Debes"}
                onAbonar={() =>
                  abrirRegistro({ tab: "abono", origenAbono: { tipo: "prestamo", id: p.id } })
                }
              />
            ))}
      </div>

      <button
        onClick={() => setCreando(true)}
        className="rounded-xl border border-dashed border-primary/60 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
      >
        {tab === "ahorros" ? "+ Nueva meta de ahorro" : "+ Nuevo préstamo"}
      </button>

      <Sheet abierto={creando} onCerrar={() => setCreando(false)}>
        <NuevaMetaForm
          tipoInicial={tab === "ahorros" ? "ahorro" : "prestamo"}
          onListo={() => setCreando(false)}
        />
      </Sheet>
    </div>
  );
}

function etiquetaMes(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-CO", { month: "short", year: "numeric" });
}
