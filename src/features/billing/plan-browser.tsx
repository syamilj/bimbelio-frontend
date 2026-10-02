'use client';

import { EmptyState } from '@/components/patterns/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { api } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';
import { PackageSearch, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { listPrice, planKind, planTracks, type PlanDataType } from './plan';
import { PlanCard } from './plan-card';
import { PlanCheckout, usePlanCheckout } from './plan-checkout';

type KindFilter = 'all' | 'program' | 'coin';
type SortKey = 'recommended' | 'price' | 'price-desc' | 'popular';

const SORT_LABEL: Record<SortKey, string> = {
  recommended: 'Rekomendasi',
  price: 'Termurah',
  'price-desc': 'Termahal',
  popular: 'Paling banyak dibeli',
};

/** Daftar paket dengan pencarian, filter jenis & jalur, dan urutan. */
export function PlanBrowser({ plans }: { plans: PlanDataType[] }) {
  return (
    <PlanCheckout plans={plans}>
      <PlanBrowserInner plans={plans} />
    </PlanCheckout>
  );
}

/**
 * Halaman paket statis (ISR) memuat harga normal; harga terdiskon voucher URL
 * diambil di browser hanya bila ada `?voucherCode=`.
 */
function useVoucherPlans(plans: PlanDataType[], voucherCode: string | null) {
  const { data } = useQuery({
    queryKey: ['plans', 'voucher', voucherCode],
    queryFn: () =>
      api.get<{ plans: PlanDataType[] }>('/plan/getAllPlanByWebCategory', {
        params: { voucherCode },
      }),
    enabled: !!voucherCode,
  });
  return voucherCode && data?.plans ? data.plans : plans;
}

function PlanBrowserInner({ plans: basePlans }: { plans: PlanDataType[] }) {
  const { buy, voucherCode } = usePlanCheckout();
  const plans = useVoucherPlans(basePlans, voucherCode);
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<KindFilter>('all');
  const [track, setTrack] = useState('all');
  const [sort, setSort] = useState<SortKey>('recommended');

  const tracks = useMemo(
    () => [...new Set(plans.flatMap(planTracks))].sort(),
    [plans],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = plans.filter((plan) => {
      const k = planKind(plan);
      if (kind === 'program' && k === 'coin') return false;
      if (kind === 'coin' && k !== 'coin') return false;
      if (track !== 'all' && !planTracks(plan).includes(track)) return false;
      if (
        q &&
        !`${plan.name} ${plan.description ?? ''}`.toLowerCase().includes(q)
      )
        return false;
      return true;
    });
    const sorters: Record<
      SortKey,
      (a: PlanDataType, b: PlanDataType) => number
    > = {
      recommended: (a, b) =>
        Number(b.recommended) - Number(a.recommended) ||
        listPrice(b) - listPrice(a),
      price: (a, b) => listPrice(a) - listPrice(b),
      'price-desc': (a, b) => listPrice(b) - listPrice(a),
      popular: (a, b) => b.totalUsers - a.totalUsers,
    };
    return [...filtered].sort(sorters[sort]);
  }, [plans, query, kind, track, sort]);

  const filtered = query || kind !== 'all' || track !== 'all';
  const reset = () => {
    setQuery('');
    setKind('all');
    setTrack('all');
  };

  return (
    <section
      aria-labelledby="daftar-paket"
      className="flex flex-col gap-6"
    >
      <h2
        id="daftar-paket"
        className="sr-only"
      >
        Daftar paket
      </h2>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Tabs
          value={kind}
          onValueChange={(v) => setKind(v as KindFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">Semua</TabsTrigger>
            <TabsTrigger value="program">Program belajar</TabsTrigger>
            <TabsTrigger value="coin">Koin</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row lg:justify-end">
          <div className="relative sm:max-w-xs sm:flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle"
              aria-hidden
            />
            <Input
              type="search"
              aria-label="Cari paket"
              placeholder="Cari paket"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {tracks.length > 1 && (
            <Select
              value={track}
              onValueChange={setTrack}
            >
              <SelectTrigger
                className="sm:w-44"
                aria-label="Jalur ujian"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua jalur</SelectItem>
                {tracks.map((t) => (
                  <SelectItem
                    key={t}
                    value={t}
                  >
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as SortKey)}
          >
            <SelectTrigger
              className="sm:w-48"
              aria-label="Urutkan"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABEL) as SortKey[]).map((key) => (
                <SelectItem
                  key={key}
                  value={key}
                >
                  {SORT_LABEL[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p
        className="text-sm text-ink-muted"
        aria-live="polite"
      >
        {visible.length} paket
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title={
            plans.length === 0
              ? 'Paket belum tersedia'
              : 'Tidak ada paket yang cocok'
          }
          description={
            plans.length === 0
              ? 'Paket untuk periode berikutnya sedang disiapkan. Tanya tim kami untuk info terbaru.'
              : 'Ubah kata kunci atau filter untuk melihat paket lain.'
          }
          action={
            filtered ? (
              <Button
                variant="outline"
                onClick={reset}
              >
                Hapus filter
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onBuy={buy}
            />
          ))}
        </div>
      )}
    </section>
  );
}
