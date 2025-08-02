'use client';

import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { motion } from 'framer-motion';
import { Check, Crown, Sparkles, Star, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const PricingEnhanced = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const plans = [
    {
      name: 'Gratis',
      price: 'Rp0',
      period: '/bulan',
      description: 'Sempurna untuk memulai perjalanan belajar',
      features: [
        '50 Chat dengan AI',
        '20 Notes AI',
        '5 Quiz Generator',
        '10 Vision AI',
        'Try Out Terbatas',
        'Materi Dasar',
        'Community Support',
      ],
      limitations: [
        'Analisis Terbatas',
        'Fitur Premium Terkunci',
      ],
      cta: 'Mulai Gratis',
      popular: false,
      icon: <Sparkles className="w-6 h-6" />,
      gradient: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
    },
    {
      name: 'Premium',
      price: 'Rp99.000',
      originalPrice: 'Rp199.000',
      period: '/bulan',
      description: 'Solusi lengkap untuk sukses PTN & Kedinasan',
      features: [
        '2.000 Chat dengan AI',
        '200 Notes AI',
        '50 Quiz Generator', 
        '100 Vision AI',
        'Unlimited Try Out',
        'Semua Materi Premium',
        'Analisis Mendalam',
        'Prediksi Skor Akurat',
        'Live Class Exclusive',
        'Priority Support',
        'Progress Tracking',
        'Leaderboard Access',
      ],
      cta: 'Upgrade Premium',
      popular: true,
      icon: <Crown className="w-6 h-6" />,
      gradient: `from-[${mainColor}] to-[${secondaryColor}]`,
      bgColor: `bg-[${mainColor}]`,
      textColor: 'text-white',
      savings: '50%',
    },
  ];

  const features = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'AI-Powered Learning',
      description: 'Pembelajaran adaptif dengan teknologi GPT-4',
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: '95% Success Rate',
      description: 'Tingkat kelulusan terbukti tinggi',
    },
    {
      icon: <Crown className="w-5 h-5" />,
      title: 'Premium Support',
      description: 'Dukungan tutor ahli 24/7',
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
        {/* Enhanced Header */}
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
              Pilih Paket yang Tepat Untukmu
            </AnimatedGradientText>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Mulai dengan paket gratis atau upgrade ke premium untuk akses penuh ke semua fitur AI terdepan
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div
                    className="px-6 py-2 rounded-full text-white font-bold text-sm shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    🔥 PALING POPULER
                  </div>
                </div>
              )}

              <Card
                className={`h-full border-2 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 ${
                  plan.popular ? 'scale-105 shadow-2xl' : ''
                }`}
                style={{
                  borderColor: plan.popular ? mainColor : '#e5e7eb',
                }}
              >
                <CardHeader
                  className={`text-center relative overflow-hidden ${
                    plan.popular ? 'text-white' : 'text-gray-700'
                  }`}
                  style={{
                    background: plan.popular
                      ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                      : 'bg-gray-50',
                  }}
                >
                  {/* Background Pattern */}
                  {plan.popular && (
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
                      <div className="absolute bottom-8 left-8 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-200" />
                      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse animation-delay-500" />
                    </div>
                  )}

                  <div className="relative z-10 py-8">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                        plan.popular ? 'bg-white/20' : `bg-${mainColor}/10`
                      }`}
                    >
                      <div
                        style={{
                          color: plan.popular ? 'white' : mainColor,
                        }}
                      >
                        {plan.icon}
                      </div>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p
                      className={`text-sm ${
                        plan.popular ? 'text-white/80' : 'text-gray-600'
                      } mb-6`}
                    >
                      {plan.description}
                    </p>

                    {/* Pricing */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        {plan.originalPrice && (
                          <span
                            className={`text-lg line-through ${
                              plan.popular ? 'text-white/60' : 'text-gray-400'
                            }`}
                          >
                            {plan.originalPrice}
                          </span>
                        )}
                        {plan.savings && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            HEMAT {plan.savings}
                          </span>
                        )}
                      </div>
                      <div className="text-4xl font-black">
                        {plan.price}
                        <span className="text-lg font-normal">{plan.period}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, fIndex) => (
                      <div
                        key={fIndex}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${mainColor}20` }}
                        >
                          <Check
                            className="w-3 h-3"
                            style={{ color: mainColor }}
                          />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}

                    {/* Limitations */}
                    {plan.limitations?.map((limitation, lIndex) => (
                      <div
                        key={lIndex}
                        className="flex items-center gap-3 opacity-60"
                      >
                        <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                          <span className="text-gray-400 text-xs">✗</span>
                        </div>
                        <span className="text-gray-500 font-medium line-through">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  {session ? (
                    <Link
                      href={`${website_sub_category_id}/user/dashboard`}
                      className="block"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
                          plan.popular
                            ? 'text-white shadow-xl'
                            : 'text-white'
                        }`}
                        style={{
                          background: plan.popular
                            ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                            : `linear-gradient(135deg, ${mainColor}80, ${secondaryColor}80)`,
                        }}
                      >
                        {plan.cta}
                      </motion.button>
                    </Link>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
                        plan.popular
                          ? 'text-white shadow-xl'
                          : 'text-white'
                      }`}
                      style={{
                        background: plan.popular
                          ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                          : `linear-gradient(135deg, ${mainColor}80, ${secondaryColor}80)`,
                      }}
                    >
                      {plan.cta}
                    </motion.button>
                  )}

                  {/* Trust Indicators */}
                  {plan.popular && (
                    <div className="mt-6 text-center space-y-2">
                      <div className="flex items-center justify-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">4.9/5 rating</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Dipercaya oleh 15,000+ siswa
                      </p>
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
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900">
            Mengapa Memilih Bimbelio?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
                  className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <div style={{ color: mainColor }}>
                    {feature.icon}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h4>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Logo Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center justify-center gap-4 text-gray-500">
              <Image
                src="/logo.png"
                alt="Bimbelio Logo"
                width={32}
                height={32}
                className="opacity-60"
              />
              <span className="text-lg font-semibold">
                Dipercaya oleh ribuan siswa di seluruh Indonesia
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </section>
  );
};

export default PricingEnhanced;
