'use client';

import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitationSafe } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  COIN_KEYS,
  COIN_LABELS,
  currentInstallment,
  FEATURE_LABELS,
  isOverdue,
  remaining,
  tierLabel,
} from '@/features/billing/model';
import { siteHref } from '@/lib/surface';
import { appPath, useTrackId } from '@/lib/track';
import { cn } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ChevronDown, Crown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const formatDate = (value: string | Date) =>
  format(new Date(value), 'd MMM yyyy', { locale: localeId });

/** Ringkasan paket: tier, langganan aktif/tertunda, cicilan, dan sisa koin. */
export function PlanMenu() {
  const { data: session } = useSession();
  const limitation = useUserLimitationSafe()?.userLimitation;
  const { setPagesSetting, openUpgrade } = useAppContext();
  const trackId = useTrackId();
  const [open, setOpen] = useState(false);
  if (!session) return null;

  const { tier, subsList, subsPendingList } = session.user;
  const label = tierLabel(tier);
  const isFree = !tier;
  const unlimited = tier === 'ADMIN' || tier === 'SUPER_ADMIN';
  const close = () => setOpen(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant={isFree ? 'outline' : 'secondary'}
          size="sm"
          className="gap-1.5"
        >
          <Crown className={cn(isFree ? 'text-ink-muted' : 'text-brand')} />
          {label}
          <ChevronDown className="size-3.5 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="flex max-h-[min(36rem,80dvh)] w-80 flex-col gap-4 overflow-y-auto p-4"
      >
        <section className="flex flex-col gap-2">
          <h3 className="font-mono text-xs font-medium text-ink-muted lowercase">
            Langganan
          </h3>
          {subsList.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Kamu memakai akun gratis. Buka semua materi, try out, dan BimBot
              dengan paket belajar.
            </p>
          ) : (
            subsList.map((sub) => {
              const installment =
                sub.paymentType === 'INSTALLMENT'
                  ? currentInstallment(sub.SubscriptionInstallment)
                  : null;
              return (
                <article
                  key={sub.id}
                  className="flex flex-col gap-2 rounded-md border border-line p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-base font-bold tracking-display text-ink">
                      {sub.planName}
                    </p>
                    <Badge>{sub.planTier}</Badge>
                  </div>
                  {sub.SubscriptionFeature.length > 0 && (
                    <p className="text-xs text-ink-muted">
                      {sub.SubscriptionFeature.map(
                        (f) => FEATURE_LABELS[f.type] ?? f.type,
                      ).join(', ')}
                    </p>
                  )}
                  {installment && !installment.isPaid && (
                    <div
                      className={cn(
                        'flex flex-col gap-1 rounded-sm p-2 text-xs',
                        isOverdue(installment.dueDate)
                          ? 'bg-danger-soft'
                          : 'bg-highlight-soft',
                      )}
                    >
                      <p className="font-semibold text-ink">
                        Cicilan ke-{installment.installmentNumber}:{' '}
                        {formatIDR(installment.amount)}
                      </p>
                      <p className="text-ink-muted">
                        {isOverdue(installment.dueDate)
                          ? 'Lewat jatuh tempo'
                          : 'Jatuh tempo'}{' '}
                        {formatDate(installment.dueDate)}
                      </p>
                      <Button
                        size="xs"
                        className="mt-1 self-start"
                        onClick={() => {
                          close();
                          setPagesSetting('installment');
                        }}
                      >
                        Bayar cicilan
                      </Button>
                    </div>
                  )}
                  {sub.paymentType !== 'INSTALLMENT' && sub.planExpire && (
                    <p className="text-xs text-ink-muted">
                      Aktif sampai {formatDate(sub.planExpire)}
                    </p>
                  )}
                  <Link
                    href={siteHref(`/price/${sub.planSlug}`)}
                    onClick={close}
                    className="self-start text-xs font-semibold text-brand-strong hover:underline"
                  >
                    Detail paket
                  </Link>
                </article>
              );
            })
          )}
        </section>

        {subsPendingList.length > 0 && (
          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-xs font-medium text-ink-muted lowercase">
              Menunggu aktif
            </h3>
            {subsPendingList.map((pending) => (
              <article
                key={pending.id}
                className="flex flex-col gap-1 rounded-md border border-dashed border-line p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {pending.planName}
                  </p>
                  <Badge variant="highlight">
                    {pending.planTier === 'Limitation'
                      ? 'Koin'
                      : pending.planTier}
                  </Badge>
                </div>
                {pending.SubscriptionPendingFeature?.map((feature) => (
                  <p
                    key={feature.id}
                    className="text-xs text-ink-muted"
                  >
                    {FEATURE_LABELS[feature.type] ?? feature.type}:{' '}
                    {formatDate(feature.validFrom)} –{' '}
                    {formatDate(feature.validUntil)}
                  </p>
                ))}
                {pending.SubscriptionPendingLimitation && (
                  <p className="text-xs text-ink-muted">
                    Koin aktif{' '}
                    {formatDate(
                      pending.SubscriptionPendingLimitation.validFrom,
                    )}{' '}
                    –{' '}
                    {formatDate(
                      pending.SubscriptionPendingLimitation.validUntil,
                    )}
                  </p>
                )}
              </article>
            ))}
          </section>
        )}

        {limitation && (
          <section className="flex flex-col gap-2">
            <h3 className="font-mono text-xs font-medium text-ink-muted lowercase">
              Sisa koin
            </h3>
            <dl className="grid grid-cols-2 gap-2">
              {COIN_KEYS.map((key) => {
                const left = remaining(
                  limitation[`${key}Limit`],
                  limitation[key],
                );
                return (
                  <div
                    key={key}
                    className="flex flex-col rounded-sm bg-paper px-2.5 py-2"
                  >
                    <dt className="text-xs text-ink-muted">
                      {COIN_LABELS[key]}
                    </dt>
                    <dd
                      className={cn(
                        'font-display text-xl font-bold tabular-nums',
                        unlimited
                          ? 'text-ink'
                          : left === 0
                            ? 'text-danger'
                            : 'text-ink',
                      )}
                    >
                      {unlimited ? '∞' : left}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        )}

        <div className="flex flex-col gap-2 border-t border-line pt-3">
          {isFree && (
            <Button
              variant="default"
              onClick={() => {
                close();
                openUpgrade();
              }}
            >
              Lihat paket belajar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link
              href={appPath(trackId, 'subscription')}
              onClick={close}
            >
              Kelola langganan
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
