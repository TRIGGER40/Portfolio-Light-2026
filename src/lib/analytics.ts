/**
 * Analytics module — sends events to Supabase (cross-device, real visitors)
 * with localStorage as local cache / offline fallback.
 */

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const SUPABASE_ENABLED = !!(SUPABASE_URL && SUPABASE_KEY);

const LOCAL_KEY   = 'mkp_events';
const VISITOR_KEY = 'mkp_vid';
const SESSION_KEY = 'mkp_sid';

export type EventType =
  | 'hero_view'
  | 'hero_cta'
  | 'scroll_depth'
  | 'section_view'
  | 'project_click'
  | 'project_hover'
  | 'resume_click'
  | 'linkedin_click'
  | 'cta_click'
  | 'session_start';

export interface AEvent {
  id:   string;
  type: EventType;
  ts:   number;
  sid:  string;
  vid:  string;
  data: Record<string, unknown>;
}

/* ── IDs ─────────────────────────────────────────── */
function uid(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

export function getVisitorId(): string {
  let v = localStorage.getItem(VISITOR_KEY);
  if (!v) { v = uid(); localStorage.setItem(VISITOR_KEY, v); }
  return v;
}

export function getSessionId(): string {
  let s = sessionStorage.getItem(SESSION_KEY);
  if (!s) { s = uid(); sessionStorage.setItem(SESSION_KEY, s); }
  return s;
}

/* ── Supabase batch sender ───────────────────────── */
let queue: AEvent[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;

async function flushToSupabase() {
  flushTimer = null;
  if (!SUPABASE_ENABLED || queue.length === 0) return;
  const batch = queue.splice(0);
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/analytics_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY!,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(batch.map(e => ({
        type:       e.type,
        session_id: e.sid,
        visitor_id: e.vid,
        data:       e.data,
      }))),
    });
  } catch { /* silently ignore network errors */ }
}

function scheduleFlush() {
  if (!flushTimer) flushTimer = setTimeout(flushToSupabase, 2000);
}

/* ── Core track ──────────────────────────────────── */
export function track(type: EventType, data: Record<string, unknown> = {}): void {
  try {
    const event: AEvent = {
      id:   uid(),
      type,
      ts:   Date.now(),
      sid:  getSessionId(),
      vid:  getVisitorId(),
      data,
    };
    // Local cache
    const all = getLocalEvents();
    all.push(event);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(all.slice(-2000)));
    // Remote
    if (SUPABASE_ENABLED) { queue.push(event); scheduleFlush(); }
  } catch { /* quota errors */ }
}

/* ── Read local cache ────────────────────────────── */
export function getLocalEvents(): AEvent[] {
  try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); }
  catch { return []; }
}

/* ── Read from Supabase ──────────────────────────── */
export async function fetchRemoteEvents(): Promise<AEvent[]> {
  if (!SUPABASE_ENABLED) return getLocalEvents();
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/analytics_events?select=*&order=created_at.asc&limit=20000`,
      { headers: { 'apikey': SUPABASE_KEY!, 'Authorization': `Bearer ${SUPABASE_KEY}` } }
    );
    if (!res.ok) return getLocalEvents();
    const rows: { id: string; type: EventType; session_id: string; visitor_id: string; data: Record<string, unknown>; created_at: string }[] = await res.json();
    return rows.map(r => ({
      id:   r.id,
      type: r.type,
      ts:   new Date(r.created_at).getTime(),
      sid:  r.session_id,
      vid:  r.visitor_id,
      data: r.data || {},
    }));
  } catch { return getLocalEvents(); }
}

export function clearLocalAnalytics(): void {
  localStorage.removeItem(LOCAL_KEY);
}

export function isRemoteEnabled(): boolean { return SUPABASE_ENABLED; }

/* ── Section timer ───────────────────────────────── */
export function makeSectionTimer(section: string) {
  let start = 0;
  return {
    enter() { start = Date.now(); },
    leave() {
      if (!start) return;
      const duration = Date.now() - start;
      start = 0;
      if (duration > 500) track('section_view', { section, duration });
    },
  };
}

/* ── Geolocation (IP-based, no permission needed) ── */
const GEO_SESSION_KEY = 'mkp_geo_done';

export async function initGeoTracking() {
  // Only once per session
  if (sessionStorage.getItem(GEO_SESSION_KEY)) return;
  sessionStorage.setItem(GEO_SESSION_KEY, '1');
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return;
    const geo = await res.json() as {
      ip?: string; city?: string; region?: string;
      country_name?: string; country_code?: string;
      latitude?: number; longitude?: number; timezone?: string;
    };
    track('session_start', {
      ip:           geo.ip,
      city:         geo.city,
      region:       geo.region,
      country:      geo.country_name,
      country_code: geo.country_code,
      latitude:     geo.latitude,
      longitude:    geo.longitude,
      timezone:     geo.timezone,
      user_agent:   navigator.userAgent,
      language:     navigator.language,
      referrer:     document.referrer || 'direct',
    });
  } catch { /* silently ignore — network / timeout */ }
}

/* ── Analytics dashboard trigger ────────────────── */
export const ANALYTICS_SECRET = 'Vishnupriyacp@1234';

export function triggerAnalyticsDashboard() {
  window.dispatchEvent(new CustomEvent('show-analytics'));
}

/* ── Scroll depth ────────────────────────────────── */
let scrollListenerAdded = false;
export function initScrollTracking() {
  if (scrollListenerAdded || typeof window === 'undefined') return;
  scrollListenerAdded = true;
  const hit = new Set<string>();
  const onScroll = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (!total) return;
    const pct = (window.scrollY / total) * 100;
    if (window.scrollY > window.innerHeight && !hit.has('fold')) {
      hit.add('fold'); track('scroll_depth', { milestone: 'fold' });
    }
    ([25, 50, 75, 90] as const).forEach(n => {
      if (pct >= n && !hit.has(`${n}`)) {
        hit.add(`${n}`); track('scroll_depth', { milestone: `${n}pct` });
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}
