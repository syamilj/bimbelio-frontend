"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useWebsiteSubCategory } from "../provider/provider-website-category";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
}

export default function PulsatingButton({
  children,
  pulseColor = "#0091FFe0",
  duration = "1.5s",
  ...props
}: PulsatingButtonProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const baseGradient = `linear-gradient(145deg, ${websiteSubCategory?.secondary_color}, ${websiteSubCategory?.main_color})`;
  const hoverGradient = `linear-gradient(145deg, ${websiteSubCategory?.secondary_color}e0, ${websiteSubCategory?.main_color}e0)`;

  return (
    <>
      <style>{`
        .pulsating-btn {
          background: ${baseGradient};
          transition: background 0.3s ease;
        }
        .pulsating-btn:hover,
        .pulsating-btn:active {
          background: ${hoverGradient};
        }
      `}</style>

      <button
        className={cn(
          "pulsating-btn relative flex cursor-pointer items-center justify-center rounded-[2rem] px-[1.3rem] py-[.8rem] text-center text-white"
        )}
        style={
          {
            "--pulse-color": pulseColor,
            "--duration": duration,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className="relative z-10">{children}</div>
        <div className="absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-[2rem] bg-inherit px-[1.3rem] py-[.8rem]" />
      </button>
    </>
  );
}
