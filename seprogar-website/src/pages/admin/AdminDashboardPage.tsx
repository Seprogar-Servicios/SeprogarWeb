import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export function AdminDashboardPage() {
  const [counts, setCounts] = useState({ especialidades: 0, trabajos: 0, personas: 0 });

  useEffect(() => {
    void (async () => {
      const [e, t, p] = await Promise.all([
        supabase.from('especialidades').select('id', { count: 'exact', head: true }),
        supabase.from('trabajos').select('id', { count: 'exact', head: true }),
        supabase.from('personas').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({
        especialidades: e.count ?? 0,
        trabajos: t.count ?? 0,
        personas: p.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: 'Especialidades', value: counts.especialidades, to: '/gestion-seprogar/panel/especialidades' },
    { label: 'Trabajos', value: counts.trabajos, to: '/gestion-seprogar/panel/trabajos' },
    { label: 'Integrantes', value: counts.personas, to: '/gestion-seprogar/panel/personas' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Resumen</h2>
        <p className="text-gray-500 text-sm mt-1">
          Administrá el catálogo público. Los cambios publicados se reflejan en la web.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#F37021]/40"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
          </Link>
        ))}
      </div>
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-medium">Seguridad</p>
        <p className="mt-1">
          El alta del primer administrador se hace de forma manual (Studio/SQL). No hay registro
          público. La ruta de este panel no aparece en la web promocional.
        </p>
      </div>
    </div>
  );
}
