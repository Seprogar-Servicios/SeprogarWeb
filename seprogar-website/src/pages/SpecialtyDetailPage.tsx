import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Images, Users, X, ChevronLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { Seo } from '../components/seo/Seo';
import { breadcrumbJsonLd, serviceJsonLd } from '../components/seo/JsonLd';
import { fetchEspecialidadBySlug } from '../lib/api/especialidades';
import { getPublicMediaUrl } from '../lib/supabase';
import {
  buildServiceDescription,
  buildServiceTitle,
} from '../lib/seo';
import type { EspecialidadDetalle, Fotografia } from '../types/database';

export function SpecialtyDetailPage() {
  const { slug } = useParams<{ slug: string }>();
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
          prev ? { ...prev, index: (prev.index + 1) % prev.photos.length } : prev
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightbox((prev) =>
          prev
            ? { ...prev, index: (prev.index - 1 + prev.photos.length) % prev.photos.length }
            : prev
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
            <Link to="/" className="hover:text-[#F37021]">Inicio</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link to="/#servicios" className="hover:text-[#F37021]">Servicios</Link>
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
            <div className="space-y-8 md:space-y-10">
              <header className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
                <div className="relative aspect-[16/10] max-h-[360px] rounded-2xl overflow-hidden bg-slate-100 shadow-lg">
                  {cover ? (
                    <img src={cover} alt={data.nombre} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#000336] to-[#0F4C81]" />
                  )}
                </div>
                <div>
                  <div className="inline-flex items-center bg-gradient-to-r from-[#F37021] to-[#FF9E5E] text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
                    Especialidad
                  </div>
                  <h1 className="font-display text-3xl md:text-5xl font-extrabold text-foreground mb-4">{data.nombre}</h1>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-[#F37021] to-[#FF9E5E] rounded-full mb-5" />
                  <p className="text-muted leading-relaxed text-base md:text-lg whitespace-pre-line">
                    {data.descripcion_completa || data.descripcion_breve || 'Sin descripción.'}
                  </p>
                </div>
              </header>

              <section>
                <div className="flex items-center gap-2 mb-5">
                  <Images className="w-5 h-5 text-[#F37021]" />
                  <h2 className="font-display text-2xl font-bold text-foreground">Trabajos realizados</h2>
                </div>
                {data.trabajos.length === 0 ? (
                  <EmptyState
                    title="Todavía no hay trabajos publicados"
                    description="Pronto vas a ver proyectos de esta especialidad."
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {data.trabajos.map((trabajo) => {
                      const photos = trabajo.fotografias ?? [];
                      return (
                        <article
                          key={trabajo.id}
                          className="flex flex-col rounded-3xl border border-theme bg-surface shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] overflow-hidden h-full"
                        >
                          {photos.length > 0 ? (
                            <div
                              className={`grid gap-1 p-1 ${
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
                                    className={`relative overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F37021] ${
                                      photos.length === 1 ? 'aspect-[16/10]' : 'aspect-square'
                                    } ${photos.length === 3 && index === 0 ? 'col-span-2 aspect-[16/9]' : ''}`}
                                  >
                                    <img
                                      src={url}
                                      alt={photo.alt_text || trabajo.titulo}
                                      loading="lazy"
                                      className="h-full w-full object-cover"
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200" />
                          )}
                          <div className="p-4 md:p-5 flex-1">
                            <h3 className="font-display text-lg font-bold text-foreground">{trabajo.titulo}</h3>
                            {trabajo.descripcion ? (
                              <p className="mt-2 text-sm text-muted line-clamp-3">{trabajo.descripcion}</p>
                            ) : null}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-5 h-5 text-[#F37021]" />
                  <h2 className="font-display text-2xl font-bold text-foreground">Equipo de trabajo</h2>
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
                          className="rounded-3xl border border-theme bg-surface p-4 text-center shadow-sm"
                        >
                          <div className="mx-auto mb-3 h-24 w-24 overflow-hidden rounded-full bg-slate-100">
                            {photo ? (
                              <img
                                src={photo}
                                alt={persona.nombre}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400 text-2xl font-semibold">
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

      {lightbox ? (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute top-4 right-4 text-white p-2 rounded-full hover:bg-white/10"
            onClick={() => setLightbox(null)}
            aria-label="Cerrar"
          >
            <X />
          </button>
          {lightbox.photos.length > 1 ? (
            <>
              <button
                type="button"
                className="absolute left-3 md:left-6 text-white p-2 rounded-full hover:bg-white/10"
                onClick={() =>
                  setLightbox((prev) =>
                    prev
                      ? {
                          ...prev,
                          index: (prev.index - 1 + prev.photos.length) % prev.photos.length,
                        }
                      : prev
                  )
                }
                aria-label="Anterior"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                className="absolute right-3 md:right-6 text-white p-2 rounded-full hover:bg-white/10"
                onClick={() =>
                  setLightbox((prev) =>
                    prev ? { ...prev, index: (prev.index + 1) % prev.photos.length } : prev
                  )
                }
                aria-label="Siguiente"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          ) : null}
          <img
            src={getPublicMediaUrl(lightbox.photos[lightbox.index]?.storage_path) ?? ''}
            alt={lightbox.photos[lightbox.index]?.alt_text || 'Fotografía del trabajo'}
            className="max-h-[85vh] max-w-full object-contain rounded-lg"
          />
        </div>
      ) : null}
    </div>
  );
}
