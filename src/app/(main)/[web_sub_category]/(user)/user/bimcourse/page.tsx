import { METADATA_USER } from '@/config/metadata';
import { Metadata } from 'next';
import HeaderSection from './_components/header-section';
import ModulPembelajaranSection from './_components/modul-pembelajaran';

export const metadata: Metadata = {
  ...METADATA_USER.course,
};

export default function Course() {
  return (
    <>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Hero Header Section */}
        <HeaderSection />
      </div>

      {/* Course Modules Section - Full Width for Horizontal Scroll */}
      <section className="mb-12">
        <ModulPembelajaranSection />
      </section>
    </>
  );
}
