import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollRestoration, saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import { BackgroundGlow } from '../components/BackgroundGlow';
import { Footer } from '../components/Footer';
import { SideExperiments } from '../components/SideExperiments';
import { PersonalSection } from '../components/PersonalSection';
import { AWARDS } from '../data/portfolioData';
import styles from './AboutPage.module.css';

/* ── Recognition data ────────────────────────────────── */
const RECOGNITION = [
  {
    title: 'AI-First Product Thinking',
    desc: 'Designing experiences where AI is not a feature, but part of the core interaction model.',
    icon: <i className="bi bi-cpu" style={{ fontSize: '20px' }} aria-hidden="true" />,
  },
  {
    title: 'Complex Problem Simplification',
    desc: 'Breaking down high-ambiguity problems into clear, intuitive user experiences.',
    icon: <i className="bi bi-sun" style={{ fontSize: '20px' }} aria-hidden="true" />,
  },
  {
    title: 'Systems & Scalable Design',
    desc: 'Creating design solutions that scale across flows, features, and products, not just screens.',
    icon: <i className="bi bi-grid" style={{ fontSize: '20px' }} aria-hidden="true" />,
  },
  {
    title: 'End-to-End Product Ownership',
    desc: 'Driving work from problem definition to shipped experience with strong product alignment.',
    icon: <i className="bi bi-arrow-right-circle" style={{ fontSize: '20px' }} aria-hidden="true" />,
  },
  {
    title: 'Frontend-Aware Design Execution',
    desc: 'Designing with deep understanding of implementation, enabling faster and higher-quality builds.',
    icon: <i className="bi bi-code-slash" style={{ fontSize: '20px' }} aria-hidden="true" />,
  },
  {
    title: 'Cross-Functional Collaboration',
    desc: 'Working closely with product, engineering, and stakeholders to align and ship effectively.',
    icon: <i className="bi bi-people" style={{ fontSize: '20px' }} aria-hidden="true" />,
  },
];

/* ── Experience data ──────────────────────────────────── */
const EXPERIENCES = [
  {
    id: 'adobe',
    company: 'Adobe',
    logo: '/Adobe.webp',
    role: 'Product Designer 2',
    period: '2022 – Present',
    type: 'Full-time',
    highlights: [
      'Leading design for Adobe Connect, a collaboration platform used by thousands of enterprise users daily.',
      'Embedded generative AI into core workflows: smart summaries, intelligent defaults, AI-assisted host tools.',
      'Shipped Gen AI explorations that directly influenced product direction and roadmap.',
      'Maintained and extended the Adobe Spectrum design system across the Connect surface.',
      'Partnered closely with engineering to ensure implementation fidelity at every release.',
    ],
    tags: ['AI-first', 'Enterprise UX', 'Design Systems', 'Adobe Spectrum'],
    cta: '/work/all?company=Adobe',
  },
  {
    id: 'yuj',
    company: 'YUJ Designs',
    logo: '/YUJ.svg',
    role: 'UX Designer',
    period: '2021 – 2022',
    type: 'Full-time',
    highlights: [
      'Worked on enterprise UX projects across multiple client verticals: BFSI, healthcare, and SaaS.',
      'Led end-to-end design: research, flows, wireframes, and high-fidelity prototypes for handoff.',
      'Collaborated with cross-functional teams across design and development to ship client products.',
      'Developed and maintained design guidelines and reusable component libraries.',
      'Conducted usability studies and synthesised findings into actionable design improvements.',
    ],
    tags: ['Enterprise UX', 'B2B', 'Research', 'Prototyping'],
  },
  {
    id: 'bizongo',
    company: 'Bizongo',
    logo: '/Bizongo.png',
    role: 'Product Designer',
    period: '2019 – 2021',
    type: 'Full-time',
    highlights: [
      'Designed core ERP and supply-chain management surfaces for a B2B packaging platform.',
      'Owned design across multiple product pods: procurement, vendor management, and order tracking.',
      'Built scalable patterns for complex data-heavy workflows with real operational constraints.',
      'Worked directly with PMs and engineers in an agile environment to ship fast and iterate.',
      'Contributed to the internal design system, defining components used across the platform.',
    ],
    tags: ['ERP', 'Supply Chain', 'B2B', 'Design Systems'],
    cta: '/work/all?company=Bizongo',
  },
  {
    id: 'adobe-intern',
    company: 'Adobe (Internship)',
    logo: '/Adobe.webp',
    role: 'Product Design Intern',
    period: '2018 – 2019',
    type: 'Internship',
    highlights: [
      'Graduation internship at Adobe, working on product UX under senior design mentorship.',
      "Contributed to interaction design explorations for Adobe's enterprise collaboration suite.",
      'Developed a deep understanding of large-scale product design processes at a world-class organisation.',
      'Worked on design research, user journey mapping, and concept visualisation.',
      'This internship formed the foundation of my return to Adobe as a full-time designer.',
    ],
    tags: ['Internship', 'Interaction Design', 'Research'],
  },
  {
    id: 'drdo',
    company: 'NPOL DRDO',
    logo: '/DRDO.jpeg',
    role: 'Design Intern',
    period: '2017',
    type: 'Internship',
    highlights: [
      "Interned at the Naval Physical & Oceanographic Laboratory under India's Defence R&D Organisation.",
      'Worked on human factors and ergonomics for defence equipment interfaces.',
      'Applied industrial design principles to real-world, high-stakes product challenges.',
      'Developed an appreciation for designing under strict constraints, safety standards, and operational requirements.',
      'Early exposure to complex systems design that shaped a systems-first approach to all future work.',
    ],
    tags: ['Industrial Design', 'Ergonomics', 'Defence', 'Human Factors'],
  },
];

