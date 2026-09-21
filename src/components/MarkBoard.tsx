import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  fetchPosts,
  createPost,
  getOrCreateDeviceId,
  hasDevicePosted,
  hasLocalPosted,
  markPosted,
  type EmojiPost,
} from '../lib/emojiBoard';
import { track } from '../lib/analytics';
import styles from './MarkBoard.module.css';

// ── Emoji registry ────────────────────────────────────────────────────────────
const EMOJIS = [
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
  { emoji: '🌷', code: '1f337', label: 'Tulip' },
  { emoji: '🦄', code: '1f984', label: 'Unicorn' },
  { emoji: '🍀', code: '1f340', label: 'Four-leaf clover' },
  { emoji: '💫', code: '1f4ab', label: 'Dizzy' },
  { emoji: '🎊', code: '1f38a', label: 'Confetti' },
  { emoji: '🌹', code: '1f339', label: 'Rose' },
  { emoji: '🤗', code: '1f917', label: 'Hugging face' },
  { emoji: '🥳', code: '1f973', label: 'Partying face' },
  { emoji: '💪', code: '1f4aa', label: 'Strength' },
  { emoji: '🎈', code: '1f388', label: 'Balloon' },
  { emoji: '⭐', code: '2b50', label: 'Star' },
  { emoji: '💐', code: '1f490', label: 'Bouquet' },
  { emoji: '🌛', code: '1f31b', label: 'Quarter moon' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function notoUrl(code: string) {
  return `https://fonts.gstatic.com/s/e/notoemoji/latest/${code}/512.webp`;
}

// Murmur-inspired hash for rotation / z-index (ID-based, stable)
function idHash(str: string, seed: number): number {
  let h1 = (0xdeadbeef ^ seed) >>> 0;
  let h2 = (0x41c6ce57 ^ seed) >>> 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = (Math.imul(h1 ^ ch, 2654435761)) >>> 0;
    h2 = (Math.imul(h2 ^ ch, 1597334677)) >>> 0;
  }
  h1 = (Math.imul(h1 ^ (h1 >>> 16), 2246822507)) >>> 0;
  h1 = (h1 ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)) >>> 0;
  return h1;
}

// Halton sequence — uniform low-discrepancy spread in [0,1]
function halton(index: number, base: number): number {
  let result = 0, f = 1, i = index + 1;
  while (i > 0) { f /= base; result += f * (i % base); i = Math.floor(i / base); }
  return result;
}

// Card position: Halton base for even spread, small ID-based jitter for organic feel
function getCardPos(index: number, id: string) {
  const hx = halton(index, 2); // base-2 Halton for x
  const hy = halton(index, 3); // base-3 Halton for y

  // Map to usable area — y capped at 52% to keep bottom CTA zone clear
  const baseX = 4 + hx * 82;
  const baseY = 5 + hy * 47;

  // ±2.5% deterministic jitter from ID so same post always lands same spot
  const jx = ((idHash(id, 0xA3C1) % 50) - 25) / 10;
  const jy = ((idHash(id, 0xB7F2) % 50) - 25) / 10;

  const rotate  = (idHash(id, 0xC5D3) % 13) - 6; // -6° to +6°
  const delay   = (idHash(id, 0xD9E4) % 40) / 100;

  return {
    left: `${Math.max(2, Math.min(87, baseX + jx)).toFixed(2)}%`,
    top:  `${Math.max(3, Math.min(54, baseY + jy)).toFixed(2)}%`,
    rotate,
    delay,
  };
}

function formatDate(iso: string): string {
  const then = new Date(iso).getTime();
  const now  = Date.now();
  const sec  = Math.max(0, Math.floor((now - then) / 1000));

  if (sec < 45)            return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60)            return `${min} minute${min === 1 ? '' : 's'} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24)             return `${hr} hour${hr === 1 ? '' : 's'} ago`;
  const day = Math.floor(hr / 24);
  if (day < 7)             return `${day} day${day === 1 ? '' : 's'} ago`;
  const wk = Math.floor(day / 7);
  if (wk < 5)              return `${wk} week${wk === 1 ? '' : 's'} ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12)             return `${mo} month${mo === 1 ? '' : 's'} ago`;
  const yr = Math.floor(day / 365);
  if (yr < 2)              return '1 year ago';
  if (yr <= 5)             return `${yr} years ago`;
  return `${yr}+ years ago`;
}

