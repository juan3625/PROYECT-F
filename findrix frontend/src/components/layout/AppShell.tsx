import { useState } from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { FAB } from "./FAB";
import { QuickAddModal } from "../quickadd/QuickAddModal";
import { useAppData } from "../../context/AppDataContext";
import { BrandBar } from "./BrandBar";
import { FinancialNotifications } from "../notifications/FinancialNotifications";

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
  const { errorCarga, recargarDatos } = useAppData();
  const [tabInicial, setTabInicial] = useState<"gasto" | "ingreso" | "abono">("gasto");
  const [origenAbono, setOrigenAbono] = useState<AbonoOrigen | undefined>(undefined);

  const abrirRegistro = (req?: QuickAddRequest) => {
    setTabInicial(req?.tab ?? "gasto");
    setOrigenAbono(req?.origenAbono);
    setModalAbierto(true);
  };

  const context: ShellContext = { abrirRegistro };

  return (
    <div className="min-h-screen bg-base-soft">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl bg-base md:my-6 md:min-h-[calc(100vh-3rem)] md:overflow-hidden md:rounded-3xl md:shadow-xl">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-secondary/30 bg-surface md:flex">
          <BrandBar />
          <BottomNav variante="sidebar" />
        </aside>
        <main className="relative flex min-w-0 flex-1 flex-col">
          <div className="md:hidden">
            <BrandBar />
          </div>
          {errorCarga && (
            <div role="alert" className="mx-4 mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger md:mx-8">
              <p className="font-semibold">No pudimos cargar tus datos</p>
              <p className="mt-1 text-xs">{errorCarga}</p>
              <button onClick={recargarDatos} className="mt-2 rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-surface">Reintentar</button>
            </div>
          )}
          <FinancialNotifications />
          <div className="no-scrollbar flex-1 overflow-y-auto pb-24 md:pb-8">
            <Outlet context={context} />
          </div>
          <FAB onClick={() => abrirRegistro()} />
          <div className="md:hidden">
            <BottomNav />
          </div>
          <QuickAddModal
            abierto={modalAbierto}
            onCerrar={() => setModalAbierto(false)}
            tabInicial={tabInicial}
            origenAbono={origenAbono}
          />
        </main>
      </div>
    </div>
  );
}
