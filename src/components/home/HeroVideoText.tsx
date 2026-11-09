"use client";

import { useEffect, useRef } from "react";

/**
 * Hero text for the video hero. It starts hidden at the top of the page and
 * rises in line by line as the visitor scrolls down, linked to scroll position.
 * With reduced motion enabled, the text is shown immediately.
 */
export function HeroVideoText({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  const lineRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const lines = lineRefs.current.filter((el): el is HTMLElement => el !== null);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      lines.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      // Full reveal once the page has scrolled 60% of the viewport height.
      const range = window.innerHeight * 0.6;
      const progress = Math.min(1, Math.max(0, window.scrollY / range));

      lines.forEach((el, i) => {
        // Each line starts a little after the previous one.
        const local = Math.min(1, Math.max(0, (progress - i * 0.15) / 0.6));
        el.style.opacity = local.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - local) * 36).toFixed(1)}px, 0)`;
      });
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
  }, []);

  return (
    <>
      <p ref={(el) => { lineRefs.current[0] = el; }} className="kc-sub-hero-kicker kc-hero-line">
        {kicker}
      </p>
      <h1
        ref={(el) => { lineRefs.current[1] = el; }}
        className="kc-hero-line mt-5 max-w-3xl font-heading text-[clamp(2.6rem,6vw,5.5rem)] font-normal leading-[.95] tracking-[-.04em]"
      >
        {title}
      </h1>
      <p
        ref={(el) => { lineRefs.current[2] = el; }}
        className="kc-hero-line mt-6 max-w-xl text-base leading-8 text-white/85"
      >
        {body}
      </p>
    </>
  );
}

export default HeroVideoText;
