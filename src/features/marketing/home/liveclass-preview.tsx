'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/lib/api/client';
import { appPath } from '@/lib/track';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { CalendarDays, PlayCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

type LandingLiveClass = {
  id: string;
  title: string;
  image: string | null;
  startDate: string;
  status?: string;
  accessType: 'FREE' | 'PREMIUM' | string;
  websiteSubCategoryId: string;
  Category?: { name: string } | null;
  Instructor?: {
    name: string;
    lastEducation?: string | null;
    image?: string | null;
  } | null;
};

const when = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
};

/** Live class terdekat; gratis dan berbayar dipisah (tidak lagi ganda). */
export function LiveClassPreview() {
  const query = useQuery({
    queryKey: ['liveclass', 'landing'],
    queryFn: () =>
      api.get<LandingLiveClass[]>('/liveClass/getAllLiveClassForLandingPage', {
        params: { take: 6, page: 1 },
      }),
    staleTime: 60_000,
  });

  if (query.isError || (query.isSuccess && query.data.length === 0))
    return null;

  const free = query.data?.filter((c) => c.accessType !== 'PREMIUM') ?? [];
  const premium = query.data?.filter((c) => c.accessType === 'PREMIUM') ?? [];

  return (
    <section
      id="live-learning"
      aria-labelledby="live-judul"
      className="border-y border-line bg-surface py-16 sm:py-20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <header className="flex max-w-2xl flex-col gap-3">
          <h2
            id="live-judul"
            className="text-2xl leading-tight font-extrabold tracking-tight text-ink sm:text-3xl"
          >
            Belajar langsung bersama tutor alumni PTN
          </h2>
          <p className="text-lg text-ink-muted">
            Lebih dari 198 sesi live class interaktif. Tanya langsung dan
            diskusi real-time, bukan sekadar menonton video.
          </p>
        </header>
        {query.isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton
                key={i}
                className="h-72 rounded-lg"
              />
            ))}
          </div>
        ) : (
          <>
            {free.length > 0 && (
              <LiveGroup
                title="Gratis untuk semua"
                items={free}
              />
            )}
            {premium.length > 0 && (
              <LiveGroup
                title="Khusus peserta program"
                items={premium}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

function LiveGroup({
  title,
  items,
}: {
  title: string;
  items: LandingLiveClass[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <LiveCard
            key={item.id}
            item={item}
          />
        ))}
      </ul>
    </div>
  );
}

function LiveCard({ item }: { item: LandingLiveClass }) {
  const { data: session } = useSession();
  const {
    useAuth: { setShowAuth },
  } = useAppContext();
  const href = `${appPath(item.websiteSubCategoryId, `bimlive/detail/${item.id}`)}?liveLearningId=${item.id}`;
  const isLive = item.status === 'Sedang Berlangsung';

  return (
    <li className="flex flex-col overflow-hidden rounded-lg border border-line">
      <div className="relative aspect-[5/2] bg-paper">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <PlayCircle
            className="absolute inset-0 m-auto size-8 text-ink-subtle"
            aria-hidden
          />
        )}
        {isLive && (
          <Badge
            variant="destructive"
            className="absolute top-3 left-3"
          >
            Sedang live
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-sm text-ink-muted">
          {item.Category?.name ?? 'Live class'}
        </p>
        <h4 className="line-clamp-2 font-bold text-ink">{item.title}</h4>
        <p className="text-sm text-ink-muted">
          {item.Instructor?.name ?? 'Tutor'}
          {item.Instructor?.lastEducation
            ? `, ${item.Instructor.lastEducation}`
            : ''}
        </p>
        <p
          className={cn(
            'flex items-center gap-1.5 text-sm font-semibold',
            isLive ? 'text-danger' : 'text-ink',
          )}
        >
          <CalendarDays
            className="size-4"
            aria-hidden
          />
          {when(item.startDate)}
        </p>
        <div className="mt-auto pt-2">
          {session ? (
            <Button
              asChild
              variant="outline"
              className="w-full"
            >
              <Link href={href}>Gabung kelas</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAuth({ open: true, redirect: href })}
            >
              Gabung kelas
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}
