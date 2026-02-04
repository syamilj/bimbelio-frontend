'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { GraduationCap, Target } from 'lucide-react';

interface TargetUniversityBannerProps {
  userTarget: {
    univChoiceOne: string;
    univStudyChoiceOne: string;
    targetValue: number;
  };
}

export function TargetUniversityBanner({ userTarget }: TargetUniversityBannerProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div
      className="rounded-3xl p-4 border-2 bg-white"
      style={{ borderColor: `${mainColor}20` }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4" style={{ color: mainColor }} />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Target Kamu
        </span>
      </div>

      {/* Content Row */}
      <div className="flex items-center justify-between gap-4">
        {/* University Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-800 text-sm md:text-base truncate">
              {userTarget.univChoiceOne}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {userTarget.univStudyChoiceOne}
            </p>
          </div>
        </div>

        {/* Target Score */}
        <div
          className="flex-shrink-0 px-4 py-2 rounded-2xl text-center"
          style={{ backgroundColor: `${mainColor}10` }}
        >
          <p className="text-[9px] font-bold text-slate-400 uppercase">Nilai Target</p>
          <p className="text-xl font-black" style={{ color: mainColor }}>
            {userTarget.targetValue}
          </p>
        </div>
      </div>
    </div>
  );
}
