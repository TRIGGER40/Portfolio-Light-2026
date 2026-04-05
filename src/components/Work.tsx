import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CASE_STUDIES } from '../data/portfolioData';
import { saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import styles from './Work.module.css';

const INTERNAL_ROUTES: Record<string, string> = {
  'quiz-pod':      '/work/quiz',
  'event-joining': '/work/joining',
  'bizongo-qc':    '/work/qc',
  'bizongo-ecom':  '/work/ppe',
};

const FEATURED_IDS = ['gen-ai', 'event-joining', 'bizongo-qc', 'quiz-pod', 'bizongo-ecom'];

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

  return (
    <section className="section" id="work">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
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

            const internalRoute = INTERNAL_ROUTES[project.id];

            return (
              <motion.div
                key={project.id}
                id={project.id}
                className={`${styles.card} ${internalRoute ? styles.cardClickable : ''}`}
                onClick={() => { if (internalRoute) { saveScrollBeforeLeave(); navigate(internalRoute); } }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Thumbnail */}
                <div className={styles.thumbnail}>
                  <img
                    src={project.thumbnail ? `/${project.thumbnail}` : `/images/case-studies/${project.id}.png`}
                    alt={project.title}
                    className={styles.img}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
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
                  <p className={styles.problem}>
                    {project.opportunity.length > 140
                      ? project.opportunity.slice(0, 137) + '…'
                      : project.opportunity}
                  </p>
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
                      <span className={styles.impactValue}>{metric.value}</span>
                      <span className={styles.impactLabel}>{metric.label}</span>
                    </div>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cta}
                      onClick={(e) => e.stopPropagation()}
                    >
                      View case study
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 10.5l8-8M4 2.5h6.5v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className={styles.allWorksRow}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/work/all')}
          >
            View all work on portfolio
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M9 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
