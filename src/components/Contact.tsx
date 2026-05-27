import { motion } from 'framer-motion';
import { CONTACT } from '../data/portfolioData';
import styles from './Contact.module.css';
import { track } from '../lib/analytics';

const tilesVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const tileVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const loadResumePdf = () => import('../lib/resumePdf');

export function Contact() {
  return (
    <section className="section" id="contact">
      <div className="container">
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 56, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
          <motion.div
            className={styles.tiles}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={tilesVariants}
          >
            <motion.div variants={tileVariants}>
              <a href={`mailto:${CONTACT.email}`} className={`glass-card ${styles.tile}`}>
                <div className={styles.tileIcon}>
                  <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ width: '1em', height: '1em' }}>
                    <rect width="24" height="24" opacity="0"/>
                    <path d="M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-.67 2L12 10.75 5.67 6zM19 18H5a1 1 0 0 1-1-1V7.25l7.4 5.55a1 1 0 0 0 .6.2 1 1 0 0 0 .6-.2L20 7.25V17a1 1 0 0 1-1 1z"/>
                  </svg>
                </div>
                <div className={styles.tileBody}>
                  <div className={styles.tileLabel}>Email</div>
                  <div className={styles.tileValue}>{CONTACT.email}</div>
                </div>
                <div className={styles.tileArrow}>→</div>
              </a>
            </motion.div>

            <motion.div variants={tileVariants}>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`glass-card ${styles.tile}`}
                onClick={() => track('linkedin_click', {})}
              >
                <div className={styles.tileIcon}>in</div>
                <div className={styles.tileBody}>
                  <div className={styles.tileLabel}>LinkedIn</div>
                  <div className={styles.tileValue}>midhunkrishnakumar</div>
                </div>
                <div className={styles.tileArrow}>→</div>
              </a>
            </motion.div>

            <motion.div variants={tileVariants}>
              <button
                className={`glass-card ${styles.tile}`}
                onClick={() => { track('resume_click', {}); loadResumePdf().then(({ downloadResumePdf }) => downloadResumePdf()); }}
              >
                <div className={styles.tileIcon}>↓</div>
                <div className={styles.tileBody}>
                  <div className={styles.tileLabel}>Resume</div>
                  <div className={styles.tileValue}>Download PDF</div>
                </div>
                <div className={styles.tileArrow}>→</div>
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
