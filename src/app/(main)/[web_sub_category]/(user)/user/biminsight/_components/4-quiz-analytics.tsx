"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Button } from "@/components/ui/button";
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
import { getSubtestLabel } from "@/lib/utils/subtest";
import { BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  EmptyState,
  FilterChip,
  HeatmapCell,
  HeroBanner,
  InsightBanner,
  SectionLabel,
  SubtestTooltipHeader,
} from "./_primitives";


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

  const displayedData = isExpanded
    ? data.data
    : data.data.slice(0, INITIAL_ROWS);
  const hasMoreData = data.data.length > INITIAL_ROWS;

  return (
    <div className="space-y-4 px-5 py-5">
      <SectionLabel
        title="Per Subkategori"
        sub="Skor berdasarkan masing-masing quiz dan subkategorinya"
      />

      {/* Filter chips */}
      <div
        className="-mx-5 overflow-x-auto px-5 pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex min-w-max gap-1.5 md:min-w-0 md:flex-wrap">
          {SubCategory.map((sub, index) => (
            <FilterChip
              key={index}
              label={getSubtestLabel(sub.name, sub.website_sub_category_id)}
              active={selectedSubtests.includes(sub.id)}
              color={sub.color}
              onClick={() =>
                setSelectedSubtests((prev) =>
                  prev.includes(sub.id)
                    ? prev.filter((c) => c !== sub.id)
                    : [...prev, sub.id],
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Heatmap score table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-slate-200/80">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="py-3 font-bold text-slate-700">
                Quiz
              </TableHead>
              {data.subCategories
                .filter((s) => selectedSubtests.includes(s.id))
                .map((subCat) => (
                  <SubtestTooltipHeader
                    key={subCat.id}
                    initial={getSubtestLabel(subCat.name, subCat.website_sub_category_id)}
                    fullName={subCat.name}
                  />
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={selectedSubtests.length + 1}
                  className="py-8 text-center text-gray-500"
                >
                  <p className="text-sm">Data belum ada</p>
                </TableCell>
              </TableRow>
            ) : (
              displayedData.map((quiz) => (
                <TableRow
                  key={quiz.id}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="whitespace-nowrap py-3 font-semibold text-slate-800">
                    {quiz.title}
                  </TableCell>
                  {data.subCategories
                    .filter((s) => selectedSubtests.includes(s.id))
                    .map((subCat) => {
                      const subCatData = quiz.subCategories.find(
                        (s) => s.id === subCat.id,
                      );
                      if (!subCatData) {
                        return (
                          <TableCell
                            key={`${quiz.id}-${subCat.id}`}
                            className="py-3 text-center text-slate-300"
                          >
                            -
                          </TableCell>
                        );
                      }
                      return (
                        <HeatmapCell
                          key={`${quiz.id}-${subCat.id}`}
                          score={subCatData.averageScore || 0}
                        />
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

  const displayedData = isExpanded
    ? data.data
    : data.data.slice(0, INITIAL_ROWS);
  const hasMoreData = data.data.length > INITIAL_ROWS;

  return (
    <div className="space-y-4 px-5 py-5">
      <SectionLabel
        title="Per Volume"
        sub="Skor berdasarkan volume quiz"
      />

      {/* Filter chips */}
      <div
        className="-mx-5 overflow-x-auto px-5 pb-1"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="flex min-w-max gap-1.5 md:min-w-0 md:flex-wrap">
          {Volumes.map((vol, index) => (
            <FilterChip
              key={index}
              label={vol.initial}
              active={selectedVolumes.includes(vol.volId)}
              color={vol.color}
              onClick={() =>
                setSelectedVolumes((prev) =>
                  prev.includes(vol.volId)
                    ? prev.filter((c) => c !== vol.volId)
                    : [...prev, vol.volId],
                )
              }
            />
          ))}
        </div>
      </div>

      {/* Heatmap score table */}
      <div className="w-full overflow-x-auto rounded-3xl border border-slate-200/80">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="py-3 font-bold text-slate-700">
                Quiz
              </TableHead>
              {data.quizVolumes
                .filter((v) => selectedVolumes.includes(v.volId))
                .map((vol) => (
                  <SubtestTooltipHeader
                    key={vol.volId}
                    initial={vol.initial}
                    fullName={vol.volName || `Volume ${vol.volNumber}`}
                  />
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={selectedVolumes.length + 1}
                  className="py-8 text-center text-gray-500"
                >
                  <p className="text-sm">Data belum ada</p>
                </TableCell>
              </TableRow>
            ) : (
              displayedData.map((quiz) => (
                <TableRow
                  key={quiz.title}
                  className="transition-colors hover:bg-slate-50/50"
                >
                  <TableCell className="whitespace-nowrap py-3 font-semibold text-slate-800">
                    {quiz.title}
                  </TableCell>
                  {data.quizVolumes
                    .filter((v) => selectedVolumes.includes(v.volId))
                    .map((vol) => {
                      const volData = quiz.quizVolume.find(
                        (s) => s.volId === vol.volId,
                      );
                      if (!volData) {
                        return (
                          <TableCell
                            key={`${quiz.title}-${vol.volId}`}
                            className="py-3 text-center text-slate-300"
                          >
                            -
                          </TableCell>
                        );
                      }
                      return (
                        <HeatmapCell
                          key={`${quiz.title}-${vol.volId}`}
                          score={volData.totalScore || 0}
                        />
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
    <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-[260px] w-full rounded-3xl" />
        <Skeleton className="h-[200px] w-full rounded-3xl" />
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
