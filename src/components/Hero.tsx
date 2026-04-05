import { useNavigate } from 'react-router-dom';
import { PhoneStack } from './PhoneStack';
import styles from './Hero.module.css';

const METRICS = [
  { value: '6+', label: 'Years of exp.' },
  { value: '10M', label: 'Users impacted' },
  { value: '250+', label: 'Releases shipped' },
];

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={styles.grid} />
      </div>

      <div className={`container ${styles.content}`}>
        {/* Left column — staggered CSS fade-up */}
        <div className={styles.left}>
          <div className={styles.fadeUp} style={{ '--delay': '0.1s' } as React.CSSProperties}>
            <div className={styles.rolePill}>
              <span className={styles.roleDot} />
              Available for senior roles
            </div>
          </div>

          <div className={styles.fadeUp} style={{ '--delay': '0.22s' } as React.CSSProperties}>
            <h1 className={`text-hero ${styles.heading}`}>
              Midhun
              <br />
              <span className="gradient-text">Krishnakumar</span>
            </h1>
          </div>

          <div className={styles.fadeUp} style={{ '--delay': '0.34s' } as React.CSSProperties}>
            <div className={styles.positionBlock}>
              <p className={styles.position}>AI-first Product Designer</p>
              <p className={styles.valueProp}>
                Building intelligent products at Adobe, where design craft meets AI to create
                measurable, enterprise-grade user experiences.
              </p>
            </div>
          </div>

          <div className={styles.fadeUp} style={{ '--delay': '0.46s' } as React.CSSProperties}>
            <div className={styles.ctas}>
              <a href="#work" className="btn btn-secondary">
                View Work
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <button className={`btn btn-primary ${styles.askBtn}`} onClick={() => navigate('/ask')}>
                <span className={styles.sparkle}>✦</span>
                Ask AI About Me
              </button>
            </div>
          </div>

          <div className={styles.fadeUp} style={{ '--delay': '0.58s' } as React.CSSProperties}>
            <div className={styles.metrics}>
              {METRICS.map((m) => (
                <div key={m.label} className={styles.metric}>
                  <span className={styles.metricValue}>{m.value}</span>
                  <span className={styles.metricLabel}>{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — phones */}
        <div
          className={`${styles.right} ${styles.fadeRight}`}
          style={{ '--delay': '0.4s' } as React.CSSProperties}
        >
          <PhoneStack />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollHint}>
        <div className={styles.scrollDot} />
      </div>
    </section>
  );
}
