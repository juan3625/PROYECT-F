import { useAuth } from "../context/AuthContext";
import { SubPageHeader } from "../components/ui/SubPageHeader";

export function PerfilPage() {
  const { usuario } = useAuth();
  return (
    <div className="flex flex-col gap-5 pb-4">
      <SubPageHeader titulo="Mi perfil" />
      <div className="flex flex-col gap-4 px-5">
        <Campo label="Nombre" valor={usuario!.nombre} />
        <Campo label="Correo" valor={usuario!.correo} />
        <p className="text-xs text-neutral">
          Esta pantalla es un marcador de posición: el backend todavía no expone un endpoint para
          editar el perfil — no está en el contrato de API de Fase 3.
        </p>
      </div>
    </div>
  );
}

function Campo({ label, valor }: { label: string; valor: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral">{label}</span>
      <input
        defaultValue={valor}
        readOnly
        className="rounded-xl border border-secondary/50 bg-base-soft px-4 py-2.5 text-sm text-primary-dark outline-none"
      />
    </label>
  );
}
