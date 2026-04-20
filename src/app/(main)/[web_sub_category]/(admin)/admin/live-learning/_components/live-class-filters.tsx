'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Category } from '@/types/database';
import { Filter, RotateCcw, Search } from 'lucide-react';

type LiveClassStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

interface FilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: LiveClassStatus | 'ALL';
  setStatusFilter: (value: LiveClassStatus | 'ALL') => void;
  subjectFilter: string | undefined;
  setSubjectFilter: (value: string | undefined) => void;
  onReset: () => void;
}

export function LiveClassFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  subjectFilter,
  setSubjectFilter,
  onReset,
}: FilterProps) {
  const { data: Categories } = useGet<Category[]>('/category/getAllCategories');

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filter & Pencarian
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cari judul kelas atau tutor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="rounded-3xl border-gray-200">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="WILLCOME">Akan Datang</SelectItem>
              <SelectItem value="ONGOING">Berlangsung</SelectItem>
              <SelectItem value="COMPLETED">Selesai</SelectItem>
            </SelectContent>
          </Select>

          {/* Subject Filter */}
          <Select
            value={subjectFilter === undefined ? 'ALL' : subjectFilter}
            onValueChange={(value) => {
              if (value === 'ALL') {
                setSubjectFilter(undefined);
              } else {
                setSubjectFilter(value);
              }
            }}
          >
            <SelectTrigger className="rounded-3xl border-gray-200">
              <SelectValue placeholder="Pilih mata pelajaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={'ALL'}>Semua Mata Pelajaran</SelectItem>
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

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={onReset}
            className="rounded-3xl border-gray-200 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
