'use client';

import { InfoPill } from '@/components/brand/info-pill';
import { MonoLabel } from '@/components/brand/mono-label';
import { EmptyState } from '@/components/patterns/empty-state';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { appPath } from '@/lib/track';
import { cn } from '@/lib/utils';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  dayKey,
  eventsInMonth,
  monthGrid,
  monthLabel,
  monthOf,
  shiftMonth,
  type CalendarEvent,
  type MonthKey,
} from './calendar-model';
import { eventWhen, useLandingLiveClasses, useUpcomingTryouts } from './events';

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
const KIND_LABEL = { tryout: 'Tryout', class: 'Kelas live' } as const;

/**
 * Kalender bubble: hari dengan tryout = bubble terisi, hari dengan kelas live
 * = cincin (BRAND-2.1 §6.1). Data dari agenda publik yang sama dengan beranda.
 */
export function EventCalendar() {
  const tryouts = useUpcomingTryouts();
  const classes = useLandingLiveClasses();
  // Bulan & "hari ini" baru dihitung di browser: halaman ini statis (ISR),
  // jadi tanggal saat build tidak boleh ikut ter-render.
  const [month, setMonth] = useState<MonthKey | null>(null);
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => {
    const now = new Date();
    setMonth(monthOf(now));
    setToday(dayKey(now));
  }, []);

  const events = useMemo<CalendarEvent[]>(
    () => [
      ...(tryouts.data ?? []).map((t) => ({
        id: `to-${t.id}`,
        kind: 'tryout' as const,
        title: t.title,
        startDate: t.startDate,
        href: `${appPath(t.WebsiteSubCategory.id, 'bimarena/try-out')}?id=${t.id}`,
      })),
      ...(classes.data ?? []).map((c) => ({
        id: `lc-${c.id}`,
        kind: 'class' as const,
        title: c.title,
        startDate: c.startDate,
        href: `${appPath(c.websiteSubCategoryId, `bimlive/detail/${c.id}`)}?liveLearningId=${c.id}`,
      })),
    ],
    [tryouts.data, classes.data],
  );

  const loading = !month || tryouts.isPending || classes.isPending;
  const weeks = month ? monthGrid(month, events) : [];
  const agenda = month ? eventsInMonth(month, events) : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12">
      <section
        aria-labelledby="kalender-bulan"
        className="flex flex-col gap-5 rounded-md border border-line bg-surface p-5 sm:p-6"
      >
        <div className="flex items-center justify-between gap-3">
          <h2
            id="kalender-bulan"
            aria-live="polite"
            className="font-display text-2xl font-bold tracking-display text-ink capitalize"
          >
            {month ? monthLabel(month) : 'Kalender'}
          </h2>
          <div className="flex gap-1.5">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Bulan sebelumnya"
              disabled={!month}
              onClick={() => month && setMonth(shiftMonth(month, -1))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Bulan berikutnya"
              disabled={!month}
              onClick={() => month && setMonth(shiftMonth(month, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>

        {loading ? (
          <Skeleton className="aspect-[7/5] w-full rounded-sm" />
        ) : (
          <table className="w-full table-fixed border-collapse text-center">
            <caption className="sr-only">
              Jadwal tryout dan kelas live {monthLabel(month!)}
            </caption>
            <thead>
              <tr>
                {WEEKDAYS.map((d) => (
                  <th
                    key={d}
                    scope="col"
                    className="pb-2 font-mono text-xs font-medium text-ink-muted lowercase"
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => (
                <tr key={week[0].key}>
                  {week.map((day) => (
                    <DayCell
                      key={day.key}
                      day={day}
                      today={day.key === today}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <ul
          aria-label="Keterangan"
          className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-sm text-ink-muted"
        >
          <li className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-4 rounded-full bg-brand"
            />
            Tryout
          </li>
          <li className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-4 rounded-full border-2 border-brand"
            />
            Kelas live
          </li>
        </ul>
      </section>

      <section
        aria-labelledby="agenda-judul"
        className="flex flex-col gap-4"
      >
        <h2
          id="agenda-judul"
          className="font-display text-2xl font-bold tracking-display text-ink"
        >
          Agenda bulan ini
        </h2>
        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton
                key={i}
                className="h-24 rounded-md"
              />
            ))}
          </div>
        ) : agenda.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Belum ada tryout atau kelas live bulan ini"
            description="Cek bulan berikutnya, atau buka kalender lengkap untuk webinar dan event lain."
            className="bg-surface"
          />
        ) : (
          <ol className="flex flex-col gap-3">
            {agenda.map((e) => (
              <AgendaItem
                key={e.id}
                event={e}
              />
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function DayCell({
  day,
  today,
}: {
  day: ReturnType<typeof monthGrid>[number][number];
  today: boolean;
}) {
  const hasTryout = day.events.some((e) => e.kind === 'tryout');
  const hasClass = day.events.some((e) => e.kind === 'class');
  const summary = day.events
    .map((e) => `${KIND_LABEL[e.kind]}: ${e.title}`)
    .join('; ');
  if (!day.inMonth) return <td aria-hidden />;
  return (
    <td className="p-0.5 sm:p-1">
      <span
        className={cn(
          'mx-auto flex aspect-square w-full max-w-11 items-center justify-center rounded-full font-mono text-sm font-medium tabular-nums',
          !hasTryout && !hasClass && 'text-ink',
          hasTryout && 'bg-brand text-brand-ink',
          hasClass && 'border-2 border-brand',
          hasClass && !hasTryout && 'text-brand-strong',
          hasTryout &&
            hasClass &&
            'ring-2 ring-brand ring-offset-2 ring-offset-surface',
          today &&
            !hasTryout &&
            !hasClass &&
            'bg-paper underline decoration-2 underline-offset-4',
        )}
      >
        {day.day}
        {(summary || today) && (
          <span className="sr-only">
            {today ? ', hari ini' : ''}
            {summary ? `, ${summary}` : ''}
          </span>
        )}
      </span>
    </td>
  );
}

function AgendaItem({ event }: { event: CalendarEvent }) {
  const { data: session } = useSession();
  const {
    useAuth: { setShowAuth },
  } = useAppContext();
  const label = event.kind === 'tryout' ? 'Lihat tryout' : 'Gabung kelas';
  return (
    <li className="flex items-start gap-4 rounded-md border border-line bg-surface p-4">
      <span
        aria-hidden
        className={cn(
          'mt-1 size-5 shrink-0 rounded-full',
          event.kind === 'tryout' ? 'bg-brand' : 'border-[3px] border-brand',
        )}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <MonoLabel>{KIND_LABEL[event.kind]}</MonoLabel>
        <p className="font-display text-lg leading-snug font-bold tracking-display text-ink">
          {event.title}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <InfoPill
            size="sm"
            variant="soft"
          >
            <CalendarDays aria-hidden />
            {eventWhen(event.startDate)}
          </InfoPill>
          {session ? (
            <Button
              asChild
              variant="link"
              size="sm"
            >
              <Link href={event.href}>{label}</Link>
            </Button>
          ) : (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowAuth({ open: true, redirect: event.href })}
            >
              {label}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
