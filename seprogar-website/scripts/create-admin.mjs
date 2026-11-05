/**
 * Crea un usuario Auth y lo marca como admin.
 * Solo para entorno local / operaciones controladas.
 * Usa SERVICE_ROLE (nunca en el navegador).
 *
 * Uso:
 *   node scripts/create-admin.mjs email@ejemplo.com "TuPasswordSegura"
 */
import { createClient } from '@supabase/supabase-js';

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Uso: node scripts/create-admin.mjs <email> <password>');
  process.exit(1);
}
if (password.length < 8) {
  console.error('La contraseña debe tener al menos 8 caracteres.');
  process.exit(1);
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? 'http://127.0.0.1:54321';
const SERVICE_ROLE =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error('Error creando usuario:', error.message);
  process.exit(1);
}

const { error: profileError } = await supabase
  .from('profiles')
  .update({ is_admin: true, email })
  .eq('id', data.user.id);

if (profileError) {
  console.error('Usuario creado pero no se pudo marcar admin:', profileError.message);
  process.exit(1);
}

console.log(`Admin listo: ${email} (id ${data.user.id})`);
