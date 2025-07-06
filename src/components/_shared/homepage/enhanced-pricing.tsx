'use client';

import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { motion } from 'framer-motion';
import { BookOpen, Check, Crown, Star, Trophy, Users, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const EnhancedPricing = () => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const router = useRouter();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const plans = [
    {
      name: 'Gratis',
      price: '0',
      originalPrice: null,
      period: 'Selamanya',
      description: 'Cocok untuk mencoba fitur dasar',
      badge: null,
      gradient: 'from-gray-500 to-gray-600',
      features: [
        { text: '3 Try Out per bulan', included: true },
        { text: '20 Chat AI per hari', included: true },
        { text: 'Materi dasar PTN & Kedinasan', included: true },
        { text: '5 Quiz per hari', included: true },
        { text: 'Analisis hasil basic', included: true },
        { text: 'Live class mingguan', included: false },
        { text: 'Mentor personal', included: false },
        { text: 'Download materi', included: false },
        { text: 'Priority support', included: false },
      ],
      popular: false,
      cta: 'Mulai Gratis',
      stats: { users: '10K+', satisfaction: '4.2/5' },
    },
    {
      name: 'Premium',
      price: '99.000',
      originalPrice: '199.000',
      period: 'per bulan',
      description: 'Terpopuler untuk persiapan serius',
      badge: 'TERPOPULER',
      gradient: `from-[${mainColor}] to-[${secondaryColor}]`,
      features: [
        { text: 'Unlimited Try Out', included: true },
        { text: 'Unlimited Chat AI', included: true },
        { text: 'Semua materi premium', included: true },
        { text: 'Unlimited Quiz & Notes', included: true },
        { text: 'Analisis mendalam + AI Insights', included: true },
        { text: 'Live class 3x seminggu', included: true },
        { text: 'Mentor personal dedicated', included: true },
        { text: 'Download semua materi', included: true },
        { text: 'Priority support 24/7', included: true },
      ],
      popular: true,
      cta: 'Upgrade Premium',
      stats: { users: '50K+', satisfaction: '4.9/5' },
    },
    {
      name: 'Elite',
      price: '299.000',
      originalPrice: '599.000',
      period: 'per bulan',
      description: 'All-in-one untuk hasil maksimal',
      badge: 'BEST VALUE',
      gradient: 'from-purple-500 to-pink-600',
      features: [
        { text: 'Semua fitur Premium', included: true },
        { text: 'Private mentoring 1-on-1', included: true },
        { text: 'Custom study plan', included: true },
        { text: 'Simulasi ujian real-time', included: true },
        { text: 'Akses exclusive webinar', included: true },
        { text: 'Grup belajar eksklusif', included: true },
        { text: 'Career counseling', included: true },
        { text: 'Garansi lulus atau uang kembali', included: true },
        { text: 'Dedicated account manager', included: true },
      ],
      popular: false,
      cta: 'Pilih Elite',
      stats: { users: '5K+', satisfaction: '5.0/5' },
    },
  ];

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'AI-Powered Learning',
      description: 'Pembelajaran adaptif dengan teknologi GPT-4 terdepan',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Live Mentoring',
      description: 'Bimbingan langsung dari mentor berpengalaman',
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Materi Lengkap',
      description: '10.000+ soal dan materi terupdate',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Proven Results',
      description: '95% tingkat kelulusan siswa kami',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah',
      role: 'Lolos STAN 2024',
      text: 'AI tutor Bimbelio membantu saya memahami kelemahan dan fokus belajar. Hasilnya luar biasa!',
      rating: 5,
      avatar: '👩‍🎓',
    },
    {
      name: 'Andi',
      role: 'Lolos UI 2024',
      text: 'Try out rutin dan analisis mendalam membuat saya lebih percaya diri menghadapi UTBK.',
      rating: 5,
      avatar: '👨‍🎓',
    },
    {
      name: 'Maya',
      role: 'Lolos IPDN 2024',
      text: 'Live class dan mentor personal benar-benar game changer untuk persiapan kedinasan.',
      rating: 5,
      avatar: '👩‍💼',
    },
  ];

  return (
    <section
      id="pricing"
      className="py-16 md:py-24 relative overflow-hidden"
    >
      {/* Enhanced Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ backgroundColor: secondaryColor }}
        />
      </div>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <span
              className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 text-sm font-bold text-white shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Crown className="w-4 h-4" />
              PAKET BERLANGGANAN
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <AnimatedGradientText>
              Pilih Paket yang Tepat untuk Impianmu
            </AnimatedGradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Investasi terbaik untuk masa depan cerah. Mulai dari gratis hingga
            paket premium dengan fitur lengkap.
          </p>

          {/* Special Offer Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold shadow-lg">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span>🔥 Diskon 50% - Terbatas untuk 100 pendaftar pertama!</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: plan.popular ? 1.02 : 1.01 }}
              className="h-full"
            >
              <Card
                className={`h-full relative overflow-hidden border-2 rounded-3xl transition-all duration-500 ${
                  plan.popular
                    ? 'shadow-2xl border-transparent scale-105'
                    : 'shadow-lg border-gray-200 hover:shadow-xl'
                }`}
                style={{
                  background: plan.popular
                    ? `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`
                    : 'white',
                }}
              >
                {/* Popular Badge */}
                {plan.badge && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    <div
                      className="px-6 py-2 rounded-full font-bold text-white text-sm shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      {plan.badge}
                    </div>
                  </div>
                )}

                <CardHeader className="text-center p-8 relative">
                  {/* Plan Icon */}
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: plan.popular
                        ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                        : plan.gradient,
                    }}
                  >
                    {index === 0 && <Star className="w-8 h-8 text-white" />}
                    {index === 1 && <Crown className="w-8 h-8 text-white" />}
                    {index === 2 && <Trophy className="w-8 h-8 text-white" />}
                  </div>

                  {/* Plan Details */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <span
                        className="text-4xl md:text-5xl font-black"
                        style={{ color: mainColor }}
                      >
                        Rp{plan.price}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          Rp{plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">/{plan.period}</p>
                    {plan.originalPrice && (
                      <div className="inline-flex px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-bold">
                        Hemat 50%!
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="font-bold text-green-600">
                        {plan.stats.users}
                      </div>
                      <div className="text-xs text-gray-500">Pengguna</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-yellow-600">
                        {plan.stats.satisfaction}
                      </div>
                      <div className="text-xs text-gray-500">Rating</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-0 space-y-6">
                  {/* Features List */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            feature.included ? 'bg-green-100' : 'bg-gray-100'
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${
                              feature.included
                                ? 'text-green-600'
                                : 'text-gray-400'
                            }`}
                          />
                        </div>
                        <span
                          className={`text-sm ${
                            feature.included ? 'text-gray-900' : 'text-gray-400'
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      className={`w-full py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 ${
                        plan.popular
                          ? 'text-white'
                          : 'border-2 bg-white hover:bg-gray-50'
                      }`}
                      style={{
                        background: plan.popular
                          ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                          : 'white',
                        borderColor: plan.popular ? 'transparent' : mainColor,
                        color: plan.popular ? 'white' : mainColor,
                      }}
                      onClick={() => {
                        if (!session) {
                          // Handle auth
                          return;
                        }
                        router.push(
                          `${website_sub_category_id}/user/dashboard`,
                        );
                      }}
                    >
                      {plan.cta}
                    </Button>
                  </motion.div>

                  {/* Money Back Guarantee */}
                  {plan.popular && (
                    <div className="text-center text-sm text-gray-600 mt-4">
                      💰 Garansi uang kembali 30 hari
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Mengapa Memilih Bimbelio?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <div style={{ color: mainColor }}>{feature.icon}</div>
                </div>
                <h4 className="font-bold text-gray-900">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-12">
            Apa Kata Mereka yang Sudah Berhasil?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="border-2 border-gray-100 rounded-2xl p-6 h-full">
                  <CardContent className="p-0 space-y-4">
                    <div className="flex justify-center">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="w-5 h-5 text-yellow-400 fill-current"
                          />
                        ),
                      )}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.text}"</p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="text-3xl">{testimonial.avatar}</div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedPricing;
