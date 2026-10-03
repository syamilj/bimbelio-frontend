'use client';

import { EmptyState } from '@/components/patterns/empty-state';
import { ErrorState } from '@/components/patterns/error-state';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
  MoreHorizontal,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { DEFAULT_PAGE_SIZES, nextSort } from './table-state';
import type { TableController } from './use-table-state';

export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  /** Header bisa diklik untuk mengurutkan (`sort=<id>` di URL). */
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  /** Data teknis (ID, kode, skor IRT) memakai DM Mono. */
  mono?: boolean;
  className?: string;
  /** Sembunyikan di tampilan kartu (layar < md). */
  hideOnMobile?: boolean;
};

export type DataTableRowAction = {
  label: string;
  icon?: LucideIcon;
  href?: string;
  onSelect?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  hidden?: boolean;
};

export type DataTableFilter = {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  /** Label untuk "tanpa filter"; default "Semua <label>". */
  allLabel?: string;
};

type DataTableProps<T> = {
  /** Judul tabel untuk pembaca layar (caption). */
  caption: string;
  table: TableController;
  columns: DataTableColumn<T>[];
  rows: T[] | undefined;
  getRowId: (row: T) => string;
  /** Label baris untuk aksesibilitas, mis. judul try out. */
  getRowLabel?: (row: T) => string;
  /** Total data (setelah filter) dan jumlah halaman. */
  total?: number;
  pageCount: number;
  isLoading?: boolean;
  error?: unknown;
  onRetry?: () => void;
  /** Tampilkan kotak cari bila diisi. */
  searchPlaceholder?: string;
  filters?: DataTableFilter[];
  /** Tombol tambahan di toolbar (ekspor, dsb.). */
  toolbar?: React.ReactNode;
  rowActions?: (row: T) => DataTableRowAction[];
  /** Aktifkan seleksi massal; isi bar aksi untuk baris terpilih. */
  bulkActions?: (selected: T[], clear: () => void) => React.ReactNode;
  /** Baris yang bisa dibuka untuk menampilkan detail. */
  renderExpanded?: (row: T) => React.ReactNode;
  empty?: {
    title?: string;
    description?: React.ReactNode;
    action?: React.ReactNode;
    icon?: LucideIcon;
  };
  className?: string;
};

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

/**
 * Tabel admin standar: state di URL, cari/filter/urut, paginasi, seleksi
 * massal, aksi per baris, baris yang bisa dibuka, serta keadaan memuat,
 * kosong, dan gagal. Di layar < md baris tampil sebagai kartu.
 */
