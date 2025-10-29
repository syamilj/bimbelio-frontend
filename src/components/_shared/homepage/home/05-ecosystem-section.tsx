'use client';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Bot,
  FileText,
  FolderKanban,
  Layers,
  Library,
  MessageCircle,
  Network,
  Podcast,
  Rocket,
  Target,
  Trophy,
  UserCheck,
  Users,
  Video,
  Zap,
} from 'lucide-react';

export default function EcosystemSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Color variants
  const color20 = mainColor + '33';
  const color10 = mainColor + '1A';
  const color05 = mainColor + '0D';

  // Journey phases
  const phases = [
    {
      icon: Rocket,
      title: 'Onboarding',
      subtitle: 'Hari Pertama',
      description: 'Tau posisi awal kamu',
      color: '#F59E0B',
      features: [
        { label: 'Diagnostic Test', badge: 'Langkah1', badgeColor: '#3B82F6' },
        {
          label: 'Personal Roadmap',
          badge: 'AI Planning',
          badgeColor: '#8B5CF6',
        },
        { label: 'Join Discord', badge: 'Community', badgeColor: '#10B981' },
      ],
    },
    {
      icon: BookOpen,
      title: 'Foundation',
      subtitle: 'Belajar Konsep',
      description: 'Build pemahaman kuat',
      color: '#F59E0B',
      features: [
        { label: 'Live Class', badge: 'Zoom Meet', badgeColor: '#3B82F6' },
        { label: 'Video Library', badge: 'LMS', badgeColor: '#8B5CF6' },
        { label: 'Tanya AI', badge: 'Chat 24/7', badgeColor: '#10B981' },
      ],
    },
    {
      icon: Target,
      title: 'Practice',
      subtitle: 'Latihan Soal',
      description: 'Drill sampai jago',
      color: '#F59E0B',
      features: [
        { label: 'Try Out', badge: 'Website + Rute', badgeColor: '#3B82F6' },
        {
          label: 'Drill Tactical',
          badge: 'Question Bank',
          badgeColor: '#8B5CF6',
        },
        { label: 'Progress Report', badge: 'Analytics', badgeColor: '#10B981' },
      ],
    },
    {
      icon: Zap,
      title: 'Intensive',
      subtitle: 'Final Push',
      description: 'Sprint ke finish line',
      color: '#F59E0B',
      features: [
        { label: 'Super Intensif', badge: 'Bootcamp', badgeColor: '#3B82F6' },
        { label: 'Mock Test', badge: 'CBT Sim', badgeColor: '#8B5CF6' },
        { label: 'Mental Prep', badge: 'Mentoring', badgeColor: '#10B981' },
      ],
    },
  ];

  // Platform cards
  const platforms = [
    {
      title: 'Learning Hub',
      icon: BookOpen,
      color: mainColor,
      items: [
        {
          icon: Video,
          title: 'Live Class & Livestream',
          description: 'Kelas real-time interaktif!',
          highlight: true,
        },
        {
          icon: Library,
          title: 'Video Library',
          description: 'Rekaman on-demand',
          highlight: false,
        },
        {
          icon: Bot,
          title: 'AI Mentor',
          description: 'Instant help 24/7',
          highlight: false,
        },
        {
          icon: Podcast,
          title: 'Podcast Series',
          description: 'Learning meets podcast',
          highlight: false,
        },
      ],
    },
    {
      title: 'Assessment Center',
      icon: BarChart3,
      color: mainColor,
      items: [
        {
          icon: FileText,
          title: 'Tryout Website',
          description: 'CBT simulation semua ujian',
          highlight: true,
        },
        {
          icon: BarChart3,
          title: 'Progress Dashboard',
          description: 'Track perkembangan',
          highlight: false,
        },
        {
          icon: Trophy,
          title: 'Analytics & Report',
          description: 'Weak points analysis',
          highlight: false,
        },
        {
          icon: Target,
          title: 'Ranking System',
          description: 'Tau posisi kamu',
          highlight: false,
        },
      ],
    },
    {
      title: 'Community & Support',
      icon: Users,
      color: mainColor,
      items: [
        {
          icon: MessageCircle,
          title: 'Discord Community',
          description: 'Study groups & voice channels',
          highlight: true,
        },
        {
          icon: UserCheck,
          title: '1-on-1 Konseling',
          description: 'Strategic guidance',
          highlight: false,
        },
        {
          icon: Network,
          title: 'Alumni Network',
          description: 'Mentorship dari senior PTN',
          highlight: false,
        },
        {
          icon: FolderKanban,
          title: 'Parent Portal',
          description: 'Laporan progress ke ortu',
          highlight: false,
        },
      ],
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            Ini dia sistem beraksi —{' '}
            <span
              className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
              }}
            >
              Ekosistem yang support kamu 24/7
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-base text-gray-600 md:text-lg">
            PRINTS System bukan cuma teori. Ini{' '}
            <span className="font-semibold text-gray-900">
              ekosistem lengkap
            </span>{' '}
            — dari diagnostic test, live class, tryout, AI mentor, sampai
            komunitas Discord.{' '}
            <span className="font-semibold text-gray-900">
              Semua tools udah siap, kamu tinggal pakai.
            </span>
          </p>
        </motion.div>

        {/* Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <div className="mb-8 text-center">
            <Badge
              className="mb-4 border-none px-6 py-2 text-sm font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              Journey Program
            </Badge>
            <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Journey Kamu: 4 Fase Sampai Lolos
            </h3>
          </div>
          <p className="mx-auto mb-12 max-w-3xl text-center text-gray-600">
            Dari hari pertama sampai H-Day ujian, setiap fase punya{' '}
            <span className="font-semibold text-gray-900">
              tools & support yang beda
            </span>
            . Ini bukan cuma belajar — tapi journey terstruktur yang support
            semua jenis ujian PTN & Kedinasan.
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, index) => (
              <motion.div
                key={phase.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 hover:border-gray-300 hover:shadow-2xl"
              >
                {/* Top Accent Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: phase.color }}
                />

                {/* Icon Box */}
                <div className="flex justify-center p-6 pb-4">
                  <div
                    className="flex h-24 w-24 items-center justify-center rounded-2xl shadow-lg"
                    style={{ backgroundColor: phase.color }}
                  >
                    <phase.icon
                      className="h-12 w-12 text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 p-6 pt-2">
                  <div className="text-center">
                    <div className="mb-2 flex items-center justify-center gap-2">
                      <div
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: phase.color }}
                      />
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {phase.subtitle}
                      </p>
                      <div
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: phase.color }}
                      />
                    </div>
                    <h4 className="text-xl font-black text-gray-900">
                      {phase.title}
                    </h4>
                    <p
                      className="mt-1 text-sm font-semibold"
                      style={{ color: phase.color }}
                    >
                      {phase.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className="mx-auto h-0.5 w-12 rounded-full"
                    style={{ backgroundColor: phase.color + '40' }}
                  />

                  {/* Features */}
                  <div className="space-y-3">
                    {phase.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-2 rounded-2xl bg-white p-3 transition-all duration-200 hover:bg-gray-100"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">
                            {feature.label}
                          </p>
                        </div>
                        <Badge
                          style={{
                            backgroundColor: feature.badgeColor + '15',
                            color: feature.badgeColor,
                            border: `1.5px solid ${feature.badgeColor}30`,
                          }}
                          className="shrink-0 text-xs font-bold"
                        >
                          {feature.badge}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Phase Number */}
                  <div className="pt-2 text-center">
                    <div
                      className="mx-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white"
                      style={{ backgroundColor: phase.color }}
                    >
                      {index + 1}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Platform Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-8 text-center">
            <Badge
              className="mb-4 border-none px-6 py-2 text-sm font-bold text-white"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Layers className="w-4 h-4 mr-2 inline" />
              Platform Ecosystem
            </Badge>
            <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Oke Timeline Udah Jelas —
              <br />
              <span style={{ color: mainColor }}>Tapi Belajar Dimana?</span>
            </h3>
          </div>
          <p className="mx-auto mb-12 max-w-3xl text-center text-gray-600">
            Lo nggak cuma "dapat kelas doang". Ada{' '}
            <span className="font-semibold text-gray-900">
              ekosistem lengkap
            </span>{' '}
            yang gue siapin — dari belajar, latihan, sampai komunitas. Semua
            tools buat execute PRINTS System ada di sini.
          </p>

          <div className="grid gap-6 lg:grid-cols-3">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 hover:border-gray-300 hover:shadow-2xl"
              >
                {/* Top Accent Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{
                    background: `linear-gradient(to right, ${mainColor}, ${secondaryColor})`,
                  }}
                />

                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-lg"
                      style={{ backgroundColor: mainColor }}
                    >
                      <platform.icon
                        className="h-8 w-8 text-white"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-black text-gray-900">
                        {platform.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {platform.items.length} Features Available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2 p-6 pt-0">
                  {platform.items.map((item, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl p-4 transition-all duration-300 ${
                        item.highlight
                          ? 'bg-gradient-to-br from-orange-50 to-orange-100 shadow-md'
                          : 'bg-white hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl shadow-md"
                          style={{
                            backgroundColor: item.highlight
                              ? '#F59E0B'
                              : mainColor,
                          }}
                        >
                          <item.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`font-bold leading-tight ${
                                item.highlight
                                  ? 'text-gray-900'
                                  : 'text-gray-800'
                              }`}
                            >
                              {item.title}
                            </p>
                            {item.highlight && (
                              <Badge
                                className="shrink-0 border-none text-xs font-bold"
                                style={{
                                  backgroundColor: '#F59E0B',
                                  color: 'white',
                                }}
                              >
                                CORE
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-gray-600">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Stats */}
                <div
                  className="border-t-2 p-4"
                  style={{
                    backgroundColor: color05,
                    borderColor: color10,
                  }}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">
                      Platform Status
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span
                        className="font-bold"
                        style={{ color: mainColor }}
                      >
                        Active & Ready
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div
            className="mx-auto max-w-4xl rounded-3xl border-2 p-8 shadow-md"
            style={{
              backgroundColor: color05,
              borderColor: color20,
            }}
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: mainColor }}
              >
                <Network className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">
                Ekosistem Lengkap Siap Pakai
              </h4>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              <span className="font-bold text-gray-900">Semua tools ini</span>{' '}
              udah siap pakai dari hari pertama. Kamu tinggal fokus belajar —
              kami yang siapin semua infrastruktur support-nya.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-md">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span style={{ color: mainColor }}>24/7 Available</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-md">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <span style={{ color: mainColor }}>Multi-Platform</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-md">
                <div className="h-2 w-2 rounded-full bg-purple-500" />
                <span style={{ color: mainColor }}>AI-Powered</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
