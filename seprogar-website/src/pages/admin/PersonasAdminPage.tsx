import { type FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { getPublicMediaUrl, supabase } from '../../lib/supabase';
import { deleteCatalogImage, uploadCatalogImage } from '../../lib/storage';
import type { Especialidad, Persona } from '../../types/database';
import { Spinner } from '../../components/ui/Spinner';
import { invalidateEquipoCache } from '../../hooks/useHasEquipo';
import { ImageUploader } from '../../components/admin/ImageUploader';
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminSwitch,
  AdminTable,
  AdminTd,
  AdminTh,
  IconActionButton,
  StatusBadge,
} from '../../components/admin/adminUi';

export function PersonasAdminPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [assigned, setAssigned] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    cargo: '',
    orden: 0,
    publicado: false,
  });

  async function load() {
    setLoading(true);
    const [p, e] = await Promise.all([
      supabase.from('personas').select('*').order('orden', { ascending: true }).order('nombre'),
      supabase.from('especialidades').select('*').order('orden'),
    ]);
    if (p.error) setError(p.error.message);
    else setPersonas(p.data ?? []);
    if (e.error) setError(e.error.message);
    else setEspecialidades(e.data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function startEdit(persona: Persona) {
    setForm({
      id: persona.id,
      nombre: persona.nombre,
      cargo: persona.cargo ?? '',
      orden: persona.orden ?? 0,
      publicado: persona.publicado,
    });
    setCurrentPhoto(persona.fotografia_path);
    setFile(null);
    const { data } = await supabase
      .from('persona_especialidad')
      .select('especialidad_id')
      .eq('persona_id', persona.id);
    setAssigned((data ?? []).map((d) => d.especialidad_id));
  }

  function startCreate() {
    const nextOrden =
      personas.length === 0 ? 1 : Math.max(...personas.map((p) => p.orden ?? 0)) + 1;
    setForm({ id: '', nombre: '', cargo: '', orden: nextOrden, publicado: false });
    setAssigned([]);
    setCurrentPhoto(null);
    setFile(null);
  }

  function toggleEspecialidad(id: string) {
    setAssigned((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let fotografia_path = currentPhoto;
      if (file) {
        const path = await uploadCatalogImage('personas', file);
        if (currentPhoto) {
          try {
            await deleteCatalogImage(currentPhoto);
          } catch {
            /* ignore */
          }
        }
        fotografia_path = path;
      } else if (!currentPhoto) {
        fotografia_path = null;
      }

      const payload = {
        nombre: form.nombre.trim(),
        cargo: form.cargo.trim() || null,
        orden: Number(form.orden) || 0,
        publicado: form.publicado,
        fotografia_path,
      };

      let personaId = form.id;
      if (form.id) {
        const { error: err } = await supabase.from('personas').update(payload).eq('id', form.id);
        if (err) throw err;
      } else {
        const { data, error: err } = await supabase.from('personas').insert(payload).select('id').single();
        if (err) throw err;
        personaId = data.id;
      }

      await supabase.from('persona_especialidad').delete().eq('persona_id', personaId);
      if (assigned.length > 0) {
        const { error: linkErr } = await supabase.from('persona_especialidad').insert(
          assigned.map((especialidad_id) => ({
            persona_id: personaId,
            especialidad_id,
          })),
        );
        if (linkErr) throw linkErr;
      }

      invalidateEquipoCache();
      startCreate();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(persona: Persona) {
    if (!confirm(`¿Eliminar a ${persona.nombre}?`)) return;
    const { error: err } = await supabase.from('personas').delete().eq('id', persona.id);
    if (err) {
      setError(err.message);
      return;
    }
    if (persona.fotografia_path) {
      try {
        await deleteCatalogImage(persona.fotografia_path);
      } catch {
        /* ignore */
      }
    }
    invalidateEquipoCache();
    await load();
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Equipo"
        description={
          <>
            Altas, bajas y ediciones. El <strong className="text-foreground">orden</strong> define la
            jerarquía en el carrusel de la home (1 = primero).
          </>
        }
        action={
          <AdminButton type="button" variant="brand" onClick={startCreate}>
            <Plus className="h-4 w-4" />
            Nueva
          </AdminButton>
        }
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard
        title={form.id ? 'Editar integrante' : 'Nuevo integrante'}
        description="Foto con vista previa y especialidades donde aparece."
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Nombre">
              <AdminInput
                required
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Cargo / puesto">
              <AdminInput
                placeholder="Ej. Responsable técnico, Plomero…"
                value={form.cargo}
                onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))}
              />
            </AdminField>
            <AdminField
              label="Orden jerárquico"
              hint="Menor número = aparece antes en el carrusel de la web."
            >
              <AdminInput
                type="number"
                value={form.orden}
                onChange={(e) => setForm((f) => ({ ...f, orden: Number(e.target.value) }))}
              />
            </AdminField>
            <AdminSwitch
              checked={form.publicado}
              onChange={(publicado) => setForm((f) => ({ ...f, publicado }))}
              label="Publicado"
              description="Visible en la web"
            />
            <div className="md:col-span-2">
              <ImageUploader
                label="Fotografía"
                shape="circle"
                existingPath={currentPhoto}
                file={file}
                onFileChange={setFile}
                onClearExisting={() => setCurrentPhoto(null)}
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-medium text-foreground mb-1">
              Especialidades donde aparece
            </legend>
            <p className="text-xs text-muted mb-3">
              Si no asignás ninguna, igual puede verse en el carrusel general al publicarse.
            </p>
            <div className="flex flex-wrap gap-2">
              {especialidades.map((esp) => {
                const active = assigned.includes(esp.id);
                return (
                  <button
                    key={esp.id}
                    type="button"
                    onClick={() => toggleEspecialidad(esp.id)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                      active
                        ? 'border-[#F37021]/40 bg-[#F37021]/15 text-[#F37021]'
                        : 'border-theme bg-surface-elevated text-muted hover:text-foreground'
                    }`}
                  >
                    {esp.nombre}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </AdminButton>
        </form>
      </AdminCard>

      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Orden</AdminTh>
            <AdminTh>Nombre</AdminTh>
            <AdminTh>Cargo</AdminTh>
            <AdminTh>Estado</AdminTh>
            <AdminTh />
          </tr>
        </thead>
        <tbody>
          {personas.map((persona) => (
            <tr key={persona.id}>
              <AdminTd className="text-muted">{persona.orden}</AdminTd>
              <AdminTd>
                <div className="flex items-center gap-2.5 font-medium">
                  {persona.fotografia_path ? (
                    <img
                      src={getPublicMediaUrl(persona.fotografia_path) ?? ''}
                      alt=""
                      className="h-9 w-9 rounded-full object-cover border border-theme"
                    />
                  ) : (
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-surface-elevated border border-theme text-xs font-bold text-muted">
                      {persona.nombre.charAt(0)}
                    </span>
                  )}
                  {persona.nombre}
                </div>
              </AdminTd>
              <AdminTd className="text-muted">{persona.cargo ?? '—'}</AdminTd>
              <AdminTd>
                <StatusBadge published={persona.publicado} />
              </AdminTd>
              <AdminTd className="text-right whitespace-nowrap">
                <IconActionButton label="Editar" onClick={() => void startEdit(persona)}>
                  <Pencil className="h-4 w-4" />
                </IconActionButton>
                <IconActionButton label="Eliminar" tone="danger" onClick={() => void remove(persona)}>
                  <Trash2 className="h-4 w-4" />
                </IconActionButton>
              </AdminTd>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}
