import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pStyles from '../pages/AboutPage.module.css';

const HOBBIES = [
  { name: '3D Modelling',    img: '/hobbies/3d-modelling.png' },
  { name: 'Blogging',        img: '/hobbies/blogging.png' },
  { name: 'Community',       img: '/hobbies/community.png' },
  { name: 'Formula 1',       img: '/hobbies/f1.png' },
  { name: 'Football',        img: '/hobbies/football.png' },
  { name: 'Hiking',          img: '/hobbies/Hiking.png' },
  { name: 'Photography',     img: '/hobbies/Photography.png' },
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
      // Only intercept horizontal swipes; let vertical scroll pass through
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaX;
      const oneSet = el.scrollWidth / 2;
      if (el.scrollLeft >= oneSet) el.scrollLeft -= oneSet;
      else if (el.scrollLeft < 0)  el.scrollLeft += oneSet;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const navigate = useNavigate();
  const pause  = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; prevTimeRef.current = 0; };

  return (
    <div className={pStyles.hobbiesWrap}>
      <span className="section-label">Interests</span>

      <div
        ref={viewportRef}
        className={pStyles.hobbiesViewport}
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div className={pStyles.hobbiesTrack}>
          {[...HOBBIES, ...HOBBIES].map((h, i) => {
            const is3D = h.name === '3D Modelling';
            return (
              <div
                key={i}
                className={`${pStyles.hobbyCard} ${is3D ? pStyles.hobbyCardLink : ''}`}
                onClick={() => { if (is3D) navigate('/campus-pano'); }}
                role={is3D ? 'link' : undefined}
                tabIndex={is3D ? 0 : undefined}
                onKeyDown={is3D ? (e) => { if (e.key === 'Enter') navigate('/campus-pano'); } : undefined}
                aria-label={is3D ? 'View Virtual Campus 360° walkthrough' : undefined}
              >
                <img src={h.img} alt={h.name} className={pStyles.hobbyImg} draggable={false} />
                <span className={pStyles.hobbyTooltip}>
                  {is3D ? '3D Modelling  →' : h.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
