import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BimInsight | Bimbelio',
  description: 'Lihat laporan lengkap progres belajar kamu',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
