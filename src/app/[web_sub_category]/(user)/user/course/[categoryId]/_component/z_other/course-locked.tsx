import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Award,
  BookOpen,
  Crown,
  MessageCircle,
  Sparkles,
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
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      title: 'Materi Eksklusif',
      description: 'Akses materi premium yang tidak tersedia di course gratis',
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      title: 'AI Tutor',
      description: 'Bimbingan cerdas 24/7 dengan teknologi AI terdepan',
      gradient: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      title: 'Sertifikat Resmi',
      description: 'Dapatkan sertifikat yang diakui industri',
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-600" />,
      title: 'Akses Selamanya',
      description: 'Belajar kapan saja tanpa batas waktu',
      gradient: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto p-4 md:p-8">
        {/* Premium Benefits Banner */}
        <Card className="mb-8 bg-white shadow-lg border-0 rounded-2xl overflow-hidden hidden md:block">
          <CardContent className="p-6">
            <div
              className="flex items-center justify-between p-6 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
              }}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <Crown className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ color: mainColor }}
                  >
                    Keuntungan Member Premium
                  </h3>
                  <p className="text-gray-600">
                    Berlangganan untuk membuka akses unlimited ke semua course
                    premium
                  </p>
                </div>
              </div>
              <ButtonPayment
                type="modal"
                className="rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-white"
              >
                Upgrade Sekarang
              </ButtonPayment>
            </div>
          </CardContent>
        </Card>

        {/* Main Locked Content Card */}
        <div className="flex justify-center mb-12">
          <Card className="max-w-2xl w-full text-center bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardHeader
              className="pb-6 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
              }}
            >
              <div className="relative z-10">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <Crown className="w-10 h-10 text-white" />
                </div>
                <CardTitle
                  className="text-2xl font-bold mb-2"
                  style={{ color: mainColor }}
                >
                  Konten Premium Terkunci
                </CardTitle>
                <p className="text-gray-600 max-w-md mx-auto">
                  Halaman ini berisi course premium eksklusif. Berlangganan
                  sekarang untuk mengakses semua materi pembelajaran terbaik.
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

            <CardContent className="py-8 px-6">
              <div className="space-y-6">
                {/* Special offer badge */}
                <Badge
                  className="text-white border-0 px-4 py-2 rounded-full font-medium"
                  style={{ backgroundColor: '#f59e0b' }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Hemat hingga 40%
                </Badge>

                <ButtonPayment
                  type="modal"
                  className="w-full rounded-xl px-8 py-4 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 text-white"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade Sekarang
                </ButtonPayment>

                <p className="text-xs text-gray-500">
                  💳 Pembayaran aman & terpercaya
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Premium Features Section */}
        <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-6">
            <CardTitle
              className="text-2xl font-bold mb-2"
              style={{ color: mainColor }}
            >
              Mengapa Memilih Premium?
            </CardTitle>
            <p className="text-gray-600">
              Dapatkan pengalaman belajar terbaik dengan fitur eksklusif
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {premiumFeatures.map((feature, index) => (
                <Card
                  key={index}
                  className="border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                  style={{
                    backgroundColor: feature.bgColor,
                    borderColor: feature.borderColor.replace('border-', ''),
                  }}
                >
                  <CardHeader className="flex items-center space-y-0 pb-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${feature.gradient} shadow-sm`}
                    >
                      {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-bold text-gray-900 mb-2 text-center">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-gray-600 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mobile CTA */}
        <div className="md:hidden mt-8">
          <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
            <CardContent className="p-6 text-center">
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: mainColor }}
              >
                Upgrade ke Premium
              </h3>
              <p className="text-gray-600 mb-4 text-sm">
                Akses semua fitur premium dengan sekali klik
              </p>
              <ButtonPayment
                type="modal"
                className="w-full rounded-xl px-6 py-3 font-semibold shadow-lg text-white"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade Sekarang
              </ButtonPayment>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
