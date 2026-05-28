/**
 * Progressive blur + fade under the nav bar.
 *
 * Multiple backdrop-filter layers of increasing blur strength, each shorter
 * than the last and masked top→transparent at the bottom. Content scrolling
 * upward passes through progressively stronger blur zones before disappearing
 * behind the nav.
 *
 * Separate fade layer (gradient only, no blur) avoids mask+backdrop-filter
 * incompatibility across browsers.
 */

const BLUR_LAYERS = [
  { blur: 2,  height: 112 },
  { blur: 5,  height: 84  },
  { blur: 10, height: 60  },
  { blur: 18, height: 38  },
];

export function ScrollFade() {
  const base: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
    zIndex: 90,
  };

  return (
    <>
      {/* Progressive blur layers — weakest+tallest → strongest+shortest */}
      {BLUR_LAYERS.map(({ blur, height }) => (
        <div
          key={blur}
          aria-hidden
          style={{
            ...base,
            height,
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          }}
        />
      ))}

      {/* Colour fade layer — bg-base → transparent, no blur */}
      <div
        aria-hidden
        style={{
          ...base,
          height: '120px',
          background:
            'linear-gradient(to bottom, var(--bg-base) 0%, var(--bg-fade-mid) 55%, transparent 100%)',
        }}
      />
    </>
  );
}
