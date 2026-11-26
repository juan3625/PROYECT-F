import { SubPageHeader } from "../components/ui/SubPageHeader";
import { EmptyState } from "../components/ui/EmptyState";

export function SeguridadPage() {
  return (
    <div className="flex flex-col gap-5 pb-4">
      <SubPageHeader titulo="Seguridad" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-5 sm:px-8 lg:px-10">
        <EmptyState
          titulo="Funciones de seguridad próximamente"
          descripcion="El cambio de contraseña y la autenticación en dos pasos estarán disponibles cuando se habiliten en la cuenta."
        />
        <p className="text-xs text-neutral">
          Tu sesión está protegida mientras permanezca activa. Para salir de este dispositivo, usa “Cerrar sesión” en Más.
        </p>
      </div>
    </div>
  );
}
