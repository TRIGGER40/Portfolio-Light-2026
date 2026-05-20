import { motion } from 'framer-motion';
import { CONTACT } from '../data/portfolioData';
import styles from './Contact.module.css';

const loadResumePdf = () => import('../lib/resumePdf');

export function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Glow orb behind */}
          <div className={styles.glow} />

          <span className="section-label">Get in Touch</span>

          <h2 className={`text-display ${styles.title}`}>
            Let's build something
            <br />
            <span className="gradient-text">meaningful together</span>
          </h2>

          <p className={styles.desc}>
            Open to senior design roles, AI-first product teams, and interesting collaborations.
            I respond within 48 hours.
          </p>

          {/* Contact tiles */}
          <div className={styles.tiles}>
            <a href={`mailto:${CONTACT.email}`} className={`glass-card ${styles.tile}`}>
              <div className={styles.tileIcon}>✉</div>
              <div className={styles.tileBody}>
                <div className={styles.tileLabel}>Email</div>
                <div className={styles.tileValue}>{CONTACT.email}</div>
              </div>
              <div className={styles.tileArrow}>→</div>
            </a>

            <a
              href={CONTACT.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={`glass-card ${styles.tile}`}
            >
              <div className={styles.tileIcon}>in</div>
              <div className={styles.tileBody}>
                <div className={styles.tileLabel}>LinkedIn</div>
                <div className={styles.tileValue}>midhunkrishnakumar</div>
              </div>
              <div className={styles.tileArrow}>→</div>
            </a>

            <button
              className={`glass-card ${styles.tile}`}
              onClick={() => loadResumePdf().then(({ downloadResumePdf }) => downloadResumePdf())}
            >
              <div className={styles.tileIcon}>↓</div>
              <div className={styles.tileBody}>
                <div className={styles.tileLabel}>Resume</div>
                <div className={styles.tileValue}>Download PDF</div>
              </div>
              <div className={styles.tileArrow}>→</div>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
