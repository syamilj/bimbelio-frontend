"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, ChevronRight, Lightbulb } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Cell, Label, Pie, PieChart } from "recharts";
import { ScrollWrapper } from "@/components/ui/scroll-wrapper";

// --- StatPill -----------------------------------------------------------------

export function StatPill({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-[1.5rem] p-4 bg-white border border-slate-200/80 shadow-sm flex-[1_0_auto] flex flex-col items-center justify-center text-center max-w-[160px] md:max-w-none">
      <div className="flex items-center justify-center gap-2 mb-2 w-full">
        <div
          className="w-7 h-7 md:w-8 md:h-8 rounded-[0.7rem] flex items-center justify-center text-white flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </p>
      </div>
      <div className="mt-1 flex items-baseline justify-center gap-1.5 w-full">
        <p className="text-xl md:text-2xl font-black leading-none text-slate-800 truncate">
          {value}
        </p>
      </div>
      <p className="text-[10px] md:text-[11px] text-slate-500 mt-1.5 pb-0.5 line-clamp-2 md:line-clamp-1">{sub}</p>
    </div>
  );
}

// --- SectionLabel -------------------------------------------------------------

export function SectionLabel({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <div>
      <h3 className="text-sm font-black text-slate-800">{title}</h3>
      {sub && <p className="text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

// --- InsightCard --------------------------------------------------------------

export function InsightCard({
  title,
  value,
  sub,
  tone,
}: {
  title: string;
  value: string;
  sub: string;
  tone: "emerald" | "amber" | "blue" | "slate";
}) {
  const toneMap = {
    emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-500", text: "text-slate-800" },
    amber: { bg: "bg-amber-50", iconBg: "bg-amber-500", text: "text-slate-800" },
    blue: { bg: "bg-blue-50", iconBg: "bg-blue-500", text: "text-slate-800" },
    slate: { bg: "bg-slate-50", iconBg: "bg-slate-500", text: "text-slate-800" },
  } as const;
  const t = toneMap[tone];

  return (
    <div
      className={cn(
        "rounded-3xl p-4 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center",
        t.bg,
      )}
    >
      <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
        {title}
      </p>
      <p className={cn("text-xl md:text-2xl font-black w-full truncate", t.text)}>{value}</p>
      <p className="mt-1 text-[10px] md:text-[11px] text-slate-500 w-full line-clamp-2">{sub}</p>
    </div>
  );
}

// --- ChangeCard ---------------------------------------------------------------

export function ChangeCard({
  icon,
  label,
  current,
  change,
  inverseGood,
}: {
  icon: React.ReactNode;
  label: string;
  current: number;
  change: number;
  inverseGood: boolean;
}) {
  const isGood = inverseGood ? change <= 0 : change >= 0;

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center gap-2 mb-2 w-full">
        <div className="w-7 h-7 rounded-3xl bg-slate-500 flex items-center justify-center [&_svg]:text-white [&_svg]:w-3.5 [&_svg]:h-3.5 flex-shrink-0">
          {icon}
        </div>
        <span className="text-[10px] md:text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </span>
      </div>
      <div className="text-xl md:text-2xl font-black text-slate-800 truncate w-full">{current}</div>
      <div className="flex items-center justify-center gap-1 mt-1.5 w-full">
        {change !== 0 ? (
          <>
            {isGood ? (
              <ArrowUp className="w-3 h-3 text-emerald-500 flex-shrink-0" />
            ) : (
              <ArrowDown className="w-3 h-3 text-red-500 flex-shrink-0" />
            )}
            <span
              className={cn(
                "text-[10px] text-left md:text-[11px] font-bold leading-tight",
                isGood ? "text-emerald-600" : "text-red-500",
              )}
            >
              {change > 0 ? "+" : ""}
              {change} vs awal
            </span>
          </>
        ) : (
          <span className="text-[10px] md:text-[11px] text-slate-400">Tidak berubah</span>
        )}
      </div>
    </div>
  );
}

// --- ScoreBadge ---------------------------------------------------------------

export function getScoreBadgeColor(score: number) {
  if (score >= 80) return { bg: "bg-emerald-100", text: "text-emerald-700" };
  if (score >= 60) return { bg: "bg-blue-100", text: "text-blue-700" };
  if (score >= 40) return { bg: "bg-yellow-100", text: "text-yellow-700" };
  return { bg: "bg-red-100", text: "text-red-700" };
}

// --- GaugeDonut ---------------------------------------------------------------

export function GaugeDonut({
  value,
  max,
  label,
  sub,
  color,
  size = 120,
}: {
  value: number;
  max: number;
  label: string;
  sub?: string;
  color: string;
  size?: number;
}) {
  const gaugeData = [
    { name: "filled", value: Math.min(value, max), fill: color },
    { name: "empty", value: Math.max(0, max - value), fill: "#e2e8f0" },
  ];

  const gaugeConfig: ChartConfig = {
    filled: { label: "Value", color },
    empty: { label: "", color: "#e2e8f0" },
  };

  const inner = Math.round(size * 0.33);
  const outer = Math.round(size * 0.45);

  return (
    <ChartContainer
      config={gaugeConfig}
      className="flex-shrink-0"
      style={{ height: size, width: size }}
    >
      <PieChart>
        <Pie
          data={gaugeData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={inner}
          outerRadius={outer}
          startAngle={90}
          endAngle={-270}
          paddingAngle={0}
          stroke="none"
        >
          {gaugeData.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) - (sub ? 4 : 0)}
                      className="fill-slate-800 text-xl font-black"
                    >
                      {label}
                    </tspan>
                    {sub && (
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 14}
                        className="fill-slate-400 text-[9px] font-semibold uppercase tracking-wider"
                      >
                        {sub}
                      </tspan>
                    )}
                  </text>
                );
              }
              return null;
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

// --- HeroBanner ---------------------------------------------------------------

export function HeroBanner({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div className="px-5 pt-6 pb-5">
      {children}
    </div>
  );
}

// --- EmptyState ---------------------------------------------------------------

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 mb-4">
        <Icon className="h-8 w-8 text-slate-300" />
      </div>
      <h3 className="text-lg font-black text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md">{description}</p>
    </div>
  );
}

