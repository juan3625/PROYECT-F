import { useState } from "react";
import { useAppData } from "../../context/AppDataContext";
import { Icon, iconosCategoria } from "../ui/Icon";

export function NuevaCategoriaForm({ onListo }: { onListo: () => void }) {
  const { agregarCategoria } = useAppData();
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<"gasto" | "ingreso">("gasto");
  const [icono, setIcono] = useState(iconosCategoria[0]);

  const puedeGuardar = nombre.trim().length > 0;

  const guardar = () => {
    agregarCategoria({ nombre: nombre.trim(), tipo, icono });
    onListo();
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="font-display text-lg text-primary-dark">Nueva categoría</p>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la categoría"
        autoFocus
        className="rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none placeholder:text-neutral focus:border-primary"
      />

      <div>
        <p className="mb-2 text-sm font-semibold text-primary-dark">Tipo</p>
        <div className="flex gap-2 rounded-xl bg-base-soft p-1">
          <button
            onClick={() => setTipo("gasto")}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
              tipo === "gasto" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"
            }`}
          >
            Gasto
          </button>
          <button
            onClick={() => setTipo("ingreso")}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
              tipo === "ingreso" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"
            }`}
          >
            Ingreso
          </button>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-primary-dark">Ícono</p>
        <div className="grid grid-cols-6 gap-2">
          {iconosCategoria.map((nombreIcono) => (
            <button
              key={nombreIcono}
              onClick={() => setIcono(nombreIcono)}
              aria-label={nombreIcono}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                icono === nombreIcono
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-secondary/50 text-neutral"
              }`}
            >
              <Icon nombre={nombreIcono} size={18} />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={guardar}
        disabled={!puedeGuardar}
        className="rounded-xl bg-primary py-3 text-sm font-semibold text-surface transition-opacity disabled:opacity-40"
      >
        Guardar categoría
      </button>
    </div>
  );
}