/* ── Page ─────────────────────────────────────────────── */
export function AboutPage() {
  const navigate = useNavigate();
  useScrollRestoration();
  const [activeId, setActiveId] = useState(EXPERIENCES[0].id);

  // Awards carousel — JS scroll so hover-pause and native scroll both work
  const awardsRowRef = useRef<HTMLDivElement>(null);
  const awardsScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAwardsScroll = () => {
    const el = awardsRowRef.current;
    if (!el) return;
    awardsScrollRef.current = setInterval(() => {
      el.scrollLeft += 1;
      if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
    }, 16);
  };

  const stopAwardsScroll = () => {
    if (awardsScrollRef.current) clearInterval(awardsScrollRef.current);
  };

  useEffect(() => {
    startAwardsScroll();
    return stopAwardsScroll;
  }, []);
  const active = EXPERIENCES.find(e => e.id === activeId)!;

  return (
    <>
      <BackgroundGlow />
      <main style={{ paddingTop: '80px' }}>

        {/* ── Intro hero ── */}
        <section className={styles.intro}>
          <div className={`container ${styles.introInner}`}>

            <div className={styles.introText}>
              <h1 className={styles.introHeading}>
                Hey there! I'm{' '}
                <span className="gradient-text">Midhun Krishnakumar.</span>
              </h1>
              <p className={styles.introPara}>
                I'm an AI-first Product Designer at Adobe, building intelligent product experiences
                that simplify complexity at scale. My work focuses on high-impact, high-ambiguity
                problems where design decisions directly influence product direction, adoption, and
                long-term retention.
              </p>
              <p className={styles.introPara}>
                I operate at the intersection of product, systems, and engineering, translating
                fuzzy problem spaces into clear, scalable solutions. From shaping first-mile
                experiences to driving AI-led workflows, I design not just interfaces, but how
                products behave, guide, and evolve.
              </p>
            </div>

            <div className={styles.introImageWrap}>
              <img
                src="/About me midhun.png"
                alt="Midhun Krishnakumar"
                className={styles.introImage}
              />
            </div>

          </div>
        </section>

        {/* ── Experience ── */}
        <section className={styles.expSection}>
          <div className="container">
            <span className="section-label">Experience</span>
            <h2 className={`text-display ${styles.expTitle}`}>Where I've worked</h2>

            <div className={styles.expLayout}>

              {/* Left — cards */}
              <div className={styles.expCards}>
                {EXPERIENCES.map(exp => (
                  <button
                    key={exp.id}
                    className={`${styles.expCard} ${activeId === exp.id ? styles.expCardActive : ''}`}
                    onClick={() => setActiveId(exp.id)}
                  >
                    <img src={exp.logo} alt={exp.company} className={styles.expLogo} />
                    <div className={styles.expCardText}>
                      <span className={styles.expCompany}>{exp.company}</span>
                      <span className={styles.expRole}>{exp.role}</span>
                      <span className={styles.expPeriod}>{exp.period}</span>
                    </div>
                    <span className={`${styles.expType} ${exp.type === 'Internship' ? styles.expTypeIntern : ''}`}>
                      {exp.type}
                    </span>
                  </button>
                ))}
              </div>

              {/* Right — detail */}
              <div className={styles.expDetail} key={activeId}>
                <div className={styles.expDetailHeader}>
                  <img src={active.logo} alt={active.company} className={styles.expDetailLogo} />
                  <div className={styles.expDetailMeta}>
                    <p className={styles.expDetailCompany}>{active.company}</p>
                    <h3 className={styles.expDetailRole}>{active.role}</h3>
                    <p className={styles.expDetailPeriod}>{active.period}</p>
                  </div>
                </div>

                <ul className={styles.expHighlights}>
                  {active.highlights.map((h, i) => (
                    <li key={i} className={styles.expHighlight}>
                      <span className={styles.expBullet}>↳</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.expTags}>
                  {active.tags.map(t => (
                    <span key={t} className={styles.expTag}>{t}</span>
                  ))}
                </div>

                {active.cta && (
                  <button className={styles.expCtaLarge} onClick={() => { saveScrollBeforeLeave(); navigate(active.cta!); }}>
                    View Works
                    <i className="bi bi-arrow-right" style={{ fontSize: '15px' }} aria-hidden="true" />
                  </button>
                )}
              </div>

            </div>
          </div>
        </section>

        {/* ── Recognition ── */}
        <section className={styles.recSection}>
          <div className="container">
            <span className="section-label">Recognition</span>
            <h2 className={`text-display ${styles.recTitle}`}>
              Across my experience,<br />
              <span className="gradient-text">I was recognised for</span>
            </h2>
            <div className={styles.recGrid}>
              {RECOGNITION.map((item, i) => (
                <div key={i} className={styles.recCard}>
                  <div className={styles.recIconWrap}>{item.icon}</div>
                  <div className={styles.recCardBody}>
                    <h4 className={styles.recCardTitle}>{item.title}</h4>
                    <p className={styles.recCardDesc}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Awards carousel ── */}
            <div className={styles.awardsCarouselWrap}>
              <p className={styles.awardsSubLabel}>
                Recognitions
                <span className={styles.awardsCount}>{AWARDS.length}</span>
              </p>
              {/* Single row — scrolls left */}
              <div
                ref={awardsRowRef}
                className={styles.awardsRow}
                onMouseEnter={stopAwardsScroll}
                onMouseLeave={startAwardsScroll}
              >
                <div className={styles.awardsTrack}>
                  {[...AWARDS, ...AWARDS].map((a, i) => (
                    <div key={i} className={styles.awardTile}>
                      <span className={styles.awardStar}>★</span>
                      <p className={styles.awardTileTitle}>{a.title}</p>
                      <p className={styles.awardTileDate}>{a.issuer}</p>
                      <p className={styles.awardTileDate}>{a.date}</p>
                      <p className={styles.awardTileDesc}>{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <PersonalSection />
        <SideExperiments />
        <Footer />
      </main>
    </>
  );
}
