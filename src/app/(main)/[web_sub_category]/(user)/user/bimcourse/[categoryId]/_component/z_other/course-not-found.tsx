import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Home,
  MessageCircle,
  Search,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import HeaderCourse from './header';

export default function CourseNotFound() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#4C94FF';

  const quickActions = [
    {
      title: 'Jelajahi Course',
      description: 'Akses berbagai materi pembelajaran yang tersedia',
      icon: <BookOpen className="w-6 h-6" />,
      gradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      href: `/${website_sub_category_id_params}/user/bimcourse`,
    },
    {
      title: 'Try Out',
      description: 'Uji kemampuan dengan berbagai latihan soal',
      icon: <Trophy className="w-6 h-6" />,
      gradient: 'from-green-500 to-green-600',
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      href: `/${website_sub_category_id_params}/user/bimarena/try-out`,
    },
    {
      title: 'AI Assistant',
      description: 'Dapatkan bantuan dari asisten AI',
      icon: <MessageCircle className="w-6 h-6" />,
      gradient: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      href: `/${website_sub_category_id_params}/user/bimcourse`,
    },
    {
      title: 'Beranda',
      description: 'Kembali ke halaman utama',
      icon: <Home className="w-6 h-6" />,
      gradient: 'from-orange-500 to-orange-600',
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      href: `/${website_sub_category_id_params}`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <HeaderCourse className="flex md:hidden" />

      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm hidden md:block">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-3xl flex items-center justify-center"
                style={{ backgroundColor: mainColor }}
              >
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Course Tidak Ditemukan
                </h1>
                <p className="text-sm text-gray-600">
                  Jelajahi pilihan lain yang tersedia
                </p>
              </div>
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
              className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Compass className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: mainColor }}
            >
              Oops! Course Tidak Ditemukan
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Course yang Kamu cari mungkin sudah tidak tersedia atau telah
              dipindahkan. Mari jelajahi opsi pembelajaran lainnya!
            </p>
          </motion.div>

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
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
                    Mulai Perjalanan Belajar
                  </CardTitle>
                  <p className="text-gray-600 text-lg">
                    Pilih salah satu opsi di bawah untuk melanjutkan
                    pembelajaran
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="group"
                    >
                      <Link href={action.href}>
                        <Card
                          className={cn(
                            'border-2 transition-all duration-300 hover:shadow-xl cursor-pointer relative overflow-hidden h-full',
                            action.bgColor,
                            action.borderColor,
                          )}
                        >
                          {/* Shimmer effect on hover */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />

                          <CardHeader className="flex items-center space-y-0 pb-3 relative z-10">
                            <div
                              className={cn(
                                'w-14 h-14 rounded-3xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110',
                                `bg-linear-to-br ${action.gradient}`,
                              )}
                            >
                              <div className="text-white">{action.icon}</div>
                            </div>
                          </CardHeader>
                          <CardContent className="relative z-10">
                            <h4 className="font-bold text-gray-900 mb-2 text-center group-hover:text-gray-800 transition-colors">
                              {action.title}
                            </h4>
                            <p className="text-sm text-gray-600 text-center leading-relaxed group-hover:text-gray-700 transition-colors mb-4">
                              {action.description}
                            </p>

                            <div className="flex items-center justify-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className={action.iconColor}>
                                Mulai Sekarang
                              </span>
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card
              className="max-w-2xl mx-auto border-2 rounded-3xl overflow-hidden shadow-lg"
              style={{ borderColor: `${mainColor}20` }}
            >
              <CardContent className="p-8 text-center">
                <div className="space-y-6">
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: mainColor }}
                    >
                      Butuh Bantuan?
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Tim support kami siap membantu Kamu menemukan course yang
                      tepat atau menyelesaikan masalah teknis
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Button
                      className="w-full h-12 rounded-3xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Hubungi Support
                    </Button>

                    <div className="text-sm text-gray-500">
                      📧 support@bimbelio.com • 📞 (021) 123-4567
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
