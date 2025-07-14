'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getSubjectList } from '@/lib/mock-data/live-class';
import { Category, Subcategory } from '@/types/database';
import { Search, X } from 'lucide-react';

interface TutorFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  subjectFilter: string;
  setSubjectFilter: (subject: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  onClearFilters: () => void;
}

export function TutorFilters({
  searchQuery,
  setSearchQuery,
  subjectFilter,
  setSubjectFilter,
  statusFilter,
  setStatusFilter,
  onClearFilters,
}: TutorFiltersProps) {
  const subjects = getSubjectList();
  const hasActiveFilters =
    searchQuery || subjectFilter !== 'all' || statusFilter !== 'all';

  const { data: Categories } = useGet<
    (Subcategory & {
      category: Category;
    })[]
  >('/category/getAllCategories');

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      {/* Search */}
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium text-gray-700">Cari Tutor</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Cari nama, email, atau mata pelajaran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Subject Filter */}
      <div className="space-y-2 min-w-[200px]">
        <label className="text-sm font-medium text-gray-700">
          Mata Pelajaran
        </label>
        <Select
          value={subjectFilter}
          onValueChange={setSubjectFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua mata pelajaran" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua mata pelajaran</SelectItem>
            {Categories?.map((subject) => (
              <SelectItem
                key={subject.id}
                value={subject.id}
              >
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="space-y-2 min-w-[150px]">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua status</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Tidak Aktif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="min-w-[120px]"
        >
          <X className="h-4 w-4 mr-2" />
          Reset Filter
        </Button>
      )}
    </div>
  );
}
