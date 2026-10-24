/**
 * Helper utilities for working with local calendar dates and times.
 * Invariants:
 * - Day keys are formatted as YYYY-MM-DD using the device's LOCAL timezone.
 * - ISO timestamps are stored for exact event times.
 * - Midnight boundary checks compare local year, month, and day.
 */

export const getLocalDateString = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return getLocalDateString(d);
};

export const formatDateReadable = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const date = new Date(year, month, day);
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatTimeReadable = (isoString: string | null): string => {
  if (!isoString) return '--:--';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '--:--';
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '--:--';
  }
};

export const isToday = (dateStr: string): boolean => {
  return dateStr === getLocalDateString();
};

export const isYesterday = (dateStr: string): boolean => {
  return dateStr === getYesterdayDateString();
};

export const isWithinPastDays = (dateStr: string, days: number): boolean => {
  const target = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(now.getDate() - days);
  cutoff.setHours(0, 0, 0, 0);
  return target >= cutoff;
};

export const getRelativeDateLabel = (dateStr: string): string => {
  if (isToday(dateStr)) return 'Today';
  if (isYesterday(dateStr)) return 'Yesterday';
  return formatDateReadable(dateStr);
};
