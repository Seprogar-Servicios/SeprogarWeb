import { supabase } from '../supabase';
import type { Persona } from '../../types/database';

/** Equipo público para el carrusel de la home (orden jerárquico). */
export async function fetchEquipoPublico(): Promise<Persona[]> {
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .eq('publicado', true)
    .order('orden', { ascending: true })
    .order('nombre', { ascending: true });

  if (error) throw error;
  return data ?? [];
}
