import { type FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { getPublicMediaUrl, supabase } from '../../lib/supabase';
import { deleteCatalogImage, uploadCatalogImage } from '../../lib/storage';
import type { Especialidad, Persona } from '../../types/database';
import { Spinner } from '../../components/ui/Spinner';
import { invalidateEquipoCache } from '../../hooks/useHasEquipo';

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
          }))
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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Equipo</h2>
          <p className="text-sm text-gray-500">
            Altas, bajas y ediciones. El <strong>orden</strong> define la jerarquía en el carrusel de
            la home (1 = primero). Las especialidades definen en qué páginas de servicio aparecen.
          </p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#F37021] px-4 py-2 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nueva
        </button>
      </div>

      {error ? <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p> : null}

      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
        <h3 className="font-semibold">{form.id ? 'Editar integrante' : 'Nuevo integrante'}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Nombre
            <input
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            Cargo / puesto
            <input
              className="mt-1 w-full rounded-lg border px-3 py-2"
              placeholder="Ej. Responsable técnico, Plomero…"
              value={form.cargo}
              onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))}
            />
          </label>
          <label className="text-sm">
            Orden jerárquico
            <input
              type="number"
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.orden}
              onChange={(e) => setForm((f) => ({ ...f, orden: Number(e.target.value) }))}
            />
            <span className="mt-1 block text-xs text-gray-500">
              Menor número = aparece antes en el carrusel de la web.
            </span>
          </label>
          <label className="text-sm flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={form.publicado}
              onChange={(e) => setForm((f) => ({ ...f, publicado: e.target.checked }))}
            />
            Publicado (visible en la web)
          </label>
          <label className="text-sm md:col-span-2">
            Fotografía
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-1 block w-full text-sm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {currentPhoto ? (
              <img
                src={getPublicMediaUrl(currentPhoto) ?? ''}
                alt=""
                className="mt-2 h-20 w-20 rounded-full object-cover"
              />
            ) : null}
          </label>
        </div>
        <fieldset>
          <legend className="text-sm font-medium mb-2">Especialidades donde aparece</legend>
          <p className="text-xs text-gray-500 mb-2">
            Si no asignás ninguna, igual puede verse en el carrusel general al publicarse.
          </p>
          <div className="flex flex-wrap gap-3">
            {especialidades.map((esp) => (
              <label key={esp.id} className="inline-flex items-center gap-2 text-sm border rounded-lg px-3 py-2">
                <input
                  type="checkbox"
                  checked={assigned.includes(esp.id)}
                  onChange={() => toggleEspecialidad(esp.id)}
                />
                {esp.nombre}
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#000336] text-white px-4 py-2 text-sm disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Cargo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {personas.map((persona) => (
              <tr key={persona.id} className="border-t">
                <td className="px-4 py-3 text-gray-500">{persona.orden}</td>
                <td className="px-4 py-3 font-medium">
                  <div className="flex items-center gap-2">
                    {persona.fotografia_path ? (
                      <img
                        src={getPublicMediaUrl(persona.fotografia_path) ?? ''}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-bold">
                        {persona.nombre.charAt(0)}
                      </span>
                    )}
                    {persona.nombre}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500">{persona.cargo ?? '—'}</td>
                <td className="px-4 py-3">{persona.publicado ? 'Publicado' : 'Borrador'}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => void startEdit(persona)}
                    className="inline-flex p-2 hover:bg-gray-50 rounded-lg"
                    aria-label="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(persona)}
                    className="inline-flex p-2 hover:bg-red-50 text-red-600 rounded-lg"
                    aria-label="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
