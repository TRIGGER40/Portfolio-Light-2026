import { motion } from 'framer-motion';
import styles from './FigmaAICard.module.css';

export function FigmaAICard() {
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
          {/* ── Right: image ── */}
          <div className={styles.imgCol}>
            <div className={styles.imgFrame}>
              <img
                src="/Record player/recordplayer.png"
                alt="Retro cassette player built with Claude and Figma MCP"
                className={styles.img}
                loading="lazy"
              />
              <div className={styles.imgGlow} aria-hidden />
            </div>
          </div>

          {/* ── Left: text ── */}
          <div className={styles.textCol}>
            <span className={styles.label}>AI + Design</span>

            <h3 className={styles.title}>
              Testing the future of
              <br />
              <span className={styles.titleAccent}>AI + Figma workflows</span>
            </h3>

            <p className={styles.body}>
              I enjoy experimenting with how AI can improve design-to-development workflows and
              make prototyping more intelligent. One project was a retro-inspired digital cassette
              player built using Claude alongside structured Figma components, testing how
              effectively Figma MCP interprets designs when components are systematically named
              with clear descriptions of their intended functionality and usage.
            </p>

            <a
              href="https://project-mikyb.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cta}
            >
              See the experiment
              <i className="bi bi-arrow-up-right" style={{ fontSize: '13px' }} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
