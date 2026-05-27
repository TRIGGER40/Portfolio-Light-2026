import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackgroundGlow } from '../components/BackgroundGlow';
import {
  fetchPosts,
  createPost,
  getOrCreateDeviceId,
  hasDevicePosted,
  hasLocalPosted,
  markPosted,
  type EmojiPost,
} from '../lib/emojiBoard';
import styles from './BoardPage.module.css';

// ── Emoji registry ────────────────────────────────────────────────────────────
export const EMOJIS = [
  { emoji: '🤩', code: '1f929', label: 'Star-struck' },
  { emoji: '😍', code: '1f60d', label: 'Heart eyes' },
  { emoji: '❤️', code: '2764_fe0f', label: 'Heart' },
  { emoji: '🔥', code: '1f525', label: 'Fire' },
  { emoji: '🎉', code: '1f389', label: 'Party' },
  { emoji: '💯', code: '1f4af', label: '100' },
  { emoji: '👏', code: '1f44f', label: 'Clap' },
  { emoji: '🐣', code: '1f423', label: 'Hatching chick' },
  { emoji: '✨', code: '2728', label: 'Sparkles' },
  { emoji: '🌈', code: '1f308', label: 'Rainbow' },
  { emoji: '🦋', code: '1f98b', label: 'Butterfly' },
  { emoji: '🌸', code: '1f338', label: 'Cherry blossom' },
  { emoji: '🌟', code: '1f31f', label: 'Glowing star' },
  { emoji: '💎', code: '1f48e', label: 'Diamond' },
  { emoji: '🏆', code: '1f3c6', label: 'Trophy' },
  { emoji: '🌻', code: '1f33b', label: 'Sunflower' },
  { emoji: '🦄', code: '1f984', label: 'Unicorn' },
  { emoji: '🍀', code: '1f340', label: 'Four-leaf clover' },
  { emoji: '💫', code: '1f4ab', label: 'Dizzy' },
  { emoji: '🎊', code: '1f38a', label: 'Confetti' },
  { emoji: '🌺', code: '1f33a', label: 'Hibiscus' },
  { emoji: '🤗', code: '1f917', label: 'Hugging face' },
  { emoji: '🥳', code: '1f973', label: 'Partying face' },
  { emoji: '💪', code: '1f4aa', label: 'Strength' },
  { emoji: '🎈', code: '1f388', label: 'Balloon' },
  { emoji: '🌠', code: '1f320', label: 'Shooting star' },
  { emoji: '🎀', code: '1f380', label: 'Ribbon' },
  { emoji: '🌙', code: '1f319', label: 'Crescent moon' },
];

