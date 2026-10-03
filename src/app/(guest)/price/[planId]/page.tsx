import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';
import { getPlanBySlug } from '@/features/billing/api';
import {
  FEATURE_TYPE_LABEL,
  installmentSchedule,
  installmentTotal,
  isAlmostFull,
  listPrice,
  planCoins,
  planTracks,
  strikePercent,
  type PlanDataType,
} from '@/features/billing/plan';
import { PlanDetailActions } from '@/features/billing/plan-detail-actions';
import { SITE_CONTAINER } from '@/features/marketing/section';
import { cn } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { BookOpen, Check, Coins, Video } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ planId: string }> };

// ISR: halaman dibuat saat pertama dikunjungi lalu disajikan dari cache,
// bukan dirender ulang (Function Vercel) di setiap kunjungan.
export const revalidate = 300;
export async function generateStaticParams() {
  return [];
}

const formatDate = (value: string | Date) =>
  format(new Date(value), 'd MMMM yyyy', { locale: localeId });

function accessDuration(plan: PlanDataType) {
  if (plan.PlanSubscription?.expireDays)
    return `${plan.PlanSubscription.expireDays} hari akses`;
  const feature = plan.PlanSubscription?.PlanFeature.find(
    (f) => f.validFrom && f.validUntil,
  );
  if (feature?.validFrom && feature.validUntil)
    return `Akses ${formatDate(feature.validFrom)} – ${formatDate(feature.validUntil)}`;
  const limit = plan.PlanLimitation;
  if (limit?.validFrom && limit.validUntil)
    return `Berlaku ${formatDate(limit.validFrom)} – ${formatDate(limit.validUntil)}`;
  if (limit?.expireDays) return `Koin berlaku ${limit.expireDays} hari`;
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { planId } = await params;
  const plan = await getPlanBySlug(planId);
  if (!plan)
    return { title: 'Paket tidak ditemukan', robots: { index: false } };
  const description = plan.description || `Paket ${plan.name} dari Bimbelio.`;
  return {
    title: plan.name,
    description,
    alternates: { canonical: `/price/${plan.slug}` },
    openGraph: {
      title: plan.name,
      description,
      url: `${siteConfig.url}/price/${plan.slug}`,
      images: [
        {
          url:
            plan.image ||
            `/api/og?${new URLSearchParams({ title: plan.name, description, label: 'paket belajar · bimbelio.com' })}`,
          alt: plan.name,
        },
      ],
    },
    twitter: { card: 'summary_large_image', title: plan.name, description },
  };
}