// --- ScrollRow ----------------------------------------------------------------

export function ScrollRow({
  children,
  className,
  cols = 3,
  noGrid = false,
}: {
  children: React.ReactNode;
  className?: string;
  cols?: 2 | 3 | 4;
  noGrid?: boolean;
}) {
  const gridCols =
    cols === 2
      ? "md:grid-cols-2"
      : cols === 4
        ? "md:grid-cols-4"
        : "md:grid-cols-3";

  return (
    <div className={cn("relative", className)}>
      <ScrollWrapper
        className={cn(
          "-mx-4 px-4 pb-2 pt-1",
          !noGrid && "md:mx-0 md:px-0 md:overflow-visible"
        )}
      >
        <div
          className={cn(
            "flex gap-3 md:gap-4 min-w-max",
            !noGrid && ["md:min-w-0 md:grid", gridCols]
          )}
        >
          {children}
        </div>
      </ScrollWrapper>
    </div>
  );
}

export { ScrollWrapper };

// --- InsightBanner ------------------------------------------------------------

const INSIGHT_TONES = {
  info: {
    bg: "bg-blue-50/80 border-blue-100",
    icon: "bg-blue-100 text-blue-600",
    text: "text-blue-800",
  },
  success: {
    bg: "bg-emerald-50/80 border-emerald-100",
    icon: "bg-emerald-100 text-emerald-600",
    text: "text-emerald-800",
  },
  warning: {
    bg: "bg-amber-50/80 border-amber-100",
    icon: "bg-amber-100 text-amber-600",
    text: "text-amber-800",
  },
  neutral: {
    bg: "bg-slate-50/80 border-slate-200",
    icon: "bg-slate-100 text-slate-500",
    text: "text-slate-700",
  },
} as const;

export function InsightBanner({
  children,
  tone = "info",
}: {
  children: React.ReactNode;
  tone?: keyof typeof INSIGHT_TONES;
}) {
  const t = INSIGHT_TONES[tone];
  return (
    <div
      className={cn(
        "flex items-start gap-2.5 rounded-3xl border px-3.5 py-3 text-xs leading-relaxed",
        t.bg,
      )}
    >
      <div
        className={cn(
          "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-3xl",
          t.icon,
        )}
      >
        <Lightbulb className="h-3.5 w-3.5" />
      </div>
      <span className={cn("font-medium pt-0.5", t.text)}>{children}</span>
    </div>
  );
}

// --- FilterChip ---------------------------------------------------------------

export function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-xs font-bold transition-all border flex-shrink-0 cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-md",
        active
          ? "text-white border-transparent"
          : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100",
      )}
      style={active ? { backgroundColor: color } : undefined}
    >
      {label}
    </button>
  );
}

// --- HeatmapCell --------------------------------------------------------------

export function HeatmapCell({
  score,
  label,
}: {
  score: number | null | undefined;
  label?: string;
}) {
  if (score == null)
    return (
      <td className="px-2 py-2.5 text-center text-xs text-slate-300">—</td>
    );

  const bg =
    score >= 80
      ? "bg-emerald-100 text-emerald-800"
      : score >= 60
        ? "bg-blue-100 text-blue-800"
        : score >= 40
          ? "bg-amber-100 text-amber-800"
          : "bg-red-100 text-red-800";

  return (
    <td className="px-1.5 py-2 text-center">
      <span
        className={cn(
          "inline-block min-w-[3rem] rounded-3xl px-2 py-1 text-xs font-bold tabular-nums",
          bg,
        )}
      >
        {label ?? score.toFixed(0)}
      </span>
    </td>
  );
}

// --- SubtestTooltipHeader -----------------------------------------------------

export function SubtestTooltipHeader({
  initial,
  fullName,
}: {
  initial: string;
  fullName: string;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <th className="px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500 cursor-help whitespace-nowrap">
            {initial}
          </th>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          {fullName}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
