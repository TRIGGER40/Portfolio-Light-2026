import { useMemo, useState, useEffect, useCallback } from 'react';
import { fetchRemoteEvents, clearLocalAnalytics, isRemoteEnabled } from '../lib/analytics';
import type { AEvent } from '../lib/analytics';
import styles from './AnalyticsDashboard.module.css';

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

/* ── Main dashboard ───────────────────────────────── */
export function AnalyticsDashboard({ onClose }: { onClose: () => void }) {
  const [events, setEvents]     = useState<AEvent[]>([]);
  const [loading, setLoading]   = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
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

  const m = useMemo(() => {
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

    return {
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
            style={{ opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Loading…' : '↻ Refresh'}
          </button>
          <button className={styles.clearBtn} onClick={handleClear}>Clear cache</button>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close analytics">
            <i className="bi bi-x-lg" />
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Notice */}
        <div className={styles.notice}>
          <i className="bi bi-info-circle" />
          {remote
            ? 'Live data from all visitors via Supabase. Refreshes every 30 seconds.'
            : 'Supabase not configured — showing local session data only.'}
        </div>

        {!hasData ? (
          <div className={styles.empty}>
            <i className="bi bi-graph-up" />
            <div className={styles.emptyTitle}>No data yet</div>
            <div className={styles.emptyText}>
              Interact with your portfolio — scroll, click projects, hover cards, click CTAs — then reopen this dashboard to see the analytics.
            </div>
          </div>
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
