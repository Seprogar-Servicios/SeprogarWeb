import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Profile } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';
import { Spinner } from '../../components/ui/Spinner';

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
        : `Se otorgó acceso admin a ${profile.email}`
    );
    await load();
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Administradores</h2>
        <p className="text-sm text-gray-500 mt-1">
          El primer usuario se crea manualmente en Supabase Studio (Auth → Add user) y luego se marca{' '}
          <code className="text-xs bg-slate-100 px-1 rounded">is_admin = true</code> en la tabla{' '}
          <code className="text-xs bg-slate-100 px-1 rounded">profiles</code>. El registro público está
          deshabilitado. Usuarios adicionales: crearlos en Studio y asignar el rol aquí o por SQL.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p> : null}
      {message ? <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{message}</p> : null}

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Admin</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-t">
                <td className="px-4 py-3">{profile.email}</td>
                <td className="px-4 py-3 text-gray-500">{profile.full_name || '—'}</td>
                <td className="px-4 py-3">{profile.is_admin ? 'Sí' : 'No'}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => void toggleAdmin(profile)}
                    disabled={profile.id === user?.id}
                    className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40"
                  >
                    {profile.is_admin ? 'Quitar admin' : 'Hacer admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
