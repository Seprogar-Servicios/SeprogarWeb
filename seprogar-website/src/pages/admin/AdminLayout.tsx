import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Briefcase, Images, LayoutDashboard, LogOut, Users, Wrench } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Seo } from '../../components/seo/Seo';

const links = [
  { to: '/gestion-seprogar/panel', end: true, label: 'Resumen', icon: LayoutDashboard },
  { to: '/gestion-seprogar/panel/especialidades', label: 'Especialidades', icon: Wrench },
  { to: '/gestion-seprogar/panel/trabajos', label: 'Trabajos', icon: Images },
  { to: '/gestion-seprogar/panel/personas', label: 'Equipo', icon: Users },
  { to: '/gestion-seprogar/panel/administradores', label: 'Administradores', icon: Briefcase },
];

export function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await signOut();
    navigate('/gestion-seprogar', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Seo
        title="Panel SEPROGAR"
        description="Administración privada"
        path="/gestion-seprogar/panel"
        noindex
      />
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-[#F37021] font-semibold">SEPROGAR</p>
            <h1 className="text-lg font-bold">Panel de gestión</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-gray-500">{profile?.email}</span>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-4 pb-3 flex gap-2 overflow-x-auto">
          {links.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm whitespace-nowrap ${
                  isActive
                    ? 'bg-[#F37021]/10 text-[#F37021] font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
