"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { prefersReducedMotion } from "./useInView";

/**
 * Subtle scroll motion for a whole page:
 *  - sections, articles and [data-reveal] blocks fade/rise into place as they
 *    enter the viewport (anything already visible on load is left alone);
 *  - groups of cards inside a grid cascade in one after another;
 *  - optional thin scroll-progress bar.
 *
 * Progressive enhancement: all hiding is applied from JavaScript, and nothing
 * is hidden when the visitor prefers reduced motion.
 */

const TARGETS = "main section, main article, [data-reveal]";
const SKIP =
  "[data-no-reveal], .kc-home-hero, header, nav, footer, dialog, [role='dialog'], [aria-modal='true'], .kc-mission-vision";
const GRID = "[class*='grid-cols'], [data-reveal-stagger]";

function inViewNow(el: Element) {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * 0.92 && r.bottom > 0;
}

function isFloating(el: Element) {
  const p = getComputedStyle(el).position;
  return p === "fixed" || p === "sticky";
}

export function ScrollEffects({ progress = false }: { progress?: boolean }) {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);

  // Reveal on scroll.
  useEffect(() => {
    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;

    const pending = new Set<HTMLElement>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          el.classList.add("kc-in");
          const done = () => {
            el.classList.remove("kc-rv", "kc-in");
            el.style.removeProperty("--kc-rv-delay");
            pending.delete(el);
          };
          el.addEventListener("transitionend", done, { once: true });
          window.setTimeout(done, 1600);
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" },
    );

    const prepare = (el: HTMLElement, delay = 0) => {
      if (el.classList.contains("kc-rv") || pending.has(el)) return;
      if (el.closest(SKIP) || isFloating(el) || inViewNow(el)) return;
      if (delay) el.style.setProperty("--kc-rv-delay", `${delay}ms`);
      el.classList.add("kc-rv");
      pending.add(el);
      observer.observe(el);
    };

    const scan = () => {
      const all = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
      // Reveal outermost blocks only; nested sections ride along with their parent.
      for (const el of all) {
        const parentTarget = el.parentElement?.closest(TARGETS);
        if (!parentTarget) prepare(el);
      }
      // Cascade the cards of small grids.
      for (const grid of Array.from(document.querySelectorAll<HTMLElement>(GRID))) {
        if (grid.closest(SKIP)) continue;
        const kids = Array.from(grid.children) as HTMLElement[];
        if (kids.length < 2 || kids.length > 9) continue;
        if (!kids.every((k) => k.offsetHeight > 80)) continue;
        kids.forEach((k, i) => prepare(k, Math.min(i, 5) * 90));
      }
    };

    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(scan);
    });
    const late = window.setTimeout(scan, 900);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(late);
      observer.disconnect();
      pending.forEach((el) => {
        el.classList.remove("kc-rv", "kc-in");
        el.style.removeProperty("--kc-rv-delay");
      });
      pending.clear();
    };
  }, [pathname]);

  // Scroll progress bar.
  useEffect(() => {
    if (!progress || prefersReducedMotion()) return;
    const bar = barRef.current;
    if (!bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [progress, pathname]);

  return progress ? <div ref={barRef} className="kc-progress" aria-hidden="true" /> : null;
}

export default ScrollEffects;
