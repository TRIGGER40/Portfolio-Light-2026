interface EggIconProps {
  size?: number;
  state?: 'undiscovered' | 'discovered' | 'complete';
  className?: string;
  eggIndex?: number;   // 0 | 1 | 2 — uses actual PNG when provided
}

/* Public-folder paths (space in folder name is fine via URL) */
const EGG_PNGS = [
  '/Easter%20eggs/Egg1.png',
  '/Easter%20eggs/Egg2.png',
  '/Easter%20eggs/Egg3.png',
];

const GRAD_DISCOVERED = { from: '#7c3aed', to: '#5254d8' };
const GRAD_COMPLETE   = { from: '#f59e0b', to: '#d97706' };

export function EggIcon({ size = 24, state = 'undiscovered', className, eggIndex }: EggIconProps) {
  /* ── PNG path ── use actual egg image when index is provided */
  if (eggIndex !== undefined && EGG_PNGS[eggIndex]) {
    const isUndiscovered = state === 'undiscovered';
    return (
      <img
        src={EGG_PNGS[eggIndex]}
        width={size}
        alt=""
        className={className}
        draggable={false}
        style={{
          display: 'block',
          width: size,
          height: 'auto',
          objectFit: 'contain',
          filter: isUndiscovered
            ? 'grayscale(1) opacity(0.32)'
            : undefined,
          transition: 'filter 0.4s ease',
          userSelect: 'none',
        }}
        aria-hidden="true"
      />
    );
  }

  /* ── SVG fallback (used in EasterEggTracker at 16px) ── */
  const id = `eg-${state}-${size}`;
  const isDiscovered = state !== 'undiscovered';
  const isComplete   = state === 'complete';
  const grad = isComplete ? GRAD_COMPLETE : GRAD_DISCOVERED;

  if (!isDiscovered) {
    return (
      <svg
        width={size}
        height={Math.round(size * 1.25)}
        viewBox="0 0 32 40"
        fill="none"
        className={className}
        aria-hidden="true"
      >
        <path
          d="M16 2C9 2 2 12 2 22C2 33 8.5 38 16 38C23.5 38 30 33 30 22C30 12 23 2 16 2Z"
          stroke="rgba(82,84,216,0.45)"
          strokeWidth="1.5"
          fill="rgba(82,84,216,0.04)"
        />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={Math.round(size * 1.25)}
      viewBox="0 0 32 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor={grad.from} />
          <stop offset="100%" stopColor={grad.to} />
        </linearGradient>
        <radialGradient id={`${id}-hi`} cx="32%" cy="28%" r="42%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      <path
        d="M16 2C9 2 2 12 2 22C2 33 8.5 38 16 38C23.5 38 30 33 30 22C30 12 23 2 16 2Z"
        fill={`url(#${id}-grad)`}
      />
      <path
        d="M16 2C9 2 2 12 2 22C2 33 8.5 38 16 38C23.5 38 30 33 30 22C30 12 23 2 16 2Z"
        fill={`url(#${id}-hi)`}
      />
      <path
        d="M16 2C9 2 2 12 2 22C2 33 8.5 38 16 38C23.5 38 30 33 30 22C30 12 23 2 16 2Z"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.75"
        fill="none"
      />
    </svg>
  );
}
