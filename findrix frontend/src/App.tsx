import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { RequireAuth } from "./components/auth/RequireAuth";
import { LoginPage } from "./pages/LoginPage";
import { RegistroPage } from "./pages/RegistroPage";
import { InicioPage } from "./pages/InicioPage";
import { MovimientosPage } from "./pages/MovimientosPage";
import { MetasPage } from "./pages/MetasPage";
import { MasPage } from "./pages/MasPage";
import { CategoriasPage } from "./pages/CategoriasPage";
import { ReportesPage } from "./pages/ReportesPage";
import { PerfilPage } from "./pages/PerfilPage";
import { SeguridadPage } from "./pages/SeguridadPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegistroPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<InicioPage />} />
          <Route path="/movimientos" element={<MovimientosPage />} />
          <Route path="/metas" element={<MetasPage />} />
          <Route path="/mas" element={<MasPage />} />
          <Route path="/mas/categorias" element={<CategoriasPage />} />
          <Route path="/mas/reportes" element={<ReportesPage />} />
          <Route path="/mas/perfil" element={<PerfilPage />} />
          <Route path="/mas/seguridad" element={<SeguridadPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
