import { useRef, useEffect } from 'react';
import pStyles from '../pages/AboutPage.module.css';

const HOBBIES = [
  { name: '3D Modelling',    img: '/hobbies/3d-modelling.png' },
  { name: 'Blogging',        img: '/hobbies/blogging.png' },
  { name: 'Community',       img: '/hobbies/community.png' },
  { name: 'Formula 1',       img: '/hobbies/f1.png' },
  { name: 'Football',        img: '/hobbies/football.png' },
  { name: 'Hockey',          img: '/hobbies/hockey.png' },
  { name: 'Interior Design', img: '/hobbies/interior-design.png' },
  { name: 'Long Drives',     img: '/hobbies/long-drives.png' },
  { name: 'Singing',         img: '/hobbies/singing.png' },
  { name: 'Travelling',      img: '/hobbies/travelling.png' },
  { name: 'Vibe Coding',     img: '/hobbies/vibe-coding.png' },
];

const HOBBY_SPEED = 70; // px per second

export function HobbiesCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);
  const pausedRef   = useRef(false);
  const prevTimeRef = useRef(0);

  /* ── Auto-scroll ── */
  useEffect(() => {
    const tick = (t: number) => {
      const el = viewportRef.current;
      if (el && !pausedRef.current) {
        if (prevTimeRef.current) {
          el.scrollLeft += HOBBY_SPEED * (t - prevTimeRef.current) / 1000;
          const oneSet = el.scrollWidth / 2;
          if (el.scrollLeft >= oneSet) el.scrollLeft -= oneSet;
        }
      }
      prevTimeRef.current = t;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── Wheel: convert vertical → horizontal ── */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollLeft += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      const oneSet = el.scrollWidth / 2;
      if (el.scrollLeft >= oneSet) el.scrollLeft -= oneSet;
      else if (el.scrollLeft < 0)  el.scrollLeft += oneSet;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const pause  = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; prevTimeRef.current = 0; };

  return (
    <div className={pStyles.hobbiesWrap}>
      <span className="section-label">Hobbies</span>

      <div
        ref={viewportRef}
        className={pStyles.hobbiesViewport}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className={pStyles.hobbiesTrack}>
          {[...HOBBIES, ...HOBBIES].map((h, i) => (
            <div key={i} className={pStyles.hobbyCard}>
              <img src={h.img} alt={h.name} className={pStyles.hobbyImg} draggable={false} />
              <span className={pStyles.hobbyTooltip}>{h.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
