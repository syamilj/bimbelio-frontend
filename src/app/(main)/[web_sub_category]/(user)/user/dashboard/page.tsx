import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import DashboardClient from './_components/DashboardClient';

export const metadata: Metadata = {
  ...METADATA_USER.dashboard,
};

export default function DashboardPage() {
  return <DashboardClient />;
}
