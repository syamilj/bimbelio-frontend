'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  Award,
  Crown,
  Medal,
  Trophy,
  Swords,
  Flame,
  Target,
  TrendingUp,
  Zap,
  Shield,
  GraduationCap,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MapPin,
  School,
  Filter,
  Search,
  Clock,
  Percent,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeaderboardEntry, UserStats, TargetUniversity } from './quiz-types';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  TOTAL_PARTICIPANTS,
  BASE_ONLINE_PARTICIPANTS,
  formatNumber,
} from './quiz-dummy';

type SortField = 'rank' | 'totalScore' | 'accuracy' | 'avgTime' | 'quizDone';
type SortOrder = 'asc' | 'desc';

interface QuizLeaderboardProps {
  userStats: UserStats;
  leaderboard: LeaderboardEntry[];
  targetUniversity?: TargetUniversity;
}

export function QuizLeaderboard({ userStats, leaderboard, targetUniversity }: QuizLeaderboardProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // State for sorting and filtering
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string>('all');

  // Get unique provinces
  const provinces = useMemo(() => {
    const uniqueProvinces = [...new Set(leaderboard.map(e => e.province))];
    return ['all', ...uniqueProvinces];
  }, [leaderboard]);

  // Sort and filter leaderboard
  const filteredLeaderboard = useMemo(() => {
    let result = [...leaderboard];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(query) ||
        e.school.toLowerCase().includes(query) ||
        e.username.toLowerCase().includes(query)
      );
    }

    // Filter by province
    if (selectedProvince !== 'all') {
      result = result.filter(e => e.province === selectedProvince);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'totalScore':
          comparison = b.totalScore - a.totalScore;
          break;
        case 'accuracy':
          comparison = b.accuracy - a.accuracy;
          break;
        case 'avgTime':
          comparison = a.avgTime - b.avgTime;
          break;
        case 'quizDone':
          comparison = b.quizDone - a.quizDone;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [leaderboard, searchQuery, selectedProvince, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'rank' ? 'asc' : 'desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-300" />;
    return sortOrder === 'asc'
      ? <ArrowUp className="w-3 h-3 text-slate-600" />
      : <ArrowDown className="w-3 h-3 text-slate-600" />;
  };

  const rankChange = userStats.previousRank - userStats.currentRank;
  const top3 = leaderboard.slice(0, 3);
  const restOfLeaderboard = filteredLeaderboard.filter(e => e.rank > 3);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-white" />;
      case 2:
        return <Medal className="w-7 h-7 text-white" />;
      case 3:
        return <Award className="w-7 h-7 text-white" />;
      default:
        return null;
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

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return 'h-24';
      case 2:
        return 'h-16';
      case 3:
        return 'h-12';
      default:
        return 'h-8';
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6">
      {/* Live Competition Banner */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-3xl md:rounded-3xl px-3 md:px-5 py-2.5 md:py-3.5 border shadow-sm"
        style={{ backgroundColor: `${mainColor}08`, borderColor: `${mainColor}15` }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] md:text-xs font-bold text-slate-700">LIVE RANKING</span>
          <span className="text-[10px] md:text-xs text-slate-500 hidden sm:inline">Update setiap 30 detik</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-slate-500">
          <Flame className="w-3 h-3 md:w-3.5 md:h-3.5 text-orange-500" />
          <span className="font-bold text-slate-700">{formatNumber(BASE_ONLINE_PARTICIPANTS)}</span>
          <span>sedang battle</span>
        </div>
      </div>

      {/* Your Battle Card */}
      <div
        className="relative overflow-hidden rounded-3xl md:rounded-3xl border-2 shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`,
          borderColor: `${mainColor}`,
        }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 rounded-full bg-white/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 md:w-48 h-24 md:h-48 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative p-4 md:p-6">
          {/* Header with Rank */}
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <div className="relative">
              <div className="w-14 h-14 md:w-20 md:h-20 rounded-3xl md:rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl md:text-3xl font-black text-white shadow-xl border-2 border-white/30">
                #{userStats.currentRank}
              </div>
              {rankChange > 0 && (
                <div className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 bg-emerald-500 text-white px-1.5 md:px-2 py-0.5 rounded-full text-[9px] md:text-xs font-bold flex items-center gap-0.5 shadow-lg">
                  <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" />+{rankChange}
                </div>
              )}
            </div>
            <div className="text-white flex-1">
              <p className="text-[9px] md:text-xs font-bold text-white/60 uppercase tracking-wider mb-0.5 md:mb-1">
                🎮 Posisi Battle Kamu
              </p>
              <p className="text-lg md:text-3xl font-black">Peringkat #{userStats.currentRank}</p>
              <p className="text-xs md:text-sm text-white/80 font-medium">dari {formatNumber(TOTAL_PARTICIPANTS)} pejuang</p>
            </div>
          </div>

          {/* Stats - Horizontal scroll on mobile */}
          <div className="relative">
            <div
              className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <style>{`.lb-stats::-webkit-scrollbar { display: none; }`}</style>
              <div className="lb-stats flex gap-2 md:gap-3 min-w-max md:min-w-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl md:rounded-3xl p-3 md:p-4 border border-white/20 text-center flex-shrink-0 w-[100px] md:w-auto md:min-w-[100px]">
                <div className="flex items-center gap-1 md:gap-1.5 justify-center mb-0.5 md:mb-1">
                  <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-300" />
                  <p className="text-[8px] md:text-[10px] font-bold text-white/60 uppercase">Skor</p>
                </div>
                <p className="text-lg md:text-2xl font-black text-white">
                  {userStats.totalScore.toLocaleString()}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-3xl md:rounded-3xl p-3 md:p-4 border border-white/20 text-center flex-shrink-0 w-[120px] md:w-auto md:min-w-[140px] md:max-w-[180px]">
                <div className="flex items-center gap-1 md:gap-1.5 justify-center mb-0.5 md:mb-1">
                  <GraduationCap className="w-3 h-3 md:w-4 md:h-4 text-blue-300" />
                  <p className="text-[8px] md:text-[10px] font-bold text-white/60 uppercase">Target</p>
                </div>
                <p className="text-xs md:text-sm font-black text-white line-clamp-1" title={targetUniversity?.name}>
                  {targetUniversity?.name || 'Pilih PTN'}
                </p>
                <p className="text-[9px] md:text-[10px] text-white/60 line-clamp-1">{targetUniversity?.major || '-'}</p>
              </div>

              <button
                className="px-4 md:px-5 py-2.5 md:py-3 rounded-3xl font-bold text-xs md:text-sm transition-all shadow-lg flex items-center gap-1.5 md:gap-2 bg-white hover:bg-white/90 whitespace-nowrap flex-shrink-0"
                style={{ color: mainColor }}
              >
                <Swords className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Battle
              </button>
              </div>
            </div>
            {/* Scroll fade indicator */}
            <div className="absolute right-0 top-0 bottom-2 w-6 bg-gradient-to-l from-transparent to-transparent pointer-events-none md:hidden" style={{ background: `linear-gradient(to left, ${mainColor}40, transparent)` }} />
          </div>
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
            <h3 className="text-base md:text-xl font-black text-slate-800">Top 3 Pejuang Terbaik</h3>
            <p className="text-[10px] md:text-xs text-slate-500 mt-0.5 md:mt-1">Periode Volume Saat Ini</p>
          </div>
        <div className="flex justify-center items-end gap-2 md:gap-8">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg mb-1.5 md:mb-2',
                  getRankGradient(2)
                )}
              >
                <Medal className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <p className="font-bold text-slate-800 text-[10px] md:text-sm text-center truncate max-w-[70px] md:max-w-[100px]">
                {top3[1].name}
              </p>
              <p className="text-[8px] md:text-[10px] text-slate-500 hidden sm:block">{top3[1].username}</p>
              <div className="mt-1.5 md:mt-2 bg-slate-100 text-slate-700 font-black px-2 md:px-3 py-1 md:py-1.5 rounded-3xl md:rounded-3xl text-[10px] md:text-sm">
                {top3[1].totalScore.toLocaleString()}
              </div>
              <div
                className={cn(
                  'w-12 md:w-20 bg-gradient-to-t from-slate-200 to-slate-100 rounded-t-lg md:rounded-t-xl mt-2 md:mt-3 h-10 md:h-16'
                )}
              />
            </div>
          )}

          {/* 1st Place */}
          {top3[0] && (
            <div className="flex flex-col items-center -mt-4 md:-mt-6">
              <div className="relative">
                <Crown className="w-4 h-4 md:w-6 md:h-6 text-yellow-500 absolute -top-3 md:-top-5 left-1/2 -translate-x-1/2" />
                <div
                  className={cn(
                    'w-12 h-12 md:w-20 md:h-20 rounded-full bg-gradient-to-br flex items-center justify-center shadow-xl border-2 md:border-4 border-yellow-300',
                    getRankGradient(1)
                  )}
                >
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
              </div>
              <p className="font-bold text-slate-800 text-[11px] md:text-sm text-center mt-1.5 md:mt-2 truncate max-w-[80px] md:max-w-[120px]">
                {top3[0].name}
              </p>
              <p className="text-[8px] md:text-[10px] text-slate-500 hidden sm:block">{top3[0].username}</p>
              <div className="mt-1.5 md:mt-2 bg-amber-100 text-amber-700 font-black px-2.5 md:px-4 py-1 md:py-2 rounded-3xl md:rounded-3xl text-xs md:text-lg">
                {top3[0].totalScore.toLocaleString()}
              </div>
              <div
                className={cn(
                  'w-14 md:w-24 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-lg md:rounded-t-xl mt-2 md:mt-3 h-16 md:h-24'
                )}
              />
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-10 h-10 md:w-16 md:h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg mb-1.5 md:mb-2',
                  getRankGradient(3)
                )}
              >
                <Award className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </div>
              <p className="font-bold text-slate-800 text-[10px] md:text-sm text-center truncate max-w-[70px] md:max-w-[100px]">
                {top3[2].name}
              </p>
              <p className="text-[8px] md:text-[10px] text-slate-500 hidden sm:block">{top3[2].username}</p>
              <div className="mt-1.5 md:mt-2 bg-orange-100 text-orange-700 font-black px-2 md:px-3 py-1 md:py-1.5 rounded-3xl md:rounded-3xl text-[10px] md:text-sm">
                {top3[2].totalScore.toLocaleString()}
              </div>
              <div
                className={cn(
                  'w-12 md:w-20 bg-gradient-to-t from-orange-200 to-orange-100 rounded-t-lg md:rounded-t-xl mt-2 md:mt-3 h-8 md:h-12'
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
              <Shield className="w-4 h-4 md:w-5 md:h-5" style={{ color: mainColor }} />
              <h3 className="font-black text-slate-800 text-sm md:text-lg">Peringkat</h3>
            </div>
            <div className="text-[10px] md:text-xs text-slate-500 bg-slate-100 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-medium">
              {filteredLeaderboard.length} peserta
            </div>
          </div>

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
                  '--tw-ring-color': mainColor
                }}
              >
                {provinces.map((province) => (
                  <option key={province} value={province}>
                    {province === 'all' ? 'Semua Provinsi' : province}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Chips - Horizontal scroll on mobile */}
          <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 pb-1">
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
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  )}
                  style={sortField === field ? { backgroundColor: mainColor } : {}}
                >
                  {label}
                  <SortIcon field={field} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
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
                  {/* B/S/K */}
                  <th className="px-3 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    B / S / K
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {restOfLeaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-slate-300" />
                        <p className="font-medium">Tidak ada hasil ditemukan</p>
                        <p className="text-xs">Coba ubah filter atau kata kunci pencarian</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  restOfLeaderboard.map((entry) => (
                    <tr
                      key={entry.rank}
                      className={cn(
                        'hover:bg-slate-50 transition-colors',
                        entry.isCurrentUser && 'bg-indigo-50'
                      )}
                      style={entry.isCurrentUser ? { borderLeft: `4px solid ${mainColor}` } : {}}
                    >
                      {/* Rank */}
                      <td className="px-3 py-3 sticky left-0 bg-white z-10">
                        <span className="font-black text-slate-600">#{entry.rank}</span>
                      </td>
                      {/* Siswa */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0">
                            {entry.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className={cn('font-bold text-sm truncate max-w-[120px]', entry.isCurrentUser ? 'text-indigo-600' : 'text-slate-900')}>
                              {entry.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">{entry.username}</p>
                          </div>
                        </div>
                      </td>
                      {/* Skor */}
                      <td className="px-3 py-3 text-right">
                        <span className="font-black text-slate-900 text-sm">{entry.totalScore.toLocaleString()}</span>
                      </td>
                      {/* Quiz */}
                      <td className="px-3 py-3 text-center">
                        <Badge variant="secondary" className="font-bold text-[10px]">
                          {entry.quizDone}/{entry.totalQuiz}
                        </Badge>
                      </td>
                      {/* Akurasi */}
                      <td className="px-3 py-3 text-center">
                        <span
                          className={cn(
                            'font-bold text-sm',
                            entry.accuracy >= 90 ? 'text-emerald-600' :
                            entry.accuracy >= 80 ? 'text-blue-600' :
                            entry.accuracy >= 70 ? 'text-amber-600' : 'text-slate-600'
                          )}
                        >
                          {entry.accuracy}%
                        </span>
                      </td>
                      {/* B/S/K */}
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold">
                          <span className="text-emerald-600">{entry.correct}</span>
                          <span className="text-slate-300">/</span>
                          <span className="text-red-500">{entry.wrong}</span>
                          <span className="text-slate-300">/</span>
                          <span className="text-slate-400">{entry.empty}</span>
                        </div>
                      </td>
                      {/* Waktu */}
                      <td className="px-3 py-3 text-center">
                        <span className="text-sm text-slate-600 font-medium">
                          {entry.avgTime}m
                        </span>
                      </td>
                      {/* Sekolah */}
                      <td className="px-3 py-3">
                        <span className="text-sm text-slate-600 truncate block max-w-[150px]" title={entry.school}>
                          {entry.school}
                        </span>
                      </td>
                      {/* Provinsi */}
                      <td className="px-3 py-3">
                        <Badge variant="outline" className="text-[10px] font-medium whitespace-nowrap">
                          {entry.province}
                        </Badge>
                      </td>
                      {/* Target PTN */}
                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700 truncate max-w-[120px]" title={entry.targetUniversity}>
                            {entry.targetUniversity}
                          </span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[140px]" title={entry.targetMajor}>
                            {entry.targetMajor}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 text-center border-t border-slate-100">
            <Button variant="outline" className="font-bold rounded-3xl">
              Muat Lebih Banyak
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
