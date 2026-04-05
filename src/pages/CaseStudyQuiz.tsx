import { useEffect, useRef, useState } from 'react';
import { Footer } from '../components/Footer';
import { ProjectCarousel } from '../components/ProjectCarousel';
import { GoBackButton } from '../components/GoBackButton';
import styles from './CaseStudyQuiz.module.css';

/* Swap src to a real path once the image is ready.
   Shows a labeled placeholder until then. */
function ImgSlot({ src, label, aspect = '16/9' }: { src?: string; label: string; aspect?: string }) {
  if (src) {
    return <img src={src} alt={label} className={styles.imgSlotReal} style={{ aspectRatio: aspect }} />;
  }
  return (
    <div className={styles.imgSlot} style={{ aspectRatio: aspect }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles.imgSlotIcon}>
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className={styles.imgSlotLabel}>{label}</span>
    </div>
  );
}

const CHAPTERS = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'problem',   label: 'Problem'   },
  { id: 'insight',   label: 'Insight'   },
  { id: 'decisions', label: 'Decisions' },
  { id: 'solution',  label: 'Solution'  },
  { id: 'impact',    label: 'Impact'    },
  { id: 'next',      label: "Learnings" },
];

export function CaseStudyQuiz() {
  const [activeChapter, setActiveChapter] = useState('overview');
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setScrollProgress(Math.min(1, el.scrollTop / (el.scrollHeight - el.clientHeight)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    CHAPTERS.forEach(({ id }) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActiveChapter(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };
  const scrollTo = (id: string) => sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className={styles.page}>

      {/* Progress bar */}
      <div className={styles.progressBar} style={{ transform: `scaleX(${scrollProgress})` }} />

      {/* ── HERO ─────────────────────────────────── */}
      <section ref={setRef('overview')} id="overview" className={styles.heroSection}>
        <div className={styles.container}>
          <GoBackButton className={styles.backBtn} />

          <div className={styles.heroLayout}>
            {/* Left: image */}
            <div className={styles.heroImgCol}>
              <img src="/quiz pod.png" alt="Quiz Pod" className={styles.heroImg} />
            </div>

            {/* Right: content */}
            <div className={styles.heroContentCol}>
              <div className={styles.heroEyebrow}>
                <span className={styles.heroCategoryBadge}>Feature Design</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>Adobe Connect</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>3 Weeks</span>
              </div>

              <h1 className={styles.heroTitle}>Quick quizzing in Adobe Connect</h1>
              <p className={styles.heroSubtitle}>Turning passive virtual sessions into real-time, measurable learning experiences.</p>

              <div className={styles.heroMetaBar}>
                {[
                  { k: 'Role',     v: 'UX Designer' },
                  { k: 'Goal',     v: 'Real-time engagement' },
                  { k: 'Platform', v: 'Adobe Connect' },
                  { k: 'Impact',   v: '50% boost in host efficiency' },
                ].map(({ k, v }) => (
                  <div key={k} className={styles.heroMetaItem}>
                    <span className={styles.asideKey}>{k}</span>
                    <span className={styles.asideVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ──────────────────────────────── */}
      <section ref={setRef('problem')} id="problem" className={styles.problemSection}>
        <div className={styles.container}>
          <div className={styles.problemTop}>
            <span className={styles.tag}>Problem</span>
            <h2 className={styles.problemStatement}>
              Virtual sessions were<br />
              <span className={styles.strikeRed}>largely passive.</span>
            </h2>
          </div>

          <div className={styles.problemGrid}>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>01</span>
              <h3 className={styles.gapTitle}>Engagement dropped</h3>
              <p className={styles.gapDesc}>Long sessions with no interaction led to passive attendance. Cameras off, attention elsewhere.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>02</span>
              <h3 className={styles.gapTitle}>No real-time signal</h3>
              <p className={styles.gapDesc}>Hosts couldn't tell if participants were following along or completely lost, until it was too late.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>03</span>
              <h3 className={styles.gapTitle}>No feedback loop</h3>
              <p className={styles.gapDesc}>Existing tools had no mechanism for in-session interaction. Quizzes were manual, async, and ignored.</p>
            </div>
          </div>

          <div className={styles.problemImgWrap}>
            <ImgSlot
              src="/Quiz pod project/Adobe Connect Before quiz.png"
              label="Before state: Adobe Connect session — host panel with no quiz option"
              aspect="21/9"
            />
          </div>

          <div className={styles.problemResult}>
            <span className={styles.resultLabel}>Result</span>
            <p className={styles.resultText}>Trainers couldn't reliably measure understanding or maintain attention during live sessions.</p>
          </div>
        </div>
      </section>

      {/* ── INSIGHT ──────────────────────────────── */}
      <section ref={setRef('insight')} id="insight" className={styles.insightSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Insight</span>
          <blockquote className={styles.insightQuote}>
            Engagement increases when participation
            {' '}<em className={styles.insightEm}>is active and visible.</em>
          </blockquote>
          <div className={styles.insightBeads}>
            {[
              { n: '↗', t: 'Interactive checkpoints', d: 'Users respond better when they have a role to play' },
              { n: '⚡', t: 'Immediate feedback', d: 'Drives attention and retention in real-time' },
              { n: '🎮', t: 'Gamification', d: 'Turns passive sessions into active experiences' },
            ].map(b => (
              <div key={b.t} className={styles.insightBead}>
                <span className={styles.insightBeadIcon}>{b.n}</span>
                <div>
                  <p className={styles.insightBeadTitle}>{b.t}</p>
                  <p className={styles.insightBeadDesc}>{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY DECISIONS ────────────────────────── */}
      <section ref={setRef('decisions')} id="decisions" className={styles.decisionsSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Key Decisions</span>
          <h2 className={styles.sectionTitle}>4 calls that shaped the feature</h2>
        <div className={styles.decisionsGrid}>
          {[
            {
              n: '01', title: 'Real-time over post-session',
              body: 'Live quizzes instead of delayed assessments, so trainers get signal while it still matters.',
              accent: 'Immediate signal · No context lost',
              imgLabel: 'Live quiz launch — session toolbar with quiz button active',
              img: '/Quiz pod project/Live quiz.png',
            },
            {
              n: '02', title: 'Multiple question formats',
              body: 'MCQs, multi-answer, short answers. Match format to content type without switching tools.',
              accent: 'MCQ · Multi-select · Short answer',
              imgLabel: 'Question type picker UI with format options',
              img: '/Quiz pod project/Multiple question options.png',
            },
            {
              n: '03', title: 'Instant feedback & scoring',
              body: 'Hosts track responses and completion live. Participants see their score right after submitting.',
              accent: 'Live tracking · Completion rate',
              imgLabel: 'Host panel: live response bar chart and completion %',
              img: '/Quiz pod project/Instant feedback.png',
            },
            {
              n: '04', title: 'Gamified experience',
              body: 'Leaderboards and timed responses shift the mental model from assessment to game. Attention spikes.',
              accent: 'Leaderboard · Timed responses',
              imgLabel: 'Leaderboard screen with ranked participant scores',
              img: '/Quiz pod project/Gamification.png',
            },
          ].map(d => (
            <div key={d.n} className={styles.decisionCard}>
              <ImgSlot src={d.img} label={d.imgLabel} aspect="16/9" />
              <span className={styles.decisionNum}>{d.n}</span>
              <h3 className={styles.decisionTitle}>{d.title}</h3>
              <p className={styles.decisionBody}>{d.body}</p>
              <span className={styles.decisionAccent}>{d.accent}</span>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────── */}
      <section ref={setRef('solution')} id="solution" className={styles.solutionSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Solution</span>
          <h2 className={styles.sectionTitle}>A complete quiz loop, in three steps</h2>
          <p className={styles.sectionSub}>From creation to results in one continuous flow. No context switching, no separate tools.</p>
        </div>

        <div className={styles.solutionFlow}>
          {[
            {
              n: '01', step: 'Create',
              color: 'var(--accent-indigo)',
              desc: 'Hosts set up a quiz before or during a live session. Choose format, add questions, set a timer. Under a minute.',
              attrs: ['Multiple formats', 'Timer control', 'Reusable templates'],
              img: '/Quiz pod project/Quiz Create.png',
            },
            {
              n: '02', step: 'Engage',
              color: 'var(--accent-violet)',
              desc: 'Participants receive the quiz in-session. Clear UI, progress indicator, and instant acknowledgement on submit.',
              attrs: ['Mobile-friendly', 'Progress indicator', 'Instant confirm'],
              img: '/Quiz pod project/Quiz Engage.png',
            },
            {
              n: '03', step: 'Evaluate',
              color: 'var(--accent-blue)',
              desc: 'Hosts see live responses, scores, and completion as they come in. Leaderboard visible to all participants.',
              attrs: ['Live tracking', 'Leaderboard', 'Export insights'],
              img: '/Quiz pod project/Quiz Evaluate.png',
            },
          ].map((s, i) => (
            <div key={s.n} className={`${styles.solutionStep} ${i % 2 === 1 ? styles.solutionStepFlip : ''}`}>
              <div className={styles.solutionImg}>
                <img src={s.img} alt={s.step} className={styles.solutionImgReal} />
              </div>
              <div className={styles.solutionText}>
                <span className={styles.solutionNum} style={{ color: s.color }}>{s.n}</span>
                <h3 className={styles.solutionStepTitle} style={{ color: s.color }}>{s.step}</h3>
                <p className={styles.solutionDesc}>{s.desc}</p>
                <div className={styles.solutionAttrs}>
                  {s.attrs.map(a => <span key={a} className={styles.solutionAttr}>{a}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── IMPACT ───────────────────────────────── */}
      <section ref={setRef('impact')} id="impact" className={styles.impactSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Impact</span>
          <h2 className={styles.sectionTitle}>Quizzes went from optional to essential</h2>
          <p className={styles.sectionSub}>Measurable gains across host efficiency, engagement, and session outcomes.</p>
          <div className={styles.impactMetrics}>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>50%</span>
              <span className={styles.impactLbl}>boost in host efficiency</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>90%</span>
              <span className={styles.impactLbl}>faster quiz creation vs manual</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>↑</span>
              <span className={styles.impactLbl}>measurable real-time engagement</span>
            </div>
          </div>
          <div className={styles.impactOutcomes}>
            {[
              'Increased participant engagement during live sessions',
              'Enabled real-time knowledge validation for trainers',
              'Improved learning outcomes through active interaction',
              'Provided measurable insights that didn\'t exist before',
            ].map(o => (
              <div key={o} className={styles.impactOutcome}>
                <span className={styles.impactCheck} />
                <span>{o}</span>
              </div>
            ))}
          </div>

          <div className={styles.impactImgWrap}>
            <ImgSlot
              src="/Quiz pod project/Final picture.png"
              label="Session overview: leaderboard with ranked participant scores visible to all attendees"
              aspect="16/7"
            />
          </div>
        </div>
      </section>

      {/* ── LEARNINGS ─────────────────────────────── */}
      <section ref={setRef('next')} id="next" className={styles.endSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Learnings</span>
          <h2 className={styles.sectionTitle}>What this taught me</h2>
          <div className={styles.learningsGrid}>
            {[
              { num: '01', h: 'Passive to interactive shifts drive outsized gains', b: 'Even small interactive moments in a passive experience disproportionately improve engagement and recall.' },
              { num: '02', h: 'Real-time feedback is non-negotiable in learning', b: 'Delayed results lose impact. Immediate scoring closes the loop while context is still fresh.' },
              { num: '03', h: 'Simplicity wins in live environments', b: 'Any friction in a live session is amplified. The UI has to be invisible so the learning is front and center.' },
            ].map(l => (
              <div key={l.h} className={styles.learningCard}>
                <span className={styles.learningNum}>{l.num}</span>
                <h4 className={styles.learningH}>{l.h}</h4>
                <p className={styles.learningB}>{l.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProjectCarousel currentId="quiz-pod" />

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <GoBackButton className={styles.bottomBack} label="Go back" />
          <span className={styles.bottomMeta}>Quiz Pod · Adobe Connect · 2023</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
