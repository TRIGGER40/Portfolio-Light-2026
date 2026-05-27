import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './SeeWorksCard.module.css';

const POLAROIDS = [
  {
    src: '/Projectcard-images/ALMVC hero image.png',
    alt: 'Adobe Connect',
    isMain: false,
    rotate: -7, x: -68,
    spreadX: -88, spreadY: -60, spreadR: -16,
  },
  {
    src: '/Projectcard-images/quiz pod.png',
    alt: 'Quiz Pod',
    isMain: true,
    rotate: 1, x: 0,
    spreadX: 0, spreadY: -80, spreadR: 0,
  },
  {
    src: '/Projectcard-images/joining screen.png',
    alt: 'Joining Experience',
    isMain: false,
    rotate: 7, x: 68,
    spreadX: 88, spreadY: -60, spreadR: 15,
  },
];

export function SeeWorksCard() {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => navigate('/', { state: { scrollTo: 'work' } })}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/', { state: { scrollTo: 'work' } })}
          aria-label="View my works"
          style={{ cursor: 'pointer' }}
        >
          {/* Text */}
          <div className={styles.textCol}>
            <span className={styles.label}>My work</span>
            <h3 className={styles.title}>The work behind<br />the thinking</h3>
            <p className={styles.desc}>
              From enterprise AI workflows to design systems and zero-to-one products. See the
              cases, decisions, and outcomes that define how I design.
            </p>
            <div className={styles.ctaRow}>
              <button
                className="btn btn-secondary"
                onClick={e => { e.stopPropagation(); navigate('/', { state: { scrollTo: 'work' } }); }}
              >
                View works
              </button>
              <button
                className={styles.ctaSecondary}
                onClick={e => { e.stopPropagation(); navigate('/ask'); }}
              >
                <span className={styles.sparkle}>✦</span>
                Ask AI about me
              </button>
            </div>
          </div>

          {/* Polaroid cluster */}
          <div className={styles.polaroidCluster}>
            {POLAROIDS.map((p, i) => (
              <div
                key={i}
                className={`${styles.polaroid}${p.isMain ? ` ${styles.polaroidMain}` : ''}`}
                style={{
                  '--rotate': `${p.rotate}deg`,
                  '--x': `${p.x}px`,
                  '--spread-x': `${p.spreadX}px`,
                  '--spread-y': `${p.spreadY}px`,
                  '--spread-r': `${p.spreadR}deg`,
                  zIndex: p.isMain ? 3 : i === 0 ? 2 : 1,
                } as React.CSSProperties}
              >
                <div className={styles.polaroidInner}>
                  <img src={p.src} alt={p.alt} className={styles.polaroidImg} draggable={false} />
                </div>
                <div className={styles.polaroidBottom} />
              </div>
            ))}
            <div className={styles.clusterGlow} aria-hidden />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
