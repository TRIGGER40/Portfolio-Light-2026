import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { saveScrollBeforeLeave } from '../hooks/useScrollRestoration';
import { AWARDS } from '../data/portfolioData';
import pStyles from '../pages/AboutPage.module.css';
import { makeSectionTimer } from '../lib/analytics';

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.94 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};


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

export function About() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(EXPERIENCES[0].id);
  const active = EXPERIENCES.find(e => e.id === activeId)!;

  // Awards carousel
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
  useEffect(() => { startAwardsScroll(); return stopAwardsScroll; }, []);

  // Track time spent in About section
  const aboutRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = aboutRef.current;
    if (!el) return;
    const timer = makeSectionTimer('about');
    const obs = new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? timer.enter() : timer.leave();
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => { timer.leave(); obs.disconnect(); };
  }, []);

  return (
    <>
      <div ref={aboutRef} style={{ display: 'contents' }}>
      {/* ── Experience ── */}
      <section className={pStyles.expSection}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">Experience</span>
            <h2 className={`text-display ${pStyles.expTitle}`}>Where I've worked</h2>
          </motion.div>
          <div className={pStyles.expLayout}>
            <div className={pStyles.expCards}>
              {EXPERIENCES.map(exp => (
                <button
                  key={exp.id}
                  className={`${pStyles.expCard} ${activeId === exp.id ? pStyles.expCardActive : ''}`}
                  onClick={() => setActiveId(exp.id)}
                >
                  <img src={exp.logo} alt={exp.company} className={pStyles.expLogo} />
                  <div className={pStyles.expCardText}>
                    <span className={pStyles.expCompany}>{exp.company}</span>
                    <span className={pStyles.expRole}>{exp.role}</span>
                    <span className={pStyles.expPeriod}>{exp.period}</span>
                  </div>
                  <span className={`${pStyles.expType} ${exp.type === 'Internship' ? pStyles.expTypeIntern : ''}`}>
                    {exp.type}
                  </span>
                </button>
              ))}
            </div>

            <div className={pStyles.expDetail} key={activeId}>
              <div className={pStyles.expDetailHeader}>
                <img src={active.logo} alt={active.company} className={pStyles.expDetailLogo} />
                <div className={pStyles.expDetailMeta}>
                  <p className={pStyles.expDetailCompany}>{active.company}</p>
                  <h3 className={pStyles.expDetailRole}>{active.role}</h3>
                  <p className={pStyles.expDetailPeriod}>{active.period}</p>
                </div>
              </div>
              <ul className={pStyles.expHighlights}>
                {active.highlights.map((h, i) => (
                  <li key={i} className={pStyles.expHighlight}>
                    <span className={pStyles.expBullet}>↳</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <div className={pStyles.expTags}>
                {active.tags.map(t => (
                  <span key={t} className={pStyles.expTag}>{t}</span>
                ))}
              </div>
              {active.cta && (
                <button className={pStyles.expCtaLarge} onClick={() => { saveScrollBeforeLeave(); navigate(active.cta!); }}>
                  View works
                  <i className="bi bi-arrow-right" style={{ fontSize: '15px' }} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Recognition ── */}
      <section className={pStyles.recSection}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="section-label">Recognition</span>
            <h2 className={`text-display ${pStyles.recTitle}`}>
              Across my experience,<br />
              <span className="gradient-text">I was recognised for</span>
            </h2>
          </motion.div>
          <motion.div
            className={pStyles.recGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={cardContainerVariants}
          >
            {RECOGNITION.map((item, i) => (
              <motion.div key={i} className={pStyles.recCard} variants={cardItemVariants}>
                <div className={pStyles.recIconWrap}>{item.icon}</div>
                <div className={pStyles.recCardBody}>
                  <h4 className={pStyles.recCardTitle}>{item.title}</h4>
                  <p className={pStyles.recCardDesc}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
          <div className={pStyles.awardsCarouselWrap}>
            <p className={pStyles.awardsSubLabel}>
              Recognitions
              <span className={pStyles.awardsCount}>{AWARDS.length}</span>
            </p>
            <div
              ref={awardsRowRef}
              className={pStyles.awardsRow}
              onMouseEnter={stopAwardsScroll}
              onMouseLeave={startAwardsScroll}
            >
              <div className={pStyles.awardsTrack}>
                {[...AWARDS, ...AWARDS].map((a, i) => (
                  <div key={i} className={pStyles.awardTile}>
                    <span className={pStyles.awardStar}>★</span>
                    <p className={pStyles.awardTileTitle}>{a.title}</p>
                    <p className={pStyles.awardTileDate}>{a.issuer}</p>
                    <p className={pStyles.awardTileDate}>{a.date}</p>
                    <p className={pStyles.awardTileDesc}>{a.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </motion.div>
        </div>
      </section>

      </div>
    </>
  );
}
