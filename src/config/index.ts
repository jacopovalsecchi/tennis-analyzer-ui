import {
  BACKEND_URL as ENV_BACKEND_URL,
  SUPABASE_PUBLISHABLE_KEY as ENV_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL as ENV_SUPABASE_URL,
} from '@env';

function text(value: string | undefined): string {
  return typeof value === 'string' ? value.trim() : '';
}

/** Public Supabase and backend settings. Secret keys do not belong in this app. */
export const SUPABASE_URL = text(ENV_SUPABASE_URL);
export const SUPABASE_PUBLISHABLE_KEY = text(ENV_SUPABASE_PUBLISHABLE_KEY);
export const BACKEND_URL = text(ENV_BACKEND_URL) || 'http://localhost:3001';

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_PUBLISHABLE_KEY.length > 0;

/** Custom scheme registered on iOS and Android. Add this exact URL to the Supabase redirect allow list. */
export const AUTH_REDIRECT_URL = 'tennisanalyzer://auth/callback';
