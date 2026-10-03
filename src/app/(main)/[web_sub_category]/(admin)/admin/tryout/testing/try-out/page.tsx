import TryoutHomepage from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/try-out/page';
import { TestingHeader } from '@/features/admin-assessment/components/testing-header';
import { Suspense } from 'react';

/**
 * Uji coba try out: memakai halaman siswa apa adanya (milik area siswa),
 * sehingga admin melihat alur yang sama persis. Pengerjaan dibuka layar
 * penuh di `testing/try-out/[id]`.
 */
export default function TestingTryoutHomepage() {
  return (
    <div className="flex flex-col gap-6">
      <TestingHeader />
      <Suspense>
        <TryoutHomepage />
      </Suspense>
    </div>
  );
}
