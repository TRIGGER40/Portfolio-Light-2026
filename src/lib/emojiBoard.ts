const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const headers = () => ({
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY ?? '',
  'Authorization': `Bearer ${SUPABASE_KEY ?? ''}`,
});

export interface EmojiPost {
  id: string;
  name: string;
  emoji: string;
  emoji_code: string;
  color: string;
  created_at: string;
  country?: string;
  country_code?: string;
  city?: string;
}

export async function fetchPosts(): Promise<EmojiPost[]> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/emoji_posts?select=id,name,emoji,emoji_code,color,created_at,country,country_code,city&order=created_at.asc&limit=500`,
      { headers: headers() }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function hasDevicePosted(deviceId: string): Promise<boolean> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return false;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/emoji_posts?device_id=eq.${encodeURIComponent(deviceId)}&select=id&limit=1`,
      { headers: headers() }
    );
    if (!res.ok) return false;
    const data = await res.json() as unknown[];
    return Array.isArray(data) && data.length > 0;
  } catch {
    return false;
  }
}

export async function createPost(post: {
  name: string;
  emoji: string;
  emoji_code: string;
  color: string;
  device_id: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return { ok: false, error: 'not_configured' };
  try {
    // Best-effort geo capture
    let geo: { country?: string; country_code?: string; city?: string } = {};
    try {
      const geoRes = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
      if (geoRes.ok) {
        const d = await geoRes.json() as { country_name?: string; country_code?: string; city?: string };
        geo = { country: d.country_name, country_code: d.country_code, city: d.city };
      }
    } catch { /* ignore */ }

    const res = await fetch(`${SUPABASE_URL}/rest/v1/emoji_posts`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ ...post, ...geo }),
    });
    if (!res.ok) {
      const err = await res.text();
      if (err.includes('unique') || res.status === 409 || res.status === 422) {
        return { ok: false, error: 'already_posted' };
      }
      return { ok: false, error: 'server_error' };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'network_error' };
  }
}

export function getOrCreateDeviceId(): string {
  const KEY = 'mkboard_device_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

export function markPosted(deviceId: string): void {
  localStorage.setItem('mkboard_posted', deviceId);
}

export function hasLocalPosted(deviceId: string): boolean {
  return localStorage.getItem('mkboard_posted') === deviceId;
}

export async function deletePost(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return { ok: false, error: 'not_configured' };
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/emoji_posts?id=eq.${encodeURIComponent(id)}`,
      { method: 'DELETE', headers: { ...headers(), 'Prefer': 'return=minimal' } }
    );
    if (!res.ok) return { ok: false, error: 'server_error' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'network_error' };
  }
}
