"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";

type Category = "exam" | "event" | "holiday" | "deadline";
type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  description: string;
  location: string;
  url: string;
  category: Category;
  allDay: boolean;
  startAt: string | null;
  endAt: string | null;
};
type FeedResponse = {
  events: CalendarEvent[];
  error?: string;
  fetchedAt?: string;
};

const categories = {
  en: {
    exam: "Examination",
    event: "School event",
    holiday: "Holiday / closure",
    deadline: "Deadline",
  },
  bn: {
    exam: "পরীক্ষা",
    event: "বিদ্যালয়ের অনুষ্ঠান",
    holiday: "ছুটি / বন্ধ",
    deadline: "শেষ সময়সীমা",
  },
};
const months = {
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  bn: [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ],
};
const weekdays = {
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  bn: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"],
};
const labels = {
  en: {
    title: "Academic calendar",
    subtitle:
      "Live events from the KCMSC Google Calendar. Select a date to see event details.",
    previous: "Previous month",
    next: "Next month",
    upcoming: "Upcoming events",
    empty: "No events are scheduled for this date.",
    noUpcoming: "No upcoming events were found.",
    selected: "Selected date",
    today: "Today",
    loading: "Loading school events…",
    loadError: "We couldn't load the school calendar.",
    retry: "Try again",
    allDay: "All day",
    source: "Live from Google Calendar",
    openEvent: "Event details",
    noDescription: "No additional details were provided.",
    viewGoogle: "Open in Google Calendar",
  },
  bn: {
    title: "একাডেমিক ক্যালেন্ডার",
    subtitle:
      "KCMSC-এর Google Calendar থেকে হালনাগাদ ইভেন্ট। বিস্তারিত দেখতে তারিখ নির্বাচন করুন।",
    previous: "আগের মাস",
    next: "পরের মাস",
    upcoming: "আসন্ন ইভেন্ট",
    empty: "এই তারিখে কোনো ইভেন্ট নির্ধারিত নেই।",
    noUpcoming: "কোনো আসন্ন ইভেন্ট পাওয়া যায়নি।",
    selected: "নির্বাচিত তারিখ",
    today: "আজ",
    loading: "বিদ্যালয়ের ইভেন্ট লোড হচ্ছে…",
    loadError: "বিদ্যালয়ের ক্যালেন্ডার লোড করা যায়নি।",
    retry: "আবার চেষ্টা করুন",
    allDay: "সারাদিন",
    source: "Google Calendar থেকে সরাসরি",
    openEvent: "ইভেন্টের বিবরণ",
    noDescription: "অতিরিক্ত কোনো বিবরণ দেওয়া হয়নি।",
    viewGoogle: "Google Calendar-এ দেখুন",
  },
};
const dots: Record<Category, string> = {
  exam: "bg-rose-600",
  event: "bg-emerald-700",
  holiday: "bg-amber-500",
  deadline: "bg-blue-600",
};
const GOOGLE_CALENDAR_URL =
  "https://calendar.google.com/calendar/embed?src=kcmodelcollege%40gmail.com&ctz=Asia%2FDhaka";

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function monthRange(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  return { from: dateKey(first), to: dateKey(last) };
}
function formatDate(date: string, locale: Locale) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    locale === "bn" ? "bn-BD" : "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );
}
function formatTime(value: string | null, locale: Locale) {
  if (!value) return null;
  return new Date(value).toLocaleTimeString(
    locale === "bn" ? "bn-BD" : "en-GB",
    {
      timeZone: "Asia/Dhaka",
      hour: "numeric",
      minute: "2-digit",
    },
  );
}

