import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { GoBackButton } from '../components/GoBackButton';
import { useScrollRestoration, saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import styles from './AllWorksPage.module.css';

const INTERNAL_ROUTES: Record<string, string> = {
  'quiz-pod':      '/work/quiz',
  'event-joining': '/work/joining',
  'bizongo-qc':    '/work/qc',
  'bizongo-ecom':  '/work/ppe',
};

const CATEGORY_COLORS: Record<string, string> = {
  AI:               'var(--accent-violet)',
  Feature:          'var(--accent-blue)',
  UX:               'var(--accent-indigo)',
  'Design Systems': 'var(--accent-cyan)',
  Mentorship:       'var(--accent-indigo)',
  Internship:       'var(--accent-blue)',
};

const FEATURED = [
  {
    id: 'quiz-pod',
    title: 'Quick quizzing in Adobe Connect',
    company: 'Adobe', category: 'Feature', timeFrame: '3 Weeks',
    metric: '90% faster quiz creation',
    desc: 'A brand-new quiz pod built into Adobe Connect, letting hosts create and run quizzes in seconds.',
    thumbnail: 'quiz pod.png',
  },
  {
    id: 'event-joining',
    title: 'Enhancing joining experience',
    company: 'Adobe', category: 'UX', timeFrame: '8 Weeks',
    metric: '~50% faster device setup',
    desc: 'Redesigning the end-to-end joining flow to reduce friction at the most critical moment.',
    thumbnail: 'joining screen.png',
  },
  {
    id: 'bizongo-qc',
    title: 'Quality check made easy!',
    company: 'Bizongo', category: 'UX', timeFrame: '4 Weeks',
    metric: '~70% efficiency gain',
    desc: 'Redesigning the inward QC process to eliminate compounding inefficiencies at high-volume warehouses.',
    thumbnail: 'QC improvement.png',
  },
  {
    id: 'bizongo-ecom',
    title: 'Making PPE kits more accessible',
    company: 'Bizongo', category: 'UX', timeFrame: '4 Weeks',
    metric: '₹2Cr+ in sales',
    desc: 'A B2B platform that put Bizongo\'s supplier network to work during the COVID-19 PPE demand surge.',
    thumbnail: 'PPE.png',
  },
];

const OTHER_WORKS = [
  {
    id: 'gen-ai',
    title: 'Gen AI Explorations',
    company: 'Adobe', category: 'AI', timeFrame: '1 Week',
    metric: '40% less asset creation effort',
    thumbnail: 'images/case-studies/gen-ai.png',
  },
  {
    id: 'connect-homepage',
    title: 'Revamping Adobe Connect homepage',
    company: 'Adobe', category: 'UX', timeFrame: '16 Weeks',
    metric: '35% increase in engagement',
    thumbnail: 'images/case-studies/connect-homepage.png',
  },
  {
    id: 'adobe-visual-design',
    title: 'Visual design works at Adobe',
    company: 'Adobe', category: 'UX', timeFrame: 'Ongoing',
    metric: '100% of active users impacted',
    thumbnail: 'images/case-studies/adobe-visual-design.png',
  },
  {
    id: 'bizongo-ums',
    title: 'Managing users effectively',
    company: 'Bizongo', category: 'UX', timeFrame: '2 Weeks',
    metric: '50% faster user onboarding',
    thumbnail: 'images/case-studies/bizongo-ums.png',
  },
  {
    id: 'bizongo-artwork-flow',
    title: 'Seamless approval workflow creation',
    company: 'Bizongo', category: 'UX', timeFrame: '2 Weeks',
    metric: '60% less workflow setup time',
    thumbnail: 'images/case-studies/bizongo-artwork-flow.png',
  },
  {
    id: 'bizongo-contracts',
    title: 'Modular contract / T&C creation',
    company: 'Bizongo', category: 'UX', timeFrame: '2 Weeks',
    metric: '70% faster contract creation',
    thumbnail: 'images/case-studies/bizongo-contracts.png',
  },
  {
    id: 'yuj-heuristics',
    title: 'Heuristics Evaluation Improvement',
    company: 'YUJ Designs', category: 'UX', timeFrame: '2021',
    metric: '40% better heuristic scores',
    thumbnail: 'images/case-studies/yuj-heuristics.png',
  },
  {
    id: 'bizongo-design-system',
    title: 'Managing and updating design system',
    company: 'Bizongo', category: 'Design Systems', timeFrame: '1+ yr',
    metric: '50%+ reduction in feature dev time',
    thumbnail: 'images/case-studies/bizongo-design-system.png',
  },
  {
    id: 'nid-ui-ux-course',
    title: 'UI/UX Course & Workshops',
    company: 'NID Andhra Pradesh', category: 'Mentorship', timeFrame: 'Ongoing',
    metric: '30+ students mentored',
    thumbnail: 'images/case-studies/nid-ui-ux-course.png',
  },
  {
    id: 'iit-branding',
    title: 'Branding for Local Poultry Farmers',
    company: 'IIT Guwahati', category: 'Internship', timeFrame: '2 months',
    metric: 'Full brand identity delivered',
    thumbnail: 'images/case-studies/iit-branding.png',
  },
  {
    id: 'drdo-xctd',
    title: 'XCTD Probe Interface Design',
    company: 'NPOL DRDO', category: 'Internship', timeFrame: '2017',
    metric: 'Inducted design into Navy',
    thumbnail: 'images/case-studies/npol-ctd-probe.png',
  },
];

export function AllWorksPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyFilter = searchParams.get('company'); // e.g. "Adobe" | "Bizongo" | null

  useScrollRestoration();

  const filteredFeatured = companyFilter
    ? FEATURED.filter(p => p.company === companyFilter)
    : FEATURED;
  const filteredOther = companyFilter
    ? OTHER_WORKS.filter(p => p.company === companyFilter)
    : OTHER_WORKS;

  const totalCount = filteredFeatured.length + filteredOther.length;

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
              <span className="section-label">{companyFilter ? companyFilter : 'Portfolio'}</span>
              <h1 className={styles.pageTitle}>
                {companyFilter ? `${companyFilter} work` : 'All work'}
                <span className={styles.pageTitleAccent}> — {totalCount} projects</span>
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
              <span className={styles.sectionCount}>{filteredFeatured.length}</span>
            </div>
            <div className={styles.featuredGrid}>
              {filteredFeatured.map((p, i) => {
                const color = CATEGORY_COLORS[p.category] || 'var(--accent-indigo)';
                const route = INTERNAL_ROUTES[p.id];
                return (
                  <motion.div
                    key={p.id}
                    className={styles.featuredCard}
                    onClick={() => { if (route) { saveScrollBeforeLeave(); navigate(route); } }}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.featuredImgWrap}>
                      <img
                        src={`/${p.thumbnail}`}
                        alt={p.title}
                        className={styles.featuredImg}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className={styles.imgOverlay} />
                      <span className={styles.badge} style={{ '--badge-color': color } as React.CSSProperties}>
                        {p.category}
                      </span>
                    </div>
                    <div className={styles.featuredBody}>
                      <div className={styles.featuredMeta}>
                        <span className={styles.company}>{p.company}</span>
                        <span className={styles.dot}>·</span>
                        <span className={styles.time}>{p.timeFrame}</span>
                      </div>
                      <h3 className={styles.featuredTitle}>{p.title}</h3>
                      <p className={styles.featuredDesc}>{p.desc}</p>
                      <div className={styles.featuredFooter}>
                        <span className={styles.metricPill}>{p.metric}</span>
                        <span className={styles.cta}>
                          View case study
                          <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                            <path d="M2.5 10.5l8-8M4 2.5h6.5v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
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
              <span className={styles.sectionCount}>{filteredOther.length}</span>
            </div>
            <div className={styles.otherGrid}>
              {filteredOther.map((p, i) => {
                const color = CATEGORY_COLORS[p.category] || 'var(--accent-indigo)';
                return (
                  <motion.div
                    key={p.id}
                    className={styles.otherCard}
                    onClick={() => { saveScrollBeforeLeave(); navigate(`/work/${p.id}`); }}
                    style={{ cursor: 'pointer' }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.45, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className={styles.otherImgWrap}>
                      <img
                        src={`/${p.thumbnail}`}
                        alt={p.title}
                        className={styles.otherImg}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className={styles.imgOverlay} />
                      <span className={styles.badge} style={{ '--badge-color': color } as React.CSSProperties}>
                        {p.category}
                      </span>
                    </div>
                    <div className={styles.otherBody}>
                      <div className={styles.featuredMeta}>
                        <span className={styles.company}>{p.company}</span>
                        <span className={styles.dot}>·</span>
                        <span className={styles.time}>{p.timeFrame}</span>
                      </div>
                      <h3 className={styles.otherTitle}>{p.title}</h3>
                      <div className={styles.otherFooter}>
                        <span className={styles.metricPill}>{p.metric}</span>
                        <span className={styles.ctaExternal}>
                          View project
                          <svg width="11" height="11" viewBox="0 0 13 13" fill="none">
                            <path d="M2.5 10.5l8-8M4 2.5h6.5v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
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
