import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "../components/layout/AuthShell";
import { apiFetch } from "../api/client";

const campoClase =
  "rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none placeholder:text-neutral focus:border-primary";

export function OlvideContrasenaPage() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    setCargando(true);
    try {
      const respuesta = await apiFetch<{ mensaje: string }>("/auth/olvide-contrasena", {
        method: "POST",
        body: JSON.stringify({ correo }),
      });
      setMensaje(respuesta.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo procesar la solicitud.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold text-primary-dark">Recuperar contraseña</h1>
        <p className="text-sm leading-relaxed text-neutral">
          Escribe tu correo y, si está registrado, te enviaremos instrucciones para crear una nueva contraseña.
        </p>
      </div>
      {mensaje ? (
        <div className="rounded-xl border border-green/40 bg-base-soft p-4 text-sm text-primary-dark" role="status">
          {mensaje}
        </div>
      ) : (
        <form onSubmit={enviar} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="correo" className="text-xs font-medium text-neutral">Correo</label>
            <input
              id="correo"
              type="email"
              required
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="tucorreo@ejemplo.com"
              className={campoClase}
            />
          </div>
          {error && <p className="text-xs font-medium text-danger" role="alert">{error}</p>}
          <button
            type="submit"
            disabled={cargando}
            className="rounded-xl bg-primary py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {cargando ? "Enviando…" : "Enviar instrucciones"}
          </button>
        </form>
      )}
      <p className="text-center text-xs text-neutral">
        <Link to="/login" className="font-semibold text-primary">Volver al inicio de sesión</Link>
      </p>
    </AuthShell>
  );
}
