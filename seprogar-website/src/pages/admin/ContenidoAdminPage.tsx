import { useEffect, useMemo, useState } from 'react';
import {
  fetchSectionsAdmin,
  normalizeAbout,
  normalizeCoverage,
  normalizeFaq,
  normalizeHero,
  normalizeProcess,
  normalizeServices,
  publishAllSections,
  publishSection,
  updateSectionDraft,
} from '../../lib/api/content';
import type {
  AboutContent,
  CoverageContent,
  FaqContent,
  HeroContent,
  PageSection,
  ProcessContent,
  ServicesIntroContent,
} from '../../types/content';
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminTextarea,
  StatusBadge,
} from '../../components/admin/adminUi';
import { Spinner } from '../../components/ui/Spinner';
import { SECTION_ICON_OPTIONS } from '../../lib/sectionIcons';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero (inicio)',
  services: 'Servicios (textos)',
  faq: 'Preguntas frecuentes',
  coverage: 'Zonas de atención',
  process: 'Cómo trabajamos',
  about: 'Nosotros',
};

export function ContenidoAdminPage() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = useMemo(
    () => sections.find((section) => section.id === selectedId) ?? null,
    [sections, selectedId],
  );

  async function load() {
    setLoading(true);
    try {
      const data = await fetchSectionsAdmin();
      setSections(data);
      if (!selectedId && data[0]) setSelectedId(data[0].id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cargar el contenido.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveDraft() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateSectionDraft(
        selected.id,
        selected.draft_content,
        {
          is_visible: selected.is_visible,
          title: selected.title,
        },
        selected.section_key,
      );
      setSections((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setMessage('Borrador guardado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  async function publishCurrent() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await updateSectionDraft(
        selected.id,
        selected.draft_content,
        {
          is_visible: selected.is_visible,
          title: selected.title,
        },
        selected.section_key,
      );
      const updated = await publishSection(selected.id);
      setSections((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setMessage('Sección publicada en la web');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar.');
    } finally {
      setSaving(false);
    }
  }

  async function publishAll() {
    setSaving(true);
    setError(null);
    try {
      if (selected) {
        await updateSectionDraft(
          selected.id,
          selected.draft_content,
          {
            is_visible: selected.is_visible,
            title: selected.title,
          },
          selected.section_key,
        );
      }
      await publishAllSections();
      await load();
      setMessage('Todas las secciones publicadas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar todo.');
    } finally {
      setSaving(false);
    }
  }

  function patchDraft(updater: (prev: Record<string, unknown>) => Record<string, unknown>) {
    if (!selected) return;
    setSections((prev) =>
      prev.map((section) =>
        section.id === selected.id
          ? { ...section, draft_content: updater(section.draft_content || {}) }
          : section,
      ),
    );
  }

  if (loading) return <Spinner label="Cargando contenido…" />;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Contenido"
        description="Editá Hero, Servicios, Proceso, Nosotros, FAQ y Zonas. Guardá borrador y publicá."
        action={
          <div className="flex flex-wrap gap-2">
            <AdminButton type="button" variant="secondary" disabled={saving || !selected} onClick={() => void saveDraft()}>
              Guardar borrador
            </AdminButton>
            <AdminButton type="button" variant="primary" disabled={saving || !selected} onClick={() => void publishCurrent()}>
              Publicar sección
            </AdminButton>
            <AdminButton type="button" variant="brand" disabled={saving} onClick={() => void publishAll()}>
              Publicar todo
            </AdminButton>
          </div>
        }
      />

      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_1fr]">
        <AdminCard title="Secciones">
          <div className="space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  setSelectedId(section.id);
                  setMessage(null);
                  setError(null);
                }}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  selectedId === section.id
                    ? 'border-[#F37021]/40 bg-[#F37021]/10'
                    : 'border-theme hover:border-[#F37021]/30'
                }`}
              >
                <p className="text-sm font-semibold text-foreground">
                  {SECTION_LABELS[section.section_key] || section.title || section.section_key}
                </p>
                <div className="mt-1.5">
                  <StatusBadge published={!section.has_unpublished_changes} />
                </div>
              </button>
            ))}
          </div>
        </AdminCard>

        <AdminCard
          title={
            selected
              ? SECTION_LABELS[selected.section_key] || selected.title || selected.section_key
              : 'Editor'
          }
        >
          {!selected ? (
            <p className="text-muted text-sm">Seleccioná una sección.</p>
          ) : selected.section_key === 'faq' ? (
            <FaqEditor
              value={normalizeFaq(selected.draft_content)}
              onChange={(next) => patchDraft(() => next as unknown as Record<string, unknown>)}
            />
          ) : selected.section_key === 'coverage' ? (
            <CoverageEditor
              value={normalizeCoverage(selected.draft_content)}
              onChange={(next) => patchDraft(() => next as unknown as Record<string, unknown>)}
            />
          ) : selected.section_key === 'process' ? (
            <ProcessEditor
              value={normalizeProcess(selected.draft_content)}
              onChange={(next) => patchDraft(() => next as unknown as Record<string, unknown>)}
            />
          ) : selected.section_key === 'hero' ? (
            <HeroEditor
              value={normalizeHero(selected.draft_content)}
              onChange={(next) => patchDraft(() => next as unknown as Record<string, unknown>)}
            />
          ) : selected.section_key === 'about' ? (
            <AboutEditor
              value={normalizeAbout(selected.draft_content)}
              onChange={(next) => patchDraft(() => next as unknown as Record<string, unknown>)}
            />
          ) : selected.section_key === 'services' ? (
            <ServicesEditor
              value={normalizeServices(selected.draft_content)}
              onChange={(next) => patchDraft(() => next as unknown as Record<string, unknown>)}
            />
          ) : (
            <p className="text-muted text-sm">Tipo de sección aún no soportado en el editor.</p>
          )}
        </AdminCard>
      </div>
    </div>
  );
}

function IconSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <AdminSelect value={value} onChange={(e) => onChange(e.target.value)}>
      {SECTION_ICON_OPTIONS.map((option) => (
        <option key={option.value || 'none'} value={option.value}>
          {option.label}
        </option>
      ))}
    </AdminSelect>
  );
}

function FaqEditor({
  value,
  onChange,
}: {
  value: FaqContent;
  onChange: (next: FaqContent) => void;
}) {
  function updateItem(index: number, patch: Partial<FaqContent['items'][number]>) {
    onChange({
      ...value,
      items: value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Antetítulo">
          <AdminInput value={value.eyebrow} onChange={(e) => onChange({ ...value, eyebrow: e.target.value })} />
        </AdminField>
        <AdminField label="Palabra destacada">
          <AdminInput value={value.highlight} onChange={(e) => onChange({ ...value, highlight: e.target.value })} />
        </AdminField>
        <AdminField label="Título" className="md:col-span-2">
          <AdminInput value={value.headline} onChange={(e) => onChange({ ...value, headline: e.target.value })} />
        </AdminField>
        <AdminField label="Subtítulo" className="md:col-span-2">
          <AdminTextarea rows={3} value={value.subheadline} onChange={(e) => onChange({ ...value, subheadline: e.target.value })} />
        </AdminField>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-semibold text-foreground">Preguntas</h4>
          <AdminButton
            type="button"
            variant="secondary"
            className="!py-1.5 !text-xs"
            onClick={() =>
              onChange({
                ...value,
                items: [...value.items, { question: 'Nueva pregunta', answer: 'Respuesta…' }],
              })
            }
          >
            Agregar
          </AdminButton>
        </div>
        {value.items.map((item, index) => (
          <div key={index} className="rounded-xl border border-theme bg-surface-elevated p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">#{index + 1}</p>
              <AdminButton
                type="button"
                variant="danger"
                className="!py-1 !px-2.5 !text-xs"
                onClick={() =>
                  onChange({ ...value, items: value.items.filter((_, i) => i !== index) })
                }
              >
                Quitar
              </AdminButton>
            </div>
            <AdminField label="Pregunta">
              <AdminInput value={item.question} onChange={(e) => updateItem(index, { question: e.target.value })} />
            </AdminField>
            <AdminField label="Respuesta">
              <AdminTextarea rows={3} value={item.answer} onChange={(e) => updateItem(index, { answer: e.target.value })} />
            </AdminField>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="CTA título" className="md:col-span-2">
          <AdminInput value={value.cta_title} onChange={(e) => onChange({ ...value, cta_title: e.target.value })} />
        </AdminField>
        <AdminField label="CTA texto" className="md:col-span-2">
          <AdminTextarea rows={2} value={value.cta_body} onChange={(e) => onChange({ ...value, cta_body: e.target.value })} />
        </AdminField>
        <AdminField label="CTA botón">
          <AdminInput value={value.cta_label} onChange={(e) => onChange({ ...value, cta_label: e.target.value })} />
        </AdminField>
        <AdminField label="Mensaje WhatsApp">
          <AdminInput value={value.cta_message} onChange={(e) => onChange({ ...value, cta_message: e.target.value })} />
        </AdminField>
      </div>
    </div>
  );
}

function ServicesEditor({
  value,
  onChange,
}: {
  value: ServicesIntroContent;
  onChange: (next: ServicesIntroContent) => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <AdminField label="Antetítulo">
        <AdminInput value={value.eyebrow} onChange={(e) => onChange({ ...value, eyebrow: e.target.value })} />
      </AdminField>
      <AdminField label="Palabra destacada">
        <AdminInput value={value.highlight} onChange={(e) => onChange({ ...value, highlight: e.target.value })} />
      </AdminField>
      <AdminField label="Título" className="md:col-span-2">
        <AdminInput value={value.headline} onChange={(e) => onChange({ ...value, headline: e.target.value })} />
      </AdminField>
      <AdminField label="Subtítulo" className="md:col-span-2">
        <AdminTextarea
          rows={3}
          value={value.subheadline}
          onChange={(e) => onChange({ ...value, subheadline: e.target.value })}
        />
      </AdminField>
    </div>
  );
}

function CoverageEditor({
  value,
  onChange,
}: {
  value: CoverageContent;
  onChange: (next: CoverageContent) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Antetítulo">
          <AdminInput value={value.eyebrow} onChange={(e) => onChange({ ...value, eyebrow: e.target.value })} />
        </AdminField>
        <AdminField label="Palabra destacada">
          <AdminInput value={value.highlight} onChange={(e) => onChange({ ...value, highlight: e.target.value })} />
        </AdminField>
        <AdminField label="Título" className="md:col-span-2">
          <AdminInput value={value.headline} onChange={(e) => onChange({ ...value, headline: e.target.value })} />
        </AdminField>
        <AdminField label="Subtítulo" className="md:col-span-2">
          <AdminTextarea rows={3} value={value.subheadline} onChange={(e) => onChange({ ...value, subheadline: e.target.value })} />
        </AdminField>
        <AdminField label="Zonas (una por línea)" className="md:col-span-2">
          <AdminTextarea
            rows={6}
            value={value.zones.join('\n')}
            onChange={(e) =>
              onChange({
                ...value,
                zones: e.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean),
              })
            }
          />
        </AdminField>
        <AdminField label="CTA botón">
          <AdminInput value={value.cta_label} onChange={(e) => onChange({ ...value, cta_label: e.target.value })} />
        </AdminField>
        <AdminField label="Mensaje WhatsApp">
          <AdminInput value={value.cta_message} onChange={(e) => onChange({ ...value, cta_message: e.target.value })} />
        </AdminField>
        <AdminField label="Nota inferior" className="md:col-span-2">
          <AdminTextarea rows={2} value={value.note} onChange={(e) => onChange({ ...value, note: e.target.value })} />
        </AdminField>
      </div>
    </div>
  );
}

function ProcessEditor({
  value,
  onChange,
}: {
  value: ProcessContent;
  onChange: (next: ProcessContent) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Antetítulo">
          <AdminInput value={value.eyebrow} onChange={(e) => onChange({ ...value, eyebrow: e.target.value })} />
        </AdminField>
        <AdminField label="Palabra destacada">
          <AdminInput value={value.highlight} onChange={(e) => onChange({ ...value, highlight: e.target.value })} />
        </AdminField>
        <AdminField label="Título" className="md:col-span-2">
          <AdminInput value={value.headline} onChange={(e) => onChange({ ...value, headline: e.target.value })} />
        </AdminField>
        <AdminField label="Subtítulo" className="md:col-span-2">
          <AdminTextarea rows={2} value={value.subheadline} onChange={(e) => onChange({ ...value, subheadline: e.target.value })} />
        </AdminField>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-semibold text-foreground">Pasos</h4>
          <AdminButton
            type="button"
            variant="secondary"
            className="!py-1.5 !text-xs"
            onClick={() =>
              onChange({
                ...value,
                steps: [
                  ...value.steps,
                  { title: 'Nuevo paso', description: 'Descripción…', icon_key: 'wrench' },
                ],
              })
            }
          >
            Agregar
          </AdminButton>
        </div>
        {value.steps.map((step, index) => (
          <div key={index} className="rounded-xl border border-theme bg-surface-elevated p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Paso {index + 1}</p>
              <AdminButton
                type="button"
                variant="danger"
                className="!py-1 !px-2.5 !text-xs"
                onClick={() => onChange({ ...value, steps: value.steps.filter((_, i) => i !== index) })}
              >
                Quitar
              </AdminButton>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <AdminField label="Título">
                <AdminInput
                  value={step.title}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      steps: value.steps.map((item, i) =>
                        i === index ? { ...item, title: e.target.value } : item,
                      ),
                    })
                  }
                />
              </AdminField>
              <AdminField label="Ícono">
                <IconSelect
                  value={step.icon_key}
                  onChange={(icon_key) =>
                    onChange({
                      ...value,
                      steps: value.steps.map((item, i) =>
                        i === index ? { ...item, icon_key } : item,
                      ),
                    })
                  }
                />
              </AdminField>
              <AdminField label="Descripción" className="md:col-span-2">
                <AdminTextarea
                  rows={2}
                  value={step.description}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      steps: value.steps.map((item, i) =>
                        i === index ? { ...item, description: e.target.value } : item,
                      ),
                    })
                  }
                />
              </AdminField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroEditor({
  value,
  onChange,
}: {
  value: HeroContent;
  onChange: (next: HeroContent) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Antetítulo" className="md:col-span-2">
          <AdminInput value={value.eyebrow} onChange={(e) => onChange({ ...value, eyebrow: e.target.value })} />
        </AdminField>
        <AdminField label="Título línea 1">
          <AdminInput
            value={value.headline_line1}
            onChange={(e) => onChange({ ...value, headline_line1: e.target.value })}
          />
        </AdminField>
        <AdminField label="Prefijo rotativo (ej. para tu)">
          <AdminInput
            value={value.headline_prefix}
            onChange={(e) => onChange({ ...value, headline_prefix: e.target.value })}
          />
        </AdminField>
        <AdminField label="Palabras rotativas (una por línea)" className="md:col-span-2">
          <AdminTextarea
            rows={5}
            value={value.rotating_words.join('\n')}
            onChange={(e) =>
              onChange({
                ...value,
                rotating_words: e.target.value
                  .split('\n')
                  .map((line) => line.trim())
                  .filter(Boolean),
              })
            }
          />
        </AdminField>
        <AdminField label="Subtítulo" className="md:col-span-2">
          <AdminTextarea
            rows={3}
            value={value.subheadline}
            onChange={(e) => onChange({ ...value, subheadline: e.target.value })}
          />
        </AdminField>
        <AdminField label="CTA primario">
          <AdminInput
            value={value.primary_cta_label}
            onChange={(e) => onChange({ ...value, primary_cta_label: e.target.value })}
          />
        </AdminField>
        <AdminField label="Link CTA primario">
          <AdminInput
            value={value.primary_cta_href}
            onChange={(e) => onChange({ ...value, primary_cta_href: e.target.value })}
          />
        </AdminField>
        <AdminField label="CTA secundario">
          <AdminInput
            value={value.secondary_cta_label}
            onChange={(e) => onChange({ ...value, secondary_cta_label: e.target.value })}
          />
        </AdminField>
        <AdminField label="Mensaje WhatsApp secundario">
          <AdminInput
            value={value.secondary_cta_message}
            onChange={(e) => onChange({ ...value, secondary_cta_message: e.target.value })}
          />
        </AdminField>
        <AdminField
          label="Imagen de fondo (URL)"
          className="md:col-span-2"
          hint="Pegá una URL de foto real de obra. Vacío = imagen por defecto."
        >
          <AdminInput
            value={value.background_image_url}
            onChange={(e) => onChange({ ...value, background_image_url: e.target.value })}
            placeholder="https://… o /img/hero-obra.jpg"
          />
        </AdminField>
        {value.background_image_url.trim() ? (
          <div className="md:col-span-2 overflow-hidden rounded-xl border border-theme">
            <img
              src={value.background_image_url}
              alt="Vista previa fondo hero"
              className="h-36 w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-semibold text-foreground">Estadísticas</h4>
          <AdminButton
            type="button"
            variant="secondary"
            className="!py-1.5 !text-xs"
            onClick={() =>
              onChange({
                ...value,
                stats: [...value.stats, { value: '0', label: 'Nueva métrica', icon_key: '' }],
              })
            }
          >
            Agregar
          </AdminButton>
        </div>
        {value.stats.map((stat, index) => (
          <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] items-end rounded-xl border border-theme bg-surface-elevated p-3">
            <AdminField label="Valor">
              <AdminInput
                value={stat.value}
                onChange={(e) =>
                  onChange({
                    ...value,
                    stats: value.stats.map((item, i) =>
                      i === index ? { ...item, value: e.target.value } : item,
                    ),
                  })
                }
              />
            </AdminField>
            <AdminField label="Etiqueta">
              <AdminInput
                value={stat.label}
                onChange={(e) =>
                  onChange({
                    ...value,
                    stats: value.stats.map((item, i) =>
                      i === index ? { ...item, label: e.target.value } : item,
                    ),
                  })
                }
              />
            </AdminField>
            <AdminField label="Ícono">
              <IconSelect
                value={stat.icon_key}
                onChange={(icon_key) =>
                  onChange({
                    ...value,
                    stats: value.stats.map((item, i) =>
                      i === index ? { ...item, icon_key } : item,
                    ),
                  })
                }
              />
            </AdminField>
            <AdminButton
              type="button"
              variant="danger"
              className="!py-2.5"
              onClick={() =>
                onChange({ ...value, stats: value.stats.filter((_, i) => i !== index) })
              }
            >
              Quitar
            </AdminButton>
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutEditor({
  value,
  onChange,
}: {
  value: AboutContent;
  onChange: (next: AboutContent) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <AdminField label="Antetítulo">
          <AdminInput value={value.eyebrow} onChange={(e) => onChange({ ...value, eyebrow: e.target.value })} />
        </AdminField>
        <AdminField label="Título">
          <AdminInput value={value.headline} onChange={(e) => onChange({ ...value, headline: e.target.value })} />
        </AdminField>
        <AdminField label="Párrafo 1" className="md:col-span-2">
          <AdminTextarea rows={3} value={value.body_1} onChange={(e) => onChange({ ...value, body_1: e.target.value })} />
        </AdminField>
        <AdminField label="Párrafo 2" className="md:col-span-2">
          <AdminTextarea rows={3} value={value.body_2} onChange={(e) => onChange({ ...value, body_2: e.target.value })} />
        </AdminField>
        <AdminField label="CTA botón">
          <AdminInput value={value.cta_label} onChange={(e) => onChange({ ...value, cta_label: e.target.value })} />
        </AdminField>
        <AdminField label="Mensaje WhatsApp">
          <AdminInput value={value.cta_message} onChange={(e) => onChange({ ...value, cta_message: e.target.value })} />
        </AdminField>
        <AdminField label="URL foto del equipo" className="md:col-span-2" hint="Pegá una URL pública o path tipo /img/equipo.jpg">
          <AdminInput
            value={value.photo_url}
            onChange={(e) => onChange({ ...value, photo_url: e.target.value })}
            placeholder="/img/Seprogar-Equipo.jpg"
          />
        </AdminField>
        <AdminField label="Leyenda sobre la foto">
          <AdminInput
            value={value.photo_caption}
            onChange={(e) => onChange({ ...value, photo_caption: e.target.value })}
          />
        </AdminField>
        <AdminField label="Placeholder título">
          <AdminInput
            value={value.photo_placeholder_title}
            onChange={(e) => onChange({ ...value, photo_placeholder_title: e.target.value })}
          />
        </AdminField>
        <AdminField label="Placeholder texto" className="md:col-span-2">
          <AdminTextarea
            rows={2}
            value={value.photo_placeholder_body}
            onChange={(e) => onChange({ ...value, photo_placeholder_body: e.target.value })}
          />
        </AdminField>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-semibold text-foreground">Highlights</h4>
          <AdminButton
            type="button"
            variant="secondary"
            className="!py-1.5 !text-xs"
            onClick={() =>
              onChange({
                ...value,
                highlights: [
                  ...value.highlights,
                  { title: 'Nuevo', description: 'Descripción…', icon_key: 'shield' },
                ],
              })
            }
          >
            Agregar
          </AdminButton>
        </div>
        {value.highlights.map((item, index) => (
          <div key={index} className="rounded-xl border border-theme bg-surface-elevated p-4 space-y-3">
            <div className="flex justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">#{index + 1}</p>
              <AdminButton
                type="button"
                variant="danger"
                className="!py-1 !px-2.5 !text-xs"
                onClick={() =>
                  onChange({
                    ...value,
                    highlights: value.highlights.filter((_, i) => i !== index),
                  })
                }
              >
                Quitar
              </AdminButton>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <AdminField label="Título">
                <AdminInput
                  value={item.title}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      highlights: value.highlights.map((h, i) =>
                        i === index ? { ...h, title: e.target.value } : h,
                      ),
                    })
                  }
                />
              </AdminField>
              <AdminField label="Ícono">
                <IconSelect
                  value={item.icon_key}
                  onChange={(icon_key) =>
                    onChange({
                      ...value,
                      highlights: value.highlights.map((h, i) =>
                        i === index ? { ...h, icon_key } : h,
                      ),
                    })
                  }
                />
              </AdminField>
              <AdminField label="Descripción" className="md:col-span-2">
                <AdminTextarea
                  rows={2}
                  value={item.description}
                  onChange={(e) =>
                    onChange({
                      ...value,
                      highlights: value.highlights.map((h, i) =>
                        i === index ? { ...h, description: e.target.value } : h,
                      ),
                    })
                  }
                />
              </AdminField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
