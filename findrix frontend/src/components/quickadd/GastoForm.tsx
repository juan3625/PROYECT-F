import { useState } from "react";
import { useAppData } from "../../context/AppDataContext";
import { Icon } from "../ui/Icon";
import type { PrioridadGasto } from "../../types";

const hoyLegible = new Date().toLocaleDateString("es-CO", {
  day: "numeric",
  month: "short",
});

const prioridades: { id: PrioridadGasto; label: string }[] = [
  { id: "baja", label: "Baja" },
  { id: "media", label: "Media" },
  { id: "alta", label: "Alta" },
];

export function GastoForm({ onListo }: { onListo: () => void }) {
  const { categorias, agregarGasto } = useAppData();
  const categoriasGasto = categorias.filter((c) => c.tipo === "gasto");

  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState(categoriasGasto[0]?.id ?? "");
  const [esPendiente, setEsPendiente] = useState(false);
  const [prioridad, setPrioridad] = useState<PrioridadGasto>("media");
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  const puedeGuardar = Number(monto) > 0 && categoriaId && (!esPendiente || fechaVencimiento);

  const guardar = () => {
    agregarGasto({
      monto: Number(monto),
      descripcion: descripcion.trim() || categoriasGasto.find((c) => c.id === categoriaId)?.nombre || "Gasto",
      categoriaId,
      esPagoPendiente: esPendiente,
      prioridad,
      fechaVencimiento: esPendiente ? fechaVencimiento : undefined,
    });
    onListo();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral">Monto</p>
        <div className="flex items-center justify-center gap-1">
          <span className="font-display text-3xl text-primary-dark">$</span>
          <input
            inputMode="numeric"
            value={monto}
            onChange={(e) => setMonto(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            className="w-40 bg-transparent text-center font-display text-4xl text-primary-dark outline-none placeholder:text-secondary"
          />
        </div>
      </div>

      <input
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción (opcional)"
        className="rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none placeholder:text-neutral focus:border-primary"
      />

      <div>
        <p className="mb-2 text-sm font-semibold text-primary-dark">Categoría</p>
        <div className="flex flex-wrap gap-2">
          {categoriasGasto.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoriaId(c.id)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                categoriaId === c.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-secondary/50 text-neutral"
              }`}
            >
              <Icon nombre={c.icono} size={16} />
              {c.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-base-soft px-4 py-3">
        <span className="text-sm text-primary-dark">Fecha</span>
        <span className="text-sm font-semibold text-neutral">Hoy, {hoyLegible}</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-primary-dark">¿Es un pago pendiente?</span>
        <button
          role="switch"
          aria-checked={esPendiente}
          onClick={() => setEsPendiente((v) => !v)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            esPendiente ? "bg-primary" : "bg-secondary/60"
          }`}
        >
          <span
            className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-surface shadow transition-transform ${
              esPendiente ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {esPendiente && (
        <div className="flex flex-col gap-3 rounded-xl border border-secondary/50 bg-base-soft p-4">
          <div>
            <p className="mb-1 text-xs font-medium text-neutral">Prioridad</p>
            <div className="flex gap-2">
              {prioridades.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPrioridad(p.id)}
                  className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors ${
                    prioridad === p.id
                      ? "bg-primary text-surface"
                      : "bg-surface text-neutral"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-medium text-neutral">Fecha límite de pago</span>
            <input
              type="date"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              className="rounded-lg border border-secondary/50 bg-surface px-3 py-2 text-sm text-primary-dark outline-none focus:border-primary"
            />
          </label>
          <p className="text-xs text-neutral">
            Te avisamos en “Próximos a vencer” según la prioridad y la fecha límite.
          </p>
        </div>
      )}

      <button
        onClick={guardar}
        disabled={!puedeGuardar}
        className="rounded-xl bg-primary py-3 text-sm font-semibold text-surface transition-opacity disabled:opacity-40"
      >
        Guardar gasto
      </button>
    </div>
  );
}
