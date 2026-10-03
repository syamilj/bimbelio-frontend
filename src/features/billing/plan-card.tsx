'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { siteHref } from '@/lib/surface';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { cn } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import { Check, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FEATURE_TYPE_LABEL,
  installmentSchedule,
  isAlmostFull,
  isSoldOut,
  listPrice,
  planCoins,
  planKind,
  planTracks,
  pricePerDay,
  strikePercent,
  type PlanDataType,
} from './plan';

type PlanCardProps = {
  plan: PlanDataType;
  onBuy: (plan: PlanDataType) => void;
  /** Sembunyikan tombol (mis. pratinjau di admin). */
  viewOnly?: boolean;
  className?: string;
};

const KIND_LABEL = {
  subscription: 'Langganan',
  bundle: 'Bundel',
  coin: 'Koin',
  other: 'Paket',
};

export function PlanCard({ plan, onBuy, viewOnly, className }: PlanCardProps) {
  const price = listPrice(plan);
  const struck = Math.max(
    plan.originalPrice ?? 0,
    plan.discount != null ? plan.price : 0,
  );
  const percent =
    plan.discount != null
      ? Math.round(((plan.price - price) / plan.price) * 100)
      : strikePercent(plan);
  const schedule = installmentSchedule(plan);
  const perDay = pricePerDay(plan);
  const features = plan.PlanSubscription?.PlanFeature ?? [];
  const benefits = [...plan.PlanBenefit].sort((a, b) => a.order - b.order);
  const coins = planCoins(plan);
  const tracks = planTracks(plan);
  const soldOut = isSoldOut(plan);

  const highlights = [
    ...features.map((f) =>
      f.type === 'LIVECLASS' && f.liveClassesPerWeek
        ? `${FEATURE_TYPE_LABEL.LIVECLASS} ${f.liveClassesPerWeek}× per minggu`
        : (FEATURE_TYPE_LABEL[f.type] ?? f.type),
    ),
    ...benefits.map((b) => b.title),
  ];

  // Paket rekomendasi disorot Biru (BRAND-2.1 §6.1: satu kartu disorot).
  const featured = plan.recommended;
  const check = featured ? 'text-highlight' : 'text-brand';

  return (
    <article
      data-surface={featured ? 'brand' : undefined}
      className={cn(
        'flex flex-col overflow-hidden rounded-md',
        featured ? 'shadow-float' : 'border border-line bg-surface',
        className,
      )}
    >
      {plan.image && (
        <div className="relative aspect-[4/5] bg-paper">
          <Image
            src={plan.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-5 p-6">
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {plan.recommended && <Badge variant="highlight">Rekomendasi</Badge>}
            <Badge variant={featured ? 'ink' : 'secondary'}>
              {plan.PlanSubscription?.tier ?? KIND_LABEL[planKind(plan)]}
            </Badge>
            {tracks.slice(0, 3).map((track) => (
              <Badge
                key={track}
                variant="outline"
                className={cn(featured && 'border-white/70 text-white')}
              >
                {track}
              </Badge>
            ))}
            {tracks.length > 3 && (
              <Badge
                variant="outline"
                className={cn(featured && 'border-white/70 text-white')}
              >
                +{tracks.length - 3}
              </Badge>
            )}
          </div>
          <h3
            className={cn(
              'font-display text-xl leading-snug font-bold tracking-display',
              !featured && 'text-ink',
            )}
          >
            {plan.name}
          </h3>
          {plan.description && (
            <p
              className={cn(
                'line-clamp-3 text-sm',
                featured ? 'text-on-dark-muted' : 'text-ink-muted',
              )}
            >
              {plan.description}
            </p>
          )}
        </header>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span
              className={cn(
                'font-display text-4xl font-extrabold tracking-hero tabular-nums',
                !featured && 'text-ink',
              )}
            >
              {formatIDR(price)}
            </span>
            {struck > price && (
              <s
                className={cn(
                  'text-sm tabular-nums',
                  featured ? 'text-on-dark-muted' : 'text-ink-subtle',
                )}
              >
                {formatIDR(struck)}
              </s>
            )}
            {percent > 0 && <Badge variant="success">Hemat {percent}%</Badge>}
          </div>
          <p
            className={cn(
              'text-sm',
              featured ? 'text-on-dark-muted' : 'text-ink-muted',
            )}
          >
            {schedule.length > 1
              ? `Bisa dicicil ${schedule.length}×, mulai ${formatIDR(schedule[0].amount)}`
              : perDay
                ? `Sekitar ${formatIDR(perDay)} per hari`
                : plan.timeline || 'Sekali bayar'}
          </p>
        </div>

        {(highlights.length > 0 || coins.length > 0) && (
          <ul
            className={cn(
              'flex flex-col gap-2 border-t pt-4 text-sm',
              featured ? 'border-on-dark-line' : 'border-line text-ink',
            )}
          >
            {highlights.slice(0, 5).map((text, i) => (
              <li
                key={i}
                className="flex gap-2"
              >
                <Check
                  className={cn('mt-0.5 size-4 shrink-0', check)}
                  strokeWidth={2.5}
                  aria-hidden
                />
                {text}
              </li>
            ))}
            {coins.length > 0 && (
              <li className="flex gap-2">
                <Check
                  className={cn('mt-0.5 size-4 shrink-0', check)}
                  strokeWidth={2.5}
                  aria-hidden
                />
                Koin: {coins.map((c) => `${c.value} ${c.label}`).join(', ')}
              </li>
            )}
            {highlights.length > 5 && (
              <li
                className={cn(
                  'pl-6',
                  featured ? 'text-on-dark-muted' : 'text-ink-muted',
                )}
              >
                +{highlights.length - 5} keunggulan lain
              </li>
            )}
          </ul>
        )}

        {(plan.maxUsers || plan.timeline) && (
          <div
            className={cn(
              'flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs font-medium',
              featured ? 'text-on-dark-muted' : 'text-ink-muted',
            )}
          >
            {plan.maxUsers && (
              <span
                className={cn(
                  'inline-flex items-center gap-1',
                  isAlmostFull(plan) &&
                    (featured ? 'font-bold text-white' : 'text-danger'),
                )}
              >
                <Users
                  className="size-3.5"
                  aria-hidden
                />
                {plan.totalUsers}/{plan.maxUsers} kursi terisi
              </span>
            )}
            {plan.timeline && schedule.length > 1 && (
              <span>{plan.timeline}</span>
            )}
          </div>
        )}

        {!viewOnly && (
          <div className="mt-auto flex flex-col gap-2 pt-1">
            <Button
              size="lg"
              variant={featured ? 'accent' : 'default'}
              disabled={soldOut}
              onClick={() => onBuy(plan)}
            >
              {soldOut ? 'Kuota penuh' : 'Beli paket'}
            </Button>
            <Button
              variant={featured ? 'outline-light' : 'ghost'}
              asChild
              onClick={() => {
                try {
                  trackUnifiedEvent({
                    eventName: 'ViewContent',
                    customData: {
                      contents: [{ id: plan.id, quantity: 1 }],
                      content_id: plan.id,
                      content_name: plan.name,
                      content_type: 'product',
                      value: plan.price,
                      currency: 'IDR',
                    },
                  });
                } catch {}
              }}
            >
              <Link href={siteHref(`/price/${plan.slug}`)}>
                Lihat detail paket
              </Link>
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
