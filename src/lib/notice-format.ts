// Notice dates are entered and displayed in Bangladesh time (UTC+6, no DST).
const DHAKA_TZ = "Asia/Dhaka";
const DHAKA_OFFSET = "+06:00";

// Converts the value of a <input type="datetime-local"> (Dhaka time) to a Date.
export function parseDhakaDateTime(value: string): Date | null {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}:00${DHAKA_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Converts a stored Date to the value a <input type="datetime-local"> expects, in Dhaka time.
export function toDhakaInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: DHAKA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

// Displays a date and time in Bangladesh time for the page language.
export function formatNoticeDate(value: Date | string | null | undefined, locale: string): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", {
    timeZone: DHAKA_TZ,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
