import { NextRequest, NextResponse } from "next/server";
import ical from "node-ical";

export const runtime = "nodejs";
export const revalidate = 300;

const FEED_URL =
  "https://calendar.google.com/calendar/ical/kcmodelcollege%40gmail.com/public/basic.ics";
const TIME_ZONE = "Asia/Dhaka";

type ICalEvent = {
  type?: string;
  summary?: string;
  description?: string;
  location?: string;
  url?: string;
  start?: Date & { dateOnly?: boolean; tz?: string };
  end?: Date & { dateOnly?: boolean; tz?: string };
  rrule?: unknown;
};

function localDateKey(date: Date, allDay = false) {
  if (allDay && "dateOnly" in date && date.dateOnly) {
    // node-ical preserves date-only DTSTART values. Format in UTC to avoid
    // moving a date-only event into the previous day in positive UTC offsets.
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
  }
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function categoryFor(summary: string): "exam" | "event" | "holiday" | "deadline" {
  const title = summary.toLowerCase();
  if (/(exam|assessment|test|selection|mid.?term|final)/i.test(title)) return "exam";
  if (/(holiday|vacation|closed|closure|puja|eid|break)/i.test(title)) return "holiday";
  if (/(deadline|last date|due date|submission)/i.test(title)) return "deadline";
  return "event";
}

function toPublicEvent(event: ICalEvent, start: Date, end?: Date) {
  const title = (event.summary || "School event").trim();
  const allDay = Boolean((start as Date & { dateOnly?: boolean }).dateOnly);
  return {
    id: `${title}-${start.toISOString()}`,
    date: localDateKey(start, allDay),
    title,
    description: event.description || "",
    location: event.location || "",
    url: event.url || "",
    category: categoryFor(title),
    allDay,
    startAt: allDay ? null : start.toISOString(),
    endAt: end && !allDay ? end.toISOString() : null,
  };
}

export async function GET(request: NextRequest) {
  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 4, 1);
  const fromParam = request.nextUrl.searchParams.get("from");
  const toParam = request.nextUrl.searchParams.get("to");
  const from = fromParam && /^\d{4}-\d{2}-\d{2}$/.test(fromParam)
    ? new Date(`${fromParam}T00:00:00+06:00`)
    : defaultFrom;
  const to = toParam && /^\d{4}-\d{2}-\d{2}$/.test(toParam)
    ? new Date(`${toParam}T23:59:59+06:00`)
    : defaultTo;

  if (!Number.isFinite(from.getTime()) || !Number.isFinite(to.getTime()) || from > to) {
    return NextResponse.json({ events: [], error: "Invalid date range." }, { status: 400 });
  }

  try {
    const response = await fetch(FEED_URL, {
      headers: { "User-Agent": "KCMSC-Website/1.0 academic-calendar" },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      return NextResponse.json(
        { events: [], error: "Google Calendar feed is unavailable. Check that the calendar is public." },
        { status: 502, headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
      );
    }
    const ics = await response.text();
    if (!ics.includes("BEGIN:VCALENDAR")) {
      return NextResponse.json({ events: [], error: "Google did not return a valid public calendar feed." }, { status: 502 });
    }

    const parsed = await ical.async.parseICS(ics) as Record<string, ICalEvent>;
    const output: ReturnType<typeof toPublicEvent>[] = [];
    for (const event of Object.values(parsed)) {
      if (event.type !== "VEVENT" || !event.start || !event.summary) continue;

      if (event.rrule) {
        const expanded = ical.expandRecurringEvent(event as never, { from, to });
        for (const instance of expanded) {
          if (!instance.start) continue;
          const start = instance.start as Date;
          if (start >= from && start <= to) {
            output.push(toPublicEvent(event, start, instance.end as Date | undefined));
          }
        }
      } else {
        const start = event.start;
        const end = event.end;
        if (start <= to && (!end || end >= from)) {
          output.push(toPublicEvent(event, start, end));
        }
      }
    }

    const unique = new Map<string, (typeof output)[number]>();
    for (const event of output) unique.set(`${event.id}-${event.date}`, event);
    const events = [...unique.values()].sort((a, b) =>
      a.date.localeCompare(b.date) || (a.startAt || "").localeCompare(b.startAt || "") || a.title.localeCompare(b.title)
    );
    return NextResponse.json(
      { events, source: "Google Calendar", timeZone: TIME_ZONE, fetchedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch (error) {
    console.error("Academic calendar feed error:", error);
    return NextResponse.json(
      { events: [], error: "The school calendar could not be loaded right now. Please try again shortly." },
      { status: 502, headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
    );
  }
}
