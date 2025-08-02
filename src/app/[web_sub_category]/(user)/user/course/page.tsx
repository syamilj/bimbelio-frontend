import { METADATA_USER } from '@/config/metadata';
import { pixel } from '@/lib/pixel/_core';
import { Metadata } from 'next';
import { useEffect } from 'react';
import AlurPembelajaranSection from './_components/alur-pembelajaran';
import CaraBelajarSection2 from './_components/cara-belajar2';
import ModulPembelajaranSection from './_components/modul-pembelajaran';
import PanduanLanjutanSection from './_components/panduan-lanjutan';

export const metadata: Metadata = {
  ...METADATA_USER.course,
};

export default function Course() {
  useEffect(() => {
    pixel.meta.track('ViewContent', { content_name: 'Course Page' });
    pixel.tiktok.track('ViewContent', { content_name: 'Course Page' });
  }, []);
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-6 space-y-16">
        <ModulPembelajaranSection />
        <CaraBelajarSection2 />
        <AlurPembelajaranSection />
        <PanduanLanjutanSection />
      </div>
    </main>
  );
}
