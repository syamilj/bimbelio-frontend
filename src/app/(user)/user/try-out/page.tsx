// src/app/(user)/dashboard/page.tsx

import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import TryOutClient from './_components/TryOutClient';

export const metadata: Metadata = {
  ...METADATA_USER.tryOut,
};

export default function TryOutPage() {
  return (
    <div>
      <TryOutClient />
    </div>
  );
}
