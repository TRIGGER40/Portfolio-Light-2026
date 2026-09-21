import { useMemo, useState, useEffect, useCallback } from 'react';
import { fetchRemoteEvents, clearLocalAnalytics, isRemoteEnabled } from '../lib/analytics';
import type { AEvent } from '../lib/analytics';
import { fetchPosts, deletePost } from '../lib/emojiBoard';
import type { EmojiPost } from '../lib/emojiBoard';
import { fetchBookings, deleteBooking } from '../lib/bookings';
import type { Booking } from '../lib/bookings';
import styles from './AnalyticsDashboard.module.css';
import { Loader } from './Loader';

/* ── Helpers ──────────────────────────────────────── */
function countryFlag(code?: string): string {
  if (!code || code.length !== 2) return '🌐';
  return [...code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))).join('');
}

function groupCount(arr: AEvent[], key: (e: AEvent) => string): Record<string, number> {
  return arr.reduce<Record<string, number>>((acc, e) => {
    const k = key(e); acc[k] = (acc[k] || 0) + 1; return acc;
  }, {});
}

function maxVal(obj: Record<string, number>): number {
  const vals = Object.values(obj);
  return vals.length ? Math.max(...vals) : 1;
}

function fmtDuration(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function fmtSecs(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`;
}

function fmtRelTime(ms: number): string {
  const s = Math.round(ms / 1000);
  if (s < 60) return `+${s}s`;
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return rem > 0 ? `+${m}m ${rem}s` : `+${m}m`;
}

function fmtDateTime(ts: number): string {
  const d = new Date(ts);
  const day = d.getDate();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const month = months[d.getMonth()];
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day} ${month} · ${hh}:${mm}`;
}

function formatEventType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function eventColor(type: string): string {
  switch (type) {
    case 'session_start':   return '#10b981';
    case 'hero_view':
    case 'hero_cta':        return '#f59e0b';
    case 'scroll_depth':
    case 'page_scroll_depth': return '#3b82f6';
    case 'section_view':    return '#8b5cf6';
    case 'project_click':
    case 'project_hover':   return '#a78bfa';
    case 'resume_click':
    case 'linkedin_click':
    case 'cta_click':       return '#06b6d4';
    case 'egg_discovered':  return '#f59e0b';
    case 'egg_all_found':   return '#fbbf24';
    case 'session_end':     return '#ef4444';
    default:                return 'rgba(255,255,255,0.3)';
  }
}

function eventDataSummary(e: AEvent): string {
  switch (e.type) {
    case 'project_click':
    case 'project_hover':
      return (e.data.title as string) || (e.data.id as string) || '';
    case 'scroll_depth':
      return (e.data.milestone as string) || '';
    case 'page_scroll_depth':
      return `${(e.data.page as string) || ''} · ${(e.data.milestone as string) || ''}`;
    case 'section_view': {
      const section = (e.data.section as string) || '';
      const dur = e.data.duration ? ` · ${fmtSecs(e.data.duration as number)}` : '';
      return `${section}${dur}`;
    }
    case 'hero_cta':
      return (e.data.cta as string) || '';
    case 'cta_click':
      return (e.data.label as string) || '';
    case 'session_start': {
      const ref = e.data.referrer as string;
      return ref ? `from ${ref}` : 'direct';
    }
    case 'egg_discovered':
      return (e.data.egg_title as string) || (e.data.egg_id as string) || '';
    case 'egg_all_found':
      return 'All 3 eggs found';
    case 'session_end': {
      const lastType = e.data.last_type as string | undefined;
      if (!lastType) return '';
      const summary = eventDataSummary({ ...e, type: lastType as AEvent['type'], data: (e.data.last_data as Record<string, unknown>) || {} });
      return `left after ${formatEventType(lastType)}${summary ? ` · ${summary}` : ''}`;
    }
    default:
      return '';
  }
}

/* ── Session types ────────────────────────────────── */
interface SessionSummary {
  sid: string;
  vid: string;
  startTs: number;
  endTs: number;
  duration: number;
  eventCount: number;
  country?: string;
  countryCode?: string;
  city?: string;
  region?: string;
  referrer?: string;
  scrollDepth: number;
  projectsClicked: string[];
  events: AEvent[];
  lastEvent: AEvent;
}

function scrollDepthFromMilestone(milestone: string): number {
  if (milestone === '90pct') return 90;
  if (milestone === '75pct') return 75;
  if (milestone === '50pct') return 50;
  if (milestone === '25pct') return 25;
  if (milestone === 'fold')  return 10; // any depth past fold
  return 0;
}

/* ── Sub-components ───────────────────────────────── */
function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}

