'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CONTACT_CONFIG } from '@/config/contact';
import { pixel } from '@/lib/pixel/_core';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  ChevronDown,
  Clock,
  MessageCircle,
  Phone,
  Target,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'blueprint' | 'tryout' | 'community';
}

const faqData: FAQItem[] = [
  // General Questions
  {
    id: 1,
    category: 'general',
    question: 'Gue bener-bener hopeless sama UTBK, bisa gak sih?',
    answer:
      'Listen up bro! Setiap hero punya starting point yang berbeda. Yang penting bukan seberapa jauh lo tertinggal, tapi seberapa committed lo untuk bangkit. Blueprint Bimbelio coba ngebantu ribuan anak yang feeling hopeless jadi top scorer. The journey starts ketika lo yakin!',
  },
  {
    id: 2,
    category: 'general',
    question: 'Berapa lama waktu yang dibutuhin buat naik skor?',
    answer:
      'Progress itu individual banget! Tapi dengan Blueprint method kita, kebanyakan students udah liat improvement signifikan dalam 2-4 minggu. Yang penting konsistensi sama ngikutin the system. No shortcuts, but definitely ada smart ways!',
  },
  {
    id: 3,
    category: 'general',
    question: 'Mahal gak sih? Ortu gue budget terbatas nih',
    answer:
      'We feel you! Makanya Bimbelio designed buat jadi investment terbaik dengan harga yang masuk akal. Dibanding bimbel offline yang jutaan, kita kasih value yang sama bahkan lebih dengan harga yang jauh lebih friendly. Plus, think about it - investasi sekarang vs ulang UTBK tahun depan?',
  },

  // Blueprint Questions
  {
    id: 4,
    category: 'blueprint',
    question: 'Blueprint concept itu gimana sih? Beda gak sama yang lain?',
    answer:
      "Blueprint itu game-changer! Bukan sekedar ngasih soal random. Kita diagnose weakness lo, bikin personal roadmap, track progress real-time, dan kasih arena practice yang challenging. It's like having GPS for your UTBK journey - tau persis kemana harus melangkah!",
  },
  {
    id: 5,
    category: 'blueprint',
    question: 'Target +200 poin itu realistic gak?',
    answer:
      '100% realistic! Data nunjukin students yang follow Blueprint method secara konsisten bisa dapat 150-300 poin improvement. Kunci utamanya: pretest untuk baseline, targeted practice pada weakness, dan konsisten evaluasi. No magic, just smart strategy!',
  },
  {
    id: 6,
    category: 'blueprint',
    question: 'Pretest itu wajib? Takut hasilnya jelek',
    answer:
      'Pretest itu starting line bukan finish line! Hasilnya jelek? Perfect! Itu artinya lo punya huge potential untuk berkembang. Pikirin itu sebagai diagnosis sebelum treatment. Dokter butuh tau kondisi lo dulu sebelum kasih obat kan?',
  },

  // Tryout Questions
  {
    id: 7,
    category: 'tryout',
    question: 'Arena Tryout itu serem gak? Bakal di-judge?',
    answer:
      'Arena itu safe space untuk growth! Everyone starts somewhere, dan komunitas kita super supportive. Yang penting bukan hasil sempurna, tapi konsisten dan rajin belajar. Plus, better gagal di arena daripada di UTBK asli kan?',
  },
  {
    id: 8,
    category: 'tryout',
    question: 'Berapa kali harus ikut tryout biar optimal?',
    answer:
      'Ideal nya 2-3x sebulan untuk jaga konsisten ketajaman. Tapi yang lebih penting quality over quantity. Focus pada analysis hasil tryout, identify pola kelasahan berulang, terus improve. Setiap tryout harusnya bikin kamu makin kuat dan tajam!',
  },

  // Community Questions
  {
    id: 9,
    category: 'community',
    question: 'Grup Telegram eksklusif itu ngapain aja?',
    answer:
      "Grup Telegram kita itu energy booster! Daily motivation, sharing strategies, tanya-jawab sama mentor, celebration milestones, bahkan late-night study sessions bareng. It's like having study buddies yang always got your back 24/7!",
  },
  {
    id: 10,
    category: 'community',
    question: 'Komunitas nya toxic gak? Takut competitive berlebihan',
    answer:
      "Zero tolerance untuk toxicity! Kita build positive competitive environment where everyone lifts each other up. Yes diantaranya pasti ada kompetisi, tapi harus dengan respect dan saling support. Remember: your success doesn't diminish others - we all can win!",
  },
];

