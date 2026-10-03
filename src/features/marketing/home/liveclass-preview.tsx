'use client';

import { InfoPill } from '@/components/brand/info-pill';
import { useAppContext } from '@/components/provider/provider-app';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { appPath } from '@/lib/track';
import { CalendarDays, Radio, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  eventWhen,
  useLandingLiveClasses,
  type LandingLiveClass,
} from '../events';

/** Kelas live terdekat; gratis dan khusus peserta dipisah. Kosong/gagal → tidak tampil. */
export function LiveClassPreview() {
  const query = useLandingLiveClasses();

  if (query.isError || (query.isSuccess && query.data.length === 0))
    return null;

  const free = query.data?.filter((c) => c.accessType !== 'PREMIUM') ?? [];
  const premium = query.data?.filter((c) => c.accessType === 'PREMIUM') ?? [];

  return (
    <div className="flex flex-col gap-8">
      <h3 className="font-display text-2xl font-bold tracking-display text-ink">
        Jadwal kelas live terdekat
      </h3>
      {query.isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <Skeleton
              key={i}
              className="h-72 rounded-md"
            />
          ))}
        </div>
      ) : (
        <>
          {free.length > 0 && (
            <LiveGroup
              title="gratis untuk semua"
              items={free}
            />
          )}
          {premium.length > 0 && (
            <LiveGroup
              title="khusus peserta program"
              items={premium}
            />
          )}
        </>
      )}
    </div>
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
    <div className="flex flex-col gap-3">
      <h4 className="font-mono text-xs font-medium text-ink-muted lowercase">
        {title}
      </h4>
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
    <li className="flex flex-col overflow-hidden rounded-md border border-line bg-surface">
      <div className="relative aspect-[5/2] bg-brand-soft">
        {item.image ? (
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <Radio
            className="absolute inset-0 m-auto size-8 text-brand"
            aria-hidden
          />
        )}
        {isLive && (
          <Badge
            variant="ink"
            className="absolute top-3 left-3 gap-1.5"
          >
            <span
              aria-hidden
              className="size-2 animate-pulse rounded-full bg-highlight"
            />
            Sedang live
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="font-mono text-xs font-medium text-ink-muted lowercase">
          {item.Category?.name ?? 'Kelas live'}
        </p>
        <p className="line-clamp-2 font-display text-lg leading-snug font-bold tracking-display text-ink">
          {item.title}
        </p>
        <p className="flex items-center gap-1.5 text-sm text-ink-muted">
          <UserRound
            className="size-4 shrink-0"
            aria-hidden
          />
          {item.Instructor?.name ?? 'Tutor'}
          {item.Instructor?.lastEducation
            ? `, ${item.Instructor.lastEducation}`
            : ''}
        </p>
        <InfoPill
          size="sm"
          variant={isLive ? 'solid' : 'outline'}
        >
          <CalendarDays aria-hidden />
          {eventWhen(item.startDate)}
        </InfoPill>
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
