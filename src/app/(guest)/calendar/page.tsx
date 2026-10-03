import { SeriesLabel } from '@/components/brand/series-label';
import { ContactButton } from '@/components/layout/site/contact';
import { Button } from '@/components/ui/button';
import { EventCalendar } from '@/features/marketing/event-calendar';
import { MarketingSection } from '@/features/marketing/section';
import {
  Award,
  CalendarDays,
  ChevronDown,
  ExternalLink,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jadwal event',
  description:
    'Lihat jadwal webinar, live class, dan tryout gratis dari Bimbelio.',
  alternates: { canonical: '/calendar' },
  openGraph: {
    title: 'Jadwal event Bimbelio',
    description: 'Ikuti webinar, live class, dan tryout gratis dari Bimbelio.',
  },
};

const CALENDAR_ID = 'bimbelio.marketing@gmail.com';
const EMBED_URL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=Asia%2FJakarta`;
const SUBSCRIBE_URL = `https://calendar.google.com/calendar/u/0?cid=${CALENDAR_ID}`;

const TYPES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Zap,
    title: 'Webinar',
    body: 'Sesi belajar interaktif bersama expert.',
  },
  {
    icon: Users,
    title: 'Live class',
    body: 'Kelas langsung dengan diskusi real-time.',
  },
  {
    icon: Award,
    title: 'Tryout',
    body: 'Simulasi ujian dengan evaluasi lengkap.',
  },
];

export default function CalendarPage() {
  return (
    <>
      <MarketingSection
        headingLevel={1}
        eyebrow={<SeriesLabel icon={CalendarDays}>Kalender</SeriesLabel>}
        title="Jadwal event Bimbelio"
        description="Ikuti webinar, live class, dan tryout gratis. Jadwal diperbarui langsung oleh tim kami."
        headerAction={
          <Button
            asChild
            variant="outline"
          >
            <a
              href={SUBSCRIBE_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink />
              Simpan ke Google Calendar
            </a>
          </Button>
        }
        className="pt-10 sm:pt-14"
      >
        <EventCalendar />

        <details className="group rounded-md border border-line bg-surface">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md px-5 py-4 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none [&::-webkit-details-marker]:hidden">
            <span className="flex flex-col gap-0.5">
              <span className="font-display text-lg font-bold tracking-display text-ink">
                Kalender lengkap
              </span>
              <span className="text-sm text-ink-muted">
                Webinar dan event lain dari Google Calendar tim Bimbelio.
              </span>
            </span>
            <ChevronDown
              className="size-5 shrink-0 text-ink-muted transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="border-t border-line">
            <iframe
              src={EMBED_URL}
              title="Kalender lengkap Bimbelio"
              className="h-[38rem] w-full rounded-b-md border-0"
              loading="lazy"
            />
          </div>
        </details>

        <ul className="grid gap-6 md:grid-cols-3">
          {TYPES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="flex gap-3"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full border-[1.5px] border-brand text-brand">
                <Icon
                  className="size-5"
                  aria-hidden
                />
              </span>
              <div>
                <h2 className="font-display text-lg font-bold tracking-display text-ink">
                  {title}
                </h2>
                <p className="text-sm text-ink-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </MarketingSection>
      <MarketingSection
        tone="surface"
        title="Ada pertanyaan tentang event?"
        description="Tanyakan webinar, live class, atau tryout yang cocok untuk kebutuhan belajarmu."
        headerAction={<ContactButton size="lg" />}
      />
    </>
  );
}
