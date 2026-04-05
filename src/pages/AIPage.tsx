import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { SUGGESTED_PROMPTS, getSmartFollowUps } from '../data/aiContext';
import { injectProjectLinks } from '../utils/projectLinks';
import styles from './AIPage.module.css';

/* ── Marquee images ──────────────────────────────────── */
const MARQUEE_IMAGES = [
  '/Gen AI screen.png',
  '/images/articles/ai-conductor.jpeg',
  '/joining screen.png',
  '/images/articles/ai-replace-designers.jpeg',
  '/QC improvement.png',
  '/images/articles/creative-tax.jpeg',
  '/PPE.png',
  '/images/articles/decoding-intuitiveness.jpeg',
  '/quiz pod.png',
  '/images/articles/intellectual-masturbation.jpeg',
  '/images/case-studies/bizongo-ums.png',
  '/images/articles/teaching-inquisitively.jpeg',
];

/* ── Word-by-word typing with per-word fade+rise ─────── */
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
        const clean = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const isKeyword = !!keyword && clean(word) === clean(keyword);
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

/* ── Markdown message renderer ───────────────────────── */
function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className={styles.msgContent}>
      {lines.map((line, i) => {
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

  // Track when all marquee images have loaded
  const [imagesLoaded, setImagesLoaded] = useState(false);
  useEffect(() => {
    let loaded = 0;
    const total = MARQUEE_IMAGES.length;
    MARQUEE_IMAGES.forEach(src => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        loaded++;
        if (loaded >= total) setImagesLoaded(true);
      };
      img.src = src;
    });
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
    if (q && !didAutoSubmit.current) {
      didAutoSubmit.current = true;
      send(q);
    } else {
      // Auto-focus input on landing
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    if (messages.length === 1) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg || loading) return;
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
        <button className={styles.landingBackBtn} onClick={() => navigate('/')} aria-label="Back to portfolio">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        {/* Background grid */}
        <div className={styles.landingGrid} aria-hidden />

        {/* Top marquee — right to left */}
        <div className={`${styles.marqueeWrap} ${styles.marqueeTop} ${imagesLoaded ? styles.marqueeVisible : ''}`}>
          <div className={styles.marqueeTrack}>
            {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
              <img key={i} src={src} className={styles.marqueeImg} alt="" draggable={false} />
            ))}
          </div>
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2l3 6-3 6 12-6z" fill="currentColor"/>
              </svg>
            </button>
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

        {/* Bottom marquee — left to right */}
        <div className={`${styles.marqueeWrap} ${styles.marqueeBottom} ${imagesLoaded ? styles.marqueeVisible : ''}`}>
          <div className={`${styles.marqueeTrack} ${styles.marqueeReverse}`}>
            {[...MARQUEE_IMAGES, ...MARQUEE_IMAGES].map((src, i) => (
              <img key={i} src={src} className={styles.marqueeImg} alt="" draggable={false} />
            ))}
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

          {/* Back */}
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to portfolio
          </button>

          {/* Scaled-down page header */}
          <div className={styles.chatHeader}>
            <span className={styles.chatHeaderLabel}>AI Assistant</span>
            <h2 className={styles.chatHeaderTitle}>
              Ask anything about <span className={styles.titleGradient}>Midhun's work</span>
            </h2>
            <p className={styles.chatHeaderSubtitle}>Have a free conversation about Midhun and his works with the AI.</p>
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
                    : <div className={styles.aiBubble}><span className={styles.aiResponseLabel}>AI response</span><MessageContent content={msg.content} /></div>}
                </div>
              );
            })}

            {loading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <div className={styles.aiBubble}>
                  <div className={styles.generatingRow}>
                    <span className={styles.generatingLabel}>Generating response</span>
                    <div className={styles.typingDots}>
                      <span /><span /><span />
                    </div>
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14 8L2 2l3 6-3 6 12-6z" fill="currentColor"/>
              </svg>
            </button>
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
