import { format, formatDistanceToNow, isAfter, isBefore, differenceInDays, parseISO } from "date-fns";

export const formatDate   = (d: string | Date) => format(typeof d === "string" ? parseISO(d) : d, "MMM d, yyyy");
export const formatDateTime = (d: string | Date) => format(typeof d === "string" ? parseISO(d) : d, "MMM d, yyyy h:mm a");
export const formatTimeAgo  = (d: string | Date) => formatDistanceToNow(typeof d === "string" ? parseISO(d) : d, { addSuffix: true });
export const formatMonoDate = (d: string | Date) => format(typeof d === "string" ? parseISO(d) : d, "yyyy-MM-dd");

export const isExpired     = (endAt: string) => isBefore(parseISO(endAt), new Date());
export const isExpiringSoon = (endAt: string, days = 7) =>
  !isExpired(endAt) && differenceInDays(parseISO(endAt), new Date()) <= days;

export const daysUntil = (d: string) => differenceInDays(parseISO(d), new Date());
export const isOverdue = (dueAt?: string) => dueAt ? isBefore(parseISO(dueAt), new Date()) : false;
