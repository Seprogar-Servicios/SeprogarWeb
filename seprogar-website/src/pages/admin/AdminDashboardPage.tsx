import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Images, Shield, Users, Wrench } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { AdminAlert, AdminCard, AdminPageHeader } from '../../components/admin/adminUi';

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
    {
      label: 'Especialidades',
      value: counts.especialidades,
      to: '/gestion-seprogar/panel/especialidades',
      icon: Wrench,
      hint: 'Servicios del catálogo',
    },
    {
      label: 'Trabajos',
      value: counts.trabajos,
      to: '/gestion-seprogar/panel/trabajos',
      icon: Images,
      hint: 'Proyectos y fotos',
    },
    {
      label: 'Integrantes',
      value: counts.personas,
      to: '/gestion-seprogar/panel/personas',
      icon: Users,
      hint: 'Equipo visible en la web',
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Resumen"
        description="Administrá el catálogo público. Los cambios publicados se reflejan en la web."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.to}
              className="group rounded-2xl border border-theme bg-surface p-5 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.45)] transition hover:border-[#F37021]/40 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#F37021]/15 text-[#F37021]">
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted opacity-0 transition group-hover:opacity-100 group-hover:text-[#F37021]" />
              </div>
              <p className="mt-4 text-sm text-muted">{card.label}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-foreground">{card.value}</p>
              <p className="mt-1 text-xs text-muted">{card.hint}</p>
            </Link>
          );
        })}
      </div>

      <AdminCard>
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Seguridad</p>
            <p className="mt-1 text-sm text-muted leading-relaxed">
              El alta del primer administrador se hace de forma manual (Studio/SQL). No hay registro
              público. La ruta de este panel no aparece en la web promocional.
            </p>
          </div>
        </div>
      </AdminCard>

      <AdminAlert tone="info">
        Tip: usá el interruptor de tema en la barra superior para trabajar en claro u oscuro.
      </AdminAlert>
    </div>
  );
}
