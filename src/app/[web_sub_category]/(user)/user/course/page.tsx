import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import HeaderSection from './_components/header-section';
import ModulPembelajaranSection from './_components/modul-pembelajaran';

export const metadata: Metadata = {
  ...METADATA_USER.course,
};

export default function Course() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Hero Header Section */}
        <HeaderSection />

        {/* Course Modules Section */}
        <section className="mb-12">
          <ModulPembelajaranSection />
        </section>
      </div>
    </main>
  );
}
