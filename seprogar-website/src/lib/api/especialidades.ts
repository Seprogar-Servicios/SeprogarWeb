import { supabase } from '../supabase';
import type { Especialidad, EspecialidadDetalle, Persona, TrabajoConFotos } from '../../types/database';

export async function fetchEspecialidadesPublicas(): Promise<Especialidad[]> {
  const { data, error } = await supabase
    .from('especialidades')
    .select('id, nombre, slug, descripcion_breve, descripcion_completa, imagen_portada, orden, publicado, created_at, updated_at')
    .eq('publicado', true)
    .order('orden', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchEspecialidadBySlug(slug: string): Promise<EspecialidadDetalle | null> {
  const { data: especialidad, error } = await supabase
    .from('especialidades')
    .select('*')
    .eq('slug', slug)
    .eq('publicado', true)
    .maybeSingle();

  if (error) throw error;
  if (!especialidad) return null;

  const { data: trabajos, error: trabajosError } = await supabase
    .from('trabajos')
    .select('*')
    .eq('especialidad_id', especialidad.id)
    .eq('publicado', true)
    .order('orden', { ascending: true });

  if (trabajosError) throw trabajosError;

  const trabajoIds = (trabajos ?? []).map((t) => t.id);
  let fotosByTrabajo = new Map<string, TrabajoConFotos['fotografias']>();

  if (trabajoIds.length > 0) {
    const { data: fotos, error: fotosError } = await supabase
      .from('fotografias')
      .select('*')
      .in('trabajo_id', trabajoIds)
      .order('orden', { ascending: true });

    if (fotosError) throw fotosError;

    fotosByTrabajo = (fotos ?? []).reduce((map, foto) => {
      const list = map.get(foto.trabajo_id) ?? [];
      list.push(foto);
      map.set(foto.trabajo_id, list);
      return map;
    }, new Map<string, TrabajoConFotos['fotografias']>());
  }

  const trabajosConFotos: TrabajoConFotos[] = (trabajos ?? []).map((t) => ({
    ...t,
    fotografias: fotosByTrabajo.get(t.id) ?? [],
  }));

  const { data: links, error: linksError } = await supabase
    .from('persona_especialidad')
    .select('persona_id')
    .eq('especialidad_id', especialidad.id);

  if (linksError) throw linksError;

  let personas: Persona[] = [];
  const personaIds = (links ?? []).map((l) => l.persona_id);
  if (personaIds.length > 0) {
    const { data: personasData, error: personasError } = await supabase
      .from('personas')
      .select('*')
      .in('id', personaIds)
      .eq('publicado', true)
      .order('orden', { ascending: true })
      .order('nombre', { ascending: true });

    if (personasError) throw personasError;
    personas = personasData ?? [];
  }

  return {
    ...especialidad,
    trabajos: trabajosConFotos,
    personas,
  };
}

export async function fetchAllEspecialidadesAdmin(): Promise<Especialidad[]> {
  const { data, error } = await supabase
    .from('especialidades')
    .select('*')
    .order('orden', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
