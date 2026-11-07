"use client";

import { useEffect, useState, type RefObject } from "react";

/** True once the element has scrolled into view (fires once). */
export function useInView<T extends Element>(
  ref: RefObject<T | null>,
  options: { threshold?: number; rootMargin?: string } = {},
) {
  const [seen, setSeen] = useState(false);
  const { threshold = 0.25, rootMargin = "0px 0px -6% 0px" } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, seen, threshold, rootMargin]);

  return seen;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
