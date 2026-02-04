'use client';

import { BarChart3, Play, Swords, Trophy, Users } from 'lucide-react';

// Mockup: Battle Arena dengan player cards
export function WelcomeIllustration({ color }: { color: string }) {
  return (
    <div className="w-[200px]">
      <div
        className="rounded-3xl p-3 border shadow-sm"
        style={{ backgroundColor: 'white', borderColor: `${color}20` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: `${color}15` }}
            >
              <Swords className="w-3 h-3" style={{ color }} />
            </div>
            <span className="text-[10px] font-bold text-slate-600">Battle Arena</span>
          </div>
          <div className="flex items-center gap-1 text-[8px] text-slate-400">
            <Users className="w-2.5 h-2.5" />
            <span>1,234</span>
          </div>
        </div>
        {/* VS Battle mockup */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div className="text-center">
            <div
              className="w-8 h-8 rounded-full mx-auto mb-1"
              style={{ backgroundColor: `${color}20` }}
            />
            <div className="w-10 h-1.5 rounded bg-slate-200 mx-auto" />
          </div>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black text-white"
            style={{ backgroundColor: color }}
          >
            VS
          </div>
          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-slate-200 mx-auto mb-1" />
            <div className="w-10 h-1.5 rounded bg-slate-200 mx-auto" />
          </div>
        </div>
        {/* Start button */}
        <div
          className="flex items-center justify-center gap-1 py-1.5 rounded-3xl text-[9px] font-bold text-white"
          style={{ backgroundColor: color }}
        >
          <Play className="w-2.5 h-2.5" />
          <span>Mulai Battle</span>
        </div>
      </div>
    </div>
  );
}

// Mockup: Quiz Cards Grid
export function LibraryIllustration({ color }: { color: string }) {
  return (
    <div className="w-[200px]">
      {/* Search bar */}
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-3xl border mb-2"
        style={{ backgroundColor: 'white', borderColor: `${color}20` }}
      >
        <div className="w-3 h-3 rounded-full border-2 border-slate-300" />
        <div className="flex-1 h-1.5 rounded bg-slate-200" />
      </div>
      {/* Cards grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-3xl p-2 border"
            style={{
              backgroundColor: i === 1 ? `${color}08` : 'white',
              borderColor: i === 1 ? `${color}30` : '#e2e8f0',
            }}
          >
            <div
              className="w-full h-4 rounded mb-1.5"
              style={{ backgroundColor: i === 1 ? `${color}25` : '#f1f5f9' }}
            />
            <div className="w-full h-1 rounded bg-slate-200 mb-1" />
            <div className="w-2/3 h-1 rounded bg-slate-200" />
            <div
              className="mt-2 w-full h-4 rounded flex items-center justify-center"
              style={{ backgroundColor: i === 1 ? color : '#e2e8f0' }}
            >
              <span
                className="text-[6px] font-bold"
                style={{ color: i === 1 ? 'white' : '#94a3b8' }}
              >
                {i === 1 ? 'Battle' : 'Quiz'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mockup: Progress Chart
export function ProgressIllustration({ color }: { color: string }) {
  return (
    <div className="w-[200px]">
      <div
        className="rounded-3xl p-3 border"
        style={{ backgroundColor: 'white', borderColor: `${color}20` }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" style={{ color }} />
            <span className="text-[9px] font-bold text-slate-600">Progress</span>
          </div>
          <div
            className="px-1.5 py-0.5 rounded text-[7px] font-bold"
            style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}
          >
            +12%
          </div>
        </div>
        {/* Bar chart mockup */}
        <div className="flex items-end justify-between gap-1 h-12 mb-2">
          {[35, 50, 70, 45, 85, 60].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                height: `${h}%`,
                backgroundColor: i === 4 ? color : `${color}30`,
              }}
            />
          ))}
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-1.5">
          {['85%', '42', '#5'].map((val, i) => (
            <div
              key={i}
              className="text-center py-1 rounded"
              style={{ backgroundColor: `${color}08` }}
            >
              <p className="text-[10px] font-black" style={{ color }}>{val}</p>
              <p className="text-[6px] text-slate-400">
                {['Akurasi', 'Quiz', 'Rank'][i]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Mockup: Leaderboard Table
export function LeaderboardIllustration({ color }: { color: string }) {
  const ranks = [
    { rank: 1, color: '#f59e0b', bg: '#fef3c7' },
    { rank: 2, color: '#94a3b8', bg: '#f1f5f9' },
    { rank: 3, color: '#f97316', bg: '#ffedd5' },
  ];

  return (
    <div className="w-[200px]">
      <div
        className="rounded-3xl p-3 border"
        style={{ backgroundColor: 'white', borderColor: `${color}20` }}
      >
        {/* Header */}
        <div className="flex items-center gap-1.5 mb-2">
          <Trophy className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-[9px] font-bold text-slate-600">Leaderboard</span>
        </div>
        {/* Leaderboard rows */}
        <div className="space-y-1.5">
          {ranks.map((r) => (
            <div
              key={r.rank}
              className="flex items-center gap-2 p-1.5 rounded-3xl"
              style={{ backgroundColor: r.bg }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                style={{ backgroundColor: r.color }}
              >
                {r.rank}
              </div>
              <div className="flex-1">
                <div
                  className="h-1.5 rounded mb-1"
                  style={{ width: `${90 - r.rank * 15}%`, backgroundColor: r.color + '60' }}
                />
                <div className="h-1 w-12 rounded bg-slate-200" />
              </div>
              <span className="text-[8px] font-bold" style={{ color: r.color }}>
                {(3000 - r.rank * 200).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
