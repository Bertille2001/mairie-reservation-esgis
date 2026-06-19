import type { DateRange } from "./types";

export const OPENING_HOUR = 7;
export const CLOSING_HOUR = 22;
export const DEFAULT_START_HOUR = 8;
export const DEFAULT_END_HOUR = 18;

export function applyTimeToDate(
  date: Date,
  hour: number,
  minute = 0,
): Date {
  const d = new Date(date);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function dateToTimeInputValue(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function dateToDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function applyDateInputValue(date: Date, dateValue: string): Date {
  const [yearPart, monthPart, dayPart] = dateValue.split("-");
  const year = Number.parseInt(yearPart ?? "0", 10);
  const month = Number.parseInt(monthPart ?? "1", 10);
  const day = Number.parseInt(dayPart ?? "1", 10);
  const next = new Date(date);
  next.setFullYear(year, month - 1, day);
  return next;
}

export function applyTimeInputValue(date: Date, timeValue: string): Date {
  const [hourPart, minutePart] = timeValue.split(":");
  const hour = Number.parseInt(hourPart ?? "0", 10);
  const minute = Number.parseInt(minutePart ?? "0", 10);
  return applyTimeToDate(date, hour, minute);
}

export function updateRangeStartTime(range: DateRange, timeValue: string): DateRange {
  const start = applyTimeInputValue(range.start, timeValue);
  let end = new Date(range.end);

  if (isSameDay(start, end) && end.getTime() <= start.getTime()) {
    end = applyTimeToDate(start, Math.min(start.getHours() + 1, CLOSING_HOUR), 0);
  }

  return { start, end };
}

export function updateRangeEndTime(range: DateRange, timeValue: string): DateRange {
  const end = applyTimeInputValue(range.end, timeValue);
  let start = new Date(range.start);

  if (isSameDay(start, end) && end.getTime() <= start.getTime()) {
    start = applyTimeToDate(end, Math.max(end.getHours() - 1, OPENING_HOUR), 0);
  }

  return { start, end };
}

export function isRangeTimeValid(range: DateRange): boolean {
  return range.end.getTime() > range.start.getTime();
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function rangeToApiParams(range: DateRange): {
  date_debut: string;
  date_fin: string;
} {
  return {
    date_debut: range.start.toISOString(),
    date_fin: range.end.toISOString(),
  };
}

export function todayRange(): DateRange {
  const today = startOfDay(new Date());
  return {
    start: applyTimeToDate(today, DEFAULT_START_HOUR),
    end: applyTimeToDate(today, DEFAULT_END_HOUR),
  };
}

export function thisWeekRange(): DateRange {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = startOfDay(new Date(now));
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = startOfDay(new Date(monday));
  sunday.setDate(monday.getDate() + 6);
  return {
    start: applyTimeToDate(monday, DEFAULT_START_HOUR),
    end: applyTimeToDate(sunday, DEFAULT_END_HOUR),
  };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isInRange(date: Date, range: DateRange): boolean {
  const d = startOfDay(date).getTime();
  const start = startOfDay(range.start).getTime();
  const end = startOfDay(range.end).getTime();
  return d >= start && d <= end;
}

export function isRangeStart(date: Date, range: DateRange): boolean {
  return isSameDay(date, range.start);
}

export function isRangeEnd(date: Date, range: DateRange): boolean {
  return isSameDay(date, range.end);
}

export function formatRangeLabel(range: DateRange): string {
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const startStr = range.start.toLocaleDateString("fr-FR", opts);
  if (isSameDay(range.start, range.end)) {
    return `${startStr}, ${formatTimeFr(range.start)} – ${formatTimeFr(range.end)}`;
  }
  const endStr = range.end.toLocaleDateString("fr-FR", opts);
  return `${startStr} – ${endStr} · ${formatTimeFr(range.start)} – ${formatTimeFr(range.end)}`;
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export function getCalendarDays(month: Date): Date[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const days: Date[] = [];

  for (let i = startOffset; i > 0; i--) {
    days.push(new Date(year, monthIndex, 1 - i));
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    days.push(new Date(year, monthIndex, d));
  }
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push(new Date(year, monthIndex + 1, i));
  }
  return days;
}

export function normalizeRange(start: Date, end: Date): DateRange {
  if (startOfDay(end).getTime() < startOfDay(start).getTime()) {
    return {
      start: applyTimeToDate(startOfDay(end), DEFAULT_START_HOUR),
      end: applyTimeToDate(startOfDay(start), DEFAULT_END_HOUR),
    };
  }
  return {
    start: applyTimeToDate(startOfDay(start), DEFAULT_START_HOUR),
    end: applyTimeToDate(startOfDay(end), DEFAULT_END_HOUR),
  };
}

export interface SerializedDateRange {
  start: string;
  end: string;
}

export function serializeDateRange(range: DateRange): SerializedDateRange {
  return {
    start: range.start.toISOString(),
    end: range.end.toISOString(),
  };
}

export function parseDateRange(serialized: SerializedDateRange): DateRange {
  return {
    start: new Date(serialized.start),
    end: new Date(serialized.end),
  };
}

/** Query params `debut` / `fin` depuis le planning (ISO 8601). */
export function parseQueryDateRange(
  debut?: string,
  fin?: string,
): DateRange | null {
  if (!debut || !fin) return null;
  const start = new Date(debut);
  const end = new Date(fin);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }
  return { start, end };
}

/** RSC sérialise les Date en string — normalise avant usage client. */
export function coerceDateRange(range: DateRange): DateRange {
  return {
    start: range.start instanceof Date ? range.start : new Date(range.start),
    end: range.end instanceof Date ? range.end : new Date(range.end),
  };
}

function formatTimeFr(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}

/** Libellé créneau horaire pour bandeau fiche salle. */
export function formatSlotLabel(range: DateRange): string {
  const dateOpts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (isSameDay(range.start, range.end)) {
    const date = range.start.toLocaleDateString("fr-FR", dateOpts);
    return `${date}, ${formatTimeFr(range.start)} – ${formatTimeFr(range.end)}`;
  }

  const startStr = range.start.toLocaleDateString("fr-FR", dateOpts);
  const endStr = range.end.toLocaleDateString("fr-FR", dateOpts);
  return `${startStr}, ${formatTimeFr(range.start)} – ${endStr}, ${formatTimeFr(range.end)}`;
}
