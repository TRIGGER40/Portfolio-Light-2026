import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ExperimentModal.module.css';

export type Experiment = {
  num: string;
  title: string;
  desc: string;
  tag: string;
  thumb: { type: 'video' | 'img'; src: string };
  portrait?: boolean;
  ctaLink?: string;
  ctaLabel?: string;
};

interface Props {
  experiments: Experiment[];
  activeIndex: number;
  onClose: () => void;
  onSelect: (i: number) => void;
}

export function ExperimentModal({ experiments, activeIndex, onClose, onSelect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const exp = experiments[activeIndex];

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onSelect((activeIndex + 1) % experiments.length);
      if (e.key === 'ArrowLeft')  onSelect((activeIndex - 1 + experiments.length) % experiments.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, experiments.length, onClose, onSelect]);

  // Replay video when switching
  useEffect(() => {
    videoRef.current?.load();
    videoRef.current?.play().catch(() => {});
  }, [activeIndex]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const prev = useCallback(() => onSelect((activeIndex - 1 + experiments.length) % experiments.length), [activeIndex, experiments.length, onSelect]);
  const next = useCallback(() => onSelect((activeIndex + 1) % experiments.length), [activeIndex, experiments.length, onSelect]);

  return (
    <AnimatePresence>
      <motion.div
        className={styles.backdrop}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      >
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          onClick={e => e.stopPropagation()}
        >
          {/* ── Top bar ── */}
          <div className={styles.topBar}>
            <div className={styles.topLeft}>
              <span className={styles.num}>{exp.num}</span>
              <div className={styles.topMeta}>
                <h2 className={styles.title}>{exp.title}</h2>
                <span className={styles.tag}>{exp.tag}</span>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <i className="bi bi-x-lg" />
            </button>
          </div>

          {/* ── Video / image ── */}
          <div className={`${styles.mediaWrap} ${exp.portrait ? styles.portrait : ''}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className={styles.mediaInner}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {exp.thumb.type === 'video' ? (
                  <video
                    ref={videoRef}
                    src={exp.thumb.src}
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={styles.video}
                  />
                ) : (
                  <img src={exp.thumb.src} alt={exp.title} className={styles.video} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Side nav arrows */}
            <button className={`${styles.navArrow} ${styles.navPrev}`} onClick={prev} aria-label="Previous">
              <i className="bi bi-chevron-left" />
            </button>
            <button className={`${styles.navArrow} ${styles.navNext}`} onClick={next} aria-label="Next">
              <i className="bi bi-chevron-right" />
            </button>
          </div>

          {/* ── Description ── */}
          <div className={styles.descRow}>
            <p className={styles.desc}>{exp.desc}</p>
            {exp.ctaLink && (
              <Link to={exp.ctaLink} className={styles.ctaBtn}>
                <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
                {exp.ctaLabel ?? 'Explore'}
              </Link>
            )}
          </div>

          {/* ── Switcher tabs ── */}
          <div className={styles.tabs}>
            {experiments.map((e, i) => (
              <button
                key={e.num}
                className={`${styles.tab} ${i === activeIndex ? styles.tabActive : ''}`}
                onClick={() => onSelect(i)}
              >
                <div className={styles.tabThumb}>
                  {e.thumb.type === 'video'
                    ? <video src={e.thumb.src} muted playsInline preload="metadata" className={styles.tabVideo} />
                    : <img src={e.thumb.src} alt={e.title} className={styles.tabVideo} />
                  }
                </div>
                <span className={styles.tabTitle}>{e.title}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
