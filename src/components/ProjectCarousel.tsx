import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CASE_STUDIES, getProjectRoute } from '../data/portfolioData';
import styles from './ProjectCarousel.module.css';
import { ImgSkeleton } from './ImgSkeleton';

const CATEGORY_COLORS: Record<string, string> = {
  'AI':            'var(--accent-violet)',
  'Feature':       'var(--accent-blue)',
  'UX':            'var(--accent-indigo)',
  '0→1 Product':   'var(--accent-indigo)',
  'Design Systems':'var(--accent-cyan)',
  'Mentorship':    'var(--accent-blue)',
  'Internship':    'var(--accent-cyan)',
};

const SPEED = 50; // px per second

interface Props { currentId: string; }

export function ProjectCarousel({ currentId }: Props) {
  const navigate = useNavigate();
  const viewportRef = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);
  const pausedRef   = useRef(false);
  const prevTimeRef = useRef(0);

  // Triple the list for seamless looping
  const looped = [...CASE_STUDIES, ...CASE_STUDIES, ...CASE_STUDIES];

  /* ── Auto-scroll via rAF ── */
  useEffect(() => {
    const tick = (t: number) => {
      const el = viewportRef.current;
      if (el && !pausedRef.current) {
        if (prevTimeRef.current) {
          el.scrollLeft += SPEED * (t - prevTimeRef.current) / 1000;
          const oneSet = el.scrollWidth / 3;
          if (el.scrollLeft >= oneSet) el.scrollLeft -= oneSet;
        }
      }
      prevTimeRef.current = t;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── Wheel: convert vertical scroll → horizontal, non-passive so preventDefault works ── */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // Only intercept horizontal swipes; let vertical scroll pass through
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaX;
      const oneSet = el.scrollWidth / 3;
      if (el.scrollLeft >= oneSet) el.scrollLeft -= oneSet;
      else if (el.scrollLeft < 0) el.scrollLeft += oneSet;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const pause  = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; prevTimeRef.current = 0; };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.label}>More work</span>
        <h3 className={styles.title}>Continue exploring</h3>
      </div>

      <div
        ref={viewportRef}
        className={styles.viewport}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className={styles.track}>
          {looped.map((p, i) => {
            const color = CATEGORY_COLORS[p.category] || 'var(--accent-indigo)';
            const route = getProjectRoute(p.id);
            return (
              <div
                key={`${p.id}-${i}`}
                className={styles.card}
                onClick={() => navigate(route)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.imgWrap}>
                  <ImgSkeleton
                    src={`/${p.thumbnail}`}
                    alt={p.title}
                    className={styles.img}
                  />
                  <div className={styles.imgOverlay} />
                  <span
                    className={styles.badge}
                    style={{ '--badge-color': color } as React.CSSProperties}
                  >
                    {p.category}
                  </span>
                </div>
                <div className={styles.body}>
                  <span className={styles.company}>{p.company}</span>
                  <p className={styles.cardTitle}>{p.title}</p>
                  <span className={styles.cta}>
                    View case study
                    <i className="bi bi-arrow-up-right" style={{ fontSize: '12px' }} aria-hidden="true" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
