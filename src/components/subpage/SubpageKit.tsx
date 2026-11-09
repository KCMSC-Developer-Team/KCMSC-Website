import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal } from "@/components/home/Reveal";

/**
 * Shared building blocks for inner pages. They reuse the landing page's
 * tokens (rounded corners, greens and golds, heading type, reveal motion) so
 * every subpage reads as part of the same site.
 */

export function SubpageHero({
  kicker,
  title,
  body,
  image,
  imageAlt,
  actions,
  priority = false,
  compact = false,
}: {
  kicker: string;
  title: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
  priority?: boolean;
  compact?: boolean;
}) {
  return (
    <section
      className={`kc-sub-hero relative isolate flex w-full items-end overflow-hidden ${
        compact ? "min-h-[300px] lg:min-h-[340px]" : "min-h-[460px] lg:min-h-[600px]"
      }`}
    >
      {image && (
        <>
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            priority={priority}
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div className="kc-sub-hero-shade" aria-hidden="true" />
        </>
      )}

      <div className="relative mx-auto w-full max-w-[1180px] px-5 pb-12 pt-32 sm:px-8 lg:px-10 lg:pb-20">
        <p className="kc-sub-hero-kicker">{kicker}</p>
        <h1 className="mt-5 max-w-4xl font-heading text-[clamp(2.4rem,5vw,4.6rem)] font-normal leading-[.98] tracking-[-.04em]">
          {title}
        </h1>
        {body && <p className="mt-6 max-w-2xl text-[16px] leading-8 text-white/85">{body}</p>}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}

export function SubpageIntro({
  kicker,
  title,
  body,
  aside,
}: {
  kicker: string;
  title: string;
  body?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <Reveal className="max-w-2xl">
        <p className="kc-classic-kicker">{kicker}</p>
        <h2 className="kc-classic-title mt-3">{title}</h2>
        {body && <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#69716b]">{body}</p>}
      </Reveal>
      {aside && <Reveal delay={120}>{aside}</Reveal>}
    </div>
  );
}

export function SubpageCTA({
  kicker,
  title,
  actions,
}: {
  kicker: string;
  title: string;
  actions: ReactNode;
}) {
  return (
    <section className="bg-[#f7f5ef] px-4 pb-20 sm:px-8 sm:pb-28">
      <Reveal>
        <div className="kc-dash-hero relative mx-auto grid max-w-[1180px] gap-8 rounded-[32px] px-6 py-12 shadow-lift sm:px-12 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="relative">
            <p className="kc-light-kicker">{kicker}</p>
            <h2 className="mt-3 max-w-2xl font-heading text-[clamp(2.1rem,4vw,3.5rem)] font-normal leading-[1.02] tracking-[-.03em]">
              {title}
            </h2>
          </div>
          <div className="relative flex flex-wrap gap-3 lg:justify-end">{actions}</div>
        </div>
      </Reveal>
    </section>
  );
}

