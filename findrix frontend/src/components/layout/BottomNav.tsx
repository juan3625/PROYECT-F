import { NavLink } from "react-router-dom";
import { Home, ListChecks, Target, MoreHorizontal } from "lucide-react";

const items = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/movimientos", label: "Movimientos", icon: ListChecks },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/mas", label: "Más", icon: MoreHorizontal },
];

export function BottomNav() {
  return (
    <nav className="absolute inset-x-0 bottom-0 flex items-center justify-around border-t border-secondary/40 bg-surface/95 backdrop-blur px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
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
