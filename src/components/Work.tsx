import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CASE_STUDIES, getProjectRoute } from '../data/portfolioData';
import { saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import styles from './Work.module.css';
import { track } from '../lib/analytics';
import { ImgSkeleton } from './ImgSkeleton';

const FEATURED_IDS = ['almvc', 'event-joining', 'bizongo-qc', 'quiz-pod', 'bizongo-ecom'];

const CATEGORY_COLORS: Record<string, string> = {
  AI: 'var(--accent-violet)',
  Feature: 'var(--accent-blue)',
  UX: 'var(--accent-indigo)',
  'Design Systems': 'var(--accent-cyan)',
};

// Pull the primary metric value and label apart for big-number display
function parseMetric(raw: string): { value: string; label: string } {
  // e.g. "40% reduction in..." or "₹2Cr+ in PPE kit sales"
  const match = raw.match(/^([₹$€]?[\d.]+[A-Za-z%×x+]*)\s+(.+)$/);
  if (match) return { value: match[1], label: match[2] };
  return { value: '', label: raw };
}

export function Work() {
  const navigate = useNavigate();
  const featured = CASE_STUDIES.filter((cs) => FEATURED_IDS.includes(cs.id));
  const firstClickFired = useRef(false);
  const hoverStart = useRef<Record<string, number>>({});

  return (
    <section className="section" id="work">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 44, filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Selected Work</span>
          <h2 className={`text-display ${styles.title}`}>
            High-impact projects
            <br />
            <span className="gradient-text">that moved the needle</span>
          </h2>
          <p className={`text-body ${styles.subtitle}`}>
            4 projects out of 15+, chosen for clarity of problem, strength of decision-making,
            and measurable outcomes.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {featured.map((project, i) => {
            const accentColor = CATEGORY_COLORS[project.category] || 'var(--accent-indigo)';
            const rawMetric = project.metrics?.[0] ?? null;
            const metric = rawMetric ? parseMetric(rawMetric) : null;

            const internalRoute = getProjectRoute(project.id);

            return (
              <motion.div
                key={project.id}
                id={project.id}
                className={`${styles.card} ${styles.cardClickable}`}
                onMouseEnter={() => { hoverStart.current[project.id] = Date.now(); }}
                onMouseLeave={() => {
                  const start = hoverStart.current[project.id];
                  if (start) {
                    const duration = Date.now() - start;
                    delete hoverStart.current[project.id];
                    if (duration > 300) track('project_hover', { id: project.id, title: project.title, duration });
                  }
                }}
                onClick={() => {
                  track('project_click', { id: project.id, title: project.title });
                  if (!firstClickFired.current) {
                    firstClickFired.current = true;
                  }
                  saveScrollBeforeLeave();
                  navigate(internalRoute);
                }}
                initial={{ opacity: 0, y: 56, rotate: 1.5 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(82, 84, 216, 0.14), 0 0 40px rgba(82, 84, 216, 0.12)' }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  opacity: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
                  y: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
                  rotate: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
                  scale: { duration: 0.15, ease: 'easeOut' },
                  boxShadow: { duration: 0.15, ease: 'easeOut' },
                }}
              >
                {/* Thumbnail */}
                <div className={styles.thumbnail}>
                  <div className={styles.imgWrap}>
                    <ImgSkeleton
                      src={project.thumbnail ? `/${project.thumbnail}` : `/images/case-studies/${project.id}.png`}
                      alt={project.title}
                      className={styles.img}
                      loading="lazy"
                    />
                  </div>
                  <div className={styles.thumbnailOverlay} />
                  <span
                    className={styles.badge}
                    style={{ '--badge-color': accentColor } as React.CSSProperties}
                  >
                    {project.category}
                  </span>
                </div>

                {/* Body */}
                <div className={styles.body}>
                  <div className={styles.number}>0{i + 1}</div>
                  <div className={styles.meta}>
                    <span className={styles.company}>{project.company}</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.time}>{project.timeFrame}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.problem}>{project.opportunity}</p>
                  <div className={styles.tags}>
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Aside */}
                <div className={styles.aside}>
                  {metric && (
                    <div className={styles.impact}>
                      {metric.value
                        ? <>
                            <span className={styles.impactValue}>
                              {metric.value.includes('%') ? `~${metric.value}` : metric.value}
                            </span>
                            <span className={styles.impactLabel}>{metric.label}</span>
                          </>
                        : <span className={styles.impactValue}>{metric.label}</span>
                      }
                    </div>
                  )}
                  <button
                    className={styles.cta}
                    onClick={(e) => {
                      e.stopPropagation();
                      saveScrollBeforeLeave();
                      navigate(internalRoute);
                    }}
                  >
                    View case study
                    <i className="bi bi-arrow-right" style={{ fontSize: '13px' }} aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className={styles.allWorksRow}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/work/all')}
          >
            View all work on portfolio
            <i className="bi bi-arrow-right" style={{ fontSize: '14px' }} aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
