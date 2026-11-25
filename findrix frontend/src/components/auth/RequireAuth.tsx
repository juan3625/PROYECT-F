import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AppDataProvider, useAppData } from "../../context/AppDataContext";
import { FoxLoadingTransition } from "./FoxLoadingTransition";

const DURACION_MINIMA_TRANSICION = 2000;

function RutasAutenticadas() {
  const { cargando, errorCarga, recargarDatos } = useAppData();
  const [duracionMinimaCumplida, setDuracionMinimaCumplida] = useState(false);

  useEffect(() => {
    const temporizador = window.setTimeout(
      () => setDuracionMinimaCumplida(true),
      DURACION_MINIMA_TRANSICION
    );
    return () => window.clearTimeout(temporizador);
  }, []);

  const mostrarTransicion = Boolean(errorCarga) || cargando || !duracionMinimaCumplida;

  if (mostrarTransicion) {
    return <FoxLoadingTransition onReintentar={recargarDatos} />;
  }

  return <Outlet />;
}

export function RequireAuth() {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;

  return (
    <AppDataProvider>
      <RutasAutenticadas />
    </AppDataProvider>
  );
}
