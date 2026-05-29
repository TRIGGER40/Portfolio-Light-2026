import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { GoBackButton } from '../components/GoBackButton';
import styles from './MinimalCaseStudyPage.module.css';
import { ImgSkeleton } from '../components/ImgSkeleton';
import { Loader } from '../components/Loader';
import { CASE_STUDIES } from '../data/portfolioData';

const CATEGORY_COLORS: Record<string, string> = {
  AI:                  'var(--accent-violet)',
  '0→1 Product':       'var(--accent-violet)',
  Feature:             'var(--accent-blue)',
  'Feature Design':    'var(--accent-blue)',
  UX:                  'var(--accent-indigo)',
  'UX Redesign':       'var(--accent-indigo)',
  'Workflow Redesign': 'var(--accent-indigo)',
  'B2B Platform':      'var(--accent-indigo)',
  'Design Systems':    'var(--accent-cyan)',
  Mentorship:          'var(--accent-indigo)',
  Internship:          'var(--accent-blue)',
};

/** Strip sprint prefix from timeFrame, e.g. "4 Sprints; 8 Weeks" → "8 Weeks" */
function displayTimeFrame(tf: string): string {
  return tf.includes(';') ? tf.split(';')[1].trim() : tf;
}

export function MinimalCaseStudyPage() {
  const { id } = useParams<{ id: string }>();

  const project = CASE_STUDIES.find(cs => cs.id === id);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [id]);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <Loader size={32} />
        <p>Project not found.</p>
        <GoBackButton fallback="/work/all" label="Back to all work" />
      </div>
    );
  }

  const color = CATEGORY_COLORS[project.category] || 'var(--accent-indigo)';
  const heroImage = project.heroImage ?? (project.thumbnail ? `/${project.thumbnail}` : '');
  const backTo = project.backTo ?? '/work/all';

  return (
    <>
      <BackgroundGlow />
      <main className={styles.page}>

        {/* ── Hero: two-column ── */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <GoBackButton className={styles.backBtn} fallback={backTo} />

            <div className={styles.heroLayout}>
              {/* Left: text */}
              <motion.div
                className={styles.heroText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.heroMeta}>
                  <span className={styles.badge} style={{ '--badge-color': color } as React.CSSProperties}>
                    {project.category}
                  </span>
                  <span className={styles.company}>{project.company}</span>
                  <span className={styles.dot}>·</span>
                  <span className={styles.timeFrame}>{displayTimeFrame(project.timeFrame)}</span>
                </div>

                <h1 className={styles.heroTitle}>{project.title}</h1>
                <p className={styles.heroOpportunity}>{project.opportunity}</p>

                <span className={styles.metricPill}>{project.metric}</span>
              </motion.div>

              {/* Right: framed image */}
              <motion.div
                className={styles.heroImgFrame}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <ImgSkeleton
                  src={heroImage}
                  alt={project.title}
                  className={styles.heroImg}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── View Works CTA (only when viewWorksLink is set) ── */}
        {project.viewWorksLink && (
          <section className={styles.viewWorksSection}>
            <div className={styles.container}>
              <motion.a
                href={project.viewWorksLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewWorksCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className={styles.viewWorksLeft}>
                  <span className={styles.viewWorksLabel}>Figma Prototype</span>
                  <h3 className={styles.viewWorksTitle}>View the visual design works</h3>
                  <p className={styles.viewWorksDesc}>
                    Explore the full collection of visual design projects: UI revamps, component evolution, and design system work at Adobe Connect.
                  </p>
                </div>
                <div className={styles.viewWorksRight}>
                  <span className={styles.viewWorksBtn}>
                    Open in Figma
                    <i className="bi bi-arrow-up-right" style={{ fontSize: '14px' }} aria-hidden="true" />
                  </span>
                </div>
              </motion.a>
            </div>
          </section>
        )}

        {/* ── Outcomes ── */}
        <section className={styles.outcomesSection}>
          <div className={styles.container}>
            <div className={styles.outcomesGrid}>
              <div className={styles.outcomesLeft}>
                <span className={styles.sectionLabel}>Outcomes</span>
                <h2 className={styles.outcomesTitle}>What this shipped</h2>
              </div>
              <ul className={styles.outcomesList}>
                {project.outcomes.map((outcome, i) => (
                  <motion.li
                    key={i}
                    className={styles.outcomeItem}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className={styles.outcomeBullet}>↳</span>
                    <span>{outcome}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className={styles.tagsRow}>
              {project.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom bar ── */}
        <section className={styles.bottomBar}>
          <div className={styles.container}>
            <GoBackButton className={styles.backBtnBottom} fallback={backTo} />
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
