'use client';

import type React from 'react';
import type { ReactNode } from 'react';

interface IPhoneFrameProps {
  children: ReactNode;
}

export const IPhoneFrame: React.FC<IPhoneFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px] md:w-[366px]">
      {/* iPhone frame - very minimal white frame */}
      <div className="bg-[#f5f5f7] rounded-[40px] shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden relative aspect-366/750 w-full">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[35%] h-[22px] bg-[#f5f5f7] rounded-b-[14px] z-10 flex items-center justify-center">
          <div className="w-[40px] h-[4px] bg-[#e0e0e0] rounded-full"></div>
        </div>

        {/* Screen content */}
        <div className="absolute top-[8px] left-[8px] right-[8px] bottom-[8px] rounded-[34px] overflow-hidden">
          {children}
        </div>

        {/* Subtle border effect */}
        <div className="absolute inset-0 rounded-[40px] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]"></div>
      </div>
    </div>
  );
};
