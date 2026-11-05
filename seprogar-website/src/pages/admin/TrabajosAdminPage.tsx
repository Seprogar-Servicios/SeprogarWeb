import { type FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase, getPublicMediaUrl } from '../../lib/supabase';
import { deleteCatalogImage, uploadCatalogImage } from '../../lib/storage';
import type { Especialidad, Fotografia, Trabajo } from '../../types/database';
import { Spinner } from '../../components/ui/Spinner';
import { ImageUploader } from '../../components/admin/ImageUploader';
import {
  AdminAlert,
  AdminButton,
  AdminCard,
  AdminField,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSwitch,
  AdminTable,
  AdminTd,
  AdminTextarea,
  AdminTh,
  IconActionButton,
  StatusBadge,
} from '../../components/admin/adminUi';

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
  const [newPhotos, setNewPhotos] = useState<File[]>([]);

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
        })),
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
    setNewPhotos([]);
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
    setNewPhotos([]);
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

      if (newPhotos.length > 0 && trabajoId) {
        let orden = fotos.length;
        for (const file of newPhotos) {
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

      setNewPhotos([]);
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
      setNewPhotos([]);
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
      <AdminPageHeader
        title="Trabajos"
        description="Proyectos y fotografías por especialidad."
        action={
          <AdminButton type="button" variant="brand" onClick={startCreate}>
            <Plus className="h-4 w-4" />
            Nuevo
          </AdminButton>
        }
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard
        title={form.id ? 'Editar trabajo' : 'Nuevo trabajo'}
        description="Guardá el trabajo y sumá fotos con vista previa antes de subir."
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Especialidad">
              <AdminSelect
                required
                value={form.especialidad_id}
                onChange={(e) => setForm((f) => ({ ...f, especialidad_id: e.target.value }))}
              >
                <option value="">Seleccionar…</option>
                {especialidades.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre}
                  </option>
                ))}
              </AdminSelect>
            </AdminField>
            <AdminField label="Título">
              <AdminInput
                required
                value={form.titulo}
                onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Descripción" className="md:col-span-2">
              <AdminTextarea
                rows={3}
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Orden">
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
              description="Visible en la ficha del servicio"
            />
            <div className="md:col-span-2">
              <ImageUploader
                multiple
                label="Agregar fotografías"
                files={newPhotos}
                onFilesChange={setNewPhotos}
              />
            </div>
          </div>
          <AdminButton type="submit" variant="primary" disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar trabajo'}
          </AdminButton>
        </form>
      </AdminCard>

      {selectedId && fotos.length > 0 ? (
        <AdminCard title="Fotografías del trabajo" description="Ya guardadas en el catálogo.">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {fotos.map((foto) => (
              <div key={foto.id} className="relative group">
                <img
                  src={getPublicMediaUrl(foto.storage_path) ?? ''}
                  alt={foto.alt_text ?? ''}
                  className="aspect-square w-full object-cover rounded-xl border border-theme"
                />
                <button
                  type="button"
                  onClick={() => void removeFoto(foto)}
                  className="absolute top-2 right-2 rounded-full bg-surface/95 p-1.5 text-red-600 shadow opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition"
                  aria-label="Eliminar foto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </AdminCard>
      ) : null}

      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Título</AdminTh>
            <AdminTh>Especialidad</AdminTh>
            <AdminTh>Estado</AdminTh>
            <AdminTh />
          </tr>
        </thead>
        <tbody>
          {trabajos.map((item) => (
            <tr key={item.id}>
              <AdminTd className="font-medium">{item.titulo}</AdminTd>
              <AdminTd className="text-muted">{item.especialidad_nombre ?? '—'}</AdminTd>
              <AdminTd>
                <StatusBadge published={item.publicado} />
              </AdminTd>
              <AdminTd className="text-right whitespace-nowrap">
                <IconActionButton label="Editar" onClick={() => startEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </IconActionButton>
                <IconActionButton label="Eliminar" tone="danger" onClick={() => void removeTrabajo(item)}>
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
