import { Card, CardContent } from '@/components/ui/card';
import {
  BotMessageSquareIcon,
  ChartColumnIcon,
  FileTextIcon,
  NotepadTextIcon,
} from 'lucide-react';

const supportFeatures = [
  {
    icon: <BotMessageSquareIcon className="size-8 text-main" />,
    title: 'Chat AI',
    description:
      'Dapatkan jawaban instan untuk pertanyaanmu kapan saja dengan asisten AI kami',
  },
  {
    icon: <NotepadTextIcon className="size-8 text-main" />,
    title: 'Note AI',
    description:
      'Buat dan kelola catatan dengan bantuan AI untuk pembelajaran yang lebih efektif',
  },
  {
    icon: <FileTextIcon className="size-8 text-main" />,
    title: 'Quiz AI',
    description:
      'Latihan soal yang menyesuaikan dengan tingkat kemampuan dan perkembanganmu',
  },
  {
    icon: <ChartColumnIcon className="size-8 text-main" />,
    title: 'Laporan Belajar',
    description:
      'Pantau perkembangan belajarmu dengan laporan dan analisis detail',
  },
];

export default function CaraBelajarSection2() {
  return (
    <section className="space-y-6 pt-8">
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-center">
          Fitur Pendukung Belajar
        </h2>
        <div className="w-20 h-1 bg-yellow-400 mx-auto mb-4"></div>
      </div>
      <div className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {supportFeatures.map((feature, index) => (
          <Card
            key={index}
            className="h-full hover:shadow-sm transition-shadow duration-300"
          >
            <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center space-y-3">
              <div className="size-12 sm:size-16 rounded-full bg-main/10 flex items-center justify-center">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-base sm:text-lg">
                {feature.title}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
