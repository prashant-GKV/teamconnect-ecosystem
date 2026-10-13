// Date utility helpers — wrapping date-fns
import {
  format, formatDistanceToNow, isAfter, isBefore,
  differenceInDays, addDays, parseISO,
} from "date-fns";

/** Format an ISO date string with a given date-fns format token */
export function formatDate(iso: string | undefined | null, fmt = "MMM d, yyyy"): string {
  if (!iso) return "—";
  try { return format(parseISO(iso), fmt); }
  catch { return "—"; }
}

/** Relative time: "3 hours ago" */
export function formatRelativeTime(iso: string | undefined | null): string {
  if (!iso) return "—";
  try { return formatDistanceToNow(parseISO(iso), { addSuffix: true }); }
  catch { return "—"; }
}
export const formatTimeAgo = formatRelativeTime;

/** True if the date is in the past */
export function isExpired(iso: string | undefined | null): boolean {
  if (!iso) return false;
  try { return isBefore(parseISO(iso), new Date()); }
  catch { return false; }
}

/** True if the date is within `days` days from now (and not yet expired) */
export function isExpiringSoon(iso: string | undefined | null, days = 7): boolean {
  if (!iso) return false;
  try {
    const d = parseISO(iso);
    const now = new Date();
    return isAfter(d, now) && isBefore(d, addDays(now, days));
  } catch { return false; }
}

/** Number of calendar days until the date (negative if past) */
export function daysUntil(iso: string | undefined | null): number {
  if (!iso) return 0;
  try { return differenceInDays(parseISO(iso), new Date()); }
  catch { return 0; }
}

/** True if dueAt is defined and in the past */
export function isOverdue(dueAt: string | undefined | null): boolean {
  if (!dueAt) return false;
  try { return isBefore(parseISO(dueAt), new Date()); }
  catch { return false; }
}

/** Percentage of time elapsed between startAt and endAt (0–100) */
export function membershipProgress(startAt: string, endAt: string): number {
  try {
    const start = parseISO(startAt).getTime();
    const end   = parseISO(endAt).getTime();
    const now   = Date.now();
    if (now <= start) return 0;
    if (now >= end)   return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  } catch { return 0; }
}
