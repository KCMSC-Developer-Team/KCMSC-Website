"use client";

import { useEffect, useRef } from "react";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Pinned video hero. The video stays fixed on screen while the visitor scrolls
 * through a tall stage; the text tilts and rises into place in 3D, then the
 * page continues downward. Progress is linked to scroll position.
 */
export function HeroVideoStage({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  const stageRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const stage = stageRef.current;
    const video = videoRef.current;
    const lines = lineRefs.current.filter((el): el is HTMLElement => el !== null);
    if (!stage || !video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      frame = 0;
      // 0 when the stage reaches the top of the viewport, 1 when the pinned section is finished.
      const range = stage.offsetHeight - window.innerHeight;
      const progress = range > 0 ? clamp(-stage.getBoundingClientRect().top / range) : 0;

      if (reduceMotion) {
        lines.forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
        video.style.transform = "none";
        return;
      }

      // Video slowly settles from a slight zoom to its natural size.
      const zoom = 1.12 - 0.12 * clamp(progress / 0.6);
      video.style.transform = `scale(${zoom.toFixed(4)})`;

      // Each line tilts and rises in 3D, one after another.
      lines.forEach((el, i) => {
        const local = clamp((progress - i * 0.12) / 0.4);
        const rest = 1 - local;
        el.style.opacity = local.toFixed(3);
        el.style.transform = `translate3d(0, ${(rest * 80).toFixed(1)}px, ${(rest * -220).toFixed(1)}px) rotateX(${(rest * -60).toFixed(2)}deg)`;
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
    <section ref={stageRef} aria-label={kicker} className="kc-hero-stage relative h-[200svh] w-full">
      <div
        className="sticky top-0 flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-[#0e3b2a] text-white"
        style={{ perspective: "1100px" }}
      >
        <div ref={videoRef} className="absolute inset-0 will-change-transform">
          <video
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/kcmsc/hero/kcmsc-building.jpg"
            aria-hidden="true"
          >
            <source src="/videos/kcmsc-campus.mp4" type="video/mp4" />
          </video>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,28,20,.78)_0%,rgba(6,28,20,.35)_60%,rgba(6,28,20,.2)_100%),linear-gradient(0deg,rgba(5,22,16,.85)_0%,rgba(5,22,16,.05)_60%)]"
        />

        <div className="relative w-full">
          {/* Bottom padding keeps the text clear of the stats cards that overlap the hero. */}
          <div className="mx-auto w-full max-w-[1180px] px-5 pb-40 sm:px-8 lg:px-10">
            <p
              ref={(el) => { lineRefs.current[0] = el; }}
              className="kc-sub-hero-kicker kc-hero-line"
              style={{ transformOrigin: "50% 100%" }}
            >
              {kicker}
            </p>
            <h1
              ref={(el) => { lineRefs.current[1] = el; }}
              className="kc-hero-line mt-5 max-w-3xl font-heading text-[clamp(2.6rem,6vw,5.5rem)] font-normal leading-[.95] tracking-[-.04em]"
              style={{ transformOrigin: "50% 100%" }}
            >
              {title}
            </h1>
            <p
              ref={(el) => { lineRefs.current[2] = el; }}
              className="kc-hero-line mt-6 max-w-xl text-base leading-8 text-white/85"
              style={{ transformOrigin: "50% 100%" }}
            >
              {body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroVideoStage;
