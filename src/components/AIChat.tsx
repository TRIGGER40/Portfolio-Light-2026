import { useRef, useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { SUGGESTED_PROMPTS, TAGGED_PROMPTS, PROJECT_LINKS } from '../data/aiContext';
import type { PromptTopic } from '../data/aiContext';
import styles from './AIChat.module.css';

/** Inject <a data-nav="/path"> tags around project name keywords */
function injectProjectLinks(text: string): string {
  let result = text;
  for (const { pattern, route } of PROJECT_LINKS) {
    result = result.replace(
      pattern,
      (match) => `<a data-nav="${route}" class="${styles.projectLink}">${match}</a>`
    );
  }
  return result;
}

export interface AIChatHandle {
  focus: () => void;
  submit: (query: string) => void;
}

// ── Follow-up prompt engine ───────────────────────────────
function pickFollowUps(lastResponse: string, usedTexts: Set<string>): string[] {
  const t = lastResponse.toLowerCase();

  const scores: Record<PromptTopic, number> = {
    identity: 0, experience: 0, projects: 0,
    process: 0, ai: 0, collaboration: 0, hiring: 0,
  };

  if (t.includes('adobe') || t.includes('connect'))          scores.experience  += 3;
  if (t.includes('bizongo'))                                  scores.experience  += 2;
  if (t.includes('quiz') || t.includes('ppe') || t.includes('qc') || t.includes('project'))
                                                              scores.projects    += 3;
  if (t.includes('ai') || t.includes('generative') || t.includes('artificial'))
                                                              scores.ai          += 3;
  if (t.includes('engineer') || t.includes('stakeholder') || t.includes('collaborat'))
                                                              scores.collaboration += 3;
  if (t.includes('process') || t.includes('research') || t.includes('approach') || t.includes('system'))
                                                              scores.process     += 3;
  if (t.includes('strength') || t.includes('philosophy') || t.includes('value') || t.includes('who'))
                                                              scores.identity    += 3;
  if (t.includes('hire') || t.includes('role') || t.includes('senior') || t.includes('stand out'))
                                                              scores.hiring      += 3;

  // Boost topics NOT yet covered so we spread the conversation
  const coveredTopics = new Set<PromptTopic>();
  TAGGED_PROMPTS.forEach(p => { if (usedTexts.has(p.text)) coveredTopics.add(p.topic); });
  (Object.keys(scores) as PromptTopic[]).forEach(topic => {
    if (!coveredTopics.has(topic)) scores[topic] += 1;
  });

  const sortedTopics = (Object.keys(scores) as PromptTopic[])
    .sort((a, b) => scores[b] - scores[a]);

  const result: string[] = [];
  for (const topic of sortedTopics) {
    if (result.length >= 3) break;
    const candidates = TAGGED_PROMPTS.filter(p => p.topic === topic && !usedTexts.has(p.text));
    if (candidates.length) result.push(candidates[0].text);
  }

  // Fill remaining with any unused prompt
  if (result.length < 3) {
    TAGGED_PROMPTS
      .filter(p => !usedTexts.has(p.text) && !result.includes(p.text))
      .slice(0, 3 - result.length)
      .forEach(p => result.push(p.text));
  }

  return result;
}

// ─────────────────────────────────────────────────────────
export const AIChat = forwardRef<AIChatHandle>((_, ref) => {
  const navigate = useNavigate();
  const { messages, loading, send, clear } = useChat();
  const [input, setInput] = useState('');
  const [displayedPrompts, setDisplayedPrompts] = useState<string[]>(
    SUGGESTED_PROMPTS.slice(0, 4) as unknown as string[]
  );
  const [promptKey, setPromptKey] = useState(0); // triggers re-animation
  const usedTextsRef = useRef<Set<string>>(new Set());
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasMessages = messages.length > 0;

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },
    submit: (query: string) => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => send(query), 300);
    },
  }));

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Update prompts after every new assistant response
  useEffect(() => {
    if (loading) return;
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistant) return;
    const next = pickFollowUps(lastAssistant.content, usedTextsRef.current);
    if (next.length > 0) {
      setDisplayedPrompts(next);
      setPromptKey(k => k + 1);
    }
  }, [messages, loading]);


  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    usedTextsRef.current.add(input.trim());
    send(input);
    setInput('');
  }, [input, send]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePrompt = (prompt: string) => {
    usedTextsRef.current.add(prompt);
    send(prompt);
  };

  const handleClear = () => {
    clear();
    usedTextsRef.current.clear();
    setDisplayedPrompts(SUGGESTED_PROMPTS.slice(0, 4) as unknown as string[]);
    setPromptKey(k => k + 1);
  };

  return (
    <section className="section" id="ai">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">AI Assistant</span>
          <h2 className={`text-display ${styles.title}`}>
            Ask anything about
            <br />
            <span className="gradient-text">Midhun's work</span>
          </h2>
          <p className={`text-body ${styles.subtitle}`}>
            Powered by Claude. Answers are grounded in real projects, decisions, and outcomes.
          </p>
        </motion.div>

        <motion.div
          className={`glass ${styles.chatContainer}`}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header bar */}
          <div className={styles.chatHeader}>
            <div className={styles.chatTitle}>
              <div className={styles.aiAvatar}>
                <span>✦</span>
              </div>
              <div>
                <div className={styles.chatName}>Midhun's AI</div>
                <div className={styles.chatStatus}>
                  <span className={styles.statusDot} />
                  {loading ? 'Thinking…' : 'Ready to answer'}
                </div>
              </div>
            </div>
            {hasMessages && (
              <button className={`btn btn-ghost ${styles.clearBtn}`} onClick={handleClear}>
                Clear chat
              </button>
            )}
          </div>

          {/* Conversation area */}
          <div
            className={styles.conversation}
            onClick={(e) => {
              const link = (e.target as HTMLElement).closest('[data-nav]') as HTMLElement | null;
              if (link?.dataset.nav) {
                e.preventDefault();
                navigate(link.dataset.nav);
              }
            }}
          >
            <AnimatePresence initial={false}>
              {!hasMessages && (
                <motion.div
                  className={styles.emptyState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className={styles.emptyText}>
                    Ask me anything about Midhun's experience, projects, or working style.
                  </p>
                </motion.div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`${styles.message} ${msg.role === 'user' ? styles.userMsg : styles.assistantMsg}`}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {msg.role === 'assistant' && (
                    <div className={styles.msgAvatar}>✦</div>
                  )}
                  <div className={styles.msgBubble}>
                    <MessageContent content={msg.content} />
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  className={`${styles.message} ${styles.assistantMsg}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className={styles.msgAvatar}>✦</div>
                  <div className={`${styles.msgBubble} ${styles.typing}`}>
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                    <span className={styles.typingDot} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested prompts — always visible, updates after each response */}
          <div className={styles.prompts}>
            <p className={styles.promptsLabel}>
              {hasMessages ? 'You might also ask' : 'Suggested prompts'}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={promptKey}
                className={styles.promptPills}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {displayedPrompts.map((p) => (
                  <button
                    key={p}
                    className={styles.promptPill}
                    onClick={() => handlePrompt(p)}
                    disabled={loading}
                  >
                    {p}
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Input area */}
          <div className={styles.inputArea}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about projects, skills, working style…"
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
        </motion.div>
      </div>
    </section>
  );
});

AIChat.displayName = 'AIChat';

/** Render assistant messages with basic markdown-like formatting */
function MessageContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className={styles.msgContent}>
      {lines.map((line, i) => {
        if (line.startsWith('## ')) {
          return <h4 key={i} className={styles.msgH4}>{line.slice(3)}</h4>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <strong key={i} className={styles.msgStrong}>{line.slice(2, -2)}</strong>;
        }
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return (
            <div key={i} className={styles.msgListItem}>
              <span className={styles.msgBullet}>·</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className={styles.msgSpacer} />;
        return (
          <p key={i} className={styles.msgPara} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        );
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
