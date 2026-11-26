import { useState } from "react";
import { Bell, Check, Moon, Monitor, Palette, Sun, Type } from "lucide-react";
import { SubPageHeader } from "../components/ui/SubPageHeader";
import {
  usePreferences,
  type Acento,
  type DiasAnticipacion,
  type TamanoTexto,
  type Tema,
} from "../context/PreferencesContext";

const temas: { valor: Tema; titulo: string; descripcion: string; icono: typeof Sun }[] = [
  { valor: "claro", titulo: "Claro", descripcion: "Fondo claro", icono: Sun },
  { valor: "oscuro", titulo: "Oscuro", descripcion: "Fondo oscuro", icono: Moon },
  { valor: "automatico", titulo: "Automático", descripcion: "Según tu dispositivo", icono: Monitor },
];

const acentos: { valor: Acento; titulo: string; color: string }[] = [
  { valor: "terracota", titulo: "Terracota", color: "#b85c38" },
  { valor: "musgo", titulo: "Verde musgo", color: "#6a8d73" },
  { valor: "oro", titulo: "Oro viejo", color: "#a8793e" },
  { valor: "cobre", titulo: "Cobre oscuro", color: "#8c4a32" },
];

const anticipaciones: { valor: DiasAnticipacion; titulo: string }[] = [
  { valor: 0, titulo: "El mismo día" },
  { valor: 1, titulo: "1 día antes" },
  { valor: 2, titulo: "2 días antes" },
  { valor: 3, titulo: "3 días antes" },
  { valor: 7, titulo: "7 días antes" },
];

export function AjustesPage() {
  const {
    tema,
    acento,
    tamanoTexto,
    cambiarTema,
    cambiarAcento,
    cambiarTamanoTexto,
    notificacionesActivas,
    diasAnticipacion,
    activarNotificaciones,
    desactivarNotificaciones,
    cambiarDiasAnticipacion,
    permisoNotificaciones,
  } = usePreferences();
  const [mensajeNotificaciones, setMensajeNotificaciones] = useState<string | null>(null);

  const cambiarNotificaciones = async () => {
    if (notificacionesActivas) {
      desactivarNotificaciones();
      setMensajeNotificaciones("Los recordatorios quedaron desactivados en este dispositivo.");
      return;
    }
    if (permisoNotificaciones === "denied") {
      setMensajeNotificaciones("El navegador bloqueó los avisos. Habilítalos desde la configuración del sitio.");
      return;
    }
    const permiso = await activarNotificaciones();
    setMensajeNotificaciones(
      permiso === "granted"
        ? "Listo. Te avisaremos mientras Findrix esté abierto."
        : permiso === "no-disponible"
          ? "Este navegador no admite notificaciones."
          : "No se activaron los avisos. Puedes intentarlo nuevamente cuando quieras."
    );
  };

  return (
    <div className="flex flex-col gap-5 pb-6">
      <SubPageHeader titulo="Ajustes" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-5 sm:px-8 lg:px-10">
        <section className="rounded-2xl border border-secondary/40 bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sun size={18} className="text-primary" />
            <div>
              <h2 className="text-sm font-semibold text-primary-dark">Tema</h2>
              <p className="text-xs text-neutral">Elige cómo quieres ver Findrix.</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {temas.map(({ valor, titulo, descripcion, icono: Icono }) => (
              <button
                key={valor}
                onClick={() => cambiarTema(valor)}
                aria-pressed={tema === valor}
                className={`rounded-xl border px-2 py-3 text-center transition-colors ${
                  tema === valor
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-secondary/50 text-neutral hover:bg-base-soft"
                }`}
              >
                <Icono size={18} className="mx-auto mb-1" />
                <span className="block text-xs font-semibold">{titulo}</span>
                <span className="mt-0.5 block text-[10px]">{descripcion}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/40 bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <Palette size={18} className="text-primary" />
            <div>
              <h2 className="text-sm font-semibold text-primary-dark">Color de acento</h2>
              <p className="text-xs text-neutral">Personaliza el color de botones y acciones.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {acentos.map(({ valor, titulo, color }) => (
              <button
                key={valor}
                onClick={() => cambiarAcento(valor)}
                aria-pressed={acento === valor}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                  acento === valor ? "border-primary bg-primary/10 text-primary" : "border-secondary/50 text-primary-dark hover:bg-base-soft"
                }`}
              >
                <span className="h-5 w-5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                <span className="flex-1">{titulo}</span>
                {acento === valor && <Check size={15} />}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/40 bg-surface p-4">
          <div className="mb-3 flex items-center gap-2">
            <Type size={18} className="text-primary" />
            <div>
              <h2 className="text-sm font-semibold text-primary-dark">Tamaño de texto</h2>
              <p className="text-xs text-neutral">Ajusta la lectura de toda la aplicación.</p>
            </div>
          </div>
          <div className="flex gap-2 rounded-xl bg-base-soft p-1">
            {(["normal", "grande"] as TamanoTexto[]).map((valor) => (
              <button
                key={valor}
                onClick={() => cambiarTamanoTexto(valor)}
                aria-pressed={tamanoTexto === valor}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                  tamanoTexto === valor ? "bg-surface text-primary-dark shadow-sm" : "text-neutral"
                }`}
              >
                {valor === "normal" ? "Normal" : "Grande"}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-secondary/40 bg-surface p-4">
          <div className="flex items-start gap-3">
            <Bell size={18} className="mt-0.5 text-primary" />
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-primary-dark">Notificaciones</h2>
              <p className="mt-1 text-sm text-neutral">Recordatorios dentro de Findrix y avisos del navegador mientras la app esté abierta.</p>
              <button
                type="button"
                role="switch"
                aria-checked={notificacionesActivas}
                onClick={cambiarNotificaciones}
                className={`mt-3 flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                  notificacionesActivas ? "border-primary bg-primary/10 text-primary" : "border-secondary/50 text-primary-dark hover:bg-base-soft"
                }`}
              >
                <span>{notificacionesActivas ? "Recordatorios activados" : "Activar recordatorios"}</span>
                <span className={`relative h-5 w-9 rounded-full transition-colors ${notificacionesActivas ? "bg-primary" : "bg-neutral/40"}`} aria-hidden="true">
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-surface transition-transform ${notificacionesActivas ? "translate-x-4" : "translate-x-0.5"}`} />
                </span>
              </button>

              {notificacionesActivas && (
                <div className="mt-4">
                  <p className="mb-2 text-xs font-semibold text-primary-dark">Avisar gastos pendientes con:</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {anticipaciones.map(({ valor, titulo }) => (
                      <button
                        key={valor}
                        type="button"
                        onClick={() => cambiarDiasAnticipacion(valor)}
                        aria-pressed={diasAnticipacion === valor}
                        className={`rounded-lg border px-2 py-2 text-xs transition-colors ${
                          diasAnticipacion === valor ? "border-primary bg-primary/10 font-semibold text-primary" : "border-secondary/50 text-neutral hover:bg-base-soft"
                        }`}
                      >
                        {titulo}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mensajeNotificaciones && <p className="mt-3 text-xs text-neutral" role="status">{mensajeNotificaciones}</p>}
              {permisoNotificaciones === "denied" && <p className="mt-2 text-xs text-danger">El permiso está bloqueado en el navegador. Actívalo desde la configuración del sitio.</p>}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
