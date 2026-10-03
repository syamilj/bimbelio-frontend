// Model kalender bubble (/calendar). Murni & diuji: tanggal dihitung di WIB
// agar acara pukul 00.30 WIB tidak jatuh ke hari sebelumnya (UTC).

export type CalendarEventKind = 'tryout' | 'class';

export type CalendarEvent = {
  id: string;
  kind: CalendarEventKind;
  title: string;
  startDate: string;
  href: string;
};

export type MonthKey = { year: number; month: number }; // month 0..11

const TZ = 'Asia/Jakarta';

/** "2026-10-24" di zona WIB. */
export const dayKey = (iso: string | Date) =>
  new Date(iso).toLocaleDateString('en-CA', { timeZone: TZ });

export const monthOf = (iso: string | Date): MonthKey => {
  const [y, m] = dayKey(iso).split('-').map(Number);
  return { year: y, month: m - 1 };
};

export const shiftMonth = ({ year, month }: MonthKey, by: number): MonthKey => {
  const d = new Date(Date.UTC(year, month + by, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
};

export const monthLabel = ({ year, month }: MonthKey) =>
  new Date(Date.UTC(year, month, 1)).toLocaleDateString('id-ID', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

export type CalendarDay = {
  key: string;
  day: number;
  /** Termasuk bulan yang ditampilkan (bukan pengisi minggu). */
  inMonth: boolean;
  events: CalendarEvent[];
};

/**
 * Minggu-minggu (Senin–Minggu) untuk satu bulan, lengkap dengan acaranya.
 * Hari di luar bulan diisi agar setiap baris tepat 7 hari.
 */
export function monthGrid(
  { year, month }: MonthKey,
  events: CalendarEvent[],
): CalendarDay[][] {
  const byDay = new Map<string, CalendarEvent[]>();
  for (const e of [...events].sort(
    (a, b) => +new Date(a.startDate) - +new Date(b.startDate),
  )) {
    const k = dayKey(e.startDate);
    byDay.set(k, [...(byDay.get(k) ?? []), e]);
  }

  const first = new Date(Date.UTC(year, month, 1));
  const lead = (first.getUTCDay() + 6) % 7; // Senin = 0
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const total = Math.ceil((lead + daysInMonth) / 7) * 7;

  const weeks: CalendarDay[][] = [];
  for (let i = 0; i < total; i++) {
    const d = new Date(Date.UTC(year, month, 1 - lead + i));
    const key = d.toISOString().slice(0, 10);
    const day: CalendarDay = {
      key,
      day: d.getUTCDate(),
      inMonth: d.getUTCMonth() === month,
      events: byDay.get(key) ?? [],
    };
    if (i % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push(day);
  }
  return weeks;
}

/** Acara di bulan tertentu, urut waktu. */
export const eventsInMonth = (m: MonthKey, events: CalendarEvent[]) =>
  events
    .filter((e) => {
      const em = monthOf(e.startDate);
      return em.year === m.year && em.month === m.month;
    })
    .sort((a, b) => +new Date(a.startDate) - +new Date(b.startDate));
