import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "development"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    OPENAI_API_KEY: z.string(),
    JWT_SECRET_KEY: z.string(),
    // LIMITATION_CHAT_FREE: z.string(),
    // LIMITATION_VISION_FREE: z.string(),
    // LIMITATION_NOTES_FREE: z.string(),
    // LIMITATION_QUIZ_FREE: z.string(),
    // LIMITATION_CHAT_PREMIUM: z.string(),
    // LIMITATION_VISION_PREMIUM: z.string(),
    // LIMITATION_NOTES_PREMIUM: z.string(),
    // LIMITATION_QUIZ_PREMIUM: z.string(),
    MIDTRANS_SERVER_KEY: z.string(), // Server-side only
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
  },

  client: {
    NEXT_PUBLIC_API_URL: z.string(),
    NEXT_PUBLIC_ENV: z.enum(["development", "test", "production"]).optional(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_IMG_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_IMG_TO_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_PDF_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_VIDEO_URL: z.string(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_SUPABASE_SECRET_KEY: z.string().min(1),
    NEXT_PUBLIC_MIDTRANS_PRODUCTION: z.string().default("false"),
    NEXT_PUBLIC_MIDTRANS_CLIENT_KEY: z.string(), // Client-side key
    NEXT_PUBLIC_MIDTRANS_SNAP_URL: z.string(), // Client-side key
  },

  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_IMG_URL: process.env.NEXT_PUBLIC_SUPABASE_IMG_URL,
    NEXT_PUBLIC_SUPABASE_IMG_TO_URL:
      process.env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL,
    NEXT_PUBLIC_SUPABASE_PDF_URL: process.env.NEXT_PUBLIC_SUPABASE_PDF_URL,
    NEXT_PUBLIC_SUPABASE_VIDEO_URL: process.env.NEXT_PUBLIC_SUPABASE_VIDEO_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SUPABASE_SECRET_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    // LIMITATION_CHAT_FREE: process.env.LIMITATION_CHAT_FREE,
    // LIMITATION_VISION_FREE: process.env.LIMITATION_VISION_FREE,
    // LIMITATION_NOTES_FREE: process.env.LIMITATION_NOTES_FREE,
    // LIMITATION_QUIZ_FREE: process.env.LIMITATION_QUIZ_FREE,
    // LIMITATION_CHAT_PREMIUM: process.env.LIMITATION_CHAT_PREMIUM,
    // LIMITATION_VISION_PREMIUM: process.env.LIMITATION_VISION_PREMIUM,
    // LIMITATION_NOTES_PREMIUM: process.env.LIMITATION_NOTES_PREMIUM,
    // LIMITATION_QUIZ_PREMIUM: process.env.LIMITATION_QUIZ_PREMIUM,
    NEXT_PUBLIC_MIDTRANS_PRODUCTION:
      process.env.NEXT_PUBLIC_MIDTRANS_PRODUCTION,
    NEXT_PUBLIC_MIDTRANS_CLIENT_KEY:
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    NEXT_PUBLIC_MIDTRANS_SNAP_URL: process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL,
    MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY, // Server-side only
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
