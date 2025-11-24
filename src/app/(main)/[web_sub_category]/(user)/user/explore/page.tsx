// src/app/(user)/dashboard/page.tsx

import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import ExploreClient from './_components/ExploreClient';

export const metadata: Metadata = {
  ...METADATA_USER.explore,
};

export default function ExplorePage() {
  return (
    <div>
      <ExploreClient />
    </div>
  );
}
