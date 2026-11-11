import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Wrench } from 'lucide-react';
import { fetchEspecialidadesPublicas } from '../lib/api/especialidades';
import { getPublicMediaUrl } from '../lib/supabase';
import type { Especialidad } from '../types/database';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { useSiteContent } from '../contexts/SiteContentContext';

export const Services = () => {
  const { content } = useSiteContent();
  const intro = content.services;
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
    <section id="servicios" className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#F37021]/35 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-9 md:mb-11 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F37021] mb-2">
              {intro.eyebrow}
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
              {intro.headline}{' '}
              {intro.highlight ? <span className="text-gradient-brand">{intro.highlight}</span> : null}
            </h2>
          </div>
          <p className="text-sm md:text-base text-muted leading-relaxed max-w-md md:text-right">
            {intro.subheadline}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {items.map((item, index) => {
              const imageUrl = getPublicMediaUrl(item.imagen_portada);
              const featured = index === 0 && items.length > 2;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
                  className={featured ? 'sm:col-span-2 lg:col-span-1 lg:row-span-1' : ''}
                >
                  <Link
                    to={`/servicios/${item.slug}`}
                    className="group relative block overflow-hidden rounded-3xl border border-theme bg-surface shadow-[0_18px_40px_-28px_rgba(15,23,42,0.4)] transition-all duration-500 hover:border-[#F37021]/40 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F37021] focus-visible:ring-offset-2"
                  >
                    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-800 ${featured ? 'aspect-[16/11]' : 'aspect-[4/3]'}`}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`Servicio de ${item.nombre} — SEPROGAR`}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#000336] to-[#0F4C81] text-white/80">
                          <Wrench className="w-8 h-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#000336]/85 via-[#000336]/25 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
                      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                        <div className="flex items-end justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-display text-lg md:text-xl font-bold text-white truncate">
                              {item.nombre}
                            </h3>
                            {item.descripcion_breve ? (
                              <p className="mt-1 text-xs md:text-sm text-white/75 line-clamp-2">
                                {item.descripcion_breve}
                              </p>
                            ) : null}
                          </div>
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-[#F37021] group-hover:scale-105">
                            <ArrowUpRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
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
