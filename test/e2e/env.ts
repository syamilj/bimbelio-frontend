// Env build & server E2E: semua URL backend → mock API lokal (127.0.0.1).
export const E2E_PORT = 3100;
export const MOCK_API = 'http://127.0.0.1:4010';

// Server kedua (next dev) untuk menguji mode domain terpisah. Chromium
// meresolusi *.localhost ke 127.0.0.1, jadi tidak perlu mengubah /etc/hosts.
export const E2E_DOMAINS_PORT = 3301;
export const E2E_DOMAINS = {
  // Bukan `localhost` polos: Next dev menganggapnya origin sendiri dan
  // membuat redirect lintas host menjadi relatif.
  site: `http://www.localhost:${E2E_DOMAINS_PORT}`,
  app: `http://app.localhost:${E2E_DOMAINS_PORT}`,
  admin: `http://admin.localhost:${E2E_DOMAINS_PORT}`,
};

export const E2E_ENV: Record<string, string> = {
  NEXT_PUBLIC_ENV: 'test',
  NEXT_PUBLIC_API_URL: MOCK_API,
  NEXT_PUBLIC_SOCKET_URL: 'http://127.0.0.1:4011',
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:4012',
  NEXT_PUBLIC_SUPABASE_UPLOAD_URL: 'http://127.0.0.1:4012',
  NEXT_PUBLIC_SUPABASE_IMG_URL: 'http://127.0.0.1:4012/img',
  NEXT_PUBLIC_SUPABASE_IMG_TO_URL: 'http://127.0.0.1:4012/to-question',
  NEXT_PUBLIC_SUPABASE_DUMP_IMAGES_URL: 'http://127.0.0.1:4012/dump-images',
  NEXT_PUBLIC_SUPABASE_PDF_URL: 'http://127.0.0.1:4012/pdf',
  NEXT_PUBLIC_SUPABASE_VIDEO_URL: 'http://127.0.0.1:4012/video',
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'e2e-client-id',
};

export const E2E_DOMAINS_ENV: Record<string, string> = {
  ...E2E_ENV,
  NEXT_PUBLIC_SITE_URL: E2E_DOMAINS.site,
  NEXT_PUBLIC_APP_URL: E2E_DOMAINS.app,
  NEXT_PUBLIC_ADMIN_URL: E2E_DOMAINS.admin,
};
