import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Semua URL backend diarahkan ke host fiktif. MSW menolak request yang tidak
// di-mock, jadi tes tidak mungkin menyentuh API/database produksi.
const TEST_ENV = {
  NEXT_PUBLIC_ENV: 'test',
  NEXT_PUBLIC_API_URL: 'http://api.test',
  NEXT_PUBLIC_SOCKET_URL: 'http://socket.test',
  NEXT_PUBLIC_SUPABASE_URL: 'http://storage.test',
  NEXT_PUBLIC_SUPABASE_UPLOAD_URL: 'http://storage-upload.test',
  NEXT_PUBLIC_SUPABASE_IMG_URL: 'http://storage.test/img',
  NEXT_PUBLIC_SUPABASE_IMG_TO_URL: 'http://storage.test/to-question',
  NEXT_PUBLIC_SUPABASE_DUMP_IMAGES_URL: 'http://storage.test/dump-images',
  NEXT_PUBLIC_SUPABASE_PDF_URL: 'http://storage-upload.test/pdf',
  NEXT_PUBLIC_SUPABASE_VIDEO_URL: 'http://storage-upload.test/video',
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: 'test-client-id',
};

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        url: 'http://localhost:3000',
        // Respons MSW tidak membawa header CORS; backend asli membawanya.
        settings: { fetch: { disableSameOriginPolicy: true } },
      },
    },
    env: TEST_ENV,
    setupFiles: ['./test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'test/unit/**/*.test.{ts,tsx}'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: [
        'src/lib/**',
        'src/components/patterns/**',
        'src/components/ui/**',
        'src/features/**',
      ],
    },
  },
});