export function DataTable<T>({
  caption,
  table,
  columns,
  rows,
  getRowId,
  getRowLabel,
  total,
  pageCount,
  isLoading,
  error,
  onRetry,
  searchPlaceholder,
  filters,
  toolbar,
  rowActions,
  bulkActions,
  renderExpanded,
  empty,
  className,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Map<string, T>>(new Map());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const selectable = !!bulkActions;
  const hasActions = !!rowActions;
  const filterActive = table.q !== '' || Object.keys(table.filters).length > 0;

  // Pilihan & baris terbuka hanya berlaku untuk tampilan saat ini.
  const viewKey = `${table.page}|${table.pageSize}|${table.q}|${JSON.stringify(table.filters)}|${table.sort?.id}${table.sort?.dir}`;
  useEffect(() => {
    setSelected(new Map());
    setExpanded(new Set());
  }, [viewKey]);

  const pageRows = rows ?? [];
  const allOnPageSelected =
    pageRows.length > 0 && pageRows.every((r) => selected.has(getRowId(r)));
  const someOnPageSelected = pageRows.some((r) => selected.has(getRowId(r)));

  const toggleRow = (row: T, checked: boolean) =>
    setSelected((prev) => {
      const next = new Map(prev);
      if (checked) next.set(getRowId(row), row);
      else next.delete(getRowId(row));
      return next;
    });
  const togglePage = (checked: boolean) =>
    setSelected((prev) => {
      const next = new Map(prev);
      for (const r of pageRows) {
        if (checked) next.set(getRowId(r), r);
        else next.delete(getRowId(r));
      }
      return next;
    });
  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const clearSelection = () => setSelected(new Map());

  const colSpan =
    columns.length +
    (selectable ? 1 : 0) +
    (hasActions ? 1 : 0) +
    (renderExpanded ? 1 : 0);

  const label = (row: T) => getRowLabel?.(row) ?? getRowId(row);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {(searchPlaceholder || filters?.length || toolbar) && (
        <DataTableToolbar
          table={table}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
          toolbar={toolbar}
          filterActive={filterActive}
        />
      )}

      {selectable && selected.size > 0 && (
        <div
          role="region"
          aria-label="Aksi untuk baris terpilih"
          className="flex flex-wrap items-center gap-2 rounded-md border border-brand-muted bg-brand-soft px-4 py-2"
        >
          <span className="text-sm font-semibold text-ink">
            {selected.size} dipilih
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions([...selected.values()], clearSelection)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={clearSelection}
          >
            <X />
            Batalkan pilihan
          </Button>
        </div>
      )}

      {error ? (
        <ErrorState
          error={error}
          title={`${caption} tidak dapat dimuat`}
          onRetry={onRetry}
        />
      ) : !isLoading && pageRows.length === 0 ? (
        <EmptyState
          icon={empty?.icon ?? Inbox}
          title={
            filterActive
              ? 'Tidak ada yang cocok'
              : (empty?.title ?? 'Belum ada data')
          }
          description={
            filterActive
              ? 'Coba kata kunci atau filter lain.'
              : empty?.description
          }
          action={
            filterActive ? (
              <Button
                variant="outline"
                size="sm"
                onClick={table.reset}
              >
                Hapus filter
              </Button>
            ) : (
              empty?.action
            )
          }
        />
      ) : (
        <>
          {/* Tabel: md ke atas */}
          <div className="hidden overflow-hidden rounded-md border border-line bg-surface md:block">
            <Table aria-busy={isLoading || undefined}>
              <caption className="sr-only">{caption}</caption>
              <TableHeader>
                <TableRow>
                  {renderExpanded && (
                    <TableHead className="w-10">
                      <span className="sr-only">Buka detail</span>
                    </TableHead>
                  )}
                  {selectable && (
                    <TableHead className="w-10">
                      <Checkbox
                        aria-label="Pilih semua baris di halaman ini"
                        checked={
                          allOnPageSelected
                            ? true
                            : someOnPageSelected
                              ? 'indeterminate'
                              : false
                        }
                        onCheckedChange={(v) => togglePage(v === true)}
                        disabled={isLoading || pageRows.length === 0}
                      />
                    </TableHead>
                  )}
                  {columns.map((col) => (
                    <SortableHead
                      key={col.id}
                      column={col}
                      table={table}
                    />
                  ))}
                  {hasActions && (
                    <TableHead className="w-12 text-right">
                      <span className="sr-only">Aksi</span>
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && pageRows.length === 0
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow
                        key={`sk-${i}`}
                        className="h-11"
                      >
                        <TableCell colSpan={colSpan}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      </TableRow>
                    ))
                  : pageRows.map((row, index) => {
                      const id = getRowId(row);
                      const isOpen = expanded.has(id);
                      return (
                        <Fragment key={id}>
                          <TableRow
                            className="h-11"
                            data-state={
                              selected.has(id) ? 'selected' : undefined
                            }
                          >
                            {renderExpanded && (
                              <TableCell className="py-1.5">
                                <ExpandButton
                                  open={isOpen}
                                  label={label(row)}
                                  controls={`detail-${id}`}
                                  onToggle={() => toggleExpanded(id)}
                                />
                              </TableCell>
                            )}
                            {selectable && (
                              <TableCell className="py-1.5">
                                <Checkbox
                                  aria-label={`Pilih ${label(row)}`}
                                  checked={selected.has(id)}
                                  onCheckedChange={(v) =>
                                    toggleRow(row, v === true)
                                  }
                                />
                              </TableCell>
                            )}
                            {columns.map((col) => (
                              <TableCell
                                key={col.id}
                                className={cn(
                                  'py-1.5',
                                  alignClass[col.align ?? 'left'],
                                  col.mono && 'font-mono text-xs',
                                  col.className,
                                )}
                              >
                                {col.cell(row, index)}
                              </TableCell>
                            ))}
                            {hasActions && (
                              <TableCell className="py-1.5 text-right">
                                <RowActions
                                  actions={rowActions(row)}
                                  label={label(row)}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                          {renderExpanded && isOpen && (
                            <TableRow
                              id={`detail-${id}`}
                              className="bg-paper/60 hover:bg-paper/60"
                            >
                              <TableCell
                                colSpan={colSpan}
                                className="px-4 py-4"
                              >
                                {renderExpanded(row)}
                              </TableCell>
                            </TableRow>
                          )}
                        </Fragment>
                      );
                    })}
              </TableBody>
            </Table>
          </div>

          {/* Kartu: layar kecil */}
          <ul
            className="flex flex-col gap-2 md:hidden"
            aria-label={caption}
            aria-busy={isLoading || undefined}
          >
            {isLoading && pageRows.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <li
                    key={`sk-${i}`}
                    className="rounded-md border border-line bg-surface p-4"
                  >
                    <Skeleton className="mb-2 h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </li>
                ))
              : pageRows.map((row, index) => {
                  const id = getRowId(row);
                  const [first, ...rest] = columns;
                  const isOpen = expanded.has(id);
                  return (
                    <li
                      key={id}
                      className={cn(
                        'rounded-md border border-line bg-surface p-4',
                        selected.has(id) && 'border-brand-muted bg-brand-soft',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        {selectable && (
                          <Checkbox
                            aria-label={`Pilih ${label(row)}`}
                            checked={selected.has(id)}
                            onCheckedChange={(v) => toggleRow(row, v === true)}
                            className="mt-0.5"
                          />
                        )}
                        <div className="min-w-0 flex-1 text-sm font-semibold text-ink">
                          {first?.cell(row, index)}
                        </div>
                        {hasActions && (
                          <RowActions
                            actions={rowActions(row)}
                            label={label(row)}
                          />
                        )}
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                        {rest
                          .filter((c) => !c.hideOnMobile)
                          .map((col) => (
                            <div
                              key={col.id}
                              className="min-w-0"
                            >
                              <dt className="font-mono text-xs text-ink-subtle lowercase">
                                {col.header}
                              </dt>
                              <dd
                                className={cn(
                                  'mt-0.5 min-w-0 break-words text-ink',
                                  col.mono && 'font-mono text-xs',
                                )}
                              >
                                {col.cell(row, index)}
                              </dd>
                            </div>
                          ))}
                      </dl>
                      {renderExpanded && (
                        <div className="mt-3">
                          <Button
                            variant="ghost"
                            size="xs"
                            aria-expanded={isOpen}
                            aria-controls={`detail-m-${id}`}
                            onClick={() => toggleExpanded(id)}
                          >
                            <ChevronDown
                              className={cn(
                                'transition-transform',
                                isOpen && 'rotate-180',
                              )}
                            />
                            {isOpen ? 'Tutup detail' : 'Lihat detail'}
                          </Button>
                          {isOpen && (
                            <div
                              id={`detail-m-${id}`}
                              className="mt-2"
                            >
                              {renderExpanded(row)}
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
          </ul>

          <DataTablePagination
            table={table}
            total={total}
            pageCount={pageCount}
            shown={pageRows.length}
          />
        </>
      )}
    </div>
  );
}

function SortableHead<T>({
  column,
  table,
}: {
  column: DataTableColumn<T>;
  table: TableController;
}) {
  const active = table.sort?.id === column.id ? table.sort.dir : null;
  const ariaSort =
    active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : 'none';
  if (!column.sortable) {
    return (
      <TableHead className={cn(alignClass[column.align ?? 'left'])}>
        {column.header}
      </TableHead>
    );
  }
  const Icon =
    active === 'asc' ? ArrowUp : active === 'desc' ? ArrowDown : ArrowUpDown;
  return (
    <TableHead
      aria-sort={ariaSort}
      className={cn(alignClass[column.align ?? 'left'])}
    >
      <button
        type="button"
        onClick={() => table.setSort(nextSort(table.sort, column.id))}
        className={cn(
          '-mx-1 inline-flex items-center gap-1 rounded-xs px-1 lowercase hover:text-ink focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none',
          active && 'text-ink',
        )}
      >
        {column.header}
        <Icon
          className="size-3.5"
          aria-hidden
        />
      </button>
    </TableHead>
  );
}

function ExpandButton({
  open,
  label,
  controls,
  onToggle,
}: {
  open: boolean;
  label: string;
  controls: string;
  onToggle: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={`${open ? 'Tutup' : 'Buka'} detail ${label}`}
      onClick={onToggle}
    >
      <ChevronDown
        className={cn('transition-transform', open && 'rotate-180')}
      />
    </Button>
  );
}

function RowActions({
  actions,
  label,
}: {
  actions: DataTableRowAction[];
  label: string;
}) {
  const visible = actions.filter((a) => !a.hidden);
  if (visible.length === 0) return null;
  const regular = visible.filter((a) => !a.destructive);
  const destructive = visible.filter((a) => a.destructive);
  const renderItem = (action: DataTableRowAction) => {
    const Icon = action.icon;
    const content = (
      <>
        {Icon && <Icon aria-hidden />}
        {action.label}
      </>
    );
    return (
      <DropdownMenuItem
        key={action.label}
        disabled={action.disabled}
        variant={action.destructive ? 'destructive' : 'default'}
        asChild={!!action.href}
        onSelect={action.onSelect}
      >
        {action.href ? <Link href={action.href}>{content}</Link> : content}
      </DropdownMenuItem>
    );
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Aksi untuk ${label}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-44"
      >
        {regular.map(renderItem)}
        {regular.length > 0 && destructive.length > 0 && (
          <DropdownMenuSeparator />
        )}
        {destructive.map(renderItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DataTableToolbar({
  table,
  searchPlaceholder,
  filters,
  toolbar,
  filterActive,
}: {
  table: TableController;
  searchPlaceholder?: string;
  filters?: DataTableFilter[];
  toolbar?: React.ReactNode;
  filterActive: boolean;
}) {
  const [search, setSearch] = useState(table.q);
  // Sinkron saat URL berubah dari luar (back/forward, reset).
  useEffect(() => setSearch(table.q), [table.q]);
  const commit = useDebouncedCallback((value: string) => {
    if (value.trim() !== table.q) table.setSearch(value);
  }, 350);

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        {searchPlaceholder && (
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink-subtle"
              aria-hidden
            />
            <Input
              type="search"
              value={search}
              aria-label={searchPlaceholder}
              placeholder={searchPlaceholder}
              className="h-10 pl-9"
              onChange={(e) => {
                setSearch(e.target.value);
                commit(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit.flush();
              }}
            />
          </div>
        )}
        {filters?.map((filter) => (
          <Select
            key={filter.id}
            value={table.filters[filter.id] ?? '__all'}
            onValueChange={(value) =>
              table.setFilter(filter.id, value === '__all' ? undefined : value)
            }
          >
            <SelectTrigger
              aria-label={filter.label}
              className="w-full sm:w-44"
            >
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all">
                {filter.allLabel ?? `Semua ${filter.label.toLowerCase()}`}
              </SelectItem>
              {filter.options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
        {filterActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={table.reset}
          >
            <X />
            Hapus filter
          </Button>
        )}
      </div>
      {toolbar && <div className="flex flex-wrap gap-2">{toolbar}</div>}
    </div>
  );
}

export function DataTablePagination({
  table,
  total,
  pageCount,
  shown,
}: {
  table: TableController;
  total?: number;
  pageCount: number;
  shown: number;
}) {
  const sizes = table.config.pageSizes ?? DEFAULT_PAGE_SIZES;
  const page = Math.min(table.page, pageCount);
  const from = shown === 0 ? 0 : (page - 1) * table.pageSize + 1;
  const to = (page - 1) * table.pageSize + shown;
  const summary = useMemo(() => {
    if (total === undefined) return `Halaman ${page} dari ${pageCount}`;
    return `${from}–${to} dari ${total.toLocaleString('id-ID')}`;
  }, [total, page, pageCount, from, to]);

  return (
    <nav
      aria-label="Paginasi"
      className="flex flex-col gap-3 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between"
    >
      <p
        aria-live="polite"
        className="font-mono text-xs"
      >
        {summary}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2">
          <span className="text-xs">Baris per halaman</span>
          <Select
            value={`${table.pageSize}`}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger
              size="sm"
              className="w-20"
              aria-label="Baris per halaman"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sizes.map((s) => (
                <SelectItem
                  key={s}
                  value={`${s}`}
                >
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <span className="font-mono text-xs">
          {page}/{pageCount}
        </span>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Halaman sebelumnya"
          disabled={page <= 1}
          onClick={() => table.setPage(page - 1)}
        >
          <ChevronLeft />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Halaman berikutnya"
          disabled={page >= pageCount}
          onClick={() => table.setPage(page + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}