export default async function PlanDetailPage({ params }: Props) {
  const { planId } = await params;
  const plan = await getPlanBySlug(planId);
  if (!plan) notFound();

  const price = listPrice(plan);
  const percent = strikePercent(plan);
  const schedule = installmentSchedule(plan);
  const benefits = [...plan.PlanBenefit].sort((a, b) => a.order - b.order);
  const features = plan.PlanSubscription?.PlanFeature ?? [];
  const categories = features.flatMap((f) =>
    f.Pivot_Plan_Category.map((p) => p.Category),
  );
  const liveClasses = plan.Pivot_LiveClass_Plan.map((p) => p.LiveClass);
  const coins = planCoins(plan);
  const duration = accessDuration(plan);
  const tracks = planTracks(plan);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: plan.name,
    description: plan.description ?? undefined,
    image: plan.image ?? undefined,
    brand: { '@type': 'Brand', name: 'Bimbelio' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IDR',
      price,
      availability:
        plan.maxUsers && plan.totalUsers >= plan.maxUsers
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
      url: `${siteConfig.url}/price/${plan.slug}`,
    },
  };

  return (
    <div className={cn(SITE_CONTAINER, 'flex flex-col gap-14 py-10 lg:py-16')}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="font-mono text-xs font-medium text-ink-muted lowercase"
      >
        <Link
          href="/price"
          className="rounded-xs hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
        >
          Paket belajar
        </Link>
        <span aria-hidden> · </span>
        <span
          className="text-ink"
          aria-current="page"
        >
          {plan.name}
        </span>
      </nav>

      <div
        className={cn(
          'grid gap-10',
          plan.image
            ? 'lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'
            : 'max-w-3xl',
        )}
      >
        {plan.image && (
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-brand-soft">
            <Image
              src={plan.image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-1.5">
              {plan.recommended && (
                <Badge variant="highlight">Rekomendasi</Badge>
              )}
              {plan.PlanSubscription?.tier && (
                <Badge variant="secondary">{plan.PlanSubscription.tier}</Badge>
              )}
              {tracks.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                >
                  {t}
                </Badge>
              ))}
            </div>
            <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-hero text-balance text-ink sm:text-5xl">
              {plan.name}
            </h1>
            {plan.description && (
              <p className="text-lg text-pretty text-ink-muted">
                {plan.description}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-5 rounded-md border border-line bg-surface p-6">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span className="font-display text-5xl font-extrabold tracking-hero text-ink tabular-nums">
                  {formatIDR(price)}
                </span>
                {percent > 0 && (
                  <>
                    <s className="text-ink-subtle tabular-nums">
                      {formatIDR(plan.originalPrice ?? 0)}
                    </s>
                    <Badge variant="success">Hemat {percent}%</Badge>
                  </>
                )}
              </div>
              {duration && <p className="text-sm text-ink-muted">{duration}</p>}
            </div>

            {schedule.length > 1 && (
              <div className="flex flex-col gap-2 rounded-sm bg-paper p-4">
                <p className="text-sm font-semibold text-ink">
                  Bisa dicicil {schedule.length}×, total{' '}
                  {formatIDR(installmentTotal(plan))}
                </p>
                <ol className="flex flex-col gap-1 text-sm">
                  {schedule.map((item, index) => (
                    <li
                      key={item.id}
                      className="flex justify-between gap-3 tabular-nums"
                    >
                      <span className="text-ink-muted">
                        Cicilan {item.installmentNumber}
                        {index === 0
                          ? ' (saat membeli)'
                          : ` (hari ke-${item.daysAfterFirstPayment})`}
                      </span>
                      <span className="font-mono font-medium text-ink">
                        {formatIDR(item.amount)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {plan.maxUsers && (
              <p
                className={cn(
                  'text-sm',
                  isAlmostFull(plan)
                    ? 'font-semibold text-danger'
                    : 'text-ink-muted',
                )}
              >
                {plan.totalUsers} dari {plan.maxUsers} kursi sudah terisi
              </p>
            )}

            <PlanDetailActions plan={plan} />
          </div>

          {benefits.length > 0 && (
            <section
              aria-labelledby="keunggulan"
              className="flex flex-col gap-3"
            >
              <h2
                id="keunggulan"
                className="font-display text-xl font-bold tracking-display text-ink"
              >
                Yang kamu dapat
              </h2>
              <ul className="flex flex-col gap-3">
                {benefits.map((b) => (
                  <li
                    key={b.id}
                    className="flex gap-3"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-brand-ink"
                    >
                      <Check
                        className="size-3.5"
                        strokeWidth={3}
                      />
                    </span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-ink">{b.title}</span>
                      {b.description && (
                        <span className="text-sm text-ink-muted">
                          {b.description}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {(features.length > 0 || liveClasses.length > 0 || coins.length > 0) && (
        <section
          aria-labelledby="isi-paket"
          className="flex flex-col gap-6"
        >
          <h2
            id="isi-paket"
            className="font-display text-3xl font-bold tracking-display text-ink"
          >
            Isi paket
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            {features.length > 0 && (
              <div className="flex flex-col gap-5 rounded-md border border-line bg-surface p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold tracking-display text-ink">
                  <BookOpen
                    className="size-5 text-brand"
                    aria-hidden
                  />
                  Fitur
                </h3>
                <ul className="flex flex-col gap-2 text-sm">
                  {features.map((f) => (
                    <li
                      key={f.id}
                      className="flex justify-between gap-3 text-ink"
                    >
                      <span>{FEATURE_TYPE_LABEL[f.type] ?? f.type}</span>
                      <span className="text-ink-muted">
                        {f.type === 'LIVECLASS' && f.liveClassesPerWeek
                          ? `${f.liveClassesPerWeek}× per minggu`
                          : f.Pivot_Plan_Category.length > 0
                            ? `${f.Pivot_Plan_Category.length} mata pelajaran`
                            : ''}
                      </span>
                    </li>
                  ))}
                </ul>
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((c) => (
                      <Badge
                        key={c.name}
                        variant="secondary"
                      >
                        {c.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {coins.length > 0 && (
              <div className="flex flex-col gap-5 rounded-md border border-line bg-surface p-6">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold tracking-display text-ink">
                  <Coins
                    className="size-5 text-brand"
                    aria-hidden
                  />
                  Koin
                </h3>
                <dl className="grid grid-cols-2 gap-2">
                  {coins.map((c) => (
                    <div
                      key={c.key}
                      className="rounded-sm bg-paper px-3 py-2"
                    >
                      <dt className="font-mono text-xs font-medium text-ink-muted">
                        {c.label}
                      </dt>
                      <dd className="font-display text-xl font-bold text-ink tabular-nums">
                        {c.value.toLocaleString('id-ID')}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {liveClasses.length > 0 && (
              <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-6 md:col-span-2">
                <h3 className="flex items-center gap-2 font-display text-lg font-bold tracking-display text-ink">
                  <Video
                    className="size-5 text-brand"
                    aria-hidden
                  />
                  Live class termasuk ({liveClasses.length})
                </h3>
                <ul className="flex flex-col divide-y divide-line">
                  {liveClasses.map((lc) => (
                    <li
                      key={lc.id}
                      className="flex flex-col gap-0.5 py-3 sm:flex-row sm:justify-between sm:gap-6"
                    >
                      <span className="font-semibold text-ink">{lc.title}</span>
                      <span className="text-sm text-ink-muted tabular-nums">
                        {formatDate(lc.startDate)}, {lc.duration} menit
                        {lc.Instructor?.name
                          ? `, bersama ${lc.Instructor.name}`
                          : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
