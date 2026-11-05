import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;
const listeners = new Set<(value: boolean) => void>();

async function fetchHasEquipo(): Promise<boolean> {
  const { count, error } = await supabase
    .from('personas')
    .select('id', { count: 'exact', head: true })
    .eq('publicado', true);
  if (error) return false;
  return (count ?? 0) > 0;
}

async function loadHasEquipo(force = false): Promise<boolean> {
  if (!force && cached !== null) return cached;
  if (!inflight) {
    inflight = (async () => {
      const value = await fetchHasEquipo();
      cached = value;
      listeners.forEach((listener) => listener(value));
      return value;
    })().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

/** Indica si hay personas publicadas (para mostrar #equipo en menú). */
export function useHasEquipo() {
  const [hasEquipo, setHasEquipo] = useState(cached === true);
  const [ready, setReady] = useState(cached !== null);

  useEffect(() => {
    let cancelled = false;

    const apply = (value: boolean) => {
      if (!cancelled) {
        setHasEquipo(value);
        setReady(true);
      }
    };

    listeners.add(apply);
    void loadHasEquipo().then(apply);

    return () => {
      cancelled = true;
      listeners.delete(apply);
    };
  }, []);

  return { hasEquipo, ready };
}

/** Invalidar caché tras cambios en admin y refrescar listeners montados. */
export function invalidateEquipoCache() {
  cached = null;
  void loadHasEquipo(true);
}
