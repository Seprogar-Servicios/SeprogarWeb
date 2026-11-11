import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ChevronRight, Images, Users, X, ChevronLeft, MessageCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { StickyWhatsApp } from '../components/StickyWhatsApp';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { Seo } from '../components/seo/Seo';
import { breadcrumbJsonLd, serviceJsonLd } from '../components/seo/JsonLd';
import { fetchEspecialidadBySlug } from '../lib/api/especialidades';
import { getPublicMediaUrl } from '../lib/supabase';
import { buildServiceDescription, buildServiceTitle } from '../lib/seo';
import { useSiteContent } from '../contexts/SiteContentContext';
import { whatsappLink } from '../lib/fallbackContent';
import type { EspecialidadDetalle, Fotografia } from '../types/database';

export function SpecialtyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { content } = useSiteContent();
  const [data, setData] = useState<EspecialidadDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<{ photos: Fotografia[]; index: number } | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setLightbox(null);

    (async () => {
      try {
        const result = await fetchEspecialidadBySlug(slug);
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar la especialidad.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') {
        setLightbox((prev) =>
          prev ? { ...prev, index: (prev.index + 1) % prev.photos.length } : prev,
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightbox((prev) =>
          prev
            ? { ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length }
            : prev,
        );
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const cover = getPublicMediaUrl(data?.imagen_portada);
  const description = data
    ? buildServiceDescription(data.nombre, data.descripcion_breve, data.descripcion_completa)
    : undefined;

  return (
    <div className="min-h-screen flex flex-col">
      {data ? (
        <Seo
          title={buildServiceTitle(data.nombre)}
          description={description}
          path={`/servicios/${data.slug}`}
          image={cover}
          jsonLd={[
            serviceJsonLd({
              nombre: data.nombre,
              slug: data.slug,
              description: description || data.nombre,
              image: cover,
            }),
            breadcrumbJsonLd([
              { name: 'Inicio', path: '/' },
              { name: 'Servicios', path: '/#servicios' },
              { name: data.nombre, path: `/servicios/${data.slug}` },
            ]),
          ]}
        />
      ) : (
        <Seo title="Servicio SEPROGAR" path={slug ? `/servicios/${slug}` : '/'} />
      )}
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4">
          <nav aria-label="Migas de pan" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-muted">
            <Link to="/" className="hover:text-[#F37021]">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/#servicios" className="hover:text-[#F37021]">
              Servicios
            </Link>
            {data ? (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-foreground font-medium">{data.nombre}</span>
              </>
            ) : null}
          </nav>
          <Link
            to="/#servicios"
            className="inline-flex items-center text-sm font-medium text-muted hover:text-[#F37021] mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a servicios
          </Link>

          {loading ? <Spinner /> : null}
          {error ? <EmptyState title="Error" description={error} /> : null}
          {!loading && !error && !data ? (
            <EmptyState
              title="Especialidad no encontrada"
              description="Puede que no exista o que aún no esté publicada."
            />
          ) : null}

          {data ? (
            <div className="space-y-12 md:space-y-16">
              <header className="relative overflow-hidden rounded-[2rem] border border-theme bg-surface shadow-[0_24px_60px_-36px_rgba(15,23,42,0.55)]">
                <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative min-h-[260px] md:min-h-[380px] overflow-hidden">
                    {cover ? (
                      <motion.img
                        src={cover}
                        alt={data.nombre}
                        className="absolute inset-0 h-full w-full object-cover"
                        initial={{ scale: 1.06 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#000336] to-[#0F4C81]" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000336]/55 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#000336]/20" />
                  </div>
                  <div className="relative flex flex-col justify-center p-6 md:p-10">
                    <div className="inline-flex w-fit items-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 shadow-brand">
                      Especialidad
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground mb-4 leading-tight">
                      {data.nombre}
                    </h1>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-[#F37021] to-[#FF9E5E] rounded-full mb-5" />
                    <p className="text-muted leading-relaxed text-base md:text-lg whitespace-pre-line mb-6">
                      {data.descripcion_completa || data.descripcion_breve || 'Sin descripción.'}
                    </p>
                    <a
                      href={whatsappLink(
                        content.settings.whatsapp,
                        `Hola Seprogar, quiero consultar por ${data.nombre}`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#F37021] to-[#FF9E5E] px-5 py-3 text-sm font-semibold text-white shadow-brand hover:brightness-105 transition"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Consultar este servicio
                    </a>
                  </div>
                </div>
              </header>

              <section>
                <div className="mb-6 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Images className="w-5 h-5 text-[#F37021]" />
                      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                        Trabajos realizados
                      </h2>
                    </div>
                    <p className="text-sm text-muted">Tocá una foto para verla en grande.</p>
                  </div>
                </div>
                {data.trabajos.length === 0 ? (
                  <EmptyState
                    title="Todavía no hay trabajos publicados"
                    description="Pronto vas a ver proyectos de esta especialidad."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                    {data.trabajos.map((trabajo, tIndex) => {
                      const photos = trabajo.fotografias ?? [];
                      return (
                        <motion.article
                          key={trabajo.id}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: Math.min(tIndex * 0.05, 0.2) }}
                          className="flex flex-col rounded-[1.75rem] border border-theme bg-surface shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] overflow-hidden h-full"
                        >
                          {photos.length > 0 ? (
                            <div
                              className={`grid gap-1.5 p-1.5 ${
                                photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                              }`}
                            >
                              {photos.slice(0, 4).map((photo, index) => {
                                const url = getPublicMediaUrl(photo.storage_path);
                                if (!url) return null;
                                return (
                                  <button
                                    key={photo.id}
                                    type="button"
                                    onClick={() => setLightbox({ photos, index })}
                                    className={`group relative overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F37021] ${
                                      photos.length === 1 ? 'aspect-[16/10]' : 'aspect-square'
                                    } ${photos.length === 3 && index === 0 ? 'col-span-2 aspect-[16/9]' : ''}`}
                                  >
                                    <img
                                      src={url}
                                      alt={photo.alt_text || trabajo.titulo}
                                      loading="lazy"
                                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" />
                          )}
                          <div className="p-5 md:p-6 flex-1">
                            <h3 className="font-display text-lg md:text-xl font-bold text-foreground">
                              {trabajo.titulo}
                            </h3>
                            {trabajo.descripcion ? (
                              <p className="mt-2 text-sm text-muted leading-relaxed line-clamp-3">
                                {trabajo.descripcion}
                              </p>
                            ) : null}
                          </div>
                        </motion.article>
                      );
                    })}
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-[#F37021]" />
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                    Equipo de trabajo
                  </h2>
                </div>
                {data.personas.length === 0 ? (
                  <EmptyState
                    title="Equipo por confirmar"
                    description="Cuando haya integrantes asignados a esta especialidad, aparecerán aquí."
                  />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {data.personas.map((persona) => {
                      const photo = getPublicMediaUrl(persona.fotografia_path);
                      return (
                        <div
                          key={persona.id}
                          className="rounded-3xl border border-theme bg-surface p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-[#F37021]/30"
                        >
                          <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full border-2 border-[#F37021]/20 bg-slate-100 dark:bg-slate-800">
                            {photo ? (
                              <img
                                src={photo}
                                alt={persona.nombre}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#000336] to-[#0F4C81] text-white text-2xl font-semibold">
                                {persona.nombre.charAt(0)}
                              </div>
                            )}
                          </div>
                          <p className="font-semibold text-foreground">{persona.nombre}</p>
                          {persona.cargo ? (
                            <p className="text-sm text-muted mt-1">{persona.cargo}</p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
      <StickyWhatsApp />

      <AnimatePresence>
        {lightbox ? (
          <motion.div
            className="fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-white/90 p-2.5 rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => setLightbox(null)}
              aria-label="Cerrar"
            >
              <X />
            </button>
            {lightbox.photos.length > 1 ? (
              <>
                <button
                  type="button"
                  className="absolute left-3 md:left-6 text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((prev) =>
                      prev
                        ? {
                            ...prev,
                            index: (prev.index - 1 + prev.photos.length) % prev.photos.length,
                          }
                        : prev,
                    );
                  }}
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  type="button"
                  className="absolute right-3 md:right-6 text-white p-2.5 rounded-full bg-white/10 hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox((prev) =>
                      prev ? { ...prev, index: (prev.index + 1) % prev.photos.length } : prev,
                    );
                  }}
                  aria-label="Siguiente"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            ) : null}
            <motion.div
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getPublicMediaUrl(lightbox.photos[lightbox.index]?.storage_path) ?? ''}
                alt={lightbox.photos[lightbox.index]?.alt_text || 'Fotografía del trabajo'}
                className="max-h-[78vh] mx-auto w-auto max-w-full object-contain rounded-xl shadow-2xl"
              />
              <p className="mt-4 text-center text-sm text-white/70">
                {lightbox.index + 1} / {lightbox.photos.length}
                {lightbox.photos[lightbox.index]?.alt_text
                  ? ` · ${lightbox.photos[lightbox.index]?.alt_text}`
                  : ''}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
