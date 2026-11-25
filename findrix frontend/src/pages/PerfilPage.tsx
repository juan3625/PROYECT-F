import { useAuth } from "../context/AuthContext";
import { SubPageHeader } from "../components/ui/SubPageHeader";
import { EmptyState } from "../components/ui/EmptyState";

export function PerfilPage() {
  const { usuario } = useAuth();
  return (
    <div className="flex flex-col gap-5 pb-4">
      <SubPageHeader titulo="Mi perfil" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 px-5 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-secondary/30 bg-surface px-4 py-3 text-sm text-primary-dark">
          <p className="text-xs font-medium text-neutral">Nombre</p>
          <p className="mt-1 font-semibold">{usuario!.nombre}</p>
        </div>
        <div className="rounded-xl border border-secondary/30 bg-surface px-4 py-3 text-sm text-primary-dark">
          <p className="text-xs font-medium text-neutral">Correo</p>
          <p className="mt-1 font-semibold">{usuario!.correo}</p>
        </div>
        <EmptyState
          titulo="Edición del perfil próximamente"
          descripcion="Por ahora puedes consultar tus datos. La edición estará disponible en una próxima actualización."
        />
      </div>
    </div>
  );
}
