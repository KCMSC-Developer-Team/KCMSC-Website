"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function MissionVisionParallax({ children }: { children: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const art = artRef.current;
    if (!section || !art) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;

      // The artwork moves more slowly than the page content:
      // scrolling down makes its Y position decrease; scrolling up reverses it.
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const offset = sectionCenter - viewportCenter;
      const y = Math.max(-190, Math.min(190, offset * 0.32));
      const xTilt = Math.max(-2.2, Math.min(2.2, offset * -0.0035));
      const scale = 1.055;

      art.style.transform =
        `perspective(1100px) translate3d(0, ${y.toFixed(1)}px, 28px) rotateX(${xTilt.toFixed(2)}deg) scale(${scale})`;
    };

    const scheduleUpdate = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="kc-mission-vision relative isolate overflow-hidden"
    >
      <div ref={artRef} className="kc-mission-vision-art" aria-hidden="true" />
      <div className="kc-mission-vision-wash" aria-hidden="true" />
      {children}
    </section>
  );
}
