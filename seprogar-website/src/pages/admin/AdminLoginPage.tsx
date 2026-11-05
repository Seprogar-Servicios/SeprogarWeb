import { type FormEvent, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Seo } from '../../components/seo/Seo';
import { ThemeToggle } from '../../components/ThemeToggle';
import { AdminAlert, AdminButton, AdminField, AdminInput } from '../../components/admin/adminUi';

export function AdminLoginPage() {
  const { signIn, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAdmin) {
    return <Navigate to="/gestion-seprogar/panel" replace />;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate('/gestion-seprogar/panel', { replace: true });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
      <Seo
        title="Gestión SEPROGAR"
        description="Acceso administrativo privado"
        path="/gestion-seprogar"
        noindex
      />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-[#F37021]/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-[#0F4C81]/25 blur-3xl" />
      </div>

      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-3">
          <img src="/img/Seprogar-Logo-02.png" alt="" className="h-10 w-auto" />
          <img src="/img/Seprogar-Logo-03.png" alt="SEPROGAR" className="h-8 w-auto dark:brightness-0 dark:invert" />
        </div>

        <div className="rounded-3xl border border-theme bg-surface p-7 md:p-8 shadow-[0_24px_80px_-32px_rgba(0,0,0,0.55)]">
          <div className="flex items-start gap-3 mb-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F37021] to-[#FF9E5E] text-white shadow-brand">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl font-extrabold text-foreground">Gestión SEPROGAR</h1>
              <p className="mt-1 text-sm text-muted">Acceso exclusivo para administradores</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <AdminField label="Correo">
              <AdminInput
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@seprogar.com"
              />
            </AdminField>

            <AdminField label="Contraseña">
              <div className="relative mt-1.5">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-theme bg-surface-elevated px-3.5 py-2.5 pr-11 text-sm text-foreground placeholder:text-muted/70 outline-none transition focus:border-[#F37021]/50 focus:ring-2 focus:ring-[#F37021]/25"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted hover:text-foreground"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </AdminField>

            {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

            <AdminButton
              type="submit"
              variant="brand"
              disabled={submitting || loading}
              className="w-full py-3"
            >
              <LogIn className="h-4 w-4" />
              {submitting ? 'Ingresando…' : 'Iniciar sesión'}
            </AdminButton>
          </form>
        </div>

        <p className="mt-5 text-center text-xs text-muted">
          Panel privado · no indexado · sin registro público
        </p>
      </div>
    </div>
  );
}
