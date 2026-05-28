import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CASE_STUDIES, getProjectRoute } from '../data/portfolioData';
import { saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import styles from './Work.module.css';
import { track } from '../lib/analytics';
import { ImgSkeleton } from './ImgSkeleton';

const FEATURED_IDS = ['almvc', 'event-joining', 'bizongo-qc', 'quiz-pod', 'bizongo-ecom'];

const COMPANY_LOGOS: Record<string, string> = {
  'Adobe': '/Adobe.webp',
  'YUJ Designs': '/YUJ.svg',
  'Bizongo': '/Bizongo.webp',
};

const CATEGORY_COLORS: Record<string, string> = {
  AI: 'var(--accent-violet)',
  Feature: 'var(--accent-blue)',
  UX: 'var(--accent-indigo)',
  'Design Systems': 'var(--accent-cyan)',
};

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
            Selected work
            <br />
            <span className="gradient-text">owned end to end</span>
          </h2>
          <p className={`text-body ${styles.subtitle}`}>
            5 projects from 20+, each chosen for problem complexity, depth of ownership, and measurable outcome.
          </p>
        </motion.div>

        <div className={styles.grid}>
          {featured.map((project, i) => {
            const accentColor = CATEGORY_COLORS[project.category] || 'var(--accent-indigo)';
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
                whileHover={{ scale: 1.02, boxShadow: '0 20px 60px rgba(0, 0, 0, 0.10), 0 4px 24px rgba(0, 0, 0, 0.07)' }}
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
                      src={project.thumbnail ? `/${project.thumbnail}` : `/images/case-studies/${project.id}.webp`}
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
                    {COMPANY_LOGOS[project.company] && (
                      <img
                        src={COMPANY_LOGOS[project.company]}
                        alt=""
                        aria-hidden="true"
                        className={styles.companyLogo}
                      />
                    )}
                    <span className={styles.company}>{project.company}</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.time}>{project.timeFrame}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.problem}>{project.opportunity}</p>
                  <div className={styles.bodyFooter}>
                    <div className={styles.tags}>
                      {project.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
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
            Browse all case studies
            <i className="bi bi-arrow-right" style={{ fontSize: '14px' }} aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
