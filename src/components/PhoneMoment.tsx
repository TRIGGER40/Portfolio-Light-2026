import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PhoneMoment.module.css';

const FEATURES = [
  { label: 'Start anywhere', desc: 'Plan from your current location.' },
  { label: 'Shape the itinerary', desc: 'Add, remove, or rearrange places.' },
  { label: 'Move your way', desc: "Get the right commute options when you're ready." },
  { label: 'Make it personal', desc: 'Let AI tailor the trip to your preferences.' },
  { label: 'All in one place', desc: 'Plan, navigate, explore, and adapt.' },
];

const VIDEO_LAYOUT_ID = 'phone-moment-video';

/**
 * A compact "side project" card, styled like FigmaAICard/CommunityCard —
 * a looping video in a rounded, elevated frame, deliberately flat (no
 * perspective/bezel/device chrome) so the video itself carries the
 * device look. Clicking it swaps in a separate fixed/centred element
 * sharing the same layoutId, so Framer Motion animates the shared
 * layout transition between them (robust regardless of scroll position,
 * unlike toggling position:fixed on a single element mid-animation).
 */
export function PhoneMoment() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.imgCol}>
          {!isOpen && (
            <motion.div
              layoutId={VIDEO_LAYOUT_ID}
              className={styles.phone}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setIsOpen(true)}
              aria-label="Open video"
            >
              <video
                className={styles.screen}
                src="/VIDEOS/phone-moment-web.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </motion.div>
          )}
          <div className={`${styles.shadow} ${isOpen ? styles.shadowHidden : ''}`} aria-hidden="true" />
        </div>

        <div className={styles.textCol}>
          <span className={styles.label}>Something that came to mind</span>

          <h3 className={styles.title}>
            I was too lazy to plan a trip.
            <br />
            <span className={styles.titleAccent}>So I started thinking.</span>
          </h3>

          <p className={styles.body}>
            What if Google Maps could plan the entire trip for me?
          </p>

          <ul className={styles.features}>
            {FEATURES.map((f) => (
              <li key={f.label} className={styles.feature}>
                <span className={styles.featureDot} aria-hidden="true" />
                <span>
                  <span className={styles.featureLabel}>{f.label}.</span>{' '}
                  <span className={styles.featureDesc}>{f.desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId={VIDEO_LAYOUT_ID}
            className={`${styles.phone} ${styles.phoneActive}`}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className={styles.screen}
              src="/VIDEOS/phone-moment-web.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            className={styles.closeBtn}
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <i className="bi bi-x-lg" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
