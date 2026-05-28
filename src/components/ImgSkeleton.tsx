import { useState } from 'react';

/**
 * Drop-in replacement for <img> inside any position:relative overflow:hidden wrapper.
 * Shows a grey shimmer swipe while loading, fades the real image in once ready.
 */
export function ImgSkeleton({
  onLoad,
  onError,
  style,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setLoaded(true);
    onLoad?.(e);
  };

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    setLoaded(true);
    onError?.(e);
  };

  return (
    <>
      {!loaded && (
        <div className="img-skeleton-overlay" aria-hidden />
      )}
      <img
        {...props}
        style={{
          ...style,
          opacity: loaded ? 1 : 0,
          transition: loaded ? 'opacity 0.45s ease' : 'none',
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </>
  );
}
