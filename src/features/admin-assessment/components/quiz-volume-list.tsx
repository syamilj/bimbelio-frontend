'use client';

import { useConfirm } from '@/components/patterns/confirm-dialog';
import { StatCard, StatGrid } from '@/components/patterns/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdminPageHeader } from '@/features/admin/components/admin-page-header';
import {
  DataTable,
  type DataTableColumn,
} from '@/features/admin/data-table/data-table';
import { useTableState } from '@/features/admin/data-table/use-table-state';
import { formatDate } from '@/features/admin/lib/format';
import { NEW_ID } from '@/features/admin/resource-form/resource-form';
import { adminPath, useTrackId } from '@/lib/track';
import { Layers, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useDeleteQuizVolume, useQuizVolumes } from '../api';
import { statusLabel } from '../model/list';
import type { QuizVolume } from '../model/types';

const STATUS_VARIANT: Record<string, 'default' | 'outline' | 'secondary'> = {
  PUBLIC: 'default',
  PRIVATE: 'outline',
  DRAFT: 'secondary',
};

function VolumeContents({ volume }: { volume: QuizVolume }) {
  const categories = volume.TryoutCategory ?? [];
  if (categories.length === 0)
    return (
      <p className="text-sm text-ink-muted">Belum ada quiz di volume ini.</p>
    );
  return (
    <div className="flex flex-col gap-4">
      {categories.map((cat) => (
        <section
          key={cat.id}
          aria-label={cat.name}
          className="flex flex-col gap-2"
        >
          <h3 className="text-sm font-semibold text-ink">{cat.name}</h3>
          {cat.TryoutSubCategory.map((sub) => (
            <div
              key={sub.id}
              className="flex flex-col gap-1.5 border-l-2 border-line pl-3"
            >
              <p className="font-mono text-xs text-ink-muted">{sub.name}</p>
              <ul className="flex flex-wrap gap-2">
                {sub.Tryout.map((quiz) => (
                  <li
                    key={quiz.id}
                    className="rounded-sm border border-line bg-surface px-3 py-2 text-xs"
                  >
                    <p className="font-semibold text-ink">{quiz.title}</p>
                    <p className="mt-0.5 text-ink-muted">
                      {quiz.TryoutSession?.name ?? '—'} ·{' '}
                      <span className="font-mono">
                        {quiz.TryoutSession?.duration ?? 0} mnt
                      </span>{' '}
                      · {statusLabel(quiz.status)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export function QuizVolumeListPage() {
  const trackId = useTrackId();
  const confirm = useConfirm();
  const table = useTableState();
  const query = useQuizVolumes({
    page: table.page,
    take: table.pageSize,
    search: table.q,
  });
  const remove = useDeleteQuizVolume();
  const rows = query.data?.items;
  const newHref = adminPath(trackId, `quiz-volume/${NEW_ID}`);

  const columns: DataTableColumn<QuizVolume>[] = [
    {
      id: 'volume',
      header: 'Volume',
      cell: (v) => (
        <Link
          href={adminPath(trackId, `quiz-volume/${v.id}`)}
          className="flex flex-col hover:text-brand-strong"
        >
          <span className="font-semibold text-ink">Volume {v.number}</span>
          <span className="text-xs text-ink-muted">{v.title}</span>
        </Link>
      ),
    },
    { id: 'created', header: 'Dibuat', cell: (v) => formatDate(v.createdAt) },
    {
      id: 'updated',
      header: 'Diperbarui',
      cell: (v) => formatDate(v.updatedAt),
      hideOnMobile: true,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (v) => (
        <Badge variant={STATUS_VARIANT[v.status] ?? 'secondary'}>
          {statusLabel(v.status)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Volume quiz"
        description="Kelompokkan quiz BimArena per volume beserta jadwalnya."
        actions={
          <Button asChild>
            <Link href={newHref}>
              <Plus />
              Tambah volume
            </Link>
          </Button>
        }
      />
      <StatGrid className="lg:grid-cols-3">
        <StatCard
          label="Total volume"
          value={query.data ? query.data.totalData || rows?.length || 0 : '–'}
        />
        <StatCard
          label="Publik di halaman ini"
          value={rows ? rows.filter((v) => v.status === 'PUBLIC').length : '–'}
        />
        <StatCard
          label="Draf di halaman ini"
          value={rows ? rows.filter((v) => v.status === 'DRAFT').length : '–'}
        />
      </StatGrid>
      <DataTable
        caption="Daftar volume quiz"
        table={table}
        columns={columns}
        rows={rows}
        total={query.data?.totalData || undefined}
        pageCount={query.data?.totalPages ?? 1}
        getRowId={(v) => v.id}
        getRowLabel={(v) => `Volume ${v.number}`}
        isLoading={query.isPending}
        error={query.error}
        onRetry={() => query.refetch()}
        searchPlaceholder="Cari judul volume"
        renderExpanded={(v) => <VolumeContents volume={v} />}
        rowActions={(v) => [
          {
            label: 'Ubah',
            icon: Pencil,
            href: adminPath(trackId, `quiz-volume/${v.id}`),
          },
          {
            label: 'Hapus',
            icon: Trash2,
            destructive: true,
            onSelect: () =>
              void confirm({
                title: `Hapus Volume ${v.number}?`,
                description: `"${v.title ?? ''}" akan dihapus. Tindakan ini tidak bisa dibatalkan.`,
                confirmLabel: 'Hapus volume',
                destructive: true,
                onConfirm: () => remove.mutateAsync(v.id),
              }),
          },
        ]}
        empty={{
          icon: Layers,
          title: 'Belum ada volume quiz',
          action: (
            <Button
              asChild
              size="sm"
            >
              <Link href={newHref}>
                <Plus />
                Tambah volume
              </Link>
            </Button>
          ),
        }}
      />
    </div>
  );
}
