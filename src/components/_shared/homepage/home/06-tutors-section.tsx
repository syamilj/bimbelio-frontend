'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Brain, GraduationCap, Sparkles, Users } from 'lucide-react';

interface Layer {
  layer: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface Tutor {
  name: string;
  university: string;
  major: string;
  quote: string;
  badge: string;
  color: string;
}

export default function TutorsSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  const isMainLandingPage =
    typeof window !== 'undefined' && window.location.pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');
  const secondaryColor = isMainLandingPage
    ? '#5aa4dd'
    : (websiteSubCategory?.secondary_color ?? '#7C3AED');

  // 3 Layers System
  const layers: Layer[] = [
    {
      layer: 'LAYER 1',
      title: 'TUTOR',
      description: 'Ngajar materi & strategi soal',
      icon: <GraduationCap className="w-8 h-8" />,
      color: '#0091FF',
    },
    {
      layer: 'LAYER 2',
      title: 'MENTOR',
      description: 'Bimbingan strategis 360°',
      icon: <Users className="w-8 h-8" />,
      color: '#00C853',
    },
    {
      layer: 'LAYER 3',
      title: 'AI',
      description: 'Support instant 24/7',
      icon: <Sparkles className="w-8 h-8" />,
      color: '#9C27B0',
    },
  ];

  // Tutors data - placeholder dengan data dummy
  const tutors: Tutor[] = [
    {
      name: 'Rafi Mahendra',
      university: 'UI 2024',
      major: 'Teknik Elektro',
      quote:
        'Aku dulu juga struggle di Fisika, tapi akhirnya nemu cara yang works!',
      badge: 'UI 2024',
      color: '#0091FF',
    },
    {
      name: 'Rafi Mahendra',
      university: 'UI 2024',
      major: 'Teknik Elektro',
      quote:
        'Aku dulu juga struggle di Fisika, tapi akhirnya nemu cara yang works!',
      badge: 'UI 2024',
      color: '#FFA500',
    },
    {
      name: 'Rafi Mahendra',
      university: 'UI 2024',
      major: 'Teknik Elektro',
      quote:
        'Aku dulu juga struggle di Fisika, tapi akhirnya nemu cara yang works!',
      badge: 'UI 2024',
      color: '#00C853',
    },
    {
      name: 'Rafi Mahendra',
      university: 'UI 2024',
      major: 'Teknik Elektro',
      quote:
        'Aku dulu juga struggle di Fisika, tapi akhirnya nemu cara yang works!',
      badge: 'UI 2024',
      color: '#E91E63',
    },
    {
      name: 'Rafi Mahendra',
      university: 'UI 2024',
      major: 'Teknik Elektro',
      quote:
        'Aku dulu juga struggle di Fisika, tapi akhirnya nemu cara yang works!',
      badge: 'UI 2024',
      color: '#9C27B0',
    },
    {
      name: 'Rafi Mahendra',
      university: 'UI 2024',
      major: 'Teknik Elektro',
      quote:
        'Aku dulu juga struggle di Fisika, tapi akhirnya nemu cara yang works!',
      badge: 'UI 2024',
      color: '#0091FF',
    },
  ];

