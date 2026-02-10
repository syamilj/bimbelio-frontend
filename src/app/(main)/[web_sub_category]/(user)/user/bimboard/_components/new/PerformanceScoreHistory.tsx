'use client';

import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Target, Trophy } from 'lucide-react';

interface ScoreHistoryItem {
  date: string;
  score: number;
  tryoutTitle: string;
  rank: number;
  totalParticipants: number;
  rankChange: number;
}

interface PerformanceScoreHistoryProps {
  scores: ScoreHistoryItem[];
  mainColor: string;
}

export function PerformanceScoreHistory({
  scores,
  mainColor,
}: PerformanceScoreHistoryProps) {
  if (scores.length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-bold text-slate-700">
        Riwayat Skor & Peringkat
      </h3>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {scores
          .slice(-5)
          .reverse()
          .map((item, index) => {
            const rankPercentile =
              item.totalParticipants > 0
                ? Math.round(
                    ((item.totalParticipants - item.rank + 1) /
                      item.totalParticipants) *
                      100,
                  )
                : 0;

            return (
              <div
                key={index}
                className="flex-shrink-0 w-[320px] p-2.5 rounded-3xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
              >
                {/* Header: Title and Date */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-800 truncate">
                      {item.tryoutTitle}
                    </p>
                    <p className="text-xs text-slate-500">
                      {format(new Date(item.date), 'dd MMM yyyy', {
                        locale: localeId,
                      })}
                    </p>
                  </div>
                </div>

                {/* Score and Ranking Row */}
                <div className="flex items-center gap-3">
                  {/* Score */}
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Target
                        className="w-5 h-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">
                        Skor
                      </div>
                      <div
                        className="text-lg font-black"
                        style={{ color: mainColor }}
                      >
                        {Math.round(item.score)}
                      </div>
                    </div>
                  </div>

                  {/* Ranking */}
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.rank <= 3 ? 'bg-yellow-100' : 'bg-blue-50'
                      }`}
                    >
                      <Trophy
                        className={`w-5 h-5 ${
                          item.rank <= 3
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">
                        Peringkat
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`text-lg font-black ${
                            item.rank <= 3
                              ? 'text-yellow-600'
                              : 'text-blue-600'
                          }`}
                        >
                          #{item.rank}
                        </span>
                        <span className="text-xs text-slate-500">
                          / {item.totalParticipants}
                        </span>
                        {item.rankChange !== 0 && (
                          <span
                            className={`text-xs font-bold ml-1 ${
                              item.rankChange > 0
                                ? 'text-emerald-600'
                                : 'text-red-600'
                            }`}
                          >
                            {item.rankChange > 0 ? '↑' : '↓'}
                            {Math.abs(item.rankChange)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ranking Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Top {rankPercentile}%
                    </span>
                    <span className="text-slate-600 font-bold">
                      {item.totalParticipants - item.rank} peserta
                      dibawah Anda
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${rankPercentile}%`,
                        backgroundColor:
                          item.rankChange > 0
                            ? '#10b981'
                            : item.rankChange < 0
                              ? '#ef4444'
                              : mainColor,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
