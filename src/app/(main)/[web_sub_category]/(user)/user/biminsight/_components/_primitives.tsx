"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Cell, Label, Pie, PieChart } from "recharts";

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
    <div className="rounded-3xl border border-slate-100 bg-white/80 backdrop-blur-sm px-3 py-2.5">
      <div className="flex items-center gap-1.5 mb-1">
        <span style={{ color }} className="opacity-60">
          {icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
      </div>
      <p className="text-lg font-black leading-none" style={{ color }}>
        {value}
      </p>
      <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
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
  const toneClass =
    tone === "emerald"
      ? "border-emerald-200 bg-emerald-50/60 text-emerald-900"
      : tone === "amber"
        ? "border-amber-200 bg-amber-50/60 text-amber-900"
        : tone === "blue"
          ? "border-blue-200 bg-blue-50/60 text-blue-900"
          : "border-slate-200 bg-slate-50/60 text-slate-900";

  return (
    <div className={cn("rounded-3xl border p-4", toneClass)}>
      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
        {title}
      </p>
      <p className="mt-1 text-xl font-black">{value}</p>
      <p className="mt-1 text-xs opacity-80">{sub}</p>
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
    <div className="rounded-3xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[10px] font-bold text-slate-500 uppercase">
          {label}
        </span>
      </div>
      <div className="text-2xl font-black text-slate-800">{current}</div>
      <div className="flex items-center gap-1 mt-1">
        {change !== 0 ? (
          <>
            {isGood ? (
              <ArrowUp className="w-3 h-3 text-emerald-500" />
            ) : (
              <ArrowDown className="w-3 h-3 text-red-500" />
            )}
            <span
              className={cn(
                "text-[10px] font-bold",
                isGood ? "text-emerald-600" : "text-red-500",
              )}
            >
              {change > 0 ? "+" : ""}
              {change} vs awal
            </span>
          </>
        ) : (
          <span className="text-[10px] text-slate-400">Tidak berubah</span>
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
    <div
      className="px-5 pt-6 pb-5"
      style={{
        background: `linear-gradient(135deg, ${color}08 0%, ${color}18 100%)`,
      }}
    >
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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto -mx-4 px-4 pb-1 md:mx-0 md:px-0 md:overflow-visible",
        className,
      )}
      style={{ scrollbarWidth: "none" }}
    >
      <div className="flex gap-2 min-w-max md:min-w-0 md:grid md:grid-cols-3">
        {children}
      </div>
    </div>
  );
}
