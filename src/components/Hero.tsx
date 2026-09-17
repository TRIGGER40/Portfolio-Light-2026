import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Hero.module.css';
import { PhoneStack } from './PhoneStack';
import { track } from '../lib/analytics';

const METRICS = [
  { value: '6+',   label: 'years shipping enterprise products' },
  { value: '10M+', label: 'users delighted across products' },
  { value: '20+',  label: 'features owned, start to finish' },
];

const COMPANIES = [
  {
    id: 'adobe',
    logo: '/Adobe.webp',
    company: 'Adobe',
    role: 'Product Designer',
    period: '2022 – Present',
    link: '/work/all?company=Adobe',
  },
  {
    id: 'yuj',
    logo: '/YUJ.svg',
    company: 'YUJ Designs',
    role: 'UX Designer',
    period: '2021 – 2022',
    link: '/work/all',
  },
  {
    id: 'bizongo',
    logo: '/Bizongo.webp',
    company: 'Bizongo',
    role: 'Product Designer',
    period: '2019 – 2021',
    link: '/work/all?company=Bizongo',
  },
];


export function Hero() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { track('hero_view', {}); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.bg}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
      </div>

      <div className={`container ${styles.content}`}>

        {/* Left column */}
        <div className={styles.leftCol}>

          {/* Name + title */}
          <div className={styles.fadeUp} style={{ '--delay': '0.1s' } as React.CSSProperties}>
            <div className={styles.heroName}>
              <h1 className={styles.name}>Midhun<br />Krishnakumar</h1>
            </div>
          </div>

          {/* Description */}
          <div className={styles.fadeUp} style={{ '--delay': '0.22s' } as React.CSSProperties}>
            <p className={styles.valueProp}>
              Lead Product Designer, Adobe Connect. 6+ years of shipping complex
              systems, AI-powered collaboration tools, and 0-1 products with
              impactful experiences globally.
            </p>
          </div>

          {/* CTAs */}
          <div className={styles.fadeUp} style={{ '--delay': '0.34s' } as React.CSSProperties}>
            <div className={styles.ctas}>
              <a href="#work" className="btn btn-primary"
                onClick={() => track('hero_cta', { cta: 'View selected work' })}>
                View selected work
                <i className={`bi bi-chevron-down ${styles.bounceChevron}`} style={{ fontSize: '14px' }} aria-hidden="true" />
              </a>
              <button className="btn btn-secondary" onClick={() => { track('hero_cta', { cta: 'Ask AI about me' }); navigate('/ask'); }}>
                <span className={styles.btnSparkle} style={{ fontSize: '11px' }}>✦</span>
                Ask AI about Midhun
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div className={styles.fadeUp} style={{ '--delay': '0.46s' } as React.CSSProperties}>
            <div className={styles.metrics}>
              {METRICS.map((m) => (
                <div key={m.label} className={styles.metric}>
                  <span className={styles.metricValue}>{m.value}</span>
                  <span className={styles.metricLabel}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Company cards */}
          <div className={styles.fadeUp} style={{ '--delay': '0.58s' } as React.CSSProperties}>
            <div className={styles.companyCards}>
              {COMPANIES.map((c) => (
                <button
                  key={c.id}
                  className={styles.companyCard}
                  onClick={() => { track('hero_company_card', { company: c.id }); navigate(c.link); }}
                >
                  <img src={c.logo} alt={c.company} className={styles.companyLogo} />
                  <div className={styles.companyMeta}>
                    <span className={styles.companyName}>{c.company}</span>
                    <span className={styles.companyRole}>{c.role}</span>
                    <span className={styles.companyPeriod}>{c.period}</span>
                  </div>
                  <i className={`bi bi-arrow-right ${styles.companyArrow}`} aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right column — phone stack */}
        <div
          className={`${styles.rightCol} ${styles.fadeUp}`}
          style={{ '--delay': '0.3s' } as React.CSSProperties}
        >
          <PhoneStack />
        </div>

      </div>
    </section>
  );
}
