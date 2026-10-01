import { ContactButton } from '@/components/layout/site/contact';
import { Button } from '@/components/ui/button';
import { MarketingSection } from '@/features/marketing/section';
import { Award, ExternalLink, Users, Zap, type LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jadwal event',
  description:
    'Lihat jadwal webinar, live class, dan try out gratis dari Bimbelio.',
  alternates: { canonical: '/calendar' },
  openGraph: {
    title: 'Jadwal event Bimbelio',
    description: 'Ikuti webinar, live class, dan try out gratis dari Bimbelio.',
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
    title: 'Try out',
    body: 'Simulasi ujian dengan evaluasi lengkap.',
  },
];

export default function CalendarPage() {
  return (
    <>
      <MarketingSection
        headingLevel={1}
        title="Jadwal event Bimbelio"
        description="Ikuti webinar, live class, dan try out gratis. Jadwal diperbarui langsung oleh tim kami."
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
        <div className="overflow-hidden rounded-lg border border-line bg-surface">
          <iframe
            src={EMBED_URL}
            title="Jadwal event Bimbelio"
            className="h-[38rem] w-full border-0"
            loading="lazy"
          />
        </div>
        <ul className="grid gap-6 md:grid-cols-3">
          {TYPES.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="flex gap-3"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-strong">
                <Icon
                  className="size-5"
                  aria-hidden
                />
              </span>
              <div>
                <h2 className="font-bold text-ink">{title}</h2>
                <p className="text-sm text-ink-muted">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </MarketingSection>
      <MarketingSection
        tone="surface"
        title="Ada pertanyaan tentang event?"
        description="Tanyakan webinar, live class, atau try out yang cocok untuk kebutuhan belajarmu."
        headerAction={<ContactButton size="lg" />}
      />
    </>
  );
}
