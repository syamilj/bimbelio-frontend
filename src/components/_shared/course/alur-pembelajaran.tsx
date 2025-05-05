import { Card, CardContent } from '@/components/ui/card';

export function AlurPembelajaranSection() {
  return (
    <section className="space-y-6 pt-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
          Alur Pembelajaran Bimbelio
        </h2>
        <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4"></div>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Lalui setiap tahap, dan lihat bagaimana perkembanganmu naik pesat!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            number: '1',
            title: 'Pengenalan UTBK & SNBT',
            description:
              'Pelajari format, struktur, dan strategi dasar menghadapi ujian SNBT.',
          },
          {
            number: '2',
            title: 'Fondasi Penalaran Umum',
            description:
              'Kuasai konsep logika & analisis sebagai landasan berpikir kritis.',
          },
          {
            number: '3',
            title: 'Teknik Membaca Efektif',
            description:
              'Tingkatkan kecepatan dan pemahaman baca untuk teks kompleks.',
          },
          {
            number: '4',
            title: 'Strategi Penalaran Kuantitatif',
            description:
              'Selesaikan soal matematika & kuantitatif dengan cepat dan tepat.',
          },
          {
            number: '5',
            title: 'Pemahaman Bacaan Kritis',
            description:
              'Asah kemampuan menelaah & mengevaluasi berbagai tipe teks.',
          },
          {
            number: '6',
            title: 'Pengetahuan & Pemahaman Umum',
            description:
              'Perluas wawasan sains, sosial, dan isu kontemporer untuk SNBT.',
          },
          {
            number: '7',
            title: 'Literasi Bahasa Indonesia',
            description:
              'Dalami analisis teks & tata bahasa Indonesia yang sering keluar.',
          },
          {
            number: '8',
            title: 'Literasi Bahasa Inggris',
            description:
              'Tingkatkan kemampuan membaca teks dan pemahaman grammar.',
          },
          {
            number: '9',
            title: 'Latihan Soal Terpadu',
            description:
              'Kombinasi soal logika, matematika, dan literasi dalam satu sesi.',
          },
          {
            number: '10',
            title: 'Simulasi Tryout SNBT',
            description:
              'Uji kesiapanmu dengan simulasi ujian mendekati kondisi real.',
          },
          {
            number: '11',
            title: 'Review & Analisis Hasil',
            description:
              'Identifikasi kelemahan & perkuat area yang masih perlu peningkatan.',
          },
          {
            number: '12',
            title: 'Persiapan Akhir',
            description:
              'Tips final & manajemen waktu untuk menghadapi hari-H SNBT.',
          },
        ].map((item, index) => (
          <LearningPathCard
            key={index}
            {...item}
          />
        ))}
      </div>
    </section>
  );
}

export default function LearningPathCard({ number, title, description }: any) {
  return (
    <Card className="shadow-sm hover:shadow-sm transition-shadow">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-center sm:flex-row sm:items-center space-x-0 sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="bg-main/10 text-main font-semibold p-3 rounded-full">
              <span className="text-lg">{number}</span>
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