const categories = [
  { id: 'all', label: 'Semua', icon: MessageCircle },
  { id: 'general', label: 'General', icon: Brain },
  { id: 'blueprint', label: 'Blueprint', icon: Target },
  { id: 'tryout', label: 'Tryout', icon: Clock },
  { id: 'community', label: 'Community', icon: Users },
];

export default function FaqHomepage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [isConsultationDialogOpen, setIsConsultationDialogOpen] =
    useState(false);

  const filteredFAQs =
    activeCategory === 'all'
      ? faqData
      : faqData.filter((item) => item.category === activeCategory);

  const toggleExpanded = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Pixel tracking function untuk konsultasi
  const trackContactEvent = (contactType: string) => {
    try {
      pixel.meta.track('Contact', {
        content_type: 'contact',
        content_name: contactType,
      });

      pixel.tiktok.track('Contact', {
        content_name: contactType,
        content_id: `contact_${contactType.toLowerCase()}`,
      });

      console.log(`📊 Pixel tracked: ${contactType} contact initiated`);
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }
  };

  // Handle consultation dialog open
  const handleConsultationClick = () => {
    try {
      pixel.meta.track('ViewContent', {
        content_type: 'page',
        content_name: 'Contact Modal from FAQ',
      });

      pixel.tiktok.track('ViewContent', {
        content_name: 'Contact Modal from FAQ',
        content_id: 'faq_contact_modal',
        page_path: '/faq-contact-modal',
      });

      console.log('📊 Pixel tracked: Contact dialog opened from FAQ');
    } catch (error) {
      console.warn('Pixel tracking error:', error);
    }

    setIsConsultationDialogOpen(true);
  };

  const consultationOptions = [
    {
      id: 'whatsapp',
      title: 'Chat WhatsApp',
      description: 'Respons cepat dalam 5 menit',
      icon: <MessageCircle className="w-5 h-5" />,
      action: () => {
        trackContactEvent('WhatsApp');
        const message = encodeURIComponent(CONTACT_CONFIG.whatsapp.message);
        window.open(
          `https://wa.me/${CONTACT_CONFIG.whatsapp.number}?text=${message}`,
          '_blank',
        );
        setIsConsultationDialogOpen(false);
      },
      color: '#25D366',
    },
    {
      id: 'phone',
      title: 'Telepon Langsung',
      description: 'Bicara dengan ahli sekarang',
      icon: <Phone className="w-5 h-5" />,
      action: () => {
        trackContactEvent('Phone');
        window.open(`tel:${CONTACT_CONFIG.phone.number}`, '_self');
        setIsConsultationDialogOpen(false);
      },
      color: '#0091FF',
    },
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MessageCircle className="w-4 h-4" />
              Tanya-Jawab Honest
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Questions yang{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Actually Matter
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Real questions dari students, honest answers dari kita. No
              bullshit, just facts yang lo butuhin buat decision.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300
                    ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 hover:scale-105'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </motion.div>

          {/* FAQ Items */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={`${activeCategory}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: expandedItem === item.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {expandedItem === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="h-px bg-gray-200 mb-4"></div>
                        <p className="text-gray-600 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA - Redesigned */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-16"
          >
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 shadow-xl max-w-4xl mx-auto border border-blue-100">
              {/* Header Section */}
              <div className="mb-8">
                <motion.div
                  initial={{ scale: 0.9 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
                >
                  <MessageCircle className="w-4 h-4" />
                  Konsultasi Gratis
                </motion.div>

                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Masih Ada{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Pertanyaan?
                  </span>
                </h3>

                <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Chat langsung sama team expert kita! Tim kami siap bantu kamu
                  dengan konsultasi personal{' '}
                  <span className="font-semibold text-blue-600">
                    100% gratis
                  </span>
                  untuk memulai journey PTN impianmu.
                </p>
              </div>

              {/* CTA Actions */}
              <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
                {/* Primary CTA - WhatsApp */}
                <motion.button
                  onClick={handleConsultationClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span>Chat WhatsApp Sekarang</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                {/* Secondary CTA - Telepon */}
                <motion.button
                  onClick={handleConsultationClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-blue-200 text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                >
                  <Phone className="w-6 h-6" />
                  <span>Telepon Langsung</span>
                </motion.button>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {CONTACT_CONFIG.stats.responseTime}
                  </div>
                  <div className="text-sm text-gray-600">Waktu Respons</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {CONTACT_CONFIG.stats.studentsServed}
                  </div>
                  <div className="text-sm text-gray-600">Siswa Terlayani</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {CONTACT_CONFIG.stats.satisfactionRate}
                  </div>
                  <div className="text-sm text-gray-600">Tingkat Kepuasan</div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    💡
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-semibold text-gray-900 text-base">
                      Blueprint Personal Strategy Session
                    </span>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      Dapatkan strategi belajar personal yang disesuaikan dengan
                      kondisi dan target PTN impianmu. Konsultasi langsung
                      dengan tim expert yang sudah membantu ribuan siswa
                      berhasil masuk PTN favorit!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Consultation Dialog */}
      <Dialog
        open={isConsultationDialogOpen}
        onOpenChange={setIsConsultationDialogOpen}
      >
        <DialogContent className="sm:max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col items-center justify-center">
          <DialogHeader className="pb-4 w-full">
            <DialogTitle className="text-center text-xl font-bold text-gray-900">
              Wujudkan Impian PTN-mu!
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 text-sm mt-2">
              Pilih langkah pertama untuk memulai journey menuju PTN idaman
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 w-full">
            {/* Konsultasi Langsung - 2 Columns Grid */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 text-center">
                💬 Konsultasi Langsung
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {consultationOptions.map((option) => (
                  <div
                    key={`consultation-${option.id}`}
                    className="w-full"
                  >
                    <Button
                      onClick={option.action}
                      className={cn(
                        'w-full h-auto p-3 rounded-xl text-center',
                        'flex flex-col items-center gap-2 bg-white border-2',
                        'hover:shadow-lg transition-all duration-300',
                        'hover:border-opacity-60 hover:bg-opacity-5 hover:scale-105',
                      )}
                      style={{
                        borderColor: `${option.color}30`,
                      }}
                      variant="outline"
                    >
                      {/* Icon */}
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: option.color }}
                      >
                        {option.icon}
                      </div>

                      {/* Content */}
                      <div className="text-center">
                        <h3 className="font-semibold text-gray-900 text-sm mb-1">
                          {option.title}
                        </h3>
                        <p className="text-xs text-gray-600 leading-tight px-1">
                          {option.description}
                        </p>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats - Compact Layout */}
            <div className="flex justify-center gap-4 text-center py-2">
              <div>
                <div className="font-bold text-base leading-tight text-blue-600">
                  {CONTACT_CONFIG.stats.responseTime}
                </div>
                <div className="text-xs text-gray-600">Response</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="font-bold text-base leading-tight text-blue-600">
                  {CONTACT_CONFIG.stats.studentsServed}
                </div>
                <div className="text-xs text-gray-600">Siswa</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="font-bold text-base leading-tight text-blue-600">
                  {CONTACT_CONFIG.stats.satisfactionRate}
                </div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="p-3 bg-gray-50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mt-0.5">
                  💡
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-gray-900 text-sm">
                    Blueprint Personal 100% Gratis
                  </span>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Tim kami akan membantu kamu bikin strategi belajar yang
                    tepat untuk mencapai target PTN idamanmu
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
