import { serverGet, serverGetSafe } from '@/lib/api/server';
import 'server-only';
import type { PlanDataType } from './plan';

type PlanListResponse = { plans: PlanDataType[]; topping: PlanDataType[] };

/** Semua paket aktif (bundel, langganan, koin) dengan harga normal. */
export async function getPlans() {
  const data = await serverGetSafe<PlanListResponse | null>(
    '/plan/getAllPlanByWebCategory',
    null,
    { revalidate: 300, tags: ['plans'] },
  );
  return data?.plans ?? [];
}

export async function getPlanBySlug(slug: string) {
  return serverGet<PlanDataType>('/plan/getSinglePlan', {
    params: { slug },
    revalidate: 300,
    tags: ['plans', `plan:${slug}`],
  });
}
