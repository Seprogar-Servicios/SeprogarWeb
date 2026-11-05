import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../../components/ui/Spinner';
import {
  AdminAlert,
  AdminButton,
  AdminPageHeader,
  AdminTable,
  AdminTd,
  AdminTh,
} from '../../components/admin/adminUi';

export function AdminsPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });
    if (err) setError(err.message);
    else setProfiles(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function toggleAdmin(profile: Profile) {
    if (profile.id === user?.id) {
      setError('No podés quitarte el rol de administrador a vos mismo desde aquí.');
      return;
    }
    setError(null);
    setMessage(null);
    const { error: err } = await supabase
      .from('profiles')
      .update({ is_admin: !profile.is_admin })
      .eq('id', profile.id);
    if (err) {
      setError(err.message);
      return;
    }
    setMessage(
      profile.is_admin
        ? `Se quitó el acceso admin a ${profile.email}`
        : `Se otorgó acceso admin a ${profile.email}`,
    );
    await load();
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Administradores"
        description={
          <>
            El primer usuario se crea manualmente en Supabase Studio (Auth → Add user) y luego se marca{' '}
            <code className="rounded bg-surface-elevated border border-theme px-1.5 py-0.5 text-xs text-foreground">
              is_admin = true
            </code>{' '}
            en{' '}
            <code className="rounded bg-surface-elevated border border-theme px-1.5 py-0.5 text-xs text-foreground">
              profiles
            </code>
            . El registro público está deshabilitado.
          </>
        }
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}
      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}

      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Email</AdminTh>
            <AdminTh>Nombre</AdminTh>
            <AdminTh>Admin</AdminTh>
            <AdminTh />
          </tr>
        </thead>
        <tbody>
          {profiles.map((profile) => (
            <tr key={profile.id}>
              <AdminTd className="font-medium">{profile.email}</AdminTd>
              <AdminTd className="text-muted">{profile.full_name || '—'}</AdminTd>
              <AdminTd>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    profile.is_admin
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : 'bg-slate-500/15 text-muted'
                  }`}
                >
                  {profile.is_admin ? 'Admin' : 'Usuario'}
                </span>
              </AdminTd>
              <AdminTd className="text-right">
                <AdminButton
                  type="button"
                  variant="secondary"
                  className="!px-3 !py-1.5 !text-xs"
                  onClick={() => void toggleAdmin(profile)}
                  disabled={profile.id === user?.id}
                >
                  {profile.is_admin ? 'Quitar admin' : 'Hacer admin'}
                </AdminButton>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}
