import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  LogOut,
  Settings2,
  Users,
  Wrench,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Seo } from '../../components/seo/Seo';
import { ThemeToggle } from '../../components/ThemeToggle';

const links = [
  { to: '/gestion-seprogar/panel', end: true, label: 'Resumen', icon: LayoutDashboard },
  { to: '/gestion-seprogar/panel/especialidades', label: 'Especialidades', icon: Wrench },
  { to: '/gestion-seprogar/panel/trabajos', label: 'Trabajos', icon: Images },
  { to: '/gestion-seprogar/panel/personas', label: 'Equipo', icon: Users },
  { to: '/gestion-seprogar/panel/contenido', label: 'Contenido', icon: FileText },
  { to: '/gestion-seprogar/panel/ajustes', label: 'Ajustes', icon: Settings2 },
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
    <div className="min-h-screen text-foreground">
      <Seo
        title="Panel SEPROGAR"
        description="Administración privada"
        path="/gestion-seprogar/panel"
        noindex
      />

      <header className="sticky top-0 z-40 border-b border-theme bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/img/Seprogar-Logo-02.png" alt="" className="h-9 w-auto shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#F37021] font-bold">SEPROGAR</p>
              <h1 className="font-display text-base sm:text-lg font-extrabold text-foreground truncate">
                Panel de gestión
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-theme px-3 py-2 text-xs font-medium text-muted hover:text-foreground hover:border-[#F37021]/40 transition"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Ver web
            </a>
            <ThemeToggle />
            <span className="hidden md:inline max-w-[180px] truncate text-xs text-muted">
              {profile?.email}
            </span>
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="inline-flex items-center gap-2 rounded-xl border border-theme bg-surface-elevated px-3 py-2 text-sm font-medium text-foreground hover:border-[#F37021]/40 hover:text-[#F37021] transition"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>

        <nav className="mx-auto max-w-6xl px-4 pb-3 flex gap-1.5 overflow-x-auto">
          {links.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition ${
                  isActive
                    ? 'bg-[#F37021]/15 text-[#F37021] font-semibold'
                    : 'text-muted hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}
