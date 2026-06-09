import { createClient } from '@supabase/supabase-js';

let supabaseInstance = null;
let initPromise = null;

async function fetchPublicConfig() {
  const res = await fetch('/api/config', { cache: 'no-store' });
  if (!res.ok) throw new Error('Yapılandırma alınamadı');
  return res.json();
}

/** Runtime'da Supabase istemcisi — anahtarlar build'e gömülmez */
export async function getSupabase() {
  if (supabaseInstance) return supabaseInstance;

  if (!initPromise) {
    initPromise = (async () => {
      const { supabaseUrl, supabaseAnonKey } = await fetchPublicConfig();
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase yapılandırması eksik. Lütfen /setup sayfasını tamamlayın.');
      }
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      return supabaseInstance;
    })();
  }

  return initPromise;
}

/** Yapılandırma değişince önbelleği temizle */
export function resetSupabaseClient() {
  supabaseInstance = null;
  initPromise = null;
}
