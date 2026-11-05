/**
 * Sube las fotos existentes de public/img al bucket Storage `catalogo`.
 * Requiere Supabase local en marcha y SERVICE_ROLE solo en este script (nunca en el front).
 *
 * Uso: node scripts/seed-media.mjs
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const imgDir = resolve(root, 'public/img');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? 'http://127.0.0.1:54321';
const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const uploads = [
  { file: 'Seprogar-Trabajos-01.jpeg', path: 'trabajos/Seprogar-Trabajos-01.jpeg' },
  { file: 'Seprogar-Trabajos-02.jpeg', path: 'trabajos/Seprogar-Trabajos-02.jpeg' },
  { file: 'Seprogar-Trabajos-03.jpeg', path: 'trabajos/Seprogar-Trabajos-03.jpeg' },
  { file: 'Seprogar-Trabajos-04.jpeg', path: 'trabajos/Seprogar-Trabajos-04.jpeg' },
  { file: 'Seprogar-Trabajos-05.jpeg', path: 'trabajos/Seprogar-Trabajos-05.jpeg' },
  { file: 'Seprogar-Trabajos-06.jpeg', path: 'trabajos/Seprogar-Trabajos-06.jpeg' },
  { file: 'Seprogar-Trabajos-07.jpeg', path: 'trabajos/Seprogar-Trabajos-07.jpeg' },
  { file: 'Seprogar-Trabajos-08.jpeg', path: 'trabajos/Seprogar-Trabajos-08.jpeg' },
  // Portadas (reutilizan fotos representativas)
  { file: 'Seprogar-Trabajos-01.jpeg', path: 'especialidades/plomeria-portada.jpeg' },
  { file: 'Seprogar-Trabajos-04.jpeg', path: 'especialidades/gas-portada.jpeg' },
  { file: 'Seprogar-Trabajos-07.jpeg', path: 'especialidades/electricidad-portada.jpeg' },
  { file: 'Seprogar-Trabajos-02.jpeg', path: 'especialidades/aires-portada.jpeg' },
  { file: 'Seprogar-Trabajos-03.jpeg', path: 'especialidades/pintura-portada.jpeg' },
];

async function uploadOne({ file, path }) {
  const local = resolve(imgDir, file);
  if (!existsSync(local)) {
    console.warn(`Omitido (no existe): ${file}`);
    return;
  }
  const body = readFileSync(local);
  const { error } = await supabase.storage.from('catalogo').upload(path, body, {
    contentType: 'image/jpeg',
    upsert: true,
  });
  if (error) throw new Error(`${path}: ${error.message}`);
  console.log(`OK ${path}`);
}

for (const item of uploads) {
  await uploadOne(item);
}
console.log('Seed de media completado.');
