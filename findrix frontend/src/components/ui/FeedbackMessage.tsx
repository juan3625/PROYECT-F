export function FeedbackMessage({
  tipo,
  children,
}: {
  tipo: "error" | "exito";
  children: string;
}) {
  return (
    <p
      role="alert"
      className={`rounded-lg px-3 py-2 text-xs font-medium ${
        tipo === "error" ? "bg-danger/10 text-danger" : "bg-green/10 text-green"
      }`}
    >
      {children}
    </p>
  );
}
