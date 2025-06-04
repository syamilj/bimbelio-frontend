import AlurPembelajaranSection from '@/components/_shared/course/alur-pembelajaran';
import CaraBelajarSection2 from '@/components/_shared/course/cara-belajar2';

import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import HeaderSection from './_components/header-section';
import ModulPembelajaranSection from './_components/modul-pembelajaran';
import PanduanLanjutanSection from './_components/panduan-lanjutan';

export const metadata: Metadata = {
  ...METADATA_USER.course,
};

export default function Course() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto px-4 space-y-12">
        <HeaderSection />
        <ModulPembelajaranSection />
        <CaraBelajarSection2 />
        <AlurPembelajaranSection />
        <PanduanLanjutanSection />
      </div>
    </main>
  );
}
