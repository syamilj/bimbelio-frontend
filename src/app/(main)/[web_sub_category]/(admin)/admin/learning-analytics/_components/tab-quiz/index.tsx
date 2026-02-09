import { SectionTitle } from '@/app/(main)/[web_sub_category]/(user)/user/biminsight2/_components/section-title';
import { Target } from 'lucide-react';
import { useState } from 'react';
import { SectionDetail } from './section-detail';
import { SectionTable } from './section-table';

export default function QuizAnalyticsAdmin() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimArena - Quiz"
      />
      <div className="mb-8">
        <SectionTable setSelectedId={setSelectedId} />
      </div>

      <div
        id="section-volume"
        className="mb-8"
      >
        <SectionDetail id={selectedId} />
      </div>
    </div>
  );
}
