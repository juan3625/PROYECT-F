import { Link, useNavigate } from "react-router-dom";
import { Tag, BarChart3, User, Lock, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function FilaEnlace({
  to,
  icono: IconCmp,
  label,
}: {
  to: string;
  icono: typeof Tag;
  label: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between px-4 py-3 text-sm text-primary-dark"
    >
      <span className="flex items-center gap-3">
        <IconCmp size={18} className="text-neutral" />
        {label}
      </span>
      <ChevronRight size={16} className="text-neutral" />
    </Link>
  );
}

export function MasPage() {
  const { usuario, cerrarSesion } = useAuth();
  const navigate = useNavigate();
  const iniciales = usuario!.nombre
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="flex flex-col gap-6 px-5 pt-6">
      <p className="font-display text-xl text-primary-dark">Más</p>

      <div className="flex items-center gap-3 rounded-2xl border border-secondary/40 bg-surface p-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/50 text-sm font-semibold text-primary-dark">
          {iniciales}
        </span>
        <div>
          <p className="text-sm font-semibold text-primary-dark">{usuario!.nombre}</p>
          <p className="text-xs text-neutral">{usuario!.correo}</p>
        </div>
      </div>

      <div>
        <p className="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-neutral">
          Organización
        </p>
        <div className="divide-y divide-secondary/20 rounded-xl border border-secondary/30 bg-surface">
          <FilaEnlace to="/mas/categorias" icono={Tag} label="Categorías" />
          <FilaEnlace to="/mas/reportes" icono={BarChart3} label="Reportes" />
        </div>
      </div>

      <div>
        <p className="mb-1 px-1 text-xs font-medium uppercase tracking-wide text-neutral">Cuenta</p>
        <div className="divide-y divide-secondary/20 rounded-xl border border-secondary/30 bg-surface">
          <FilaEnlace to="/mas/perfil" icono={User} label="Mi perfil" />
          <FilaEnlace to="/mas/seguridad" icono={Lock} label="Seguridad" />
        </div>
      </div>

      <button
        onClick={() => {
          cerrarSesion();
          navigate("/login", { replace: true });
        }}
        className="flex items-center gap-3 px-1 py-2 text-sm font-medium text-danger"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </div>
  );
}
