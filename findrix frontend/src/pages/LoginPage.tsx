import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/layout/AuthShell";
import { useAuth } from "../context/AuthContext";

const campoClase =
  "rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none placeholder:text-neutral focus:border-primary";

export function LoginPage() {
  const { usuario, login, error, limpiarError } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  // Si ya hay sesión (ej. volviste a /login manualmente), no te deja quedarte ahí.
  useEffect(() => {
    if (usuario) navigate("/", { replace: true });
  }, [usuario, navigate]);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (await login(correo, contrasena)) navigate("/", { replace: true });
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

        {error && <p className="text-xs font-medium text-danger">{error}</p>}

        <button
          type="submit"
          className="rounded-xl bg-primary py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-90"
        >
          Iniciar sesión
        </button>

        <p className="text-center text-xs text-neutral">
          ¿No tienes cuenta?{" "}
          <Link to="/registro" className="font-semibold text-primary">
            Regístrate
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
