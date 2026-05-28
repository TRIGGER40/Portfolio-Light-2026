import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { GoBackButton } from '../components/GoBackButton';
import { useScrollRestoration, saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import { CASE_STUDIES, getProjectRoute } from '../data/portfolioData';
import styles from './AllWorksPage.module.css';
import { ImgSkeleton } from '../components/ImgSkeleton';


const COMPANY_LOGOS: Record<string, string> = {
  'Adobe':       '/Adobe.webp',
  'Bizongo':     '/Bizongo.webp',
  'YUJ Designs': '/YUJ.svg',
};

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

export function AllWorksPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyFilter = searchParams.get('company');

  useScrollRestoration();

  const featuredProjects = CASE_STUDIES.filter(cs =>
    cs.featured && (companyFilter ? cs.company === companyFilter : true)
  );
  const otherProjects = CASE_STUDIES.filter(cs =>
    !cs.featured && (companyFilter ? cs.company === companyFilter : true)
  );

  const totalCount = featuredProjects.length + otherProjects.length;

  return (
    <>
      <BackgroundGlow />
      <main className={styles.page}>

        {/* ── Header ── */}
        <section className={styles.header}>
          <div className="container">
            <GoBackButton className={styles.backBtn} fallback="/" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {!companyFilter && <span className="section-label">Portfolio</span>}
              <h1 className={styles.pageTitle}>
                {companyFilter ? `${companyFilter} work` : 'All work'}
                <span className={styles.titleCount}>{totalCount} projects</span>
              </h1>
              <p className={styles.pageSubtitle}>
                {companyFilter
                  ? `All projects from my time at ${companyFilter}.`
                  : 'Selected projects across product design, AI, systems, and more.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── Featured case studies ── */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Featured case studies</span>
              <span className={styles.sectionCount}>{featuredProjects.length}</span>
            </div>
            <div className={styles.featuredGrid}>
              {featuredProjects.map((cs, i) => {
                const color = CATEGORY_COLORS[cs.category] || 'var(--accent-indigo)';
                const route = getProjectRoute(cs.id);
                return (
                  <motion.div
                    key={cs.id}
                    className={`${styles.featuredCard} bulge`}
                    onClick={() => { saveScrollBeforeLeave(); navigate(route); }}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.featuredImgWrap}>
                      <ImgSkeleton
                        src={`/${cs.thumbnail}`}
                        alt={cs.title}
                        className={styles.featuredImg}
                      />
                      <div className={styles.imgOverlay} />
                      <span className={styles.badge} style={{ '--badge-color': color } as React.CSSProperties}>
                        {cs.category}
                      </span>
                    </div>
                    <div className={styles.featuredBody}>
                      <div className={styles.featuredMeta}>
                        {COMPANY_LOGOS[cs.company] && (
                          <img src={COMPANY_LOGOS[cs.company]} alt="" aria-hidden="true" className={styles.companyLogo} />
                        )}
                        <span className={styles.company}>{cs.company}</span>
                        <span className={styles.dot}>·</span>
                        <span className={styles.time}>{displayTimeFrame(cs.timeFrame)}</span>
                      </div>
                      <h3 className={styles.featuredTitle}>{cs.title}</h3>
                      <p className={styles.featuredDesc}>{cs.cardDesc}</p>
                      <div className={styles.featuredFooter}>
                        <span className={styles.metricPill}>{cs.metric}</span>
                        <span className={styles.cta}>
                          View case study
                          <i className="bi bi-arrow-up-right" style={{ fontSize: '12px' }} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Other works ── */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <span className={styles.sectionLabel}>Other works</span>
              <span className={styles.sectionCount}>{otherProjects.length}</span>
            </div>
            <div className={styles.otherGrid}>
              {otherProjects.map((cs, i) => {
                const color = CATEGORY_COLORS[cs.category] || 'var(--accent-indigo)';
                return (
                  <motion.div
                    key={cs.id}
                    className={`${styles.otherCard} bulge`}
                    onClick={() => { saveScrollBeforeLeave(); navigate(getProjectRoute(cs.id)); }}
                    style={{ cursor: 'pointer' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.otherImgWrap}>
                      <ImgSkeleton
                        src={`/${cs.thumbnail}`}
                        alt={cs.title}
                        className={styles.otherImg}
                      />
                      <div className={styles.imgOverlay} />
                      <span className={styles.badge} style={{ '--badge-color': color } as React.CSSProperties}>
                        {cs.category}
                      </span>
                    </div>
                    <div className={styles.otherBody}>
                      <div className={styles.featuredMeta}>
                        {COMPANY_LOGOS[cs.company] && (
                          <img src={COMPANY_LOGOS[cs.company]} alt="" aria-hidden="true" className={styles.companyLogo} />
                        )}
                        <span className={styles.company}>{cs.company}</span>
                        <span className={styles.dot}>·</span>
                        <span className={styles.time}>{displayTimeFrame(cs.timeFrame)}</span>
                      </div>
                      <h3 className={styles.otherTitle}>{cs.title}</h3>
                      <div className={styles.otherFooter}>
                        <span className={styles.metricPill}>{cs.metric}</span>
                        <span className={styles.ctaExternal}>
                          View project
                          <i className="bi bi-arrow-up-right" style={{ fontSize: '11px' }} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
