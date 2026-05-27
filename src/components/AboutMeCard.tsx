import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styles from './AboutMeCard.module.css';

const POLAROIDS = [
  { src: '/About me/about-photo.png', alt: 'Midhun',                  isMain: false, rotate: -8, x: -72, spreadX: -92, spreadY: -62, spreadR: -18 },
  { src: '/About me midhun.png',      alt: 'Midhun Krishnakumar',     isMain: true,  rotate:  1, x:   0, spreadX:   0, spreadY: -88, spreadR:   0 },
  { src: '/About me/Formula 1.png',   alt: 'Midhun at Formula 1',     isMain: false, rotate:  7, x:  72, spreadX:  92, spreadY: -62, spreadR:  16 },
];

export function AboutMeCard() {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 64, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => navigate('/about')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && navigate('/about')}
          aria-label="Go to About page"
        >
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

            {/* Glow that intensifies on hover */}
            <div className={styles.clusterGlow} aria-hidden />
          </div>

          {/* Text */}
          <div className={styles.textCol}>
            <span className={styles.label}>Outside of work</span>
            <h3 className={styles.title}>There's more to me<br />than the work</h3>
            <p className={styles.desc}>
              Curious what keeps me grounded, inspired, and building outside of product design?
              Click to see the person behind the portfolio.
            </p>
            <button className={`btn btn-primary ${styles.ctaBtn}`}>
              See more about me
              <i className="bi bi-arrow-right" style={{ fontSize: '13px' }} aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
