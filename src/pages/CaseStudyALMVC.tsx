import { useEffect, useRef, useState } from 'react';
import { Footer } from '../components/Footer';
import { ProjectCarousel } from '../components/ProjectCarousel';
import { GoBackButton } from '../components/GoBackButton';
import styles from './CaseStudyQuiz.module.css';
import aStyles from './CaseStudyALMVC.module.css';

/* ── Image slot ──────────────────────────────────────── */
function ImgSlot({ src, label, aspect = '16/9' }: { src?: string; label: string; aspect?: string }) {
  if (src) {
    return (
      <div className={styles.imgSlotWrap} style={{ aspectRatio: aspect }}>
        <img src={src} alt={label} className={styles.imgSlotReal} />
      </div>
    );
  }
  return (
    <div className={styles.imgSlot} style={{ aspectRatio: aspect }}>
      <i className={"bi bi-image " + styles.imgSlotIcon} style={{ fontSize: '20px' }} aria-hidden="true" />
      <span className={styles.imgSlotLabel}>{label}</span>
    </div>
  );
}

export function CaseStudyALMVC() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

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
          <GoBackButton className={styles.backBtn} />

          <div className={styles.heroLayout}>
            <div className={styles.heroImgCol}>
              <ImgSlot src="/ALMVC/ALMVC hero image.png" label="ALMVC Virtual Classroom Overview" aspect="4/3" />
            </div>
            <div className={styles.heroContentCol}>
              <div className={styles.heroEyebrow}>
                <span className={styles.heroCategoryBadge}>0→1 Product</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>Adobe</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>6 Months</span>
              </div>
              <h1 className={styles.heroTitle}>Virtual classrooms reimagined.</h1>
              <p className={styles.heroSubtitle}>A 0→1 product built from the ground up, creating a modern virtual learning platform purpose-built for training inside Adobe Learning Manager.</p>
              <div className={styles.heroMetaBar}>
                {[
                  { k: 'Role',     v: 'Lead Product Designer' },
                  { k: 'Timeline', v: '6-month initiative' },
                  { k: 'Platform', v: 'Web-based Classroom' },
                  { k: 'Focus',    v: '0→1 product direction' },
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
      <section ref={setRef('context')} id="context" className={aStyles.contextSection}>
        <div className={styles.container}>
          <div className={aStyles.contextInner}>
            <div className={aStyles.contextText}>
              <span className={styles.tag}>Context</span>
              <h2 className={styles.sectionTitle}>A product that didn't exist yet. But needed to.</h2>
              <p className={aStyles.contextBody}>Adobe Learning Manager needed a native virtual classroom, built specifically for training and not repurposed from a meetings tool. ALMVC was designed from scratch: a new product that married the depth of enterprise learning with the fluidity users expect from modern collaboration platforms.</p>
            </div>
            <div className={aStyles.contextStats}>
              {[
                { val: '6 mo',  lbl: 'End-to-end delivery timeline' },
                { val: '3',     lbl: 'Primary user groups designed for' },
                { val: '5+',    lbl: 'Major feature areas shipped' },
              ].map(s => (
                <div key={s.val} className={aStyles.contextStat}>
                  <span className={aStyles.contextStatVal}>{s.val}</span>
                  <span className={aStyles.contextStatLbl}>{s.lbl}</span>
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
              Live learning in ALM had{'\n'}
              <span className={styles.strikeRed}>no product of its own.</span>
            </h2>
          </div>

          <div className={styles.problemGrid}>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>01</span>
              <h3 className={styles.gapTitle}>No native classroom experience</h3>
              <p className={styles.gapDesc}>Adobe Learning Manager lacked a first-party virtual classroom. Live sessions were bolted on through third-party integrations that created disjointed, inconsistent learner experiences.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>02</span>
              <h3 className={styles.gapTitle}>The full session lifecycle was unowned</h3>
              <p className={styles.gapDesc}>Joining, participation, breakouts, and exit were fragmented across tools. Nobody owned the end-to-end learning journey, and it showed in every handoff.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>03</span>
              <h3 className={styles.gapTitle}>Enterprise needs vs. modern expectations</h3>
              <p className={styles.gapDesc}>Training use cases demand structured controls, roles, and engagement tools. But learners now expect the speed and clarity of modern collaboration platforms. No existing product bridged both.</p>
            </div>
          </div>

          <div className={styles.problemResult}>
            <span className={styles.resultLabel}>Opportunity</span>
            <p className={styles.resultText}>Build a native virtual classroom from scratch, purpose-built for learning and not adapted from meetings, that could own the full live session experience inside Adobe Learning Manager.</p>
          </div>
        </div>
      </section>

      {/* ── INSIGHT ──────────────────────────────── */}
      <section ref={setRef('insight')} id="insight" className={styles.insightSection}>
        <div className={styles.container}>
          <blockquote className={styles.insightQuote}>
            The most powerful classroom is one where the technology <span className={styles.insightEm}>disappears</span>, leaving only the learning.
          </blockquote>
          <div className={styles.insightBeads}>
            {[
              { title: 'Simplicity enables depth', desc: 'When the interface gets out of the way, instructors can focus entirely on teaching and learners can focus entirely on learning.' },
              { title: 'Every stage is part of the experience', desc: 'Joining, participation, breakouts, and exit are all part of a continuous learning journey, not isolated technical events.' },
              { title: 'AI should feel invisible', desc: 'AI assistance works best when it reduces friction naturally, without demanding user attention or interrupting teaching flow.' },
            ].map(b => (
              <div key={b.title} className={styles.insightBead}>
                <span className={styles.insightBeadIcon}>
                  <i className="bi bi-lightbulb" style={{ fontSize: '18px' }} aria-hidden="true" />
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
      <section ref={setRef('approach')} id="approach" className={aStyles.approachSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Approach</span>
          <h2 className={styles.sectionTitle}>Five principles we built the platform on</h2>
          <p className={styles.sectionSub}>Starting from zero meant every decision had to be intentional. These five principles shaped everything we shipped.</p>
          <div className={aStyles.approachGrid5}>
            {[
              { n: '01', title: 'Clarity Before Complexity',     desc: 'Make the experience predictable and guided to reduce user anxiety at every stage.' },
              { n: '02', title: 'Progressive Disclosure',        desc: 'Expose advanced controls only when needed, protecting first-time users from overwhelm.' },
              { n: '03', title: 'Contextual Guidance',           desc: 'Help users in the moment rather than relying on documentation or prior knowledge.' },
              { n: '04', title: 'Human-Centered Engagement',     desc: 'Encourage participation without overwhelming users with interaction demands.' },
              { n: '05', title: 'Invisible Intelligence',        desc: 'Use AI to support workflows naturally. Never interrupting, always enhancing.' },
            ].map(a => (
              <div key={a.n} className={aStyles.approachCard}>
                <span className={aStyles.approachNum}>{a.n}</span>
                <h3 className={aStyles.approachTitle}>{a.title}</h3>
                <p className={aStyles.approachDesc}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY DECISIONS ────────────────────────── */}
      <section ref={setRef('decisions')} id="decisions" className={styles.decisionsSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Key Decisions</span>
          <h2 className={styles.sectionTitle}>4 foundational bets that defined the product</h2>
          <div className={styles.decisionsGrid}>
            {[
              {
                n: '01', title: 'Own the full session lifecycle',
                body: 'We designed every stage from scratch: joining, device setup, live classroom, breakouts, exit, and recording. No handoffs to third-party tools. One continuous, product-owned learning experience.',
                accent: 'Guided readiness · Learning continuity',
                img: '/ALMVC/Key decision 1.png',
              },
              {
                n: '02', title: 'Build layouts for training, not meetings',
                body: 'Instead of adapting a meetings UI, we created a classroom interaction model from the ground up: context-aware controls, training-first layouts, and side-by-side content modes built specifically for how instructors teach.',
                accent: 'Context-aware · Training-first',
                img: '/ALMVC/Key decsion 2.png',
              },
              {
                n: '03', title: 'Make AI a native participant',
                body: 'We built AI-assisted poll creation directly into the live session flow, not as a separate tool but as a natural extension of teaching. Instructors can generate and launch contextual polls mid-session without breaking their flow.',
                accent: 'Invisible AI · Real-time engagement',
                img: '/ALMVC/Key decision 3.png',
              },
              {
                n: '04', title: 'Turn recordings into learning assets',
                body: 'We built a recording viewer with topic-based navigation from scratch, transforming session archives from passive video files into structured, scannable learning assets. Breakout orchestration gave instructors a bird\'s-eye view of all rooms without disrupting discussions.',
                accent: 'Passive awareness · Actionable recordings',
                img: '/ALMVC/Key decision 4.png',
              },
            ].map(d => (
              <div key={d.n} className={styles.decisionCard}>
                <ImgSlot src={d.img} label={`Key decision ${d.n}: ${d.title}`} aspect="16/9" />
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
          <h2 className={styles.sectionTitle}>Four areas built from scratch</h2>
          <p className={styles.sectionSub}>Each area was designed independently then stitched into a single, continuous learning experience, owned entirely within the product.</p>
        </div>

        <div className={styles.solutionFlow}>
          {[
            {
              n: '01', step: 'Joining & Exit',
              color: 'var(--accent-indigo)',
              desc: 'A guided pre-session readiness flow helps users validate device setup, understand session context, and enter the classroom with confidence. The exit flow provides session completion states, recording access, and continuity into future learning.',
              attrs: ['Guided readiness', 'Role-aware flow', 'Learning continuity'],
              img: '/ALMVC/Joining screen.png',
            },
            {
              n: '02', step: 'Classroom & Layouts',
              color: 'var(--accent-violet)',
              desc: 'The interaction model was built to reduce visual clutter and improve discoverability from day one. Context-aware controls surface based on user role and session state. Layouts were designed specifically for training-heavy workflows, not adapted from generic meetings.',
              attrs: ['Context-aware controls', 'Training-first layouts', 'Side-by-side modes'],
              img: '/ALMVC/Classroom layout.png',
            },
            {
              n: '03', step: 'Engagement Systems',
              color: 'var(--accent-blue)',
              desc: 'AI-assisted poll creation lets instructors react dynamically to classroom energy without operational friction. Lightweight participation signals reduce social friction and make classrooms feel more responsive and collaborative.',
              attrs: ['AI poll generation', 'Real-time awareness', 'Low friction participation'],
              img: '/ALMVC/Engagements.png',
            },
            {
              n: '04', step: 'Breakouts & Recordings',
              color: 'var(--accent-indigo)',
              desc: "Bird's-eye breakout view gives instructors passive awareness across all rooms without disruption. Topic-based recording navigation turns session archives into structured, scannable learning assets users can revisit intentionally.",
              attrs: ["Bird's-eye view", 'Observe mode', 'Topic navigation'],
              img: '/ALMVC/Breakouts.png',
            },
          ].map((s, i) => (
            <div key={s.n} className={`${styles.solutionStep} ${i % 2 === 1 ? styles.solutionStepFlip : ''}`}>
              <div className={styles.solutionImg}>
                <ImgSlot src={s.img} label={`STAGE ${s.n}: ${s.step}`} aspect="4/3" />
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

      {/* ── DESIGN CRAFT ─────────────────────────── */}
      <section ref={setRef('craft')} id="craft" className={aStyles.craftSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Design Craft</span>
          <h2 className={styles.sectionTitle}>Details that shaped the experience</h2>
          <p className={styles.sectionSub}>Beyond the macro flows, several interaction and sensory decisions defined the quality of ALMVC. Each was intentional, each went beyond the feature spec.</p>

          {/* ── Craft moment cards ── */}
          <div className={aStyles.craftGrid}>
            {[
              {
                label: 'Joining flow',
                title: 'Readiness gates before the classroom',
                desc: 'A multi-step pre-check validates device, audio, and session context before the user enters. Designed to reduce join anxiety without creating a wall. Each gate is skippable except the critical ones.',
                img: '/ALMVC/Joining screen.png',
              },
              {
                label: 'Control surface',
                title: 'Role-aware host controls',
                desc: 'Controls surface based on session state and user role. Advanced host tools are hidden until they are contextually relevant, protecting new users from cognitive overload on day one.',
                img: '/ALMVC/Classroom layout.png',
              },
              {
                label: 'AI integration',
                title: 'Inline poll generation',
                desc: 'A contextual AI panel appears as an overlay mid-session. Instructors go from a teaching moment to a live poll in one action, with no context switch and no navigation away from the classroom.',
                img: '/ALMVC/Engagements.png',
              },
              {
                label: 'Spatial awareness',
                title: "Bird's-eye breakout view",
                desc: "Passive status per room (headcount, activity state, elapsed time) lets instructors stay aware of all breakout groups simultaneously, without entering any room or disrupting any discussion.",
                img: '/ALMVC/Breakouts.png',
              },
            ].map((c, i) => (
              <div key={i} className={aStyles.craftCard}>
                <div className={aStyles.craftCardImg}>
                  <ImgSlot src={c.img} label={c.title} aspect="16/9" />
                </div>
                <div className={aStyles.craftCardBody}>
                  <span className={aStyles.craftLabel}>{c.label}</span>
                  <h4 className={aStyles.craftTitle}>{c.title}</h4>
                  <p className={aStyles.craftDesc}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Audio cues ── */}
          <div className={aStyles.audioCuesWrap}>
            <div className={aStyles.audioCuesDivider}>
              <i className="bi bi-volume-up" style={{ fontSize: '14px' }} aria-hidden="true" />
              <span>Sound Design</span>
            </div>
            <div className={aStyles.audioHeader}>
              <div className={aStyles.audioHeaderText}>
                <h3 className={aStyles.audioCuesTitle}>Audio cues built outside the design system</h3>
                <p className={aStyles.audioIntro}>Virtual classrooms rely on sound. Raise hand, participant join, poll launch, attention signal: each moment needed a distinct audio cue. None of these existed in our design system. I designed and validated them from scratch, specifically for a live learning context where audio clarity and non-intrusiveness had to coexist.</p>
              </div>
              <div className={aStyles.audioPills}>
                {[
                  { icon: <i className="bi bi-stars" style={{ fontSize: '20px' }} aria-hidden="true" />, label: 'Not in design system', sub: 'Created from scratch for this product' },
                  { icon: <i className="bi bi-headphones" style={{ fontSize: '20px' }} aria-hidden="true" />, label: 'Context-aware tones', sub: 'Distinct cues per notification type' },
                  { icon: <i className="bi bi-bell-slash" style={{ fontSize: '20px' }} aria-hidden="true" />, label: 'Non-disruptive by design', sub: 'Audible without interrupting the session' },
                ].map(p => (
                  <div key={p.label} className={aStyles.audioPill}>
                    <span className={aStyles.audioPillIcon}>{p.icon}</span>
                    <div>
                      <p className={aStyles.audioPillLabel}>{p.label}</p>
                      <p className={aStyles.audioPillSub}>{p.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={aStyles.videoWrap}>
              <video
                className={aStyles.videoPlayer}
                controls
                playsInline
                preload="metadata"
                src="/ALMVC/almvc-notifications.mp4"
                onError={(e) => { (e.currentTarget as HTMLVideoElement).style.display = 'none'; (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex'; }}
              />
              <div className={aStyles.videoPlaceholder}>
                <div className={aStyles.videoPlaceholderInner}>
                  <span className={aStyles.videoPlaceholderIcon}>
                    <i className="bi bi-play-circle" style={{ fontSize: '40px' }} aria-hidden="true" />
                  </span>
                  <p className={aStyles.videoPlaceholderTitle}>Audio cue walkthrough</p>
                  <p className={aStyles.videoPlaceholderSub}>Drop your video at <code>public/almvc-audio-cues.mp4</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MOBILE ───────────────────────────────── */}
      <section ref={setRef('mobile')} id="mobile" className={aStyles.mobileSection}>
        <div className={styles.container}>
          <div className={aStyles.mobileInner}>
            <div className={aStyles.mobileText}>
              <span className={styles.tag}>Mobile</span>
              <h2 className={styles.sectionTitle}>Designed for every screen from the start</h2>
              <p className={aStyles.mobileBody}>
                Responsiveness was not an afterthought. Mobile interactions including touch targets, thumb zones, and collapsed navigation were factored into every layout decision made on desktop. The result is a classroom experience that works as naturally on a phone as it does on a 27" monitor.
              </p>
              <ul className={aStyles.mobilePoints}>
                {[
                  { icon: 'bi-phone', text: 'Touch-first interaction model considered at the wireframe stage, not retrofitted.' },
                  { icon: 'bi-layout-three-columns', text: 'Fluid grid and adaptive component widths scale gracefully from 1440px down to 375px.' },
                  { icon: 'bi-hand-index-thumb', text: 'Host controls and engagement tools rethought for one-handed use without losing capability.' },
                ].map((p, i) => (
                  <li key={i} className={aStyles.mobilePoint}>
                    <span className={aStyles.mobilePointIcon}>
                      <i className={`bi ${p.icon}`} style={{ fontSize: '16px' }} aria-hidden="true" />
                    </span>
                    <span className={aStyles.mobilePointText}>{p.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={aStyles.mobileImg}>
              <img src="/ALMVC/Mobile screens.png" alt="ALMVC mobile screens" className={aStyles.mobileImgEl} />
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT ───────────────────────────────── */}
      <section ref={setRef('impact')} id="impact" className={styles.impactSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Impact</span>
          <h2 className={styles.sectionTitle}>A first-of-its-kind classroom, shipped in 6 months</h2>
          <p className={styles.sectionSub}>Built from zero: a fully native virtual learning platform inside Adobe Learning Manager.</p>
          <div className={styles.impactMetrics}>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>6 mo</span>
              <span className={styles.impactLbl}>full platform delivered end-to-end</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>↑</span>
              <span className={styles.impactLbl}>engagement through simplified participation</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>5+</span>
              <span className={styles.impactLbl}>major feature areas built from scratch</span>
            </div>
          </div>
          <div className={styles.impactOutcomes}>
            {[
              'First native virtual classroom built inside Adobe Learning Manager',
              'Full session lifecycle owned, from joining to recording, for the first time',
              'AI-assisted engagement made participation more frequent and fluid',
              'Recording viewer shipped as a structured learning asset, not a passive archive',
            ].map(o => (
              <div key={o} className={styles.impactOutcome}>
                <span className={styles.impactCheck} />
                <span>{o}</span>
              </div>
            ))}
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
              { num: '01', h: 'Designing for live environments requires extreme clarity', b: 'Unlike static products, live classrooms involve constant state changes and high cognitive pressure. Small usability improvements can significantly impact confidence and participation.' },
              { num: '02', h: 'AI works best when it feels invisible', b: 'Users respond better to AI when it quietly supports workflows instead of demanding attention. The most effective AI experiences were those that reduced friction naturally.' },
              { num: '03', h: 'Engagement is a UX problem', b: 'Keeping users engaged is not only about features. It is about timing, feedback, interaction rhythm, and reducing participation anxiety.' },
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

      <ProjectCarousel currentId="almvc" />

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <GoBackButton className={styles.bottomBack} label="Go back" />
          <span className={styles.bottomMeta}>ALMVC · Adobe Learning Manager · 2026</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
