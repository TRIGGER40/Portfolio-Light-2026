import { useState } from 'react';
import { Loader } from './Loader';

/**
 * Drop-in replacement for <img> inside any position:relative overflow:hidden wrapper.
 * Renders a white skeleton with 3 floating glow orbs + spinning edge highlight + a
 * centred gradient spinner while loading. Fades the real image in once loaded.
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
    setLoaded(true); // remove skeleton even on error
    onError?.(e);
  };

  return (
    <>
      {!loaded && (
        <div className="img-skeleton-overlay" aria-hidden>
          <Loader
            size={24}
            className="img-skeleton-spinner"
          />
        </div>
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
