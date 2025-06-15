import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, Crown, MessageCircle, Zap } from 'lucide-react';
import ButtonPayment from '../../../../_components/button-payment';

export default function CourseLocked() {
  return (
    <>
      <div className="flex-1 flex flex-col max-w-[1000px] mx-auto">
        {/* <header className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Course Premium</h1>
              <p className="text-yellow-100">
                Akses pembelajaran eksklusif dengan mentor terbaik
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-sm text-yellow-200 mb-1">Hemat hingga</p>
              <p className="text-2xl font-bold text-white">40%</p>
            </div>
          </div>
        </header> */}

        {/* Main Content */}
        <main className="flex-1 p-8 ">
          <div className="max-w-7xl mx-auto">
            {/* Premium Benefits Banner */}
            <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hidden md:block">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Keuntungan Member Premium
                      </h3>
                      <p className="text-gray-600">
                        Berlangganan untuk membuka akses unlimited ke semua
                        course premium
                      </p>
                    </div>
                  </div>
                  <ButtonPayment
                    type="modal"
                    className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold"
                  >
                    Upgrade Sekarang
                  </ButtonPayment>
                </div>
              </CardContent>
            </Card>

            {/* Locked Content Card */}
            <div className="flex justify-center mb-12">
              <Card className="max-w-2xl w-full text-center border-2 border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="py-16 px-8">
                  <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Crown className="w-10 h-10 text-yellow-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Konten Premium Terkunci
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Halaman ini berisi course premium eksklusif. Berlangganan
                    sekarang untuk mengakses semua materi pembelajaran terbaik.
                  </p>
                  <div className="flex w-full justify-center">
                    <ButtonPayment
                      type="modal"
                      className="bg-yellow-500 hover:bg-yellow-400 text-white font-semibold"
                    >
                      Upgrade Sekarang
                    </ButtonPayment>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Premium Features Section */}
            <Card className="p-4">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Mengapa Memilih Premium?
                </CardTitle>
                <p className="text-gray-600">
                  Dapatkan pengalaman belajar terbaik dengan fitur eksklusif
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Materi Eksklusif
                    </h4>
                    <p className="text-sm text-gray-600">
                      Akses materi premium yang tidak tersedia di course gratis
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      AI Tutor
                    </h4>
                    <p className="text-sm text-gray-600">
                      Bimbingan cerdas 24/7 dengan teknologi AI terdepan
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Sertifikat Resmi
                    </h4>
                    <p className="text-sm text-gray-600">
                      Dapatkan sertifikat yang diakui industri
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Akses Selamanya
                    </h4>
                    <p className="text-sm text-gray-600">
                      Belajar kapan saja tanpa batas waktu
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
