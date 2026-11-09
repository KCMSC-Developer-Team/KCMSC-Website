import Link from "next/link";
import type { CSSProperties } from "react";
import type { Locale } from "@/i18n/config";

export type FacultyCard = {
  id: string;
  name: string;
  designation: string;
  wing: string;
  photoUrl: string | null;
  subjects: string[];
};

// Each loop is at least this many cards so the track is always wider than a screen.
const MIN_LOOP_CARDS = 8;

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function FacultyCardFace({ card }: { card: FacultyCard }) {
  return (
    <>
      <div className="relative aspect-[4/4.4] overflow-hidden bg-gradient-to-br from-[#e3f2e9] via-white to-[#f3eac8]">
        {card.photoUrl ? (
          <img
            src={card.photoUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover object-top transition duration-700 ease-out group-hover:scale-[1.05]"
          />
        ) : (
          <div className="grid h-full place-items-center font-heading text-5xl text-[#176b45]">
            {initials(card.name)}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.12em] text-[#8a7740] backdrop-blur">
          {card.wing}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <h3 className="line-clamp-2 font-heading text-xl leading-snug text-[#124c36]">{card.name}</h3>
        <p className="text-sm font-semibold text-[#1f8a5b]">{card.designation}</p>
        {card.subjects.length > 0 && (
          <p className="mt-auto line-clamp-1 pt-3 text-xs text-[#69716b]">
            {card.subjects.slice(0, 2).join(" · ")}
          </p>
        )}
      </div>
    </>
  );
}

const cardClass =
  "group flex w-[250px] shrink-0 flex-col overflow-hidden rounded-2xl border border-[#d3e3d8] bg-white shadow-[var(--kc-shadow-card)] transition-[transform,box-shadow,border-color] duration-500 ease-out hover:-translate-y-1 hover:border-[#1f8a5b] hover:shadow-[var(--kc-shadow-lift)] sm:w-[270px]";

/**
 * Endless horizontal slideshow of faculty cards. The track holds two identical
 * copies and animates by -50%, so the loop is seamless. Hover pauses it, and
 * the second copy is hidden from assistive tech and keyboard focus.
 */
export function FacultyShowcase({
  locale,
  faculty,
  ariaLabel,
}: {
  locale: Locale;
  faculty: FacultyCard[];
  ariaLabel: string;
}) {
  if (faculty.length === 0) return null;

  const loop: FacultyCard[] = [];
  while (loop.length < Math.max(MIN_LOOP_CARDS, faculty.length)) loop.push(...faculty);

  const duration = `${Math.max(28, loop.length * 3.5)}s`;
  const style = { "--kc-faculty-duration": duration } as CSSProperties;

  return (
    <div className="kc-faculty-marquee" role="region" aria-label={ariaLabel}>
      <div className="kc-faculty-track" style={style}>
        {loop.map((card, i) => (
          <Link key={`a-${card.id}-${i}`} href={`/${locale}/teachers/${card.id}`} className={cardClass}>
            <FacultyCardFace card={card} />
          </Link>
        ))}
        {loop.map((card, i) => (
          <div key={`b-${card.id}-${i}`} aria-hidden="true" className={cardClass}>
            <FacultyCardFace card={card} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacultyShowcase;
