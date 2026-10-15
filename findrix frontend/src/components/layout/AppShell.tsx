import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { FAB } from "./FAB";
import { QuickAddModal } from "../quickadd/QuickAddModal";
import { BrandBar } from "./BrandBar";

export interface AbonoOrigen {
  tipo: "ahorro" | "prestamo";
  id: string;
}

export interface QuickAddRequest {
  tab?: "gasto" | "ingreso" | "abono";
  origenAbono?: AbonoOrigen;
}

export interface ShellContext {
  abrirRegistro: (req?: QuickAddRequest) => void;
}

export function AppShell() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [tabInicial, setTabInicial] = useState<"gasto" | "ingreso" | "abono">("gasto");
  const [origenAbono, setOrigenAbono] = useState<AbonoOrigen | undefined>(undefined);

  const abrirRegistro = (req?: QuickAddRequest) => {
    setTabInicial(req?.tab ?? "gasto");
    setOrigenAbono(req?.origenAbono);
    setModalAbierto(true);
  };

  const context: ShellContext = { abrirRegistro };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-soft py-6">
      <div className="relative flex h-[720px] w-[380px] flex-col overflow-hidden rounded-[2.5rem] border-8 border-primary-dark/90 bg-base shadow-2xl">
        <BrandBar />
        <div className="no-scrollbar flex-1 overflow-y-auto pb-24">
          <Outlet context={context} />
        </div>
        <FAB onClick={() => abrirRegistro()} />
        <BottomNav />
        <QuickAddModal
          abierto={modalAbierto}
          onCerrar={() => setModalAbierto(false)}
          tabInicial={tabInicial}
          origenAbono={origenAbono}
        />
      </div>
    </div>
  );
}
