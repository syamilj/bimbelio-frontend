'use client';

import { PageHeader } from '@/components/patterns/page-header';
import { QueryState } from '@/components/patterns/query-state';
import { Skeleton } from '@/components/ui/skeleton';
import type { PlanDataType } from '@/features/billing/plan';
import { PlanBrowser } from '@/features/billing/plan-browser';
import { api } from '@/lib/api/client';
import { useTrackId } from '@/lib/track';
import { useQuery } from '@tanstack/react-query';

type PlanGroups = {
  webSubCategory: {
    webSubCategoryId: string;
    subscriptions: PlanDataType[];
    bundles: PlanDataType[];
  }[];
  topping: PlanDataType[];
};

/** Paket untuk jalur ujian yang sedang dibuka (+ paket koin). */
function plansForTrack(data: PlanGroups, trackId: string | null) {
  const groups = data.webSubCategory ?? [];
  const group =
    groups.find(
      (g) => g.webSubCategoryId.toLowerCase() === trackId?.toLowerCase(),
    ) ?? groups.find((g) => g.webSubCategoryId.toLowerCase() === 'all');
  const seen = new Set<string>();
  return [
    ...(group?.subscriptions ?? []),
    ...(group?.bundles ?? []),
    ...(data.topping ?? []),
  ].filter((plan) => !seen.has(plan.id) && seen.add(plan.id));
}

export default function PaketBelajarPage() {
  const trackId = useTrackId();
  const query = useQuery({
    queryKey: ['plans', 'by-track', trackId],
    queryFn: () => api.get<PlanGroups>('/plan/getAllPlanByWebCategory'),
    select: (data) => plansForTrack(data, trackId),
    staleTime: 5 * 60_000,
  });

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Paket belajar"
        description="Buka materi, try out, live class, dan koin BimBot sesuai jalur ujianmu."
      />
      <QueryState
        query={query}
        errorTitle="Daftar paket tidak dapat dimuat"
        loading={
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton
                key={i}
                className="h-[28rem] rounded-lg"
              />
            ))}
          </div>
        }
      >
        {(plans) => <PlanBrowser plans={plans} />}
      </QueryState>
    </div>
  );
}
