'use client';

import React from 'react';

import { cn } from '@/lib/utils';

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export default function PulsatingButton({
  children,
  pulseColor = '#0091FFe0',
  duration = '1.5s',
  ...props
}: PulsatingButtonProps) {
  return (
    <button
      className={cn(
        'relative flex cursor-pointer items-center justify-center rounded-[2rem] bg-greenUpgrade px-[1.3rem] py-[.8rem] text-center text-white duration-300 active:bg-greenUpgradeHover md:hover:bg-greenUpgradeHover md:active:bg-greenUpgrade',
        // 'bg-greenUpgrade md:hover:bg-greenUpgradeHover md:active:bg-greenUpgrade active:bg-greenUpgradeHover duration-300 py-[.8rem] px-[1.3rem] rounded-[2rem] text-white"
      )}
      style={
        {
          '--pulse-color': pulseColor,
          '--duration': duration,
        } as React.CSSProperties
      }
      {...props}
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-[2rem] bg-inherit px-[1.3rem] py-[.8rem]" />
    </button>
  );
}
