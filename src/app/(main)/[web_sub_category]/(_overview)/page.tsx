import { notFound } from 'next/navigation';

// /<track> belum punya halaman sendiri; area aplikasi ada di /<track>/user.
export default function TrackOverviewPage() {
  notFound();
}
