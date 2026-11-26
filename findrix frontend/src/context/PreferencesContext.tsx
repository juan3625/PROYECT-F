import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Tema = "claro" | "oscuro" | "automatico";
export type Acento = "terracota" | "musgo" | "oro" | "cobre";
export type TamanoTexto = "normal" | "grande";
export type DiasAnticipacion = 0 | 1 | 2 | 3 | 7;

interface Preferencias {
  tema: Tema;
  acento: Acento;
  tamanoTexto: TamanoTexto;
  notificacionesActivas: boolean;
  diasAnticipacion: DiasAnticipacion;
}

interface PreferencesContextValue extends Preferencias {
  cambiarTema: (tema: Tema) => void;
  cambiarAcento: (acento: Acento) => void;
  cambiarTamanoTexto: (tamano: TamanoTexto) => void;
  activarNotificaciones: () => Promise<NotificationPermission | "no-disponible">;
  desactivarNotificaciones: () => void;
  cambiarDiasAnticipacion: (dias: DiasAnticipacion) => void;
  permisoNotificaciones: NotificationPermission | "no-disponible";
}

const STORAGE_KEY = "findrix_preferencias";
const valoresIniciales: Preferencias = {
  tema: "claro",
  acento: "terracota",
  tamanoTexto: "normal",
  notificacionesActivas: false,
  diasAnticipacion: 1,
};

function claseTema(tema: Tema) {
  if (tema === "oscuro") return "theme-dark";
  if (tema === "automatico") return "theme-auto";
  return "theme-light";
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function leerPreferencias(): Preferencias {
  try {
    const guardadas = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return {
      tema: guardadas?.tema ?? valoresIniciales.tema,
      acento: ["terracota", "musgo", "oro", "cobre"].includes(guardadas?.acento) ? guardadas.acento : valoresIniciales.acento,
      tamanoTexto: guardadas?.tamanoTexto ?? valoresIniciales.tamanoTexto,
      notificacionesActivas: guardadas?.notificacionesActivas ?? valoresIniciales.notificacionesActivas,
      diasAnticipacion: [0, 1, 2, 3, 7].includes(guardadas?.diasAnticipacion)
        ? guardadas.diasAnticipacion
        : valoresIniciales.diasAnticipacion,
    };
  } catch {
    return valoresIniciales;
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferencias, setPreferencias] = useState<Preferencias>(leerPreferencias);
  const [permisoNotificaciones, setPermisoNotificaciones] = useState<NotificationPermission | "no-disponible">(
    () => (typeof Notification === "undefined" ? "no-disponible" : Notification.permission)
  );

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(
      "theme-light", "theme-dark", "theme-auto", "text-normal", "text-large",
      "theme-accent-terracota", "theme-accent-musgo", "theme-accent-oro", "theme-accent-cobre"
    );
    html.classList.add(claseTema(preferencias.tema));
    html.classList.add(`theme-accent-${preferencias.acento}`);
    html.classList.add(`text-${preferencias.tamanoTexto === "grande" ? "large" : "normal"}`);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferencias));
  }, [preferencias]);

  const activarNotificaciones = async () => {
    if (typeof Notification === "undefined") {
      setPermisoNotificaciones("no-disponible");
      return "no-disponible";
    }
    const permiso = await Notification.requestPermission();
    setPermisoNotificaciones(permiso);
    if (permiso === "granted") {
      setPreferencias((actual) => ({ ...actual, notificacionesActivas: true }));
    }
    return permiso;
  };

  const desactivarNotificaciones = () =>
    setPreferencias((actual) => ({ ...actual, notificacionesActivas: false }));

  const value = useMemo(
    () => ({
      ...preferencias,
      cambiarTema: (tema: Tema) => setPreferencias((actual) => ({ ...actual, tema })),
      cambiarAcento: (acento: Acento) => setPreferencias((actual) => ({ ...actual, acento })),
      cambiarTamanoTexto: (tamanoTexto: TamanoTexto) =>
        setPreferencias((actual) => ({ ...actual, tamanoTexto })),
      activarNotificaciones,
      desactivarNotificaciones,
      cambiarDiasAnticipacion: (diasAnticipacion: DiasAnticipacion) =>
        setPreferencias((actual) => ({ ...actual, diasAnticipacion })),
      permisoNotificaciones,
    }),
    [preferencias, permisoNotificaciones]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences debe usarse dentro de <PreferencesProvider>");
  return context;
}
