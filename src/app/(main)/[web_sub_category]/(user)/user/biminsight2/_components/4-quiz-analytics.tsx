'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGet } from '@/lib/fetch-helper/useGet';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Target,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { SectionTitle } from './section-title';

export const QuizAnalyticsTable = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_ROWS = 5;

  const {
    data: QuizData,
    isLoading: QuizDataIsLoading,
    error: QuizDataError,
  } = useGet<DataType>('/learningAnalytics/getUserAnalyticsQuiz', {
    params: {
      userId: id ? id : undefined,
    },
    useEffectDependencies: [id],
  });

  if (QuizDataIsLoading) return <LoadingPage />;
  if (!QuizData) return null;

  if (QuizDataError) {
    return <div>Error: {QuizDataError.message}</div>;
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
    if (score >= 60) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (score >= 40) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-red-100', text: 'text-red-700' };
  };

  const displayedData = isExpanded
    ? QuizData.data
    : QuizData.data.slice(0, INITIAL_ROWS);
  const hasMoreData = QuizData.data.length > INITIAL_ROWS;

  return (
    <div>
      <SectionTitle
        icon={Target}
        title="BimArena - Quiz"
      />
      <Card className="bg-white shadow-lg border-0 rounded-3xl overflow-hidden">
        <CardHeader
          className="pb-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <CardTitle
              className="text-xl font-bold flex items-center gap-3"
              style={{ color: mainColor }}
            >
              <div
                className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <HelpCircle
                  className="w-5 h-5"
                  style={{ color: mainColor }}
                />
              </div>
              Performa Quiz per Subkategori
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Skor total berdasarkan masing-masing quiz dan subkategorinya
            </CardDescription>
          </div>
          <div
            className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </CardHeader>

        <CardContent className="p-6">
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700 mb-2">
              <span className="font-semibold">Keterangan Inisial:</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {QuizData.subCategories.map((subCat) => (
                <div
                  key={subCat.id}
                  className="text-xs"
                >
                  <span className="font-semibold">{subCat.initial}</span> ={' '}
                  {subCat.name}
                </div>
              ))}
            </div>
          </div>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ backgroundColor: `${mainColor}08` }}>
                  <TableHead className="font-bold text-gray-800 py-3">
                    Quiz
                  </TableHead>
                  {QuizData.subCategories.map((subCat) => (
                    <TableHead
                      key={subCat.id}
                      className="font-bold text-gray-800 text-center py-3 hover:underline cursor-help"
                      title={subCat.name}
                    >
                      {subCat.initial}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={QuizData.subCategories.length + 1}
                      className="text-center py-8 text-gray-500"
                    >
                      <p className="text-sm">Data belum ada</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedData.map((quiz) => (
                    <TableRow
                      key={quiz.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-semibold text-gray-900 py-4 whitespace-nowrap">
                        {quiz.title}
                      </TableCell>
                      {QuizData.subCategories.map((subCat) => {
                        const subCatData = quiz.subCategories.find(
                          (s) => s.id === subCat.id,
                        );
                        const score = subCatData?.totalScore || 0;
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
            <div className="mt-4 flex justify-center">
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
                    Lihat Semua ({QuizData.data.length})
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const LoadingPage = () => {
  return (
    <div>
      <SectionTitle
        icon={BookOpen}
        title="BimArena - Tryout"
      />
      <Skeleton className="w-full h-[1200px] md:h-[670px]" />
    </div>
  );
};

type DataType = {
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
    }[];
  }[];
};
