import { AppShell } from '@/components/layout/app/app-shell';
import ProviderOnBoarding from '@/components/provider/provider-on-boarding';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Belajar',
  description: 'Ruang belajar siswa Bimbelio',
  robots: { index: false },
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProviderOnBoarding>
      <AppShell>{children}</AppShell>
    </ProviderOnBoarding>
  );
}
