"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion, useInView } from "./useInView";

const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const NUMBER = /[\d০-৯][\d০-৯,]*(?:\.[\d০-৯]+)?/;

function toLatin(text: string) {
  return text.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));
}

function toBengali(text: string) {
  return text.replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d);
}

function parse(source: string) {
  const match = source.match(NUMBER);
  if (!match || match.index === undefined) return null;
  const raw = match[0];
  const latin = toLatin(raw).replace(/,/g, "");
  const value = Number(latin);
  if (!Number.isFinite(value)) return null;
  return {
    prefix: source.slice(0, match.index),
    suffix: source.slice(match.index + raw.length),
    value,
    decimals: latin.includes(".") ? latin.split(".")[1]!.length : 0,
    grouped: raw.includes(","),
    bengali: /[০-৯]/.test(raw),
    width: raw.length,
  };
}

/**
 * Counts up to the number inside `text` when scrolled into view, keeping any
 * prefix/suffix ("98.48%", "২,৩৩৬", "+12"). The server-rendered markup always
 * contains the final value, so search engines, print and no-JS visitors see it.
 */
export function CountUp({
  text,
  duration = 1500,
  className,
}: {
  text: string | number;
  duration?: number;
  className?: string;
}) {
  const source = String(text);
  const parsed = useMemo(() => parse(source), [source]);
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { threshold: 0.4 });
  const [display, setDisplay] = useState(source);

  const format = (n: number) => {
    if (!parsed) return source;
    let out = n.toFixed(parsed.decimals);
    if (parsed.grouped) {
      const [int = "", dec] = out.split(".");
      out = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (dec ? `.${dec}` : "");
    }
    if (parsed.bengali) out = toBengali(out);
    return `${parsed.prefix}${out}${parsed.suffix}`;
  };

  // Park at zero (client only) so the count has somewhere to start from.
  useEffect(() => {
    if (!parsed || prefersReducedMotion()) return;
    setDisplay(format(0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  useEffect(() => {
    if (!parsed || !seen || prefersReducedMotion()) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(format(parsed.value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, source, duration]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={source}
      style={{ fontVariantNumeric: "tabular-nums", display: "inline-block", minWidth: parsed ? `${parsed.width}ch` : undefined }}
    >
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

export default CountUp;
