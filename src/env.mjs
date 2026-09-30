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
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    // NEXT_PUBLIC_MIDTRANS_PRODUCTION: z.string().default('false'),
    // NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: z.string(), // Client-side key
    // NEXT_PUBLIC_MIDTRANS_SNAP_URL: z.string(), // Client-side key
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
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
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    // NEXT_PUBLIC_MIDTRANS_PRODUCTION:
    //   process.env.NEXT_PUBLIC_MIDTRANS_PRODUCTION,
    // NEXT_PUBLIC_MIDTRANS_CLIENT_KEY:
    //   process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    // NEXT_PUBLIC_MIDTRANS_SNAP_URL: process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL,
    // MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY, // Server-side only
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
