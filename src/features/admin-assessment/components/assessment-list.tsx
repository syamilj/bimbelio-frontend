'use client';

import { StatCard, StatGrid } from '@/components/patterns/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  draftKey,
  hasDraft,
} from '@/features/admin/assessment-editor/model/draft';
import { AdminPageHeader } from '@/features/admin/components/admin-page-header';
import {
  DataTable,
  type DataTableColumn,
} from '@/features/admin/data-table/data-table';
import { applyClientTableState } from '@/features/admin/data-table/table-state';
import { useTableState } from '@/features/admin/data-table/use-table-state';
import { exportXlsx } from '@/features/admin/lib/export';
import { formatDate, formatTime, shortId } from '@/features/admin/lib/format';
import { adminPath, useTrackId } from '@/lib/track';
import { getSubtestLabel } from '@/lib/utils/subtest';
import {
  BarChart3,
  ClipboardList,
  Copy,
  FileSpreadsheet,
  FlaskConical,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useAssessmentInfo, useAssessmentList } from '../api';
import {
  AI_MATCH_LABELS,
  aiMatchSummary,
  irtParamRows,
  statusLabel,
  type AiMatchState,
} from '../model/list';
import type { AssessmentListItem } from '../model/types';

type Kind = 'tryout' | 'quiz';

const COPY: Record<
  Kind,
  {
    title: string;
    description: string;
    noun: string;
    add: string;
    type: 'TRYOUT' | 'QUIZ';
  }
> = {
  tryout: {
    title: 'Try out',
    description: 'Kelola try out, sesi subtes, dan soalnya.',
    noun: 'try out',
    add: 'Tambah try out',
    type: 'TRYOUT',
  },
  quiz: {
    title: 'Quiz',
    description: 'Kelola quiz BimArena dan sesi penilaiannya.',
    noun: 'quiz',
    add: 'Tambah quiz',
    type: 'QUIZ',
  },
};

const STATUS_VARIANT: Record<string, 'default' | 'outline' | 'secondary'> = {
  PUBLIC: 'default',
  PRIVATE: 'outline',
  DRAFT: 'secondary',
};

const MATCH_VARIANT: Record<
  AiMatchState,
  'default' | 'outline' | 'secondary' | 'ink'
> = {
  ready: 'ink',
  partial: 'default',
  none: 'outline',
  empty: 'secondary',
};

