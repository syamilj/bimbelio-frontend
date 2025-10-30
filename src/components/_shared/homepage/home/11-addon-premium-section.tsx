'use client';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Award, Circle, Info, Plus, Target, UserPlus } from 'lucide-react';

export default function AddOnPremiumSection() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Color variants
  const color20 = mainColor + '33';
  const color10 = mainColor + '1A';
  const color05 = mainColor + '0D';

  // Core program features (reminder box)
  const coreFeatures = ['198+ sesi live lengkap', 'TO IRT berkala'];

  // Add-on packages
  const packages = [
    {
      type: 'OPSIONAL',
      typeLabel: 'Tambahan Sesi Personal',
      icon: UserPlus,
      name: 'Konseling 1-on-1 Extra',
      price: 'Rp. 199.000',
      priceNote: 'per sesi (60 menit)',
      color: '#3B82F6',
      isPremium: false,
      features: [
        'Konsultasi jurusan tambahan',
        'Review hasil TO personal',
        'Custom study plan',
        'Motivasi & mindset coaching',
      ],
      note: 'Note: Program utama udah include konseling regular',
    },
    {
      type: 'OPSIONAL',
      typeLabel: 'Tryout Tambahan',
      icon: Target,
      name: 'Paket TO Extra',
      price: 'Rp. 199.000',
      priceNote: '5 TO IRT-based',
      color: '#3B82F6',
      isPremium: false,
      features: [
        '5 Tryout tambahan',
        'Analisis detail + notes',
        'Prediksi peluang lolos',
        'Rekomendasi materi',
      ],
      note: 'Note: Program utama udah include TO berkala',
    },
    {
      type: 'PREMIUM',
      typeLabel: 'Garansi Lolos atau Gratis',
      icon: Award,
      name: 'Success Guarantee',
      price: 'Rp. 1.499.000',
      priceNote: 'per sesi (60 menit)',
      color: '#F59E0B',
      isPremium: true,
      features: [
        'Program lengkap + garansi',
        'Konseling unlimited',
        'TO unlimited',
        'Nggak lolos = gratis tahun depan',
      ],
      note: 'Note: Investment terbaik dengan jaminan',
    },
  ];

  return (
    <section
      id="addon"
      className="relative overflow-hidden bg-white py-20"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-0 right-0 h-[600px] w-[600px] rounded-full opacity-10 blur-3xl"
          style={{ backgroundColor: '#F59E0B' }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-6 flex justify-center">
            <Badge
              className="rounded-full px-6 py-2 text-sm font-semibold"
              style={{
                backgroundColor: '#F59E0B',
                color: 'white',
              }}
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Layanan Tambahan
            </Badge>
          </div>

          <h2 className="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">
            Program Utama Udah Lengkap — <br />
            <span className="bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">
              Tapi Kalau Mau Hasil Maksimal?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-lg text-gray-600 md:text-xl">
            Paket kamu udah dapat{' '}
            <span className="font-semibold text-gray-900">
              PRINTS System + 3-Layer Support + semua platform
            </span>
            . Tapi kalau kamu mau{' '}
            <span className="font-semibold text-gray-900">
              dukungan ekstra intensif atau jaminan kelulusan
            </span>
            , ada add-on premium yang bisa kamu pilih sesuai kebutuhan.
          </p>
        </motion.div>

        {/* Reminder Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div
            className="mx-auto max-w-4xl rounded-3xl border-2 p-8 shadow-lg"
            style={{
              backgroundColor: color05,
              borderColor: color20,
            }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: mainColor }}
              >
                <Circle className="h-5 w-5 fill-white text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                Reminder: Program Utama Udah ALL-IN!
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Repeat 3 times for the 3 columns */}
              {[0, 1, 2].map((colIndex) => (
                <div
                  key={colIndex}
                  className="space-y-3"
                >
                  {coreFeatures.map((feature, idx) => (
                    <div
                      key={`${colIndex}-${idx}`}
                      className="flex items-center gap-2"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-400">
                        <div className="h-3 w-3 rounded-full bg-white" />
                      </div>
                      <p className="text-sm font-medium text-gray-700">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div
              className="mt-6 border-t pt-4"
              style={{ borderColor: color20 }}
            >
              <p className="text-center text-sm italic text-gray-600">
                <span className="font-semibold text-gray-900">
                  Jadi kalau mau hemat, program utama aja udah cukup banget!
                </span>{' '}
                Add-on ini cuma kalau mau ekstra push.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Layanan Tambahan Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-400">
              <span className="text-xl">⭐</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Layanan Tambahan (Kalau Mau):
            </h3>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="group relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-lg transition-all duration-300 hover:border-gray-300 hover:shadow-2xl"
              >
                {/* Header Badge */}
                <div
                  className="p-6 pb-4"
                  style={{
                    backgroundColor: pkg.isPremium ? '#F59E0B' : pkg.color,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <pkg.icon
                        className="h-6 w-6 text-white"
                        strokeWidth={2}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold uppercase tracking-wide text-white/90">
                        {pkg.type}
                      </p>
                      <p className="text-sm font-medium text-white">
                        {pkg.typeLabel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Package Name */}
                  <h4 className="mb-4 text-xl font-bold text-gray-900">
                    {pkg.name}
                  </h4>

                  {/* Price Box */}
                  <div
                    className="mb-6 rounded-2xl p-4"
                    style={{
                      backgroundColor: pkg.isPremium ? '#1E293B' : pkg.color,
                    }}
                  >
                    <p className="text-3xl font-bold text-white">{pkg.price}</p>
                    <p className="mt-1 text-sm text-white/80">
                      {pkg.priceNote}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="mb-6 space-y-3">
                    {pkg.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2"
                      >
                        <div
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                          style={{
                            backgroundColor: pkg.isPremium
                              ? '#1E293B20'
                              : `${pkg.color}20`,
                          }}
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{
                              backgroundColor: pkg.isPremium
                                ? '#1E293B'
                                : pkg.color,
                            }}
                          />
                        </div>
                        <p className="text-sm text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>

                  {/* Note */}
                  <div
                    className="rounded-2xl p-4"
                    style={{
                      backgroundColor: pkg.isPremium
                        ? '#1E293B10'
                        : `${pkg.color}10`,
                    }}
                  >
                    <p
                      className="text-xs italic"
                      style={{
                        color: pkg.isPremium ? '#1E293B' : pkg.color,
                      }}
                    >
                      {pkg.note}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <div
            className="mx-auto max-w-4xl rounded-3xl border-2 p-8 text-center shadow-lg"
            style={{
              backgroundColor: 'white',
              borderColor: color20,
            }}
          >
            <div className="mb-4 flex justify-center">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full"
                style={{ backgroundColor: color20 }}
              >
                <Info
                  className="h-6 w-6"
                  style={{ color: mainColor }}
                />
              </div>
            </div>
            <h4 className="mb-3 text-xl font-bold text-gray-900">
              Butuh Bantuan Pilih Paket yang Tepat?
            </h4>
            <p className="mb-6 text-gray-600">
              Tim kami siap bantu kamu tentukan paket mana yang paling sesuai
              dengan kondisi dan target kamu. Konsultasi gratis!
            </p>
            <button
              className="rounded-full px-8 py-3 font-semibold text-white transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: mainColor,
              }}
            >
              Konsultasi Sekarang
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
