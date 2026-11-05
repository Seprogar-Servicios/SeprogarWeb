import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Wrench } from 'lucide-react';
import { fetchEspecialidadesPublicas } from '../lib/api/especialidades';
import { getPublicMediaUrl } from '../lib/supabase';
import type { Especialidad } from '../types/database';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';

export const Services = () => {
  const [items, setItems] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchEspecialidadesPublicas();
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'No se pudieron cargar los servicios.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="servicios" className="relative py-14 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-7 md:mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F37021] mb-2">
            Servicios
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Nuestros servicios
          </h2>
          <p className="text-sm md:text-base text-muted leading-relaxed">
            Especialidades disponibles. Entrá al detalle para ver trabajos realizados.
          </p>
        </div>

        {loading ? <Spinner label="Cargando especialidades…" /> : null}
        {error ? <EmptyState title="No pudimos cargar el catálogo" description={error} /> : null}
        {!loading && !error && items.length === 0 ? (
          <EmptyState
            title="Pronto vas a ver nuestras especialidades"
            description="Estamos preparando el catálogo de servicios."
          />
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
            {items.map((item, index) => {
              const imageUrl = getPublicMediaUrl(item.imagen_portada);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.2) }}
                >
                  <Link
                    to={`/servicios/${item.slug}`}
                    className="group block rounded-2xl border border-theme bg-surface overflow-hidden transition-colors hover:border-[#F37021]/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F37021] focus-visible:ring-offset-2"
                  >
                    <div className="relative aspect-[3/2] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`Servicio de ${item.nombre} — SEPROGAR`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#000336]/90 to-[#0F4C81] text-white/80">
                          <Wrench className="w-7 h-7" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 px-3.5 py-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-sm md:text-base font-bold text-foreground truncate group-hover:text-[#F37021] transition-colors">
                          {item.nombre}
                        </h3>
                        {item.descripcion_breve ? (
                          <p className="mt-0.5 text-xs text-muted line-clamp-1">{item.descripcion_breve}</p>
                        ) : null}
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted group-hover:text-[#F37021] transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};
