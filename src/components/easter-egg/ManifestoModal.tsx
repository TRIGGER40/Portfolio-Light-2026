import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEasterEgg } from '../../context/EasterEggContext';
import styles from './ManifestoModal.module.css';

const PRINCIPLES = [
  {
    num: '01',
    headline: 'Always start with the user',
    body: 'Great products begin with empathy. Understand behaviors, motivations, frustrations, and context before designing solutions.',
  },
  {
    num: '02',
    headline: 'Ask your "why"s',
    body: 'Challenge assumptions relentlessly. Every interaction, feature, and decision should exist for a meaningful reason.',
  },
  {
    num: '03',
    headline: 'Design for scalability',
    body: 'Design systems, workflows, and experiences should evolve gracefully as products, teams, and users grow.',
  },
  {
    num: '04',
    headline: 'Use AI as a prime tool',
    body: 'AI is not a replacement for thinking. It is a force multiplier for exploration, speed, iteration, and creativity.',
  },
  {
    num: '05',
    headline: 'Collaborate extensively',
    body: 'Strong products are built through shared thinking. Work closely with engineering, product, research, and business teams to create aligned experiences.',
  },
  {
    num: '06',
    headline: "Don't limit learning to design",
    body: 'Great designers learn from psychology, storytelling, systems thinking, business, technology, architecture, cinema, and human behavior.',
  },
];

export function ManifestoModal() {
  const { manifestoOpen, closeManifesto } = useEasterEgg();

  useEffect(() => {
    if (manifestoOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [manifestoOpen]);

  useEffect(() => {
    if (!manifestoOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') closeManifesto(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [manifestoOpen, closeManifesto]);

  return (
    <AnimatePresence>
      {manifestoOpen && (
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={closeManifesto}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 12, scale: 0.98  }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label="Midhun's design manifesto"
          >
            {/* Close */}
            <button className={styles.closeBtn} onClick={closeManifesto} aria-label="Close">
              <i className="bi bi-x-lg" aria-hidden="true" />
            </button>

            {/* Label */}
            <span className={styles.label}>Hidden reward</span>

            {/* Title */}
            <h2 className={styles.title}>My Design Manifesto</h2>

            <p className={styles.preamble}>
              A set of principles I return to when the work gets unclear.
            </p>

            <div className={styles.divider} />

            {/* Principles */}
            <ol className={styles.list}>
              {PRINCIPLES.map((p, i) => (
                <motion.li
                  key={p.num}
                  className={styles.item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={styles.itemNum}>{p.num}</span>
                  <div className={styles.itemText}>
                    <strong className={styles.itemHeadline}>{p.headline}</strong>
                    <span className={styles.itemBody}>{p.body}</span>
                  </div>
                </motion.li>
              ))}
            </ol>

            <div className={styles.divider} />

            {/* Signature */}
            <p className={styles.signature}>
              If you're reading this, you were curious enough to look deeper.
              <br />
              That's the only prerequisite for great design.
            </p>
            <p className={styles.author}>Midhun Krishnakumar</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
