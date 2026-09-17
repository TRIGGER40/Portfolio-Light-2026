/**
 * Shared Supabase (service-role) helper for serverless functions under /api.
 * Files prefixed with "_" are not turned into routes by Vercel.
 *
 * The service role key bypasses Row Level Security, so it must only ever be
 * used server-side (never in VITE_-prefixed env vars shipped to the browser).
 */

export function getSupabaseConfig(): { url: string; serviceKey: string } {
  const url = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  return { url, serviceKey };
}

export function supabaseHeaders(serviceKey: string): Record<string, string> {
  return {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
  };
}
