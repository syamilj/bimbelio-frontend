"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGet } from "@/lib/fetch-helper/useGet";
import { cn } from "@/lib/utils";
import { getSubtestLabel } from "@/lib/utils/subtest";
import { BookOpen, ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  EmptyState,
  getScoreBadgeColor,
  HeroBanner,
  SectionLabel,
} from "./_primitives";
import { SectionTitle } from "./section-title";

const ColorList = [
  "#0091FF",
  "#22c55e",
  "#eab308",
  "#ef4444",
  "#6366f1",
  "#a855f7",
  "#f97316",
];

export const QuizAnalyticsTable = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { mainColor } = useWebsiteSubCategory();

  const {
    data: QuizData,
    isLoading: quizLoading,
    error: quizError,
  } = useGet<DataTypeAll>("/learningAnalytics/getUserAnalyticsQuiz", {
    params: { userId: id ? id : undefined },
    useEffectDependencies: [id],
  });

  const {
    data: VolumeData,
    isLoading: volumeLoading,
  } = useGet<DataTypeQuiz>(
    "/learningAnalytics/getUserAnalyticsQuizPerVolume",
    {
      params: { userId: id ? id : undefined },
      useEffectDependencies: [id],
    },
  );

  if (quizLoading || volumeLoading) return <LoadingPage />;
  if (quizError) return <div>Error: {quizError.message}</div>;

  const hasData = (QuizData?.data.length ?? 0) > 0 || (VolumeData?.data.length ?? 0) > 0;

  return (
    <div>
      <SectionTitle icon={HelpCircle} title="BimArena - Quiz" />
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {!hasData ? (
          <div className="p-6">
            <EmptyState
              icon={BookOpen}
              title="Belum Ada Data"
              description="Belum ada quiz yang dikerjakan"
            />
          </div>
        ) : (
          <>
            <HeroBanner color={mainColor}>
              <SectionLabel
                title="Performa Quiz"
                sub="Analisis skor quiz per subkategori dan per volume"
              />
            </HeroBanner>

            {QuizData && QuizData.data.length > 0 && (
              <SubtestSection data={QuizData} />
            )}

            {VolumeData && VolumeData.data.length > 0 && (
              <>
                <div className="border-t border-slate-100" />
                <VolumeSection data={VolumeData} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// By Subtest
// =============================================================================

function SubtestSection({ data }: { data: DataTypeAll }) {
  const { mainColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_ROWS = 5;

  const SubCategory = useMemo(
    () =>
      data.subCategories.map((sub, index) => ({
        ...sub,
        color: ColorList[index % ColorList.length],
      })),
    [data.subCategories],
  );

  const [selectedSubtests, setSelectedSubtests] = useState<string[]>([]);

  useEffect(() => {
    setSelectedSubtests(SubCategory.map((sub) => sub.id));
  }, [SubCategory]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    SubCategory.forEach((sub) => {
      config[sub.id] = {
        label: getSubtestLabel(sub.name, sub.website_sub_category_id),
        color: sub.color,
      };
    });
    return config;
  }, [SubCategory]);

  const displayedData = isExpanded
    ? data.data
    : data.data.slice(0, INITIAL_ROWS);
  const hasMoreData = data.data.length > INITIAL_ROWS;

  return (
    <div className="px-5 py-5 space-y-4">
      <SectionLabel
        title="Per Subkategori"
        sub="Skor berdasarkan masing-masing quiz dan subkategorinya"
      />

      {/* Filter chips */}
      <div
        className="overflow-x-auto -mx-5 px-5 pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-1.5 min-w-max md:min-w-0 md:flex-wrap">
          {SubCategory.map((sub, index) => (
            <button
              key={index}
              onClick={() =>
                setSelectedSubtests((prev) =>
                  prev.includes(sub.id)
                    ? prev.filter((c) => c !== sub.id)
                    : [...prev, sub.id],
                )
              }
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold transition-all border flex-shrink-0",
                selectedSubtests.includes(sub.id)
                  ? "text-white border-transparent"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300",
              )}
              style={
                selectedSubtests.includes(sub.id)
                  ? { backgroundColor: sub.color }
                  : {}
              }
            >
              {getSubtestLabel(sub.name, sub.website_sub_category_id)}
            </button>
          ))}
        </div>
      </div>

      {/* Line chart */}
      <ChartContainer
        config={chartConfig}
        className="h-[240px] md:h-[280px] w-full"
      >
        <LineChart
          data={data.chartData}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
            dataKey="volume"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {SubCategory.filter((sub) =>
            selectedSubtests.includes(sub.id),
          ).map((sub, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={sub.id}
              stroke={sub.color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: sub.color, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{
                r: 6,
                fill: sub.color,
                stroke: "#fff",
                strokeWidth: 2,
              }}
              connectNulls
            >
              <LabelList
                position="top"
                offset={8}
                className="fill-slate-600 font-bold text-[10px]"
                formatter={(v: unknown) => v != null ? String(Math.round(Number(v))) : ''}
              />
            </Line>
          ))}
        </LineChart>
      </ChartContainer>

      {/* Legend */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-3xl">
        <p className="text-xs font-bold text-slate-700 mb-2">
          Keterangan Inisial:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
          {data.subCategories.map((subCat) => (
            <div key={subCat.id} className="text-xs">
              <span className="font-semibold">
                {getSubtestLabel(subCat.name, subCat.website_sub_category_id)}
              </span>{" "}
              = {subCat.name}
            </div>
          ))}
        </div>
      </div>

      {/* Score table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-slate-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-bold text-slate-700 py-3">
                Quiz
              </TableHead>
              {data.subCategories.map((subCat) => (
                <TableHead
                  key={subCat.id}
                  className="font-bold text-slate-700 text-center py-3 hover:underline cursor-help"
                  title={subCat.name}
                >
                  {getSubtestLabel(subCat.name, subCat.website_sub_category_id)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={data.subCategories.length + 1}
                  className="text-center py-8 text-gray-500"
                >
                  <p className="text-sm">Data belum ada</p>
                </TableCell>
              </TableRow>
            ) : (
              displayedData.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-semibold text-slate-800 py-4 whitespace-nowrap">
                    {quiz.title}
                  </TableCell>
                  {data.subCategories.map((subCat) => {
                    const subCatData = quiz.subCategories.find(
                      (s) => s.id === subCat.id,
                    );

                    if (!subCatData) {
                      return (
                        <TableCell
                          key={`${quiz.id}-${subCat.id}`}
                          className="text-center py-4"
                        >
                          -
                        </TableCell>
                      );
                    }

                    const score = subCatData.averageScore || 0;
                    const badgeColor = getScoreBadgeColor(score);

                    return (
                      <TableCell
                        key={`${quiz.id}-${subCat.id}`}
                        className="text-center py-4"
                      >
                        <Badge
                          className={`${badgeColor.bg} ${badgeColor.text} border-0 font-semibold`}
                        >
                          {score.toFixed(2)}
                        </Badge>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {hasMoreData && (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Tampilkan Lebih Sedikit
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Lihat Semua ({data.data.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// By Volume
// =============================================================================

function VolumeSection({ data }: { data: DataTypeQuiz }) {
  const { mainColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_ROWS = 5;

  const Volumes = useMemo(
    () =>
      data.quizVolumes.map((vol, index) => ({
        ...vol,
        color: ColorList[index % ColorList.length],
      })),
    [data.quizVolumes],
  );

  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);

  useEffect(() => {
    setSelectedVolumes(Volumes.map((vol) => vol.volId));
  }, [Volumes]);

  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    Volumes.forEach((vol) => {
      config[vol.volId] = {
        label: vol.initial,
        color: vol.color,
      };
    });
    return config;
  }, [Volumes]);

  const displayedData = isExpanded
    ? data.data
    : data.data.slice(0, INITIAL_ROWS);
  const hasMoreData = data.data.length > INITIAL_ROWS;

  return (
    <div className="px-5 py-5 space-y-4">
      <SectionLabel
        title="Per Volume"
        sub="Skor berdasarkan volume quiz"
      />

      {/* Filter chips */}
      <div
        className="overflow-x-auto -mx-5 px-5 pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex gap-1.5 min-w-max md:min-w-0 md:flex-wrap">
          {Volumes.map((vol, index) => (
            <button
              key={index}
              onClick={() =>
                setSelectedVolumes((prev) =>
                  prev.includes(vol.volId)
                    ? prev.filter((c) => c !== vol.volId)
                    : [...prev, vol.volId],
                )
              }
              className={cn(
                "px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold transition-all border flex-shrink-0",
                selectedVolumes.includes(vol.volId)
                  ? "text-white border-transparent"
                  : "bg-white text-slate-400 border-slate-200 hover:border-slate-300",
              )}
              style={
                selectedVolumes.includes(vol.volId)
                  ? { backgroundColor: vol.color }
                  : {}
              }
            >
              {vol.initial}
            </button>
          ))}
        </div>
      </div>

      {/* Line chart */}
      <ChartContainer
        config={chartConfig}
        className="h-[240px] md:h-[280px] w-full"
      >
        <LineChart
          data={data.chartData}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
            dataKey="volume"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          {Volumes.filter((vol) =>
            selectedVolumes.includes(vol.volId),
          ).map((vol, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={vol.volId}
              stroke={vol.color}
              strokeWidth={2.5}
              dot={{ r: 4, fill: vol.color, strokeWidth: 2, stroke: "#fff" }}
              activeDot={{
                r: 6,
                fill: vol.color,
                stroke: "#fff",
                strokeWidth: 2,
              }}
              connectNulls
            >
              <LabelList
                position="top"
                offset={8}
                className="fill-slate-600 font-bold text-[10px]"
                formatter={(v: unknown) => v != null ? String(Math.round(Number(v))) : ''}
              />
            </Line>
          ))}
        </LineChart>
      </ChartContainer>

      {/* Legend */}
      <div className="p-3 bg-slate-50 border border-slate-100 rounded-3xl">
        <p className="text-xs font-bold text-slate-700 mb-2">
          Keterangan Inisial:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
          {data.quizVolumes.map((vol) => (
            <div key={vol.volId} className="text-xs">
              <span className="font-semibold">{vol.initial}</span> ={" "}
              {vol.volName}
            </div>
          ))}
        </div>
      </div>

      {/* Score table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-slate-100">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-bold text-slate-700 py-3">
                Quiz
              </TableHead>
              {data.quizVolumes.map((vol) => (
                <TableHead
                  key={vol.volId}
                  className="font-bold text-slate-700 text-center py-3 hover:underline cursor-help"
                  title={vol.volName || ""}
                >
                  {vol.initial}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={data.quizVolumes.length + 1}
                  className="text-center py-8 text-gray-500"
                >
                  <p className="text-sm">Data belum ada</p>
                </TableCell>
              </TableRow>
            ) : (
              displayedData.map((quiz) => (
                <TableRow
                  key={quiz.title}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-semibold text-slate-800 py-4 whitespace-nowrap">
                    {quiz.title}
                  </TableCell>
                  {data.quizVolumes.map((vol) => {
                    const volData = quiz.quizVolume.find(
                      (s) => s.volId === vol.volId,
                    );

                    if (!volData) {
                      return (
                        <TableCell
                          key={`${quiz.title}-${vol.volId}`}
                          className="text-center py-4"
                        >
                          -
                        </TableCell>
                      );
                    }

                    const score = volData.totalScore || 0;
                    const badgeColor = getScoreBadgeColor(score);

                    return (
                      <TableCell
                        key={`${quiz.title}-${vol.volId}`}
                        className="text-center py-4"
                      >
                        <Badge
                          className={`${badgeColor.bg} ${badgeColor.text} border-0 font-semibold`}
                        >
                          {score.toFixed(2)}
                        </Badge>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {hasMoreData && (
        <div className="flex justify-center">
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="gap-2"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Tampilkan Lebih Sedikit
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Lihat Semua ({data.data.length})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Loading
// =============================================================================

const LoadingPage = () => (
  <div>
    <SectionTitle icon={HelpCircle} title="BimArena - Quiz" />
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-[260px] w-full rounded-xl" />
        <Skeleton className="h-[200px] w-full rounded-xl" />
      </div>
    </div>
  </div>
);

// =============================================================================
// Types
// =============================================================================

type DataTypeAll = {
  subCategories: {
    name: string;
    initial: string;
    website_sub_category_id: string;
    id: string;
    categoryId: string;
  }[];
  data: {
    id: string;
    title: string;
    subCategories: {
      id: string;
      name: string;
      initial: string;
      totalScore: number;
      averageScore: number;
    }[];
  }[];
  chartData: Record<string, string | number>[];
};

type DataTypeQuiz = {
  quizVolumes: {
    volId: string;
    volName: string | null;
    volNumber: number;
    initial: string;
  }[];
  data: {
    title: string;
    quizVolume: {
      isActive: undefined;
      volId: string;
      volName: string | null;
      volNumber: number;
      totalScore: number;
    }[];
  }[];
  chartData: Record<string, string | number>[];
};
