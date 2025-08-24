"use client";
import React, { useEffect, useRef, useState } from "react";

interface FadeInProps extends React.ComponentPropsWithoutRef<'div'> {
  as?: keyof HTMLElementTagNameMap;
  delay?: number; // seconds
  duration?: number; // seconds
  y?: number; // initial translateY in px
  once?: boolean;
  amount?: number; // intersection ratio threshold (0-1) OR min visible ratio when using IO
  rootMargin?: string; // custom rootMargin for IO
  enterViewportOffset?: number; // fraction of viewport height from bottom before triggering (0 = immediately, 0.2 = when element top is within bottom 80%)
  debug?: boolean; // console.log diagnostics
}

// A lightweight intersection-observer powered fade+slide in wrapper.
// Respects prefers-reduced-motion and only runs on client.
export function FadeIn({
  as = "div",
  delay = 0,
  duration = 0.6,
  y = 24,
  once = true,
  amount = 0.25,
  rootMargin = "0px 0px -25% 0px",
  enterViewportOffset = 0.1,
  debug = false,
  style,
  className = "",
  children,
  ...rest
}: FadeInProps) {
  const Comp: any = as;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVisible(true); return; }
    const el = ref.current as HTMLElement | null;
    if (!el) return;

    let hasIntersected = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!ref.current) return;
        if (visible && once) return; // already done
        const ratio = entry.intersectionRatio;
        const rect = entry.boundingClientRect;
        const vh = window.innerHeight || document.documentElement.clientHeight;
        // Additional guard: only trigger when element top is within bottom (1 - enterViewportOffset) of viewport
        const topWithin = rect.top <= vh * (1 - enterViewportOffset);
        if (entry.isIntersecting && ratio >= amount && topWithin) {
          if (!visible) {
            if (debug) console.log('[FadeIn] show', { ratio, top: rect.top, id: el.dataset?.fadeId });
            setVisible(true);
          }
          if (once) {
            hasIntersected = true;
            observer.unobserve(entry.target);
          }
        } else if (!once && !entry.isIntersecting && hasIntersected) {
          // Allow repeating if once = false
          setVisible(false);
        }
      });
    }, {
      root: null,
      rootMargin,
      threshold: [0, amount * 0.5, amount, amount + (1 - amount) / 2, 1]
    });

    observer.observe(el);
    // Fallback timeout: if IO never fires (e.g., display:none turned to block later), force re-check
    const fallback = window.setTimeout(() => {
      if (!visible) {
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < vh && rect.bottom > 0) {
          if (debug) console.log('[FadeIn] fallback show', { rect });
          setVisible(true);
        }
      }
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [once, amount, rootMargin, enterViewportOffset, debug, visible]);

  const base: React.CSSProperties = {
    opacity: 0,
    transform: `translateY(${y}px)`,
    willChange: 'opacity, transform'
  };
  const shown: React.CSSProperties = visible
    ? { opacity: 1, transform: "translateY(0)" }
    : {};
  const transition: React.CSSProperties = {
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}s`,
    transitionTimingFunction: "cubic-bezier(.4,.0,.2,1)",
    transitionDelay: `${delay}s`,
  };

  return (
    <Comp
      ref={ref}
      data-fade-id
      className={className}
      style={{ ...base, ...transition, ...shown, ...style }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export default FadeIn;
