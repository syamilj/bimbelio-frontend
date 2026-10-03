'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollWrapper } from '@/components/ui/scroll-wrapper';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn, formatTwoDecimals, getInitials, Provinces } from '@/lib/utils';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Crown,
  Filter,
  Flame,
  GraduationCap,
  MapPin,
  Medal,
  Percent,
  School,
  Search,
  Shield,
  Trophy,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useQuizProvider } from '../_provider/_provider';
import { BASE_ONLINE_PARTICIPANTS, formatNumber } from './quiz-dummy';

type SortField = 'rank' | 'totalScore' | 'accuracy' | 'avgTime' | 'quizDone';
type SortOrder = 'asc' | 'desc';

export function QuizLeaderboard() {
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useLeaderboard: { TopThreeUsers, UserRankingList, SubCategoryLeaderboards },
  } = useQuizProvider();

  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const [activeLeaderboardTab, setActiveLeaderboardTab] =
    useState<string>('overall');

  const leaderboardTabs = useMemo(
    () => [
      {
        id: 'overall',
        label: 'Keseluruhan',
        topThreeUsers: TopThreeUsers,
        userRankingArray: UserRankingList,
      },
      ...SubCategoryLeaderboards.map((subCategory) => ({
        id: subCategory.id,
        label: getInitials(subCategory.name, { type: "Remove 'dan'" }),
        topThreeUsers: subCategory.topThreeUsers,
        userRankingArray: subCategory.userRankingArray,
      })),
    ],
    [TopThreeUsers, UserRankingList, SubCategoryLeaderboards],
  );

  const activeLeaderboard = useMemo(
    () =>
      leaderboardTabs.find((tab) => tab.id === activeLeaderboardTab) ||
      leaderboardTabs[0],
    [leaderboardTabs, activeLeaderboardTab],
  );

  const activeTopThreeUsers = activeLeaderboard?.topThreeUsers || [];

  useEffect(() => {
    if (!activeLeaderboard) {
      setActiveLeaderboardTab('overall');
      return;
    }

    setCurrentPage(1);
  }, [activeLeaderboard]);

  // State for sorting and filtering
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="h-3 w-3 text-slate-300" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3 w-3 text-slate-600" />
    ) : (
      <ArrowDown className="h-3 w-3 text-slate-600" />
    );
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'rank' ? 'asc' : 'desc');
    }
  };

  const getRankGradient = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-amber-500';
      case 2:
        return 'from-slate-300 to-slate-400';
      case 3:
        return 'from-orange-400 to-orange-500';
      default:
        return 'from-slate-200 to-slate-300';
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const formatDuration = (minutes: number) => {
    if (!Number.isFinite(minutes) || minutes <= 0) return '-';

    const roundedMinutes = Math.round(minutes);
    const hours = Math.floor(roundedMinutes / 60);
    const mins = roundedMinutes % 60;

    if (hours <= 0) return `${mins}m`;
    if (mins === 0) return `${hours}j`;

    return `${hours}j ${mins}m`;
  };

  // Filter and Sort Logic
  const filteredAndSortedData = useMemo(() => {
    let data = [...(activeLeaderboard?.userRankingArray || [])];

    // Filter berdasarkan search query (nama atau sekolah)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (entry) =>
          entry.User.name.toLowerCase().includes(query) ||
          entry.User.school.toLowerCase().includes(query),
      );
    }

    // Filter berdasarkan provinsi
    if (selectedProvince !== 'all') {
      data = data.filter((entry) => entry.User.province === selectedProvince);
    }

    // Sorting
    data.sort((a, b) => {
      let compareValue: number;

      switch (sortField) {
        case 'rank':
          compareValue = a.rank - b.rank;
          break;
        case 'totalScore':
          compareValue = a.totalScore - b.totalScore;
          break;
        case 'accuracy':
          compareValue = a.accuracy - b.accuracy;
          break;
        case 'avgTime':
          compareValue = a.averageTime - b.averageTime;
          break;
        case 'quizDone':
          compareValue = a.totalQuizFinished - b.totalQuizFinished;
          break;
        default:
          compareValue = 0;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return data;
  }, [activeLeaderboard, sortField, sortOrder, searchQuery, selectedProvince]);

  // Pagination Logic
  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedData.length / itemsPerPage),
  );
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, currentPage]);

  return (
    <div className="space-y-4 p-3 md:space-y-6 md:p-6">
      {/* Live Competition Banner */}
      <div
        className="flex flex-col items-start justify-between gap-2 rounded-3xl border px-3 py-2.5 shadow-sm sm:flex-row sm:items-center md:rounded-3xl md:px-5 md:py-3.5"
        style={{
          backgroundColor: `${mainColor}08`,
          borderColor: `${mainColor}15`,
        }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 md:h-2.5 md:w-2.5"></span>
          </span>
          <span className="text-[10px] font-bold text-slate-700 md:text-xs">
            LIVE RANKING
          </span>
          <span className="hidden text-[10px] text-slate-500 sm:inline md:text-xs">
            Update setiap 30 detik
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 md:gap-2 md:text-xs">
          <Flame className="h-3 w-3 text-orange-500 md:h-3.5 md:w-3.5" />
          <span className="font-bold text-slate-700">
            {formatNumber(BASE_ONLINE_PARTICIPANTS)}
          </span>
          <span>sedang battle</span>
        </div>
      </div>

      {/* Champion Podium */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-200 bg-gradient-to-b from-amber-50 via-amber-50/50 to-white p-4 shadow-sm md:rounded-3xl md:p-8">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 h-16 w-48 -translate-x-1/2 bg-gradient-to-b from-yellow-200/30 to-transparent blur-3xl md:h-32 md:w-96" />

        <div className="relative">
          <div className="mb-4 text-center md:mb-8">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1 text-[10px] font-bold text-white shadow-lg md:mb-3 md:gap-2 md:px-4 md:py-1.5 md:text-xs">
              <Trophy className="h-3 w-3 md:h-3.5 md:w-3.5" />
              CHAMPIONS
            </div>
            <h3 className="text-base font-black text-slate-800 md:text-xl">
              Top 3 Pejuang Terbaik
            </h3>
            <p className="mt-0.5 text-[10px] text-slate-500 md:mt-1 md:text-xs">
              {activeLeaderboard?.id === 'overall'
                ? 'Periode Volume Saat Ini'
                : `Subtes ${activeLeaderboard?.label}`}
            </p>
          </div>
          <div className="flex items-end justify-center gap-2 md:gap-8">
            {/* 2nd Place */}
            {activeTopThreeUsers[1] && (
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br shadow-lg md:mb-2 md:h-16 md:w-16',
                    getRankGradient(2),
                  )}
                >
                  <Medal className="h-5 w-5 text-white md:h-7 md:w-7" />
                </div>
                <p className="max-w-[70px] truncate text-center text-[10px] font-bold text-slate-800 md:max-w-[100px] md:text-sm">
                  {activeTopThreeUsers[1].User.name}
                </p>
                <p className="hidden text-[8px] text-slate-500 sm:block md:text-[10px]">
                  {activeTopThreeUsers[1].User.name}
                </p>
                <div className="mt-1.5 rounded-3xl bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-700 md:mt-2 md:rounded-3xl md:px-3 md:py-1.5 md:text-sm">
                  {formatTwoDecimals(activeTopThreeUsers[1].totalScore)}
                </div>
                <div
                  className={cn(
                    'mt-2 h-10 w-12 rounded-t-lg bg-gradient-to-t from-slate-200 to-slate-100 md:mt-3 md:h-16 md:w-20 md:rounded-t-xl',
                  )}
                />
              </div>
            )}

            {/* 1st Place */}
            {activeTopThreeUsers[0] && (
              <div className="-mt-4 flex flex-col items-center md:-mt-6">
                <div className="relative">
                  <Crown className="absolute -top-3 left-1/2 h-4 w-4 -translate-x-1/2 text-yellow-500 md:-top-5 md:h-6 md:w-6" />
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-full border-2 border-yellow-300 bg-gradient-to-br shadow-xl md:h-20 md:w-20 md:border-4',
                      getRankGradient(1),
                    )}
                  >
                    <Trophy className="h-6 w-6 text-white md:h-8 md:w-8" />
                  </div>
                </div>
                <p className="mt-1.5 max-w-[80px] truncate text-center text-[11px] font-bold text-slate-800 md:mt-2 md:max-w-[120px] md:text-sm">
                  {activeTopThreeUsers[0].User.name}
                </p>
                <p className="hidden text-[8px] text-slate-500 sm:block md:text-[10px]">
                  {activeTopThreeUsers[0].User.name}
                </p>
                <div className="mt-1.5 rounded-3xl bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-700 md:mt-2 md:rounded-3xl md:px-4 md:py-2 md:text-lg">
                  {formatTwoDecimals(activeTopThreeUsers[0].totalScore)}
                </div>
                <div
                  className={cn(
                    'mt-2 h-16 w-14 rounded-t-lg bg-gradient-to-t from-amber-200 to-amber-100 md:mt-3 md:h-24 md:w-24 md:rounded-t-xl',
                  )}
                />
              </div>
            )}

            {/* 3rd Place */}
            {activeTopThreeUsers[2] && (
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'mb-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br shadow-lg md:mb-2 md:h-16 md:w-16',
                    getRankGradient(3),
                  )}
                >
                  <Award className="h-5 w-5 text-white md:h-7 md:w-7" />
                </div>
                <p className="max-w-[70px] truncate text-center text-[10px] font-bold text-slate-800 md:max-w-[100px] md:text-sm">
                  {activeTopThreeUsers[2].User.name}
                </p>
                <p className="hidden text-[8px] text-slate-500 sm:block md:text-[10px]">
                  {activeTopThreeUsers[2].User.name}
                </p>
                <div className="mt-1.5 rounded-3xl bg-orange-100 px-2 py-1 text-[10px] font-black text-orange-700 md:mt-2 md:rounded-3xl md:px-3 md:py-1.5 md:text-sm">
                  {formatTwoDecimals(activeTopThreeUsers[2].totalScore)}
                </div>
                <div
                  className={cn(
                    'mt-2 h-8 w-12 rounded-t-lg bg-gradient-to-t from-orange-200 to-orange-100 md:mt-3 md:h-12 md:w-20 md:rounded-t-xl',
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div>
        <div className="mb-4 flex flex-col gap-3 md:mb-5 md:gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Shield
                className="h-4 w-4 md:h-5 md:w-5"
                style={{ color: mainColor }}
              />
              <h3 className="text-sm font-black text-slate-800 md:text-lg">
                Peringkat
              </h3>
            </div>
            <div className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500 md:px-3 md:py-1.5 md:text-xs">
              {(activeLeaderboard?.userRankingArray || []).length} peserta
            </div>
          </div>

          <Tabs
            value={activeLeaderboardTab}
            onValueChange={setActiveLeaderboardTab}
            className="w-full"
          >
            <ScrollWrapper className="overflow-x-auto">
              <TabsList className="inline-flex h-auto gap-1.5 rounded-full bg-slate-100/80 p-1">
                {leaderboardTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="rounded-full px-3 py-1.5 text-[10px] font-bold whitespace-nowrap data-[state=active]:text-white md:text-xs"
                    style={
                      activeLeaderboardTab === tab.id
                        ? { backgroundColor: mainColor }
                        : {}
                    }
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollWrapper>
          </Tabs>

          {/* Search and Filter Controls */}
          <div className="flex flex-col gap-2 sm:flex-row md:gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 md:h-4 md:w-4" />
              <Input
                placeholder="Cari nama/sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 rounded-3xl border-slate-200 pl-9 text-sm focus:border-slate-300 md:h-10 md:rounded-3xl md:pl-10"
              />
            </div>

            {/* Province Filter */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <MapPin className="h-3.5 w-3.5 text-slate-400 md:h-4 md:w-4" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="rounded-3xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-offset-2 focus:outline-none md:rounded-3xl md:px-4 md:py-2.5 md:text-sm"
                style={{
                  // @ts-ignore
                  '--tw-ring-color': mainColor,
                }}
              >
                <option value={'all'}>Semua Provinsi</option>
                {Provinces.map((province) => (
                  <option
                    key={province.province}
                    value={province.province}
                  >
                    {province.province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Chips - Horizontal scroll on mobile */}
          <ScrollWrapper className="-mx-3 overflow-x-auto px-3 pb-1 md:mx-0 md:px-0">
            <div className="flex min-w-max items-center gap-1.5 md:min-w-0 md:gap-2">
              <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500 md:gap-1.5 md:px-3 md:py-1.5 md:text-xs">
                <Filter className="h-3 w-3 md:h-3.5 md:w-3.5" />
                Urutkan:
              </span>
              {[
                { field: 'rank' as SortField, label: 'Rank' },
                { field: 'totalScore' as SortField, label: 'Skor' },
                { field: 'accuracy' as SortField, label: 'Akurasi' },
                { field: 'avgTime' as SortField, label: 'Waktu' },
                { field: 'quizDone' as SortField, label: 'Quiz' },
              ].map(({ field, label }) => (
                <button
                  key={field}
                  onClick={() => handleSort(field)}
                  className={cn(
                    'flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold transition-all md:gap-1.5 md:px-3 md:py-1.5 md:text-xs',
                    sortField === field
                      ? 'text-white shadow-md'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
                  )}
                  style={
                    sortField === field ? { backgroundColor: mainColor } : {}
                  }
                >
                  {label}
                  <SortIcon field={field} />
                </button>
              ))}
            </div>
          </ScrollWrapper>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:rounded-3xl">
          <div
            className="overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.lb-table::-webkit-scrollbar { display: none; }`}</style>
            <table className="lb-table w-full min-w-[800px]">
              <thead className="bg-slate-50">
                <tr>
                  {/* Rank */}
                  <th
                    className="sticky left-0 z-10 w-14 cursor-pointer bg-slate-50 px-3 py-3 text-left text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:bg-slate-100"
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center gap-1">
                      #
                      <SortIcon field="rank" />
                    </div>
                  </th>
                  {/* Siswa */}
                  <th className="min-w-[140px] px-3 py-3 text-left text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Siswa
                  </th>
                  {/* Skor */}
                  <th
                    className="cursor-pointer px-3 py-3 text-right text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:bg-slate-100"
                    onClick={() => handleSort('totalScore')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <Zap className="h-3 w-3" />
                      Skor
                      <SortIcon field="totalScore" />
                    </div>
                  </th>
                  {/* Quiz */}
                  <th
                    className="cursor-pointer px-3 py-3 text-center text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:bg-slate-100"
                    onClick={() => handleSort('quizDone')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Quiz
                      <SortIcon field="quizDone" />
                    </div>
                  </th>
                  {/* Akurasi */}
                  <th
                    className="cursor-pointer px-3 py-3 text-center text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:bg-slate-100"
                    onClick={() => handleSort('accuracy')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Percent className="h-3 w-3" />
                      Akurasi
                      <SortIcon field="accuracy" />
                    </div>
                  </th>
                  {/* Waktu */}
                  <th
                    className="cursor-pointer px-3 py-3 text-center text-[10px] font-bold tracking-wider text-slate-400 uppercase hover:bg-slate-100"
                    onClick={() => handleSort('avgTime')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" />
                      Waktu
                      <SortIcon field="avgTime" />
                    </div>
                  </th>
                  {/* Sekolah */}
                  <th className="px-3 py-3 text-left text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <div className="flex items-center gap-1">
                      <School className="h-3 w-3" />
                      Sekolah
                    </div>
                  </th>
                  {/* Provinsi */}
                  <th className="px-3 py-3 text-left text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Provinsi
                    </div>
                  </th>
                  {/* Target PTN */}
                  <th className="px-3 py-3 text-left text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      Target PTN
                    </div>
                  </th>
                  {/* Target PTN */}
                  <th className="px-3 py-3 text-left text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      Target Jurusan
                    </div>
                  </th>
                  {/* Passing Grade */}
                  <th className="px-3 py-3 text-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Passing Grade
                  </th>
                  {/* Status */}
                  <th className="px-3 py-3 text-center text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={12}
                      className="px-6 py-12 text-center text-slate-400"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search className="h-8 w-8 text-slate-300" />
                        <p className="font-medium">Tidak ada hasil ditemukan</p>
                        <p className="text-xs">
                          Coba ubah filter atau kata kunci pencarian
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((entry) => {
                    const isCurrentUser = entry.User.id === userId;
                    const passStatus = entry.isPassed;
                    return (
                      <tr
                        key={entry.rank}
                        className={cn(
                          'transition-colors hover:bg-slate-50',
                          isCurrentUser && 'bg-indigo-50',
                        )}
                        style={
                          isCurrentUser
                            ? { borderLeft: `4px solid ${mainColor}` }
                            : {}
                        }
                      >
                        {/* Rank */}
                        <td className="sticky left-0 z-10 bg-white px-3 py-3">
                          <span className="font-black text-slate-600">
                            #{entry.rank}
                          </span>
                        </td>
                        {/* Siswa */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-500">
                              {entry.User.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  'max-w-[120px] truncate text-sm font-bold',
                                  isCurrentUser
                                    ? 'text-indigo-600'
                                    : 'text-slate-900',
                                )}
                              >
                                {entry.User.name}
                              </p>
                              <p className="truncate text-[10px] text-slate-400">
                                {entry.User.school || 'Peserta'}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Skor */}
                        <td className="px-3 py-3 text-right">
                          <span className="text-sm font-black text-slate-900">
                            {formatTwoDecimals(entry.totalScore)}
                          </span>
                        </td>
                        {/* Quiz */}
                        <td className="px-3 py-3 text-center">
                          <Badge
                            variant="secondary"
                            className="text-[10px] font-bold"
                          >
                            {entry.totalQuizFinished}/{entry.totalQuiz}
                          </Badge>
                        </td>
                        {/* Akurasi */}
                        <td className="px-3 py-3 text-center">
                          <span
                            className={cn(
                              'text-sm font-bold',
                              entry.accuracy >= 90
                                ? 'text-emerald-600'
                                : entry.accuracy >= 80
                                  ? 'text-blue-600'
                                  : entry.accuracy >= 70
                                    ? 'text-amber-600'
                                    : 'text-slate-600',
                            )}
                          >
                            {formatTwoDecimals(entry.accuracy)}%
                          </span>
                        </td>
                        {/* Waktu */}
                        <td className="px-3 py-3 text-center">
                          <span className="text-sm font-medium text-slate-600">
                            {formatDuration(entry.averageTime)}
                          </span>
                        </td>
                        {/* Sekolah */}
                        <td className="px-3 py-3">
                          <span
                            className="block max-w-[150px] truncate text-sm text-slate-600"
                            title={entry.User.school}
                          >
                            {entry.User.school}
                          </span>
                        </td>
                        {/* Provinsi */}
                        <td className="px-3 py-3">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-medium whitespace-nowrap"
                          >
                            {entry.User.province}
                          </Badge>
                        </td>
                        {/* Target PTN */}
                        <td className="px-3 py-3">
                          <div className="flex flex-col">
                            <span
                              className="max-w-[220px] text-sm leading-snug text-slate-700"
                              title={entry.User.univChoice}
                            >
                              {entry.User.univChoice}
                            </span>
                          </div>
                        </td>
                        {/* Target PTN */}
                        <td className="px-3 py-3">
                          <div className="flex flex-col">
                            <span
                              className="max-w-[220px] text-sm leading-snug text-slate-700"
                              title={entry.User.majorChoice}
                            >
                              {entry.User.majorChoice}
                            </span>
                          </div>
                        </td>
                        {/* Passing Grade */}
                        <td className="px-3 py-3 text-center">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-bold whitespace-nowrap"
                          >
                            {entry.passingGradeText ||
                              (typeof entry.passingGradeValue === 'number'
                                ? entry.passingGradeValue.toFixed(0)
                                : '-')}
                          </Badge>
                        </td>
                        {/* Status */}
                        <td className="px-3 py-3 text-center">
                          {passStatus === null ? (
                            <span className="text-xs text-slate-400">-</span>
                          ) : (
                            <Badge
                              className={cn(
                                'text-[10px] font-bold',
                                passStatus
                                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-red-100 text-red-700 hover:bg-red-100',
                              )}
                            >
                              {passStatus ? 'Lolos' : 'Tidak Lolos'}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 p-3 md:p-4">
            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="text-center text-[10px] font-medium text-slate-600 sm:text-left md:text-sm">
                <span className="hidden sm:inline">
                  Halaman {currentPage} dari {totalPages} •{' '}
                </span>
                <span>
                  Menampilkan {paginatedData.length} dari{' '}
                  {filteredAndSortedData.length} peserta
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="h-7 rounded-full px-2 text-[10px] font-bold md:h-8 md:px-3 md:text-xs"
                >
                  <ChevronLeft className="h-3 w-3 md:mr-1" />
                  <span className="hidden md:inline">Sebelumnya</span>
                </Button>
                <div className="flex items-center gap-0.5 md:gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      const distance = Math.abs(page - currentPage);
                      return (
                        distance === 0 ||
                        distance === 1 ||
                        page === 1 ||
                        page === totalPages
                      );
                    })
                    .map((page, idx, arr) => (
                      <div key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-1 text-xs text-slate-400">
                            ...
                          </span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            'h-6 w-6 rounded-full p-0 text-[10px] font-bold md:h-8 md:w-8 md:text-xs',
                            currentPage === page && 'text-white',
                          )}
                          style={
                            currentPage === page
                              ? { backgroundColor: mainColor }
                              : {}
                          }
                        >
                          {page}
                        </Button>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="h-7 rounded-full px-2 text-[10px] font-bold md:h-8 md:px-3 md:text-xs"
                >
                  <span className="hidden md:inline">Selanjutnya</span>
                  <ChevronRight className="h-3 w-3 md:ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
