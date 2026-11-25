import type { ReactNode } from "react";
import findrixIcon from "../../assets/findrix-icon.png";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-soft px-4 py-6 sm:px-6">
      <div className="flex min-h-screen w-full flex-col justify-center bg-base px-6 py-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-1.5">
            <img src={findrixIcon} alt="Findrix" className="h-14 w-14 object-contain" />
            <p className="font-display text-2xl font-semibold text-primary-dark">Findrix</p>
            <p className="text-xs text-neutral">Tu dinero, tu control</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
