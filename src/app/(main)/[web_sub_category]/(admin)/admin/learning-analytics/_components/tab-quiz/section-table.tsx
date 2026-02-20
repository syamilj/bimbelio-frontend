'use client';

import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import ListPagination from '@/components/ui/list-pagination';
// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { cn } from '@/lib/utils';
import { QuizVolume, Tryout, TryoutSession } from '@/types/database';

export const SectionTable = ({
  setSelectedId,
}: {
  setSelectedId: Dispatch<SetStateAction<string | null>>;
}) => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [expandedVolumes, setExpandedVolumes] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: QuizVolumeData,
    isLoading,
    refetch,
    totalPages,
  } = useGet<
    (QuizVolume & {
      TryoutCategory: {
        id: string;
        name: string;
        TryoutSubCategory: {
          id: string;
          name: string;
          Tryout: (Tryout & {
            TryoutSession: TryoutSession;
          })[];
        }[];
      }[];
    })[]
  >('/quizTryout/getQuizVolume', {
    params: {
      page,
      take,
      search: searchTerm,
    },
    useEffectDependencies: [page, take, searchTerm],
    debounceTime: 500,
  });

  const toggleExpanded = (volumeId: string) => {
    const newSet = new Set(expandedVolumes);
    if (newSet.has(volumeId)) {
      newSet.delete(volumeId);
    } else {
      newSet.add(volumeId);
    }
    setExpandedVolumes(newSet);
  };

  const volumes = QuizVolumeData || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLIC':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PRIVATE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DRAFT':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl overflow-hidden">
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
                <BookOpen
                  className="w-5 h-5"
                  style={{ color: mainColor }}
                />
              </div>
              List Quiz Volume
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              List Quiz Volume yang dikelola di BimArena
            </CardDescription>
          </div>
          <div
            className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </CardHeader>
        <CardContent className="pb-0">
          <div className="grid gap-4 md:grid-cols-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari judul quiz volume..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow
                className="border-b-2"
                style={{ borderColor: `${mainColor}15` }}
              >
                <TableHead>Expand</TableHead>
                <TableHead>No</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell
                      colSpan={10}
                      className="h-[48.5px]"
                    >
                      <Skeleton className="w-full h-full rounded-3xl" />
                    </TableCell>
                  </TableRow>
                ))
              ) : volumes?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-gray-500"
                  >
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                volumes.map((volume, index) => (
                  <>
                    <TableRow key={volume.id}>
                      <TableCell>
                        <button
                          onClick={() => toggleExpanded(volume.id)}
                          className="inline-flex items-center justify-center p-1 rounded-3xl hover:bg-slate-200 transition-colors"
                        >
                          {expandedVolumes.has(volume.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>{page * take - take + index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-slate-900">
                            Volume {volume.number}
                          </p>
                          <p className="text-sm text-slate-500">
                            {volume.title}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(volume.createdAt)}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(volume.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            'inline-flex items-start px-3 py-1 rounded-full text-xs font-bold border',
                            getStatusColor(volume.status),
                          )}
                        >
                          {volume.status}
                        </span>
                      </TableCell>
                      <TableCell className="flex justify-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedId(volume.id);
                                const element =
                                  document.getElementById('section-volume');
                                if (element) {
                                  const targetPosition =
                                    element.getBoundingClientRect().top +
                                    window.scrollY -
                                    100;
                                  window.scrollTo({
                                    top: targetPosition,
                                    behavior: 'smooth',
                                  });
                                }
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                              {/* <Link
                                href={`/${website_sub_category_id}/admin/learning-analytics/bim-live/${liveclass.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </Link> */}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row - TryoutCategory */}
                    {expandedVolumes.has(volume.id) &&
                      volume.TryoutCategory && (
                        <TableRow className="bg-slate-50/50 border-b border-slate-100">
                          <TableCell
                            colSpan={7}
                            className="p-0"
                          >
                            <div className="p-4 space-y-4">
                              {volume.TryoutCategory.length > 0 ? (
                                volume.TryoutCategory.map((category) => (
                                  <div
                                    key={category.id}
                                    className="border border-slate-200 rounded-3xl p-4 bg-white"
                                  >
                                    <h4 className="font-bold text-slate-900 mb-3">
                                      {category.name}
                                    </h4>

                                    {/* TryoutSubCategory */}
                                    <div className="space-y-2 ml-4">
                                      {category.TryoutSubCategory.map(
                                        (subCategory) => (
                                          <div
                                            key={subCategory.id}
                                            className="border-l-2 border-slate-200 pl-4 py-2"
                                          >
                                            <p className="font-semibold text-slate-800 text-sm">
                                              {subCategory.name}
                                            </p>

                                            {/* Tryout & Session */}
                                            <div className="mt-2 space-y-1 flex flex-wrap gap-4">
                                              {subCategory.Tryout.map(
                                                (tryout) => (
                                                  <div
                                                    key={tryout.id}
                                                    className="text-xs bg-slate-100 rounded p-2 w-fit"
                                                  >
                                                    <p className="font-medium text-slate-700">
                                                      {tryout.title}
                                                    </p>
                                                    <div className="text-slate-600 mt-1 space-y-0.5">
                                                      <p>
                                                        Duration:{' '}
                                                        {
                                                          tryout.TryoutSession
                                                            .duration
                                                        }{' '}
                                                        mins
                                                      </p>
                                                      <p>
                                                        Session:{' '}
                                                        {
                                                          tryout.TryoutSession
                                                            .name
                                                        }
                                                      </p>
                                                      <p>
                                                        Status:{' '}
                                                        <span
                                                          className={cn(
                                                            'inline-block px-2 py-0.5 rounded text-xs font-semibold',
                                                            tryout.status ===
                                                              'PUBLIC'
                                                              ? 'bg-emerald-100 text-emerald-700'
                                                              : tryout.status ===
                                                                  'DRAFT'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : 'bg-slate-200 text-slate-700',
                                                          )}
                                                        >
                                                          {tryout.status}
                                                        </span>
                                                      </p>
                                                    </div>
                                                  </div>
                                                ),
                                              )}
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-500">
                                  No categories available
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                  </>
                ))
              )}
            </TableBody>
          </Table>
          <ListPagination
            className="border-t"
            onSizeChange={(size) => {
              setTake(size);
            }}
            onPageChange={(page) => {
              setPage(page);
            }}
            currentPage={page}
            totalPage={totalPages}
            pageSize={take}
          />
        </CardContent>
      </Card>
    </div>
  );
};
