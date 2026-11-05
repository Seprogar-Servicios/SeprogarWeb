import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-gray-600">
        Verificando sesión…
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/gestion-seprogar" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
