import { motion } from 'framer-motion';
import { AWARDS, CAREER_EVOLUTION, MENTORSHIP } from '../data/portfolioData';
import styles from './About.module.css';

const STRENGTHS = [
  {
    icon: '⬡',
    title: 'AI-first design',
    desc: 'Embedding generative AI and intelligent defaults into products, not as features, but as design philosophy.',
  },
  {
    icon: '◈',
    title: 'Enterprise UX at scale',
    desc: 'Complex workflows, 1000+ users, real constraints. Making dense systems feel effortless.',
  },
  {
    icon: '◻',
    title: 'Design systems',
    desc: 'Built and scaled systems from scratch and extended Adobe Spectrum. Reuse, consistency, velocity.',
  },
  {
    icon: '◇',
    title: 'Engineering collaboration',
    desc: 'Ships with Cursor + Claude Code. Reviews fidelity in DevTools. Closes the design–dev gap.',
  },
];

export function About() {
  const recentAwards = AWARDS.slice(0, 4);

  return (
    <section className="section" id="about">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">About</span>
          <h2 className={`text-display ${styles.title}`}>
            Designer, builder,
            <br />
            <span className="gradient-text">AI-first thinker</span>
          </h2>
        </motion.div>

        <div className={styles.twoCol}>
          {/* Left: narrative + career path */}
          <motion.div
            className={styles.leftCol}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.narrative}>
              <p className={styles.lead}>
                I'm Midhun, a product designer who started with computer science, built physical
                products at NID, and spent the last 7 years designing enterprise and AI-native
                digital experiences.
              </p>
              <p className={styles.body}>
                Currently leading design for Adobe Connect at Adobe, embedding AI into collaboration
                workflows, shipping features that measurably reduce friction, and maintaining the
                design language across a platform used by thousands daily.
              </p>
              <p className={styles.body}>
                I work at the intersection of design craft and AI tooling, using Cursor and Claude
                to ship fast, think in systems, and stay close to implementation quality.
              </p>
            </div>

            {/* Career timeline */}
            <div className={styles.timeline}>
              <p className="text-label" style={{ marginBottom: '20px' }}>Career arc</p>
              {CAREER_EVOLUTION.slice(1).map((stage, i) => (
                <motion.div
                  key={stage.id}
                  className={styles.timelineItem}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                >
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineRow}>
                      <span className={styles.timelineStage}>{stage.stage}</span>
                      <span className={styles.timelinePeriod}>{stage.period}</span>
                    </div>
                    <p className={styles.timelineFocus}>{stage.focus}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Mentorship */}
            <div className={styles.mentorRow}>
              {MENTORSHIP.map((m) => (
                <div key={m.id} className={`glass-card ${styles.mentorCard}`}>
                  <div className={styles.mentorRole}>{m.role}</div>
                  <div className={styles.mentorOrg}>{m.org}</div>
                  <div className={styles.mentorPeriod}>{m.period}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: strengths + awards */}
          <motion.div
            className={styles.rightCol}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Strengths */}
            <div className={styles.strengthsBlock}>
              <p className="text-label" style={{ marginBottom: '20px' }}>Core strengths</p>
              <div className={styles.strengths}>
                {STRENGTHS.map((s, i) => (
                  <motion.div
                    key={s.title}
                    className={`glass-card ${styles.strengthCard}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5 }}
                  >
                    <span className={styles.strengthIcon}>{s.icon}</span>
                    <div>
                      <div className={styles.strengthTitle}>{s.title}</div>
                      <div className={styles.strengthDesc}>{s.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div className={styles.awardsBlock}>
              <p className="text-label" style={{ marginBottom: '20px' }}>Recognition</p>
              <div className={styles.awards}>
                {recentAwards.map((award) => (
                  <div key={award.id} className={styles.awardItem}>
                    <div className={styles.awardIcon}>★</div>
                    <div className={styles.awardInfo}>
                      <div className={styles.awardTitle}>{award.title}</div>
                      <div className={styles.awardMeta}>
                        {award.issuer} · {award.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {AWARDS.length > 4 && (
                <p className={styles.moreAwards}>+{AWARDS.length - 4} more awards</p>
              )}
            </div>

            {/* Tools */}
            <div className={styles.toolsBlock}>
              <p className="text-label" style={{ marginBottom: '14px' }}>Tools</p>
              <div className={styles.tools}>
                {['Figma', 'Cursor', 'Claude Code', 'GitHub', 'Vercel', 'DevTools', 'Adobe XD'].map((t) => (
                  <span key={t} className={styles.tool}>{t}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
