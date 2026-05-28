import { useEffect, useRef } from 'react';
import styles from './HeroTiles.module.css';
import { ImgSkeleton } from './ImgSkeleton';

/**
 * 3 floating image tiles in a perspective stack.
 * Rotation responds to scroll position.
 * Swap `src` values once images are ready — set to '' to use gradient placeholders.
 */
const TILES = [
  { id: 'a', src: '', label: 'Project 1', gradient: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)' },
  { id: 'b', src: '', label: 'Project 2', gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' },
  { id: 'c', src: '', label: 'Project 3', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)' },
];

export function HeroTiles() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        frameRef.current = requestAnimationFrame(() => {
          const progress = Math.min(window.scrollY / 600, 1); // 0→1 over 600px scroll
          if (!wrapRef.current) { ticking = false; return; }

          const cards = wrapRef.current.querySelectorAll<HTMLElement>(`.${styles.tile}`);
          cards.forEach((card, i) => {
            const baseY = -progress * (18 + i * 8);   // drift up
            const baseRX = -progress * (12 + i * 4);  // tip back
            const baseRZ = progress * (i === 1 ? -4 : 3); // slight roll
            card.style.transform = `${card.dataset.base} translateY(${baseY}px) rotateX(${baseRX}deg) rotateZ(${baseRZ}deg)`;
          });

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className={styles.scene} aria-hidden="true">
      <div ref={wrapRef} className={styles.stack}>
        {TILES.map((tile, i) => (
          <div
            key={tile.id}
            className={`${styles.tile} ${styles[`tile${i}`]}`}
            data-base={tileBaseTransform(i)}
            style={{ '--gradient': tile.gradient } as React.CSSProperties}
          >
            {tile.src ? (
              <ImgSkeleton src={tile.src} alt={tile.label} className={styles.img} />
            ) : (
              <div className={styles.placeholder} />
            )}
            <div className={styles.shimmer} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Initial 3D transform for each tile */
function tileBaseTransform(i: number): string {
  const transforms = [
    'perspective(900px) rotateY(18deg) rotateX(-10deg) rotateZ(-4deg) translateZ(-30px)',
    'perspective(900px) rotateY(10deg) rotateX(-5deg) rotateZ(1deg) translateZ(20px)',
    'perspective(900px) rotateY(4deg)  rotateX(-2deg) rotateZ(5deg) translateZ(50px)',
  ];
  return transforms[i] ?? transforms[0];
}
