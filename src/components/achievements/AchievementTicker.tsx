"use client";

/**
 * A vertically moving list of achievements. The list is rendered twice so the
 * loop is seamless: the track scrolls up by exactly one copy, then restarts.
 * It pauses on hover or keyboard focus, and stops for visitors who ask for
 * reduced motion (the list then scrolls by hand).
 */

export type TickerItem = {
  year: string;
  category: string;
  title: string;
  details: string;
};

export function AchievementTicker({
  items,
  ariaLabel,
}: {
  items: TickerItem[];
  ariaLabel: string;
}) {
  // Roughly six seconds per entry keeps the reading speed comfortable.
  const duration = Math.max(12, items.length * 6);

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      className="kc-ticker-panel kc-sub-panel relative h-[520px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#176b45] sm:h-[540px]"
    >
      <div className="kc-ticker-fade pointer-events-none absolute inset-x-0 top-0 z-10 h-14" />
      <div className="kc-ticker-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14" />

      <div className="kc-ticker-track" style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1} className="divide-y divide-[#e4e2da]">
            {items.map((entry, index) => (
              <li
                key={`${copy}-${entry.year}-${entry.title}-${index}`}
                className="grid gap-4 p-6 transition-colors duration-500 hover:bg-[#eef6f1] sm:grid-cols-[70px_1fr_auto] sm:items-start sm:p-7"
              >
                <span className="font-heading text-2xl text-[#124c36]">{entry.year}</span>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-[#1f8a5b]">
                    {entry.category}
                  </p>
                  <p className="mt-2 font-heading text-xl leading-tight text-[#124c36]">{entry.title}</p>
                  <p className="mt-2 max-w-2xl text-xs leading-5 text-[#69716b]">{entry.details}</p>
                </div>

                <span className="hidden text-[11px] font-bold uppercase tracking-[.15em] text-[#b5b9b3] sm:block">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
