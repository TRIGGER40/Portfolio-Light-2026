import { useEffect, useRef, useState } from 'react';
import { Footer } from '../components/Footer';
import { ProjectCarousel } from '../components/ProjectCarousel';
import { GoBackButton } from '../components/GoBackButton';
import { useEggOnDeepRead } from '../hooks/useEggOnDeepRead';
import styles from './CaseStudyQuiz.module.css';
import qStyles from './CaseStudyQC.module.css';

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

export function CaseStudyQC() {
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
              <img src="/Projectcard-images/QC improvement.png" alt="QC Experience" className={styles.heroImg} />
            </div>
            <div className={styles.heroContentCol}>
              <div className={styles.heroEyebrow}>
                <span className={styles.heroCategoryBadge}>Workflow Redesign</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>Bizongo DCMS</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>8 Weeks</span>
              </div>
              <h1 className={styles.heroTitle}>Quality check made easy!</h1>
              <p className={styles.heroSubtitle}>Redesigning the inward quality check process inside Bizongo's DCMS to eliminate compounding inefficiencies at high-volume warehouse operations.</p>
              <div className={styles.heroMetaBar}>
                {[
                  { k: 'Role',     v: 'UX Designer 2' },
                  { k: 'Scope',    v: 'QC module within DCMS' },
                  { k: 'Platform', v: 'Bizongo DCMS' },
                  { k: 'Impact',   v: '~70% efficiency gain' },
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
      <section ref={setRef('context')} id="context" className={qStyles.contextSection}>
        <div className={styles.container}>
          <div className={qStyles.contextInner}>
            <div className={qStyles.contextText}>
              <span className={styles.tag}>Context</span>
              <h2 className={styles.sectionTitle}>A critical process at the heart of warehouse cost</h2>
              <p className={qStyles.contextBody}>The Inward Quality Check is one of the highest-frequency operations in a Bizongo warehouse. Every incoming shipment passes through QC before it can be stocked. Inefficiencies here don't just slow things down , they directly inflate return rates and operational costs at scale.</p>
            </div>
            <div className={qStyles.contextStats}>
              {[
                { val: '~25',      lbl: 'QC criteria checked per product' },
                { val: '12',       lbl: 'Clicks required per single check' },
                { val: '1000/hr',  lbl: 'Incoming pieces during peak operations' },
              ].map(s => (
                <div key={s.val} className={qStyles.contextStat}>
                  <span className={qStyles.contextStatVal}>{s.val}</span>
                  <span className={qStyles.contextStatLbl}>{s.lbl}</span>
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
              A broken process made<br />
              <span className={styles.strikeRed}>more expensive at scale.</span>
            </h2>
          </div>

          <div className={styles.problemGrid}>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>01</span>
              <h3 className={styles.gapTitle}>Excessive steps per check</h3>
              <p className={styles.gapDesc}>Every single QC criterion required ~15 seconds and 12 clicks. Across 25 criteria per product, that compounds into minutes per unit during 1000-piece operations.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>02</span>
              <h3 className={styles.gapTitle}>No logical grouping or hierarchy</h3>
              <p className={styles.gapDesc}>All QC criteria were presented as a flat list with no structure. Executives had to mentally track which checks were done and which remained.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>03</span>
              <h3 className={styles.gapTitle}>Role overload on QC executives</h3>
              <p className={styles.gapDesc}>The same executive handled both inward and outward QC, with no contextual separation. Cognitive load was high, and accuracy suffered as a result.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>04</span>
              <h3 className={styles.gapTitle}>Inefficiencies amplified by volume</h3>
              <p className={styles.gapDesc}>At 1000 pieces per hour, even small per-item delays created significant backlogs. The system couldn't scale with warehouse throughput.</p>
            </div>
          </div>

          <div className={styles.problemImgWrap}>
            <ImgSlot
              src="/QC Changes/QC Before screen.png"
              label="Before: flat QC checklist with no grouping, excessive taps per criterion"
              aspect="21/9"
            />
          </div>

          <div className={styles.problemResult}>
            <span className={styles.resultLabel}>Result</span>
            <p className={styles.resultText}>Slower QC cycles, higher return rates, and warehouse costs that kept climbing with no clear path to reduction within the product.</p>
          </div>
        </div>
      </section>

      {/* ── INSIGHT ──────────────────────────────── */}
      <section ref={setRef('insight')} id="insight" className={styles.insightSection}>
        <div className={styles.container}>
          <blockquote className={styles.insightQuote}>
            Digital inefficiency was only half the problem. The <span className={styles.insightEm}>physical workflow</span> and the digital interface were completely out of sync.
          </blockquote>
          <div className={styles.insightBeads}>
            {[
              { title: 'QC is a physical act first', desc: 'Inspectors move around, handle goods, and use their senses in sequence. The interface had to match how the body actually works , not the other way around.' },
              { title: 'Environment shapes behavior', desc: 'Staffing pressure, device quality, and network reliability all affect how QC gets done. We had to work around constraints we couldn\'t fix.' },
              { title: 'Alignment beats optimisation', desc: 'Reducing clicks matters less than aligning the digital flow with the natural inspection sequence. When those match, speed follows naturally.' },
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
      <section ref={setRef('approach')} id="approach" className={qStyles.approachSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Approach</span>
          <h2 className={styles.sectionTitle}>Grounding the solution in real warehouse behavior</h2>
          <p className={styles.sectionSub}>Research happened on the floor, not in a meeting room.</p>
          <div className={qStyles.approachGrid}>
            {[
              { n: '01', title: 'On-ground research',       desc: 'Visited active warehouses to observe QC workflows in the real operational environment, not through recordings or reports.' },
              { n: '02', title: 'Live operation shadowing',  desc: 'Watched QC executives complete full check cycles during live inward operations to see exactly where friction lived.' },
              { n: '03', title: 'Bottleneck identification', desc: 'Mapped both digital pain points and environmental constraints to separate what product could fix from what it couldn\'t.' },
              { n: '04', title: 'Focused on the controllable', desc: 'Scoped the solution to the QC module within DCMS, avoiding scope creep into staffing or infrastructure decisions.' },
            ].map(a => (
              <div key={a.n} className={qStyles.approachCard}>
                <span className={qStyles.approachNum}>{a.n}</span>
                <h3 className={qStyles.approachTitle}>{a.title}</h3>
                <p className={qStyles.approachDesc}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYSIS ─────────────────────────────── */}
      <section ref={setRef('analysis')} id="analysis" className={qStyles.analysisSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Analysis</span>
          <h2 className={styles.sectionTitle}>The math revealed the real scale of the problem</h2>
          <p className={styles.sectionSub}>Breaking down the QC process step by step exposed compounding inefficiencies invisible to anyone not doing the math.</p>

          <div className={qStyles.analysisCalc}>
            <div className={qStyles.calcBlock}>
              <span className={qStyles.calcVal}>~25</span>
              <span className={qStyles.calcLabel}>QC criteria per product</span>
            </div>
            <span className={qStyles.calcOp}>×</span>
            <div className={qStyles.calcBlock}>
              <span className={qStyles.calcVal}>15s</span>
              <span className={qStyles.calcLabel}>avg. time per criterion</span>
            </div>
            <span className={qStyles.calcOp}>×</span>
            <div className={qStyles.calcBlock}>
              <span className={qStyles.calcVal}>12</span>
              <span className={qStyles.calcLabel}>clicks per criterion</span>
            </div>
            <span className={qStyles.calcOp}>=</span>
            <div className={`${qStyles.calcBlock} ${qStyles.calcResult}`}>
              <span className={qStyles.calcVal}>~6 min</span>
              <span className={qStyles.calcLabel}>per product, unoptimised</span>
            </div>
            <span className={qStyles.calcOp}>&amp;</span>
            <div className={`${qStyles.calcBlock} ${qStyles.calcResult}`}>
              <span className={qStyles.calcVal}>~300</span>
              <span className={qStyles.calcLabel}>clicks per product</span>
            </div>
          </div>

          <div className={qStyles.analysisFindings}>
            {[
              { icon: '↘', title: 'No prioritisation',   desc: 'Criteria were presented in the same visual weight regardless of how critical or fast they were to check.' },
              { icon: '↔', title: 'Flat list structure',  desc: 'All 25 items in a single scroll. No grouping meant executives couldn\'t build a mental model of progress.' },
              {
                icon: <i className="bi bi-graph-up" style={{ fontSize: '20px' }} aria-hidden="true" />,
                title: 'Volume amplification', desc: 'At 1000 pieces/hr, a 6-minute check cycle creates compounding delay , and that\'s before accounting for returns.'
              },
            ].map(f => (
              <div key={f.title} className={qStyles.analysisFinding}>
                <span className={qStyles.findingIcon}>{f.icon}</span>
                <div>
                  <h4 className={qStyles.findingTitle}>{f.title}</h4>
                  <p className={qStyles.findingDesc}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STRUCTURE ────────────────────────────── */}
      <section ref={setRef('structure')} id="structure" className={qStyles.structureSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Structure</span>
          <h2 className={styles.sectionTitle}>Reorganising QC by how inspection actually happens</h2>
          <p className={styles.sectionSub}>We mapped all 25 criteria to four natural inspection modes based on physical proximity and sensory method. This became the new structure of the QC interface.</p>

          <div className={qStyles.inspectionGrid}>
            {[
              {
                tier: '01',
                name: 'Far Observation',
                icon: <i className="bi bi-eye" style={{ fontSize: '22px' }} aria-hidden="true" />,
                color: 'var(--accent-indigo)',
                desc: 'Visual checks done from a standing distance , packaging integrity, labeling, quantity count.',
                examples: ['Packaging intact', 'Label visible', 'Quantity match'],
              },
              {
                tier: '02',
                name: 'Near Observation',
                icon: <i className="bi bi-search" style={{ fontSize: '22px' }} aria-hidden="true" />,
                color: 'var(--accent-violet)',
                desc: 'Product-level inspection up close , surface defects, color consistency, print quality.',
                examples: ['Surface defects', 'Color consistency', 'Print accuracy'],
              },
              {
                tier: '03',
                name: 'Touch and Feel',
                icon: <i className="bi bi-hand-index" style={{ fontSize: '22px' }} aria-hidden="true" />,
                color: 'var(--accent-blue)',
                desc: 'Tactile validation , material texture, structural firmness, flexibility checks.',
                examples: ['Material texture', 'Firmness check', 'Flexibility test'],
              },
              {
                tier: '04',
                name: 'Metric',
                icon: <i className="bi bi-bar-chart" style={{ fontSize: '22px' }} aria-hidden="true" />,
                color: 'var(--accent-cyan)',
                desc: 'Measurable attributes recorded with instruments , thickness, weight, humidity, dimensions.',
                examples: ['Thickness (mm)', 'Humidity (%)', 'Weight (g)'],
              },
            ].map((tier) => (
              <div key={tier.tier} className={qStyles.tierCard} style={{ '--tier-color': tier.color } as React.CSSProperties}>
                <div className={qStyles.tierTop}>
                  <div className={qStyles.tierIconWrap} style={{ background: `color-mix(in srgb, ${tier.color} 12%, transparent)` }}>
                    <span style={{ color: tier.color }}>{tier.icon}</span>
                  </div>
                  <span className={qStyles.tierNum} style={{ color: tier.color }}>{tier.tier}</span>
                </div>
                <h3 className={qStyles.tierName}>{tier.name}</h3>
                <p className={qStyles.tierDesc}>{tier.desc}</p>
                <div className={qStyles.tierExamples}>
                  {tier.examples.map(e => (
                    <span key={e} className={qStyles.tierExample}>{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.problemResult} style={{ marginTop: 40 }}>
            <span className={styles.resultLabel}>Result</span>
            <p className={styles.resultText}>Aligning the digital interface with this physical progression meant QC executives could complete checks in the same order they naturally inspected goods , no mental context switching required.</p>
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────── */}
      <section ref={setRef('solution')} id="solution" className={styles.solutionSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Solution</span>
          <h2 className={styles.sectionTitle}>Faster, progressive QC aligned with real workflow</h2>
          <p className={styles.sectionSub}>Each design change addressed a specific failure in the original flow while fitting within the existing DCMS system.</p>
        </div>

        <div className={styles.solutionFlow}>
          {[
            {
              n: '01', step: 'Structured QC Flow',
              color: 'var(--accent-indigo)',
              desc: 'Reorganised all QC criteria into the four inspection-mode groups. Executives move through the interface in the same sequence as the physical inspection, eliminating mental overhead.',
              attrs: ['Grouped by inspection mode', 'Matches physical workflow', 'Clear progress within groups'],
              img: '/QC Changes/Structured QC Flow.png',
              imgLabel: 'QC criteria grouped by inspection mode, Far Observation through Metric',
            },
            {
              n: '02', step: 'Reduced Interaction Load',
              color: 'var(--accent-violet)',
              desc: 'Simplified each criterion interaction from 12 clicks to a direct pass/fail toggle. Non-critical sub-steps were collapsed into progressive disclosure to reduce default complexity.',
              attrs: ['Pass/fail toggle', 'Progressive disclosure', 'Fewer required taps'],
              img: '/QC Changes/Reduced Interaction Load.png',
              imgLabel: 'Before vs after: 12-click criterion flow vs. single toggle interaction',
            },
            {
              n: '03', step: 'Mobile and Tablet First',
              color: 'var(--accent-blue)',
              desc: 'Designed for on-the-move use. Large tap targets, a persistent progress bar, and a sticky summary panel mean executives never lose context even while handling goods.',
              attrs: ['Large tap targets', 'Sticky summary panel', 'Persistent progress indicator'],
              img: '/QC Changes/Mobile and Tablet First.png',
              imgLabel: 'QC screen on tablet with sticky summary and large touch targets',
            },
            {
              n: '04', step: 'Inline Discrepancy Flagging',
              color: 'var(--accent-cyan)',
              desc: 'Failed items are flagged inline with a mandatory note prompt. This captures discrepancy data at the point of discovery rather than during a separate review phase.',
              attrs: ['Inline flag and note', 'Captured at source', 'Direct audit trail'],
              img: '/QC Changes/Inline Discrepancy Flagging.png',
              imgLabel: 'Failed criterion with inline flag prompt and mandatory reason field',
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

      {/* ── IMPACT ───────────────────────────────── */}
      <section ref={setRef('impact')} id="impact" className={styles.impactSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Impact</span>
          <h2 className={styles.sectionTitle}>QC went from a bottleneck to a competitive advantage</h2>
          <p className={styles.sectionSub}>Measurable improvements in speed, accuracy, and warehouse cost across high-volume operations.</p>
          <div className={styles.impactMetrics}>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>~70%</span>
              <span className={styles.impactLbl}>increase in QC executive efficiency</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>~50%+</span>
              <span className={styles.impactLbl}>reduction in time to complete full QC cycle</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>~30→80%</span>
              <span className={styles.impactLbl}>improvement in QC accuracy (sanity score)</span>
            </div>
          </div>
          <div className={styles.impactOutcomes}>
            {[
              'Reduced return goods rate through more accurate and consistent QC outcomes',
              'Executives could complete inward QC in step with the unloading pace, eliminating backlogs',
              'Discrepancy data captured inline enabled upstream supplier quality improvement',
              'Management gained visibility into QC completion rates and failure patterns for the first time',
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
      <section ref={setRef('validation')} id="validation" className={qStyles.validationSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Validation</span>
          <h2 className={styles.sectionTitle}>Confirmed by real-world performance</h2>
          <p className={styles.sectionSub}>Improvements were validated through live warehouse observation and measurable operational metrics, not usability testing alone.</p>
          <div className={qStyles.validationGrid}>
            <div className={qStyles.validationCard}>
              <ImgSlot src="/QC Changes/On ground observation.jpeg" label="On-floor observation of QC executives completing checks in the redesigned flow" aspect="4/3" />
              <div className={qStyles.validationCardBody}>
                <span className={qStyles.validationMethod}>On-floor observation</span>
                <p className={qStyles.validationText}>Watched QC executives complete full inward checks using the redesigned flow. Completion time dropped significantly and executives reported feeling less mentally loaded.</p>
              </div>
            </div>
            <div className={qStyles.validationCard}>
              <ImgSlot src="/QC Changes/Operational metrics.jpeg" label="Operational metrics comparing QC cycle times before and after redesign" aspect="4/3" />
              <div className={qStyles.validationCardBody}>
                <span className={qStyles.validationMethod}>Operational metrics</span>
                <p className={qStyles.validationText}>QC cycle times measured against the baseline before the redesign. The 50%+ reduction held consistently across different product categories and volume conditions.</p>
              </div>
            </div>
            <div className={qStyles.validationCard}>
              <ImgSlot src="/QC Changes/QC Sanity scores.jpeg" label="Sanity score trend showing QC accuracy improvement from 30% to 80%" aspect="4/3" />
              <div className={qStyles.validationCardBody}>
                <span className={qStyles.validationMethod}>QC sanity scores</span>
                <p className={qStyles.validationText}>Accuracy tracking showed the sanity score rising from around 30% to 80% as structured grouping reduced missed or incorrectly recorded checks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXECUTION ────────────────────────────── */}
      <section ref={setRef('execution')} id="execution" className={qStyles.executionSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Execution</span>
          <h2 className={styles.sectionTitle}>Working within real-world constraints</h2>
          <p className={styles.sectionSub}>Not every problem was solvable by design , knowing the boundary was as important as what we built inside it.</p>
          <div className={qStyles.executionGrid}>
            {[
              {
                icon: <i className="bi bi-people" style={{ fontSize: '20px' }} aria-hidden="true" />,
                title: 'Staffing gaps escalated, not solved',
                body: 'Short-staffed warehouses created QC bottlenecks we couldn\'t fix with design. We identified these gaps and escalated them to management as separate operational issues requiring HR decisions.',
              },
              {
                icon: <i className="bi bi-tablet" style={{ fontSize: '20px' }} aria-hidden="true" />,
                title: 'Device and network constraints noted',
                body: 'Older tablets and unstable warehouse WiFi affected app responsiveness. We designed for graceful degradation and flagged infrastructure improvements as dependencies for full impact realisation.',
              },
              {
                icon: <i className="bi bi-pencil" style={{ fontSize: '20px' }} aria-hidden="true" />,
                title: 'Product scope deliberately maintained',
                body: 'We resisted expanding the project into adjacent processes like supplier management or returns. Focused execution within the QC module delivered measurable wins without the risk of scope overrun.',
              },
            ].map(e => (
              <div key={e.title} className={qStyles.executionCard}>
                <span className={qStyles.executionIcon}>{e.icon}</span>
                <h4 className={qStyles.executionTitle}>{e.title}</h4>
                <p className={qStyles.executionBody}>{e.body}</p>
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
              { num: '01', h: 'Go to where the work happens', b: 'No amount of stakeholder interviews replaced watching an executive do 25 checks in a cold warehouse. Physical presence revealed friction that no data report could.' },
              { num: '02', h: 'Structure is faster than speed', b: 'The instinct was to reduce clicks. The insight was that mental overhead from a flat list was slower than extra taps through a well-grouped flow. Organisation beat optimisation.' },
              { num: '03', h: 'Know what design cannot fix', b: 'Identifying that staffing and infrastructure were outside scope wasn\'t admitting defeat. It focused effort on what we could actually improve and kept expectations honest.' },
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

      <ProjectCarousel currentId="bizongo-qc" />

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <GoBackButton className={styles.bottomBack} label="Go back" />
          <span className={styles.bottomMeta}>QC Experience · Bizongo DCMS · 2021</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