export function AssessmentListPage({ kind }: { kind: Kind }) {
  const copy = COPY[kind];
  const trackId = useTrackId();
  const list = useAssessmentList(copy.type);
  const info = useAssessmentInfo();
  const table = useTableState({
    filterKeys: ['status', 'match'],
    defaultSort: { id: 'date', dir: 'desc' },
  });
  const [detail, setDetail] = useState<AssessmentListItem | null>(null);
  // Memaksa render ulang setelah draf lokal dihapus.
  const [, setDraftVersion] = useState(0);
  const subtest = (name: string) => getSubtestLabel(name, trackId ?? undefined);

  const view = useMemo(
    () =>
      applyClientTableState(list.data ?? [], table, {
        searchText: (t) => `${t.title} ${t.id}`,
        sortValue: {
          date: (t) => new Date(t.startDate),
          title: (t) => t.title,
          registered: (t) => t.totalRegistration,
          joined: (t) => t.totalJoin,
        },
        filterFn: {
          status: (t, v) => t.status === v,
          match: (t, v) => aiMatchSummary(t).state === v,
        },
      }),
    [list.data, table],
  );

  const columns: DataTableColumn<AssessmentListItem>[] = [
    {
      id: 'title',
      header: 'Judul',
      sortable: true,
      cell: (t) => (
        <div className="flex min-w-0 flex-col gap-0.5">
          <Link
            href={adminPath(trackId, `${kind}/edit/${t.id}`)}
            className="font-semibold text-ink hover:text-brand-strong hover:underline"
          >
            {t.title}
          </Link>
          <button
            type="button"
            className="inline-flex w-fit items-center gap-1 rounded-xs font-mono text-xs text-ink-subtle hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            aria-label={`Salin ID ${t.title}`}
            onClick={async () => {
              await navigator.clipboard?.writeText(t.id);
              toast.success('ID disalin', { description: t.id });
            }}
          >
            <Copy
              className="size-3"
              aria-hidden
            />
            {shortId(t.id, 12)}
          </button>
        </div>
      ),
    },
    {
      id: 'registered',
      header: 'Daftar',
      align: 'right',
      sortable: true,
      mono: true,
      cell: (t) => t.totalRegistration.toLocaleString('id-ID'),
    },
    {
      id: 'joined',
      header: 'Mengerjakan',
      align: 'right',
      sortable: true,
      mono: true,
      cell: (t) => t.totalJoin.toLocaleString('id-ID'),
    },
    {
      id: 'date',
      header: 'Mulai',
      sortable: true,
      cell: (t) => (
        <span className="text-sm whitespace-nowrap">
          {formatDate(t.startDate)}
          <span className="block font-mono text-xs text-ink-subtle">
            {formatTime(t.startDate)}
          </span>
        </span>
      ),
    },
    {
      id: 'sessions',
      header: 'Sesi · unduh parameter IRT',
      hideOnMobile: true,
      cell: (t) => (
        <ul className="flex max-w-xs flex-wrap gap-1">
          {t.TryoutSession.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  const { fileName, rows } = irtParamRows(s);
                  void exportXlsx(rows, fileName);
                }}
                aria-label={`Unduh parameter IRT ${s.TryoutCategory.name} – ${s.TryoutSubCategory.name}`}
                className="inline-flex items-center gap-1 rounded-full bg-paper px-2 py-0.5 font-mono text-xs text-ink-muted hover:bg-brand-soft hover:text-brand-strong focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
              >
                <FileSpreadsheet
                  className="size-3"
                  aria-hidden
                />
                {subtest(s.TryoutSubCategory.name)}
              </button>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'match',
      header: 'AI Match',
      cell: (t) => {
        const m = aiMatchSummary(t);
        return (
          <button
            type="button"
            onClick={() => setDetail(t)}
            className="rounded-full focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
            aria-label={`AI Match ${t.title}: ${AI_MATCH_LABELS[m.state]}, ${m.matched} dari ${m.total} soal. Lihat detail`}
          >
            <Badge variant={MATCH_VARIANT[m.state]}>
              {AI_MATCH_LABELS[m.state]}
              {m.total > 0 && (
                <span className="font-mono">
                  {m.matched}/{m.total}
                </span>
              )}
            </Badge>
          </button>
        );
      },
    },
    {
      id: 'status',
      header: 'Status',
      cell: (t) => (
        <Badge variant={STATUS_VARIANT[t.status] ?? 'secondary'}>
          {statusLabel(t.status)}
        </Badge>
      ),
    },
  ];

  const detailSummary = detail ? aiMatchSummary(detail, subtest) : null;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title={copy.title}
        description={copy.description}
        actions={
          <>
            {kind === 'tryout' && (
              <Button
                variant="outline"
                asChild
              >
                <Link href={adminPath(trackId, 'tryout/testing/try-out')}>
                  <FlaskConical />
                  Uji coba try out
                </Link>
              </Button>
            )}
            <Button asChild>
              <Link href={adminPath(trackId, `${kind}/new`)}>
                <Plus />
                {copy.add}
              </Link>
            </Button>
          </>
        }
      />

      {info.data && info.data.length > 0 && (
        <StatGrid className="lg:grid-cols-3">
          {info.data.map((item) => (
            <StatCard
              key={item.title}
              label={item.title}
              value={item.total.toLocaleString('id-ID')}
            />
          ))}
        </StatGrid>
      )}

      <DataTable
        caption={`Daftar ${copy.noun}`}
        table={table}
        columns={columns}
        rows={view.rows}
        total={view.total}
        pageCount={view.pageCount}
        getRowId={(t) => t.id}
        getRowLabel={(t) => t.title}
        isLoading={list.isPending}
        error={list.error}
        onRetry={() => list.refetch()}
        searchPlaceholder={`Cari ${copy.noun} atau ID`}
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: ['PUBLIC', 'PRIVATE', 'DRAFT'].map((s) => ({
              value: s,
              label: statusLabel(s),
            })),
          },
          {
            id: 'match',
            label: 'AI Match',
            allLabel: 'Semua AI Match',
            options: (Object.keys(AI_MATCH_LABELS) as AiMatchState[]).map(
              (s) => ({
                value: s,
                label: AI_MATCH_LABELS[s],
              }),
            ),
          },
        ]}
        toolbar={
          <Button
            variant="outline"
            size="sm"
            disabled={!view.filtered.length}
            onClick={() =>
              void exportXlsx(
                view.filtered.map((t, i) => ({
                  No: i + 1,
                  Judul: t.title,
                  Daftar: t.totalRegistration,
                  Mengerjakan: t.totalJoin,
                  Tanggal: formatDate(t.startDate, 'long'),
                  Status: t.status,
                })),
                `${kind}-list`,
              )
            }
          >
            <FileSpreadsheet />
            Ekspor Excel
          </Button>
        }
        rowActions={(t) => [
          {
            label: 'Ubah',
            icon: Pencil,
            href: adminPath(trackId, `${kind}/edit/${t.id}`),
          },
          {
            label: 'Lihat IRT',
            icon: BarChart3,
            href: adminPath(trackId, `tryout/irt/${t.id}`),
            hidden: !t.irt,
          },
          {
            label: 'Hapus draf lokal',
            icon: Trash2,
            destructive: true,
            hidden: !hasDraft(kind, t.id),
            onSelect: () => {
              localStorage.removeItem(draftKey(kind, t.id));
              setDraftVersion((v) => v + 1);
              toast.success('Draf lokal dihapus.');
            },
          },
        ]}
        empty={{
          icon: ClipboardList,
          title: `Belum ada ${copy.noun}`,
          action: (
            <Button
              asChild
              size="sm"
            >
              <Link href={adminPath(trackId, `${kind}/new`)}>
                <Plus />
                {copy.add}
              </Link>
            </Button>
          ),
        }}
      />

      <Dialog
        open={!!detail}
        onOpenChange={(open) => !open && setDetail(null)}
      >
        <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Detail AI Match</DialogTitle>
            <DialogDescription>
              {detail &&
                `${detail.title} · ${detailSummary!.matched}/${detailSummary!.total} soal sudah cocok`}
            </DialogDescription>
          </DialogHeader>
          {detailSummary && detailSummary.sessions.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {detailSummary.sessions.map((s) => (
                <li
                  key={s.name}
                  className="rounded-md border border-line p-3"
                >
                  <p className="text-sm font-semibold text-ink">{s.name}</p>
                  <p className="mt-1 text-xs text-ink-muted">
                    Soal belum cocok:{' '}
                    <span className="font-mono">{s.unmatched.join(', ')}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-line bg-paper p-3 text-sm text-ink">
              Semua soal sudah punya hasil AI Match.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
