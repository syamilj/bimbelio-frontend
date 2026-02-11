'use client';

import BimInsight from '@/app/(main)/[web_sub_category]/(user)/user/biminsight/page';
import { SelectUser } from '../../_components/select-user';

export default function LearningAnalyticsAdmin() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="relative">
        <SelectUser />
      </div>
      <BimInsight />
    </div>
  );
}