function BarRow({
  label, count, max, pct, accent,
}: {
  label: string; count?: number; max?: number; pct?: number; accent?: string;
}) {
  const fill = pct !== undefined ? pct : max ? Math.round((count! / max) * 100) : 0;
  return (
    <div className={styles.barRow}>
      <div className={styles.barLabel} title={label}>{label}</div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{
            width: `${fill}%`,
            background: accent || 'linear-gradient(90deg,#7c3aed,#3b82f6)',
          }}
        />
      </div>
      {pct !== undefined
        ? <div className={styles.barPct}>{fill}%</div>
        : <div className={styles.barCount}>{count}</div>
      }
    </div>
  );
}

/* ── Session detail view ──────────────────────────── */
function SessionDetail({
  session,
  onBack,
}: {
  session: SessionSummary;
  onBack: () => void;
}) {
  const flag = countryFlag(session.countryCode);
  const location = [session.city, session.country].filter(Boolean).join(', ') || 'Unknown';

  return (
    <div className={styles.sessionDetail}>
      <button className={styles.sessionDetailBack} onClick={onBack}>
        ← All sessions
      </button>

      <div className={styles.sessionDetailHeader}>
        <div className={styles.sessionMeta}>
          <span className={styles.sessionLocation}>
            {flag} {location}
          </span>
          <span className={styles.sessionDate}>{fmtDateTime(session.startTs)}</span>
        </div>
        <div className={styles.sessionPills} style={{ marginTop: 10 }}>
          <span className={styles.sessionPill}>{fmtDuration(session.duration)}</span>
          <span className={styles.sessionPill}>{session.eventCount} events</span>
          {session.referrer && (
            <span className={styles.sessionPill}>{session.referrer}</span>
          )}
          <span className={styles.sessionPill}>Scroll {session.scrollDepth}%</span>
          <span className={styles.sessionPill} style={{ borderColor: eventColor(session.lastEvent.type) }}>
            Last: {formatEventType(session.lastEvent.type)}
            {eventDataSummary(session.lastEvent) ? ` · ${eventDataSummary(session.lastEvent)}` : ''}
          </span>
        </div>
      </div>

      <div className={styles.timeline}>
        {session.events.map((e, i) => (
          <div key={i} className={styles.timelineRow}>
            <div
              className={styles.timelineDot}
              style={{ background: eventColor(e.type) }}
            />
            <div className={styles.timelineType}>{formatEventType(e.type)}</div>
            <div className={styles.timelineData}>{eventDataSummary(e)}</div>
            <div className={styles.timelineTime}>
              {fmtRelTime(e.ts - session.startTs)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sessions list view ───────────────────────────── */
function SessionsList({
  sessions,
  onSelect,
}: {
  sessions: SessionSummary[];
  onSelect: (s: SessionSummary) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
        {sessions.length} sessions
      </div>
      <div className={styles.sessionsGrid}>
        {sessions.map(session => {
          const flag = countryFlag(session.countryCode);
          const location = [session.city, session.country].filter(Boolean).join(', ') || 'Unknown';
          const visibleProjects = session.projectsClicked.slice(0, 3);
          const extraProjects = session.projectsClicked.length - 3;

          return (
            <div
              key={session.sid}
              className={styles.sessionCard}
              onClick={() => onSelect(session)}
            >
              <div className={styles.sessionMeta}>
                <span className={styles.sessionLocation}>
                  {flag} {location}
                </span>
                <span className={styles.sessionDate}>{fmtDateTime(session.startTs)}</span>
              </div>

              <div className={styles.sessionPills}>
                <span className={styles.sessionPill}>{fmtDuration(session.duration)}</span>
                <span className={styles.sessionPill}>{session.eventCount} events</span>
                {session.referrer && (
                  <span className={styles.sessionPill}>{session.referrer}</span>
                )}
              </div>

              <div className={styles.sessionScrollBar}>
                <div
                  className={styles.sessionScrollFill}
                  style={{ width: `${session.scrollDepth}%` }}
                />
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
                Scroll depth · {session.scrollDepth}%
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
                Last: {formatEventType(session.lastEvent.type)}
                {eventDataSummary(session.lastEvent) ? ` · ${eventDataSummary(session.lastEvent)}` : ''}
              </div>

              {session.projectsClicked.length > 0 && (
                <div className={styles.sessionProjects}>
                  {visibleProjects.map(p => (
                    <span key={p} className={styles.sessionProjectChip}>{p}</span>
                  ))}
                  {extraProjects > 0 && (
                    <span className={styles.sessionProjectChip}>+{extraProjects} more</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Board table ──────────────────────────────────── */
function BoardTable({
  posts,
  onRemove,
}: {
  posts: EmojiPost[];
  onRemove: (id: string) => void;
}) {
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  async function handleRemove(id: string) {
    if (!confirm('Remove this post from the board?')) return;
    setRemoving(prev => new Set([...prev, id]));
    const result = await deletePost(id);
    if (result.ok) {
      onRemove(id);
    } else {
      alert('Could not remove post. Try refreshing and trying again.');
    }
    setRemoving(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  if (posts.length === 0) {
    return (
      <div className={styles.empty}>
        <i className="bi bi-emoji-smile" />
        <div className={styles.emptyTitle}>No posts yet</div>
        <div className={styles.emptyText}>When visitors leave their mark, posts will appear here.</div>
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <table className={styles.boardTable}>
        <thead>
          <tr>
            <th>Emoji</th>
            <th>Name</th>
            <th>Posted</th>
            <th>Location</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {[...posts].reverse().map(post => {
            const d = new Date(post.created_at);
            const date = d.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
            const time = d.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true });
            const flag = post.country_code
              ? [...post.country_code.toUpperCase()].map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0))).join('')
              : null;
            const location = post.city && post.country
              ? `${post.city}, ${post.country}`
              : post.country || null;

            return (
              <tr key={post.id}>
                <td className={styles.boardEmojiCell}>
                  <img
                    src={`https://fonts.gstatic.com/s/e/notoemoji/latest/${post.emoji_code}/512.webp`}
                    alt={post.emoji}
                    width={28}
                    height={28}
                    style={{ objectFit: 'contain', display: 'block' }}
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                      (e.currentTarget.nextElementSibling as HTMLElement | null)!.style.display = 'inline';
                    }}
                  />
                  <span style={{ display: 'none', fontSize: 22 }}>{post.emoji}</span>
                </td>
                <td className={styles.boardName}>{post.name}</td>
                <td className={styles.boardDate}>
                  <span>{date}</span>
                  <span className={styles.boardTime}>{time}</span>
                </td>
                <td className={styles.boardLocation}>
                  {flag && <span style={{ marginRight: 5 }}>{flag}</span>}
                  {location || <span style={{ color: 'rgba(255,255,255,0.2)' }}>Unknown</span>}
                </td>
                <td className={styles.boardActionCell}>
                  <button
                    className={styles.boardRemoveBtn}
                    onClick={() => handleRemove(post.id)}
                    disabled={removing.has(post.id)}
                    title="Remove from board"
                    aria-label="Remove post"
                  >
                    {removing.has(post.id)
                      ? <Loader size={12} />
                      : <i className="bi bi-trash3" />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Bookings table ───────────────────────────────── */
const SLOT_LABELS: Record<string, string> = {
  '18:00': '6:00 PM – 7:00 PM',
  '19:30': '7:30 PM – 8:30 PM',
};

function BookingsTable({
  bookings,
  onRemove,
}: {
  bookings: Booking[];
  onRemove: (id: string) => void;
}) {
  const [removing, setRemoving] = useState<Set<string>>(new Set());

  async function handleRemove(id: string) {
    if (!confirm('Delete this booking? This also frees up the slot, cancels the calendar invite, and refunds the payment.')) return;
    setRemoving(prev => new Set([...prev, id]));
    const result = await deleteBooking(id);
    if (result.ok) {
      onRemove(id);
      const failures = [
        result.calendarDeleted === false && 'the calendar event could not be deleted automatically',
        result.refunded === false && 'the payment could not be refunded automatically',
      ].filter(Boolean);
      if (failures.length > 0) {
        alert(`Booking removed, but ${failures.join(' and ')}. Please handle this manually.`);
      }
    } else {
      alert('Could not delete booking. Try refreshing and trying again.');
    }
    setRemoving(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  if (bookings.length === 0) {
    return (
      <div className={styles.empty}>
        <i className="bi bi-calendar-check" />
        <div className={styles.emptyTitle}>No bookings yet</div>
        <div className={styles.emptyText}>Confirmed mentorship bookings will appear here.</div>
      </div>
    );
  }

  return (
    <div className={styles.sectionCard}>
      <table className={styles.boardTable}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Name</th>
            <th>Email</th>
            <th>Reason</th>
            <th>Meet link</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => {
            const dateFormatted = new Date(`${b.date}T00:00:00`).toLocaleDateString('en-IN', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
            });
            return (
              <tr key={b.id}>
                <td className={styles.boardDate}>{dateFormatted}</td>
                <td className={styles.boardName}>{SLOT_LABELS[b.slot] ?? b.slot}</td>
                <td className={styles.boardName}>{b.name}</td>
                <td className={styles.boardLocation}>{b.email}</td>
                <td className={styles.bookingReasonCell} title={b.reason}>{b.reason}</td>
                <td className={styles.boardLocation}>
                  {b.meet_link
                    ? <a href={b.meet_link} target="_blank" rel="noreferrer">Meet</a>
                    : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                </td>
                <td className={styles.boardActionCell}>
                  <button
                    className={styles.boardRemoveBtn}
                    onClick={() => handleRemove(b.id)}
                    disabled={removing.has(b.id)}
                    title="Delete booking"
                    aria-label="Delete booking"
                  >
                    {removing.has(b.id)
                      ? <Loader size={12} />
                      : <i className="bi bi-trash3" />}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main dashboard ───────────────────────────────── */
export function AnalyticsDashboard({ onClose }: { onClose: () => void }) {
  const [events, setEvents]     = useState<AEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'board' | 'bookings'>('overview');
  const [selectedSession, setSelectedSession] = useState<SessionSummary | null>(null);
  const [boardPosts, setBoardPosts] = useState<EmojiPost[]>([]);
  const [boardLoading, setBoardLoading] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const remote = isRemoteEnabled();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const data = await fetchRemoteEvents();
    setEvents(data);
    setLastUpdated(new Date());
    setLoading(false);
  }, []);

  // Initial load + auto-refresh every 30s
  useEffect(() => {
    loadEvents();
    const id = setInterval(loadEvents, 30_000);
    return () => clearInterval(id);
  }, [loadEvents]);

  // Load board posts when Board tab is opened
  const loadBoardPosts = useCallback(async () => {
    setBoardLoading(true);
    const data = await fetchPosts();
    setBoardPosts(data);
    setBoardLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'board') loadBoardPosts();
  }, [activeTab, loadBoardPosts]);

  // Load bookings when Bookings tab is opened
  const loadBookings = useCallback(async () => {
    setBookingsLoading(true);
    const data = await fetchBookings();
    setBookings(data);
    setBookingsLoading(false);
  }, []);

  useEffect(() => {
    if (activeTab === 'bookings') loadBookings();
  }, [activeTab, loadBookings]);

  const { m, sessionList } = useMemo(() => {
    const sessions = new Set(events.map(e => e.sid));
    const visitors = new Set(events.map(e => e.vid));

    // ── Scroll depth ──
    const foldSessions = new Set(
      events.filter(e => e.type === 'scroll_depth' && e.data.milestone === 'fold').map(e => e.sid)
    );
    const depth = (ms: string) =>
      sessions.size
        ? Math.round(new Set(
            events.filter(e => e.type === 'scroll_depth' && e.data.milestone === ms).map(e => e.sid)
          ).size / sessions.size * 100)
        : 0;

    // ── Hero ──
    const heroCtas = events.filter(e => e.type === 'hero_cta');
    const ctaByLabel = groupCount(heroCtas, e => (e.data.cta as string) || 'unknown');

    // ── Projects ──
    const projClicks = events.filter(e => e.type === 'project_click');
    const clicksByProj = groupCount(projClicks, e => (e.data.title as string) || (e.data.id as string) || 'Unknown');

    const projHovers = events.filter(e => e.type === 'project_hover');
    const avgHoverByProj: Record<string, number> = {};
    const hoverByProj = projHovers.reduce<Record<string, number[]>>((acc, e) => {
      const k = (e.data.title as string) || (e.data.id as string) || 'Unknown';
      (acc[k] = acc[k] || []).push(e.data.duration as number);
      return acc;
    }, {});
    Object.entries(hoverByProj).forEach(([k, arr]) => {
      avgHoverByProj[k] = arr.reduce((s, n) => s + n, 0) / arr.length;
    });

    // First-click per session
    const firstClicks: Record<string, number> = {};
    const firstBySid: Record<string, string> = {};
    projClicks
      .slice()
      .sort((a, b) => a.ts - b.ts)
      .forEach(e => {
        if (!firstBySid[e.sid]) {
          firstBySid[e.sid] = (e.data.title as string) || (e.data.id as string) || 'Unknown';
        }
      });
    Object.values(firstBySid).forEach(name => { firstClicks[name] = (firstClicks[name] || 0) + 1; });

    // ── CTAs ──
    const ctaClicks = events.filter(e => e.type === 'cta_click');
    const ctaAll = groupCount(ctaClicks, e => (e.data.label as string) || 'unknown');

    // ── About section time ──
    const aboutViews = events.filter(e => e.type === 'section_view' && e.data.section === 'about');
    const avgAbout = aboutViews.length
      ? aboutViews.reduce((s, e) => s + (e.data.duration as number), 0) / aboutViews.length
      : 0;

    // ── Section views ──
    const sectionViews = groupCount(
      events.filter(e => e.type === 'section_view'),
      e => (e.data.section as string) || 'unknown'
    );

    // ── Easter Eggs ──
    const eggEvents      = events.filter(e => e.type === 'egg_discovered');
    const eggAllEvents   = events.filter(e => e.type === 'egg_all_found');
    const eggPerTitle: Record<string, number> = {};
    const eggSessionsAll = new Set(eggAllEvents.map(e => e.sid));
    eggEvents.forEach(e => {
      const title = (e.data.egg_title as string) || (e.data.egg_id as string) || 'Unknown';
      eggPerTitle[title] = (eggPerTitle[title] || 0) + 1;
    });
    // Unique sessions that found at least 1 egg
    const sessionsWithAnyEgg   = new Set(eggEvents.map(e => e.sid)).size;
    // Unique sessions that found all eggs
    const sessionsWithAllEggs  = eggSessionsAll.size;
    // Completion rate (sessions that found all / sessions that found any)
    const eggCompletionRate = sessionsWithAnyEgg > 0
      ? Math.round((sessionsWithAllEggs / sessionsWithAnyEgg) * 100)
      : 0;

    // ── Geo ──
    const geoEvents = events.filter(e => e.type === 'session_start' && e.data.country);
    const byCountry = groupCount(geoEvents, e => `${countryFlag(e.data.country_code as string)} ${e.data.country as string}`);
    const byCity    = groupCount(
      geoEvents.filter(e => e.data.city),
      e => `${e.data.city}${e.data.region ? ', ' + e.data.region : ''}`
    );
    const referrers = groupCount(
      events.filter(e => e.type === 'session_start' && e.data.referrer),
      e => (e.data.referrer as string) || 'direct'
    );

    // ── Build session summaries ──
    const sidMap = new Map<string, AEvent[]>();
    events.forEach(e => {
      if (!sidMap.has(e.sid)) sidMap.set(e.sid, []);
      sidMap.get(e.sid)!.push(e);
    });

    const sessionList: SessionSummary[] = [];
    sidMap.forEach((evts, sid) => {
      const sorted = evts.slice().sort((a, b) => a.ts - b.ts);
      const startTs = sorted[0].ts;
      const endTs = sorted[sorted.length - 1].ts;

      // Geo from session_start
      const startEvt = sorted.find(e => e.type === 'session_start');
      const country = startEvt?.data.country as string | undefined;
      const countryCode = startEvt?.data.country_code as string | undefined;
      const city = startEvt?.data.city as string | undefined;
      const region = startEvt?.data.region as string | undefined;
      const referrer = startEvt?.data.referrer as string | undefined;

      // Highest scroll depth
      const depthMilestones = sorted
        .filter(e => e.type === 'scroll_depth')
        .map(e => scrollDepthFromMilestone(e.data.milestone as string));
      const scrollDepth = depthMilestones.length > 0 ? Math.max(...depthMilestones) : 0;

      // Unique projects clicked
      const projectsClicked = [
        ...new Set(
          sorted
            .filter(e => e.type === 'project_click')
            .map(e => (e.data.title as string) || (e.data.id as string) || 'Unknown')
        ),
      ];

      sessionList.push({
        sid,
        vid: sorted[0].vid,
        startTs,
        endTs,
        duration: endTs - startTs,
        eventCount: sorted.length,
        country,
        countryCode,
        city,
        region,
        referrer,
        scrollDepth,
        projectsClicked,
        events: sorted,
        lastEvent: sorted[sorted.length - 1],
      });
    });

    // Sort newest first
    sessionList.sort((a, b) => b.startTs - a.startTs);

    return {
      m: {
        sessions:    sessions.size,
        visitors:    visitors.size,
        totalEvents: events.length,
        foldPct:     sessions.size ? Math.round(foldSessions.size / sessions.size * 100) : 0,
        depth25: depth('25pct'), depth50: depth('50pct'),
        depth75: depth('75pct'), depth90: depth('90pct'),
        ctaByLabel,
        clicksByProj, avgHoverByProj, firstClicks,
        ctaAll,
        resumeClicks:  events.filter(e => e.type === 'resume_click').length,
        linkedinClicks:events.filter(e => e.type === 'linkedin_click').length,
        avgAbout,
        aboutViews:    aboutViews.length,
        sectionViews,
        byCountry, byCity, referrers,
        eggPerTitle, sessionsWithAnyEgg, sessionsWithAllEggs, eggCompletionRate,
      },
      sessionList,
    };
  }, [events]);

  const hasData = events.length > 0;

  function handleClear() {
    if (!confirm('Clear local cache? (Remote Supabase data is kept.)')) return;
    clearLocalAnalytics();
    loadEvents();
  }

  return (
    <div className={styles.overlay}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <i className="bi bi-bar-chart-line-fill" style={{ color: '#a78bfa', fontSize: 16 }} />
          <span className={styles.headerTitle}>Analytics</span>
          <span className={styles.headerBadge}>{remote ? '● LIVE' : 'LOCAL'}</span>
        </div>

        <div className={styles.headerRight}>
          {lastUpdated && (
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button className={styles.clearBtn} onClick={loadEvents} disabled={loading}
            style={{ opacity: loading ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {loading ? <><Loader size={14} /> Loading</> : '↻ Refresh'}
          </button>
          <button className={styles.clearBtn} onClick={handleClear}>Clear cache</button>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close analytics">
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tabLarge} ${activeTab === 'overview' ? styles.tabLargeActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`${styles.tabLarge} ${activeTab === 'sessions' ? styles.tabLargeActive : ''}`}
          onClick={() => { setActiveTab('sessions'); setSelectedSession(null); }}
        >
          Sessions
        </button>
        <button
          className={`${styles.tabLarge} ${activeTab === 'board' ? styles.tabLargeActive : ''}`}
          onClick={() => setActiveTab('board')}
        >
          Board
        </button>
        <button
          className={`${styles.tabLarge} ${activeTab === 'bookings' ? styles.tabLargeActive : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </div>

      <div className={styles.content}>
        {/* Notice */}
        <div className={styles.notice}>
          <i className="bi bi-info-circle" />
          {remote
            ? 'Live data from all visitors via Supabase. Refreshes every 30 seconds.'
            : 'Supabase not configured — showing local session data only.'}
        </div>

        {loading && !hasData ? (
          <div className={styles.empty}>
            <Loader size={36} />
            <div className={styles.emptyTitle}>Loading analytics</div>
            <div className={styles.emptyText}>Fetching your portfolio data…</div>
          </div>
        ) : !hasData ? (
          <div className={styles.empty}>
            <i className="bi bi-graph-up" />
            <div className={styles.emptyTitle}>No data yet</div>
            <div className={styles.emptyText}>
              Interact with your portfolio — scroll, click projects, hover cards, click CTAs — then reopen this dashboard to see the analytics.
            </div>
          </div>
        ) : activeTab === 'board' ? (
          <div>
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <i className="bi bi-emoji-smile" style={{ color: '#a78bfa' }} />
                Community Board
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                  {boardPosts.length} {boardPosts.length === 1 ? 'post' : 'posts'}
                </span>
                <button
                  className={styles.clearBtn}
                  onClick={loadBoardPosts}
                  disabled={boardLoading}
                  style={{ marginLeft: 8, opacity: boardLoading ? 0.5 : 1 }}
                >
                  {boardLoading ? 'Loading…' : '↻ Refresh'}
                </button>
              </div>
              {boardLoading && boardPosts.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <Loader size={28} />
                </div>
              ) : (
                <BoardTable
                  posts={boardPosts}
                  onRemove={id => setBoardPosts(prev => prev.filter(p => p.id !== id))}
                />
              )}
            </div>
          </div>
        ) : activeTab === 'bookings' ? (
          <div>
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <i className="bi bi-calendar-check" style={{ color: '#6BBF9A' }} />
                Bookings
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                  {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
                </span>
                <button
                  className={styles.clearBtn}
                  onClick={loadBookings}
                  disabled={bookingsLoading}
                  style={{ marginLeft: 8, opacity: bookingsLoading ? 0.5 : 1 }}
                >
                  {bookingsLoading ? 'Loading…' : '↻ Refresh'}
                </button>
              </div>
              {bookingsLoading && bookings.length === 0 ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <Loader size={28} />
                </div>
              ) : (
                <BookingsTable
                  bookings={bookings}
                  onRemove={id => setBookings(prev => prev.filter(b => b.id !== id))}
                />
              )}
            </div>
          </div>
        ) : activeTab === 'sessions' ? (
          selectedSession ? (
            <SessionDetail
              session={selectedSession}
              onBack={() => setSelectedSession(null)}
            />
          ) : (
            <SessionsList
              sessions={sessionList}
              onSelect={setSelectedSession}
            />
          )
        ) : (
          <>
            {/* ── Overview ── */}
            <div className={styles.statsRow}>
              <StatCard value={m.sessions}    label="Sessions" />
              <StatCard value={m.visitors}    label="Visitors" />
              <StatCard value={m.totalEvents} label="Events" />
              <StatCard value={`${m.foldPct}%`} label="Scroll past fold" />
            </div>

            {/* ── Scroll Depth ── */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <i className="bi bi-arrow-down-circle" />
                Scroll Depth
              </div>
              <div className={styles.sectionCard}>
                <BarRow label="Past fold"      pct={m.foldPct}  accent="linear-gradient(90deg,#7c3aed,#6366f1)" />
                <BarRow label="25% of page"    pct={m.depth25}  accent="linear-gradient(90deg,#6366f1,#3b82f6)" />
                <BarRow label="50% of page"    pct={m.depth50}  accent="linear-gradient(90deg,#3b82f6,#06b6d4)" />
                <BarRow label="75% of page"    pct={m.depth75}  accent="linear-gradient(90deg,#06b6d4,#10b981)" />
                <BarRow label="90% of page"    pct={m.depth90}  accent="linear-gradient(90deg,#10b981,#84cc16)" />
              </div>
            </div>

            {/* ── Hero CTAs ── */}
            {Object.keys(m.ctaByLabel).length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <i className="bi bi-cursor-fill" />
                  Hero CTA Clicks
                </div>
                <div className={styles.sectionCard}>
                  {Object.entries(m.ctaByLabel)
                    .sort((a, b) => b[1] - a[1])
                    .map(([label, count]) => (
                      <BarRow key={label} label={label} count={count} max={maxVal(m.ctaByLabel)} />
                    ))}
                </div>
              </div>
            )}

            {/* ── Project Performance ── */}
            {Object.keys(m.clicksByProj).length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <i className="bi bi-grid-1x2" />
                  Project Performance
                </div>
                <div className={styles.sectionCard}>
                  <table className={styles.projectTable}>
                    <thead>
                      <tr>
                        <th>Project</th>
                        <th>Clicks</th>
                        <th>Avg Hover</th>
                        <th>First-Click Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(m.clicksByProj)
                        .sort((a, b) => b[1] - a[1])
                        .map(([name, clicks]) => (
                          <tr key={name}>
                            <td><span className={styles.projectName}>{name}</span></td>
                            <td>
                              <span className={`${styles.pill} ${styles.pillViolet}`}>{clicks}</span>
                            </td>
                            <td>
                              {m.avgHoverByProj[name]
                                ? <span className={`${styles.pill} ${styles.pillBlue}`}>{fmtSecs(m.avgHoverByProj[name])}</span>
                                : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                            </td>
                            <td>
                              {m.firstClicks[name]
                                ? <span className={`${styles.pill} ${styles.pillGreen}`}>{m.firstClicks[name]}</span>
                                : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── First Click Distribution ── */}
            {Object.keys(m.firstClicks).length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <i className="bi bi-hand-index" />
                  First Project Clicked per Session
                </div>
                <div className={styles.sectionCard}>
                  {Object.entries(m.firstClicks)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, count]) => (
                      <BarRow
                        key={name} label={name} count={count}
                        max={maxVal(m.firstClicks)}
                        accent="linear-gradient(90deg,#f59e0b,#f97316)"
                      />
                    ))}
                </div>
              </div>
            )}

            {/* ── About Section ── */}
            {m.aboutViews > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <i className="bi bi-person-circle" />
                  About Me Section
                </div>
                <div className={styles.sectionCard}>
                  <div className={styles.chipRow}>
                    <div className={styles.chip}>
                      <span className={styles.chipValue}>{m.aboutViews}</span>
                      <span className={styles.chipLabel}>views</span>
                    </div>
                    <div className={styles.chip}>
                      <span className={styles.chipValue}>{fmtDuration(m.avgAbout)}</span>
                      <span className={styles.chipLabel}>avg time</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Visitor Locations ── */}
            {Object.keys(m.byCountry).length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <i className="bi bi-globe2" />
                  Visitor Locations
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.sectionCard}>
                    <div className={styles.sectionHead} style={{ border: 'none', marginBottom: 12, paddingBottom: 0 }}>
                      <i className="bi bi-flag" />Countries
                    </div>
                    {Object.entries(m.byCountry)
                      .sort((a, b) => b[1] - a[1])
                      .map(([country, count]) => (
                        <BarRow key={country} label={country} count={count}
                          max={maxVal(m.byCountry)}
                          accent="linear-gradient(90deg,#10b981,#06b6d4)" />
                      ))}
                  </div>
                  <div className={styles.sectionCard}>
                    <div className={styles.sectionHead} style={{ border: 'none', marginBottom: 12, paddingBottom: 0 }}>
                      <i className="bi bi-building" />Top Cities
                    </div>
                    {Object.entries(m.byCity)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 8)
                      .map(([city, count]) => (
                        <BarRow key={city} label={city} count={count}
                          max={maxVal(m.byCity)}
                          accent="linear-gradient(90deg,#3b82f6,#8b5cf6)" />
                      ))}
                  </div>
                </div>
                {Object.keys(m.referrers).length > 0 && (
                  <div className={styles.sectionCard} style={{ marginTop: 14 }}>
                    <div className={styles.sectionHead} style={{ border: 'none', marginBottom: 12, paddingBottom: 0 }}>
                      <i className="bi bi-link-45deg" />Traffic Sources
                    </div>
                    {Object.entries(m.referrers)
                      .sort((a, b) => b[1] - a[1])
                      .map(([ref, count]) => (
                        <BarRow key={ref} label={ref} count={count}
                          max={maxVal(m.referrers)}
                          accent="linear-gradient(90deg,#f59e0b,#ef4444)" />
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Easter Eggs ── */}
            {m.sessionsWithAnyEgg > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <i className="bi bi-egg-fill" style={{ color: '#f59e0b' }} />
                  Easter Eggs
                </div>
                <div className={styles.twoCol}>
                  <div className={styles.sectionCard}>
                    <div className={styles.chipRow}>
                      <div className={styles.chip}>
                        <span className={styles.chipValue}>{m.sessionsWithAnyEgg}</span>
                        <span className={styles.chipLabel}>found at least one</span>
                      </div>
                      <div className={styles.chip}>
                        <span className={styles.chipValue}>{m.sessionsWithAllEggs}</span>
                        <span className={styles.chipLabel}>found all three</span>
                      </div>
                      <div className={styles.chip}>
                        <span className={styles.chipValue}>{m.eggCompletionRate}%</span>
                        <span className={styles.chipLabel}>completion rate</span>
                      </div>
                    </div>
                  </div>
                  {Object.keys(m.eggPerTitle).length > 0 && (
                    <div className={styles.sectionCard}>
                      {Object.entries(m.eggPerTitle)
                        .sort((a, b) => b[1] - a[1])
                        .map(([title, count]) => (
                          <BarRow
                            key={title}
                            label={title}
                            count={count}
                            max={maxVal(m.eggPerTitle)}
                            accent="linear-gradient(90deg,#f59e0b,#f97316)"
                          />
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── CTA Performance ── */}
            <div className={styles.section}>
              <div className={styles.sectionHead}>
                <i className="bi bi-lightning-charge" />
                CTA &amp; Contact Interactions
              </div>
              <div className={styles.twoCol}>
                {Object.keys(m.ctaAll).length > 0 && (
                  <div className={styles.sectionCard}>
                    {Object.entries(m.ctaAll)
                      .sort((a, b) => b[1] - a[1])
                      .map(([label, count]) => (
                        <BarRow
                          key={label} label={label} count={count}
                          max={maxVal(m.ctaAll)}
                          accent="linear-gradient(90deg,#06b6d4,#3b82f6)"
                        />
                      ))}
                  </div>
                )}
                <div className={styles.sectionCard}>
                  <div className={styles.chipRow}>
                    <div className={styles.chip}>
                      <span className={styles.chipValue}>{m.resumeClicks}</span>
                      <span className={styles.chipLabel}>Resume downloads</span>
                    </div>
                    <div className={styles.chip}>
                      <span className={styles.chipValue}>{m.linkedinClicks}</span>
                      <span className={styles.chipLabel}>LinkedIn clicks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section views ── */}
            {Object.keys(m.sectionViews).length > 0 && (
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <i className="bi bi-eye" />
                  Section View Time
                </div>
                <div className={styles.sectionCard}>
                  {Object.entries(m.sectionViews)
                    .sort((a, b) => b[1] - a[1])
                    .map(([section, count]) => (
                      <BarRow
                        key={section}
                        label={section.charAt(0).toUpperCase() + section.slice(1)}
                        count={count}
                        max={maxVal(m.sectionViews)}
                        accent="linear-gradient(90deg,#8b5cf6,#6366f1)"
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
