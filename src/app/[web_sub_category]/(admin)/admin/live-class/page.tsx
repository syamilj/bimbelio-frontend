import { Metadata } from 'next';
import { LiveClassDashboard } from './_components/live-class-dashboard';

export const metadata: Metadata = {
  title: 'Live Class Management - Admin Dashboard',
  description: 'Kelola live class, tutor, dan program pembelajaran',
};

export default function LiveClassPage() {
  return <LiveClassDashboard />;
}
