import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { fetchEquipoPublico } from '../lib/api/personas';
import { getPublicMediaUrl } from '../lib/supabase';
import type { Persona } from '../types/database';
import { Spinner } from '../components/ui/Spinner';

export const Team = () => {
  const [people, setPeople] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchEquipoPublico();
        if (!cancelled) setPeople(data);
      } catch {
        if (!cancelled) setPeople([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  function scrollByCard(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(280, el.clientWidth * 0.7) * direction;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }

  if (!loading && people.length === 0) {
    return null;
  }

  return (
    <section id="equipo" className="relative py-14 md:py-16 overflow-hidden">
      <div className="absolute inset-0 bg-surface/50" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-7 md:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-xl">
            <div className="inline-flex items-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 shadow-brand">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Quiénes somos
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
              Nuestro <span className="text-gradient-brand">equipo</span>
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted leading-relaxed">
              Las personas detrás de cada servicio. En cada especialidad también verás al equipo
              asignado a ese rubro.
            </p>
          </div>

          {people.length > 3 ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-surface text-foreground hover:border-[#F37021]/40 hover:text-[#F37021] transition"
                aria-label="Anterior"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-theme bg-surface text-foreground hover:border-[#F37021]/40 hover:text-[#F37021] transition"
                aria-label="Siguiente"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </div>

        {loading ? <Spinner label="Cargando equipo…" /> : null}

        {!loading ? (
          <div
            ref={scrollerRef}
            className="flex gap-4 md:gap-5 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {people.map((persona, index) => {
              const photo = getPublicMediaUrl(persona.fotografia_path);
              return (
                <motion.article
                  key={persona.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.04, 0.24) }}
                  className="snap-start shrink-0 w-[148px] sm:w-[168px] text-center"
                >
                  <div className="mx-auto mb-3 h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-2 border-[#F37021]/25 bg-slate-200 dark:bg-slate-800 shadow-sm">
                    {photo ? (
                      <img
                        src={photo}
                        alt={persona.nombre}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#000336] to-[#0F4C81] text-2xl font-bold text-white">
                        {persona.nombre.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="font-display text-sm sm:text-base font-bold text-foreground leading-snug">
                    {persona.nombre}
                  </h3>
                  {persona.cargo ? (
                    <p className="mt-1 text-xs text-muted leading-snug">{persona.cargo}</p>
                  ) : null}
                </motion.article>
              );
            })}
          </div>
        ) : null}
      </div>
    </section>
  );
};
