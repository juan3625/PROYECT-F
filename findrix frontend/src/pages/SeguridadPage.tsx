import { SubPageHeader } from "../components/ui/SubPageHeader";

export function SeguridadPage() {
  return (
    <div className="flex flex-col gap-5 pb-4">
      <SubPageHeader titulo="Seguridad" />
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-5 sm:px-8 lg:px-10">
        <div className="rounded-xl border border-secondary/30 bg-surface px-4 py-3 text-sm text-primary-dark">
          Cambiar contraseña
        </div>
        <div className="rounded-xl border border-secondary/30 bg-surface px-4 py-3 text-sm text-primary-dark">
          Autenticación en dos pasos
        </div>
        <p className="text-xs text-neutral">
          Nota para Fase 3: aquí es donde el backend debe usar bcrypt de verdad y JWT firmado — el bug
          más grave de la entrega anterior.
        </p>
      </div>
    </div>
  );
}
