import { type FormEvent, useEffect, useState } from 'react';
import {
  fetchSiteSettingsAdmin,
  normalizeSettings,
  publishSiteSettings,
  saveSiteSettingsDraft,
} from '../../lib/api/content';
import type { HoursItem, SiteSettingsPayload } from '../../types/content';
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminTextarea,
} from '../../components/admin/adminUi';
import { Spinner } from '../../components/ui/Spinner';

export function AjustesAdminPage() {
  const [id, setId] = useState<string | null>(null);
  const [form, setForm] = useState<SiteSettingsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const settings = await fetchSiteSettingsAdmin();
        if (!settings) {
          setError('No hay fila de ajustes. Corré la migración CMS.');
          return;
        }
        setId(settings.id);
        setForm(
          normalizeSettings(
            settings.draft_payload ||
              settings.published_payload || {
                site_name: settings.site_name,
                contact_email: settings.contact_email ?? '',
                phone_display: settings.phone_display ?? '',
                phone_tel: settings.phone_tel ?? '',
                whatsapp: settings.whatsapp ?? '',
                address: settings.address ?? '',
                map_url: settings.map_url ?? '',
                social_links: settings.social_links,
                hours: settings.hours,
              },
          ),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'No se pudo cargar.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSaveDraft(e: FormEvent) {
    e.preventDefault();
    if (!id || !form) return;
    setSaving(true);
    setError(null);
    try {
      await saveSiteSettingsDraft(id, form);
      setMessage('Borrador de contacto guardado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  async function onPublish() {
    if (!id || !form) return;
    setSaving(true);
    setError(null);
    try {
      await publishSiteSettings(id, form);
      setMessage('Contacto publicado en la web');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo publicar.');
    } finally {
      setSaving(false);
    }
  }

  function updateHour(index: number, patch: Partial<HoursItem>) {
    if (!form) return;
    setForm({
      ...form,
      hours: form.hours.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  }

  if (loading) return <Spinner label="Cargando ajustes…" />;
  if (!form) return <AdminAlert tone="error">{error || 'Sin datos de ajustes.'}</AdminAlert>;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Ajustes de contacto"
        description="Teléfono, WhatsApp, dirección, horarios y redes. Afecta Contacto, FAQ CTA, header y footer."
        action={
          <div className="flex flex-wrap gap-2">
            <AdminButton
              type="button"
              variant="secondary"
              disabled={saving}
              onClick={() => {
                if (!id || !form) return;
                void (async () => {
                  setSaving(true);
                  setError(null);
                  try {
                    await saveSiteSettingsDraft(id, form);
                    setMessage('Borrador de contacto guardado');
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'No se pudo guardar.');
                  } finally {
                    setSaving(false);
                  }
                })();
              }}
            >
              Guardar borrador
            </AdminButton>
            <AdminButton type="button" variant="brand" disabled={saving} onClick={() => void onPublish()}>
              Publicar
            </AdminButton>
          </div>
        }
      />

      {message ? <AdminAlert tone="success">{message}</AdminAlert> : null}
      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard title="Datos de contacto">
        <form onSubmit={onSaveDraft} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Nombre del sitio">
              <AdminInput
                value={form.site_name}
                onChange={(e) => setForm({ ...form, site_name: e.target.value })}
              />
            </AdminField>
            <AdminField label="Email">
              <AdminInput
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              />
            </AdminField>
            <AdminField label="Teléfono (visible)">
              <AdminInput
                value={form.phone_display}
                onChange={(e) => setForm({ ...form, phone_display: e.target.value })}
              />
            </AdminField>
            <AdminField label="Teléfono (tel:)">
              <AdminInput
                value={form.phone_tel}
                onChange={(e) => setForm({ ...form, phone_tel: e.target.value })}
                placeholder="+54911..."
              />
            </AdminField>
            <AdminField label="WhatsApp (solo números)" hint="Ej. 5491128484962">
              <AdminInput
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              />
            </AdminField>
            <AdminField label="URL del mapa (opcional)">
              <AdminInput
                value={form.map_url}
                onChange={(e) => setForm({ ...form, map_url: e.target.value })}
                placeholder="https://maps.google.com/..."
              />
            </AdminField>
            <AdminField label="Dirección" className="md:col-span-2">
              <AdminInput
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </AdminField>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <AdminField label="Facebook">
              <AdminInput
                value={form.social_links.facebook || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social_links: { ...form.social_links, facebook: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="Instagram">
              <AdminInput
                value={form.social_links.instagram || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social_links: { ...form.social_links, instagram: e.target.value },
                  })
                }
              />
            </AdminField>
            <AdminField label="LinkedIn">
              <AdminInput
                value={form.social_links.linkedin || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social_links: { ...form.social_links, linkedin: e.target.value },
                  })
                }
              />
            </AdminField>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-semibold text-foreground">Horarios</h4>
              <AdminButton
                type="button"
                variant="secondary"
                className="!py-1.5 !text-xs"
                onClick={() =>
                  setForm({
                    ...form,
                    hours: [...form.hours, { label: 'Nuevo bloque', value: '8:00 - 18:00' }],
                  })
                }
              >
                Agregar
              </AdminButton>
            </div>
            {form.hours.map((item, index) => (
              <div key={index} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] items-end">
                <AdminField label="Etiqueta">
                  <AdminInput value={item.label} onChange={(e) => updateHour(index, { label: e.target.value })} />
                </AdminField>
                <AdminField label="Valor">
                  <AdminInput value={item.value} onChange={(e) => updateHour(index, { value: e.target.value })} />
                </AdminField>
                <AdminButton
                  type="button"
                  variant="danger"
                  className="!py-2.5"
                  onClick={() =>
                    setForm({ ...form, hours: form.hours.filter((_, i) => i !== index) })
                  }
                >
                  Quitar
                </AdminButton>
              </div>
            ))}
          </div>

          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar borrador'}
          </AdminButton>
        </form>
      </AdminCard>

      <AdminCard title="Vista rápida">
        <AdminTextarea
          readOnly
          rows={6}
          value={`WhatsApp: ${form.whatsapp}\nTel: ${form.phone_display}\nEmail: ${form.contact_email}\nDir: ${form.address}`}
        />
      </AdminCard>
    </div>
  );
}
