'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category } from '@/types/database';
import { Calendar, Search, Target } from 'lucide-react';

interface LiveClassFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  viewMode: 'grid' | 'calendar';
  onViewModeChange: (mode: 'grid' | 'calendar') => void;
  categories?: Category[];
}

export function LiveClassFilters({
  searchQuery,
  onSearchChange,
  selectedSubject,
  onSubjectChange,
  selectedStatus,
  onStatusChange,
  viewMode,
  onViewModeChange,
  categories,
}: LiveClassFiltersProps) {
  return (
    <Card className="mb-6 border-2 border-gray-100 rounded-3xl shadow-sm">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari berdasarkan judul, deskripsi, atau nama tutor..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 border-2 rounded-3xl shadow-sm"
                />
              </div>
            </div>
            <Select value={selectedSubject} onValueChange={onSubjectChange}>
              <SelectTrigger className="w-full sm:w-[200px] border-2 rounded-3xl shadow-sm font-bold">
                <SelectValue placeholder="Pilih mata pelajaran" />
              </SelectTrigger>
              <SelectContent className="border-2 border-gray-100 rounded-3xl shadow-sm">
                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
                {categories?.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-full sm:w-[150px] border-2 rounded-3xl shadow-sm font-bold">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="border-2 border-gray-100 rounded-3xl shadow-sm">
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
                <SelectItem value="ONGOING">Berlangsung</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between border-t-2 border-gray-100 pt-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-gray-900">
                  Tampilan:
                </span>
                <div className="flex bg-gray-100 rounded-3xl p-1 border-2 border-gray-200">
                  <button
                    onClick={() => onViewModeChange('grid')}
                    className={`px-3 py-2 text-sm font-bold rounded-3xl transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="hidden sm:inline">Grid</span>
                    </div>
                  </button>
                  <button
                    onClick={() => onViewModeChange('calendar')}
                    className={`px-3 py-2 text-sm font-bold rounded-3xl transition-all ${
                      viewMode === 'calendar'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="hidden sm:inline">Calendar</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
