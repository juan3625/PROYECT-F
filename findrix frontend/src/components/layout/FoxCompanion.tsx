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
  useEffect(() => { const actualizar = () => setCash(saldoEfectivo(leerCaja())); window.addEventListener("findrix-cash-updated", actualizar); return () => window.removeEventListener("findrix-cash-updated", actualizar); }, []);
  const mood: Mood = balanceMes < 0 || cash < 0 ? "preocupado" : proximosAVencer.length > 0 ? "atento" : "feliz";
  const copy = useMemo(() => ({ feliz: "¡Vas muy bien! Tu zorrito ve buenas señales.", atento: `Tienes ${proximosAVencer.length} pago${proximosAVencer.length === 1 ? " pendiente" : "s pendientes"}.`, preocupado: "Pausa un momento: revisemos tu flujo de dinero." }[mood]), [mood, proximosAVencer.length]);
  return <div className="fox-companion" aria-live="polite"><button type="button" onClick={() => setAbierto((value) => !value)} className={`fox-companion__button fox-companion__button--${mood}`} aria-label="Abrir consejo del zorrito"><img src={findrixIcon} alt="Zorrito de Findrix" /><span className="fox-companion__spark" /></button>{abierto && <div className="fox-companion__bubble"><button type="button" onClick={() => setAbierto(false)} className="absolute right-2 top-2 text-neutral" aria-label="Cerrar"><X size={14} /></button><MessageCircle size={16} className="shrink-0 text-primary" /><div><p className="font-semibold text-primary-dark">{copy}</p><p className="mt-1 text-xs text-neutral">Caja chica: {formatoMoneda(cash)} · Balance mensual: {formatoMoneda(balanceMes)}</p></div></div>}</div>;
}
