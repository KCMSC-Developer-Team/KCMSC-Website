"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { CountUp } from "./CountUp";
import { prefersReducedMotion, useInView } from "./useInView";

/** Ring (donut) gauge that draws itself when scrolled into view. */
export function Ring({
  value,
  max = 100,
  size = 112,
  stroke = 10,
  children,
  label,
  className = "",
}: {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
  label?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { threshold: 0.35 });
  const gradientId = useId().replace(/:/g, "");
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const [instant, setInstant] = useState(false);
  useEffect(() => setInstant(prefersReducedMotion()), []);
  const offset = circumference * (1 - (seen || instant ? ratio : 0));

  return (
    <div
      ref={ref}
      className={`relative inline-grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#27a872" />
            <stop offset="100%" stopColor="#176b45" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={stroke} className="kc-ring-track" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

/** Horizontal progress bar that fills when scrolled into view. */
export function Bar({
  value,
  max = 100,
  delay = 0,
  className = "h-2",
}: {
  value: number;
  max?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { threshold: 0.3 });
  const ratio = Math.max(0, Math.min(1, max > 0 ? value / max : 0));
  const [instant, setInstant] = useState(false);
  useEffect(() => setInstant(prefersReducedMotion()), []);
  return (
    <div ref={ref} className={`kc-bar-track overflow-hidden rounded-full ${className}`}>
      <div
        className="kc-bar-fill h-full w-full rounded-full"
        style={{ transform: `scaleX(${seen || instant ? ratio : 0})`, ["--kc-d" as string]: `${delay}ms` }}
      />
    </div>
  );
}

/** Ranked list of labelled counts shown as animated bars. */
export function BarList({
  items,
}: {
  items: { label: string; value: number; href?: string }[];
}) {
  const max = Math.max(1, ...items.map((item) => item.value));
  return (
    <ul className="space-y-4">
      {items.map((item, index) => {
        const body = (
          <>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm text-[#303831]">{item.label}</span>
              <CountUp text={item.value} className="font-heading text-lg text-[#124c36]" />
            </div>
            <Bar value={item.value} max={max} delay={index * 70} />
          </>
        );
        return (
          <li key={item.label}>
            {item.href ? (
              <Link href={item.href} className="block rounded-lg px-1 py-0.5 transition hover:bg-[#e3f2e9]/70">
                {body}
              </Link>
            ) : (
              body
            )}
          </li>
        );
      })}
    </ul>
  );
}
