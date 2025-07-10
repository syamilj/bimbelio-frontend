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
import { LiveClassStatus } from '@/lib/mock-data/live-class';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface FilterProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: LiveClassStatus | 'ALL';
  setStatusFilter: (value: LiveClassStatus | 'ALL') => void;
  subjectFilter: string;
  setSubjectFilter: (value: string) => void;
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
  const subjects = [
    'Semua Mata Pelajaran',
    'Matematika',
    'Fisika',
    'Kimia',
    'Biologi',
    'Bahasa Indonesia',
    'Bahasa Inggris',
  ];

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
              className="pl-10 rounded-xl border-gray-200 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
              <SelectItem value="ONGOING">Berlangsung</SelectItem>
              <SelectItem value="COMPLETED">Selesai</SelectItem>
              <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>

          {/* Subject Filter */}
          <Select
            value={subjectFilter}
            onValueChange={setSubjectFilter}
          >
            <SelectTrigger className="rounded-xl border-gray-200">
              <SelectValue placeholder="Pilih mata pelajaran" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem
                  key={subject}
                  value={subject === 'Semua Mata Pelajaran' ? 'ALL' : subject}
                >
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={onReset}
            className="rounded-xl border-gray-200 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