// ── Noto animated emoji with text fallback ────────────────────────────────────
function NotoEmoji({ code, emoji, size = 48 }: { code: string; emoji: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  return failed
    ? <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>{emoji}</span>
    : <img src={notoUrl(code)} alt={emoji} width={size} height={size}
        style={{ objectFit: 'contain', display: 'block' }}
        onError={() => setFailed(true)} />;
}

// ── Post card ─────────────────────────────────────────────────────────────────
function PostCard({
  post, index, isNew, isTapped, onTap,
}: {
  post: EmojiPost;
  index: number;
  isNew?: boolean;
  isTapped: boolean;
  onTap: (id: string) => void;
}) {
  const { left, top, rotate, delay } = getCardPos(index, post.id);
  const [yours, setYours] = useState(!!isNew);

  // Highlight the freshly-posted card for 5 seconds, then collapse to default.
  // Effect runs once on mount — captures initial isNew so a later parent reset
  // can't interrupt the 5-second highlight window.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isNew) return;
    setYours(true);
    const t = setTimeout(() => setYours(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const expanded = isTapped || yours;

  const handleTap = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTap(post.id);
  };

  return (
    <motion.div
      className={`${styles.card} ${expanded ? styles.cardExpanded : ''} ${yours ? styles.cardYours : ''}`}
      style={{ left, top }}
      initial={isNew
        ? { opacity: 0, scale: 2.4, rotate: rotate + 22, y: -280 }
        : { opacity: 0, scale: 0.7, rotate }}
      animate={isNew
        ? {
            opacity: [0, 1, 1, 1, 1],
            scale:   [2.4, 1.25, 0.92, 1.04, 1],
            rotate:  [rotate + 22, rotate - 6, rotate + 3, rotate - 1, rotate],
            y:       [-280, 14, -6, 2, 0],
          }
        : { opacity: 1, scale: 1, rotate, y: 0 }}
      transition={isNew
        ? { duration: 1.15, ease: [0.22, 0.9, 0.3, 1], times: [0, 0.5, 0.74, 0.9, 1] }
        : { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay }}
      onClick={handleTap}
    >
      {yours && <span className={styles.cardYoursRing} aria-hidden />}
      <div className={styles.cardEmoji}>
        <NotoEmoji code={post.emoji_code} emoji={post.emoji} size={52} />
      </div>
      <div className={styles.cardTag}>
        <p className={styles.cardTagName}>{post.name}{yours && <span className={styles.cardYoursTag}> · you</span>}</p>
        <p className={styles.cardTagDate}>{formatDate(post.created_at)}</p>
      </div>
    </motion.div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function PostModal({ onClose, onPosted }: {
  onClose: () => void;
  onPosted: (post: EmojiPost) => void;
}) {
  const [selectedEmoji, setSelectedEmoji] = useState(EMOJIS[0]);
  const [name, setName] = useState('');
  const [validating, setValidating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const deviceId = useRef(getOrCreateDeviceId());

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  async function handlePost() {
    const trimmed = name.trim();
    if (!trimmed) { setError('Please enter your name.'); return; }
    if (trimmed.length < 2) { setError('Name must be at least 2 characters.'); return; }

    setError('');
    setValidating(true);
    let nameValid = true, nameReason = '', nameCategory = '';
    try {
      const res = await fetch('/api/validate-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json() as { valid: boolean; category?: string; reason?: string };
      nameValid    = data.valid;
      nameReason   = data.reason ?? '';
      nameCategory = data.category ?? '';
    } catch { /* allow on error */ }
    setValidating(false);

    if (!nameValid) {
      if (nameCategory === 'profanity') {
        setError("That's not nice. Can't post that.");
        setName('');
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        setError(nameReason || "That name doesn't look right. Try your real name or nickname.");
      }
      return;
    }

    setSubmitting(true);
    const result = await createPost({
      name: trimmed,
      emoji: selectedEmoji.emoji,
      emoji_code: selectedEmoji.code,
      color: '#2a2839', // default, not shown
      device_id: deviceId.current,
    });
    setSubmitting(false);

    if (!result.ok) {
      if (result.error === 'already_posted') {
        markPosted(deviceId.current);
        setError("You've already left your mark!");
      } else if (result.error === 'not_configured') {
        setError('Board is not set up yet. Check back soon.');
      } else {
        setError('Something went wrong. Try again.');
      }
      return;
    }

    markPosted(deviceId.current);
    track('cta_click', { label: 'markboard_post', emoji: selectedEmoji.emoji });
    onPosted({
      id: `opt-${Date.now()}`,
      name: trimmed,
      emoji: selectedEmoji.emoji,
      emoji_code: selectedEmoji.code,
      color: '#2a2839',
      created_at: new Date().toISOString(),
    });
    onClose();
  }

  const isWorking = validating || submitting;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <h3 className={styles.modalTitle}>Leave your mark</h3>
            <p className={styles.modalSubtitle}>Pick an emoji and enter your name.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Emoji grid */}
        <div className={styles.emojiGrid}>
          {EMOJIS.map(e => (
            <button
              key={e.code}
              className={`${styles.emojiBtn} ${selectedEmoji.code === e.code ? styles.emojiBtnActive : ''}`}
              onClick={() => setSelectedEmoji(e)}
              title={e.label}
              aria-label={e.label}
            >
              <NotoEmoji code={e.code} emoji={e.emoji} size={30} />
            </button>
          ))}
        </div>

        {/* Preview */}
        <div>
          <p className={styles.previewLabel}>Preview</p>
          <div className={styles.previewRow}>
            <div className={styles.previewCard}>
              <div className={styles.cardEmoji} style={{ padding: '4px' }}>
                <NotoEmoji code={selectedEmoji.code} emoji={selectedEmoji.emoji} size={44} />
              </div>
              <div className={styles.previewTag}>
                <p className={styles.previewTagName}>{name || 'Your name'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Name input */}
        <div className={styles.nameRow}>
          <input
            className={`${styles.nameInput} ${shake ? styles.shake : ''}`}
            type="text"
            placeholder="Your name or handle"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            onKeyDown={e => e.key === 'Enter' && !isWorking && handlePost()}
            maxLength={30}
            autoComplete="off"
            spellCheck={false}
            disabled={isWorking}
            autoFocus
          />
          <button
            className={styles.postBtn}
            onClick={handlePost}
            disabled={isWorking || !name.trim()}
          >
            {validating ? 'Checking…' : submitting ? 'Posting…' : 'Post it'}
            {!isWorking && <i className="bi bi-arrow-right" style={{ fontSize: 13 }} />}
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
      </motion.div>
    </motion.div>
  );
}

// ── Dot-grid canvas ───────────────────────────────────────────────────────────
interface DotCanvasHandle { draw: () => void; }

const DotCanvas = forwardRef<DotCanvasHandle, {
  cursorRef: React.RefObject<{ x: number; y: number } | null>;
}>(function DotCanvas({ cursorRef }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr     = window.devicePixelRatio || 1;
    const cssW    = canvas.offsetWidth;
    const cssH    = canvas.offsetHeight;
    const spacing = 28;
    const cursor  = cursorRef.current;

    if (canvas.width !== Math.round(cssW * dpr) || canvas.height !== Math.round(cssH * dpr)) {
      canvas.width  = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    for (let x = spacing / 2; x < cssW + spacing; x += spacing) {
      for (let y = spacing / 2; y < cssH + spacing; y += spacing) {
        let factor = 0;
        if (cursor) {
          const dx   = x - cursor.x;
          const dy   = y - cursor.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const raw  = Math.max(0, 1 - dist / 130);
          factor = raw * raw * (3 - 2 * raw); // smoothstep
        }
        const opacity = 0.08 + factor * 0.62;  // 0.08 → 0.70
        const radius  = 1.5  + factor * 0.75;  // 1.5  → 2.25 (×1.5)

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
        ctx.fill();
      }
    }
  }, [cursorRef]);

  useImperativeHandle(ref, () => ({ draw }), [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    draw();
    const ro = new ResizeObserver(() => draw());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
        display: 'block',
      }}
    />
  );
});

// ── Section ───────────────────────────────────────────────────────────────────
export function MarkBoard() {
  const [posts, setPosts] = useState<EmojiPost[]>([]);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [hasPosted, setHasPosted] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tappedId, setTappedId] = useState<string | null>(null);
  const deviceId    = useRef(getOrCreateDeviceId());
  const cursorRef   = useRef<{ x: number; y: number } | null>(null);
  const rafRef      = useRef<number>(0);
  const dotCanvasRef = useRef<DotCanvasHandle>(null);

  // Tapping any card toggles it as the active one; tapping the board background clears it.
  const handleCardTap   = (id: string) => { track('cta_click', { label: 'markboard_card_tap' }); setTappedId(prev => (prev === id ? null : id)); };
  const handleBoardClick = () => setTappedId(null);

  const load = useCallback(async () => {
    const data = await fetchPosts();
    setPosts(data);
    setLoading(false);
    if (hasLocalPosted(deviceId.current)) {
      setHasPosted(true);
    } else {
      const remote = await hasDevicePosted(deviceId.current);
      if (remote) { setHasPosted(true); markPosted(deviceId.current); }
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function handlePosted(post: EmojiPost) {
    setHasPosted(true);
    setNewIds(prev => new Set([...prev, post.id]));
    setPosts(prev => [...prev, post]);
    setTimeout(() => {
      setNewIds(prev => { const n = new Set(prev); n.delete(post.id); return n; });
    }, 2500);
  }

  return (
    <section className={styles.section}>
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Community board</span>
          <h2 className="text-display">Everyone who<br className={styles.brMobile} /> stopped by</h2>
          <p className={`text-body ${styles.subtitle}`}>
            Leave your mark on the public board! Thank you for stopping by!
          </p>
        </motion.div>

        {/* Whiteboard — same width as page content */}
        <div
          className={styles.whiteboard}
          onClick={handleBoardClick}
          onMouseMove={e => {
            const r = e.currentTarget.getBoundingClientRect();
            cursorRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => dotCanvasRef.current?.draw());
          }}
          onMouseLeave={() => {
            cursorRef.current = null;
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => dotCanvasRef.current?.draw());
          }}
          onTouchMove={e => {
            const t = e.touches[0];
            if (!t) return;
            const r = e.currentTarget.getBoundingClientRect();
            cursorRef.current = { x: t.clientX - r.left, y: t.clientY - r.top };
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => dotCanvasRef.current?.draw());
          }}
          onTouchEnd={() => {
            cursorRef.current = null;
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(() => dotCanvasRef.current?.draw());
          }}
        >
        <DotCanvas ref={dotCanvasRef} cursorRef={cursorRef} />
        <AnimatePresence>
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              index={index}
              isNew={newIds.has(post.id)}
              isTapped={tappedId === post.id}
              onTap={handleCardTap}
            />
          ))}
        </AnimatePresence>

        {/* CTA fixed inside board at center-bottom */}
        <div className={styles.boardCta} onClick={e => e.stopPropagation()}>
          {hasPosted ? (
            <div className={styles.postedBadge}>
              <i className="bi bi-check-circle-fill" />
              You've left your mark
            </div>
          ) : (
            <button
              className={`btn btn-primary ${styles.ctaBtn}`}
              onClick={() => { track('cta_click', { label: 'markboard_open' }); setModalOpen(true); }}
            >
              Leave your mark
              <i className="bi bi-plus-lg" style={{ fontSize: 14 }} />
            </button>
          )}
        </div>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <PostModal
            onClose={() => setModalOpen(false)}
            onPosted={handlePosted}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
