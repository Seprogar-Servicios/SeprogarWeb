import { type FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase, getPublicMediaUrl } from '../../lib/supabase';
import { deleteCatalogImage, uploadCatalogImage } from '../../lib/storage';
import type { Especialidad, Fotografia, Trabajo } from '../../types/database';
import { Spinner } from '../../components/ui/Spinner';

type TrabajoRow = Trabajo & { especialidad_nombre?: string };

export function TrabajosAdminPage() {
  const [trabajos, setTrabajos] = useState<TrabajoRow[]>([]);
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [fotos, setFotos] = useState<Fotografia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string>('');
  const [form, setForm] = useState({
    id: '',
    especialidad_id: '',
    titulo: '',
    descripcion: '',
    orden: 0,
    publicado: false,
  });
  const [newPhotos, setNewPhotos] = useState<FileList | null>(null);

  async function load() {
    setLoading(true);
    const [t, e] = await Promise.all([
      supabase.from('trabajos').select('*').order('orden', { ascending: true }),
      supabase.from('especialidades').select('*').order('orden'),
    ]);
    if (e.error) setError(e.error.message);
    else setEspecialidades(e.data ?? []);

    if (t.error) setError(t.error.message);
    else {
      const espMap = new Map((e.data ?? []).map((esp) => [esp.id, esp.nombre]));
      setTrabajos(
        (t.data ?? []).map((row) => ({
          ...row,
          especialidad_nombre: espMap.get(row.especialidad_id),
        }))
      );
    }
    setLoading(false);
  }

  async function loadFotos(trabajoId: string) {
    const { data, error: err } = await supabase
      .from('fotografias')
      .select('*')
      .eq('trabajo_id', trabajoId)
      .order('orden');
    if (err) setError(err.message);
    else setFotos(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (selectedId) void loadFotos(selectedId);
    else setFotos([]);
  }, [selectedId]);

  function startCreate() {
    setForm({
      id: '',
      especialidad_id: especialidades[0]?.id ?? '',
      titulo: '',
      descripcion: '',
      orden: trabajos.length + 1,
      publicado: false,
    });
    setSelectedId('');
    setNewPhotos(null);
  }

  function startEdit(item: TrabajoRow) {
    setForm({
      id: item.id,
      especialidad_id: item.especialidad_id,
      titulo: item.titulo,
      descripcion: item.descripcion ?? '',
      orden: item.orden,
      publicado: item.publicado,
    });
    setSelectedId(item.id);
    setNewPhotos(null);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        especialidad_id: form.especialidad_id,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim() || null,
        orden: Number(form.orden) || 0,
        publicado: form.publicado,
      };

      let trabajoId = form.id;
      if (form.id) {
        const { error: err } = await supabase.from('trabajos').update(payload).eq('id', form.id);
        if (err) throw err;
      } else {
        const { data, error: err } = await supabase.from('trabajos').insert(payload).select('id').single();
        if (err) throw err;
        trabajoId = data.id;
      }

      if (newPhotos && newPhotos.length > 0 && trabajoId) {
        let orden = fotos.length;
        for (const file of Array.from(newPhotos)) {
          orden += 1;
          const path = await uploadCatalogImage('trabajos', file);
          const { error: ferr } = await supabase.from('fotografias').insert({
            trabajo_id: trabajoId,
            storage_path: path,
            alt_text: form.titulo,
            orden,
          });
          if (ferr) throw ferr;
        }
      }

      setNewPhotos(null);
      await load();
      if (trabajoId) {
        setSelectedId(trabajoId);
        setForm((f) => ({ ...f, id: trabajoId }));
        await loadFotos(trabajoId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar el trabajo.');
    } finally {
      setSaving(false);
    }
  }

  async function removeTrabajo(item: TrabajoRow) {
    if (!confirm(`¿Eliminar "${item.titulo}"?`)) return;
    const { data: photos } = await supabase.from('fotografias').select('storage_path').eq('trabajo_id', item.id);
    const { error: err } = await supabase.from('trabajos').delete().eq('id', item.id);
    if (err) {
      setError(err.message);
      return;
    }
    for (const p of photos ?? []) {
      try {
        await deleteCatalogImage(p.storage_path);
      } catch {
        /* ignore */
      }
    }
    if (selectedId === item.id) {
      setSelectedId('');
      setForm({ id: '', especialidad_id: '', titulo: '', descripcion: '', orden: 0, publicado: false });
    }
    await load();
  }

  async function removeFoto(foto: Fotografia) {
    if (!confirm('¿Eliminar esta fotografía?')) return;
    const { error: err } = await supabase.from('fotografias').delete().eq('id', foto.id);
    if (err) {
      setError(err.message);
      return;
    }
    try {
      await deleteCatalogImage(foto.storage_path);
    } catch {
      /* ignore */
    }
    await loadFotos(foto.trabajo_id);
  }

  if (loading) return <Spinner />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Trabajos</h2>
          <p className="text-sm text-gray-500">Proyectos y fotografías por especialidad</p>
        </div>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#F37021] px-4 py-2 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Nuevo
        </button>
      </div>

      {error ? <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p> : null}

      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
        <h3 className="font-semibold">{form.id ? 'Editar trabajo' : 'Nuevo trabajo'}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            Especialidad
            <select
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.especialidad_id}
              onChange={(e) => setForm((f) => ({ ...f, especialidad_id: e.target.value }))}
            >
              <option value="">Seleccionar…</option>
              {especialidades.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Título
            <input
              required
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Descripción
            <textarea
              rows={3}
              className="mt-1 w-full rounded-lg border px-3 py-2"
              value={form.descripcion}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
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
            Publicado
          </label>
          <label className="text-sm md:col-span-2">
            Agregar fotografías
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="mt-1 block w-full text-sm"
              onChange={(e) => setNewPhotos(e.target.files)}
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-[#000336] text-white px-4 py-2 text-sm disabled:opacity-60"
        >
          {saving ? 'Guardando…' : 'Guardar trabajo'}
        </button>
      </form>

      {selectedId && fotos.length > 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <h3 className="font-semibold mb-3">Fotografías del trabajo</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fotos.map((foto) => (
              <div key={foto.id} className="relative group">
                <img
                  src={getPublicMediaUrl(foto.storage_path) ?? ''}
                  alt={foto.alt_text ?? ''}
                  className="aspect-square w-full object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => void removeFoto(foto)}
                  className="absolute top-2 right-2 rounded-full bg-white/90 p-1.5 text-red-600 opacity-0 group-hover:opacity-100"
                  aria-label="Eliminar foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Especialidad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {trabajos.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3 font-medium">{item.titulo}</td>
                <td className="px-4 py-3 text-gray-500">{item.especialidad_nombre ?? '—'}</td>
                <td className="px-4 py-3">
                  {item.publicado ? 'Publicado' : 'Borrador'}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button type="button" onClick={() => startEdit(item)} className="inline-flex p-2 hover:bg-gray-50 rounded-lg">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={() => void removeTrabajo(item)} className="inline-flex p-2 hover:bg-red-50 text-red-600 rounded-lg">
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
