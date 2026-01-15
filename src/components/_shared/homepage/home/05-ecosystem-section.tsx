'use client';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Clock,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  Zap,
} from 'lucide-react';

export default function EcosystemSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Color variants
  const color05 = mainColor + '0D';

  // Ecosystem items - connected network style
  const ecosystemItems = [
    {
      id: 1,
      title: 'Live Class',
      description: 'Interaktif & real-time',
      icon: Video,
      color: '#3B82F6',
      category: 'Belajar',
    },
    {
      id: 2,
      title: 'AI Mentor',
      description: '24/7 instant help',
      icon: Sparkles,
      color: '#3B82F6',
      category: 'Belajar',
    },
    {
      id: 3,
      title: 'Video Library',
      description: 'On-demand, kapan saja',
      icon: Clock,
      color: '#3B82F6',
      category: 'Belajar',
    },
    {
      id: 4,
      title: 'Tryout CBT',
      description: 'Semua ujian tersedia',
      icon: Zap,
      color: '#8B5CF6',
      category: 'Latihan',
    },
    {
      id: 5,
      title: 'Progress Track',
      description: 'Analytics real-time',
      icon: TrendingUp,
      color: '#8B5CF6',
      category: 'Latihan',
    },
    {
      id: 6,
      title: 'Weak Point',
      description: 'Identifikasi & improve',
      icon: BarChart3,
      color: '#8B5CF6',
      category: 'Latihan',
    },
    {
      id: 7,
      title: 'Discord Groups',
      description: 'Study bersama teman',
      icon: MessageCircle,
      color: '#10B981',
      category: 'Komunitas',
    },
    {
      id: 8,
      title: 'Alumni Network',
      description: 'Mentorship dari PTN',
      icon: Users,
      color: '#10B981',
      category: 'Komunitas',
    },
    {
      id: 9,
      title: 'Peer Support',
      description: 'Bantuan dari sesama',
      icon: Sparkles,
      color: '#10B981',
      category: 'Komunitas',
    },
  ];

  // Group by category for layout
  const byCategory = {
    Belajar: ecosystemItems.filter((item) => item.category === 'Belajar'),
    Latihan: ecosystemItems.filter((item) => item.category === 'Latihan'),
    Komunitas: ecosystemItems.filter((item) => item.category === 'Komunitas'),
  };

  return (
    <section
      id="ecosystem"
      className="relative overflow-hidden bg-white py-20"
    >
      {/* Background Elements - Subtle Network */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 h-full w-full opacity-5"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="dots"
              x="50"
              y="50"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="50"
                cy="50"
                r="2"
                fill={mainColor}
              />
            </pattern>
          </defs>
          <rect
            width="1000"
            height="1000"
            fill="url(#dots)"
          />
        </svg>
        <div
          className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full opacity-8 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-20 text-center">
          <Badge
            className="mb-6 border-none px-6 py-2 text-sm font-bold text-white"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            Ekosistem Terkoneksi
          </Badge>

          <h2 className="mb-6 text-4xl font-black text-gray-900 md:text-5xl">
            Tools yang Saling Terhubung —
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Satu Ekosistem Utuh
            </span>
          </h2>

          <p className="mx-auto max-w-3xl text-base text-gray-600 leading-relaxed md:text-lg">
            Belajar, latihan, dan komunitas — semua terkoneksi dalam satu
            sistem.
            <span className="font-bold text-gray-900">
              {' '}
              Nggak perlu buka-buka aplikasi berbeda.
            </span>
          </p>
        </div>

        {/* Network Grid */}
        <div className="relative">
          {/* Connecting Lines SVG */}
          <svg
            className="absolute inset-0 h-full w-full -z-1 opacity-20"
            style={{ pointerEvents: 'none' }}
          >
            {/* Horizontal lines connecting items */}
            <line
              x1="25%"
              y1="200"
              x2="75%"
              y2="200"
              stroke={mainColor}
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <line
              x1="25%"
              y1="450"
              x2="75%"
              y2="450"
              stroke="#8B5CF6"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <line
              x1="25%"
              y1="700"
              x2="75%"
              y2="700"
              stroke="#10B981"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            {/* Vertical connecting lines */}
            <line
              x1="50%"
              y1="200"
              x2="50%"
              y2="900"
              stroke={mainColor}
              strokeWidth="0.5"
              opacity="0.3"
            />
          </svg>

          {/* Items Grid - 3x3 Network */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {ecosystemItems.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col items-center"
              >
                {/* Connection Node */}
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 w-2 h-2 rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: item.color }}
                />

                {/* Card */}
                <div
                  className="w-full rounded-3xl border-2 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:border-opacity-100 text-center hover:-translate-y-1"
                  style={{
                    borderColor: item.color + '40',
                    backgroundColor: item.color + '03',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-3xl text-white shadow-md"
                    style={{ backgroundColor: item.color }}
                  >
                    <item.icon
                      className="h-6 w-6"
                      strokeWidth={2}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-black text-gray-900 mb-1">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-xs font-semibold mb-3"
                    style={{ color: item.color }}
                  >
                    {item.description}
                  </p>

                  {/* Category Badge */}
                  <div className="flex justify-center">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div
            className="mx-auto max-w-3xl rounded-3xl border-2 p-8 shadow-lg"
            style={{
              backgroundColor: color05,
              borderColor: mainColor + '30',
            }}
          >
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              <span className="font-bold text-gray-900">
                Semua tools terkoneksi seamlessly.
              </span>{' '}
              Data dari latihan → langsung bisa dilihat progress di analytics.
              Alumni feedback → integrated dengan tutor system. Satu ekosistem,
              unlimited potential.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
