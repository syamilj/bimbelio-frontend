'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Bimbelio } from '@/components/ui/bim-brand';
import { ArrowRight, MessageCircle, Rocket } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

const ConsultationDialog = dynamic(
  () => import('@/components/_shared/contact/consultation-dialog'),
  { ssr: false },
);

const CTASection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  return (
    <section className="py-16 md:py-24 px-5 relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${mainColor} 0%, ${mainColor}dd 100%)`,
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-white/10 blur-xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white/5" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-xs font-bold">
            <Rocket className="w-3.5 h-3.5" />
            MULAI PERJALANANMU
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Siap Lolos PTN Impian
            <br />
            <span className="text-white/80">
              Bareng <Bimbelio className="text-white" />?
            </span>
          </h2>

          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto">
            Ribuan siswa sudah membuktikan. Sekarang giliran kamu. Daftar
            sekarang dan mulai persiapanmu hari ini.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <Link
            href="/price"
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-base bg-white transition-all hover:bg-gray-50 hover:-translate-y-0.5 shadow-lg"
            style={{ color: mainColor }}
          >
            <span>Daftar Sekarang</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => setIsConsultationOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-base bg-white/10 text-white border border-white/30 transition-all hover:bg-white/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Konsultasi Gratis</span>
          </button>
        </div>
      </div>

      {/* Consultation Dialog */}
      {isConsultationOpen && (
        <ConsultationDialog
          isOpen={isConsultationOpen}
          onOpenChange={setIsConsultationOpen}
        />
      )}
    </section>
  );
};

export default CTASection;
