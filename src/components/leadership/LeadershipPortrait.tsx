"use client";

import Image from "next/image";
import { useState } from "react";

type LeadershipPortraitProps = {
  src: string;
  alt: string;
  label: string;
};

export function LeadershipPortrait({ src, alt, label }: LeadershipPortraitProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e5da]">
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 34vw, 100vw"
          className="object-cover object-top transition duration-700 group-hover:scale-[1.02]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-4 flex flex-col items-center justify-center border border-dashed border-[#b8b09e] bg-[#f4f0e7] text-center">
          <span className="text-[12px] font-medium uppercase tracking-[.2em] text-[#176b45]">{label}</span>
          <span className="mt-3 max-w-[170px] text-xs leading-5 text-[#7a8079]">
            Add portrait here
          </span>
        </div>
      )}

      <div className="absolute left-5 top-5 grid h-10 w-10 place-items-center bg-[#176b45] text-[12px] font-medium tracking-[.14em] text-white">
        KC
      </div>
    </div>
  );
}
