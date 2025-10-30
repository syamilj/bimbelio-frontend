'use client';

import { Button } from '@/components/ui/button';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { LiveClassStatus } from '@/lib/mock-data/live-class';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LiveClassFilters } from './_components/live-class-filters';
import { LiveClassMetrics } from './_components/live-class-metrics';
import { LiveClassTable } from './_components/live-class-table';

export default function LiveClassDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LiveClassStatus | 'ALL'>(
    'ALL',
  );
  const [subjectFilter, setSubjectFilter] = useState<string | undefined>(
    undefined,
  );

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setSubjectFilter(undefined);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Learning</h1>
          <p className="text-muted-foreground">
            Kelola dan pantau semua live learning Anda
          </p>
        </div>
        <Link href={`/${website_sub_category_id}/admin/live-learning/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Buat Live Learning
          </Button>
        </Link>
      </div>

      {/* Metrics */}
      <LiveClassMetrics />

      {/* Filters */}
      <LiveClassFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        onReset={handleResetFilters}
      />

      {/* Table */}
      <LiveClassTable
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        subjectFilter={subjectFilter}
      />
    </div>
  );
}
