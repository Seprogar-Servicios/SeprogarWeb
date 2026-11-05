import { MEDIA_BUCKET, supabase, validateImageFile } from './supabase';

function uniqueName(file: File): string {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safe}`;
}

export async function uploadCatalogImage(
  folder: 'especialidades' | 'trabajos' | 'personas',
  file: File
): Promise<string> {
  const validationError = validateImageFile(file);
  if (validationError) throw new Error(validationError);

  const path = `${folder}/${uniqueName(file)}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  });

  if (error) throw error;
  return path;
}

export async function deleteCatalogImage(path: string | null | undefined): Promise<void> {
  if (!path) return;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) throw error;
}
