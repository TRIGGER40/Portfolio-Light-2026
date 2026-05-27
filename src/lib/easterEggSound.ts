/* Premium synthetic audio using Web Audio API — no audio files needed */

type OscType = OscillatorType;

/* ── Singleton AudioContext ────────────────────────────────────────────────
   Mobile browsers (iOS Safari, Android Chrome) require an AudioContext to be
   created and resumed within a user-gesture call stack. We create one context
   for the whole session and unlock it on the first touch/click so it's already
   in 'running' state when the chime fires seconds later.
─────────────────────────────────────────────────────────────────────────── */
let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (_ctx) return _ctx;
  try {
    _ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    )();
    return _ctx;
  } catch {
    return null;
  }
}

// Unlock the context on the first user interaction so audio can play later.
if (typeof window !== 'undefined') {
  const unlock = () => {
    const ctx = getCtx();
    if (ctx && ctx.state === 'suspended') ctx.resume();
  };
  window.addEventListener('touchstart', unlock, { once: true, passive: true });
  window.addEventListener('click',      unlock, { once: true });
}

/* ── Internal tone helper ─────────────────────────────────────────────── */
function tone(
  ctx: AudioContext,
  master: GainNode,
  freq: number,
  start: number,
  duration: number,
  volume = 1,
  type: OscType = 'sine',
) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0, ctx.currentTime + start);
  gain.gain.linearRampToValueAtTime(volume * 0.22, ctx.currentTime + start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001,   ctx.currentTime + start + duration);
  osc.connect(gain);
  gain.connect(master);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

/* ── Public API ───────────────────────────────────────────────────────── */

/** Metallic glass chime — plays on single egg discovery */
export function playDiscoveryChime() {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const master = ctx.createGain();
  master.gain.value = 0.45;
  master.connect(ctx.destination);

  // Root chord — A pentatonic metallic shimmer
  tone(ctx, master, 880,  0,    2.4, 0.9);   // A5
  tone(ctx, master, 1320, 0.06, 2.1, 0.55);  // E6
  tone(ctx, master, 1760, 0.12, 1.8, 0.30);  // A6
  tone(ctx, master, 2640, 0.18, 1.2, 0.14);  // E7 shimmer

  // Warm decay tail
  tone(ctx, master, 440,  0.45, 3.2, 0.18);  // A4
}

/** Rising completion chord — plays when all 3 eggs found */
export function playCompletionChime() {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const master = ctx.createGain();
  master.gain.value = 0.38;
  master.connect(ctx.destination);

  // Rising arpeggio — C major, open and triumphant
  const seq = [523, 659, 784, 1047, 1319, 1568, 2093];
  seq.forEach((freq, i) => {
    tone(ctx, master, freq, i * 0.14, 3.0 + i * 0.2, 1 - i * 0.07);
  });

  // Warm resonance underneath
  tone(ctx, master, 261, 0.6, 5.0, 0.28);
}
