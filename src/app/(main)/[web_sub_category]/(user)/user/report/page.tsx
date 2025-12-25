import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import ReportClient from './_components/ReportClient';

export const metadata: Metadata = {
  title: 'Report | Bimbelio',
  description: 'Lihat laporan lengkap progres belajar kamu',
};

export default function ReportPage() {
  return <ReportClient />;
}