function notoUrl(code: string): string {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`;
}

// Deterministic rotation from post ID for scattered feel
function getRotation(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  return ((Math.abs(h) % 9) - 4); // -4 to +4 deg
}

function getOffsetY(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(17, h) + id.charCodeAt(i)) | 0;
  }
  return ((Math.abs(h) % 16) - 8); // -8 to +8 px
}

// ── Animated emoji image with fallback ────────────────────────────────────────
function NotoEmoji({ code, emoji, size = 56 }: { code: string; emoji: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <span style={{ fontSize: size, lineHeight: 1 }}>{emoji}</span>
  ) : (
    <img
      src={notoUrl(code)}
      alt={emoji}
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block' }}
      onError={() => setFailed(true)}
    />
  );
}

// ── Single post card ───────────────────────────────────────────────────────────
function PostCard({ post, isNew }: { post: EmojiPost; isNew: boolean }) {
  const rotate = getRotation(post.id);
  const offsetY = getOffsetY(post.id);

  return (
    <motion.div
      className={styles.card}
      style={{
        '--rotate': `${rotate}deg`,
        '--offset-y': `${offsetY}px`,
      } as React.CSSProperties}
      initial={isNew ? { opacity: 0, scale: 0.5, rotate: rotate - 10 } : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1, rotate }}
      transition={
        isNew
          ? { type: 'spring', stiffness: 300, damping: 20 }
          : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      }
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 10, transition: { duration: 0.2 } }}
    >
      <div className={styles.cardEmoji}>
        <NotoEmoji code={post.emoji_code} emoji={post.emoji} size={52} />
      </div>
      <div className={styles.cardName}>{post.name}</div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function BoardPage() {
  const [posts, setPosts] = useState<EmojiPost[]>([]);
  const [newPostIds, setNewPostIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Posting state
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [hasPosted, setHasPosted] = useState(false);

  const deviceId = useRef(getOrCreateDeviceId());
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const knownIds = useRef<Set<string>>(new Set());

  // Initial load
  useEffect(() => {
    async function load() {
      const data = await fetchPosts();
      setPosts(data);
      data.forEach(p => knownIds.current.add(p.id));
      setLoading(false);

      // Check if this device already posted
      const localPosted = hasLocalPosted(deviceId.current);
      if (localPosted) {
        setHasPosted(true);
      } else {
        const serverPosted = await hasDevicePosted(deviceId.current);
        if (serverPosted) {
          setHasPosted(true);
          markPosted(deviceId.current);
        }
      }
    }
    load();

    // Poll for new posts every 8s
    pollRef.current = setInterval(async () => {
      const data = await fetchPosts();
      const incoming = data.filter(p => !knownIds.current.has(p.id));
      if (incoming.length > 0) {
        incoming.forEach(p => knownIds.current.add(p.id));
        setNewPostIds(prev => {
          const next = new Set(prev);
          incoming.forEach(p => next.add(p.id));
          return next;
        });
        setPosts(data);
        // Clear the "new" flag after animation
        setTimeout(() => {
          setNewPostIds(prev => {
            const next = new Set(prev);
            incoming.forEach(p => next.delete(p.id));
            return next;
          });
        }, 2000);
      }
    }, 8000);

    return () => clearInterval(pollRef.current);
  }, []);

  async function handlePost() {
    const trimmedName = name.trim();
    if (!trimmedName) { setError('Please enter your name.'); return; }
    if (trimmedName.length < 2) { setError('Name must be at least 2 characters.'); return; }

    setError('');
    setValidating(true);

    // AI name validation
    let nameValid = true;
    let nameReason = '';
    try {
      const res = await fetch('/api/validate-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }),
      });
      const data = await res.json() as { valid: boolean; reason?: string };
      nameValid = data.valid;
      nameReason = data.reason ?? '';
    } catch {
      // Network error — allow posting
    }

    setValidating(false);

    if (!nameValid) {
      setError(nameReason || 'That name doesn\'t seem right. Try your real name or nickname.');
      return;
    }

    setSubmitting(true);
    const result = await createPost({
      name: trimmedName,
      emoji: selectedEmoji.emoji,
      emoji_code: selectedEmoji.code,
      color: '#2a2839',
      device_id: deviceId.current,
    });
    setSubmitting(false);

    if (!result.ok) {
      if (result.error === 'already_posted') {
        setHasPosted(true);
        markPosted(deviceId.current);
      } else if (result.error === 'not_configured') {
        setError('Board is not set up yet. Check back soon.');
      } else {
        setError('Something went wrong. Try again.');
      }
      return;
    }

    // Success
    markPosted(deviceId.current);
    setHasPosted(true);

    // Optimistic update
    const newPost: EmojiPost = {
      id: `optimistic-${Date.now()}`,
      name: trimmedName,
      emoji: selectedEmoji.emoji,
      emoji_code: selectedEmoji.code,
      color: '#2a2839',
      created_at: new Date().toISOString(),
    };
    knownIds.current.add(newPost.id);
    setNewPostIds(prev => new Set([...prev, newPost.id]));
    setPosts(prev => [...prev, newPost]);
    setTimeout(() => {
      setNewPostIds(prev => {
        const next = new Set(prev);
        next.delete(newPost.id);
        return next;
      });
    }, 2000);
  }

  const isWorking = validating || submitting;

  return (
    <>
      <BackgroundGlow />
      <main className={styles.page}>

        {/* Header */}
        <motion.header
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Public board</span>
          <h1 className={styles.title}>
            Leave your mark
            <span className={styles.titleAccent}> ✦</span>
          </h1>
          <p className={styles.subtitle}>
            Pick an emoji, drop your name. One post per person.
          </p>
          <div className={styles.countPill}>
            <span className={styles.countDot} />
            {loading ? '…' : posts.length} {posts.length === 1 ? 'mark' : 'marks'} left
          </div>
        </motion.header>

        {/* Board */}
        <section className={styles.board}>
          {loading ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>✦</span>
              <p>Loading the board…</p>
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              className={styles.empty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className={styles.emptyIcon}>🌟</span>
              <p>Be the first to leave your mark.</p>
            </motion.div>
          ) : (
            <div className={styles.postsGrid}>
              <AnimatePresence>
                {posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isNew={newPostIds.has(post.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Post bar */}
        <div className={styles.postBarWrap}>
          <motion.div
            className={styles.postBar}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {hasPosted ? (
              <div className={styles.postedState}>
                <NotoEmoji code={selectedEmoji.code} emoji={selectedEmoji.emoji} size={28} />
                <span>Your mark is on the board. Thanks for stopping by!</span>
              </div>
            ) : (
              <>
                {/* Emoji picker */}
                <div className={styles.pickerWrap}>
                  <div className={styles.picker}>
                    {EMOJIS.map(e => (
                      <button
                        key={e.code}
                        className={`${styles.pickerBtn} ${selectedEmoji.code === e.code ? styles.pickerBtnActive : ''}`}
                        onClick={() => setSelectedEmoji(e)}
                        title={e.label}
                        aria-label={e.label}
                      >
                        <NotoEmoji code={e.code} emoji={e.emoji} size={28} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + submit */}
                <div className={styles.inputRow}>
                  <div className={styles.selectedPreview}>
                    <NotoEmoji code={selectedEmoji.code} emoji={selectedEmoji.emoji} size={32} />
                  </div>
                  <input
                    className={styles.nameInput}
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => { setName(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && !isWorking && handlePost()}
                    maxLength={30}
                    autoComplete="off"
                    spellCheck={false}
                    disabled={isWorking}
                  />
                  <button
                    className={styles.postBtn}
                    onClick={handlePost}
                    disabled={isWorking || !name.trim()}
                  >
                    {validating ? 'Checking…' : submitting ? 'Posting…' : 'Post'}
                  </button>
                </div>

                {error && (
                  <motion.p
                    className={styles.errorMsg}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
              </>
            )}
          </motion.div>
        </div>
      </main>
    </>
  );
}