  return (
    <section
      id="tutors"
      className="py-24 px-4 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            className="mb-6 px-6 py-2 text-sm font-bold text-white border-none"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Users className="w-4 h-4 mr-2 inline" />
            3-Layer Support System
          </Badge>

          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Platform Canggih —
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tapi Siapa Yang Ngajarin?
            </span>
          </h2>

          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            <span className="font-bold">Tools doang nggak cukup.</span> Kamu
            butuh human support yang beneran paham struggle kamu. Ada Tutor yang
            ngajar materi, Mentor yang bimbing strategi, dan AI yang support
            24/7. Ini bukan cuma "ngajar" — ini{' '}
            <span
              className="font-bold"
              style={{ color: mainColor }}
            >
              mentoring 360°
            </span>
            .
          </p>
        </motion.div>

        {/* 3 Layers System */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {layers.map((layer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-md transition-all duration-300 border-2 border-gray-100"
            >
              {/* Top Accent Bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  backgroundColor: layer.color,
                }}
              />

              <div className="p-6">
                {/* Icon */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${layer.color}, ${layer.color}dd)`,
                  }}
                >
                  {layer.icon}
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                      <p
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: layer.color }}
                      >
                        {layer.layer}
                      </p>
                      <div
                        className="h-1 w-1 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">
                      {layer.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {layer.description}
                    </p>
                  </div>

                  {/* Divider */}
                  <div
                    className="h-0.5 w-12 rounded-full"
                    style={{ backgroundColor: layer.color + '40' }}
                  />

                  {/* Info Box */}
                  <div
                    className="rounded-2xl p-3"
                    style={{
                      backgroundColor: layer.color + '10',
                      border: `1.5px solid ${layer.color}30`,
                    }}
                  >
                    <p className="text-xs font-semibold text-gray-700 text-center">
                      {index === 0 && 'Live Class & Video Content'}
                      {index === 1 && 'Strategic Guidance & Planning'}
                      {index === 2 && 'Instant Help Anytime'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tutors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900">
                Layer 1: Tim Tutor Bimbelio
              </h3>
              <Badge
                className="mt-1 px-3 py-1 text-xs font-bold text-white border-none"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                6 Tutor • Fresh Graduates 2024
              </Badge>
            </div>
          </div>

          <p className="text-base text-gray-600 mb-10 max-w-3xl">
            Mereka yang bakal ngajar materi UTBK di live class & livestream.
            Fresh graduates dari UI/UGM/ITB 2024 — relate-able bantu
            struggle-mu.
          </p>

          {/* Tutors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Top Accent Bar */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: tutor.color }}
                />

                {/* Top Section with Color - Image Placeholder */}
                <div
                  className="h-48 flex items-end justify-center p-6 relative"
                  style={{
                    background: `linear-gradient(135deg, ${tutor.color}, ${tutor.color}dd)`,
                  }}
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-black shadow-md"
                      style={{
                        backgroundColor: 'white',
                        color: tutor.color,
                      }}
                    >
                      {tutor.badge}
                    </span>
                  </div>

                  {/* Image Placeholder */}
                  <div className="w-32 h-32 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white border-2 border-white border-opacity-30 shadow-md">
                    <Brain className="w-12 h-12" />
                  </div>
                </div>

                {/* Bottom Section with Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-xl font-black text-gray-900 mb-1">
                      {tutor.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <GraduationCap
                        className="w-4 h-4"
                        style={{ color: tutor.color }}
                      />
                      <p className="text-sm font-bold text-gray-600">
                        {tutor.major}
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <div
                    className="p-4 rounded-2xl border-2"
                    style={{
                      backgroundColor: tutor.color + '08',
                      borderColor: tutor.color + '30',
                    }}
                  >
                    <p className="text-sm text-gray-700 italic leading-relaxed">
                      "{tutor.quote}"
                    </p>
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
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div
            className="rounded-3xl p-8 max-w-4xl mx-auto border-2 shadow-md"
            style={{
              borderColor: `${mainColor}30`,
              background: `linear-gradient(to right, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            <div className="mb-4 flex items-center justify-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <Users className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900">
                3 Layers of Support
              </h4>
            </div>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              <span className="font-black text-gray-900">
                Tutor ngajar, Mentor bimbing, AI selalu ada
              </span>{' '}
              — kamu nggak akan struggle sendirian lagi. Sistem 3 layer ini yang
              bikin Bimbelio beda dari bimbel lain.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md"
                style={{
                  backgroundColor: layers[0].color + '15',
                  border: `1.5px solid ${layers[0].color}30`,
                  color: layers[0].color,
                }}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Live Teaching</span>
              </div>
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md"
                style={{
                  backgroundColor: layers[1].color + '15',
                  border: `1.5px solid ${layers[1].color}30`,
                  color: layers[1].color,
                }}
              >
                <Users className="w-4 h-4" />
                <span>Personal Guidance</span>
              </div>
              <div
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-md"
                style={{
                  backgroundColor: layers[2].color + '15',
                  border: `1.5px solid ${layers[2].color}30`,
                  color: layers[2].color,
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Assistant</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
