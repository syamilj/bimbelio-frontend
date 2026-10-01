import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'test', 'production']),
    // MIDTRANS_SERVER_KEY: z.string(), // Server-side only
  },

  client: {
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_SOCKET_URL: z.string(),
    NEXT_PUBLIC_ENV: z.enum(['development', 'test', 'production']).optional(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_UPLOAD_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_IMG_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_IMG_TO_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_DUMP_IMAGES_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_PDF_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_VIDEO_URL: z.string(),
    // NEXT_PUBLIC_MIDTRANS_PRODUCTION: z.string().default('false'),
    // NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: z.string(), // Client-side key
    // NEXT_PUBLIC_MIDTRANS_SNAP_URL: z.string(), // Client-side key
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
    // Domain terpisah (opsional). Kosong → semua di satu domain (lokal/preview).
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
    NEXT_PUBLIC_ADMIN_URL: z.string().url().optional(),
    // Domain cookie sesi agar berlaku di semua subdomain, mis. `.bimbelio.com`.
    NEXT_PUBLIC_COOKIE_DOMAIN: z.string().optional(),
  },

  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_UPLOAD_URL:
      process.env.NEXT_PUBLIC_SUPABASE_UPLOAD_URL,
    NEXT_PUBLIC_SUPABASE_IMG_URL: process.env.NEXT_PUBLIC_SUPABASE_IMG_URL,
    NEXT_PUBLIC_SUPABASE_IMG_TO_URL:
      process.env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL,
    NEXT_PUBLIC_SUPABASE_DUMP_IMAGES_URL:
      process.env.NEXT_PUBLIC_SUPABASE_DUMP_IMAGES_URL,
    NEXT_PUBLIC_SUPABASE_PDF_URL: process.env.NEXT_PUBLIC_SUPABASE_PDF_URL,
    NEXT_PUBLIC_SUPABASE_VIDEO_URL: process.env.NEXT_PUBLIC_SUPABASE_VIDEO_URL,
    // NEXT_PUBLIC_MIDTRANS_PRODUCTION:
    //   process.env.NEXT_PUBLIC_MIDTRANS_PRODUCTION,
    // NEXT_PUBLIC_MIDTRANS_CLIENT_KEY:
    //   process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    // NEXT_PUBLIC_MIDTRANS_SNAP_URL: process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL,
    // MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY, // Server-side only
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL,
    NEXT_PUBLIC_COOKIE_DOMAIN: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
