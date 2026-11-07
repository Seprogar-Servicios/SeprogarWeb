import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteContentProvider } from './contexts/SiteContentContext';
import { RequireAdmin } from './components/RequireAdmin';
import { HomePage } from './pages/HomePage';
import { SpecialtyDetailPage } from './pages/SpecialtyDetailPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { EspecialidadesAdminPage } from './pages/admin/EspecialidadesAdminPage';
import { TrabajosAdminPage } from './pages/admin/TrabajosAdminPage';
import { PersonasAdminPage } from './pages/admin/PersonasAdminPage';
import { AdminsPage } from './pages/admin/AdminsPage';
import { ContenidoAdminPage } from './pages/admin/ContenidoAdminPage';
import { AjustesAdminPage } from './pages/admin/AjustesAdminPage';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteContentProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/servicios/:slug" element={<SpecialtyDetailPage />} />

              <Route path="/gestion-seprogar" element={<AdminLoginPage />} />
              <Route
                path="/gestion-seprogar/panel"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<AdminDashboardPage />} />
                <Route path="especialidades" element={<EspecialidadesAdminPage />} />
                <Route path="trabajos" element={<TrabajosAdminPage />} />
                <Route path="personas" element={<PersonasAdminPage />} />
                <Route path="contenido" element={<ContenidoAdminPage />} />
                <Route path="ajustes" element={<AjustesAdminPage />} />
                <Route path="administradores" element={<AdminsPage />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </SiteContentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
