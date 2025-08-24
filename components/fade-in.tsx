"use client";
import React, { useEffect, useRef, useState } from "react";

interface FadeInProps extends React.ComponentPropsWithoutRef<'div'> {
  as?: keyof HTMLElementTagNameMap;
  delay?: number; // seconds
  duration?: number; // seconds
  y?: number; // initial translateY in px
  once?: boolean;
}

// A lightweight intersection-observer powered fade+slide in wrapper.
// Respects prefers-reduced-motion and only runs on client.
export function FadeIn({
  as = "div",
  delay = 0,
  duration = 0.6,
  y = 24,
  once = true,
  style,
  className = "",
  children,
  ...rest
}: FadeInProps) {
  const Comp: any = as;
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const base: React.CSSProperties = {
    opacity: 0,
    transform: `translateY(${y}px)`,
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
      className={className}
      style={{ ...base, ...transition, ...shown, ...style }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export default FadeIn;
