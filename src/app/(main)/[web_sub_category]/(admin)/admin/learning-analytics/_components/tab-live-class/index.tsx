'use client';

import { SectionTitle } from '@/app/(main)/[web_sub_category]/(user)/user/biminsight2/_components/section-title';
import { BookOpen } from 'lucide-react';
import { useState } from 'react';
import { SectionDetail } from './section-detail';
import { SectionPerformance } from './section-performance';
import { SectionTable } from './section-table';

export default function LiveClassAnalyticsAdmin() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div>
      <SectionTitle
        icon={BookOpen}
        title="BimLive"
      />
      <div className="mb-8">
        <SectionTable setSelectedId={setSelectedId} />
      </div>
      <div className="mb-8">
        <SectionPerformance />
      </div>
      <div
        id="section-liveclass"
        className="mb-8"
      >
        <SectionDetail id={selectedId} />
      </div>
    </div>
  );
}
