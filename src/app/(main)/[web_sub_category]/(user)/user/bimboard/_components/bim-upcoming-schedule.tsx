'use client';

import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Calendar, Clock, Crown, Target, Users, Video } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { EmptyStateIllustrations } from './empty-state-illustrations';

interface UpcomingScheduleProps {
  tryouts: Array<{
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    thumbnail: string | null;
    isPremium: boolean;
    totalQuestions: number;
  }>;
  liveClasses: Array<{
    id: string;
    title: string;
    scheduleTime: string;
    duration: number;
    thumbnail: string | null;
    instructorName: string;
    instructorAvatar: string | null;
    isPremium: boolean;
    isRegistered: boolean;
  }>;
}

export function BimUpcomingSchedule({
  tryouts,
  liveClasses,
}: UpcomingScheduleProps) {
  const [activeTab, setActiveTab] = useState<'tryouts' | 'liveclass'>(
    'tryouts',
  );

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-slate-800">
          📅 Jadwal Mendatang
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-3xl mb-4">
        <button
          onClick={() => setActiveTab('tryouts')}
          className={`flex-1 px-3 py-2 rounded-3xl text-xs font-bold transition-all ${
            activeTab === 'tryouts'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Target className="w-4 h-4 inline mr-1" />
          Try Out
        </button>
        <button
          onClick={() => setActiveTab('liveclass')}
          className={`flex-1 px-3 py-2 rounded-3xl text-xs font-bold transition-all ${
            activeTab === 'liveclass'
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Video className="w-4 h-4 inline mr-1" />
          Live Class
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto scrollbar-hide">
        {activeTab === 'tryouts' ? (
          tryouts.length > 0 ? (
            tryouts.map((tryout) => (
              <Link
                key={tryout.id}
                href={`/${website_sub_category_id}/user/bimarena/try-out/${tryout.id}`}
              >
                <div className="group p-3 rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 flex-1">
                      {tryout.title}
                    </h3>
                    {tryout.isPremium && (
                      <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {format(new Date(tryout.startDate), 'dd MMM', {
                          locale: id,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      <span>{tryout.totalQuestions} soal</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto mb-3">
                <EmptyStateIllustrations.NoSchedule />
              </div>
              <p className="text-sm font-bold text-slate-700 mb-1">
                Tidak Ada Jadwal
              </p>
              <p className="text-xs text-slate-500">
                Belum ada tryout yang dijadwalkan
              </p>
            </div>
          )
        ) : liveClasses.length > 0 ? (
          liveClasses.map((liveClass) => (
            <Link
              key={liveClass.id}
              href={`/${website_sub_category_id}/user/bimlive/${liveClass.id}`}
            >
              <div className="group p-3 rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-slate-800 line-clamp-2 flex-1">
                    {liveClass.title}
                  </h3>
                  {liveClass.isPremium && (
                    <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {format(
                        new Date(liveClass.scheduleTime),
                        'dd MMM, HH:mm',
                        { locale: id },
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{liveClass.duration} menit</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs text-slate-600 font-medium">
                    {liveClass.instructorName}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="w-32 h-32 mx-auto mb-3">
              <EmptyStateIllustrations.NoLiveClass />
            </div>
            <p className="text-sm font-bold text-slate-700 mb-1">
              Tidak Ada Live Class
            </p>
            <p className="text-xs text-slate-500">
              Belum ada kelas online yang dijadwalkan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
