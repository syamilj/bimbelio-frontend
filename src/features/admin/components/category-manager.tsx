'use client';

import { useConfirm } from '@/components/patterns/confirm-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DefaultValues, FieldValues } from 'react-hook-form';
import type { z } from 'zod';
import {
  DataTable,
  type DataTableColumn,
  type DataTableRowAction,
} from '../data-table/data-table';
import { applyClientTableState } from '../data-table/table-state';
import { useTableState } from '../data-table/use-table-state';
import { useUrlParam } from '../hooks/use-url-param';
import { ResourceForm } from '../resource-form/resource-form';

type AnySchema = z.ZodType<FieldValues, FieldValues>;

export type CategoryLevel<TRow, S extends AnySchema = AnySchema> = {
  /** Kunci unik: nilai tab di URL (`?tab=`) dan awalan state tabel. */
  key: string;
  /** Label tab, mis. "Kategori". */
  label: string;
  /** Kata benda huruf kecil untuk tombol & dialog, mis. "subkategori". */
  noun: string;
  query: {
    data: TRow[] | undefined;
    isPending: boolean;
    error: unknown;
    refetch: () => unknown;
  };
  columns: DataTableColumn<TRow>[];
  getId: (row: TRow) => string;
  getName: (row: TRow) => string;
  /** Teks yang dicari; default: nama. */
  searchText?: (row: TRow) => string;
  sortValue?: Record<string, (row: TRow) => string | number | Date | null>;
  schema: S;
  emptyValues: DefaultValues<z.input<S>>;
  toValues: (row: TRow) => z.input<S>;
  /** Field form untuk dialog tambah/ubah. */
  renderFields: (mode: 'create' | 'edit', row?: TRow) => React.ReactNode;
  onCreate: (values: z.output<S>) => Promise<unknown>;
  onUpdate: (row: TRow, values: z.output<S>) => Promise<unknown>;
  onDelete?: (row: TRow) => Promise<unknown>;
  deleteDescription?: (row: TRow) => React.ReactNode;
  /** Penjelasan singkat di dialog tambah/ubah. */
  formDescription?: React.ReactNode;
  extraActions?: (row: TRow) => DataTableRowAction[];
  emptyDescription?: React.ReactNode;
};

/** Bantu inferensi tipe baris & skema saat menyusun level. */
export const defineCategoryLevel = <TRow, S extends AnySchema>(
  level: CategoryLevel<TRow, S>,
) => level as unknown as CategoryLevel<unknown, AnySchema>;

/**
 * Pengelola kategori bertingkat (kategori → subkategori) untuk admin:
 * satu tab per level, tabel dengan cari & paginasi di URL, dialog
 * tambah/ubah berbasis ResourceForm, dan hapus dengan konfirmasi.
 */
export function CategoryManager({
  levels,
}: {
  levels: CategoryLevel<unknown, AnySchema>[];
}) {
  const [tab, setTab] = useUrlParam('tab', levels[0].key);
  if (levels.length === 1) return <CategoryLevelPanel level={levels[0]} />;
  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="flex flex-col gap-4"
    >
      <TabsList className="self-start">
        {levels.map((level) => (
          <TabsTrigger
            key={level.key}
            value={level.key}
          >
            {level.label}
            {level.query.data && (
              <span className="ml-1.5 font-mono text-xs opacity-70">
                {level.query.data.length}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      {levels.map((level) => (
        <TabsContent
          key={level.key}
          value={level.key}
        >
          <CategoryLevelPanel level={level} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function CategoryLevelPanel({
  level,
}: {
  level: CategoryLevel<unknown, AnySchema>;
}) {
  const confirm = useConfirm();
  const table = useTableState({ prefix: `${level.key}.` });
  const [dialog, setDialog] = useState<
    { mode: 'create' } | { mode: 'edit'; row: unknown } | null
  >(null);

  const view = useMemo(
    () =>
      applyClientTableState(level.query.data ?? [], table, {
        searchText: level.searchText ?? level.getName,
        sortValue: level.sortValue,
      }),
    [level.query.data, table],
  );

  const rowActions = (row: unknown): DataTableRowAction[] => [
    ...(level.extraActions?.(row) ?? []),
    {
      label: 'Ubah',
      icon: Pencil,
      onSelect: () => setDialog({ mode: 'edit', row }),
    },
    {
      label: 'Hapus',
      icon: Trash2,
      destructive: true,
      hidden: !level.onDelete,
      onSelect: () =>
        void confirm({
          title: `Hapus ${level.noun} "${level.getName(row)}"?`,
          description:
            level.deleteDescription?.(row) ??
            'Tindakan ini tidak bisa dibatalkan.',
          confirmLabel: `Hapus ${level.noun}`,
          destructive: true,
          onConfirm: () => level.onDelete!(row),
        }),
    },
  ];

  const title =
    dialog?.mode === 'edit' ? `Ubah ${level.noun}` : `Tambah ${level.noun}`;

  return (
    <div className="flex flex-col gap-3">
      <DataTable
        caption={`Daftar ${level.noun}`}
        table={table}
        columns={level.columns}
        rows={view.rows}
        total={view.total}
        pageCount={view.pageCount}
        getRowId={level.getId}
        getRowLabel={level.getName}
        isLoading={level.query.isPending}
        error={level.query.error}
        onRetry={() => level.query.refetch()}
        searchPlaceholder={`Cari ${level.noun}…`}
        rowActions={rowActions}
        toolbar={
          <Button
            size="sm"
            onClick={() => setDialog({ mode: 'create' })}
          >
            <Plus />
            Tambah {level.noun}
          </Button>
        }
        empty={{
          title: `Belum ada ${level.noun}`,
          description: level.emptyDescription,
        }}
      />
      <Dialog
        open={!!dialog}
        onOpenChange={(open) => !open && setDialog(null)}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription
              className={level.formDescription ? '' : 'sr-only'}
            >
              {level.formDescription ?? title}
            </DialogDescription>
          </DialogHeader>
          {dialog && (
            <ResourceForm
              key={dialog.mode === 'edit' ? level.getId(dialog.row) : 'new'}
              layout="dialog"
              schema={level.schema}
              defaultValues={
                dialog.mode === 'edit'
                  ? (level.toValues(dialog.row) as DefaultValues<FieldValues>)
                  : level.emptyValues
              }
              requireDirty={dialog.mode === 'edit'}
              onCancel={() => setDialog(null)}
              onSubmit={async (values) => {
                if (dialog.mode === 'edit')
                  await level.onUpdate(dialog.row, values);
                else await level.onCreate(values);
                setDialog(null);
              }}
            >
              {level.renderFields(
                dialog.mode,
                dialog.mode === 'edit' ? dialog.row : undefined,
              )}
            </ResourceForm>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
