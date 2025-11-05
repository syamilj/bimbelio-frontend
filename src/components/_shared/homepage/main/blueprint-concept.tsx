'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Brain,
  CheckCircle,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const BlueprintConcept: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();
  const pathname = usePathname();

  // Get dynamic colors
  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#5aa4dd');

  const blueprintSteps = [
    {
      step: 1,
      title: 'Target Jelas',
      subtitle: '200+ poin naik minimal',
      description:
        'Goal kita jelas: bantu kamu naik minimal 200 poin dari hasil tes awal. Bukan sekadar janji motivasi, tapi sistem yang terukur!',
      icon: <Target className="w-8 h-8" />,
      gradient: `from-[${mainColor}] to-[${mainColor}80]`,
      features: [
        'Target 200+ poin improvement nyata',
        'Roadmap 3 Kurikulum Inti harian',
        'Progress tracking terarah',
      ],
      emotion: 'hopeful',
    },
    {
      step: 2,
      title: 'Diagnosis Tepat',
      subtitle: 'Tau kelemahan dalam 90 menit',
      description:
        'Nggak perlu belajar semua materi dulu. Diagnosis ini kasih tau kamu persis kurikulum mana yang lemah—jadi belajar langsung terarah!',
      icon: <Brain className="w-8 h-8" />,
      gradient: `from-[${secondaryColor}] to-[${secondaryColor}80]`,
      features: [
        'Fokus 3 Kurikulum Inti',
        'Analisis tipe & pola soal',
        'Roadmap personal langsung',
      ],
      emotion: 'analytical',
    },
    {
      step: 3,
      title: 'Progress Tracking',
      subtitle: 'Monitor kenaikan real-time',
      description:
        'Progress kamu dari tes awal terus dimonitor. Setiap strategi yang dipakai, hasilnya langsung kelihatan—goal 200 poin bukan angan-angan.',
      icon: <TrendingUp className="w-8 h-8" />,
      gradient: `from-emerald-500 to-[${mainColor}]`,
      features: [
        'Progress check mingguan terarah',
        'Dashboard improvement jelas',
        'Strategy adjustment otomatis',
      ],
      emotion: 'confident',
    },
    {
      step: 4,
      title: 'Tutor Elite + Tryout',
      subtitle: 'Lulusan Top 3 & Medalis Olimpiade',
      description:
        'Belajar langsung dari lulusan ITB, UI, UGM dengan IPK 3.8+ dan medalis olimpiade nasional & internasional. Plus tryout yang dirancang berdasarkan pengalaman real mereka!',
      icon: <Trophy className="w-8 h-8" />,
      gradient: 'from-amber-500 to-orange-500',
      features: [
        'Lulusan ITB, UI, UGM dengan segudang prestasi',
        'Medalis Olimpiade Nasional & Internasional',
        'Tryout berdasarkan pengalaman elite mentors',
      ],
      emotion: 'competitive',
    },
    {
      step: 5,
      title: 'Community Support',
      subtitle: 'Berjuang bareng yang sama',
      description:
        'Nggak sendirian. Ada komunitas yang sama-sama punya goal naik 200+ poin. Saling support, sharing tips, dan celebrating progress bersama.',
      icon: <Users className="w-8 h-8" />,
      gradient: 'from-red-500 to-pink-500',
      features: [
        'Community fokus goal yang sama',
        'Mentors dengan track record proven',
        'Daily tips praktis & actionable',
      ],
      emotion: 'supportive',
    },
  ];

  return (
    <section className="py-24 px-4 bg-gray-50 relative overflow-hidden">
      {/* Emotional Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl"
          style={{ backgroundColor: mainColor }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: `${mainColor}80` }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Emotional Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge
            variant="outline"
            className="mb-6 px-6 py-2 text-sm font-semibold text-white border-none items-center gap-2 mx-auto"
            style={{ backgroundColor: mainColor }}
          >
            <TrendingUp className="w-5 h-5" />
            Semua Terukur & Terarah
          </Badge>

          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
            Progress kamu dari tes awal akan
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${mainColor}aa)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              terus dimonitor
            </span>
          </h2>

          <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              Setiap strategi yang dipakai, hasilnya langsung kelihatan
            </span>
            —goal 200 poin naik bukan angan-angan.
            <br />
            <span
              className="font-bold bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${mainColor}aa)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Jadi, nggak ada lagi belajar ngawang atau buang waktu ke materi
              yang nggak penting!
            </span>
          </p>

          {/* Emotional Stats */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {[
              {
                value: '2,847',
                label: 'Alumni yang Terbukti',
                icon: <GraduationCap className="w-8 h-8" />,
              },
              {
                value: '200+',
                label: 'Poin Naik Minimal',
                icon: <TrendingUp className="w-8 h-8" />,
              },
              {
                value: '3',
                label: 'Kurikulum Inti Aja',
                icon: <Zap className="w-8 h-8" />,
              },
              {
                value: '90',
                label: 'Hari Sistematis',
                icon: <Clock className="w-8 h-8" />,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              >
                <div
                  className="text-3xl mb-2 flex justify-center"
                  style={{ color: mainColor }}
                >
                  {stat.icon}
                </div>
                <div
                  className="text-2xl md:text-3xl font-black mb-1"
                  style={{ color: mainColor }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div> */}
        </motion.div>

        {/* Blueprint Steps */}
        <div className="space-y-16">
          {blueprintSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content Side */}
              <div className="flex-1 space-y-6">
                {/* Step Badge */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white font-black text-lg`}
                  >
                    {step.step}
                  </div>
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider"
                  >
                    Step {step.step} of 5
                  </Badge>
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p
                    className="text-xl font-bold mb-4"
                    style={{ color: mainColor }}
                  >
                    {step.subtitle}
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {step.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle
                        className="w-5 h-5 flex-shrink-0 mt-1"
                        style={{ color: mainColor }}
                      />
                      <span className="text-gray-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Side */}
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative group"
                >
                  <div
                    className="rounded-3xl p-12 text-white relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-24 h-24 border-2 border-white rounded-full"></div>
                      <div className="absolute bottom-4 left-4 w-16 h-16 border border-white rounded-full"></div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-white rounded-full"></div>
                    </div>

                    {/* Icon */}
                    <div className="relative z-10 text-center">
                      <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        {step.icon}
                      </div>

                      <h4 className="text-2xl font-black mb-4">{step.title}</h4>

                      {/* Mini Progress */}
                      <div className="bg-white/20 rounded-full p-4">
                        <div className="text-sm font-bold mb-2">
                          Progress Simulator
                        </div>
                        <div className="h-2 bg-white/30 rounded-full">
                          <div
                            className="h-2 bg-white rounded-full transition-all duration-1000"
                            style={{ width: `${(step.step / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emotional CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div
            className="rounded-3xl p-12 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${mainColor}80)`,
            }}
          >
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent)]"></div>

            <div className="relative z-10">
              <h3 className="text-3xl md:text-5xl font-black text-white mb-6">
                Siap Jadi yang{' '}
                <span
                  className="bg-white px-2 py-1 rounded-xl font-black"
                  style={{
                    color: mainColor,
                  }}
                >
                  Naik 200+ Poin
                </span>{' '}
                Berikutnya?
              </h3>
              <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed">
                Ribuan anak udah membuktikan kalau{' '}
                <span className="font-bold text-white">sistem ini work</span>.
                Mereka yang awalnya stuck, sekarang naik 200+ poin dengan cara
                tercepat & terukur.
                <br />
                <span
                  className="font-bold px-2 py-1 rounded-xl"
                  style={{ background: 'white', color: mainColor }}
                >
                  Kapan giliran kamu?
                </span>
              </p>

              <Button
                size="lg"
                className="text-xl font-bold px-12 py-6 rounded-2xl shadow-2xl hover:scale-105 transition-all duration-300"
                style={{
                  backgroundColor: mainColor,
                  color: 'white',
                }}
                onClick={() => router.push('/price')}
              >
                <Zap className="w-6 h-6 mr-3" />
                Mulai Sistem terukur
                <ArrowRight className="w-6 h-6 ml-3" />
              </Button>
              <div className="mt-6 text-white text-sm">
                3 Kurikulum Inti • Fokus Tipe & Pola • 200+ Poin Guaranteed
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlueprintConcept;
