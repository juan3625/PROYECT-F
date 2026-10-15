import { useState } from "react";
import { useAppData } from "../../context/AppDataContext";
import { Icon } from "../ui/Icon";
import { formatoMoneda } from "../../utils/format";
import type { AbonoOrigen } from "../layout/AppShell";

// Forma común entre MetaAhorro y Prestamo para poder listarlos igual aquí.
interface ItemAbonable {
  id: string;
  nombre: string;
  montoActual: number;
  montoTotal: number;
  icono: string;
}

export function AbonoForm({
  onListo,
  origen,
}: {
  onListo: () => void;
  origen?: AbonoOrigen;
}) {
  const { metasAhorro, prestamos, abonarMeta, abonarPrestamo } = useAppData();

  // Si vinieron desde "Abonar" en un préstamo, esta pestaña trabaja sobre
  // préstamos; en cualquier otro caso (FAB genérico, o desde una meta de
  // ahorro) trabaja sobre metas de ahorro, que sigue siendo el uso más común.
  const [tipo, setTipo] = useState<"ahorro" | "prestamo">(origen?.tipo ?? "ahorro");

  const items: ItemAbonable[] =
    tipo === "ahorro"
      ? metasAhorro.map((m) => ({ id: m.id, nombre: m.nombre, montoActual: m.montoActual, montoTotal: m.montoMeta, icono: m.icono }))
      : prestamos.map((p) => ({ id: p.id, nombre: p.nombre, montoActual: p.montoActual, montoTotal: p.montoTotal, icono: p.icono }));

  const [itemId, setItemId] = useState(origen?.id ?? items[0]?.id ?? "");
  const [monto, setMonto] = useState("");

  const cambiarTipo = (nuevoTipo: "ahorro" | "prestamo") => {
    setTipo(nuevoTipo);
    const primero = (nuevoTipo === "ahorro" ? metasAhorro[0]?.id : prestamos[0]?.id) ?? "";
    setItemId(primero);
  };

  const item = items.find((i) => i.id === itemId);
  const puedeGuardar = Number(monto) > 0 && itemId;

  const guardar = () => {
    if (tipo === "ahorro") {
      abonarMeta(itemId, Number(monto));
    } else {
      abonarPrestamo(itemId, Number(monto));
    }
    onListo();
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-2 rounded-xl bg-base-soft p-1">
        <button
          onClick={() => cambiarTipo("ahorro")}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
            tipo === "ahorro" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"
          }`}
        >
          Meta de ahorro
        </button>
        <button
          onClick={() => cambiarTipo("prestamo")}
          className={`flex-1 rounded-lg py-1.5 text-sm font-medium transition-colors ${
            tipo === "prestamo" ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"
          }`}
        >
          Préstamo
        </button>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-primary-dark">
          {tipo === "ahorro" ? "Meta" : "Préstamo"}
        </p>
        <div className="flex flex-col gap-2">
          {items.map((i) => (
            <button
              key={i.id}
              onClick={() => setItemId(i.id)}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                itemId === i.id
                  ? "border-primary bg-primary/10"
                  : "border-secondary/50"
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/40 text-primary-dark">
                <Icon nombre={i.icono} size={18} />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-medium text-primary-dark">{i.nombre}</span>
                <span className="block text-xs text-neutral">
                  {formatoMoneda(i.montoActual)} / {formatoMoneda(i.montoTotal)}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral">
          Abono a {item?.nombre ?? (tipo === "ahorro" ? "meta" : "préstamo")}
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

      <button
        onClick={guardar}
        disabled={!puedeGuardar}
        className="rounded-xl bg-primary py-3 text-sm font-semibold text-surface transition-opacity disabled:opacity-40"
      >
        Abonar
      </button>
    </div>
  );
}
