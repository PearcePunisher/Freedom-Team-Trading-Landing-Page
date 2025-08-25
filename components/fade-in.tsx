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
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { 
      setVisible(true); 
      return; 
    }
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    
    const checkVisibility = () => {
      if (hasTriggered && once) return false;
      
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      
      // Element must be at least partially visible
      const isVisible = rect.bottom > 0 && rect.top < vh;
      
      // Calculate how much of the element is visible
      const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const elementHeight = rect.height;
      const visibilityRatio = elementHeight > 0 ? visibleHeight / elementHeight : 0;
      
      // Check if element top has crossed the trigger point
      const triggerPoint = vh * (1 - enterViewportOffset);
      const hasPassedTrigger = rect.top <= triggerPoint;
      
      const shouldShow = isVisible && visibilityRatio >= amount && hasPassedTrigger;
      
      return shouldShow;
    };

    // Use scroll-based detection as primary method
    const handleScroll = () => {
      if (hasTriggered && once) return;
      
      if (checkVisibility() && !visible) {
        setVisible(true);
        setHasTriggered(true);
      }
    };

    // Initial check
    handleScroll();
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

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
