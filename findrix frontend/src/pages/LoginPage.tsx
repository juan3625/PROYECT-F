import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/layout/AuthShell";
import { GoogleSignInButton } from "../components/auth/GoogleSignInButton";
import { useAuth } from "../context/AuthContext";

const campoClase =
  "rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none placeholder:text-neutral focus:border-primary";

export function LoginPage() {
  const { usuario, login, loginConGoogle, error, limpiarError, cargando } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorGoogle, setErrorGoogle] = useState<string | null>(null);

  // Si ya hay sesión (ej. volviste a /login manualmente), no te deja quedarte ahí.
  useEffect(() => {
    if (usuario) navigate("/", { replace: true });
  }, [usuario, navigate]);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (await login(correo, contrasena)) navigate("/", { replace: true });
  };

  const continuarConGoogle = async (idToken: string) => {
    setErrorGoogle(null);
    if (await loginConGoogle(idToken)) navigate("/", { replace: true });
  };

  return (
    <AuthShell>
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral">Correo</label>
          <input
            type="email"
            required
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              limpiarError();
            }}
            placeholder="tucorreo@ejemplo.com"
            className={campoClase}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral">Contraseña</label>
          <input
            type="password"
            required
            value={contrasena}
            onChange={(e) => {
              setContrasena(e.target.value);
              limpiarError();
            }}
            placeholder="••••••••"
            className={campoClase}
          />
        </div>

        {(errorGoogle ?? error) && <p className="text-xs font-medium text-danger">{errorGoogle ?? error}</p>}

        <button
          type="submit"
          disabled={cargando}
          className="rounded-xl bg-primary py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {cargando ? "Iniciando sesión…" : "Iniciar sesión"}
        </button>

        <div className="flex items-center gap-3 text-xs text-neutral before:h-px before:flex-1 before:bg-secondary/50 after:h-px after:flex-1 after:bg-secondary/50">
          o continúa con
        </div>
        <GoogleSignInButton
          onCredential={continuarConGoogle}
          onError={setErrorGoogle}
          disabled={cargando}
        />

        <p className="text-center text-xs text-neutral">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-primary">
            Regístrate
          </Link>
        </p>

        <p className="text-center text-xs text-neutral">
          <Link to="/olvide-contrasena" className="font-semibold text-primary">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
