import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import {
  ArrowRight,
  BookOpen,
  MessageCircle,
  Search,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import HeaderCourse from './header';

export default function CourseNotFound() {
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const quickActions = [
    {
      title: 'Materi Pembelajaran',
      description: 'Akses berbagai materi pembelajaran yang tersedia',
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      href: `/${website_sub_category_id_params}/user/course`,
    },
    {
      title: 'Try Out',
      description: 'Uji kemampuan dengan berbagai latihan soal',
      icon: <Trophy className="w-5 h-5 text-green-600" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      href: `/${website_sub_category_id_params}/user/try-out`,
    },
    {
      title: 'AI Assistant',
      description: 'Dapatkan bantuan dari asisten AI',
      icon: <MessageCircle className="w-5 h-5 text-purple-600" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      href: `/${website_sub_category_id_params}/user/course`,
    },
  ];

  return (
    <div className="flex-1 flex flex-col absolute top-0 left-0 w-full h-full md:pl-[75px] overflow-y-auto bg-gray-50">
      <HeaderCourse className="flex md:hidden" />

      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-100 px-6 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold mb-1"
              style={{ color: mainColor }}
            >
              Belajar
            </h1>
            <p className="text-gray-600">Mulai perjalanan belajar Anda</p>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Main Not Found Card */}
          <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden mb-8">
            <CardHeader
              className="pb-6 relative overflow-hidden text-center"
              style={{
                background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
              }}
            >
              <div className="relative z-10">
                <div
                  className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <Search className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <CardTitle
                  className="text-xl md:text-2xl font-bold mb-2"
                  style={{ color: mainColor }}
                >
                  Course Tidak Ditemukan
                </CardTitle>
                <p className="text-gray-600 max-w-md mx-auto">
                  Anda belum memiliki course apapun. Mulai belajar dengan
                  menambahkan course pertama Anda.
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

            <CardContent className="py-8 px-6 text-center">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/${website_sub_category_id_params}/user/course`}>
                    <Button
                      className="rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
                      style={{
                        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                      }}
                    >
                      Jelajahi Course
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link
                    href={`/${website_sub_category_id_params}/user/dashboard`}
                  >
                    <Button
                      variant="outline"
                      className="rounded-xl px-6 py-3 font-semibold border-2 hover:shadow-sm transition-all duration-300"
                      style={{
                        borderColor: `${mainColor}40`,
                        color: mainColor,
                      }}
                    >
                      Ke Dashboard
                    </Button>
                  </Link>
                </div>

                <p className="text-xs text-gray-500">
                  💡 Mulai dengan course gratis yang tersedia
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="text-center">
              <h2
                className="text-xl md:text-2xl font-bold mb-2"
                style={{ color: mainColor }}
              >
                Mulai Perjalanan Belajar
              </h2>
              <p className="text-gray-600">
                Pilih salah satu opsi di bawah untuk memulai
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                >
                  <Card
                    className="border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 cursor-pointer group"
                    style={{
                      backgroundColor: action.bgColor,
                      borderColor: action.borderColor.replace('border-', ''),
                    }}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:shadow-md transition-all">
                        {action.icon}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {action.description}
                      </p>
                      <div className="mt-4 flex items-center justify-center text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                        <span>Mulai sekarang</span>
                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <Card className="mt-8 bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6 text-center">
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: mainColor }}
              >
                Butuh Bantuan?
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Tim support kami siap membantu Anda memulai perjalanan belajar
              </p>
              <Button
                variant="outline"
                className="rounded-xl border-2 hover:shadow-sm"
                style={{
                  borderColor: `${mainColor}30`,
                  color: mainColor,
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Hubungi Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
