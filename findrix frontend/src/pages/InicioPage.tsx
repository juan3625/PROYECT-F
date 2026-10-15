import { UserCircle2, AlertTriangle, Clock } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { formatoMoneda, etiquetaVencimiento } from "../utils/format";
import { ProgressBar } from "../components/ui/ProgressBar";
import type { ShellContext } from "../components/layout/AppShell";
import findrixIcon from "../assets/findrix-icon.png";

export function InicioPage() {
  const { balanceMes, totalIngresosMes, totalGastosMes, proximosAVencer, metasAhorro } =
    useAppData();
  const { usuario } = useAuth();
  const { abrirRegistro } = useOutletContext<ShellContext>();

  const primerNombre = usuario!.nombre.split(" ")[0];
  const metaDestacada = metasAhorro[metasAhorro.length - 1];

  return (
    <div className="flex flex-col gap-6 px-5 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-display text-xl text-primary-dark">Hola, {primerNombre}</p>
        </div>
        <UserCircle2 size={28} className="text-neutral" />
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-primary-dark p-5 text-base">
        <img
          src={findrixIcon}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -right-30 -top-30 h-80 w-80 object-contain opacity-20"
            />
        <p className="text-xs font-medium uppercase tracking-wide text-secondary">
          Balance de {mesActual()}
        </p>
        <p className="mt-1 font-display text-3xl">{formatoMoneda(balanceMes)}</p>
        <div className="mt-4 flex gap-6">
          <div>
            <p className="text-xs text-secondary">↑ Ingresos</p>
            <p className="text-sm font-semibold text-green">{formatoMoneda(totalIngresosMes)}</p>
          </div>
          <div>
            <p className="text-xs text-secondary">↓ Gastos</p>
            <p className="text-sm font-semibold text-secondary">{formatoMoneda(totalGastosMes)}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-primary-dark">Próximos a vencer</p>
        {proximosAVencer.length === 0 ? (
          <p className="rounded-xl bg-base-soft px-4 py-3 text-sm text-neutral">
            No tienes pagos pendientes. Vas al día.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {proximosAVencer.slice(0, 3).map((g) => {
              const { texto, urgente } = etiquetaVencimiento(g.fechaVencimiento!);
              return (
                <div
                  key={g.id}
                  className="flex items-center justify-between rounded-xl border border-secondary/40 bg-surface px-4 py-3"
                >
                  <div className="flex items-center gap-2">
                    {urgente ? (
                      <AlertTriangle size={16} className="text-danger" />
                    ) : (
                      <Clock size={16} className="text-gold" />
                    )}
                    <span className="text-sm font-medium text-primary-dark">{g.descripcion}</span>
                  </div>
                  <span className={`text-xs font-semibold ${urgente ? "text-danger" : "text-neutral"}`}>
                    {texto}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {metaDestacada && (
        <div>
          <p className="mb-2 text-sm font-semibold text-primary-dark">Metas de ahorro</p>
          <button
            onClick={() =>
              abrirRegistro({ tab: "abono", origenAbono: { tipo: "ahorro", id: metaDestacada.id } })
            }
            className="w-full rounded-xl border border-secondary/40 bg-surface px-4 py-3 text-left"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-primary-dark">{metaDestacada.nombre}</span>
              <span className="text-xs text-neutral">
                {formatoMoneda(metaDestacada.montoActual)} / {formatoMoneda(metaDestacada.montoMeta)}
              </span>
            </div>
            <ProgressBar valor={metaDestacada.montoActual / metaDestacada.montoMeta} />
          </button>
        </div>
      )}
    </div>
  );
}

function mesActual() {
  return new Date().toLocaleDateString("es-CO", { month: "long" });
}
