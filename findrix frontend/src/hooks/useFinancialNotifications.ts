import { useEffect, useRef, useState } from "react";
import { useAppData } from "../context/AppDataContext";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";
import {
  calcularAvisos,
  guardarAvisoEmitido,
  leerAvisosEmitidos,
  type AvisoFinanciero,
} from "../utils/notifications";

const INTERVALO_REVISION_MS = 5 * 60 * 1000;

export function useFinancialNotifications() {
  const { gastos, prestamos } = useAppData();
  const { usuario } = useAuth();
  const { notificacionesActivas, diasAnticipacion, permisoNotificaciones } = usePreferences();
  const [avisos, setAvisos] = useState<AvisoFinanciero[]>([]);
  const emitidosRef = useRef<string[]>([]);

  useEffect(() => {
    if (!usuario) return;
    emitidosRef.current = leerAvisosEmitidos(usuario.id);
  }, [usuario]);

  useEffect(() => {
    const evaluar = () => {
      const calculados = calcularAvisos(gastos, prestamos, diasAnticipacion);
      setAvisos(notificacionesActivas ? calculados : []);

      if (!notificacionesActivas || permisoNotificaciones !== "granted" || !usuario) return;
      calculados.forEach((aviso) => {
        if (emitidosRef.current.includes(aviso.clave)) return;
        new Notification(`Findrix: ${aviso.titulo}`, {
          body: aviso.detalle,
          tag: aviso.clave,
        });
        emitidosRef.current = guardarAvisoEmitido(usuario.id, aviso.clave, emitidosRef.current);
      });
    };

    evaluar();
    const intervalo = window.setInterval(evaluar, INTERVALO_REVISION_MS);
    const alVolver = () => {
      if (document.visibilityState === "visible") evaluar();
    };
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      window.clearInterval(intervalo);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [gastos, prestamos, diasAnticipacion, notificacionesActivas, permisoNotificaciones, usuario]);

  return avisos;
}
