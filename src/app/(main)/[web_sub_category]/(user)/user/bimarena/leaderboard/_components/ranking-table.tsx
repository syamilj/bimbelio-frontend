'use client';

import { useLeaderboardContext } from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/leaderboard/_components/provider-leaderboard';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import ExcelJS from 'exceljs'; // Tambahkan import ini
import { ArrowUpDown, Search, Trophy } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import ButtonUpgradeTryout from '../../try-out/_components/ui/button-upgrade-tryout';
import { RankingTryoutProps } from './LeaderboardClient';

const ITEMS_PER_PAGE = 20;

type SortField =
  | 'rank'
  | 'averageScore'
  | 'category_0'
  | 'category_1'
  | 'category_2';

type SortDirection = 'asc' | 'desc';

type Participant = RankingTryoutProps['rankingData'][0];

export function RankingTable() {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  console.log({ RankingTryout });

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1);
    },
    [setSearchTerm, setCurrentPage],
  );

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
      setCurrentPage(1);
    },
    [sortField],
  );

  /**
   * Untuk mengatasi error “Element implicitly has an 'any' type ...”,
   * kita tidak bisa langsung melakukan indexing [sortField].
   * Kita bikin fungsi helper getValueBySortField untuk mengambil nilai
   * dari participant berdasarkan sortField yang diinginkan.
   */
  const getValueBySortField = (participant: Participant, field: SortField) => {
    if (field === 'rank') {
      return participant.rank;
    }
    if (field === 'averageScore') {
      return participant.averageScore;
    }
    if (field.startsWith('category_')) {
      const categoryIndex = Number(field.split('_')[1]);
      return participant.sessionResult[categoryIndex]?.totalScore ?? 0;
    }

    // Fallback (seharusnya tidak pernah terjadi jika type sudah ketat)
    return 0;
  };

  const filteredAndSortedData = useMemo(() => {
    // Jika data belum tersedia, return array kosong
    if (!RankingTryout?.rankingData) return [];

    let processedData = [...(RankingTryout.rankingData as Participant[])];

    // Filter by search term
    if (searchTerm.trim().length > 0) {
      const lowerSearch = searchTerm.toLowerCase();
      processedData = processedData.filter((participant) =>
        participant.name.toLowerCase().includes(lowerSearch),
      );
    }

    // Sorting
    processedData.sort((a, b) => {
      const aValue = getValueBySortField(a, sortField);
      const bValue = getValueBySortField(b, sortField);

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return processedData;
  }, [RankingTryout?.rankingData, searchTerm, sortField, sortDirection]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

  // Check if user has premium access (paid user)
  const isAdmin =
    session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';

  // Mock data for non-premium users to show scrollable columns
  const mockSessionResults =
    RankingTryout && RankingTryout?.rankingData.length > 0
      ? RankingTryout?.rankingData[0].sessionResult
      : [];

  // Komponen SortButton untuk memicu sorting
  const SortButton = ({
    field,
    label,
    isMapel = false,
  }: {
    field: SortField;
    label: string;
    isMapel?: boolean;
  }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className={cn(
        !isMapel &&
          'hover:bg-transparent p-0 h-8 font-medium text-muted-foreground',
        isMapel &&
          'hover:bg-transparent p-2 h-auto font-medium text-muted-foreground whitespace-normal break-words flex flex-col items-end justify-end',
      )}
    >
      {!isMapel && `${label}`}
      {isMapel && <span className="text-xs md:text-sm">{label}</span>}
      <ArrowUpDown
        className={cn(
          'ml-2 h-4 w-4 transition-transform duration-200',
          sortField === field && sortDirection === 'desc' && 'rotate-180',
        )}
      />
    </Button>
  );

  // Komponen SortButton untuk memicu sorting

  // Render manual pagination items (1, 2, 3, ...)
  const renderPaginationItems = () => {
    const items = [];

    // Always tampilkan halaman 1
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          // isActive = menandakan link sedang di halaman ini
          isActive={currentPage === 1}
          onClick={currentPage === 1 ? undefined : () => setCurrentPage(1)}
          aria-disabled={currentPage === 1}
          className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );

    // Ellipsis 1
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Halaman di sekitar currentPage
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(currentPage + 1, totalPages - 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={currentPage === i ? undefined : () => setCurrentPage(i)}
            aria-disabled={currentPage === i}
            className={cn(
              currentPage === i && 'pointer-events-none opacity-50',
            )}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    // Ellipsis 2
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Tampilkan halaman terakhir jika > 1
    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={
              currentPage === totalPages
                ? undefined
                : () => setCurrentPage(totalPages)
            }
            aria-disabled={currentPage === totalPages}
            className={cn(
              currentPage === totalPages && 'pointer-events-none opacity-50',
            )}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <Card className="bg-white shadow-sm border-2 border-gray-100 rounded-3xl overflow-hidden">
      <CardHeader className="pb-4 border-b-2 border-gray-100">
        <CardTitle className="text-xl font-black text-gray-900 flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: mainColor }}
            >
              <Trophy className="w-5 h-5 text-white" />
            </div>
            Tabel Peringkat
          </div>
          <ExportButton />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Premium Upgrade Banner - Moved to top */}
        {/* {!isPremiumUser && (
          <ButtonUpgradeTryout
            tryoutId={RankingTryout?.tryoutId}
            variant="banner"
          />
        )} */}

        {/* Search Section */}
        <div className="flex items-center gap-4">
          {!RankingTryoutIsLoading ? (
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari nama peserta..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-11 rounded-3xl border-2 border-gray-200 focus:border-2 bg-white transition-all"
                style={{
                  borderColor: searchTerm ? mainColor : undefined,
                }}
              />
            </div>
          ) : (
            <Skeleton className="w-full h-10 md:h-11 rounded-3xl" />
          )}
        </div>

        {/* Table Section - Mobile Responsive with Scrollable Locked Columns */}
        {!RankingTryoutIsLoading ? (
          <div className="rounded-3xl border-2 border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow
                    className="hover:bg-transparent border-b-2"
                    style={{
                      backgroundColor: `${mainColor}08`,
                      borderColor: `${mainColor}20`,
                    }}
                  >
                    <TableHead className="font-bold text-gray-700 text-xs md:text-sm min-w-[60px] sticky left-0 z-10 bg-white">
                      <SortButton
                        field="rank"
                        label="Rank"
                      />
                    </TableHead>
                    <TableHead className="font-bold text-gray-700 text-xs md:text-sm min-w-[140px] sticky left-[60px] z-10 bg-white">
                      Peserta
                    </TableHead>
                    <TableHead className="font-bold text-gray-700 text-xs md:text-sm min-w-[180px] hidden md:table-cell">
                      Target
                    </TableHead>
                    <TableHead className="text-right font-bold text-gray-700 text-xs md:text-sm min-w-[100px]">
                      <SortButton
                        field="averageScore"
                        label={RankingTryout?.isIRT ? 'Rata-rata' : 'Total'}
                      />
                    </TableHead>

                    {/* Session Score Columns - Always visible for scrolling desire */}
                    {(
                      RankingTryout?.rankingData?.[0]?.sessionResult ||
                      mockSessionResults
                    )?.map((session, index) => (
                      <TableHead
                        key={index}
                        className="text-right font-bold text-gray-700 text-xs md:text-sm min-w-[140px] relative"
                      >
                        <div className="flex items-center justify-end gap-1 relative h-auto">
                          <SortButton
                            field={`category_${index}` as SortField}
                            label={session?.subCategory || `Mapel ${index + 1}`}
                            isMapel={true}
                          />
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          4 +
                          (RankingTryout?.rankingData?.[0]?.sessionResult
                            ?.length || 0) +
                          (!isAdmin ? 3 : 0) // Add extra columns for non-premium
                        }
                        className="text-center h-32"
                      >
                        <div className="flex flex-col items-center gap-2 text-gray-500 py-8">
                          <Search className="w-6 h-6 md:w-8 md:h-8 opacity-50" />
                          <p className="font-medium text-sm md:text-base">
                            Data tidak ditemukan
                          </p>
                          <p className="text-xs md:text-sm">
                            Coba gunakan kata kunci lain
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((participant, i) => {
                      const isCurrentUser =
                        session?.user?.id === participant.userId;
                      const getRankBadge = (rank: number) => {
                        if (rank <= 3) {
                          const colors = {
                            1: 'bg-linear-to-r from-yellow-400 to-yellow-600 text-white',
                            2: 'bg-linear-to-r from-gray-300 to-gray-500 text-white',
                            3: 'bg-linear-to-r from-orange-400 to-orange-600 text-white',
                          };
                          return colors[rank as keyof typeof colors];
                        }
                        return 'bg-gray-100 text-gray-700';
                      };

                      return (
                        <TableRow
                          key={i}
                          className={cn(
                            'transition-all duration-200 border-b border-gray-100',
                            isCurrentUser
                              ? 'shadow-md scale-[1.01]'
                              : 'hover:bg-gray-50',
                          )}
                          style={{
                            backgroundColor: isCurrentUser
                              ? `${mainColor}10`
                              : undefined,
                            borderColor: isCurrentUser
                              ? `${mainColor}30`
                              : undefined,
                          }}
                        >
                          <TableCell className="py-3 md:py-4 sticky left-0 z-10 bg-white">
                            <div
                              className={cn(
                                'w-6 h-6 md:w-8 md:h-8 rounded-3xl flex items-center justify-center font-bold text-xs md:text-sm shadow-sm',
                                getRankBadge(participant.rank),
                              )}
                            >
                              {participant.rank}
                            </div>
                          </TableCell>
                          <TableCell className="py-3 md:py-4 sticky left-[60px] z-10 bg-white">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 flex items-center justify-center font-medium text-gray-600 text-xs md:text-sm">
                                {participant.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-gray-900 text-xs md:text-sm leading-tight">
                                  {participant.name}
                                  {isCurrentUser && (
                                    <span
                                      className="ml-1 md:ml-2 px-1 md:px-2 py-0.5 md:py-1 text-xs font-bold rounded-full text-white"
                                      style={{ backgroundColor: mainColor }}
                                    >
                                      Kamu
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-[200px]">
                                  {participant.school ||
                                    'Sekolah tidak tersedia'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-3 md:py-4 max-w-[180px] hidden md:table-cell">
                            <div className="space-y-1">
                              <div className="font-medium text-xs md:text-sm text-gray-900 truncate">
                                {participant.univStudyChoice ||
                                  'Jurusan belum dipilih'}
                              </div>
                              <div className="text-xs text-gray-500 truncate">
                                {participant.univChoice ||
                                  'Universitas belum dipilih'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-3 md:py-4">
                            <div className="space-y-1">
                              <div className="font-bold text-sm md:text-lg">
                                <span className="text-green-600">
                                  {RankingTryout?.isIRT
                                    ? participant.averageScore.toFixed(0)
                                    : participant.totalScore.toFixed(0)}
                                </span>
                                <span className="text-gray-400 text-xs md:text-sm font-normal">
                                  /
                                  {RankingTryout?.isIRT
                                    ? 1000
                                    : participant.maxScore}
                                </span>
                              </div>
                              <div className="w-12 md:w-16 ml-auto bg-gray-200 rounded-full h-1 md:h-1.5 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    width: `${(participant.totalScore / participant.maxScore) * 100}%`,
                                    backgroundColor: mainColor,
                                  }}
                                />
                              </div>
                            </div>
                          </TableCell>

                          {/* Session Score Columns - Enhanced with Premium Logic */}
                          {participant.sessionResult?.map(
                            (session, sessionIndex) => (
                              <TableCell
                                key={sessionIndex}
                                className="text-right py-3 md:py-4 relative"
                              >
                                {session.isUnlocked ? (
                                  <div className="space-y-1">
                                    <div className="font-semibold text-xs md:text-sm">
                                      <span className="text-green-600">
                                        {session.totalScore.toFixed(0)}
                                      </span>
                                      <span className="text-gray-400 text-xs font-normal">
                                        /{session.maxScore}
                                      </span>
                                    </div>
                                    <div className="w-8 md:w-12 ml-auto bg-gray-200 rounded-full h-1 overflow-hidden">
                                      <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                          width: `${(session.totalScore / session.maxScore) * 100}%`,
                                          backgroundColor: mainColor,
                                        }}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <ButtonUpgradeTryout
                                    tryoutId={RankingTryout?.tryoutId}
                                  >
                                    <span className="text-yellow-500 underline cursor-pointer text-xs">
                                      Buka ini
                                    </span>
                                  </ButtonUpgradeTryout>
                                )}
                              </TableCell>
                            ),
                          )}

                          {/* Extra locked columns for non-premium mobile users */}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <Skeleton className="h-96 w-full rounded-3xl" />
        )}

        {/* Enhanced Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <div className="text-xs md:text-sm text-gray-600 text-center sm:text-left">
            Menampilkan{' '}
            <span className="font-medium">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{' '}
            -{' '}
            <span className="font-medium">
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredAndSortedData.length,
              )}
            </span>{' '}
            dari{' '}
            <span className="font-medium">{filteredAndSortedData.length}</span>{' '}
            peserta
          </div>

          <Pagination>
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={
                    currentPage === 1
                      ? undefined
                      : () => setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={cn(
                    'rounded-3xl transition-colors text-xs md:text-sm px-2 md:px-3',
                    currentPage === 1
                      ? 'pointer-events-none opacity-50'
                      : 'hover:shadow-sm',
                  )}
                />
              </PaginationItem>

              {renderPaginationItems()}

              <PaginationItem>
                <PaginationNext
                  onClick={
                    currentPage === totalPages
                      ? undefined
                      : () =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages),
                          )
                  }
                  className={cn(
                    'rounded-3xl transition-colors text-xs md:text-sm px-2 md:px-3',
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'hover:shadow-sm',
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>

      {/* Add shimmer animation CSS */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </Card>
  );
}

export default RankingTable;

const ExportButton = () => {
  const { RankingTryout } = useLeaderboardContext();
  const { data: session } = useSession();

  const exportData = RankingTryout?.rankingData || [];

  const handleExport = async () => {
    if (!exportData.length) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Leaderboard');

    // Define headers
    const headers = [
      'Rank',
      'Name',
      'Email',
      'Sekolah',
      'Univ Pilihan',
      'Jurusan Pilihan',
      'Total Skor',
      'Rata-rata Skor',
    ];

    if (exportData[0]?.sessionResult) {
      exportData[0].sessionResult.forEach((session) => {
        headers.push(`${session.subCategory} (Score/Max)`);
      });
    }

    worksheet.addRow(headers);

    // Add data rows
    exportData.forEach((participant) => {
      const row = [
        participant.rank,
        participant.name,
        (participant as any).email,
        participant.school || '',
        participant.univChoice || '',
        participant.univStudyChoice || '',
        `${participant.totalScore.toFixed(2)} / ${participant.maxScore.toFixed(2)}`,
        `${participant.averageScore.toFixed(2)} / ${participant.sessionResult.length > 0 ? participant.sessionResult[0].maxScore.toFixed(2) : '-'}`,
        ...participant.sessionResult.map(
          (s) => `${s.totalScore.toFixed(2)} / ${s.maxScore}`,
        ),
      ];
      worksheet.addRow(row);
    });

    // Export to CSV
    const buffer = await workbook.csv.writeBuffer();
    const blob = new Blob([buffer], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leaderboard.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (session?.user.role !== 'ADMIN' && session?.user?.role !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={
        !RankingTryout ||
        (RankingTryout && RankingTryout.rankingData.length === 0)
      }
    >
      Export CSV
    </Button>
  );
};
