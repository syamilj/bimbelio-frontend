import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  Brain,
  Clock,
  Crown,
  FileText,
  Lock,
  Shield,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import ButtonPayment from '../../../../_components/button-payment';

export default function CourseLocked() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const premiumFeatures = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: 'Materi Eksklusif',
      description: 'Akses materi premium yang tidak tersedia di course gratis',
      gradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI Tutor Cerdas',
      description: 'Bimbingan personal 24/7 dengan teknologi AI terdepan',
      gradient: 'from-green-500 to-green-600',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Smart Notes',
      description: 'Fitur catatan cerdas dengan sinkronisasi AI',
      gradient: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: 'Quiz Adaptif',
      description: 'Latihan soal yang menyesuaikan kemampuan Anda',
      gradient: 'from-orange-500 to-orange-600',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Sertifikat Resmi',
      description: 'Dapatkan sertifikat yang diakui industri',
      gradient: 'from-yellow-500 to-yellow-600',
      iconColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Akses Selamanya',
      description: 'Belajar kapan saja tanpa batas waktu',
      gradient: 'from-indigo-500 to-indigo-600',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: mainColor }}
              >
                <Lock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Course Premium
                </h1>
                <p className="text-sm text-gray-600">
                  Upgrade untuk membuka akses
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <ButtonPayment
                type="modal"
                className="rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-white"
              >
                Upgrade Sekarang
              </ButtonPayment>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div
              className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Crown className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: mainColor }}
            >
              Konten Premium Terkunci
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Dapatkan akses unlimited ke semua fitur premium dan percepat
              perjalanan belajar Anda
            </p>

            {/* Special Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              <span>Hemat hingga 40% - Penawaran Terbatas!</span>
              <Star className="w-5 h-5 fill-current" />
            </motion.div>
          </motion.div>

          {/* Premium Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader
                className="text-center pb-6 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
                }}
              >
                <div className="relative z-10">
                  <CardTitle
                    className="text-2xl md:text-3xl font-bold mb-2"
                    style={{ color: mainColor }}
                  >
                    Fitur Premium Eksklusif
                  </CardTitle>
                  <p className="text-gray-600 text-lg">
                    Mengapa ribuan siswa memilih premium?
                  </p>
                </div>

                {/* Decorative elements */}
                <div
                  className="absolute -right-8 -top-8 w-20 h-20 rounded-full opacity-10"
                  style={{ backgroundColor: mainColor }}
                />
                <div
                  className="absolute -left-6 -bottom-6 w-16 h-16 rounded-full opacity-10"
                  style={{ backgroundColor: secondaryColor }}
                />
              </CardHeader>

              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {premiumFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="group"
                    >
                      <Card
                        className={cn(
                          'border-2 transition-all duration-300 hover:shadow-xl cursor-pointer relative overflow-hidden',
                          feature.bgColor,
                          feature.borderColor,
                        )}
                      >
                        {/* Shimmer effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />

                        <CardHeader className="flex items-center space-y-0 pb-3 relative z-10">
                          <div
                            className={cn(
                              'w-14 h-14 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110',
                              `bg-gradient-to-br ${feature.gradient}`,
                            )}
                          >
                            <div className="text-white">{feature.icon}</div>
                          </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                          <h4 className="font-bold text-gray-900 mb-2 text-center group-hover:text-gray-800 transition-colors">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <Card
              className="max-w-2xl mx-auto border-2 rounded-2xl overflow-hidden shadow-lg"
              style={{ borderColor: `${mainColor}20` }}
            >
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <Crown className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: mainColor }}
                    >
                      Siap Upgrade ke Premium?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Bergabung dengan ribuan siswa yang sudah merasakan
                      pengalaman belajar premium
                    </p>
                  </div>

                  <div className="space-y-4">
                    <ButtonPayment
                      type="modal"
                      className="w-full h-14 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 text-white"
                    >
                      <Crown className="w-6 h-6 mr-2" />
                      Upgrade ke Premium Sekarang
                    </ButtonPayment>

                    <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        <span>Pembayaran Aman</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Akses Instan</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>Garansi 30 Hari</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
