'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { useWebsiteSubCategory } from '../provider/provider-website-category';

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
  const {} = useWebsiteSubCategory();
  return (
    <>
      <button
        className={cn(
          'bg-gradient-default md:hover:opacity-80 relative flex cursor-pointer items-center justify-center rounded-4xl px-[1.3rem] py-[.8rem] text-center text-white',
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
        <div className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-4xl bg-inherit px-[1.3rem] py-[.8rem]" />
      </button>
    </>
  );
}
