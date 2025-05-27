'use client';

import { useLeaderboardContext } from '@/app/[web_sub_category]/(user)/user/leaderboard/_components/provider-leaderboard';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
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
import { ArrowUpDown, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import ButtonUpgradeTryout from '../../try-out/_components/ui/button-upgrade-tryout';

const ITEMS_PER_PAGE = 20;

// Pastikan type data participant jelas,
// sehingga kita bisa melakukan indexing dengan aman.
// Sesuaikan dengan struktur data aktual Anda.
interface CategoryResult {
  category: string;
  averageScore: number;
  isUnlocked: boolean;
}

interface Participant {
  rank: number;
  totalScore: number;
  averageScore: number;
  name: string;
  userId: string;
  school?: string;
  univChoice?: string;
  univStudyChoice?: string;
  image: string | null;
  categoryResult: CategoryResult[];
}

// Hanya definisikan field sorting yang valid.
// Jika Anda punya 3 kategori, maka Anda bisa menambahkannya di sini.
type SortField =
  | 'rank'
  | 'averageScore'
  | 'category_0'
  | 'category_1'
  | 'category_2';

type SortDirection = 'asc' | 'desc';

export function RankingTable() {
  const { RankingTryout, RankingTryoutIsLoading } = useLeaderboardContext();
  const { data: session } = useSession();

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
      return participant.categoryResult[categoryIndex]?.averageScore ?? 0;
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

  console.log({ paginatedData });

  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);

  // Komponen SortButton untuk memicu sorting
  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(field)}
      className="hover:bg-transparent p-0 h-8 font-medium text-muted-foreground"
    >
      {label}
      <ArrowUpDown
        className={cn(
          'ml-2 h-4 w-4 transition-transform duration-200',
          sortField === field && sortDirection === 'desc' && 'rotate-180',
        )}
      />
    </Button>
  );

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
    <div className="space-y-4">
      {/* Bagian Pencarian */}
      <div className="flex items-center gap-4">
        {!RankingTryoutIsLoading ? (
          <div className="relative w-full max-w-[600px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400" />
            <Input
              type="text"
              placeholder="Cari nama peserta..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>
        ) : (
          <Skeleton className="w-full max-w-[600px] h-10" />
        )}
      </div>

      {/* Bagian Tabel */}
      {!RankingTryoutIsLoading ? (
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[80px] font-semibold px-[.5rem] py-[1rem]">
                  <SortButton
                    field="rank"
                    label="Rank"
                  />
                </TableHead>
                <TableHead className="font-semibold">Nama</TableHead>
                <TableHead className="font-semibold">Sekolah</TableHead>
                <TableHead className="font-semibold">Target</TableHead>
                <TableHead className="text-right font-semibold">
                  <SortButton
                    field="averageScore"
                    label="Rata-rata"
                  />
                </TableHead>
                {/* <TableHead className="text-right font-semibold">
                  <SortButton
                    field="category_0"
                    label="TPS"
                  />
                </TableHead>
                <TableHead className="text-right font-semibold">
                  <SortButton
                    field="category_1"
                    label="Literasi"
                  />
                </TableHead>
                <TableHead className="text-right font-semibold">
                  <SortButton
                    field="category_2"
                    label="Matematika"
                  />
                </TableHead> */}
                {paginatedData.length > 0 &&
                  paginatedData[0].categoryResult.map((item, index) => (
                    <TableCell
                      key={index}
                      className="text-right tabular-nums"
                    >
                      {item.category}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center h-32 text-muted-foreground"
                  >
                    Data tidak ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((participant, i) => {
                  const isCurrentUser =
                    session?.user?.id === participant.userId;
                  return (
                    <TableRow
                      key={i}
                      className={cn(
                        isCurrentUser && 'bg-blue-50 hover:bg-blue-100',
                        'hover:bg-gray-50 transition-colors duration-200',
                      )}
                    >
                      <TableCell className="font-medium text-center px-[.5rem] py-[1rem]">
                        {participant.rank}
                      </TableCell>
                      <TableCell>{participant.name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {participant.school || '-'}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        <i>
                          {participant.univStudyChoice ||
                            'Jurusan tidak tersedia'}
                        </i>{' '}
                        -{' '}
                        {participant.univChoice || 'Universitas tidak tersedia'}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {participant.averageScore.toFixed(2)}
                      </TableCell>
                      {participant.categoryResult.map((item, index) => (
                        <TableCell
                          key={index}
                          className="text-right tabular-nums"
                        >
                          {item.isUnlocked ? (
                            item.averageScore.toFixed(2)
                          ) : (
                            <ButtonUpgradeTryout
                              tryoutId={RankingTryout?.tryoutId}
                            >
                              <span className="text-yellow-500 underline cursor-pointer">
                                Unlock this
                              </span>
                            </ButtonUpgradeTryout>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Skeleton className="h-[400px] w-full rounded-lg" />
      )}

      {/* Bagian Pagination */}
      {/* Wrapper pagination + info */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2">
        {/* Bagian Info Halaman & Jumlah Data */}
        <div className="text-sm text-muted-foreground text-center md:text-left">
          <p>
            Menampilkan {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
            {Math.min(
              currentPage * ITEMS_PER_PAGE,
              filteredAndSortedData.length,
            )}{' '}
            dari {filteredAndSortedData.length} entri
          </p>
          <p className="text-xs text-gray-500">
            Halaman {currentPage} dari {totalPages}
          </p>
        </div>

        {/* Bagian Pagination Control */}
        <Pagination className="flex items-center md:justify-end justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={
                  currentPage === 1
                    ? undefined
                    : () => setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                aria-disabled={currentPage === 1}
                className={cn(
                  'transition-colors',
                  currentPage === 1 && 'pointer-events-none opacity-50',
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
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                aria-disabled={currentPage === totalPages}
                className={cn(
                  'transition-colors',
                  currentPage === totalPages &&
                    'pointer-events-none opacity-50',
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default RankingTable;
