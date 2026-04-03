import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../hooks/useChat';
import { SUGGESTED_PROMPTS } from '../data/aiContext';
import styles from './AIChat.module.css';

export interface AIChatHandle {
  focus: () => void;
  submit: (query: string) => void;
}

export const AIChat = forwardRef<AIChatHandle>((_, ref) => {
  const { messages, loading, send, clear } = useChat();
  const [input, setInput] = useState('');
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim()) return;
    send(input);
    setInput('');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePrompt = (prompt: string) => {
    send(prompt);
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
                  Ready to answer
                </div>
              </div>
            </div>
            {hasMessages && (
              <button className={`btn btn-ghost ${styles.clearBtn}`} onClick={clear}>
                Clear chat
              </button>
            )}
          </div>

          {/* Conversation area */}
          <div className={styles.conversation}>
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

          {/* Suggested prompts */}
          <AnimatePresence>
            {!hasMessages && (
              <motion.div
                className={styles.prompts}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className={styles.promptsLabel}>Suggested prompts</p>
                <div className={styles.promptPills}>
                  {SUGGESTED_PROMPTS.map((p) => (
                    <button
                      key={p}
                      className={styles.promptPill}
                      onClick={() => handlePrompt(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}
