import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { SUGGESTED_PROMPTS } from '../data/aiContext';
import styles from './AIPage.module.css';

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
        // Treat both • and - as bullet markers
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
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

/* ── Ambient glow words ──────────────────────────────── */
function getAmbientWords(summary: string, keyword: string): string[] {
  const stopwords = new Set(['the','and','for','with','his','her','has','been','that','this','are','was','were','from','they','have','will','can','its','but','not','yet','all','any','our','their','more','also','into','than','then','when','where','what','who','how','just','about']);
  const words = summary
    .replace(/[^a-zA-Z0-9%+×x]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopwords.has(w.toLowerCase()) && w.toLowerCase() !== keyword.toLowerCase());
  return [...new Set(words)].slice(0, 4);
}

/* ── Main page ───────────────────────────────────────── */
interface AIPageProps {
  onChatActive?: (active: boolean) => void;
}

export function AIPage({ onChatActive }: AIPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { messages, loading, insight, send } = useChat();
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestUserMsgRef = useRef<HTMLDivElement>(null);
  const didAutoSubmit = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const q = searchParams.get('q');
    if (q && !didAutoSubmit.current) {
      didAutoSubmit.current = true;
      send(q);
    }
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    // New query started — scroll to top so the query is always at the top
    if (messages.length === 1) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    send(input.trim());
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const hasMessages = messages.length > 0;
  const hasInsight = !!insight?.summary;

  // Keep last insight visible while fading out when a new query clears it
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

  // 2 follow-up suggestions: pick prompts not similar to the last user message
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() ?? '';
  const followUpSuggestions = SUGGESTED_PROMPTS
    .filter(p => !p.toLowerCase().split(' ').some(w => w.length > 4 && lastUserMsg.includes(w)))
    .slice(0, 2);

  // Notify parent to hide/show the nav
  useEffect(() => {
    onChatActive?.(hasMessages);
    return () => onChatActive?.(false);
  }, [hasMessages]);

  return (
    <div className={`${styles.page} ${hasMessages ? styles.hasInsight : ''} ${hasMessages ? styles.chatActive : ''}`}>

      {/* ── Left / chat panel ── */}
      <div className={`${styles.left} ${hasMessages ? styles.leftChatActive : ''}`}>
        <div className={styles.inner}>

          {/* Back */}
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to portfolio
          </button>

          {/* Header */}
          <div className={styles.header}>
            <span className={styles.sectionLabel}>— AI Assistant</span>
            <h1 className={styles.title}>
              Ask anything about
              <br />
              <span className={styles.titleGradient}>Midhun's work</span>
            </h1>
            <p className={styles.subtitle}>
              Have a free conversation about Midhun and his works with the AI.
            </p>
          </div>

          {/* Messages */}
          <div ref={messagesContainerRef} className={styles.messages}>
            {!hasMessages && (
              <div className={styles.emptyState}>
                <p className={styles.emptyLabel}>Try asking</p>
                <div className={styles.suggestions}>
                  {SUGGESTED_PROMPTS.map(p => (
                    <button key={p} className={styles.suggestion} onClick={() => send(p)}>
                      <span className={styles.suggestionIcon}>✦</span>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    : <div className={styles.aiBubble}><MessageContent content={msg.content} /></div>}
                </div>
              );
            })}

            {loading && (
              <div className={`${styles.message} ${styles.assistantMessage}`}>
                <span className={styles.aiIcon}>✦</span>
                <div className={styles.typingDots}>
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up suggestions */}
          {hasMessages && !loading && followUpSuggestions.length > 0 && (
            <div className={styles.followUps}>
              {followUpSuggestions.map(p => (
                <button key={p} className={styles.followUpChip} onClick={() => { send(p); }}>
                  <span className={styles.suggestionIcon}>✦</span>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className={styles.inputWrap}>
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
              onClick={handleSend}
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
      <div className={`${styles.right} ${hasMessages ? styles.rightVisible : ''} ${hasMessages ? styles.rightChatActive : ''}`}>
        {/* Ambient glow orbs — converge when loading, retreat when insight arrives */}
        <div className={`${styles.orbLayer} ${hasMessages && !hasInsight ? styles.orbsLoading : ''} ${hasInsight ? styles.orbsDone : ''}`} aria-hidden>
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
