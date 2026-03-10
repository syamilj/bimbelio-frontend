'use client';

import {
  Activity,
  BarChart3,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LineChart as LineChartIcon,
  Target,
  Trophy,
  Star
} from 'lucide-react';

export function InsightWelcomeIllustration({ color }: { color: string }) {
  return (
    <div className="w-[220px]">
      <div
        className="rounded-3xl p-3 border shadow-sm"
        style={{ backgroundColor: 'white', borderColor: `${color}20` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <BarChart3 className="w-3.5 h-3.5" style={{ color }} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-700 leading-tight">
                Insight
              </span>
              <span className="text-[7px] text-slate-400 font-medium">Dashboard Analitik</span>
            </div>
          </div>
          <div className="bg-slate-100 rounded-full px-2 py-0.5 flex items-center gap-1">
            <Star className="w-2.5 h-2.5 text-yellow-500 fill-yellow-500" />
            <span className="text-[8px] font-bold text-slate-600">Pro</span>
          </div>
        </div>

        {/* Dashboard Grid Mockup */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
            <Activity className="w-3 h-3 mb-1" style={{ color }} />
            <div className="w-full h-1.5 rounded-full bg-slate-200 mb-1" />
            <div className="w-2/3 h-1.5 rounded-full" style={{ backgroundColor: `${color}40` }} />
          </div>
          <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
            <Target className="w-3 h-3 mb-1 text-rose-500" />
            <div className="w-full h-1.5 rounded-full bg-slate-200 mb-1" />
            <div className="w-1/2 h-1.5 rounded-full bg-rose-200" />
          </div>
        </div>

        {/* Main Chart Mockup */}
        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 h-16 flex items-end justify-between gap-1">
           {[30, 45, 25, 60, 80, 50, 90].map((h, i) => (
             <div
                key={i}
                className="w-full rounded-t-sm"
                style={{
                  height: `${h}%`,
                  backgroundColor: i === 6 ? color : `${color}30`
                }}
             />
           ))}
        </div>
      </div>
    </div>
  );
}

export function InsightCourseIllustration({ color }: { color: string }) {
  return (
    <div className="w-[220px]">
      <div
        className="rounded-3xl p-3 border"
        style={{ backgroundColor: 'white', borderColor: `${color}20` }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4" style={{ color }} />
          <span className="text-[10px] font-bold text-slate-600">Materi & Kuis</span>
        </div>

        <div className="space-y-2">
          {/* Item 1 */}
          <div className="flex items-center gap-2 p-2 rounded-xl" style={{ backgroundColor: `${color}10` }}>
             <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color }} />
             <div className="flex-1">
               <div className="w-3/4 h-2 rounded-full bg-white mb-1" />
               <div className="w-full h-1.5 bg-white/50 rounded-full overflow-hidden">
                 <div className="w-full h-full" style={{ backgroundColor: color }} />
               </div>
             </div>
             <span className="text-[8px] font-black" style={{ color }}>100%</span>
          </div>

           {/* Item 2 */}
           <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100">
             <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
             <div className="flex-1">
               <div className="w-2/3 h-2 rounded-full bg-slate-200 mb-1" />
               <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                 <div className="w-[45%] h-full" style={{ backgroundColor: color }} />
               </div>
             </div>
             <span className="text-[8px] font-black text-slate-400">45%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InsightTryoutIllustration({ color }: { color: string }) {
  return (
    <div className="w-[220px]">
      <div
        className="rounded-3xl p-3 border relative overflow-hidden"
        style={{ backgroundColor: 'white', borderColor: `${color}20` }}
      >
        <div className="flex justify-between items-start mb-4">
           <div>
             <div className="flex items-center gap-1.5 mb-1">
               <LineChartIcon className="w-3.5 h-3.5" style={{ color }} />
               <span className="text-[9px] font-bold text-slate-600">Skor Try Out</span>
             </div>
             <span className="text-sm font-black" style={{ color }}>684.50</span>
           </div>
           <div className="bg-emerald-100 text-emerald-600 text-[8px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
             <Activity className="w-2 h-2" />
             +24.5
           </div>
        </div>

        {/* Line Chart Mockup */}
        <div className="relative h-16 w-full mt-2">
           <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path
                d="M0,35 Q20,30 40,20 T70,15 T100,5"
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M0,35 Q20,30 40,20 T70,15 T100,5 L100,40 L0,40 Z"
                fill={`${color}15`}
              />
              <circle cx="40" cy="20" r="2" fill="white" stroke={color} strokeWidth="1.5" />
              <circle cx="70" cy="15" r="2" fill="white" stroke={color} strokeWidth="1.5" />
              <circle cx="100" cy="5" r="2" fill={color} />
           </svg>
        </div>
      </div>
    </div>
  );
}

export function InsightPredictionIllustration({ color }: { color: string }) {
  return (
    <div className="w-[220px]">
      <div
        className="rounded-3xl p-3 border"
        style={{ backgroundColor: 'white', borderColor: `${color}20` }}
      >
        <div className="flex items-center gap-1.5 mb-3 justify-center">
          <GraduationCap className="w-4 h-4" style={{ color }} />
          <span className="text-[10px] font-bold text-slate-600">Target Kampus</span>
        </div>

        {/* Prediction Card */}
        <div className="rounded-xl border p-2 mb-2 relative overflow-hidden" style={{ borderColor: `${color}30`, backgroundColor: `${color}05` }}>
           <div className="absolute right-0 top-0 bottom-0 w-1" style={{ backgroundColor: color }} />
           <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold text-slate-700">Ilmu Komputer</span>
              <span className="text-[8px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">Aman</span>
           </div>
           <div className="flex items-center gap-1 text-[7px] text-slate-500 mb-2">
              <Trophy className="w-2.5 h-2.5" />
              Universitas Indonesia
           </div>
           {/* Progress diff */}
           <div className="flex items-center gap-2">
             <div className="flex-1 h-1.5 rounded-full bg-slate-200">
                <div className="w-[85%] h-full rounded-full" style={{ backgroundColor: color }} />
             </div>
             <span className="text-[7px] font-bold" style={{ color }}>~ 85%</span>
           </div>
        </div>

        {/* Other Card */}
        <div className="rounded-xl border p-2 bg-slate-50 border-slate-100">
           <div className="flex items-center justify-between mb-1.5">
              <span className="text-[9px] font-bold text-slate-500">Sistem Informasi</span>
              <span className="text-[8px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Berjuang</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="flex-1 h-1.5 rounded-full bg-slate-200">
                <div className="w-[60%] h-full rounded-full bg-amber-400" />
             </div>
             <span className="text-[7px] font-bold text-amber-500">~ 60%</span>
           </div>
        </div>
      </div>
    </div>
  );
}
