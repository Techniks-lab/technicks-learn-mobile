/**
 * Prisma/Postgres timestamps come back as strings like
 * `2026-09-11 21:11:42.922+00` (space-separated, `+NN` offset) which Hermes
 * cannot reliably parse via `new Date(str)`. Parse the components numerically
 * and build the Date from UTC so it behaves identically on every engine.
 */
export function parseServerDate(value: string): Date {
  if (typeof value !== 'string' || value.length < 19) return new Date(NaN);

  const v = value.trim();

  const year = Number(v.slice(0, 4));
  const month = Number(v.slice(5, 7)) - 1;
  const day = Number(v.slice(8, 10));
  const hours = Number(v.slice(11, 13));
  const minutes = Number(v.slice(14, 16));
  const seconds = Number(v.slice(17, 19));

  let millis = 0;
  let offsetMinutes = 0;

  const fracIndex = v.indexOf('.', 19);
  if (fracIndex !== -1) {
    let frac = '';
    let i = fracIndex + 1;
    while (i < v.length && v[i] >= '0' && v[i] <= '9') {
      if (frac.length < 3) frac += v[i];
      i += 1;
    }
    millis = Number(frac.padEnd(3, '0'));
    offsetMinutes = timezoneOffsetMinutes(v.slice(i));
  } else {
    offsetMinutes = timezoneOffsetMinutes(v.slice(19));
  }

  const utcMs =
    Date.UTC(year, month, day, hours, minutes, seconds, millis) -
    offsetMinutes * 60_000;

  return new Date(utcMs);
}

/** Parse a trailing timezone like `Z`, `+00`, `+05:30`, `-0400` into minutes. */
function timezoneOffsetMinutes(tz: string): number {
  const s = tz.trim();
  if (!s || s === 'Z') return 0;

  const sign = s[0] === '-' ? -1 : 1;
  let hh = '';
  let mm = '';
  let i = 1;
  while (i < s.length && s[i] >= '0' && s[i] <= '9') {
    if (hh.length < 2) hh += s[i];
    i += 1;
  }
  if (i < s.length && s[i] === ':') i += 1;
  while (i < s.length && s[i] >= '0' && s[i] <= '9') {
    if (mm.length < 2) mm += s[i];
    i += 1;
  }

  return sign * (Number(hh) * 60 + Number(mm));
}

/** Reddit-style relative time: `just now`, `5m ago`, `3h ago`, `2d ago`… */
export function formatRelativeTime(dateStr: string): string {
  const date = parseServerDate(dateStr);
  if (Number.isNaN(date.getTime())) return '';

  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;

  return formatDisplayDate(dateStr);
}

/** Short absolute date, e.g. `Sep 11` or `Sep 11, 2025`. */
export function formatDisplayDate(dateStr: string): string {
  const date = parseServerDate(dateStr);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}