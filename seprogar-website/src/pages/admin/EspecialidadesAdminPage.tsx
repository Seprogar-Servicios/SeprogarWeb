import { type FormEvent, useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { deleteCatalogImage, uploadCatalogImage } from '../../lib/storage';
import { slugify } from '../../lib/slug';
import type { Especialidad } from '../../types/database';
import { Spinner } from '../../components/ui/Spinner';
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
  AdminTextarea,
  AdminTh,
  IconActionButton,
  StatusBadge,
} from '../../components/admin/adminUi';

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
      <AdminPageHeader
        title="Especialidades"
        description="Catálogo público dinámico de servicios."
        action={
          <AdminButton type="button" variant="brand" onClick={startCreate}>
            <Plus className="h-4 w-4" />
            Nueva
          </AdminButton>
        }
      />

      {error ? <AdminAlert tone="error">{error}</AdminAlert> : null}

      <AdminCard
        title={form.id ? 'Editar especialidad' : 'Nueva especialidad'}
        description="Completá los datos y publicá cuando esté lista para la web."
      >
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <AdminField label="Nombre">
              <AdminInput
                required
                value={form.nombre}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    nombre: e.target.value,
                    slug: f.id ? f.slug : slugify(e.target.value),
                  }))
                }
              />
            </AdminField>
            <AdminField label="Slug (URL)">
              <AdminInput
                required
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
              />
            </AdminField>
            <AdminField label="Descripción breve" className="md:col-span-2">
              <AdminInput
                value={form.descripcion_breve}
                onChange={(e) => setForm((f) => ({ ...f, descripcion_breve: e.target.value }))}
              />
            </AdminField>
            <AdminField label="Descripción completa" className="md:col-span-2">
              <AdminTextarea
                rows={4}
                value={form.descripcion_completa}
                onChange={(e) => setForm((f) => ({ ...f, descripcion_completa: e.target.value }))}
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
              label="Publicada"
              description="Visible en la web pública"
            />
            <div className="md:col-span-2">
              <ImageUploader
                label="Imagen de portada"
                existingPath={editingCover}
                file={file}
                onFileChange={setFile}
                onClearExisting={() => setEditingCover(null)}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <AdminButton type="submit" variant="primary" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </AdminButton>
            <AdminButton
              type="button"
              variant="secondary"
              onClick={() => {
                setForm(emptyForm);
                setFile(null);
                setEditingCover(null);
              }}
            >
              Cancelar
            </AdminButton>
          </div>
        </form>
      </AdminCard>

      <AdminTable>
        <thead>
          <tr>
            <AdminTh>Orden</AdminTh>
            <AdminTh>Nombre</AdminTh>
            <AdminTh>Slug</AdminTh>
            <AdminTh>Estado</AdminTh>
            <AdminTh />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <AdminTd className="text-muted">{item.orden}</AdminTd>
              <AdminTd className="font-medium">{item.nombre}</AdminTd>
              <AdminTd className="text-muted">{item.slug}</AdminTd>
              <AdminTd>
                <StatusBadge published={item.publicado} />
              </AdminTd>
              <AdminTd className="text-right whitespace-nowrap">
                <IconActionButton label="Editar" onClick={() => startEdit(item)}>
                  <Pencil className="h-4 w-4" />
                </IconActionButton>
                <IconActionButton label="Eliminar" tone="danger" onClick={() => void remove(item)}>
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
