import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import styles from './CaseStudyQuiz.module.css';
import jStyles from './CaseStudyJoining.module.css';

/* ── Image slot ──────────────────────────────────────── */
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

export function CaseStudyJoining() {
  const navigate = useNavigate();
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      setScrollProgress(Math.min(1, el.scrollTop / (el.scrollHeight - el.clientHeight)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const setRef = (id: string) => (el: HTMLElement | null) => { sectionRefs.current[id] = el; };

  return (
    <div className={styles.page}>

      {/* Progress bar */}
      <div className={styles.progressBar} style={{ transform: `scaleX(${scrollProgress})` }} />

      {/* ── HERO ─────────────────────────────────── */}
      <section ref={setRef('overview')} id="overview" className={styles.heroSection}>
        <div className={styles.container}>
          <button className={styles.backBtn} onClick={() => { window.location.href = '/#work'; }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All work
          </button>

          <div className={styles.heroLayout}>
            <div className={styles.heroImgCol}>
              <img src="/joining screen.png" alt="Joining Experience" className={styles.heroImg} />
            </div>
            <div className={styles.heroContentCol}>
              <div className={styles.heroEyebrow}>
                <span className={styles.heroCategoryBadge}>UX Redesign</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>Adobe Connect</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>6 Weeks</span>
              </div>
              <h1 className={styles.heroTitle}>Enhancing the joining experience</h1>
              <p className={styles.heroSubtitle}>Redesigning the end-to-end joining flow to reduce friction at the most critical moment , used by nearly every user.</p>
              <div className={styles.heroMetaBar}>
                {[
                  { k: 'Role',     v: 'Lead UX Designer' },
                  { k: 'Scope',    v: 'Login, setup, entry, exit' },
                  { k: 'Platform', v: 'Adobe Connect' },
                  { k: 'Impact',   v: '~50% faster on device setup' },
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

      {/* ── CONTEXT ──────────────────────────────── */}
      <section ref={setRef('context')} id="context" className={jStyles.contextSection}>
        <div className={styles.container}>
          <div className={jStyles.contextInner}>
            <div className={jStyles.contextText}>
              <span className={styles.tag}>Context</span>
              <h2 className={styles.sectionTitle}>The first thing almost every user does</h2>
              <p className={jStyles.contextBody}>The joining flow spans login, device setup, room entry, and exit , a sequence touched by virtually 100% of users. Improving even small friction points here delivers outsized impact across the entire product.</p>
            </div>
            <div className={jStyles.contextStats}>
              {[
                { val: '100%', lbl: 'of users go through this flow' },
                { val: '4',    lbl: 'Distinct stages' },
                { val: '~1 min', lbl: 'for a 30 second setup' },
              ].map(s => (
                <div key={s.val} className={jStyles.contextStat}>
                  <span className={jStyles.contextStatVal}>{s.val}</span>
                  <span className={jStyles.contextStatLbl}>{s.lbl}</span>
                </div>
              ))}
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
              Joining was<br />
              <span className={styles.strikeRed}>slow and disorienting.</span>
            </h2>
          </div>

          <div className={styles.problemGrid}>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>01</span>
              <h3 className={styles.gapTitle}>Inconsistent login placement</h3>
              <p className={styles.gapDesc}>Customizable branding caused the login panel to land in unpredictable positions, breaking spatial memory.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>02</span>
              <h3 className={styles.gapTitle}>Disruptive viewport shifts</h3>
              <p className={styles.gapDesc}>Sudden layout jumps during transitions broke user focus and caused orientation loss at a critical moment.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>03</span>
              <h3 className={styles.gapTitle}>Device setup required too much scanning</h3>
              <p className={styles.gapDesc}>The preference screen was dense with options , users couldn't quickly identify what to act on.</p>
            </div>
          </div>

          <div className={styles.problemImgWrap}>
            <ImgSlot
              src="/Enhancing joining experience/Cluttered layout Problem sec tion new.png"
              label="Before: joining flow with cluttered layout and poor hierarchy"
              aspect="21/9"
            />
          </div>

          <div className={styles.problemResult}>
            <span className={styles.resultLabel}>Result</span>
            <p className={styles.resultText}>Users spent unnecessary time figuring out what to do , creating friction and a poor first impression at the most critical point in the session.</p>
          </div>
        </div>
      </section>

      {/* ── INSIGHT ──────────────────────────────── */}
      <section ref={setRef('insight')} id="insight" className={styles.insightSection}>
        <div className={styles.container}>
          <blockquote className={styles.insightQuote}>
            The joining flow is a <span className={styles.insightEm}>high-stakes moment</span> , it defines the first impression before the session even begins.
          </blockquote>
          <div className={styles.insightBeads}>
            {[
              { title: 'Universal touchpoint', desc: 'Every single user , host or participant , passes through this flow. No other surface has this reach.' },
              { title: 'Friction multiplies at scale', desc: 'A 10-second delay per user compounds into thousands of hours lost across the user base each week.' },
              { title: 'Clarity beats flexibility here', desc: 'This is not a creative canvas. Speed and confidence matter more than customisation options.' },
            ].map(b => (
              <div key={b.title} className={styles.insightBead}>
                <span className={styles.insightBeadIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.5-1.5 4.5-3 6H9c-1.5-1.5-3-3.5-3-6a6 6 0 0 1 6-6z"/>
                    <path d="M9 17v1a3 3 0 0 0 6 0v-1"/>
                  </svg>
                </span>
                <div>
                  <p className={styles.insightBeadTitle}>{b.title}</p>
                  <p className={styles.insightBeadDesc}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APPROACH ─────────────────────────────── */}
      <section ref={setRef('approach')} id="approach" className={jStyles.approachSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Approach</span>
          <h2 className={styles.sectionTitle}>Reframing the flow as a guided journey</h2>
          <p className={styles.sectionSub}>Four design principles drove every decision in this project.</p>
          <div className={jStyles.approachGrid}>
            {[
              { n: '01', title: 'Reduce visual noise',      desc: 'Stripped non-essential elements from each screen so the user\'s eye lands on the action immediately.' },
              { n: '02', title: 'Centralise key actions',   desc: 'Moved primary CTAs to a consistent, predictable location regardless of branding overrides.' },
              { n: '03', title: 'Ensure screen continuity', desc: 'Eliminated jarring layout shifts by designing transitions that maintain the user\'s spatial anchor.' },
              { n: '04', title: 'Design for fast decisions', desc: 'Reorganised device preference into scannable groups so users complete setup in seconds, not minutes.' },
            ].map(a => (
              <div key={a.n} className={jStyles.approachCard}>
                <span className={jStyles.approachNum}>{a.n}</span>
                <h3 className={jStyles.approachTitle}>{a.title}</h3>
                <p className={jStyles.approachDesc}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY DECISIONS ────────────────────────── */}
      <section ref={setRef('decisions')} id="decisions" className={styles.decisionsSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Key Decisions</span>
          <h2 className={styles.sectionTitle}>4 calls that simplified the flow</h2>
          <div className={styles.decisionsGrid}>
            {[
              {
                n: '01', title: 'Single modal view for all settings',
                body: 'Consolidated all pre-join settings into one modal so the user never loses their place. We do not change the area where the user focuses throughout the setup flow.',
                accent: 'Focus preserved · No context switching',
                img: '/Enhancing joining experience/Single modal view.png',
                imgLabel: 'Single modal view, all settings in one place without shifting the users focus',
              },
              {
                n: '02', title: 'Usability first, branding second',
                body: 'A deliberate reversal of a previous product decision. We shifted focus from branding compliance to making the experience usable, ensuring the layout works for every user regardless of host customisation.',
                accent: 'Usability over compliance · Consistent layout',
                img: '/Enhancing joining experience/Usability first.png',
                imgLabel: 'Branding zone contained, usability layout anchored across all host themes',
              },
              {
                n: '03', title: 'Regroup settings by decision tier',
                body: 'Reorganised the preference screen into two clear groups: audio and video. Previous device settings pre-fill to reduce effort for returning users.',
                accent: 'Faster scanning · Memory recall',
                img: '/Enhancing joining experience/Re group.png',
                imgLabel: 'Device setup, old scattered layout vs. grouped decision-first layout',
              },
              {
                n: '04', title: 'Bring system feedback upfront',
                body: 'Moved joining-status indicators from a hidden corner to an inline, contextual position so users always know what is happening during room entry.',
                accent: 'Visibility · Reduced anxiety',
                img: '/Enhancing joining experience/Room entry.png',
                imgLabel: 'Room entry feedback, inline status bar with clear state labels',
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
          <h2 className={styles.sectionTitle}>Four stages, one coherent journey</h2>
          <p className={styles.sectionSub}>Each stage was redesigned independently then stitched into a continuous, confidence-building flow.</p>
        </div>

        <div className={styles.solutionFlow}>
          {[
            {
              n: '01', step: 'Login',
              color: 'var(--accent-indigo)',
              desc: 'Anchored login panel with consistent positioning. Branding lives in a designated zone that never displaces the action. Clear hierarchy guides users to authenticate immediately.',
              attrs: ['Fixed anchor zone', 'Brand-safe layout', 'Single primary action'],
              img: '/Enhancing joining experience/Login page.png',
              imgLabel: 'Redesigned login screen, fixed panel with brand zone and clear CTA',
            },
            {
              n: '02', step: 'Device Setup',
              color: 'var(--accent-violet)',
              desc: 'Grouped audio and video preferences separately. Previous settings auto-fill for returning users. One clear confirmation button instead of scattered controls.',
              attrs: ['Grouped by type', 'Pre-filled settings', 'Reduced cognitive load'],
              img: '/Enhancing joining experience/Device setup.png',
              imgLabel: 'Device preference screen, grouped audio/video with pre-fill state',
            },
            {
              n: '03', step: 'Room Entry',
              color: 'var(--accent-blue)',
              desc: 'Inline feedback during the joining handshake. Users see exactly what is happening, connecting, checking permissions, entering, with no ambiguity.',
              attrs: ['Inline status', 'Progressive feedback', 'Clear state labels'],
              img: '/Enhancing joining experience/Room entry.png',
              imgLabel: 'Room entry, inline joining status with step-by-step feedback',
            },
            {
              n: '04', step: 'Exit and Feedback',
              color: 'var(--accent-indigo)',
              desc: 'Consistent exit flow with a lightweight feedback prompt. Designed to be optional and fast, never blocking the user from leaving.',
              attrs: ['Non-blocking', 'Optional feedback', 'Session summary'],
              img: '/Enhancing joining experience/Exit and feedback.png',
              imgLabel: 'Exit flow, leave confirmation with optional session feedback prompt',
            },
          ].map((s, i) => (
            <div key={s.n} className={`${styles.solutionStep} ${i % 2 === 1 ? styles.solutionStepFlip : ''}`}>
              <div className={styles.solutionImg}>
                <ImgSlot src={s.img} label={s.imgLabel} aspect="4/3" />
              </div>
              <div className={styles.solutionText}>
                <span className={styles.solutionNum} style={{ color: s.color }}>STAGE {s.n}</span>
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

      {/* ── EASE OF USE ──────────────────────────── */}
      <section className={jStyles.easeSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Ease of use</span>
          <h2 className={styles.sectionTitle}>Before and after</h2>
          <p className={styles.sectionSub}>A direct comparison of the joining experience before and after the redesign.</p>
          <div className={jStyles.beforeAfterGrid}>
            <div className={jStyles.beforeAfterCard}>
              <span className={jStyles.beforeAfterLabel} data-type="before">Before</span>
              <ImgSlot src="/Enhancing joining experience/old screen.png" label="Before: original joining flow with fragmented screens and poor hierarchy" aspect="4/3" />
            </div>
            <div className={jStyles.beforeAfterCard}>
              <span className={jStyles.beforeAfterLabel} data-type="after">After</span>
              <ImgSlot src="/Enhancing joining experience/New screen.png" label="After: redesigned joining flow with anchored login and grouped device setup" aspect="4/3" />
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT ───────────────────────────────── */}
      <section ref={setRef('impact')} id="impact" className={styles.impactSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Impact</span>
          <h2 className={styles.sectionTitle}>Faster, clearer, and more intuitive</h2>
          <p className={styles.sectionSub}>Measurable improvements across every stage of the joining journey.</p>
          <div className={styles.impactMetrics}>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>~50%</span>
              <span className={styles.impactLbl}>reduction in time on device preference screen</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>↑</span>
              <span className={styles.impactLbl}>faster scanning and decision-making across all stages</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>250T</span>
              <span className={styles.impactLbl}>Users appreciated the design decision</span>
            </div>
          </div>
          <div className={styles.impactOutcomes}>
            {[
              'Previous device settings reused automatically for returning users',
              'Mobile experience significantly improved with responsive layout changes',
              'Consistent login anchor eliminated positional confusion across branding themes',
              'Inline room entry feedback reduced uncertainty during connection handshake',
            ].map(o => (
              <div key={o} className={styles.impactOutcome}>
                <span className={styles.impactCheck} />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VALIDATION ───────────────────────────── */}
      <section ref={setRef('validation')} id="validation" className={jStyles.validationSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Validation</span>
          <h2 className={styles.sectionTitle}>Evidence that confirmed the direction</h2>
          <p className={styles.sectionSub}>Research methods that revealed where friction lived and proved improvements worked.</p>
          <div className={jStyles.validationGrid}>
            <div className={jStyles.validationCard}>
              <ImgSlot src="/Enhancing joining experience/Eye tracking.png" label="Eye-tracking overlay on original device setup screen showing scattered gaze paths" aspect="4/3" />
              <div className={jStyles.validationCardBody}>
                <span className={jStyles.validationMethod}>Eye-tracking</span>
                <p className={jStyles.validationText}>Gaze paths on the original device screen were scattered across the full viewport. After redesign, fixations concentrated on the two decision zones within 2 seconds.</p>
              </div>
            </div>
            <div className={jStyles.validationCard}>
              <ImgSlot src="/Enhancing joining experience/Clcik heatmap.png" label="Click heatmap showing action concentration improvement on login panel" aspect="4/3" />
              <div className={jStyles.validationCardBody}>
                <span className={jStyles.validationMethod}>Click heatmaps</span>
                <p className={jStyles.validationText}>Click distribution on the login screen shifted from dispersed to tightly clustered around the primary CTA after anchoring the panel to a fixed zone.</p>
              </div>
            </div>
            <div className={jStyles.validationCard}>
              <ImgSlot src="/Enhancing joining experience/Session recording.png" label="Session recording showing reduced hesitation in the redesigned flow" aspect="4/3" />
              <div className={jStyles.validationCardBody}>
                <span className={jStyles.validationMethod}>Session recordings</span>
                <p className={jStyles.validationText}>Recordings of the device setup screen showed users pausing and scrolling on the old design. Post-redesign sessions showed direct interactions with minimal hesitation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARNINGS ────────────────────────────── */}
      <section ref={setRef('next')} id="next" className={styles.endSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Learnings</span>
          <h2 className={styles.sectionTitle}>What this taught me</h2>
          <div className={styles.learningsGrid}>
            {[
              { num: '01', h: 'Universal flows deserve the most design attention', b: 'When a flow is used by everyone, even marginal friction compounds into significant product pain. Invest here first.' },
              { num: '02', h: 'Stability is a feature in high-stakes moments', b: 'Predictable layout and zero surprising shifts aren\'t just polish , they\'re the core UX requirement when the user is already in a focused state.' },
              { num: '03', h: 'Research reveals what intuition misses', b: 'Eye-tracking showed the device screen was unreadable in ways no heuristic review had caught. Observable data beats assumed knowledge.' },
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

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <button className={styles.bottomBack} onClick={() => { window.location.href = '/#work'; }}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to all work
          </button>
          <span className={styles.bottomMeta}>Joining Experience · Adobe Connect · 2022</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
