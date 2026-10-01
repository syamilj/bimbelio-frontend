/// <reference types="bun" />
/**
 * Backend palsu untuk E2E (dijalankan dengan bun). Next.js di-build dengan
 * NEXT_PUBLIC_API_URL mengarah ke sini, sehingga proxy (server) dan browser
 * sama-sama memakai data fiktif. Rute yang belum di-mock membalas 404 dan
 * dicatat di /__unhandled agar tes bisa menangkap request yang terlewat.
 */
import { COURSE_INDEX, NOTIFICATIONS, TRACKS, USERS } from './fixtures';

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
  'GET /plan/getAllPlanByWebCategory': () => ok([]),
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

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
};

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    if (url.pathname === '/__unhandled') {
      return Response.json(unhandled, { headers: cors });
    }
    if (url.pathname === '/__reset') {
      unhandled.length = 0;
      return new Response('ok', { headers: cors });
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
