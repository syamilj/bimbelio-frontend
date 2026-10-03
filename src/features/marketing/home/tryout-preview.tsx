'use client';

import { InfoPill } from '@/components/brand/info-pill';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { env } from '@/env.mjs';
import { appPath } from '@/lib/track';
import { cn } from '@/lib/utils';
import { CalendarDays, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useUpcomingTryouts, type UpcomingTryout } from '../events';

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

/**
 * Tryout gratis yang akan datang. Tidak tampil sama sekali bila kosong/gagal,
 * jadi aman disisipkan di seksi lain.
 */
export function TryoutPreview({
  title = 'Tryout gratis terdekat',
  description = 'Tryout berbasis IRT dengan format resmi UTBK. Gratis untuk semua member, lengkap dengan peringkat nasional.',
  headingLevel = 3,
  className,
}: {
  title?: string;
  description?: string;
  headingLevel?: 2 | 3;
  className?: string;
}) {
  const { data: session } = useSession();
  const query = useUpcomingTryouts();

  if (query.isError || (query.isSuccess && query.data.length === 0))
    return null;

  const Heading = headingLevel === 2 ? 'h2' : 'h3';

  return (
    <div
      id="tryout"
      className={cn('flex flex-col gap-6', className)}
    >
      <header className="flex max-w-2xl flex-col gap-2">
        <Heading
          id="tryout-judul"
          className={cn(
            'font-display leading-tight font-bold tracking-display text-ink',
            headingLevel === 2 ? 'text-3xl sm:text-4xl' : 'text-2xl',
          )}
        >
          {title}
        </Heading>
        <p className="text-ink-muted">{description}</p>
      </header>
      <ul
        tabIndex={0}
        aria-labelledby="tryout-judul"
        className="-mx-5 scrollbar-none flex snap-x gap-4 overflow-x-auto px-5 pb-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3"
      >
        {query.isPending
          ? Array.from({ length: 3 }, (_, i) => (
              <li
                key={i}
                className="w-72 shrink-0 sm:w-auto"
              >
                <Skeleton className="h-96 rounded-md" />
              </li>
            ))
          : query.data.map((tryout) => (
              <TryoutCard
                key={tryout.id}
                tryout={tryout}
                signedIn={!!session}
                titleAs={headingLevel === 2 ? 'h3' : 'h4'}
              />
            ))}
      </ul>
    </div>
  );
}

function TryoutCard({
  tryout,
  signedIn,
  titleAs: Title,
}: {
  tryout: UpcomingTryout;
  signedIn: boolean;
  titleAs: 'h3' | 'h4';
}) {
  const {
    useAuth: { setShowAuth },
  } = useAppContext();
  const sessions = tryout.TryoutSession ?? [];
  const minutes = sessions.reduce((sum, s) => sum + (s.duration ?? 0), 0);
  const questions = sessions.reduce(
    (sum, s) => sum + (s._count?.TryoutQuestion ?? 0),
    0,
  );
  const href = `${appPath(tryout.WebsiteSubCategory.id, 'bimarena/try-out')}?id=${tryout.id}`;
  const label =
    tryout.isRegistered && tryout.isJoin && tryout.isDone
      ? 'Lihat hasil & pembahasan'
      : tryout.isRegistered
        ? 'Mulai tryout'
        : 'Daftar gratis';

  return (
    <li className="flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-md border border-line bg-surface sm:w-auto">
      <div className="relative aspect-[4/3] bg-brand-soft">
        {tryout.image ? (
          <Image
            src={`${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/tryout/${tryout.image}`}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 288px"
            className="object-cover"
          />
        ) : (
          <Trophy
            className="absolute inset-0 m-auto size-10 text-brand"
            aria-hidden
          />
        )}
        <Badge
          variant={tryout.isCouponOnly ? 'ink' : 'solid'}
          className="absolute top-3 left-3"
        >
          {tryout.isCouponOnly ? 'BimPartner' : 'Gratis'}
        </Badge>
        {tryout.isRegistered && (
          <Badge
            variant="highlight"
            className="absolute top-3 right-3"
          >
            Terdaftar
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-xs font-medium text-ink-muted lowercase">
            {tryout.WebsiteSubCategory.name}
          </p>
          <Title className="line-clamp-2 font-display text-lg leading-snug font-bold tracking-display text-ink">
            {tryout.title}
          </Title>
          <InfoPill
            size="sm"
            variant="soft"
          >
            <CalendarDays aria-hidden />
            Mulai {shortDate(tryout.startDate)}
          </InfoPill>
        </div>
        <dl className="grid grid-cols-3 gap-2 border-y border-line py-3 text-center">
          {[
            [minutes, 'menit'],
            [questions, 'soal'],
            [sessions.length, 'subtes'],
          ].map(([value, unit]) => (
            <div
              key={unit}
              className="flex flex-col"
            >
              <dt className="order-2 font-mono text-xs font-medium text-ink-muted">
                {unit}
              </dt>
              <dd className="order-1 font-display text-lg font-bold text-ink tabular-nums">
                {value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto">
          {signedIn ? (
            <Button
              asChild
              className="w-full"
            >
              <Link href={href}>{label}</Link>
            </Button>
          ) : (
            <Button
              className="w-full"
              onClick={() => setShowAuth({ open: true, redirect: href })}
            >
              {label}
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
