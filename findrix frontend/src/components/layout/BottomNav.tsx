import { NavLink } from "react-router-dom";
import { Home, ListChecks, Target, MoreHorizontal } from "lucide-react";

const items = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/movimientos", label: "Movimientos", icon: ListChecks },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/mas", label: "Más", icon: MoreHorizontal },
];

export function BottomNav({ variante = "inferior" }: { variante?: "inferior" | "sidebar" }) {
  if (variante === "sidebar") {
    return (
      <nav className="flex flex-1 flex-col gap-2 p-4">
        {items.map(({ to, label, icon: IconCmp, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "bg-primary/10 text-primary" : "text-neutral hover:bg-base-soft"
              }`
            }
          >
            <IconCmp size={20} strokeWidth={2.2} />
            {label}
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-secondary/40 bg-surface/95 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur">
      {items.map(({ to, label, icon: IconCmp, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition-colors ${
              isActive ? "text-primary" : "text-neutral"
            }`
          }
        >
          <IconCmp size={20} strokeWidth={2.2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
