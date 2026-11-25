import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AuthShell } from "../components/layout/AuthShell";
import { apiFetch } from "../api/client";

const campoClase =
  "rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none placeholder:text-neutral focus:border-primary";

export function RestablecerContrasenaPage() {
  const [parametros] = useSearchParams();
  const token = parametros.get("token") ?? "";
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);
    if (contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (contrasena !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setCargando(true);
    try {
      const respuesta = await apiFetch<{ mensaje: string }>("/auth/restablecer-contrasena", {
        method: "POST",
        body: JSON.stringify({ token, contrasena }),
      });
      setMensaje(respuesta.mensaje);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la contraseña.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-2xl font-semibold text-primary-dark">Crear nueva contraseña</h1>
        <p className="text-sm leading-relaxed text-neutral">Elige una contraseña segura de al menos 8 caracteres.</p>
      </div>
      {mensaje ? (
        <div className="flex flex-col gap-4" role="status">
          <p className="rounded-xl border border-green/40 bg-base-soft p-4 text-sm text-primary-dark">{mensaje}</p>
          <Link to="/login" className="rounded-xl bg-primary py-3 text-center text-sm font-semibold text-surface">Ir al inicio de sesión</Link>
        </div>
      ) : (
        <form onSubmit={enviar} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="contrasena" className="text-xs font-medium text-neutral">Nueva contraseña</label>
            <input id="contrasena" type="password" required minLength={8} autoComplete="new-password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} placeholder="Mínimo 8 caracteres" className={campoClase} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmar" className="text-xs font-medium text-neutral">Confirmar contraseña</label>
            <input id="confirmar" type="password" required minLength={8} autoComplete="new-password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} placeholder="Repite tu contraseña" className={campoClase} />
          </div>
          {error && <p className="text-xs font-medium text-danger" role="alert">{error}</p>}
          <button type="submit" disabled={cargando || !token} className="rounded-xl bg-primary py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-50">
            {cargando ? "Guardando…" : "Guardar nueva contraseña"}
          </button>
          {!token && <p className="text-xs text-danger">El enlace no incluye un token válido. Solicita uno nuevo.</p>}
        </form>
      )}
      {!mensaje && <p className="text-center text-xs text-neutral"><Link to="/login" className="font-semibold text-primary">Volver al inicio de sesión</Link></p>}
    </AuthShell>
  );
}
