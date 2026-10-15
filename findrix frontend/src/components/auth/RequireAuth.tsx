import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AppDataProvider } from "../../context/AppDataContext";

export function RequireAuth() {
  const { usuario } = useAuth();

  if (!usuario) return <Navigate to="/login" replace />;

  return (
    <AppDataProvider>
      <Outlet />
    </AppDataProvider>
  );
}
