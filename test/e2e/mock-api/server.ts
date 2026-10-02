/// <reference types="bun" />
/**
 * Backend palsu untuk E2E (dijalankan dengan bun). Next.js di-build dengan
 * NEXT_PUBLIC_API_URL mengarah ke sini, sehingga proxy (server) dan browser
 * sama-sama memakai data fiktif. Rute yang belum di-mock membalas 404 dan
 * dicatat di /__unhandled agar tes bisa menangkap request yang terlewat.
 */
import {
  COURSE_INDEX,
  INSTRUCTORS,
  LINK_PAGES,
  NOTIFICATIONS,
  PLANS,
  POSTS,
  TRACKS,
  USERS,
} from './fixtures';

type Handler = (req: Request, url: URL) => Response | Promise<Response>;

const PORT = Number(process.env.MOCK_API_PORT ?? 4010);
const unhandled: string[] = [];

const ok = (data: unknown, extra: Record<string, unknown> = {}) =>
  Response.json({ status: 200, message: 'OK', data, ...extra });

const fail = (status: number, message: string) =>
  Response.json({ status, message, data: null }, { status });

const userFrom = (req: Request) => {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  return token ? USERS[token] : undefined;
};

const routes: Record<string, Handler> = {
  'POST /auth/verifyToken': (req) => {
    const user = userFrom(req);
    return user ? ok(user) : fail(401, 'Sesi berakhir');
  },
  'GET /website-category/getWebsiteCategory': () => ok(TRACKS),
  'GET /website-category/getSingleWebsiteSubCategory': (_req, url) => {
    const id = url.searchParams.get('website_sub_category_id');
    const track = TRACKS.flatMap((c) => c.WebsiteSubCategory).find(
      (t) => t.id === id,
    );
    return track ? ok(track) : fail(404, 'Track tidak ditemukan');
  },
  'GET /user/getCurrentLimitation': () =>
    ok({ chat: 0, vision: 0, quiz: 0, maxChat: 10, maxVision: 5, maxQuiz: 5 }),
  'GET /plan/getAllPlanByWebCategory': () =>
    ok({
      plans: PLANS,
      topping: PLANS.filter((p) => !p.PlanSubscription),
      webSubCategory: [
        {
          webSubCategoryId: 'utbk',
          subscriptions: [],
          bundles: PLANS.filter((p) => p.PlanSubscription),
        },
        {
          webSubCategoryId: 'all',
          subscriptions: [],
          bundles: PLANS.filter((p) => p.PlanSubscription),
        },
      ],
    }),
  'GET /plan/getSinglePlan': (_req, url) => {
    const plan = PLANS.find((p) => p.slug === url.searchParams.get('slug'));
    return plan ? ok(plan) : fail(404, 'Paket tidak ditemukan');
  },
  'POST /voucher/checkVoucherCode': async (req) => {
    const body = (await req.json()) as { voucherCode: string };
    return body.voucherCode === 'HEMAT20'
      ? ok({ type: 'Percentage', discount: 20 })
      : fail(404, 'Voucher tidak ditemukan');
  },
  'POST /payment/addPayment': () =>
    ok({ invoiceUrl: 'http://127.0.0.1:4010/__invoice', order_id: 'ord-e2e' }),
  'GET /blog/getBlog': () => ok(POSTS),
  'GET /blog/getBlogBySlug': (_req, url) => {
    const post = POSTS.find((p) => p.slug === url.searchParams.get('slug'));
    return post ? ok(post) : fail(404, 'Artikel tidak ditemukan');
  },
  'POST /blog/incrementViews': () => ok(null),
  'GET /instructor/getAllInstructor': () => ok(INSTRUCTORS),
  'GET /liveClass/getAllLiveClassForLandingPage': () => ok([]),
  'GET /tryout/getTryOutCardUpcoming2': () => ok([]),
  'GET /link/public/sitemap-slugs': () =>
    ok([{ slug: 'komunitas', updatedAt: '2026-09-01T00:00:00.000Z' }]),
  'GET /notification/getNotification': () =>
    ok([], { page: 1, total_pages: 1, total_data: 0 }),
  'GET /notification/getUserNotification': (_req, url) => {
    const unreadOnly = url.searchParams.get('unReadOnly') === 'true';
    const list = NOTIFICATIONS.filter((n) => !unreadOnly || !n.isRead);
    return ok(
      {
        data: list,
        unreadCount: NOTIFICATIONS.filter((n) => !n.isRead).length,
      },
      { page: 1, total_pages: 1, total: list.length },
    );
  },
  'PUT /notification/readNotification': () => ok(null),
  'PUT /notification/readAllNotification': () => ok(null),
  'GET /notification/vapidPublicKey': () => ok({ publicKey: '' }),
  'POST /user/checkSubscription': () => ok(null),
  'POST /user/checkSubscriptionPending': () => ok(null),
  'POST /user/checkSubscriptionInstallment': () => ok(null),
  'POST /user/checkLimitation': () => ok(null),
  'GET /user/getUserOnBoarding': () => ok([]),
  'GET /payment/getPaymentInProses': () => ok({ waiting: [], riwayat: [] }),
  'GET /course/getCategoryForCard': () => ok(COURSE_INDEX),
  'GET /category/getAllCategories': () => ok([]),
  // Pelacakan server-side (CAPI) — diterima tanpa diproses.
  'POST /tracking/event': () => ok(null),
};

// Seperti backend asli (cors + credentials): origin dipantulkan, bukan `*`,
// karena browser menolak `*` untuk request yang membawa cookie.
const corsFor = (req: Request) => ({
  'Access-Control-Allow-Origin': req.headers.get('origin') ?? '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers':
    req.headers.get('access-control-request-headers') ?? '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  Vary: 'Origin',
});

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const cors = corsFor(req);
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    if (url.pathname === '/__unhandled') {
      return Response.json(unhandled, { headers: cors });
    }
    if (url.pathname === '/__reset') {
      unhandled.length = 0;
      return new Response('ok', { headers: cors });
    }

    const linkMatch =
      req.method === 'GET' && url.pathname.match(/^\/link\/([^/]+)$/);
    if (linkMatch && LINK_PAGES[linkMatch[1]]) {
      const page = LINK_PAGES[linkMatch[1]];
      const res =
        page.password && url.searchParams.get('password') !== page.password
          ? fail(401, 'Butuh password')
          : ok(page.data);
      for (const [k, v] of Object.entries(cors)) res.headers.set(k, v);
      return res;
    }

    const handler = routes[`${req.method} ${url.pathname}`];
    const res = handler ? await handler(req, url) : null;
    if (!res) unhandled.push(`${req.method} ${url.pathname}`);

    const out =
      res ?? fail(404, `Mock belum ada: ${req.method} ${url.pathname}`);
    for (const [k, v] of Object.entries(cors)) out.headers.set(k, v);
    return out;
  },
});

console.log(`[mock-api] siap di http://127.0.0.1:${PORT}`);
