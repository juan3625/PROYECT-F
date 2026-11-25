import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Tema = "claro" | "oscuro" | "automatico";
export type Acento = "terracota" | "musgo" | "oro" | "cobre";
export type TamanoTexto = "normal" | "grande";

interface Preferencias {
  tema: Tema;
  acento: Acento;
  tamanoTexto: TamanoTexto;
}

interface PreferencesContextValue extends Preferencias {
  cambiarTema: (tema: Tema) => void;
  cambiarAcento: (acento: Acento) => void;
  cambiarTamanoTexto: (tamano: TamanoTexto) => void;
}

const STORAGE_KEY = "findrix_preferencias";
const valoresIniciales: Preferencias = {
  tema: "claro",
  acento: "terracota",
  tamanoTexto: "normal",
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function leerPreferencias(): Preferencias {
  try {
    const guardadas = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return {
      tema: guardadas?.tema ?? valoresIniciales.tema,
      acento: guardadas?.acento ?? valoresIniciales.acento,
      tamanoTexto: guardadas?.tamanoTexto ?? valoresIniciales.tamanoTexto,
    };
  } catch {
    return valoresIniciales;
  }
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferencias, setPreferencias] = useState<Preferencias>(leerPreferencias);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("theme-light", "theme-dark", "theme-auto", "text-normal", "text-large");
    html.classList.add(`theme-${preferencias.tema === "automatico" ? "auto" : preferencias.tema}`);
    html.classList.add(`theme-accent-${preferencias.acento}`);
    html.classList.add(`text-${preferencias.tamanoTexto === "grande" ? "large" : "normal"}`);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferencias));
  }, [preferencias]);

  const value = useMemo(
    () => ({
      ...preferencias,
      cambiarTema: (tema: Tema) => setPreferencias((actual) => ({ ...actual, tema })),
      cambiarAcento: (acento: Acento) => setPreferencias((actual) => ({ ...actual, acento })),
      cambiarTamanoTexto: (tamanoTexto: TamanoTexto) =>
        setPreferencias((actual) => ({ ...actual, tamanoTexto })),
    }),
    [preferencias]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("usePreferences debe usarse dentro de <PreferencesProvider>");
  return context;
}
