import { createContext, useContext, useState, type ReactNode } from "react";
import type { Usuario } from "../types";
import { apiFetch, ApiError } from "../api/client";

// Reemplaza la simulación con localStorage por llamadas reales a
// POST /api/auth/login y POST /api/auth/registro (Fase 4). El token JWT que
// devuelve el backend se guarda para mandarlo en cada request protegido.

const SESSION_KEY = "findrix_auth_sesion";

interface Sesion {
  usuario: Usuario;
  token: string;
}

interface RespuestaAuth {
  usuario: Usuario;
  token: string;
}

interface AuthContextValue {
  usuario: Usuario | null;
  token: string | null;
  error: string | null;
  cargando: boolean;
  login: (correo: string, contrasena: string) => Promise<boolean>;
  registrar: (nombre: string, correo: string, contrasena: string) => Promise<boolean>;
  cerrarSesion: () => void;
  limpiarError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function leerSesionGuardada(): Sesion | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(() => leerSesionGuardada());
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const persistirSesion = (s: Sesion | null) => {
    setSesion(s);
    try {
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* la sesión sigue activa en memoria para esta pestaña aunque no se persista */
    }
  };

  const login = async (correo: string, contrasena: string) => {
    setError(null);
    setCargando(true);
    try {
      const resultado = await apiFetch<RespuestaAuth>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ correo, contrasena }),
      });
      persistirSesion(resultado);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión.");
      return false;
    } finally {
      setCargando(false);
    }
  };

  const registrar = async (nombre: string, correo: string, contrasena: string) => {
    setError(null);
    setCargando(true);
    try {
      const resultado = await apiFetch<RespuestaAuth>("/auth/registro", {
        method: "POST",
        body: JSON.stringify({ nombre, correo, contrasena }),
      });
      persistirSesion(resultado);
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo crear la cuenta.");
      return false;
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => persistirSesion(null);
  const limpiarError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        usuario: sesion?.usuario ?? null,
        token: sesion?.token ?? null,
        error,
        cargando,
        login,
        registrar,
        cerrarSesion,
        limpiarError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
