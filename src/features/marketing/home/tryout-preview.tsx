'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { env } from '@/env.mjs';
import { api } from '@/lib/api/client';
import { appPath } from '@/lib/track';
import { useQuery } from '@tanstack/react-query';
import { Clock, FileQuestion, Layers, Trophy } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type UpcomingTryout = {
  id: string;
  title: string;
  image?: string | null;
  startDate: string;
  isDone?: boolean;
  isRegistered?: boolean;
  isJoin?: boolean;
  isCouponOnly?: boolean;
  WebsiteSubCategory: { id: string; name: string };
  TryoutSession: {
    duration: number;
    TryoutCategory?: { name: string };
    _count?: { TryoutQuestion: number };
  }[];
};

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

/** Try out gratis yang akan datang. Seksi tidak tampil bila kosong. */
export function TryoutPreview() {
  const { data: session, status } = useSession();
  const userId = session?.user.id;
  const query = useQuery({
    queryKey: ['tryout', 'upcoming-public', userId ?? 'guest'],
    queryFn: () =>
      api.get<UpcomingTryout[]>('/tryout/getTryOutCardUpcoming2', {
        params: { take: 5, userId },
      }),
    enabled: status !== 'loading',
    staleTime: 60_000,
  });

  if (query.isError || (query.isSuccess && query.data.length === 0))
    return null;

  return (
    <section
      id="tryout"
      aria-labelledby="tryout-judul"
      className="py-16 sm:py-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <header className="flex max-w-2xl flex-col gap-3">
          <h2
            id="tryout-judul"
            className="text-2xl leading-tight font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            Latihan dulu sebelum hari H
          </h2>
          <p className="text-lg text-ink-muted">
            Try out berbasis IRT dengan format resmi UTBK. Gratis untuk semua
            member, lengkap dengan peringkat nasional.
          </p>
        </header>
        <ul
          tabIndex={0}
          aria-label="Daftar try out"
          className="-mx-4 scrollbar-none flex snap-x gap-4 overflow-x-auto px-4 pb-2 focus-visible:ring-brand sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3"
        >
          {query.isPending
            ? Array.from({ length: 3 }, (_, i) => (
                <li
                  key={i}
                  className="w-72 shrink-0 sm:w-auto"
                >
                  <Skeleton className="h-96 rounded-lg" />
                </li>
              ))
            : query.data.map((tryout) => (
                <TryoutCard
                  key={tryout.id}
                  tryout={tryout}
                  signedIn={!!session}
                />
              ))}
        </ul>
      </div>
    </section>
  );
}

function TryoutCard({
  tryout,
  signedIn,
}: {
  tryout: UpcomingTryout;
  signedIn: boolean;
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
        ? 'Mulai try out'
        : 'Daftar gratis';

  const stats = [
    { icon: Clock, label: `${minutes} menit` },
    { icon: FileQuestion, label: `${questions} soal` },
    { icon: Layers, label: `${sessions.length} subtes` },
  ];

  return (
    <li className="flex w-72 shrink-0 snap-start flex-col overflow-hidden rounded-lg border border-line bg-surface sm:w-auto">
      <div className="relative aspect-[4/3] bg-paper">
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
            className="absolute inset-0 m-auto size-10 text-ink-subtle"
            aria-hidden
          />
        )}
        <Badge
          variant={tryout.isCouponOnly ? 'marker' : 'success'}
          className="absolute top-3 left-3"
        >
          {tryout.isCouponOnly ? 'BimPartner' : 'Gratis'}
        </Badge>
        {tryout.isRegistered && (
          <Badge
            variant="solid"
            className="absolute top-3 right-3"
          >
            Terdaftar
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-ink-muted">
            {tryout.WebsiteSubCategory.name}, mulai{' '}
            {shortDate(tryout.startDate)}
          </p>
          <h3 className="line-clamp-2 text-lg font-bold text-ink">
            {tryout.title}
          </h3>
        </div>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
          {stats.map(({ icon: Icon, label: text }) => (
            <li
              key={text}
              className="flex items-center gap-1.5 tabular-nums"
            >
              <Icon
                className="size-4"
                aria-hidden
              />
              {text}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-2">
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
