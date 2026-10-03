import { describe, expect, it } from 'vitest';
import {
  dayKey,
  eventsInMonth,
  monthGrid,
  monthLabel,
  monthOf,
  shiftMonth,
  type CalendarEvent,
} from './calendar-model';

const ev = (
  id: string,
  kind: CalendarEvent['kind'],
  startDate: string,
): CalendarEvent => ({ id, kind, title: id, startDate, href: `/${id}` });

describe('kalender bubble', () => {
  it('menghitung tanggal di WIB, bukan UTC', () => {
    // 17.30 UTC tanggal 23 = 00.30 WIB tanggal 24.
    expect(dayKey('2026-10-23T17:30:00.000Z')).toBe('2026-10-24');
    expect(monthOf('2026-10-31T18:00:00.000Z')).toEqual({
      year: 2026,
      month: 10,
    });
  });

  it('menggeser bulan melewati pergantian tahun', () => {
    expect(shiftMonth({ year: 2026, month: 11 }, 1)).toEqual({
      year: 2027,
      month: 0,
    });
    expect(shiftMonth({ year: 2026, month: 0 }, -1)).toEqual({
      year: 2025,
      month: 11,
    });
    expect(monthLabel({ year: 2026, month: 9 })).toBe('Oktober 2026');
  });

  it('menyusun minggu Senin–Minggu lengkap dengan acara per hari', () => {
    const events = [
      ev('to', 'tryout', '2026-10-24T12:00:00.000Z'),
      ev('kelas', 'class', '2026-10-24T09:00:00.000Z'),
      ev('nov', 'tryout', '2026-11-02T12:00:00.000Z'),
    ];
    const weeks = monthGrid({ year: 2026, month: 9 }, events);
    // 1 Oktober 2026 = Kamis → 3 hari pengisi di awal.
    expect(weeks[0].slice(0, 3).every((d) => !d.inMonth)).toBe(true);
    expect(weeks[0][3]).toMatchObject({ day: 1, inMonth: true });
    expect(weeks.every((w) => w.length === 7)).toBe(true);
    const day24 = weeks.flat().find((d) => d.key === '2026-10-24');
    // Urut waktu: kelas 16.00 WIB sebelum tryout 19.00 WIB.
    expect(day24?.events.map((e) => e.id)).toEqual(['kelas', 'to']);
    expect(
      eventsInMonth({ year: 2026, month: 9 }, events).map((e) => e.id),
    ).toEqual(['kelas', 'to']);
  });
});
