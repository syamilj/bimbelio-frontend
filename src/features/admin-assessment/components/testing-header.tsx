'use client';

import { AdminPageHeader } from '@/features/admin/components/admin-page-header';
import { adminPath, useTrackId } from '@/lib/track';

export function TestingHeader() {
  const trackId = useTrackId();
  return (
    <AdminPageHeader
      back={{ href: adminPath(trackId, 'tryout'), label: 'Daftar try out' }}
      meta="mode uji coba"
      title="Uji coba try out"
      description="Coba alur pengerjaan try out persis seperti yang dilihat siswa, sebelum dipublikasikan."
    />
  );
}
