import { motion } from 'framer-motion';
import styles from './CommunityCard.module.css';

export function CommunityCard() {
  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Left: text ── */}
          <div className={styles.textCol}>
            <span className={styles.label}>Community</span>

            <h3 className={styles.title}>
              Building community
              <br />
              <span className={styles.titleAccent}>through recognition</span>
            </h3>

            <p className={styles.body}>
              I thrive in positive, collaborative environments and genuinely care about workplace
              culture. I built a peer-to-peer recognition platform to make appreciation an organic
              part of everyday work, not just formal reviews, helping teams celebrate each other
              and build a more connected culture.
            </p>

            <a
              href="https://trigger40.github.io/Appreciation-cards/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              Appreciate your colleague
              <i className="bi bi-arrow-up-right" style={{ fontSize: '13px' }} aria-hidden="true" />
            </a>
          </div>

          {/* ── Right: image ── */}
          <div className={styles.imgCol}>
            <div className={styles.imgFrame}>
              <img
                src="/Appreciaition cards/Appreciation-cards.png"
                alt="Peer-to-peer appreciation cards platform"
                className={styles.img}
                loading="lazy"
              />
              <div className={styles.imgGlow} aria-hidden />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
