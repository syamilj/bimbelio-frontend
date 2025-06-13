'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Award, BookOpen, Calculator, School, Target } from 'lucide-react';
import Link from 'next/link';

export default function UTBKSIMAKPredictor() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-main rounded-2xl mb-6">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistem Prediksi Kelulusan
            </h1>
            <h2 className="text-lg text-main font-semibold mb-4">
              UTBK + SIMAK UI
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hitung kemungkinan kelulusan seleksi masuk UI dengan menggabungkan
              nilai UTBK (50%) dan SIMAK UI (50%)
            </p>
          </div>
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-center items-center">
                <Link href={'prediction/step'}>
                  <Button>Mulai</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}

const STEPS = [
  {
    id: 1,
    title: 'Pilih Jurusan',
    description: 'Pilih jurusan yang diinginkan',
    icon: School,
  },
  {
    id: 2,
    title: 'Input UTBK',
    description: 'Masukkan nilai 7 subtes UTBK',
    icon: BookOpen,
  },
  {
    id: 3,
    title: 'Input SIMAK',
    description: 'Masukkan hasil Try Out SIMAK UI',
    icon: Target,
  },
  {
    id: 4,
    title: 'Hasil Prediksi',
    description: 'Lihat prediksi kelulusan per jurusan',
    icon: Award,
  },
];
