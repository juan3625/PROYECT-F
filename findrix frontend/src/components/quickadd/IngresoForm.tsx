import { useState } from "react";
import { useAppData } from "../../context/AppDataContext";
import { Icon } from "../ui/Icon";

export function IngresoForm({ onListo }: { onListo: () => void }) {
  const { categorias, agregarIngreso } = useAppData();
  const categoriasIngreso = categorias.filter((c) => c.tipo === "ingreso");

  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoriaId, setCategoriaId] = useState(categoriasIngreso[0]?.id ?? "");

  const puedeGuardar = Number(monto) > 0 && categoriaId;

  const guardar = () => {
    agregarIngreso({
      monto: Number(monto),
      descripcion:
        descripcion.trim() || categoriasIngreso.find((c) => c.id === categoriaId)?.nombre || "Ingreso",
      categoriaId,
    });
    onListo();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral">Monto</p>
        <div className="flex items-center justify-center gap-1">
          <span className="font-display text-3xl text-green">$</span>
          <input
            inputMode="numeric"
            value={monto}
            onChange={(e) => setMonto(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            className="w-40 bg-transparent text-center font-display text-4xl text-green outline-none placeholder:text-secondary"
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
          {categoriasIngreso.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoriaId(c.id)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                categoriaId === c.id
                  ? "border-green bg-green/10 text-green"
                  : "border-secondary/50 text-neutral"
              }`}
            >
              <Icon nombre={c.icono} size={16} />
              {c.nombre}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={guardar}
        disabled={!puedeGuardar}
        className="rounded-xl bg-green py-3 text-sm font-semibold text-surface transition-opacity disabled:opacity-40"
      >
        Guardar ingreso
      </button>
    </div>
  );
}
