"use client";

import React from "react";

interface LazyVimeoProps {
  /** Vimeo numeric video id */
  id: string;
  /** Hash/security parameter (h=...) from original embed, if any */
  hash?: string;
  title: string;
  className?: string;
  /** Load automatically when near viewport (default true) */
  auto?: boolean;
  /** Extra root margin to start loading earlier (e.g. '400px') */
  rootMargin?: string;
}

export const LazyVimeo: React.FC<LazyVimeoProps> = ({
  id,
  hash,
  title,
  className = "",
  auto = true,
  rootMargin = "400px",
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!auto || loaded) return;
    const el = containerRef.current;
    if (!el) return;
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      // Fallback: load after a tick
      const t = setTimeout(() => setLoaded(true), 800);
      return () => clearTimeout(t);
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoaded(true);
            observer.disconnect();
          }
        });
      },
      { root: null, rootMargin, threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [auto, loaded, rootMargin]);

  const src = React.useMemo(() => {
    const params = new URLSearchParams();
    if (hash) params.set("h", hash);
    params.set("dnt", "1");
    return `https://player.vimeo.com/video/${id}?${params.toString()}`;
  }, [id, hash]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full aspect-video bg-muted rounded-lg overflow-hidden ${className}`}
    >
      {!loaded && (
        <button
            type="button"
            aria-label={`Load video: ${title}`}
            onClick={() => setLoaded(true)}
            className="group absolute inset-0 flex items-center justify-center cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-accent/90 text-accent-foreground flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 ml-1"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span className="text-xs uppercase tracking-wide text-foreground/70">Load Video</span>
            </div>
          </button>
      )}
      {loaded && (
        <iframe
          title={title}
          src={src}
          width="100%"
          height="100%"
          className="absolute inset-0 w-full h-full"
          frameBorder={0}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        />
      )}
    </div>
  );
};

export default LazyVimeo;
