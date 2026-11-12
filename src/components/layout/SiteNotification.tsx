"use client";

import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";

export type SiteNotificationData = {
  id: string;
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  imageUrls: string[];
  updatedAt: string;
};

// Module scope: this value is reset only when the page is fully loaded
// (a refresh or a fresh entry into the site). Moving between pages inside the
// site keeps the module loaded, so the popup does not reopen on every page.
let popupShownThisLoad = false;

export function SiteNotification({
  locale,
  notification,
}: {
  locale: "en" | "bn";
  notification: SiteNotificationData | null;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const images = notification?.imageUrls ?? [];
  const imageCount = images.length;

  useEffect(() => {
    if (!notification || popupShownThisLoad) return;
    popupShownThisLoad = true;
    setOpen(true);
  }, [notification]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") {
        setIndex((i) => Math.min(i + 1, Math.max(imageCount - 1, 0)));
      }
      if (event.key === "ArrowLeft") {
        setIndex((i) => Math.max(i - 1, 0));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, imageCount]);

  if (!notification || !open) return null;

  const title = locale === "bn" ? notification.titleBn : notification.titleEn;
  const body = locale === "bn" ? notification.bodyBn : notification.bodyEn;
  const currentIndex = Math.min(index, Math.max(imageCount - 1, 0));
  const currentImage = images[currentIndex];
  const hasMany = imageCount > 1;
  const isBn = locale === "bn";

  function close() {
    setOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-notice-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        aria-hidden="true"
        onClick={close}
        className="absolute inset-0 bg-[#0f2f22]/70 backdrop-blur-[2px]"
      />

      <div className="relative flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
        <button
          type="button"
          onClick={close}
          aria-label={isBn ? "নোটিশ বন্ধ করুন" : "Close notice"}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#17332a] shadow transition hover:bg-white"
        >
          <FiX className="h-4 w-4" aria-hidden="true" />
        </button>

        {currentImage ? (
          <div className="relative flex shrink-0 items-center justify-center bg-[#f4f5f1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={title}
              className="max-h-[52vh] w-full object-contain"
            />

            {hasMany ? (
              <>
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                  disabled={currentIndex === 0}
                  aria-label={isBn ? "আগের ছবি" : "Previous image"}
                  className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#17332a] shadow transition hover:bg-white disabled:opacity-30"
                >
                  <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setIndex((i) => Math.min(i + 1, imageCount - 1))}
                  disabled={currentIndex === imageCount - 1}
                  aria-label={isBn ? "পরের ছবি" : "Next image"}
                  className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#17332a] shadow transition hover:bg-white disabled:opacity-30"
                >
                  <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            ) : null}
          </div>
        ) : null}

        {hasMany ? (
          <div className="flex justify-center gap-1.5 bg-[#f4f5f1] pb-3">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={isBn ? `ছবি ${i + 1}` : `Image ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex ? "w-5 bg-[#176b45]" : "w-2 bg-[#176b45]/30"
                }`}
              />
            ))}
          </div>
        ) : null}

        <div className="overflow-y-auto p-6 sm:p-7">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#176b45]">
            {isBn ? "গুরুত্বপূর্ণ নোটিশ" : "Important notice"}
          </p>
          <h2
            id="site-notice-title"
            className="mt-2 font-heading text-xl leading-snug text-[#17332a] sm:text-2xl"
          >
            {title}
          </h2>
          {body ? (
            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#4b5b55]">{body}</p>
          ) : null}

          <button
            type="button"
            onClick={close}
            className="mt-6 rounded-full bg-[#176b45] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#125a39]"
          >
            {isBn ? "ঠিক আছে" : "Got it"}
          </button>
        </div>
      </div>
    </div>
  );
}
