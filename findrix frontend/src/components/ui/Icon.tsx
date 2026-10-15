import {
  ShoppingCart,
  Bus,
  Home,
  CreditCard,
  HeartPulse,
  Briefcase,
  Wallet,
  Plane,
  ShieldCheck,
  HandCoins,
  Tag,
  Gift,
  Utensils,
  Dumbbell,
  GraduationCap,
  PawPrint,
  Smartphone,
  Film,
  Coffee,
  Gamepad2,
  type LucideProps,
} from "lucide-react";

const registro: Record<string, React.ComponentType<LucideProps>> = {
  ShoppingCart,
  Bus,
  Home,
  CreditCard,
  HeartPulse,
  Briefcase,
  Wallet,
  Plane,
  ShieldCheck,
  HandCoins,
  Tag,
  Gift,
  Utensils,
  Dumbbell,
  GraduationCap,
  PawPrint,
  Smartphone,
  Film,
  Coffee,
  Gamepad2,
};

// Íconos disponibles para que el usuario elija al crear una categoría propia.
export const iconosCategoria = Object.keys(registro);

export function Icon({ nombre, ...props }: { nombre: string } & LucideProps) {
  const Comp = registro[nombre] ?? Wallet;
  return <Comp {...props} />;
}
