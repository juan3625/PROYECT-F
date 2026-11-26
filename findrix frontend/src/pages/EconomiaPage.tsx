import { useMemo, useState } from "react";
import { Banknote, CalendarClock, Plus, TrendingDown, WalletCards } from "lucide-react";
import { useAppData } from "../context/AppDataContext";
import { SubPageHeader } from "../components/ui/SubPageHeader";
import { formatoMoneda } from "../utils/format";
import { fuenteLabel, guardarCaja, leerCaja, promedioDiarioGasto, saldoEfectivo, type CashEntry, type CashEntrySource } from "../utils/cashFirst";

const fuentes: { value: CashEntrySource; label: string }[] = [
  { value: "efectivo", label: "Efectivo" },
  { value: "propina", label: "Propina" },
  { value: "trabajo-extra", label: "Trabajo extra" },
  { value: "whatsapp", label: "Venta por WhatsApp" },
  { value: "venta", label: "Venta directa" },
  { value: "otro", label: "Otro" },
];

function fechaHoy() {
  return new Date().toISOString().slice(0, 10);
}

export function EconomiaPage() {
  const { gastos } = useAppData();
  const [entries, setEntries] = useState<CashEntry[]>(leerCaja);
  const [tipo, setTipo] = useState<"ingreso" | "gasto">("ingreso");
  const [fuente, setFuente] = useState<CashEntrySource>("efectivo");
  const [monto, setMonto] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const saldo = saldoEfectivo(entries);
  const promedio = promedioDiarioGasto(entries);
  const diasRestantes = promedio > 0 && saldo > 0 ? Math.floor(saldo / promedio) : null;
  const huella = useMemo(() => calcularHuellaInflacion(gastos), [gastos]);
  const ultimos = entries.slice().sort((a, b) => b.fecha.localeCompare(a.fecha)).slice(0, 5);

  const registrar = () => {
    const valor = Number(monto);
    if (!Number.isFinite(valor) || valor <= 0) return;
    const nuevo: CashEntry = {
      id: crypto.randomUUID(), tipo, fuente, monto: valor,
      descripcion: descripcion.trim() || fuenteLabel(fuente), fecha: fechaHoy(),
    };
    const actualizados = [nuevo, ...entries];
    setEntries(actualizados); guardarCaja(actualizados);
    setMonto(""); setDescripcion("");
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <SubPageHeader titulo="Economía informal" />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-5 sm:px-8 lg:px-10">
        <section className="rounded-2xl bg-primary-dark p-5 text-base">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs uppercase tracking-wide text-secondary">Caja chica digital</p><p className="mt-1 font-display text-3xl">{formatoMoneda(saldo)}</p><p className="mt-1 text-xs text-secondary/80">Efectivo real registrado en este dispositivo</p></div>
            <WalletCards className="text-secondary" aria-hidden="true" />
          </div>
          <div className="mt-4 rounded-xl bg-white/10 px-3 py-2 text-sm text-secondary">
            {diasRestantes === null ? "Registra algunos gastos de efectivo para proyectar tu autonomía." : diasRestantes === 0 ? "Tu efectivo podría agotarse hoy. Revisa los gastos próximos." : `Al ritmo actual, tu efectivo alcanza aproximadamente ${diasRestantes} ${diasRestantes === 1 ? "día" : "días"}.`}
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/40 bg-surface p-4">
          <div className="mb-3 flex items-center gap-2"><Banknote size={18} className="text-primary" /><div><h2 className="text-sm font-semibold text-primary-dark">Registro ultra-rápido</h2><p className="text-xs text-neutral">Propinas, trabajos extras y ventas sin pasar por el banco.</p></div></div>
          <div className="mb-3 flex gap-2 rounded-xl bg-base-soft p-1"><button type="button" onClick={() => setTipo("ingreso")} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${tipo === "ingreso" ? "bg-surface text-green shadow-sm" : "text-neutral"}`}>Entrada</button><button type="button" onClick={() => setTipo("gasto")} className={`flex-1 rounded-lg py-2 text-sm font-semibold ${tipo === "gasto" ? "bg-surface text-danger shadow-sm" : "text-neutral"}`}>Salida</button></div>
          <div className="grid gap-2 sm:grid-cols-2"><input inputMode="decimal" value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Monto" className="rounded-xl border border-secondary/50 bg-base-soft px-3 py-2.5 text-sm text-primary-dark outline-none focus:border-primary" /><select value={fuente} onChange={(e) => setFuente(e.target.value as CashEntrySource)} className="rounded-xl border border-secondary/50 bg-base-soft px-3 py-2.5 text-sm text-primary-dark outline-none focus:border-primary">{fuentes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>
          <div className="mt-2 flex gap-2"><input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Nota opcional" className="min-w-0 flex-1 rounded-xl border border-secondary/50 bg-base-soft px-3 py-2.5 text-sm text-primary-dark outline-none focus:border-primary" /><button type="button" onClick={registrar} disabled={!monto || Number(monto) <= 0} className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface disabled:opacity-40"><Plus size={16} />Registrar</button></div>
          <p className="mt-3 text-xs text-neutral">Categorías sugeridas: domicilios, transporte, insumos, ventas, clientes, herramientas y comisiones.</p>
        </section>

        <section className="rounded-2xl border border-secondary/40 bg-surface p-4"><div className="flex items-center gap-2"><TrendingDown size={18} className="text-gold" /><div><h2 className="text-sm font-semibold text-primary-dark">Huella de inflación personal</h2><p className="text-xs text-neutral">Compara tu gasto diario reciente con el mes anterior.</p></div></div><div className="mt-4 grid gap-3 sm:grid-cols-3"><Metric label="Mes actual" value={formatoMoneda(huella.actual)} /><Metric label="Mes anterior" value={formatoMoneda(huella.anterior)} /><Metric label="Variación" value={huella.anterior ? `${huella.variacion >= 0 ? "+" : ""}${huella.variacion.toFixed(1)}%` : "Aún sin base"} positive={huella.variacion <= 0} /></div><p className="mt-3 text-xs text-neutral">Esta huella refleja tu canasta registrada en Findrix, no reemplaza el IPC oficial: sirve para detectar cómo te está afectando el costo de vida a ti.</p></section>

        <section className="rounded-2xl border border-secondary/40 bg-surface p-4"><div className="mb-3 flex items-center gap-2"><CalendarClock size={18} className="text-primary" /><h2 className="text-sm font-semibold text-primary-dark">Actividad reciente</h2></div>{ultimos.length === 0 ? <p className="text-sm text-neutral">Tu caja chica está lista. Registra tu primer movimiento.</p> : <div className="divide-y divide-secondary/20">{ultimos.map((entry) => <div key={entry.id} className="flex items-center justify-between gap-3 py-2 text-sm"><div className="min-w-0"><p className="truncate font-medium text-primary-dark">{entry.descripcion}</p><p className="text-xs text-neutral">{fuenteLabel(entry.fuente)} · {entry.fecha}</p></div><span className={`shrink-0 font-semibold ${entry.tipo === "ingreso" ? "text-green" : "text-danger"}`}>{entry.tipo === "ingreso" ? "+" : "−"}{formatoMoneda(entry.monto)}</span></div>)}</div>}</section>
      </div>
    </div>
  );
}

function Metric({ label, value, positive = false }: { label: string; value: string; positive?: boolean }) { return <div className="rounded-xl bg-base-soft p-3"><p className="text-xs text-neutral">{label}</p><p className={`mt-1 text-lg font-semibold ${positive ? "text-green" : "text-primary-dark"}`}>{value}</p></div>; }

function calcularHuellaInflacion(gastos: { monto: number; fecha: string }[]) {
  const ahora = new Date();
  const mesActual = ahora.getFullYear() * 12 + ahora.getMonth();
  const actual = gastos.filter((g) => { const d = new Date(`${g.fecha}T00:00:00`); return d.getFullYear() * 12 + d.getMonth() === mesActual; }).reduce((t, g) => t + g.monto, 0);
  const anterior = gastos.filter((g) => { const d = new Date(`${g.fecha}T00:00:00`); return d.getFullYear() * 12 + d.getMonth() === mesActual - 1; }).reduce((t, g) => t + g.monto, 0);
  return { actual, anterior, variacion: anterior ? ((actual - anterior) / anterior) * 100 : 0 };
}
