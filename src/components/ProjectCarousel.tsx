import { useNavigate } from 'react-router-dom';
import styles from './ProjectCarousel.module.css';

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
};

const ALL_PROJECTS = [
  { id: 'quiz-pod',      title: 'Quick quizzing in Adobe Connect',    company: 'Adobe',   category: 'Feature', thumbnail: 'quiz pod.png' },
  { id: 'event-joining', title: 'Enhancing joining experience',        company: 'Adobe',   category: 'UX',     thumbnail: 'joining screen.png' },
  { id: 'bizongo-qc',    title: 'Quality check made easy!',            company: 'Bizongo', category: 'UX',     thumbnail: 'QC improvement.png' },
  { id: 'bizongo-ecom',  title: 'Making PPE kits more accessible',     company: 'Bizongo', category: 'UX',     thumbnail: 'PPE.png' },
];

interface Props { currentId: string; }

export function ProjectCarousel({ currentId }: Props) {
  const navigate = useNavigate();
  const others = ALL_PROJECTS.filter(p => p.id !== currentId);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>More work</span>
          <h3 className={styles.title}>Continue exploring</h3>
        </div>
        <div className={styles.grid}>
          {others.map(p => {
            const color = CATEGORY_COLORS[p.category] || 'var(--accent-indigo)';
            const route = INTERNAL_ROUTES[p.id];
            return (
              <div
                key={p.id}
                className={styles.card}
                onClick={() => route && navigate(route)}
                style={{ cursor: route ? 'pointer' : 'default' }}
              >
                <div className={styles.imgWrap}>
                  <img
                    src={`/${p.thumbnail}`}
                    alt={p.title}
                    className={styles.img}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className={styles.imgOverlay} />
                  <span className={styles.badge} style={{ '--badge-color': color } as React.CSSProperties}>
                    {p.category}
                  </span>
                </div>
                <div className={styles.body}>
                  <span className={styles.company}>{p.company}</span>
                  <p className={styles.cardTitle}>{p.title}</p>
                  {route && (
                    <span className={styles.cta}>
                      View case study
                      <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                        <path d="M2.5 10.5l8-8M4 2.5h6.5v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
