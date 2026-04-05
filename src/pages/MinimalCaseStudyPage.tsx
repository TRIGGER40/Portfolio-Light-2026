import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Footer } from '../components/Footer';
import { BackgroundGlow } from '../components/BackgroundGlow';
import styles from './MinimalCaseStudyPage.module.css';

const CATEGORY_COLORS: Record<string, string> = {
  AI:               'var(--accent-violet)',
  Feature:          'var(--accent-blue)',
  UX:               'var(--accent-indigo)',
  'Design Systems': 'var(--accent-cyan)',
  Mentorship:       'var(--accent-indigo)',
  Internship:       'var(--accent-blue)',
};

type Project = {
  id: string;
  title: string;
  company: string;
  category: string;
  timeFrame: string;
  metric: string;
  heroImage: string;
  opportunity: string;
  outcomes: string[];
  tags: string[];
  backTo?: string; // AllWorks filter path
};

const PROJECTS: Project[] = [
  {
    id: 'gen-ai',
    title: 'Gen AI Explorations',
    company: 'Adobe',
    category: 'AI',
    timeFrame: '1 Week',
    metric: '40% less asset creation effort',
    heroImage: '/images/case-studies/gen-ai.png',
    opportunity: 'Exploring how product explorations using Gen AI can reduce effort and cost in content creation workflows for Adobe Connect hosts.',
    outcomes: [
      'Reduced asset creation effort by 40% using Gen AI image and content generators.',
      '3x faster content turnaround compared to manual asset creation.',
      'Eliminated subscription dependency on third-party asset libraries.',
      'Findings directly influenced the product roadmap for AI-first features.',
    ],
    tags: ['Adobe Connect', 'Gen AI', 'Enterprise UX', 'AI Initiatives'],
    backTo: '/work/all?company=Adobe',
  },
  {
    id: 'connect-homepage',
    title: 'Revamping Adobe Connect Homepage',
    company: 'Adobe',
    category: 'UX',
    timeFrame: '16 Weeks',
    metric: '35% increase in engagement',
    heroImage: '/images/case-studies/connect-homepage.png',
    opportunity: 'Adobe Connect Central is the creation and management hub for all webinars and trainings. The existing interface lacked hierarchy, discoverability, and modern usability standards.',
    outcomes: [
      '35% increase in user engagement post-launch.',
      '28% faster navigation to key actions.',
      'Customisable widget interface tailored to user workflows.',
      'Sleeker, modernised look with improved content hierarchy.',
    ],
    tags: ['Adobe Connect', 'Enterprise UX', 'Design Systems'],
    backTo: '/work/all?company=Adobe',
  },
  {
    id: 'adobe-visual-design',
    title: 'Visual Design Works at Adobe',
    company: 'Adobe',
    category: 'UX',
    timeFrame: 'Ongoing',
    metric: '100% of active users impacted',
    heroImage: '/images/case-studies/adobe-visual-design.png',
    opportunity: 'Core UI revamps across Adobe Connect to modernise the visual language, improve consistency with Adobe Spectrum, and elevate the overall design quality for enterprise users.',
    outcomes: [
      '25% reduction in UI support tickets after visual revamps.',
      '100% of active Connect users impacted through shipped UI updates.',
      'Stronger alignment with Adobe Spectrum design system.',
      'Established a visual foundation for future AI-powered features.',
    ],
    tags: ['Adobe Connect', 'Enterprise UX', 'Design Systems', 'Adobe Spectrum'],
    backTo: '/work/all?company=Adobe',
  },
  {
    id: 'bizongo-ums',
    title: 'Managing Users Effectively',
    company: 'Bizongo',
    category: 'UX',
    timeFrame: '2 Weeks',
    metric: '50% faster user onboarding',
    heroImage: '/images/case-studies/bizongo-ums.png',
    opportunity: 'User Management System was handled entirely from the backend until 2020. Bringing all features to the front end and making it intuitive for admins without engineering dependency was the core challenge.',
    outcomes: [
      '50% faster user onboarding for new team members.',
      '30% reduction in operational errors across user management tasks.',
      'Zero engineering dependency for user admin operations.',
      'Intuitive UI enabled non-technical admins to onboard without formal training.',
    ],
    tags: ['Enterprise UX', 'Bizongo DCMS', 'Design Systems'],
    backTo: '/work/all?company=Bizongo',
  },
  {
    id: 'bizongo-artwork-flow',
    title: 'Seamless Approval Workflow Creation',
    company: 'Bizongo',
    category: 'UX',
    timeFrame: '2 Weeks',
    metric: '60% less workflow setup time',
    heroImage: '/images/case-studies/bizongo-artwork-flow.png',
    opportunity: "Artwork Flow's workflow setup UI had evolved organically and needed to become more intuitive as the product scaled to hundreds of teams managing complex approval chains.",
    outcomes: [
      '60% reduction in workflow setup time.',
      'Drag and drop adoption across 200+ teams.',
      'Visibility of stage settings upfront reduced back-and-forth.',
      'Better scalability as teams grew and approval chains became more complex.',
    ],
    tags: ['Enterprise UX', 'Bizongo DCMS', 'Design Systems'],
    backTo: '/work/all?company=Bizongo',
  },
  {
    id: 'bizongo-contracts',
    title: 'Modular Contract / T&C Creation',
    company: 'Bizongo',
    category: 'UX',
    timeFrame: '2 Weeks',
    metric: '70% faster contract creation',
    heroImage: '/images/case-studies/bizongo-contracts.png',
    opportunity: 'Bizongo handles hundreds of clients with distinct terms. Creating customised contracts with minimal effort while keeping everything trackable and audit-ready was critical at scale.',
    outcomes: [
      '70% faster contract creation compared to the previous process.',
      '100+ active client contracts managed in one place.',
      'Sign-off feature enabled fully digital contract closure.',
      'Modular clause builder allowed reuse across contract types.',
    ],
    tags: ['Enterprise UX', 'Bizongo DCMS', 'Design Systems'],
    backTo: '/work/all?company=Bizongo',
  },
  {
    id: 'yuj-heuristics',
    title: 'Heuristics Evaluation Improvement',
    company: 'YUJ Designs',
    category: 'UX',
    timeFrame: '2021',
    metric: '40% better heuristic scores',
    heroImage: '/images/case-studies/yuj-heuristics.png',
    opportunity: 'Design evaluations at YUJ needed to be more systematic and repeatable. Ad-hoc heuristic reviews were inconsistent across client projects, reducing their credibility and impact.',
    outcomes: [
      '40% improvement in heuristic evaluation scores across reviewed products.',
      '30% faster task completion for end users after implementing recommendations.',
      'Structured evaluation framework reused across multiple client engagements.',
      'Findings were directly translated into actionable redesign priorities.',
    ],
    tags: ['Enterprise UX', 'UX Research', 'Heuristic Evaluation'],
    backTo: '/work/all',
  },
  {
    id: 'bizongo-design-system',
    title: 'Managing and Updating Design System',
    company: 'Bizongo',
    category: 'Design Systems',
    timeFrame: '1+ yr',
    metric: '50%+ reduction in feature dev time',
    heroImage: '/images/case-studies/bizongo-design-system.png',
    opportunity: "Bizongo's design system was derived from Ant Design but needed significant modification to fit B2B use cases, with proper documentation and component coverage across 5 product verticals.",
    outcomes: [
      '50%+ reduction in feature development time through reusable components.',
      '60% faster designer onboarding with comprehensive documentation.',
      'Unified visual language across 5 product verticals.',
      'Forecasted and incorporated latest design trends into the system.',
    ],
    tags: ['Design Systems', 'Ant Design', 'Enterprise UX', 'Documentation'],
    backTo: '/work/all?company=Bizongo',
  },
  {
    id: 'nid-ui-ux-course',
    title: 'UI/UX Course & Workshops',
    company: 'NID Andhra Pradesh',
    category: 'Mentorship',
    timeFrame: 'Ongoing',
    metric: '30+ students mentored',
    heroImage: '/images/case-studies/nid-ui-ux-course.png',
    opportunity: 'Guiding third-year design students at NID Andhra Pradesh in UI/UX methodologies through coursework, workshops, and hands-on project work to bridge the gap between theory and practice.',
    outcomes: [
      '30+ students mentored through structured coursework and workshops.',
      '7+ end-to-end UX projects shipped by students under mentorship.',
      '3 structured design workshops conducted on UX research and prototyping.',
      'Students equipped with practical skills directly applicable to industry roles.',
    ],
    tags: ['Mentorship', 'UI/UX Education', 'NID', 'Leadership'],
    backTo: '/work/all',
  },
  {
    id: 'iit-branding',
    title: 'Branding for Local Poultry Farmers',
    company: 'IIT Guwahati',
    category: 'Internship',
    timeFrame: '2 months',
    metric: 'Full brand identity delivered',
    heroImage: '/images/case-studies/iit-branding.png',
    opportunity: 'Creating a complete branding and marketing presence for local poultry farmers to help them expand into Tier-1 cities. The challenge was building brand trust and accessibility for a traditionally unbranded market.',
    outcomes: [
      'Full brand identity delivered: logo, colour system, typography.',
      'E-commerce site and retail packaging designed end-to-end.',
      'Marketing guidelines prepared for entry into 3 Tier-1 cities.',
      'Positioned local produce as premium with a modern brand narrative.',
    ],
    tags: ['Brand Strategy', 'E-Commerce', 'Marketing', 'Packaging'],
    backTo: '/work/all',
  },
  {
    id: 'drdo-xctd',
    title: 'XCTD Probe Interface Design',
    company: 'NPOL DRDO',
    category: 'Internship',
    timeFrame: '2017',
    metric: 'Inducted design into Navy',
    heroImage: '/images/case-studies/npol-ctd-probe.png',
    opportunity: 'Designing a re-usable CTD (Conductivity, Temperature, Depth) probe structure for naval applications at the Naval Physical and Oceanographic Laboratory under DRDO. The challenge was designing under strict operational and safety constraints.',
    outcomes: [
      'Design inducted into the Indian Navy in April 2018.',
      'Structural validation passed on first review.',
      'Re-usable probe structure reduced per-deployment cost significantly.',
      'Early exposure to designing under defence-grade constraints shaped a systems-first design approach.',
    ],
    tags: ['Product Design', 'CAD', 'Defence', 'Human Factors'],
    backTo: '/work/all',
  },
];

export function MinimalCaseStudyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const project = PROJECTS.find(p => p.id === id);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [id]);

  if (!project) {
    return (
      <div className={styles.notFound}>
        <p>Project not found.</p>
        <button onClick={() => navigate('/work/all')}>Back to all work</button>
      </div>
    );
  }

  const color = CATEGORY_COLORS[project.category] || 'var(--accent-indigo)';

  return (
    <>
      <BackgroundGlow />
      <main className={styles.page}>

        {/* ── Hero: two-column ── */}
        <section className={styles.heroSection}>
          <div className={styles.container}>
            <button className={styles.backBtn} onClick={() => navigate(project.backTo || '/work/all')}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              All work
            </button>

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
                  <span className={styles.timeFrame}>{project.timeFrame}</span>
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
                <img
                  src={project.heroImage}
                  alt={project.title}
                  className={styles.heroImg}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </motion.div>
            </div>
          </div>
        </section>

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
            <button className={styles.backBtnBottom} onClick={() => navigate(project.backTo || '/work/all')}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to all work
            </button>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
