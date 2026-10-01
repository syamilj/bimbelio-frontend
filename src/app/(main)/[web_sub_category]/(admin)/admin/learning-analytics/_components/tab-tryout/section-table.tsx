'use client';

import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Eye,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';

import { Button } from '@/components/ui/button';
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
import { getDateString, getHours } from '@/lib/utils';
import { Tryout, TryoutSession } from '@/types/database';

export const SectionTable = ({
  setSelectedId,
}: {
  setSelectedId: Dispatch<SetStateAction<string | null>>;
}) => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [expandedTryouts, setExpandedTryouts] = useState<Set<string>>(
    new Set(),
  );

  const {
    data: Tryouts,
    totalPages,
    isLoading,
  } = useGet<TryoutData[]>('/tryout/getTryout', {
    params: {
      page,
      take,
      search: searchTerm,
      type: 'TRYOUT',
    },
    useEffectDependencies: [page, take, searchTerm],
    debounceTime: 500,
  });

  const toggleExpanded = (tryoutId: string) => {
    const newSet = new Set(expandedTryouts);
    if (newSet.has(tryoutId)) {
      newSet.delete(tryoutId);
    } else {
      newSet.add(tryoutId);
    }
    setExpandedTryouts(newSet);
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
              List Tryout
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              List Tryout yang dikelola di BimArena
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
                placeholder="Cari judul tryout..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Expand</TableHead>
                <TableHead>No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Daftar</TableHead>
                <TableHead>Mengerjakan</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
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
              ) : Tryouts?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-gray-500"
                  >
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                Tryouts?.map((tryout, index) => (
                  <Fragment key={tryout.id}>
                    <TableRow>
                      <TableCell>
                        <button
                          onClick={() => toggleExpanded(tryout.id)}
                          className="inline-flex items-center justify-center p-1 rounded-3xl hover:bg-slate-200 transition-colors"
                        >
                          {expandedTryouts.has(tryout.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      <TableCell>{page * take - take + index + 1}</TableCell>
                      <TableCell>{tryout.title}</TableCell>
                      <TableCell className="font-medium text-black">
                        {tryout.totalRegistration}
                      </TableCell>
                      <TableCell className="text-black">
                        {tryout.totalJoin}
                      </TableCell>
                      <TableCell className="text-black">
                        {getDateString(tryout.startDate)} |{' '}
                        {getHours(tryout.startDate)}
                      </TableCell>
                      <TableCell className="text-black">
                        {getDateString(tryout.endDate)} |{' '}
                        {getHours(tryout.endDate)}
                      </TableCell>
                      <TableCell className="text-black">
                        {tryout.status}
                      </TableCell>
                      <TableCell className="flex justify-center">
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
                                setSelectedId(tryout.id);
                                const element =
                                  document.getElementById('section-tryout');
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
                                href={`/${website_sub_category_id}/admin/learning-analytics/tryout/${tryout.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </Link> */}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row - TryoutSession Details */}
                    {expandedTryouts.has(tryout.id) && (
                      <TableRow className="bg-slate-50/50 border-b border-slate-100">
                        <TableCell
                          colSpan={10}
                          className="p-0"
                        >
                          <div className="p-4 space-y-3">
                            {tryout.TryoutSession &&
                            tryout.TryoutSession.length > 0 ? (
                              tryout.TryoutSession.map((session, idx) => (
                                <div
                                  key={idx}
                                  className="border border-slate-200 rounded-3xl p-4 bg-white"
                                >
                                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-3">
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">
                                        Session Name
                                      </p>
                                      <p className="font-medium text-gray-900">
                                        {session.name}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">
                                        Sub Category
                                      </p>
                                      <p className="font-medium text-gray-900">
                                        {session.TryoutSubCategory?.name ||
                                          'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">
                                        Category
                                      </p>
                                      <p className="font-medium text-gray-900">
                                        {session.TryoutCategory?.name || 'N/A'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">
                                        Durasi
                                      </p>
                                      <p className="font-medium text-gray-900">
                                        {session.duration} min
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">
                                        Participants
                                      </p>
                                      <p className="font-medium text-gray-900">
                                        {session.TryoutSessionParticipant
                                          ?.length || 0}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 font-semibold">
                                        Total Pertanyaan
                                      </p>
                                      <p className="font-medium text-gray-900">
                                        {session.TryoutQuestion.length}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-slate-500">
                                No session details available
                              </p>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </Fragment>
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

type TryoutData = Tryout & {
  TryoutSession: (TryoutSession & {
    TryoutCategory: { name: string };
    TryoutSubCategory: { name: string };
    TryoutSessionParticipant: { userId: string }[];
    TryoutQuestion: {
      number: number;
      a_discrimination: number | null;
      b_difficulty: number | null;
      c_guessing: number | null;
      subCategory: string | null;
      subSubCategory: string | null;
    }[];
  })[];
  _count: {
    TryoutRegistration: number;
  };
  totalRegistration: number;
  totalJoin: number;
  irt: boolean;
};
