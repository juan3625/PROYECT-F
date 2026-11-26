import { useEffect, useRef } from "react";

type GoogleCredentialResponse = { credential?: string };
type GoogleIdApi = {
  initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
  renderButton: (element: HTMLElement, options: Record<string, string | number | boolean>) => void;
};

declare global {
  interface Window {
    google?: { accounts?: { id?: GoogleIdApi } };
  }
}

const GOOGLE_SCRIPT_ID = "google-identity-services";
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

interface GoogleSignInButtonProps {
  onCredential: (idToken: string) => void;
  onError?: (mensaje: string) => void;
  disabled?: boolean;
}

export function GoogleSignInButton({ onCredential, onError, disabled = false }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const onCredentialRef = useRef(onCredential);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onCredentialRef.current = onCredential;
    onErrorRef.current = onError;
  }, [onCredential, onError]);

  useEffect(() => {
    if (!CLIENT_ID) {
      return;
    }

    const renderizar = () => {
      const api = window.google?.accounts?.id;
      if (!api || !buttonRef.current) return;
      api.initialize({
        client_id: CLIENT_ID,
        callback: (response) => {
          if (response.credential) {
            onCredentialRef.current(response.credential);
          } else {
            onErrorRef.current?.("No se recibió una credencial de Google.");
          }
        },
      });
      buttonRef.current.replaceChildren();
      api.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 300,
        locale: "es",
      });
    };

    if (window.google?.accounts?.id) {
      renderizar();
      return;
    }

    const scriptExistente = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;
    const script = scriptExistente ?? document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderizar, { once: true });
    script.addEventListener("error", () => {
      onErrorRef.current?.("No se pudo cargar Google. Revisa tu conexión o configuración.");
    }, { once: true });
    if (!scriptExistente) document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", renderizar);
    };
  }, []);

  if (!CLIENT_ID) {
    return <p className="text-center text-xs text-neutral">Google no está configurado en este entorno.</p>;
  }

  return (
    <div className={`flex min-h-10 justify-center ${disabled ? "pointer-events-none opacity-50" : ""}`}>
      <div ref={buttonRef} />
    </div>
  );
}