export default function AcademicCalendar({ locale }: { locale: Locale }) {
  const bn = locale === "bn";
  const copy = bn ? labels.bn : labels.en;
  const [view, setView] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selected, setSelected] = useState(() => dateKey(new Date()));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const range = useMemo(
    () => ({
      from: dateKey(new Date(view.year, view.month - 1, 1)),
      to: dateKey(new Date(view.year, view.month + 2, 0)),
    }),
    [view.year, view.month],
  );

  const loadEvents = useCallback(
    async (signal: AbortSignal) => {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams(range);
        const response = await fetch(`/api/calendar?${params.toString()}`, {
          signal,
          cache: "no-store",
        });
        const data = (await response.json()) as FeedResponse;
        if (!response.ok) throw new Error(data.error || copy.loadError);
        setEvents(Array.isArray(data.events) ? data.events : []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : copy.loadError);
        setEvents([]);
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [range, copy.loadError, refreshKey],
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const run = async () => {
      try {
        await loadEvents(controller.signal);
      } catch (error) {
        if (!cancelled) {
          console.error("Academic calendar request failed:", error);
        }
      }
    };

    void run();

    return () => {
      cancelled = true;

      // Cancel the request without allowing cleanup errors to escape.
      try {
        controller.abort();
      } catch {
        // Cleanup should never crash the page.
      }
    };
  }, [loadEvents]);

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const days = new Date(view.year, view.month + 1, 0).getDate();
  const cells = useMemo(
    () => [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: days }, (_, i) => i + 1),
    ],
    [firstDay, days],
  );
  const byDate = useMemo(
    () =>
      events.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
        (acc[event.date] ||= []).push(event);
        return acc;
      }, {}),
    [events],
  );
  const selectedEvents = byDate[selected] || [];
  const today = dateKey(new Date());
  const upcoming = useMemo(
    () =>
      events
        .filter((event) => event.date >= today)
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) ||
            (a.startAt || "").localeCompare(b.startAt || ""),
        )
        .slice(0, 8),
    [events, today],
  );

  function shift(amount: number) {
    const next = new Date(view.year, view.month + amount, 1);
    setView({ year: next.getFullYear(), month: next.getMonth() });
  }
  function dayKey(day: number) {
    return dateKey(new Date(view.year, view.month, day));
  }

  return (
    <div className="mb-14 overflow-hidden rounded-2xl border border-[#D9E2EC] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D9E2EC] px-5 py-6 sm:px-8">
        <div>
          <p className="kc-classic-kicker">{copy.title}</p>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            {copy.subtitle}
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#D9E2EC] bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#176b45]">
          <span className="h-2 w-2 rounded-full bg-[#176b45]" />
          {copy.source}
        </span>
      </div>
      {error && (
        <div
          role="alert"
          className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:mx-7"
        >
          <span>
            {copy.loadError} {error}
          </span>
          <button
            type="button"
            onClick={() => setRefreshKey((v) => v + 1)}
            className="font-semibold underline underline-offset-4"
          >
            {copy.retry}
          </button>
        </div>
      )}
      <div className="grid lg:grid-cols-[1.45fr_.75fr]">
        <div className="p-4 sm:p-7">
          <div className="mb-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => shift(-1)}
              aria-label={copy.previous}
              className="rounded-lg border border-[#D9E2EC] px-3 py-2 text-sm text-[#12324A] transition hover:border-[#176b45] hover:bg-[#F8FAFC]"
            >
              ← <span className="hidden sm:inline">{copy.previous}</span>
            </button>
            <div className="text-center">
              <h2 className="font-heading text-xl text-[#12324A] sm:text-2xl">
                {(bn ? months.bn : months.en)[view.month]} {view.year}
              </h2>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  setView({ year: now.getFullYear(), month: now.getMonth() });
                  setSelected(dateKey(now));
                }}
                className="mt-1 text-xs font-semibold text-[#176b45] hover:underline"
              >
                {copy.today}
              </button>
            </div>
            <button
              type="button"
              onClick={() => shift(1)}
              aria-label={copy.next}
              className="rounded-lg border border-[#D9E2EC] px-3 py-2 text-sm text-[#12324A] transition hover:border-[#176b45] hover:bg-[#F8FAFC]"
            >
              <span className="hidden sm:inline">{copy.next}</span> →
            </button>
          </div>
          <div className="grid grid-cols-7 border-b border-[#D9E2EC] pb-2">
            {(bn ? weekdays.bn : weekdays.en).map((day) => (
              <div
                key={day}
                className="py-2 text-center text-xs font-semibold text-[#64748B]"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, index) =>
              day === null ? (
                <div
                  key={`blank-${index}`}
                  aria-hidden="true"
                  className="min-h-[66px] border-b border-r border-[#EDF1F5] sm:min-h-[88px]"
                />
              ) : (
                <button
                  type="button"
                  key={dayKey(day)}
                  onClick={() => setSelected(dayKey(day))}
                  aria-pressed={selected === dayKey(day)}
                  aria-label={`${dayKey(day)}${(byDate[dayKey(day)]?.length ?? 0) > 0 ? `, ${byDate[dayKey(day)]?.length ?? 0} events` : ""}`}
                  className={`min-h-[66px] border-b border-r border-[#EDF1F5] p-1 text-left transition sm:min-h-[88px] sm:p-2 ${selected === dayKey(day) ? "bg-[#EAF4EE] ring-2 ring-inset ring-[#176b45]" : "hover:bg-[#F8FAFC]"} ${dayKey(day) === today ? "font-semibold" : ""}`}
                >
                  <span
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${selected === dayKey(day) ? "bg-[#176b45] font-semibold text-white" : dayKey(day) === today ? "border border-[#176b45] text-[#176b45]" : "text-[#12324A]"}`}
                  >
                    {day}
                  </span>
                  <span className="mt-1 flex flex-wrap gap-1">
                    {(byDate[dayKey(day)] || []).slice(0, 4).map((event) => (
                      <span
                        key={event.id}
                        className={`h-1.5 w-1.5 rounded-full ${dots[event.category]}`}
                        title={event.title}
                      />
                    ))}
                  </span>
                  <span className="sr-only">
                    {(byDate[dayKey(day)] || [])
                      .map((event) => event.title)
                      .join(", ")}
                  </span>
                </button>
              ),
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
            {(Object.keys(categories.en) as Category[]).map((category) => (
              <span
                key={category}
                className="inline-flex items-center gap-2 text-xs text-[#64748B]"
              >
                <span className={`h-2 w-2 rounded-full ${dots[category]}`} />
                {(bn ? categories.bn : categories.en)[category]}
              </span>
            ))}
          </div>
          {loading && (
            <p role="status" className="mt-4 text-sm text-[#64748B]">
              {copy.loading}
            </p>
          )}
        </div>
        <aside className="border-t border-[#D9E2EC] bg-[#F8FAFC] p-5 sm:p-7 lg:border-l lg:border-t-0">
          <p className="kc-classic-kicker">{copy.selected}</p>
          <h3 className="mt-2 font-heading text-xl text-[#12324A]">
            {formatDate(selected, locale)}
          </h3>
          {loading && !events.length ? (
            <p className="mt-4 rounded-xl border border-[#D9E2EC] bg-white p-4 text-sm text-[#64748B]">
              {copy.loading}
            </p>
          ) : selectedEvents.length ? (
            <ul className="mt-4 space-y-3">
              {selectedEvents.map((event) => (
                <li
                  key={event.id}
                  className="rounded-xl border border-[#D9E2EC] bg-white p-4"
                >
                  <span className="text-xs font-semibold text-[#176b45]">
                    {(bn ? categories.bn : categories.en)[event.category]}
                  </span>
                  <p className="mt-1 text-sm font-semibold text-[#12324A]">
                    {event.title}
                  </p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#64748B]">
                    {event.description || copy.noDescription}
                  </p>
                  {event.location && (
                    <p className="mt-2 text-xs text-[#64748B]">
                      ⌖ {event.location}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[#64748B]">
                    {event.allDay
                      ? copy.allDay
                      : [
                          formatTime(event.startAt, locale),
                          formatTime(event.endAt, locale),
                        ]
                          .filter(Boolean)
                          .join(" – ")}
                  </p>
                  {event.url && (
                    <a
                      href={event.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex text-xs font-semibold text-[#176b45] hover:underline"
                    >
                      {copy.viewGoogle} ↗
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-[#CBD5E1] bg-white p-4 text-sm leading-6 text-[#64748B]">
              {copy.empty}
            </p>
          )}
          <div className="mt-8 border-t border-[#D9E2EC] pt-6">
            <h4 className="font-heading text-lg text-[#12324A]">
              {copy.upcoming}
            </h4>
            {upcoming.length ? (
              <ul className="mt-3 space-y-4">
                {upcoming.map((event) => (
                  <li key={event.id} className="flex gap-3 text-sm">
                    <span
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dots[event.category]}`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const parts = event.date.split("-");
                        const year = Number(parts[0]);
                        const month = Number(parts[1]);

                        if (
                          !Number.isInteger(year) ||
                          !Number.isInteger(month) ||
                          month < 1 ||
                          month > 12
                        ) {
                          return;
                        }

                        setView({ year, month: month - 1 });
                        setSelected(event.date);
                      }}
                      className="text-left"
                    >
                      <strong className="font-medium text-[#12324A] hover:text-[#176b45]">
                        {event.title}
                      </strong>
                      <span className="block text-xs text-[#64748B]">
                        {formatDate(event.date, locale)}
                        {!event.allDay && event.startAt
                          ? ` · ${formatTime(event.startAt, locale)}`
                          : ""}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm leading-6 text-[#64748B]">
                {loading ? copy.loading : copy.noUpcoming}
              </p>
            )}
          </div>
          <a
            href={GOOGLE_CALENDAR_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex text-xs font-semibold uppercase tracking-[.08em] text-[#176b45] hover:text-[#12324A]"
          >
            {copy.viewGoogle} ↗
          </a>
        </aside>
      </div>
    </div>
  );
}
