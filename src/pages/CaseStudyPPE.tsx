import { useEffect, useRef, useState } from 'react';
import { Footer } from '../components/Footer';
import { ProjectCarousel } from '../components/ProjectCarousel';
import { GoBackButton } from '../components/GoBackButton';
import styles from './CaseStudyQuiz.module.css';
import pStyles from './CaseStudyPPE.module.css';

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

export function CaseStudyPPE() {
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
              <img src="/PPE.png" alt="ShieldWise PPE Platform" className={styles.heroImg} />
            </div>
            <div className={styles.heroContentCol}>
              <div className={styles.heroEyebrow}>
                <span className={styles.heroCategoryBadge}>B2B Platform</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>ShieldWise by Bizongo</span>
                <span className={styles.heroDot}>·</span>
                <span className={styles.heroMeta}>4 Weeks</span>
              </div>
              <h1 className={styles.heroTitle}>Making PPE kits more accessible</h1>
              <p className={styles.heroSubtitle}>When COVID-19 created an unprecedented surge in PPE demand, Bizongo mobilised its supplier network to respond. We built the platform that made that response possible, handling bulk orders pan-India and globally at scale.</p>
              <div className={styles.heroMetaBar}>
                {[
                  { k: 'Role',     v: 'UX Designer' },
                  { k: 'Scope',    v: 'End-to-end platform design' },
                  { k: 'Platform', v: 'ShieldWise Web' },
                  { k: 'Impact',   v: '₹2Cr+ in PPE kit sales' },
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
      <section ref={setRef('context')} id="context" className={pStyles.contextSection}>
        <div className={styles.container}>
          <div className={pStyles.contextInner}>
            <div className={pStyles.contextText}>
              <span className={styles.tag}>Context</span>
              <h2 className={styles.sectionTitle}>Bizongo saw the gap before anyone else moved</h2>
              <p className={pStyles.contextBody}>COVID-19 triggered a sudden, massive demand for PPE kits across industries. Bizongo, already sitting on a network of manufacturing suppliers, recognised the opportunity to connect that supply with urgent enterprise demand, pan-India and globally. The challenge was that no interface existed to handle orders at this scale, this fast. We built it in four weeks.</p>
            </div>
            <div className={pStyles.contextStats}>
              {[
                { val: '4 wks',  lbl: 'From zero to shipped platform' },
                { val: '₹2Cr+',  lbl: 'In PPE kit sales generated' },
                { val: '10K+',   lbl: 'Orders fulfilled through the platform' },
              ].map(s => (
                <div key={s.val} className={pStyles.contextStat}>
                  <span className={pStyles.contextStatVal}>{s.val}</span>
                  <span className={pStyles.contextStatLbl}>{s.lbl}</span>
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
              The supply and demand both existed.<br />
              <span className={styles.strikeRed}>Nothing connected them.</span>
            </h2>
          </div>

          <div className={styles.problemGrid}>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>01</span>
              <h3 className={styles.gapTitle}>No platform to route demand to suppliers</h3>
              <p className={styles.gapDesc}>Bizongo had the supplier network. Enterprises had the demand. But there was no digital surface where the two could meet and transact at scale.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>02</span>
              <h3 className={styles.gapTitle}>Bulk orders couldn't be placed without sales ops</h3>
              <p className={styles.gapDesc}>Every large order required manual back-and-forth with a sales team. This bottleneck killed the speed advantage Bizongo's network could have offered.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>03</span>
              <h3 className={styles.gapTitle}>Multi-location delivery had no UI</h3>
              <p className={styles.gapDesc}>Enterprise clients needed to ship to multiple sites across India, sometimes globally. No existing interface supported this kind of order configuration.</p>
            </div>
            <div className={styles.problemGap}>
              <span className={styles.gapNum}>04</span>
              <h3 className={styles.gapTitle}>Every week of delay was lost revenue</h3>
              <p className={styles.gapDesc}>The pandemic demand window was real but narrow. Each day without a working platform meant Bizongo's supplier advantage sat idle while demand went elsewhere.</p>
            </div>
          </div>

          <div className={styles.problemImgWrap}>
            <ImgSlot
              src="/PPE/PROBLEM SECTION PICTURE.png"
              label="Before: no unified platform, orders routed manually through sales teams with no self-serve option"
              aspect="21/9"
            />
          </div>

          <div className={styles.problemResult}>
            <span className={styles.resultLabel}>Result</span>
            <p className={styles.resultText}>Bizongo's supplier network was ready to fulfil at scale. The interface was the missing piece that would either unlock or waste that advantage entirely.</p>
          </div>
        </div>
      </section>

      {/* ── INSIGHT ──────────────────────────────── */}
      <section ref={setRef('insight')} id="insight" className={styles.insightSection}>
        <div className={styles.container}>
          <blockquote className={styles.insightQuote}>
            Enterprise buyers are <span className={styles.insightEm}>consumers first</span>. Familiar patterns cut through complexity faster than purpose-built ones.
          </blockquote>
          <div className={styles.insightBeads}>
            {[
              { title: 'The supply was already there', desc: 'Bizongo\'s supplier network could fulfil demand immediately. The design job wasn\'t to build something new from scratch, it was to make the network accessible through an interface.' },
              { title: 'Buyers needed speed, not sophistication', desc: 'Enterprise procurement managers during COVID weren\'t evaluating platforms. They needed to place a large order fast. Clarity and directness mattered more than features.' },
              { title: 'Familiar patterns unlock unfamiliar scale', desc: 'Borrowing from B2C meant buyers didn\'t need onboarding. A product card, a cart, a checkout, these were patterns they already trusted. We just scaled them up for bulk.' },
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
      <section ref={setRef('approach')} id="approach" className={pStyles.approachSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Approach</span>
          <h2 className={styles.sectionTitle}>Make the supplier network self-serve</h2>
          <p className={styles.sectionSub}>Four principles held every decision together: get out of the buyer's way, leverage what Bizongo already had, and ship before the demand window closed.</p>
          <div className={pStyles.approachGrid}>
            {[
              { n: '01', title: 'Expose the network, don\'t obscure it', desc: 'Bizongo\'s supplier strength was the product. The platform had to surface availability, fulfilment partners, and delivery reach clearly, not bury it in process.' },
              { n: '02', title: 'Borrow from B2C to remove onboarding',  desc: 'No enterprise buyer had time to learn a new system. Product cards, cart mechanics, and checkout patterns meant zero learning curve on day one.' },
              { n: '03', title: 'Design for pan-India ordering complexity', desc: 'A single client could have offices in Delhi, Mumbai, and Chennai. The platform had to handle multi-location, multi-timeline orders without overwhelming the buyer.' },
              { n: '04', title: 'Ship fast, leave seams for what\'s next', desc: 'Four weeks was the window. Decisions prioritised speed and correctness now, with intentional hooks for features that would follow once the demand was proven.' },
            ].map(a => (
              <div key={a.n} className={pStyles.approachCard}>
                <span className={pStyles.approachNum}>{a.n}</span>
                <h3 className={pStyles.approachTitle}>{a.title}</h3>
                <p className={pStyles.approachDesc}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANALYSIS ─────────────────────────────── */}
      <section ref={setRef('analysis')} id="analysis" className={pStyles.analysisSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Analysis</span>
          <h2 className={styles.sectionTitle}>What made this harder than a regular storefront</h2>
          <p className={styles.sectionSub}>Bizongo's supplier network could handle the scale. The design had to handle the complexity that came with it, things a standard e-commerce platform was never built for.</p>

          <div className={pStyles.complexityGrid}>
            {[
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                    <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
                  </svg>
                ),
                color: 'var(--accent-indigo)',
                title: 'Bulk ordering',
                stat: '500+ units',
                desc: 'Minimum order quantities started at 500 units. The interface had to make large-quantity selection feel intuitive, not intimidating.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                color: 'var(--accent-violet)',
                title: 'Multiple delivery locations',
                stat: 'Per client',
                desc: 'A single order could ship to several warehouses or offices. The checkout had to support multiple delivery addresses without becoming overwhelming.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="16" height="13" x="4" y="7" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M12 12v3"/><path d="M8 12h8"/>
                  </svg>
                ),
                color: 'var(--accent-blue)',
                title: 'Split deliveries',
                stat: 'By availability',
                desc: 'Bizongo\'s supplier network had multiple fulfilment partners. Orders were split based on stock availability, with clear communication of what shipped when and from which partner.',
              },
              {
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>
                  </svg>
                ),
                color: 'var(--accent-cyan)',
                title: 'Complex payment models',
                stat: 'Advance, partial, COD',
                desc: 'Payment could be advance, partial, or on delivery depending on the client relationship. The platform had to surface and communicate this without friction.',
              },
            ].map(c => (
              <div key={c.title} className={pStyles.complexityCard} style={{ '--card-color': c.color } as React.CSSProperties}>
                <div className={pStyles.complexityTop}>
                  <span className={pStyles.complexityIconWrap} style={{ background: `color-mix(in srgb, ${c.color} 10%, transparent)`, color: c.color }}>{c.icon}</span>
                  <span className={pStyles.complexityStat} style={{ color: c.color }}>{c.stat}</span>
                </div>
                <h3 className={pStyles.complexityTitle}>{c.title}</h3>
                <p className={pStyles.complexityDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLOWS ────────────────────────────────── */}
      <section ref={setRef('flows')} id="flows" className={pStyles.flowsSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Flows</span>
          <h2 className={styles.sectionTitle}>3 flows that turned supplier capacity into completed orders</h2>
          <p className={styles.sectionSub}>Each flow was mapped before any visual design began. The goal: a buyer should be able to place a large, multi-location order without ever speaking to a sales rep.</p>

          <div className={pStyles.flowsGrid}>
            {[
              {
                n: '01',
                name: 'Browse and Discover',
                color: 'var(--accent-indigo)',
                steps: ['Land on homepage', 'View featured PPE categories', 'Filter by product type or quantity', 'View product detail with spec sheet'],
                outcome: 'User identifies the right product with full context before committing.',
                img: '/PPE/BROWSE AND DISCOVER.png',
                imgLabel: 'Browse flow: homepage to product detail with filtering and spec view',
              },
              {
                n: '02',
                name: 'Order and Configure',
                color: 'var(--accent-violet)',
                steps: ['Set quantity and pack size', 'Add delivery locations', 'Configure split delivery timelines', 'Review order summary'],
                outcome: 'User builds a complete bulk order without calling a sales rep.',
                img: '/PPE/ORDER AND CHANGE.png',
                imgLabel: 'Order configuration flow: quantity, delivery split, and order summary',
              },
              {
                n: '03',
                name: 'Checkout and Pay',
                color: 'var(--accent-blue)',
                steps: ['Select payment model', 'Enter advance payment details', 'Confirm order with partner allocation', 'Receive confirmation and tracking'],
                outcome: 'User completes a complex B2B transaction in minutes, not days.',
                img: '/PPE/CHECKOUT AND PAY.png',
                imgLabel: 'Checkout flow: payment model selection, confirmation, and order tracking',
              },
            ].map(f => (
              <div key={f.n} className={pStyles.flowCard} style={{ '--flow-color': f.color } as React.CSSProperties}>
                <div className={pStyles.flowImgWrap}>
                  <ImgSlot src={f.img} label={f.imgLabel} aspect="16/9" />
                </div>
                <div className={pStyles.flowBody}>
                  <div className={pStyles.flowHeader}>
                    <span className={pStyles.flowNum} style={{ color: f.color }}>{f.n}</span>
                    <h3 className={pStyles.flowName}>{f.name}</h3>
                  </div>
                  <ol className={pStyles.flowSteps}>
                    {f.steps.map(s => <li key={s} className={pStyles.flowStep}>{s}</li>)}
                  </ol>
                  <div className={pStyles.flowOutcome}>
                    <span className={pStyles.flowOutcomeLabel}>Outcome</span>
                    <p className={pStyles.flowOutcomeText}>{f.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────── */}
      <section ref={setRef('solution')} id="solution" className={styles.solutionSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Solution</span>
          <h2 className={styles.sectionTitle}>The interface that put Bizongo's network to work</h2>
          <p className={styles.sectionSub}>Four surfaces, each designed to remove a specific barrier between a buyer and the fulfilment capability sitting behind the platform.</p>
        </div>

        <div className={styles.solutionFlow}>
          {[
            {
              n: '01', step: 'Product Catalogue',
              color: 'var(--accent-indigo)',
                desc: 'Bizongo\'s PPE range surfaced as a clean card catalogue, filterable by product type, quantity tier, and availability. Buyers could evaluate options and access spec sheets without leaving the listing.',
              attrs: ['B2C-style card grid', 'Inline spec sheets', 'Quantity-tier pricing'],
              img: '/PPE/Product Catalouge.png',
              imgLabel: 'PPE product catalogue with category filters, card grid, and inline spec access',
            },
            {
              n: '02', step: 'Bulk Order Builder',
              color: 'var(--accent-violet)',
              desc: 'Stepped order configuration for setting quantities, adding multiple delivery addresses, and splitting fulfillment by availability. Designed to replace back-and-forth emails.',
              attrs: ['Multi-location delivery', 'Split fulfillment config', 'Live order summary'],
              img: '/PPE/Bulk order creation.png',
              imgLabel: 'Bulk order builder: quantity selector, delivery address list, fulfilment split view',
            },
            {
              n: '03', step: 'Checkout and Payments',
              color: 'var(--accent-blue)',
                desc: 'Payment model selection surfaced clearly at checkout. Bizongo\'s fulfilment partner allocation was shown transparently, so buyers always knew which supplier was fulfilling which part of their order.',
              attrs: ['Flexible payment models', 'Partner allocation view', 'Order confirmation flow'],
              img: '/PPE/Checkout and payments.png',
              imgLabel: 'Checkout screen: payment model toggle, partner allocation summary, confirmation',
            },
            {
              n: '04', step: 'COVID Resources Hub',
              color: 'var(--accent-cyan)',
              desc: 'A dedicated section for COVID-related procurement guidance, product comparisons, and regulatory information. Helped buyers make informed decisions quickly.',
              attrs: ['Knowledge section', 'Product comparison', 'Regulatory guidance'],
              img: '/PPE/COVIDE RESOURSE HUB.png',
              imgLabel: 'COVID resources hub: product guidance, comparison table, and regulatory FAQ',
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
          <h2 className={styles.sectionTitle}>The network finally had an interface to match its scale</h2>
          <p className={styles.sectionSub}>ShieldWise converted Bizongo's supplier advantage into a live, transacting platform before the demand window closed.</p>
          <div className={styles.impactMetrics}>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>₹2Cr+</span>
              <span className={styles.impactLbl}>in PPE kit sales generated through the platform</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>10K+</span>
              <span className={styles.impactLbl}>orders fulfilled across enterprise clients</span>
            </div>
            <div className={styles.impactMetric}>
              <span className={styles.impactVal}>4 wks</span>
              <span className={styles.impactLbl}>from blank canvas to live, transacting platform</span>
            </div>
          </div>
          <div className={styles.impactOutcomes}>
            {[
              'Bizongo\'s supplier network became directly accessible to enterprise buyers without sales team involvement',
              'Pan-India multi-location ordering handled entirely through the platform, no manual coordination',
              'Established a digital commerce channel that continued operating beyond the pandemic window',
              'Buyers had full visibility into which supplier was fulfilling which part of their order',
            ].map(o => (
              <div key={o} className={styles.impactOutcome}>
                <span className={styles.impactCheck} />
                <span>{o}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXECUTION ────────────────────────────── */}
      <section ref={setRef('execution')} id="execution" className={pStyles.executionSection}>
        <div className={styles.container}>
          <span className={styles.tag}>Execution</span>
          <h2 className={styles.sectionTitle}>Shipping a complete platform in a crisis window</h2>
          <p className={styles.sectionSub}>Four weeks meant every decision had to count. Here is how the sprint was structured to make it work.</p>
          <div className={pStyles.executionGrid}>
            {[
              {
                week: 'Week 1',
                color: 'var(--accent-indigo)',
                title: 'Research and mapping',
                items: ['Stakeholder interviews to understand B2B model', 'Mapped existing procurement pain points', 'Defined core user journeys and constraints'],
              },
              {
                week: 'Week 2',
                color: 'var(--accent-violet)',
                title: 'Flows and information architecture',
                items: ['Key-path flows for browse, order, and checkout', 'IA for product catalogue and COVID resources section', 'Iterated on bulk order configuration logic'],
              },
              {
                week: 'Week 3',
                color: 'var(--accent-blue)',
                title: 'Visual design and components',
                items: ['Desktop-first UI built on B2C-inspired patterns', 'Component library for product cards, order steps, and checkout', 'Aligned with engineering on feasibility constraints'],
              },
              {
                week: 'Week 4',
                color: 'var(--accent-cyan)',
                title: 'Review, handoff, and iteration',
                items: ['Design review with product and business stakeholders', 'Handoff documentation and annotated specs', 'Final iteration pass based on stakeholder feedback'],
              },
            ].map(e => (
              <div key={e.week} className={pStyles.executionCard} style={{ '--exec-color': e.color } as React.CSSProperties}>
                <span className={pStyles.executionWeek} style={{ color: e.color }}>{e.week}</span>
                <h4 className={pStyles.executionTitle}>{e.title}</h4>
                <ul className={pStyles.executionItems}>
                  {e.items.map(item => <li key={item} className={pStyles.executionItem}>{item}</li>)}
                </ul>
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
              { num: '01', h: 'The interface is the product when the network is the asset', b: 'Bizongo already had suppliers and relationships. Design wasn\'t decorating a product, it was the mechanism that made the entire business opportunity accessible or inaccessible.' },
              { num: '02', h: 'Urgency is a design brief', b: 'Four weeks and a closing demand window forced every decision to be deliberate. Constraints that felt limiting were actually the clearest possible signal of what mattered.' },
              { num: '03', h: 'Familiar patterns earn trust faster than novel ones', b: 'Enterprise buyers under pressure don\'t explore new interaction models. Borrowing from B2C wasn\'t a shortcut, it was the right call for a platform that needed to earn trust on day one.' },
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

      <ProjectCarousel currentId="bizongo-ecom" />

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.container}>
          <GoBackButton className={styles.bottomBack} label="Go back" />
          <span className={styles.bottomMeta}>ShieldWise · Bizongo · 2020</span>
        </div>
      </div>

      <Footer />
    </div>
  );
}
