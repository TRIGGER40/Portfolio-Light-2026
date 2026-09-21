import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ProximityMoment.module.css';
import { track } from '../lib/analytics';

const FEATURES = [
  { label: 'Proximity-triggered interruption', desc: "From your live location, Google Maps can tell how far someone is from you and create a custom proximity alert, so you're prepared without needing to stay glued to the screen." },
];

const VIDEO_LAYOUT_ID = 'proximity-moment-video';

/**
 * A compact "side project" card, same setup as PhoneMoment but with the
 * text and video columns swapped (text left, video right).
 */
export function ProximityMoment() {
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
        <div className={styles.textCol}>
          <span className={styles.label}>Something that came to mind</span>

          <h3 className={styles.title}>
            Never again think about how far they are.
          </h3>

          <p className={styles.body}>
            What if Google Maps could alert me when they're near?
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

        <div className={styles.imgCol}>
          {!isOpen && (
            <motion.div
              layoutId={VIDEO_LAYOUT_ID}
              className={styles.phone}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => { track('cta_click', { label: 'proximity_moment_open' }); setIsOpen(true); }}
              aria-label="Open video"
            >
              <video
                className={styles.screen}
                src="/VIDEOS/proximity-web.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </motion.div>
          )}
          <div className={`${styles.shadow} ${isOpen ? styles.shadowHidden : ''}`} aria-hidden="true" />
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
              src="/VIDEOS/proximity-web.mp4"
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
