import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { SUGGESTED_PROMPTS, getSmartFollowUps, PROJECT_CARD_DATA } from '../data/aiContext';
import { injectProjectLinks } from '../utils/projectLinks';
import styles from './AIPage.module.css';
import { GoBackButton } from '../components/GoBackButton';
import { Loader } from '../components/Loader';
import { ImgSkeleton } from '../components/ImgSkeleton';
import { ANALYTICS_SECRET, triggerAnalyticsDashboard } from '../lib/analytics';

const loadResumePdf = () => import('../lib/resumePdf');
const RESUME_TOKEN = '[DOWNLOAD_RESUME]';

/* ── Randomised entrance delays (shuffled, not grid-order) ── */
const BENTO_DELAYS = [0.0, 1.6, 0.7, 2.2, 0.3, 1.9, 0.9, 2.5, 0.5, 1.3, 2.8, 0.1, 2.0];

/* ── Bento background cards — all 15 project images ─────── */
const BENTO_CARDS = [
  '/Projectcard-images/ALMVC hero image.webp',
  '/Projectcard-images/quiz pod.webp',
  '/Projectcard-images/joining screen.webp',
  '/Projectcard-images/QC improvement.webp',
  '/Projectcard-images/PPE.webp',
  '/Projectcard-images/Connect central revamp.webp',
  '/Projectcard-images/visual revamp.webp',
  '/Projectcard-images/Mobile revamp.webp',
  '/Projectcard-images/Bizongo UMS.webp',
  '/Projectcard-images/Seamless approval workflow.webp',
  '/Projectcard-images/Digital contract creation.webp',
  '/Projectcard-images/Heuristics evaluation.webp',
  '/Projectcard-images/Maintaining design systems.webp',
];

/* ── Word-by-word typing with per-word fade+rise ─────── */
/* Common stop-words excluded from the fallback keyword pick */
const STOP_WORDS = new Set([
  'the','a','an','and','or','but','for','to','of','in','on','at','by','with','from','as','is','are','was','were','be','been','being','it','its',
  'this','that','these','those','i','he','she','they','we','you','his','her','their','our','your','him','them','me','us','my','mine','have','has','had',
  'do','does','did','will','would','should','could','can','may','might','must','shall','about','into','over','under','than','then','so','if','not','no','too','very',
  'just','also','only','more','most','less','much','many','some','any','all','both','each','every','few','other','same','such','here','there','what','which','who','whom','when','where','why','how',
]);

/* Recruiter-signal vocabulary, ordered by priority (highest first).
   Matched by checking if a cleaned word contains any of these stems —
   so "shipped" matches "ship", "redesigned" matches "design", etc.
   Stems with shorter forms (e.g. "ship") will absorb tenses ("shipped",
   "shipping") via the substring/inclusion logic in pickKeywordIndex. */
