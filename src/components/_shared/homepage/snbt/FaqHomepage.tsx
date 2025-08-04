'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Brain,
  ChevronDown,
  Clock,
  MessageCircle,
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

  const filteredFAQs =
    activeCategory === 'all'
      ? faqData
      : faqData.filter((item) => item.category === activeCategory);

  const toggleExpanded = (id: number) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  return (
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
            Real questions dari students, honest answers dari kita. No bullshit,
            just facts yang lo butuhin buat decision.
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
          <AnimatePresence mode="wait">
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
          </AnimatePresence>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Masih Ada Pertanyaan?
            </h3>
            <p className="text-gray-600 mb-6">
              Chat langsung sama team kita! We're here to help you succeed.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
              Chat Sekarang
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
