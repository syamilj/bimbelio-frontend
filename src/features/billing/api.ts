import { serverGet, serverGetSafe } from '@/lib/api/server';
import 'server-only';
import type { PlanDataType } from './plan';

type PlanListResponse = { plans: PlanDataType[]; topping: PlanDataType[] };

/** Semua paket aktif (bundel, langganan, koin). Voucher URL membuat harga terdiskon. */
export async function getPlans(voucherCode?: string | null) {
  const data = await serverGetSafe<PlanListResponse | null>(
    '/plan/getAllPlanByWebCategory',
    null,
    {
      params: { voucherCode: voucherCode || undefined },
      revalidate: voucherCode ? 0 : 300,
      tags: ['plans'],
    },
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
