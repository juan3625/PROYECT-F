import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "../components/layout/AuthShell";
import { useAuth } from "../context/AuthContext";

const campoClase =
  "rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none placeholder:text-neutral focus:border-primary";

export function RegistroPage() {
  const { usuario, registrar, error, limpiarError } = useAuth();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  useEffect(() => {
    if (usuario) navigate("/", { replace: true });
  }, [usuario, navigate]);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    limpiarError();
    setErrorLocal(null);

    if (contrasena.length < 8) {
      setErrorLocal("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (contrasena !== confirmar) {
      setErrorLocal("Las contraseñas no coinciden.");
      return;
    }
    if (await registrar(nombre, correo, contrasena)) navigate("/", { replace: true });
  };

  const mensajeError = errorLocal ?? error;

  return (
    <AuthShell>
      <form onSubmit={enviar} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral">Nombre</label>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className={campoClase}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral">Correo</label>
          <input
            type="email"
            required
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
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
            onChange={(e) => setContrasena(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            className={campoClase}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral">Confirmar contraseña</label>
          <input
            type="password"
            required
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            placeholder="Repite tu contraseña"
            className={campoClase}
          />
        </div>

        {mensajeError && <p className="text-xs font-medium text-danger">{mensajeError}</p>}

        <button
          type="submit"
          className="rounded-xl bg-primary py-3 text-sm font-semibold text-surface transition-opacity hover:opacity-90"
        >
          Crear cuenta
        </button>

        <p className="text-center text-xs text-neutral">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-semibold text-primary">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
