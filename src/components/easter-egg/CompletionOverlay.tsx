import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEasterEgg } from '../../context/EasterEggContext';
import { EASTER_EGGS } from '../../data/easterEggs';
import { EggIcon } from './EggIcon';
import { playCompletionChime } from '../../lib/easterEggSound';
import styles from './CompletionOverlay.module.css';

const GOLD_PARTICLES = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2;
  const dist  = 140 + (i % 5) * 30;
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist,
    size: 3 + (i % 5) * 0.8,
    delay: i * 0.045,
  };
});

export function CompletionOverlay() {
  const { completionOpen, closeCompletion } = useEasterEgg();
  const prefersRM = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!completionOpen) return;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => playCompletionChime(), 500);
    return () => { clearTimeout(t); document.body.style.overflow = ''; };
  }, [completionOpen]);

  useEffect(() => {
    if (!completionOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCompletion(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [completionOpen, closeCompletion]);

  return (
    <AnimatePresence>
      {completionOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          role="dialog"
          aria-label="All Easter Eggs discovered"
        >
          {/* Golden ambient glow */}
          <div className={styles.goldenAura} />
          {!prefersRM && <div className={styles.goldenRays} />}

          {/* Gold particles */}
          {!prefersRM && (
            <div className={styles.particleOrigin} aria-hidden="true">
              {GOLD_PARTICLES.map(p => (
                <div
                  key={p.id}
                  className={styles.particle}
                  style={{
                    width:  p.size,
                    height: p.size,
                    '--tx':    `${p.x}px`,
                    '--ty':    `${p.y}px`,
                    '--delay': `${p.delay}s`,
                  } as React.CSSProperties}
                />
              ))}
            </div>
          )}

          <motion.div
            className={styles.content}
            initial={{ opacity: 0, y: prefersRM ? 0 : 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Overline */}
            <motion.p
              className={styles.overline}
              initial={{ opacity: 0, letterSpacing: '0.24em' }}
              animate={{ opacity: 1, letterSpacing: '0.12em' }}
              transition={{ delay: 0.7, duration: 1.0 }}
            >
              All discoveries unlocked
            </motion.p>

            {/* Three glowing eggs */}
            <motion.div
              className={styles.eggRow}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              {EASTER_EGGS.map((e, i) => (
                <motion.div
                  key={e.id}
                  className={styles.eggWrap}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.45 + i * 0.12, duration: 0.6, ease: [0.34, 1.3, 0.64, 1] }}
                >
                  <div className={styles.eggGlow} />
                  <EggIcon size={128} state="complete" eggIndex={e.index} className={styles.eggFloat} />
                </motion.div>
              ))}
            </motion.div>

            {/* Headline */}
            <motion.h1
              className={styles.headline}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              You saw what<br />others overlooked.
            </motion.h1>

            {/* Sub-text */}
            <motion.p
              className={styles.sub}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.55 }}
            >
              Every hidden layer has now been revealed.
            </motion.p>

            {/* CTA */}
            <motion.button
              className={styles.cta}
              onClick={closeCompletion}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.65, duration: 0.5 }}
            >
              View your discoveries
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
