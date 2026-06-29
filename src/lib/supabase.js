import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabaseConfigured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

// Solo crea el cliente si las credenciales están presentes
// Evita que createClient(undefined, undefined) rompa toda la app
export const supabase = supabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (!supabaseConfigured) {
  console.warn(
    '[Supabase] Variables de entorno no configuradas.\n' +
    'Agrega en frontend/.env:\n' +
    '  VITE_SUPABASE_URL=https://xxxx.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=eyJ...'
  );
}
