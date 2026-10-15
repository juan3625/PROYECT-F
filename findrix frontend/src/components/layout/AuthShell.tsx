import type { ReactNode } from "react";
import findrixIcon from "../../assets/findrix-icon.png";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-soft py-6">
      <div className="relative flex h-[720px] w-[380px] flex-col overflow-hidden rounded-[2.5rem] border-8 border-primary-dark/90 bg-base shadow-2xl">
        <div className="no-scrollbar flex flex-1 flex-col justify-center gap-8 overflow-y-auto px-8 py-10">
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