const POWER_WORDS: string[] = [
  // ─── Tier 1: action + impact verbs (most recruiter-resonant) ───
  'shipped','shipping','launched','launching','delivered','delivering',
  'redesigned','redesigning','rebuilt','rebuilding','rearchitected',
  'transformed','transforming','revamped','revamping','reimagined','reimagining',
  'scaled','scaling','accelerated','accelerating',
  'reduced','reducing','increased','increasing','improved','improving','optimized','optimizing',
  'drove','driving','owned','owning','executed','executing',
  'created','creating','built','building','designed','designing','crafted','crafting',
  'pioneered','pioneering','established','establishing','introduced','introducing',
  'streamlined','streamlining','simplified','simplifying','consolidated','unified',
  'shipped','validated','tested','prototyped','researched',

  // ─── Tier 2: senior leadership signals ───
  'led','leading','spearheaded','spearheading','championed','championing',
  'mentored','mentoring','coached','coaching','onboarded','onboarding','trained','training',
  'hired','hiring','recruited','interviewing',
  'managed','managing','directed','directing','orchestrated','orchestrating',
  'partnered','partnering','collaborated','collaborating',
  'aligned','aligning','influenced','influencing','convinced','negotiated',
  'evangelized','advocated','presented','pitched',

  // ─── Tier 3: AI / intelligence / automation ───
  'AI','GenAI','generative','intelligence','intelligent','smart',
  'automation','automated','agentic','agents','copilot','LLM','model','models',
  'machine','learning','prompt','prompts','prompting','embedding','embeddings',
  'neural','semantic','contextual','adaptive','predictive','personalization',

  // ─── Tier 4: domain expertise — product / enterprise / design ───
  'enterprise','SaaS','B2B','B2C','platform','platforms','product','products',
  'collaboration','communication','meeting','meetings','virtual','classroom','classrooms',
  'systems','system','workflow','workflows','workflows','pipeline','pipelines',
  'patterns','primitives','foundations','frameworks','architecture','architectures',
  'design','designed','designer','designs','UX','UI','interaction','interface','interfaces',
  'research','research-driven','user-centered','human-centered','data-informed','data-driven',
  'usability','accessibility','inclusive','inclusivity','responsive','adaptive',
  'mobile','mobile-first','desktop','web','native',
  'component','components','library','tokens','specs','specifications','guidelines',

  // ─── Tier 5: cross-functional / process ───
  'cross-functional','end-to-end','full-stack','full-cycle','zero-to-one','0-to-1','0-1',
  'discovery','definition','ideation','exploration','iteration','iterative',
  'roadmap','strategy','vision','principles','playbook',
  'workshops','workshopped','synthesis','synthesized',

  // ─── Tier 6: scale + business impact ───
  'million','millions','billion','billions','thousand','thousands','users','customers','seats',
  'global','globally','enterprise-scale','at-scale',
  'growth','impact','outcomes','adoption','retention','engagement','conversion','activation',
  'efficiency','productivity','revenue','sales','ROI','metrics','KPIs',
  'measurable','quantifiable','tangible','demonstrable',

  // ─── Tier 7: quality + craft signals ───
  'craft','crafted','quality','polish','polished','rigor','rigorous','excellence',
  'sophisticated','elegant','thoughtful','intentional','deliberate','meaningful',

  // ─── Tier 8: complexity + problem-solving ───
  'complexity','ambiguity','ambiguous','unclear','tradeoffs','constraints','edge-cases',
  'critical','high-stakes','mission-critical','strategic','foundational',

  // ─── Tier 9: brands / domains specific to Midhun's work ───
  'Adobe','Connect','Bizongo','YUJ',
  'ALMVC','Learning','Manager','supply-chain','packaging','contracts','PPE',
];

function clean(s: string) {
  return s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

/* Pick the index of the most apt word for a recruiter to see.
   1. Exact API keyword match.
   2. Substring keyword match (handles plurals / tense variants).
   3. First recruiter-signal POWER_WORD found in the summary (ordered by priority).
   4. Longest non-stopword fallback. */
function pickKeywordIndex(words: string[], keyword: string): number {
  const target = clean(keyword);
  if (target) {
    const exact = words.findIndex(w => clean(w) === target);
    if (exact !== -1) return exact;
    if (target.length >= 4) {
      const partial = words.findIndex(w => {
        const c = clean(w);
        return c.length >= 4 && (c.includes(target) || target.includes(c));
      });
      if (partial !== -1) return partial;
    }
  }
  // 3. Recruiter-signal lookup — for each priority power word, find the first
  //    summary word containing that stem. Lock in on the first hit.
  for (const power of POWER_WORDS) {
    const stem = clean(power);
    if (!stem) continue;
    const idx = words.findIndex(w => {
      const c = clean(w);
      return c.length >= 3 && (c === stem || c.includes(stem) || stem.includes(c));
    });
    if (idx !== -1) return idx;
  }
  // 4. Fallback: longest non-stopword
  let best = -1, bestLen = 0;
  for (let i = 0; i < words.length; i++) {
    const c = clean(words[i]);
    if (c.length < 4 || STOP_WORDS.has(c)) continue;
    if (c.length > bestLen) { best = i; bestLen = c.length; }
  }
  return best;
}

function WordTyping({
  text,
  keyword,
  wordDelay = 110,
}: {
  text: string;
  keyword: string;
  wordDelay?: number;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const words = text ? text.split(' ') : [];
  const keywordIdx = pickKeywordIndex(words, keyword);

  useEffect(() => {
    if (!text) { setVisibleCount(0); return; }
    setVisibleCount(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= words.length) clearInterval(id);
    }, wordDelay);
    return () => clearInterval(id);
  }, [text]);

  return (
    <>
      {words.map((word, i) => {
        const isKeyword = i === keywordIdx;
        return (
          <span
            key={i}
            className={`${styles.word} ${i < visibleCount ? styles.wordVisible : ''} ${isKeyword ? styles.insightKeyword : ''}`}
          >
            {word}
          </span>
        );
      })}
    </>
  );
}

