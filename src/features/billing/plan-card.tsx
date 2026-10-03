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

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border bg-surface',
        plan.recommended
          ? 'border-brand-strong ring-4 ring-brand/20'
          : 'border-line',
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

      <div className="flex flex-1 flex-col gap-5 p-5">
        <header className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {plan.recommended && <Badge variant="highlight">Rekomendasi</Badge>}
            <Badge variant="secondary">
              {plan.PlanSubscription?.tier ?? KIND_LABEL[planKind(plan)]}
            </Badge>
            {tracks.slice(0, 3).map((track) => (
              <Badge
                key={track}
                variant="outline"
              >
                {track}
              </Badge>
            ))}
            {tracks.length > 3 && (
              <Badge variant="outline">+{tracks.length - 3}</Badge>
            )}
          </div>
          <h3 className="text-lg leading-snug font-bold text-ink">
            {plan.name}
          </h3>
          {plan.description && (
            <p className="line-clamp-3 text-sm text-ink-muted">
              {plan.description}
            </p>
          )}
        </header>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-3xl font-extrabold text-ink tabular-nums">
              {formatIDR(price)}
            </span>
            {struck > price && (
              <s className="text-sm text-ink-subtle tabular-nums">
                {formatIDR(struck)}
              </s>
            )}
            {percent > 0 && <Badge variant="success">Hemat {percent}%</Badge>}
          </div>
          <p className="text-sm text-ink-muted">
            {schedule.length > 1
              ? `Bisa dicicil ${schedule.length}×, mulai ${formatIDR(schedule[0].amount)}`
              : perDay
                ? `Sekitar ${formatIDR(perDay)} per hari`
                : plan.timeline || 'Sekali bayar'}
          </p>
        </div>

        {(highlights.length > 0 || coins.length > 0) && (
          <ul className="flex flex-col gap-2 text-sm">
            {highlights.slice(0, 5).map((text, i) => (
              <li
                key={i}
                className="flex gap-2 text-ink"
              >
                <Check
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden
                />
                {text}
              </li>
            ))}
            {coins.length > 0 && (
              <li className="flex gap-2 text-ink">
                <Check
                  className="mt-0.5 size-4 shrink-0 text-success"
                  aria-hidden
                />
                Koin: {coins.map((c) => `${c.value} ${c.label}`).join(', ')}
              </li>
            )}
            {highlights.length > 5 && (
              <li className="pl-6 text-ink-muted">
                +{highlights.length - 5} keunggulan lain
              </li>
            )}
          </ul>
        )}

        {(plan.maxUsers || plan.timeline) && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
            {plan.maxUsers && (
              <span
                className={cn(
                  'inline-flex items-center gap-1',
                  isAlmostFull(plan) && 'font-semibold text-danger',
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
              disabled={soldOut}
              onClick={() => onBuy(plan)}
            >
              {soldOut ? 'Kuota penuh' : 'Beli paket'}
            </Button>
            <Button
              variant="ghost"
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
