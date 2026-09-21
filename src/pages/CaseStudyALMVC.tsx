import { useEffect, useRef, useState } from 'react';
import { Footer } from '../components/Footer';
import { ProjectCarousel } from '../components/ProjectCarousel';
import { GoBackButton } from '../components/GoBackButton';
import { useEggOnDeepRead } from '../hooks/useEggOnDeepRead';
import { initPageScrollTracking } from '../lib/analytics';
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

  useEggOnDeepRead(scrollProgress);

  useEffect(() => initPageScrollTracking('project'), []);

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
              <ImgSlot src="/Projectcard-images/ALMVC hero image.webp" label="ALMVC Virtual Classroom Overview" aspect="4/3" />
            </div>
            <div className={styles.heroContentCol}>
              <div className={styles.heroEyebrow}>
                <span className={styles.heroCategoryBadge}>0→1 Product</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>Adobe</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>6 Months</span>
              </div>
              <h1 className={styles.heroTitle}>Building Adobe's native virtual classroom</h1>
              <p className={styles.heroSubtitle}>Adobe Learning Manager had no owned live session product. ALMVC was designed and shipped in 6 months as a 0→1 initiative, building a full enterprise-grade virtual classroom purpose-built for training rather than repurposed from a meetings tool.</p>
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
              <h2 className={styles.sectionTitle}>Adobe Learning Manager needed to complete their training ecosystem.</h2>
              <p className={aStyles.contextBody}>Adobe Learning Manager relied on external tools to run virtual classroom courses. ALM used general-purpose meeting tools like MS Teams, Zoom, and WebEx, which are built for easy communication, not enterprise virtual training. The Adobe Connect team was brought in to create a native virtual training tool for ALM.</p>
            </div>
            <div className={aStyles.contextLogos}>
              <div className={aStyles.contextLogoCard}>
                <span className={aStyles.contextLogoIcon}>
                  <img src="/ALMVC/ALM logo.png" alt="Adobe Learning Manager" className={aStyles.contextLogoImg} />
                </span>
                <span className={aStyles.contextLogoName}>Adobe Learning<br />Manager</span>
              </div>
              <span className={aStyles.contextLogoX}>×</span>
              <div className={aStyles.contextLogoCard}>
                <span className={aStyles.contextLogoIcon}>
                  <img src="/ALMVC/Adobe_Connect_icon_(2020).svg (1).webp" alt="Adobe Connect" className={aStyles.contextLogoImg} />
                </span>
                <span className={aStyles.contextLogoName}>Adobe<br />Connect</span>
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
              Live learning in ALM had{'\n'}
              <span className={styles.strikeRed}>no product of its own.</span>
            </h2>
          </div>

          <p className={aStyles.obviousQ}>
            The obvious question: <strong>&ldquo;Why can&rsquo;t we just reuse Adobe Connect?&rdquo;</strong>
          </p>

          <div className={aStyles.gapBlock}>
            <span className={aStyles.gapEyebrow}>Why ALM Live Hub?</span>
            <h3 className={aStyles.gapHeading}>Bridging the learning gap</h3>
            <p className={aStyles.gapSub}>No tool had it all that an instructor wanted.</p>

            <div className={aStyles.gapGrid}>
              <div className={aStyles.gapCard}>
                <div className={aStyles.gapIcons}>
                  <span className={aStyles.gapIcon}>
                    <img src="/ALMVC/zoom-logo-in-blue-colors-meetings-app-logotype-illustration-free-png 1.png" alt="Zoom" className={aStyles.gapIconImg} />
                  </span>
                  <span className={aStyles.gapIcon}>
                    <img src="/ALMVC/Microsoft_Office_Teams_(2025–present).svg 1.png" alt="Microsoft Teams" className={aStyles.gapIconImg} />
                  </span>
                  <span className={aStyles.gapIcon}>
                    <img src="/ALMVC/logo_meet_2026_color_2x_web_96dp 1.png" alt="Google Meet" className={aStyles.gapIconImg} />
                  </span>
                </div>
                <h4 className={aStyles.gapCardTitle}>Light, easy, built for meetings</h4>
                <p className={aStyles.gapCardDesc}>Zoom, Teams, Google Meet: familiar and easy to join, but screen-share and conversation tools only. No tooling for teaching, breakouts, assessments, Q&amp;A management, or extensive learner performance reporting.</p>
              </div>

              <div className={`${aStyles.gapCard} ${aStyles.gapCardCenter}`}>
                <span className={aStyles.gapCenterBadge}>ALM Live Hub</span>
                <h4 className={aStyles.gapCardTitle}>Training-first, AI-powered virtual classroom</h4>
                <p className={aStyles.gapCardDesc}>Familiar enough to join like a meeting, but built training-first from the ground up, with AI-powered capabilities to help instructors and learners wherever it's needed.</p>
              </div>

              <div className={aStyles.gapCard}>
                <div className={aStyles.gapIcons}>
                  <span className={aStyles.gapIcon}>
                    <img src="/ALMVC/Adobe_Connect_icon_(2020).svg (1).webp" alt="Adobe Connect" className={aStyles.gapIconImg} />
                  </span>
                </div>
                <h4 className={aStyles.gapCardTitle}>Heavy, complex legacy</h4>
                <p className={aStyles.gapCardDesc}>Adobe Connect is extremely powerful for training, but a steep learning curve and dated, click-heavy menus hold it back. <em>&ldquo;Adobe Connect is like a product from the 2000's,&rdquo; said one instructor.</em></p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── OPPORTUNITY ──────────────────────────── */}
      <section ref={setRef('opportunity')} id="opportunity" className={aStyles.opportunitySection}>
        <div className={styles.container}>
          <div className={aStyles.opportunityInner}>
            <div className={aStyles.opportunityImgCol}>
              <img src="/ALMVC/opportunity-picture.webp" alt="Cross-functional team discussing the ALM Live Hub opportunity" className={aStyles.opportunityImg} />
            </div>
            <div className={aStyles.opportunityTextCol}>
              <span className={aStyles.opportunityLabel}>Opportunity</span>
              <blockquote className={aStyles.opportunityText}>
                &ldquo;Build a native classroom that owns the full session lifecycle inside ALM, purpose-built for structured learning, replacing disconnected integrations with a single coherent product.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── APPROACH ─────────────────────────────── */}
      <section ref={setRef('approach')} id="approach" className={aStyles.approachSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Approach</span>
          <h2 className={styles.sectionTitle}>Understanding our users to shape our core design principles</h2>
          <p className={styles.sectionSub}>Talking to instructors and studying what competing products already offered surfaced four consistent expectations that shaped every design decision that followed.</p>
          <div className={aStyles.approachGrid}>
            {[
              { n: '01', title: 'Familiarity reduces onboarding effort', desc: 'Instructors need complete control of the space, with enough familiarity in the tool that onboarding effort stays low.' },
              { n: '02', title: 'Feature parity, training-oriented', desc: 'Users expect the full breadth of features already available across meeting and classroom products, just re-oriented toward training instead of general communication.' },
              { n: '03', title: 'AI-native workflow integration', desc: 'A product built in 2026 needs deep, considered AI integration woven into the workflow, one that makes training orchestration and classroom management genuinely simpler.' },
              { n: '04', title: 'Clean and simple by default', desc: 'Beneath all the capability, the experience still needs to feel clean and simple to use.' },
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
          <h2 className={styles.sectionTitle}>4 architectural decisions that defined the product</h2>
          <div className={styles.decisionsGrid}>
            {[
              {
                n: '01', title: 'Own the full session lifecycle in-product',
                body: 'Buying a third-party classroom would have closed the immediate gap but not the ownership problem. Every stage was built in-house: joining, device setup, classroom, breakouts, exit, recording. Coherent state management and clear end-to-end accountability required owning all of it.',
                accent: 'Session ownership · State continuity',
                img: '/ALMVC/Key decision 1.webp',
              },
              {
                n: '02', title: 'Build a training interaction model, not adapt a meetings one',
                body: 'Meeting platforms optimize for equal participation. Training requires role differentiation, paced delivery, and host authority. We built the interaction model from first principles: role-aware layouts, permission-based controls, engagement tooling built for structured learning.',
                accent: 'Role architecture · Training-first design',
                img: '/ALMVC/Key decsion 2.webp',
              },
              {
                n: '03', title: 'Embed AI inside the workflow, not alongside it',
                body: 'We rejected the AI-panel-as-sidebar pattern. Poll generation is embedded inside live session state: invoke, edit, launch, exit. No tool switch. No flow interruption.',
                accent: 'Workflow-native AI · Zero context-switch',
                img: '/ALMVC/Key decision 3.webp',
              },
              {
                n: '04', title: 'Design recordings as a learning product, not a capture',
                body: 'Session recordings are typically treated as archives. We designed the viewer as a structured learning asset: topic-tagged, chapter-navigable, linked to session context. The breakout bird\'s-eye view surfaces room headcount, activity state, and elapsed time. Passive awareness, no interruption required.',
                accent: 'Learning continuity · Passive awareness',
                img: '/ALMVC/Key decision 4.webp',
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
          <h2 className={styles.sectionTitle}>Four workflow areas built from scratch</h2>
          <p className={styles.sectionSub}>Each area was designed as a distinct ownership zone, then connected into a single continuous session arc. The product owns every stage.</p>
        </div>

        <div className={styles.solutionFlow}>
          {[
            {
              n: '01', step: 'Joining and Session Readiness',
              color: 'var(--accent-indigo)',
              desc: 'The pre-session flow validates device configuration and surfaces role-appropriate context before entry. Joining states are visible to hosts as part of the session lifecycle. The exit mirrors this: completion states, direct recording access, continuity into the learner\'s training path.',
              attrs: ['Session state visibility', 'Role-aware onboarding', 'Guided device readiness'],
              img: '/ALMVC/Joining screen.webp',
            },
            {
              n: '02', step: 'Classroom and Interaction Architecture',
              color: 'var(--accent-violet)',
              desc: 'The classroom reduces cognitive overhead for instructors managing content, participation, and moderation simultaneously. Controls surface based on session state and role. Layout modes reflect how instructors actually structure sessions: content-primary, collaboration-primary, focus.',
              attrs: ['Context-aware controls', 'Role-differentiated surfaces', 'Instructor workflow optimization'],
              img: '/ALMVC/Classroom layout.webp',
            },
            {
              n: '03', step: 'Engagement and AI Assistance',
              color: 'var(--accent-blue)',
              desc: 'Participation tools reduce the operational cost of contributing in a live session. AI-assisted poll generation is a mid-session capability: surface, review, launch, without leaving the classroom. Several manual steps collapsed to one.',
              attrs: ['Reduced participation friction', 'Workflow-native AI', 'Real-time session responsiveness'],
              img: '/ALMVC/Engagements.webp',
            },
            {
              n: '04', step: 'Breakouts and Recording Architecture',
              color: 'var(--accent-indigo)',
              desc: "The bird's-eye breakout view surfaces participant count, activity state, and elapsed time per room, with no joining required. The recording viewer is topic-navigable and chapter-tagged, giving post-session review the same structure as the live experience.",
              attrs: ['Passive spatial awareness', 'Non-disruptive observation', 'Structured recording architecture'],
              img: '/ALMVC/Breakouts.webp',
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
          <span className={styles.tag}>Interaction Details</span>
          <h2 className={styles.sectionTitle}>Behavioral decisions that shaped operational quality</h2>
          <p className={styles.sectionSub}>Four interaction decisions made at the system level, not the screen level.</p>

          {/* ── Craft moment cards ── */}
          <div className={aStyles.craftGrid}>
            {[
              {
                label: 'Session readiness',
                title: 'Validated entry, not open entry',
                desc: 'Sequenced to mirror operational readiness: device validation, context review, role confirmation. Each stage is skippable except where failure would directly disrupt the session.',
                icon: 'bi-shield-check',
              },
              {
                label: 'Control architecture',
                title: 'Permission-gated host controls',
                desc: 'Host-only controls are removed from the learner view, not grayed out. State-dependent controls appear when active and disappear when not. Visible surface area stays minimal regardless of session complexity.',
                icon: 'bi-sliders',
              },
              {
                label: 'AI integration',
                title: 'Poll generation inside session state',
                desc: 'Opens as a mid-session overlay. The instructor reviews, edits, and launches a poll without leaving the classroom. One action to invoke, one to launch, exits clean.',
                icon: 'bi-stars',
              },
              {
                label: 'Spatial orchestration',
                title: 'Breakout awareness without intervention',
                desc: 'A read-only operational layer. Instructors see participant count, activity signals, and elapsed time per room. Joining is explicit, not automatic. Passive awareness is the default.',
                icon: 'bi-grid-3x3-gap',
              },
            ].map((c, i) => (
              <div key={i} className={aStyles.craftCard}>
                <span className={aStyles.craftIcon}>
                  <i className={`bi ${c.icon}`} aria-hidden="true" />
                </span>
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
                <h3 className={aStyles.audioCuesTitle}>Notification sound design outside the design system</h3>
                <p className={aStyles.audioIntro}>Raise-hand, participant join, poll launch, attention request: each carries operational meaning in a live session. None of these patterns existed in Adobe Spectrum. The cue set was designed from scratch: tonally distinct, non-disruptive, recognizable without visual confirmation.</p>
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
              <h2 className={styles.sectionTitle}>A mobile experience designed for learners</h2>
              <p className={aStyles.mobileBody}>
                Replicating instructor controls on mobile would have compromised both usability and delivery timelines. The instructor surface manages session state, participants, and breakouts simultaneously. That interaction density doesn't compress cleanly to touch without a separate design effort.
              </p>
              <ul className={aStyles.mobilePoints}>
                {[
                  { icon: 'bi-phone', text: 'V1 mobile was scoped around learner workflows: less operationally complex, more commonly accessed on mobile.' },
                  { icon: 'bi-layout-three-columns', text: 'Instructor controls were deferred with a defined roadmap, not deprioritized without intent.' },
                  { icon: 'bi-hand-index-thumb', text: 'Touch patterns were factored into component-level layout decisions so the instructor mobile experience won\'t require a full redesign.' },
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
              <img src="/ALMVC/Mobile screens.webp" alt="ALMVC mobile screens" className={aStyles.mobileImgEl} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CONSTRAINTS ──────────────────────────── */}
      <section ref={setRef('constraints')} id="constraints" className={aStyles.constraintsSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Constraints &amp; Tradeoffs</span>
          <h2 className={styles.sectionTitle}>Constraints, Tradeoffs &amp; Execution Realities</h2>
          <p className={styles.sectionSub}>Building a 0→1 enterprise product within a six-month timeline required balancing usability, technical feasibility, stakeholder alignment, enterprise customization requirements, and delivery scope simultaneously.</p>
          <p className={styles.sectionSub}>Many of the most important product decisions emerged through constraints rather than ideal scenarios.</p>

          <div className={aStyles.constraintsList}>

            {/* Block 1 */}
            <div className={aStyles.constraintBlock}>
              <div className={aStyles.constraintLeft}>
                <span className={aStyles.constraintNum}>01</span>
                <h3 className={aStyles.constraintTitle}>Aligning cross-geo stakeholders asynchronously</h3>
              </div>
              <div className={aStyles.constraintRight}>
                <p className={aStyles.constraintBody}>
                  The project involved stakeholders distributed across teams and geographies, making continuous alignment difficult within a fast-moving delivery timeline.
                </p>
                <p className={aStyles.constraintBody}>
                  To reduce feedback bottlenecks, I introduced an asynchronous review process using structured design walkthroughs and targeted feedback requests over email, breaking discussions into smaller incremental loops that shaped the product continuously without slowing execution.
                </p>
                <div className={aStyles.constraintTags}>
                  {['Cross-functional alignment', 'Async collaboration', 'Stakeholder management', 'Design communication'].map(t => (
                    <span key={t} className={aStyles.constraintTag}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Block 2 */}
            <div className={aStyles.constraintBlock}>
              <div className={aStyles.constraintLeft}>
                <span className={aStyles.constraintNum}>02</span>
                <h3 className={aStyles.constraintTitle}>Designing within browser and performance limitations</h3>
              </div>
              <div className={aStyles.constraintRight}>
                <p className={aStyles.constraintBody}>
                  The entire classroom experience had to run natively inside the browser while supporting live collaboration, breakout systems, engagement workflows, and real-time interactions, introducing real technical and performance constraints on interaction decisions and feature scope.
                </p>
                <p className={aStyles.constraintBody}>Every feature needed to balance:</p>
                <ul className={aStyles.constraintList}>
                  <li className={aStyles.constraintListItem}>responsiveness</li>
                  <li className={aStyles.constraintListItem}>scalability</li>
                  <li className={aStyles.constraintListItem}>browser performance</li>
                  <li className={aStyles.constraintListItem}>cognitive simplicity</li>
                  <li className={aStyles.constraintListItem}>enterprise reliability</li>
                </ul>
                <p className={aStyles.constraintBody}>
                  Several workflows were simplified intentionally to preserve performance and usability under real-world usage conditions without compromising the overall classroom experience.
                </p>
                <div className={aStyles.constraintTags}>
                  {['Browser-based architecture', 'Performance-aware UX', 'Scalable systems', 'Enterprise constraints'].map(t => (
                    <span key={t} className={aStyles.constraintTag}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Block 3 */}
            <div className={aStyles.constraintBlock}>
              <div className={aStyles.constraintLeft}>
                <span className={aStyles.constraintNum}>03</span>
                <h3 className={aStyles.constraintTitle}>Balancing modern UX with enterprise white-label flexibility</h3>
              </div>
              <div className={aStyles.constraintRight}>
                <p className={aStyles.constraintBody}>
                  One of the biggest product tensions was balancing a clean, modern classroom experience with the flexibility enterprise white-label customization requires, while staying aligned with Adobe Learning Manager's broader visual ecosystem.
                </p>
                <p className={aStyles.constraintBody}>This meant designing interaction systems and layouts that:</p>
                <ul className={aStyles.constraintList}>
                  <li className={aStyles.constraintListItem}>remained visually clean</li>
                  <li className={aStyles.constraintListItem}>supported configurable branding</li>
                  <li className={aStyles.constraintListItem}>preserved usability consistency</li>
                  <li className={aStyles.constraintListItem}>scaled across enterprise implementations</li>
                </ul>
                <p className={aStyles.constraintBody}>
                  Rather than treating customization as a visual layer alone, the system was structured to support flexibility without fragmenting the user experience.
                </p>
                <div className={aStyles.constraintTags}>
                  {['Enterprise customization', 'White-label systems', 'Design systems', 'Scalable UX'].map(t => (
                    <span key={t} className={aStyles.constraintTag}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Block 4 */}
            <div className={aStyles.constraintBlock}>
              <div className={aStyles.constraintLeft}>
                <span className={aStyles.constraintNum}>04</span>
                <h3 className={aStyles.constraintTitle}>Prioritizing the mobile experience intentionally</h3>
              </div>
              <div className={aStyles.constraintRight}>
                <p className={aStyles.constraintBody}>
                  Designing desktop and mobile simultaneously introduced real complexity for a live classroom product with dense interaction requirements. Early explorations showed that replicating the full instructor experience on mobile would compromise usability, responsiveness, and delivery timelines.
                </p>
                <p className={aStyles.constraintBody}>
                  Instead of forcing feature parity prematurely, the initial mobile experience was intentionally scoped around learner workflows while prioritizing the more operationally complex instructor experience for desktop. This allowed the team to:
                </p>
                <ul className={aStyles.constraintList}>
                  <li className={aStyles.constraintListItem}>ship a stable V1 within timeline constraints</li>
                  <li className={aStyles.constraintListItem}>validate real mobile usage patterns</li>
                  <li className={aStyles.constraintListItem}>reduce interaction complexity on smaller screens</li>
                  <li className={aStyles.constraintListItem}>establish a clearer roadmap for future mobile expansion</li>
                </ul>
                <p className={aStyles.constraintBody}>
                  The broader instructor experience was planned as part of a future iteration strategy rather than overloading the initial release.
                </p>
                <div className={aStyles.constraintTags}>
                  {['Product prioritization', 'Responsive systems', 'Roadmap strategy', 'Mobile tradeoffs'].map(t => (
                    <span key={t} className={aStyles.constraintTag}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── IMPACT ───────────────────────────────── */}
      <section ref={setRef('impact')} id="impact" className={styles.impactSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Impact</span>
          <h2 className={styles.sectionTitle}>A native virtual classroom owned end-to-end, delivered in 6 months</h2>
          <p className={styles.sectionSub}>The product replaced fragmented integrations with a single, coherent live session experience inside Adobe Learning Manager.</p>
          <div className={styles.impactMetrics}>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>6 mo</span>
              <span className={styles.impactLbl}>0→1 delivered in a single product cycle</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>5+</span>
              <span className={styles.impactLbl}>major workflow areas owned in-product for the first time</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>3</span>
              <span className={styles.impactLbl}>user roles served within one interaction system</span>
            </div>
          </div>
          <div className={styles.impactOutcomes}>
            {[
              "ALM's first native virtual classroom, removing dependency on third-party integrations for live learning",
              'Full session lifecycle owned in-product, from joining through recording, with no external handoffs',
              'AI-assisted poll generation reduced mid-session engagement workflow from multiple steps to one',
              'Recording viewer redesigned as a structured learning asset with topic navigation and chapter access',
              'Breakout orchestration system enabled passive multi-room awareness without interrupting active sessions',
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
          <h2 className={styles.sectionTitle}>What the project confirmed</h2>
          <div className={styles.learningsGrid}>
            {[
              { num: '01', h: 'Live product complexity demands interaction precision', b: 'State changes happen continuously. Instructors can\'t recover from interaction errors mid-session. The consistent signal: reduce the ways something can go wrong before optimizing what happens when it does.' },
              { num: '02', h: 'AI integration earns trust through restraint', b: 'The most effective AI features added no visible complexity. When AI operates inside an existing workflow, adoption follows. Every feature that required learning a new pattern was the first to be cut.' },
              { num: '03', h: 'Enterprise UX quality is defined at the seams', b: 'The weakest moments were at transitions: joining to classroom, classroom to breakout, session to recording. Early continuity decisions had more impact on perceived quality than any individual screen redesign.' },
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