/* ── Mini project cards shown when projects are mentioned ── */
function MentionedProjectCards({ content, onNavigate }: { content: string; onNavigate: (r: string) => void }) {
  const seen = new Set<string>();
  const cards = PROJECT_CARD_DATA.filter(p => {
    p.pattern.lastIndex = 0;
    if (p.pattern.test(content) && !seen.has(p.route)) {
      seen.add(p.route);
      return true;
    }
    return false;
  });
  if (cards.length === 0) return null;
  return (
    <div className={styles.mentionedCards}>
      {cards.map(p => (
        <button key={p.route} className={styles.mentionedCard} onClick={() => onNavigate(p.route)}>
          <div className={styles.mentionedCardImg}>
            <ImgSkeleton src={p.image} alt={p.title} draggable={false} />
          </div>
          <span className={styles.mentionedCardTitle}>{p.title}</span>
          <span className={styles.mentionedCardArrow}>↗</span>
        </button>
      ))}
    </div>
  );
}

/* ── Resume download button ──────────────────────────── */
function ResumeDownloadBtn() {
  const [downloading, setDownloading] = useState(false);
  const handleClick = async () => {
    setDownloading(true);
    const { downloadResumePdf } = await loadResumePdf();
    await downloadResumePdf();
    setDownloading(false);
  };
  return (
    <button className={styles.resumeDownloadBtn} onClick={handleClick} disabled={downloading}>
      <i className="bi bi-download" style={{ fontSize: '13px' }} aria-hidden="true" />
      {downloading ? 'Preparing…' : 'Download resume'}
    </button>
  );
}

/* ── Markdown message renderer ───────────────────────── */
function MessageContent({ content, onNavigate }: { content: string; onNavigate: (r: string) => void }) {
  const lines = content.split('\n');
  return (
    <div className={styles.msgContent}>
      {lines.map((line, i) => {
        // Resume download token — render a button
        if (line.trim() === RESUME_TOKEN)
          return <ResumeDownloadBtn key={i} />;
        // Token inline within a sentence
        if (line.includes(RESUME_TOKEN)) {
          const [before, after] = line.split(RESUME_TOKEN);
          return (
            <p key={i} className={styles.msgPara}>
              {before && <span dangerouslySetInnerHTML={{ __html: formatInline(before) }} />}
              <ResumeDownloadBtn />
              {after && <span dangerouslySetInnerHTML={{ __html: formatInline(after) }} />}
            </p>
          );
        }
        if (line.startsWith('## '))
          return <h4 key={i} className={styles.msgH4}>{line.slice(3)}</h4>;
        if (line.startsWith('**') && line.endsWith('**'))
          return <strong key={i} className={styles.msgStrong}>{line.slice(2, -2)}</strong>;
        if (line.startsWith('• ') || line.startsWith('- '))
          return (
            <div key={i} className={styles.msgListItem}>
              <span className={styles.msgBullet}>•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
            </div>
          );
        if (line.trim() === '') return <div key={i} className={styles.msgSpacer} />;
        return <p key={i} className={styles.msgPara} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
      })}
      <MentionedProjectCards content={content} onNavigate={onNavigate} />
    </div>
  );
}

function formatInline(text: string): string {
  return injectProjectLinks(
    text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
  );
}

