import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import LeaderboardClient from './_components/LeaderboardClient';

export const metadata: Metadata = {
  ...METADATA_USER.leaderboard,
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
