import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import { track } from '../lib/analytics';
import styles from './BookSessionCard.module.css';

// Single kill-switch for mentorship surfaces (this card + related CTAs
// elsewhere, e.g. PersonalSection). Flip back to `true` to re-enable.
export const MENTORSHIP_ENABLED = false;

const PHOTOS = [
  {
    src: '/About me/Workshop facilitation.webp',
    alt: 'Midhun facilitating a design workshop',
    rotate: -5, x: -85,
    spreadX: -95, spreadY: -10, spreadR: -8,
  },
  {
    src: '/About me/Work Presentations.webp',
    alt: 'Midhun presenting to a team',
    rotate: 5, x: 85,
    spreadX: 95, spreadY: -10, spreadR: 8,
  },
];

export function BookSessionCard() {
  const navigate = useNavigate();

  function goToBooking(label: string) {
    track('cta_click', { label });
    saveScrollBeforeLeave();
    navigate('/book-a-session');
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => goToBooking('Book a session card')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && goToBooking('Book a session card')}
          aria-label="Book a session with Midhun"
          style={{ cursor: 'pointer' }}
        >
          {/* Text */}
          <div className={styles.textCol}>
            <span className={styles.label}>Mentorship</span>
            <h3 className={styles.title}>Career move or<br />early-stage startup idea?</h3>
            <p className={styles.desc}>
              1:1 sessions for portfolio reviews, career pivots, and shaping early-stage
              startup ideas. 7+ years in the industry and 150+ hours spent mentoring
              designers, PMs, and founders across startups, agencies, and enterprises.
            </p>
            <div className={styles.ctaRow}>
              <button
                className={styles.ctaBtn}
                onClick={e => { e.stopPropagation(); goToBooking('Book a session button'); }}
              >
                Book a session with Midhun
                <i className="bi bi-arrow-right" style={{ fontSize: '13px' }} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Photo cluster */}
          <div className={styles.photoCluster}>
            {PHOTOS.map((p, i) => (
              <div
                key={i}
                className={styles.photo}
                style={{
                  '--rotate': `${p.rotate}deg`,
                  '--x': `${p.x}px`,
                  '--spread-x': `${p.spreadX}px`,
                  '--spread-y': `${p.spreadY}px`,
                  '--spread-r': `${p.spreadR}deg`,
                  zIndex: i + 1,
                } as React.CSSProperties}
              >
                <img src={p.src} alt={p.alt} className={styles.photoImg} draggable={false} />
              </div>
            ))}
            <div className={styles.clusterGlow} aria-hidden />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