/* ── Main page ───────────────────────────────────────── */
export function AIPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { messages, loading, insight, send } = useChat();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestUserMsgRef = useRef<HTMLDivElement>(null);
  const didAutoSubmit = useRef(false);

  // Reveal bento cards after a short mount delay
  const [cardsVisible, setCardsVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCardsVisible(true), 120);
    return () => clearTimeout(t);
  }, []);


  // Escape → back to portfolio
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const q = searchParams.get('q');
    // Submit if there's a query param and it's either a fresh session or a new/different query
    const lastUserMsg = messages.filter(m => m.role === 'user').pop()?.content;
    if (q && !didAutoSubmit.current && (messages.length === 0 || lastUserMsg !== q)) {
      didAutoSubmit.current = true;
      send(q);
    } else {
      // Auto-focus input on landing
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []);

  // When user sends — smooth-scroll their message to the top
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role !== 'user') return;
    requestAnimationFrame(() => {
      const el = latestUserMsgRef.current;
      container.scrollTo({
        top: el ? el.offsetTop - 12 : 0,
        behavior: 'smooth',
      });
    });
  }, [messages.length]); // only fires when a new message is added

  // While AI is typing — follow the output by pinning to the bottom on every update
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role !== 'assistant') return;
    // Direct assignment (no animation) so scroll keeps pace with the typewriter
    container.scrollTop = container.scrollHeight;
  }, [messages]); // fires on every content change, not just length

  const handleSend = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || loading) return;
    // Secret analytics key — intercept before sending to AI
    if (msg === ANALYTICS_SECRET) {
      setInput('');
      triggerAnalyticsDashboard();
      return;
    }
    send(msg);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Pill carousel auto-scroll
  const pillWrapRef = useRef<HTMLDivElement>(null);
  const pillScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPillScroll = () => {
    const el = pillWrapRef.current;
    if (!el) return;
    pillScrollRef.current = setInterval(() => {
      el.scrollLeft += 1;
      if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
    }, 16);
  };

  const stopPillScroll = () => {
    if (pillScrollRef.current) clearInterval(pillScrollRef.current);
  };

  useEffect(() => {
    startPillScroll();
    return stopPillScroll;
  }, []);

  const hasMessages = messages.length > 0;
  const hasInsight = !!insight?.summary;

  const [fadingInsight, setFadingInsight] = useState<typeof insight>(null);
  const [insightVisible, setInsightVisible] = useState(false);

  useEffect(() => {
    if (insight?.summary) {
      setFadingInsight(insight);
      setInsightVisible(true);
    } else if (fadingInsight) {
      setInsightVisible(false);
      const t = setTimeout(() => setFadingInsight(null), 600);
      return () => clearTimeout(t);
    }
  }, [insight]);

  const followUpSuggestions = getSmartFollowUps(messages);

  // Restart pill scroll when chat view becomes active
  useEffect(() => {
    if (hasMessages) {
      stopPillScroll();
      setTimeout(() => startPillScroll(), 50);
      return stopPillScroll;
    }
  }, [hasMessages]);

  // Restart pill scroll whenever loading finishes (follow-up pills just mounted)
  useEffect(() => {
    if (!loading && hasMessages) {
      stopPillScroll();
      setTimeout(() => startPillScroll(), 80);
      return stopPillScroll;
    }
  }, [loading]);

  /* ── Landing (no messages yet) ─────────────────────── */
  if (!hasMessages) {
    return (
      <div className={styles.landing}>

        {/* Back button */}
        <GoBackButton className={styles.landingBackBtn} fallback="/" label="Back" />

        {/* Background grid */}
        <div className={styles.landingGrid} aria-hidden />

        {/* Bento background cards — 5 × 3 grid, all 15 project images */}
        <div className={styles.bentoBg} aria-hidden>
          {BENTO_CARDS.map((src, i) => (
            <div
              key={i}
              className={`${styles.bentoCard} ${cardsVisible ? styles.bentoVisible : ''}`}
              style={{
                animationDuration: `${6 + (i % 7)}s`,
                animationDelay:    `${-(i * 0.55).toFixed(2)}s`,
                transitionDelay:   `${BENTO_DELAYS[i]}s`,
              }}
            >
              <img src={src} alt="" draggable={false} />
            </div>
          ))}
        </div>

        {/* Ambient orbs */}
        <div className={styles.landingOrbs} aria-hidden>
          <div className={styles.landingOrb1} />
          <div className={styles.landingOrb2} />
          <div className={styles.landingOrb3} />
        </div>

        {/* Center content */}
        <div className={styles.landingCenter}>
          <span className={styles.sectionLabel}>AI Assistant</span>
          <h1 className={styles.title}>
            Ask anything about
            <br />
            <span className={styles.titleGradient}>Midhun's work</span>
          </h1>
          <p className={styles.subtitle}>
            Have a free conversation about Midhun and his works with the AI.
          </p>

          {/* Input */}
          <div className={styles.landingInputRow}>
            <div className={styles.inputBar}>
              <textarea
                ref={inputRef}
                className={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about Midhun's work…"
                rows={1}
              />
              <button
                className={`${styles.sendBtn} ${input.trim() ? styles.sendActive : ''}`}
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                <i className="bi bi-send-fill" style={{ fontSize: '14px' }} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Suggested prompts — scrolling pill carousel */}
          <div
            ref={pillWrapRef}
            className={styles.pillCarouselWrap}
            onMouseEnter={stopPillScroll}
            onMouseLeave={startPillScroll}
          >
            <div className={styles.pillTrack}>
              {[...SUGGESTED_PROMPTS, ...SUGGESTED_PROMPTS].map((p, i) => (
                <button key={i} className={styles.pill} onClick={() => handleSend(p)}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>


      </div>
    );
  }

  /* ── Chat view (has messages) ──────────────────────── */
  return (
    <div className={`${styles.page} ${styles.hasInsight} ${styles.chatActive}`}>

      {/* ── Left / chat panel ── */}
      <div className={`${styles.left} ${styles.leftChatActive}`}>
        <div className={styles.inner}>

          {/* Back + scaled-down page header, on one row */}
          <div className={styles.headerBar}>
            <GoBackButton className={styles.backBtn} fallback="/" label="Back to portfolio" />

            <div className={styles.chatHeader}>
              <h2 className={styles.chatHeaderTitle}>
                Ask AI about <span className={styles.titleGradient}>Midhun's work</span>
              </h2>
              <span className={styles.chatHeaderMobileLabel}>AI Assistant</span>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className={styles.messages}
            onClick={(e) => {
              const link = (e.target as HTMLElement).closest('[data-nav]') as HTMLElement | null;
              if (link?.dataset.nav) { e.preventDefault(); navigate(link.dataset.nav); }
            }}
          >
            {messages.map((msg, i) => {
              const isLastUser = msg.role === 'user' && messages.slice(i + 1).every(m => m.role !== 'user');
              return (
                <div
                  key={i}
                  ref={isLastUser ? latestUserMsgRef : undefined}
                  className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}
                >
                  {msg.role === 'assistant' && <span className={styles.aiIcon}>✦</span>}
                  {msg.role === 'user'
                    ? <div className={styles.userBubble}><p className={styles.userText}>{msg.content}</p></div>
                    : <div className={styles.aiBubble}><span className={styles.aiResponseLabel}>AI response</span><MessageContent content={msg.content} onNavigate={(r) => navigate(r)} /></div>}
                </div>
              );
            })}

            {loading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.aiBubble}>
                  <div className={styles.generatingRow}>
                    <Loader size={20} />
                    <span className={styles.generatingLabel}>Generating response</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up suggestions — pill carousel */}
          {!loading && followUpSuggestions.length > 0 && (
            <div
              ref={pillWrapRef}
              className={styles.followUps}
              onMouseEnter={stopPillScroll}
              onMouseLeave={startPillScroll}
            >
              <div className={styles.pillTrack}>
                {[...followUpSuggestions, ...followUpSuggestions].map((p, i) => (
                  <button key={i} className={styles.pill} onClick={() => handleSend(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className={styles.inputWrap}>
            <div className={styles.inputBar}>
              <textarea
                className={styles.input}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about Midhun's work…"
                rows={1}
              />
              <button
                className={`${styles.sendBtn} ${input.trim() ? styles.sendActive : ''}`}
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                aria-label="Send"
              >
                <i className="bi bi-send-fill" style={{ fontSize: '14px' }} aria-hidden="true" />
              </button>
            </div>
          </div>
          <p className={styles.disclaimer}>AI generated responses may be inaccurate. Verify for accuracy.</p>
        </div>
      </div>

      {/* ── Right / insight panel ── */}
      <div className={`${styles.right} ${styles.rightVisible} ${styles.rightChatActive}`}>
        <div className={`${styles.orbLayer} ${!hasInsight ? styles.orbsLoading : ''} ${hasInsight ? styles.orbsDone : ''}`} aria-hidden>
          <div className={styles.orb1} />
          <div className={styles.orb2} />
          <div className={styles.orb3} />
        </div>

        {fadingInsight && (
          <div className={`${styles.insightBlock} ${insightVisible ? styles.insightVisible : styles.insightFading}`}>
            <span className={styles.insightLabel}>In a nutshell</span>
            <p className={styles.insightText}>
              <WordTyping text={fadingInsight.summary} keyword={fadingInsight.keyword} />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
