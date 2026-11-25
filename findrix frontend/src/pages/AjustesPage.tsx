import { Bell, Check, Moon, Monitor, Palette, Sun, Type } from "lucide-react";
import { SubPageHeader } from "../components/ui/SubPageHeader";
import { usePreferences, type Acento, type TamanoTexto, type Tema } from "../context/PreferencesContext";

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

export function AjustesPage() {
  const {
    tema,
    acento,
    tamanoTexto,
    cambiarTema,
    cambiarAcento,
    cambiarTamanoTexto,
  } = usePreferences();

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
            <Bell size={18} className="mt-0.5 text-neutral" />
            <div>
              <h2 className="text-sm font-semibold text-primary-dark">Notificaciones</h2>
              <p className="mt-1 text-sm text-neutral">Próximamente podrás configurar recordatorios y avisos de Findrix.</p>
              <span className="mt-3 inline-block rounded-full bg-base-soft px-2.5 py-1 text-[11px] font-semibold text-neutral">Próximamente</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
