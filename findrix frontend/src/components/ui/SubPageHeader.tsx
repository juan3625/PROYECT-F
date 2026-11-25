import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function SubPageHeader({ titulo }: { titulo: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 px-5 pt-6">
      <button
        onClick={() => navigate(-1)}
        aria-label="Volver"
        className="flex h-8 w-8 items-center justify-center rounded-full text-primary-dark"
      >
        <ChevronLeft size={20} />
      </button>
      <p className="font-display text-xl text-primary-dark">{titulo}</p>
    </div>
  );
}
