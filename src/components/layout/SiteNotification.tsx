"use client";

import { useEffect, useState } from "react";
import { FiBell, FiX } from "react-icons/fi";

export type SiteNotificationData = {
  id: string;
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  updatedAt: string;
};

export function SiteNotification({
  locale,
  notification,
}: {
  locale: "en" | "bn";
  notification: SiteNotificationData | null;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notification) {
      setVisible(false);
      return;
    }

    const notificationKey = `${notification.id}:${notification.updatedAt}`;
    const dismissedId = window.localStorage.getItem(
      "kcmsc-dismissed-notification",
    );

    setVisible(dismissedId !== notificationKey);
  }, [notification]);

  if (!notification || !visible) {
    return null;
  }

  // Keep a non-null reference so TypeScript can safely use it
  // inside the dismiss callback.
  const currentNotification = notification;

  const title =
    locale === "bn" ? currentNotification.titleBn : currentNotification.titleEn;

  const body =
    locale === "bn" ? currentNotification.bodyBn : currentNotification.bodyEn;

  function dismiss() {
    const notificationKey = `${currentNotification.id}:${currentNotification.updatedAt}`;

    window.localStorage.setItem(
      "kcmsc-dismissed-notification",
      notificationKey,
    );

    setVisible(false);
  }

  return (
    <div className="relative z-[60] border-b border-[#d9d8cf] bg-[#176b45] text-white shadow-[0_8px_24px_rgba(18,76,54,0.12)]">
      <div className="mx-auto flex max-w-[1280px] items-start gap-3 px-4 py-3 sm:items-center sm:px-7 lg:px-10">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 sm:mt-0">
          <FiBell className="h-4 w-4" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-white/65">
            {locale === "bn" ? "গুরুত্বপূর্ণ নোটিশ" : "Important notice"}
          </p>

          <p className="mt-0.5 text-sm font-medium leading-5 text-white">
            {title}
          </p>

          {body ? (
            <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-white/80">
              {body}
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label={
            locale === "bn" ? "নোটিশ বন্ধ করুন" : "Dismiss notification"
          }
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-white/75 transition hover:border-white/50 hover:bg-white/10 hover:text-white"
        >
          <FiX className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
