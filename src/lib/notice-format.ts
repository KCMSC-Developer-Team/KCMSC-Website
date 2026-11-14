// Notice publishing dates are selected and displayed as calendar dates in Bangladesh.
// Store at noon Dhaka time to avoid date shifts caused by UTC/local-time conversion.
const DHAKA_TZ = "Asia/Dhaka";
const DHAKA_OFFSET = "+06:00";

// Converts a <input type="date"> value (Bangladesh calendar date) to a Date.
export function parseDhakaDate(value: string): Date | null {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T12:00:00${DHAKA_OFFSET}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Converts a stored Date to the YYYY-MM-DD value expected by <input type="date">.
export function toDhakaDateInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: DHAKA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

// Displays only the publishing date, never a time, in the page language.
export function formatNoticeDate(value: Date | string | null | undefined, locale: string): string {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", {
    timeZone: DHAKA_TZ,
    dateStyle: "medium",
  }).format(date);
}
