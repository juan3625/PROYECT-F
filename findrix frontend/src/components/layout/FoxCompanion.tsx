import { useEffect, useMemo, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { formatoMoneda } from "../../utils/format";
import { leerCaja, saldoEfectivo } from "../../utils/cashFirst";
import findrixIcon from "../../assets/findrix-icon.png";

type Mood = "feliz" | "atento" | "preocupado";

export function FoxCompanion() {
  const { balanceMes, proximosAVencer } = useAppData();
  const [cash, setCash] = useState(() => saldoEfectivo(leerCaja()));
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const actualizar = () => setCash(saldoEfectivo(leerCaja()));
    window.addEventListener("findrix-cash-updated", actualizar);
    return () => window.removeEventListener("findrix-cash-updated", actualizar);
  }, []);

  const mood: Mood = balanceMes < 0 || cash < 0 ? "preocupado" : proximosAVencer.length > 0 ? "atento" : "feliz";
  const copy = useMemo(() => ({
    feliz: "¡Vas muy bien! Tu zorrito ve buenas señales.",
    atento: `Tienes ${proximosAVencer.length} pago${proximosAVencer.length === 1 ? " pendiente" : "s pendientes"}.`,
    preocupado: "Pausa un momento: revisemos tu flujo de dinero.",
  }[mood]), [mood, proximosAVencer.length]);

  return (
    <div className="fox-companion" aria-live="polite">
      <button
        type="button"
        onClick={() => setAbierto((value) => !value)}
        className={`fox-companion__button fox-companion__button--${mood}`}
        aria-label="Abrir consejo del zorrito"
        aria-expanded={abierto}
      >
        <span className="fox-companion__character" aria-hidden="true">
          <img className="fox-companion__head" src={findrixIcon} alt="" />
          <svg className="fox-companion__body" viewBox="0 0 180 190" role="presentation">
            <path className="fox-companion__tail" d="M143 120 C178 98 177 55 151 45 C161 72 143 78 126 83" />
            <ellipse className="fox-companion__shadow" cx="91" cy="179" rx="53" ry="7" />
            <path className="fox-companion__torso" d="M61 61 Q91 48 121 61 L130 146 Q91 163 52 146 Z" />
            <path className="fox-companion__arm fox-companion__arm--left" d="M61 78 Q36 91 28 123" />
            <path className="fox-companion__arm fox-companion__arm--right" d="M121 78 Q145 89 153 118" />
            <circle className="fox-companion__paw" cx="28" cy="123" r="8" />
            <circle className="fox-companion__paw" cx="153" cy="118" r="8" />
            <path className="fox-companion__leg" d="M72 143 L67 174" />
            <path className="fox-companion__leg" d="M110 143 L116 174" />
            <ellipse className="fox-companion__foot" cx="65" cy="176" rx="12" ry="6" />
            <ellipse className="fox-companion__foot" cx="118" cy="176" rx="12" ry="6" />
            <path className="fox-companion__belly" d="M71 91 Q91 103 111 91 L114 137 Q91 147 68 137 Z" />
            <path className="fox-companion__grain" d="M74 76 Q91 84 108 76 M78 112 Q91 118 104 112" />
            <circle className="fox-companion__coin" cx="154" cy="91" r="11" />
            <text className="fox-companion__coin-text" x="154" y="95" textAnchor="middle">$</text>
          </svg>
          <span className="fox-companion__spark" />
        </span>
      </button>
      {abierto && (
        <div className="fox-companion__bubble">
          <button type="button" onClick={() => setAbierto(false)} className="absolute right-2 top-2 text-neutral" aria-label="Cerrar"><X size={14} /></button>
          <MessageCircle size={16} className="shrink-0 text-primary" />
          <div><p className="font-semibold text-primary-dark">{copy}</p><p className="mt-1 text-xs text-neutral">Caja chica: {formatoMoneda(cash)} · Balance mensual: {formatoMoneda(balanceMes)}</p></div>
        </div>
      )}
    </div>
  );
}
