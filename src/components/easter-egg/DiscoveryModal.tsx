import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEasterEgg } from '../../context/EasterEggContext';
import { EASTER_EGGS } from '../../data/easterEggs';
import { EggIcon } from './EggIcon';
import { playDiscoveryChime } from '../../lib/easterEggSound';
import styles from './DiscoveryModal.module.css';

/* ── Particles burst outward from egg origin ── */
const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * Math.PI * 2;
  const dist  = 88 + (i % 4) * 22;
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    size: 2.5 + (i % 4) * 0.7,
    color: ['#7c3aed', '#5254d8', '#a855f7', '#818cf8'][i % 4],
    delay: 0.52 + i * 0.022,
  };
});

export function DiscoveryModal() {
  const { discovering, dismissDiscovery, discovered } = useEasterEgg();
  const [ready, setReady] = useState(false);   // allow dismiss after animation

  const egg       = discovering ? EASTER_EGGS.find(e => e.id === discovering) ?? null : null;
  const newCount  = discovered.length + 1;
  const prefersRM = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* play sound + lock scroll */
  useEffect(() => {
    if (!discovering) { setReady(false); return; }
    document.body.style.overflow = 'hidden';
    const soundTimer  = setTimeout(() => playDiscoveryChime(), 380);
    const readyTimer  = setTimeout(() => setReady(true), 1800);
    return () => {
      clearTimeout(soundTimer);
      clearTimeout(readyTimer);
      document.body.style.overflow = '';
    };
  }, [discovering]);

  /* Escape — only after animation settles */
  useEffect(() => {
    if (!ready) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') dismissDiscovery(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [ready, dismissDiscovery]);

  return (
    <AnimatePresence>
      {discovering && egg && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55 }}
          aria-modal="true"
          role="dialog"
          aria-label="Easter egg discovered"
        >
          {/* Ambient radial glow */}
          <div className={styles.ambientGlow} />

          {/* Rotating light rays */}
          {!prefersRM && <div className={styles.lightRays} />}

          {/* Particle burst ring */}
          {!prefersRM && (
            <div className={styles.particleOrigin} aria-hidden="true">
              {PARTICLES.map(p => (
                <div
                  key={p.id}
                  className={styles.particle}
                  style={{
                    width:  p.size,
                    height: p.size,
                    background: p.color,
                    '--tx':    `${p.x}px`,
                    '--ty':    `${p.y}px`,
                    '--delay': `${p.delay}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}

          {/* ── Main content card ── */}
          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: prefersRM ? 0 : 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersRM ? 0 : -14, scale: 0.97 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Overline */}
            <motion.p
              className={styles.overline}
              initial={{ opacity: 0, letterSpacing: '0.25em' }}
              animate={{ opacity: 1, letterSpacing: '0.12em' }}
              transition={{ delay: 0.85, duration: 0.9 }}
            >
              You discovered an Easter egg
            </motion.p>

            {/* Egg */}
            <motion.div
              className={styles.eggWrap}
              initial={{ scale: 0.08, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.38, duration: 0.72, ease: [0.34, 1.35, 0.64, 1] }}
            >
              <div className={styles.eggGlow} />
              <EggIcon size={184} state="discovered" eggIndex={egg.index} className={styles.eggFloat} />
            </motion.div>

            {/* Title */}
            <motion.h2
              className={styles.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {egg.title}
            </motion.h2>

            {/* Lore */}
            <motion.p
              className={styles.lore}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {egg.lore}
            </motion.p>

            {/* Progress dots + label */}
            <motion.div
              className={styles.progressRow}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div className={styles.progressDots}>
                {EASTER_EGGS.map((e) => (
                  <EggIcon
                    key={e.id}
                    size={40}
                    state={discovered.includes(e.id) || e.id === discovering ? 'discovered' : 'undiscovered'}
                    eggIndex={e.index}
                  />
                ))}
              </div>
              <span className={styles.progressLabel}>{newCount} of 3 discovered</span>
            </motion.div>

            {/* CTA */}
            <motion.button
              className={styles.cta}
              onClick={dismissDiscovery}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              disabled={!ready}
            >
              View progress
            </motion.button>

            <motion.p
              className={styles.hint}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.1, duration: 0.6 }}
            >
              press Esc to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
