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

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
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
      return <ArrowUpDown className="w-3 h-3 text-slate-300" />;
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-slate-600" />
    ) : (
      <ArrowDown className="w-3 h-3 text-slate-600" />
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
      let compareValue = 0;

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
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Live Competition Banner */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-3xl md:rounded-3xl px-3 md:px-5 py-2.5 md:py-3.5 border shadow-sm"
        style={{
          backgroundColor: `${mainColor}08`,
          borderColor: `${mainColor}15`,
        }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] md:text-xs font-bold text-slate-700">
            LIVE RANKING
          </span>
          <span className="text-[10px] md:text-xs text-slate-500 hidden sm:inline">
            Update setiap 30 detik
          </span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-slate-500">
          <Flame className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-500" />
          <span className="font-bold text-slate-700">
            {formatNumber(BASE_ONLINE_PARTICIPANTS)}
          </span>
          <span>sedang battle</span>
        </div>
      </div>

      {/* Champion Podium */}
      <div className="relative overflow-hidden p-4 md:p-8 bg-gradient-to-b from-amber-50 via-amber-50/50 to-white rounded-3xl md:rounded-3xl border border-amber-200 shadow-sm">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 md:w-96 h-16 md:h-32 bg-gradient-to-b from-yellow-200/30 to-transparent blur-3xl" />

        <div className="relative">
          <div className="text-center mb-4 md:mb-8">
            <div className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1 md:py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full text-white text-[10px] md:text-xs font-bold shadow-lg mb-2 md:mb-3">
              <Trophy className="w-3 h-3 md:w-3.5 md:h-3.5" />
              CHAMPIONS
            </div>
            <h3 className="text-base md:text-xl font-black text-slate-800">
              Top 3 Pejuang Terbaik
            </h3>
            <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">
              {activeLeaderboard?.id === 'overall'
                ? 'Periode Volume Saat Ini'
                : `Subtes ${activeLeaderboard?.label}`}
            </p>
          </div>
          <div className="flex justify-center items-end gap-2 md:gap-8">
            {/* 2nd Place */}
            {activeTopThreeUsers[1] && (
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg mb-1.5 md:mb-2',
                    getRankGradient(2),
                  )}
                >
                  <Medal className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <p className="font-bold text-slate-800 text-[10px] md:text-sm text-center truncate max-w-[70px] md:max-w-[100px]">
                  {activeTopThreeUsers[1].User.name}
                </p>
                <p className="text-[8px] md:text-[10px] text-slate-500 hidden sm:block">
                  {activeTopThreeUsers[1].User.name}
                </p>
                <div className="mt-1.5 md:mt-2 bg-slate-100 text-slate-700 font-black px-2 md:px-3 py-1 md:py-1.5 rounded-3xl md:rounded-3xl text-[10px] md:text-sm">
                  {formatTwoDecimals(activeTopThreeUsers[1].totalScore)}
                </div>
                <div
                  className={cn(
                    'w-12 md:w-20 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-lg md:rounded-t-xl mt-2 md:mt-3 h-10 md:h-16',
                  )}
                />
              </div>
            )}

            {/* 1st Place */}
            {activeTopThreeUsers[0] && (
              <div className="flex flex-col items-center -mt-4 md:-mt-6">
                <div className="relative">
                  <Crown className="w-4 h-4 md:w-6 md:h-6 text-yellow-500 absolute -top-3 md:-top-5 left-1/2 -translate-x-1/2" />
                  <div
                    className={cn(
                      'w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br flex items-center justify-center shadow-xl border-2 md:border-4 border-yellow-300',
                      getRankGradient(1),
                    )}
                  >
                    <Trophy className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                </div>
                <p className="font-bold text-slate-800 text-[11px] md:text-sm text-center mt-1.5 md:mt-2 truncate max-w-[80px] md:max-w-[120px]">
                  {activeTopThreeUsers[0].User.name}
                </p>
                <p className="text-[8px] md:text-[10px] text-slate-500 hidden sm:block">
                  {activeTopThreeUsers[0].User.name}
                </p>
                <div className="mt-1.5 md:mt-2 bg-amber-100 text-amber-700 font-black px-2.5 md:px-4 py-1 md:py-2 rounded-3xl md:rounded-3xl text-xs md:text-lg">
                  {formatTwoDecimals(activeTopThreeUsers[0].totalScore)}
                </div>
                <div
                  className={cn(
                    'w-14 md:w-24 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-lg md:rounded-t-xl mt-2 md:mt-3 h-16 md:h-24',
                  )}
                />
              </div>
            )}

            {/* 3rd Place */}
            {activeTopThreeUsers[2] && (
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg mb-1.5 md:mb-2',
                    getRankGradient(3),
                  )}
                >
                  <Award className="w-5 h-5 md:w-7 md:h-7 text-white" />
                </div>
                <p className="font-bold text-slate-800 text-[10px] md:text-sm text-center truncate max-w-[70px] md:max-w-[100px]">
                  {activeTopThreeUsers[2].User.name}
                </p>
                <p className="text-[8px] md:text-[10px] text-slate-500 hidden sm:block">
                  {activeTopThreeUsers[2].User.name}
                </p>
                <div className="mt-1.5 md:mt-2 bg-orange-100 text-orange-700 font-black px-2 md:px-3 py-1 md:py-1.5 rounded-3xl md:rounded-3xl text-[10px] md:text-sm">
                  {formatTwoDecimals(activeTopThreeUsers[2].totalScore)}
                </div>
                <div
                  className={cn(
                    'w-12 md:w-20 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-lg md:rounded-t-xl mt-2 md:mt-3 h-8 md:h-12',
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div>
        <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 md:gap-2">
              <Shield
                className="w-4 h-4 md:w-5 md:h-5"
                style={{ color: mainColor }}
              />
              <h3 className="font-black text-slate-800 text-sm md:text-lg">
                Peringkat
              </h3>
            </div>
            <div className="text-[10px] md:text-xs text-slate-500 bg-slate-100 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium">
              {(activeLeaderboard?.userRankingArray || []).length} peserta
            </div>
          </div>

          <Tabs
            value={activeLeaderboardTab}
            onValueChange={setActiveLeaderboardTab}
            className="w-full"
          >
            <ScrollWrapper className="overflow-x-auto">
              <TabsList className="inline-flex h-auto gap-1.5 bg-slate-100/80 p-1 rounded-full">
                {leaderboardTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold whitespace-nowrap data-[state=active]:text-white"
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
          <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
              <Input
                placeholder="Cari nama/sekolah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 md:pl-10 rounded-3xl md:rounded-3xl border-slate-200 focus:border-slate-300 text-sm h-9 md:h-10"
              />
            </div>

            {/* Province Filter */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-400" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-3 md:px-4 py-2 md:py-2.5 rounded-3xl md:rounded-3xl border border-slate-200 text-xs md:text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-offset-2"
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
          <ScrollWrapper className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 pb-1">
            <div className="flex gap-1.5 md:gap-2 items-center min-w-max md:min-w-0">
              <span className="text-[10px] md:text-xs text-slate-500 font-medium flex items-center gap-1 md:gap-1.5 bg-slate-50 px-2 md:px-3 py-1 md:py-1.5 rounded-full flex-shrink-0">
                <Filter className="w-3 h-3 md:w-3.5 md:h-3.5" />
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
                    'px-2 md:px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold transition-all flex items-center gap-1 md:gap-1.5 flex-shrink-0',
                    sortField === field
                      ? 'text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200',
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

        <div className="bg-white rounded-3xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
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
                    className="px-3 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider w-14 cursor-pointer hover:bg-slate-100 sticky left-0 bg-slate-50 z-10"
                    onClick={() => handleSort('rank')}
                  >
                    <div className="flex items-center gap-1">
                      #
                      <SortIcon field="rank" />
                    </div>
                  </th>
                  {/* Siswa */}
                  <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider min-w-[140px]">
                    Siswa
                  </th>
                  {/* Skor */}
                  <th
                    className="px-3 py-3 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('totalScore')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <Zap className="w-3 h-3" />
                      Skor
                      <SortIcon field="totalScore" />
                    </div>
                  </th>
                  {/* Quiz */}
                  <th
                    className="px-3 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('quizDone')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Quiz
                      <SortIcon field="quizDone" />
                    </div>
                  </th>
                  {/* Akurasi */}
                  <th
                    className="px-3 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('accuracy')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Percent className="w-3 h-3" />
                      Akurasi
                      <SortIcon field="accuracy" />
                    </div>
                  </th>
                  {/* Waktu */}
                  <th
                    className="px-3 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                    onClick={() => handleSort('avgTime')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      Waktu
                      <SortIcon field="avgTime" />
                    </div>
                  </th>
                  {/* Sekolah */}
                  <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <School className="w-3 h-3" />
                      Sekolah
                    </div>
                  </th>
                  {/* Provinsi */}
                  <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Provinsi
                    </div>
                  </th>
                  {/* Target PTN */}
                  <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      Target PTN
                    </div>
                  </th>
                  {/* Target PTN */}
                  <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      Target Jurusan
                    </div>
                  </th>
                  {/* Passing Grade */}
                  <th className="px-3 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Passing Grade
                  </th>
                  {/* Status */}
                  <th className="px-3 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                        <Search className="w-8 h-8 text-slate-300" />
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
                          'hover:bg-slate-50 transition-colors',
                          isCurrentUser && 'bg-indigo-50',
                        )}
                        style={
                          isCurrentUser
                            ? { borderLeft: `4px solid ${mainColor}` }
                            : {}
                        }
                      >
                        {/* Rank */}
                        <td className="px-3 py-3 sticky left-0 bg-white z-10">
                          <span className="font-black text-slate-600">
                            #{entry.rank}
                          </span>
                        </td>
                        {/* Siswa */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">
                              {entry.User.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  'font-bold text-sm truncate max-w-[120px]',
                                  isCurrentUser
                                    ? 'text-indigo-600'
                                    : 'text-slate-900',
                                )}
                              >
                                {entry.User.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {entry.User.school || 'Peserta'}
                              </p>
                            </div>
                          </div>
                        </td>
                        {/* Skor */}
                        <td className="px-3 py-3 text-right">
                          <span className="font-black text-slate-900 text-sm">
                            {formatTwoDecimals(entry.totalScore)}
                          </span>
                        </td>
                        {/* Quiz */}
                        <td className="px-3 py-3 text-center">
                          <Badge
                            variant="secondary"
                            className="font-bold text-[10px]"
                          >
                            {entry.totalQuizFinished}/{entry.totalQuiz}
                          </Badge>
                        </td>
                        {/* Akurasi */}
                        <td className="px-3 py-3 text-center">
                          <span
                            className={cn(
                              'font-bold text-sm',
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
                          <span className="text-sm text-slate-600 font-medium">
                            {formatDuration(entry.averageTime)}
                          </span>
                        </td>
                        {/* Sekolah */}
                        <td className="px-3 py-3">
                          <span
                            className="text-sm text-slate-600 truncate block max-w-[150px]"
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
                              className="text-sm text-slate-700 max-w-[220px] leading-snug"
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
                              className="text-sm text-slate-700 max-w-[220px] leading-snug"
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

          <div className="p-3 md:p-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[10px] md:text-sm text-slate-600 font-medium text-center sm:text-left">
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
                  className="rounded-full font-bold text-[10px] md:text-xs h-7 md:h-8 px-2 md:px-3"
                >
                  <ChevronLeft className="w-3 h-3 md:mr-1" />
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
                          <span className="px-1 text-slate-400 text-xs">
                            ...
                          </span>
                        )}
                        <Button
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            'rounded-full font-bold text-[10px] md:text-xs w-6 h-6 md:w-8 md:h-8 p-0',
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
                  className="rounded-full font-bold text-[10px] md:text-xs h-7 md:h-8 px-2 md:px-3"
                >
                  <span className="hidden md:inline">Selanjutnya</span>
                  <ChevronRight className="w-3 h-3 md:ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
