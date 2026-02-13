'use client';

import { SectionTitle } from '@/app/(main)/[web_sub_category]/(user)/user/biminsight/_components/section-title';
import { Target } from 'lucide-react';

// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { useState } from 'react';
import { SectionDetail } from './section-detail';
import { SectionPerformance } from './section-performance';
import { SectionTable } from './section-table';

export default function TryoutAnalyticsAdmin() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimArena - Tryout"
      />
      <div className="mb-8">
        <SectionTable setSelectedId={setSelectedId} />
      </div>
      <div className="mb-8">
        <SectionPerformance />
      </div>
      <div
        id="section-tryout"
        className="mb-8"
      >
        <SectionDetail id={selectedId} />
      </div>
    </div>
  );
}
