import { useState } from "react";
import { useAppData } from "../../context/AppDataContext";
import { Icon, iconosCategoria } from "../ui/Icon";

export function NuevaMetaForm({
  tipoInicial,
  onListo,
}: {
  tipoInicial: "ahorro" | "prestamo";
  onListo: () => void;
}) {
  const { crearMeta, crearPrestamo } = useAppData();
  const [nombre, setNombre] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaMeta, setFechaMeta] = useState("");
  const [tipoPrestamo, setTipoPrestamo] = useState<"presto" | "debo">("debo");
  const [icono, setIcono] = useState(iconosCategoria[0]);

  const puedeGuardar = nombre.trim().length > 0 && Number(monto) > 0;

  const guardar = () => {
    if (tipoInicial === "ahorro") {
      crearMeta({
        nombre: nombre.trim(),
        montoMeta: Number(monto),
        fechaMeta: fechaMeta || undefined,
        icono,
      });
    } else {
      crearPrestamo({
        nombre: nombre.trim(),
        montoTotal: Number(monto),
        tipo: tipoPrestamo,
        icono,
      });
    }
    onListo();
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="font-display text-lg text-primary-dark">
        {tipoInicial === "ahorro" ? "Nueva meta de ahorro" : "Nuevo préstamo"}
      </p>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder={tipoInicial === "ahorro" ? "Nombre de la meta" : "Nombre (ej. Préstamo a Juan)"}
        autoFocus
        className="rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none placeholder:text-neutral focus:border-primary"
      />

      {tipoInicial === "prestamo" && (
        <div className="flex gap-2 rounded-xl bg-base-soft p-1">
          <button
            onClick={() => setTipoPrestamo("debo")}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
              tipoPrestamo === "debo" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"
            }`}
          >
            Yo debo
          </button>
          <button
            onClick={() => setTipoPrestamo("presto")}
            className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
              tipoPrestamo === "presto" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"
            }`}
          >
            Me deben
          </button>
        </div>
      )}

      <div className="text-center">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral">
          {tipoInicial === "ahorro" ? "Monto de la meta" : "Monto total"}
        </p>
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

      {tipoInicial === "ahorro" && (
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium text-neutral">Fecha meta (opcional)</span>
          <input
            type="date"
            value={fechaMeta}
            onChange={(e) => setFechaMeta(e.target.value)}
            className="rounded-lg border border-secondary/50 bg-base-soft px-3 py-2 text-sm text-primary-dark outline-none focus:border-primary"
          />
        </label>
      )}

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
        Guardar
      </button>
    </div>
  );
}
