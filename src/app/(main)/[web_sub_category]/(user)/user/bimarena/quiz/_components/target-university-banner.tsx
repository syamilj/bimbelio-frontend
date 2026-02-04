'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { GraduationCap } from 'lucide-react';

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
      className="relative overflow-hidden rounded-3xl p-3 md:p-4 border-2 cursor-pointer hover:shadow-lg transition-all"
      style={{
        background: `linear-gradient(135deg, ${mainColor}08 0%, ${secondaryColor}05 100%)`,
        borderColor: `${mainColor}20`,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        {/* Left: University Info */}
        <div className="flex items-center gap-3 md:gap-4">
          <div
            className="w-11 h-11 md:w-14 md:h-14 rounded-3xl flex items-center justify-center text-white shadow-lg flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <GraduationCap className="w-5 h-5 md:w-7 md:h-7" />
          </div>
          <div className="min-w-0">
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Target Kamu
            </p>
            <h3 className="font-black text-slate-800 text-sm md:text-base truncate">
              {userTarget.univChoiceOne}
            </h3>
            <p className="text-xs md:text-sm text-slate-500 font-medium truncate">
              {userTarget.univStudyChoiceOne}
            </p>
          </div>
        </div>
        {/* Right: Target Value */}
        <div className="relative">
          <div
            className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex items-center gap-3 md:gap-5 min-w-max">
              <div className="text-center flex-shrink-0">
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">
                  Target Nilai
                </p>
                <p
                  className="text-lg md:text-xl font-black"
                  style={{ color: mainColor }}
                >
                  {userTarget.targetValue}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
