import { type FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase, getPublicMediaUrl } from '../../lib/supabase';
import { deleteCatalogImage, uploadCatalogImage } from '../../lib/storage';
import { slugify } from '../../lib/slug';
import type { Especialidad } from '../../types/database';
import { Spinner } from '../../components/ui/Spinner';

const emptyForm = {
  id: '',
  nombre: '',
  slug: '',
  descripcion_breve: '',
  descripcion_completa: '',
  orden: 0,
  publicado: false,
};

export function EspecialidadesAdminPage() {
  const [items, setItems] = useState<Especialidad[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | null>(null);
  const [editingCover, setEditingCover] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('especialidades')
      .select('*')
      .order('orden', { ascending: true });
    if (err) setError(err.message);
    else setItems(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  function startCreate() {
    setForm({ ...emptyForm, orden: items.length + 1 });
    setFile(null);
    setEditingCover(null);
    setError(null);
  }

  function startEdit(item: Especialidad) {
    setForm({
      id: item.id,
      nombre: item.nombre,
      slug: item.slug,
      descripcion_breve: item.descripcion_breve ?? '',
      descripcion_completa: item.descripcion_completa ?? '',
      orden: item.orden,
      publicado: item.publicado,
    });
    setEditingCover(item.imagen_portada);
    setFile(null);
    setError(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const slug = form.slug || slugify(form.nombre);
      let imagen_portada = editingCover;

      if (file) {
        const path = await uploadCatalogImage('especialidades', file);
        if (editingCover && editingCover !== path) {
          try {
            await deleteCatalogImage(editingCover);
          } catch {
            /* ignore cleanup errors */
          }
        }
        imagen_portada = path;
      }

      const payload = {
        nombre: form.nombre.trim(),
        slug,
        descripcion_breve: form.descripcion_breve.trim() || null,
        descripcion_completa: form.descripcion_completa.trim() || null,
        orden: Number(form.orden) || 0,
        publicado: form.publicado,
        imagen_portada,
      };

      if (form.id) {
        const { error: err } = await supabase.from('especialidades').update(payload).eq('id', form.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('especialidades').insert(payload);
        if (err) throw err;
      }

      setForm(emptyForm);
      setFile(null);
      setEditingCover(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Especialidad) {
    if (!confirm(`¿Eliminar "${item.nombre}"? Se borrarán trabajos y fotos asociados.`)) return;
    const { error: err } = await supabase.from('especialidades').delete().eq('id', item.id);
    if (err) {
      setError(err.message);
      return;
    }
    if (item.imagen_portada) {
      try {
        await deleteCatalogImage(item.imagen_portada);
      } catch {
        /* ignore */
      }
    }
    await load();
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Especialidades</h2>
          <p className="text-sm text-gray-500">Catálogo público dinámico</p>
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
          <h3 className="font-semibold">{form.id ? 'Editar especialidad' : 'Nueva especialidad'}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm">
              Nombre
              <input
                required
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={form.nombre}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    nombre: e.target.value,
                    slug: f.id ? f.slug : slugify(e.target.value),
                  }))
                }
              />
            </label>
            <label className="text-sm">
              Slug (URL)
              <input
                required
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
              />
            </label>
            <label className="text-sm md:col-span-2">
              Descripción breve
              <input
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={form.descripcion_breve}
                onChange={(e) => setForm((f) => ({ ...f, descripcion_breve: e.target.value }))}
              />
            </label>
            <label className="text-sm md:col-span-2">
              Descripción completa
              <textarea
                rows={4}
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={form.descripcion_completa}
                onChange={(e) => setForm((f) => ({ ...f, descripcion_completa: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Orden
              <input
                type="number"
                className="mt-1 w-full rounded-lg border px-3 py-2"
                value={form.orden}
                onChange={(e) => setForm((f) => ({ ...f, orden: Number(e.target.value) }))}
              />
            </label>
            <label className="text-sm flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={form.publicado}
                onChange={(e) => setForm((f) => ({ ...f, publicado: e.target.checked }))}
              />
              Publicada
            </label>
            <label className="text-sm md:col-span-2">
              Imagen de portada
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="mt-1 block w-full text-sm"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {editingCover ? (
                <img
                  src={getPublicMediaUrl(editingCover) ?? ''}
                  alt="Portada actual"
                  className="mt-2 h-24 w-36 object-cover rounded-lg"
                />
              ) : null}
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#000336] text-white px-4 py-2 text-sm disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={() => {
                setForm(emptyForm);
                setFile(null);
                setEditingCover(null);
              }}
              className="rounded-xl border px-4 py-2 text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3">Orden</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.orden}</td>
                <td className="px-4 py-3 font-medium">{item.nombre}</td>
                <td className="px-4 py-3 text-gray-500">{item.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      item.publicado ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {item.publicado ? 'Publicada' : 'Borrador'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button type="button" onClick={() => startEdit(item)} className="inline-flex p-2 hover:bg-gray-50 rounded-lg" aria-label="Editar">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => void remove(item)} className="inline-flex p-2 hover:bg-red-50 text-red-600 rounded-lg" aria-label="Eliminar">
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
