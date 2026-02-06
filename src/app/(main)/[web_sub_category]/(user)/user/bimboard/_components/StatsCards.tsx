'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Clock, Target, TrendingUp, Trophy } from 'lucide-react';

interface StatsCardsProps {
  studyHours: number;
  totalScore: number;
  rank: number;
  rankFrom: number;
  tryoutsCompleted: number;
  lastTryoutTitle: string | null;
}

export default function StatsCards({
  studyHours,
  totalScore,
  rank,
  rankFrom,
  tryoutsCompleted,
  lastTryoutTitle,
}: StatsCardsProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  // const mainColor = websiteSubCategory?.main_color || "#0091FF";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-black text-lg text-slate-800">Statistik Belajar</h3>
      </div>

      <div
        className="w-full overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.stats-scroll::-webkit-scrollbar { display: none; }`}</style>

        <div className="stats-scroll flex gap-3 md:gap-4 w-max md:w-full md:grid md:grid-cols-4 md:min-w-0">
          {/* Jam Belajar - Blue */}
          <div className="w-[220px] md:w-auto h-[180px] md:h-auto rounded-[2rem] p-6 bg-[#e0f2fe] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center mb-4 shadow-sm text-white">
                <Clock className="w-5 h-5" />
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  {Math.floor(studyHours)}
                </span>
                <span className="text-sm font-bold text-slate-500">jam</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                JAM BELAJAR
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                +0j minggu ini
              </p>
            </div>
          </div>

          {/* BimArena Selesai - Green */}
          <div className="w-[220px] md:w-auto h-[180px] md:h-auto rounded-[2rem] p-6 bg-[#dcfce7] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#10b981] flex items-center justify-center mb-4 shadow-sm text-white">
                <Target className="w-5 h-5" />
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  {tryoutsCompleted}
                </span>
                <span className="text-sm font-bold text-slate-500">tryout</span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                BIMARENA SELESAI
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                Peringkat #{rank || '-'}
              </p>
            </div>
          </div>

          {/* Rata-rata Skor - Purple */}
          <div className="w-[220px] md:w-auto h-[180px] md:h-auto rounded-[2rem] p-6 bg-[#f3e8ff] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#a855f7] flex items-center justify-center mb-4 shadow-sm text-white">
                <TrendingUp className="w-5 h-5" />
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  {totalScore > 0
                    ? (totalScore / (tryoutsCompleted || 1)).toFixed(0)
                    : 0}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                RATA-RATA SKOR
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                Belum ada data
              </p>
            </div>
          </div>

          {/* Peringkat - Pink */}
          <div className="w-[220px] md:w-auto h-[180px] md:h-auto rounded-[2rem] p-6 bg-[#fae8ff] flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#ec4899] flex items-center justify-center mb-4 shadow-sm text-white">
                <Trophy className="w-5 h-5" />
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">
                  {rank || '-'}
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                PERINGKAT
              </p>
              <p className="text-[10px] font-medium text-slate-400">
                dari {rankFrom} siswa
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
