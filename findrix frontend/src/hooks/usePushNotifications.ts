import { useEffect } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { usePreferences } from "../context/PreferencesContext";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;

function convertirClaveBase64(clave: string): ArrayBuffer {
  const padding = "=".repeat((4 - (clave.length % 4)) % 4);
  const base64 = (clave + padding).replace(/-/g, "+").replace(/_/g, "/");
  const binario = window.atob(base64);
  return Uint8Array.from(binario, (caracter) => caracter.charCodeAt(0)).buffer as ArrayBuffer;
}

export function usePushNotifications() {
  const { token } = useAuth();
  const { notificacionesActivas, diasAnticipacion } = usePreferences();

  useEffect(() => {
    if (!token || !VAPID_PUBLIC_KEY || !("serviceWorker" in navigator) || !("PushManager" in window)) return;

    let cancelado = false;
    const sincronizar = async () => {
      try {
        const registro = await navigator.serviceWorker.register("/sw.js");
        const suscripcionActual = await registro.pushManager.getSubscription();

        if (!notificacionesActivas) {
          if (suscripcionActual) {
            await apiFetch("/notificaciones/suscripciones", {
              method: "DELETE",
              body: JSON.stringify({ endpoint: suscripcionActual.endpoint }),
            }, token);
            await suscripcionActual.unsubscribe();
          }
          return;
        }

        const suscripcion = suscripcionActual ?? await registro.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertirClaveBase64(VAPID_PUBLIC_KEY),
        });
        const datos = suscripcion.toJSON();
        if (cancelado || !datos.endpoint || !datos.keys?.p256dh || !datos.keys.auth) return;

        await apiFetch("/notificaciones/suscripciones", {
          method: "POST",
          body: JSON.stringify({
            endpoint: datos.endpoint,
            p256dh: datos.keys.p256dh,
            auth: datos.keys.auth,
            diasAnticipacion,
          }),
        }, token);
      } catch (error) {
        console.error("No se pudo configurar Web Push:", error);
      }
    };

    sincronizar();
    return () => {
      cancelado = true;
    };
  }, [token, notificacionesActivas, diasAnticipacion]);
}
