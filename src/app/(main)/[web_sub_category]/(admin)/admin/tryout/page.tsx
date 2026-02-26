'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDateString, getHours } from '@/lib/utils';
import { Tryout } from '@/types/database';
import ExcelJS from 'exceljs';
import {
  BarChart2,
  ClipboardList,
  Copy,
  Edit,
  FileSpreadsheet,
  FlaskConical,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface TryoutData extends Tryout {
  TryoutSession: {
    TryoutCategory: { name: string };
    TryoutSubCategory: { name: string };
    TryoutSessionParticipant: { userId: string }[];
    TryoutQuestion: {
      number: number;
      a_discrimination: number;
      b_difficulty: number;
      c_guessing: number;
      subCategory: string | null;
      subSubCategory: string | null;
    }[];
  }[];
  _count: {
    TryoutRegistration: number;
  };
  totalRegistration: number;
  totalJoin: number;
  irt: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ACTIVE: {
    label: 'Aktif',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  INACTIVE: {
    label: 'Nonaktif',
    className: 'bg-gray-100 text-gray-500 border-gray-200',
  },
  DRAFT: {
    label: 'Draft',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  ENDED: {
    label: 'Selesai',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
  },
};

export default function Page() {
  const [search, setSearch] = useState('');

  const {
    data: tryout,
    isLoading,
    refetch,
  } = useGet<TryoutData[]>('/tryout/getTryout', {
    params: { type: 'TRYOUT' },
  });

  const { data: tryoutInfo } = useGet<{ title: string; total: number }[]>(
    '/tryout/getTryoutInfo',
  );

  const filtered = tryout
    ?.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    );

  const exportData = async ({
    downloadData,
    fileName,
  }: {
    downloadData: any[];
    fileName: string;
  }) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('items');
    if (downloadData.length > 0) {
      worksheet.addRow(Object.keys(downloadData[0]));
      downloadData.forEach((row) => worksheet.addRow(Object.values(row)));
    }
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.xlsx`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const STAT_ICONS = [ClipboardList, Users, BarChart2];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Tryout</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Kelola semua soal dan sesi tryout
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${website_sub_category_id}/admin/tryout/testing/try-out`}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-3xl border border-amber-300 bg-amber-50 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <FlaskConical className="h-4 w-4" />
            Test Tryout
          </Link>
          <Link
            href={`/${website_sub_category_id}/admin/tryout/new`}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-3xl bg-main text-white text-sm font-medium hover:bg-main/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Tambah Tryout
          </Link>
        </div>
      </div>

      {/* Stats */}
      {tryoutInfo && tryoutInfo.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {tryoutInfo.map((item, i) => {
            const Icon = STAT_ICONS[i % STAT_ICONS.length];
            return (
              <div
                key={i}
                className="bg-white rounded-3xl border border-gray-100 p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-3xl bg-blue-50 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {item.total}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-4">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tryout..."
              className="pl-10 rounded-3xl border-gray-200"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (!tryout) return;
                const rows = tryout.map((t, i) => ({
                  No: i + 1,
                  Judul: t.title,
                  Daftar: t.totalRegistration,
                  Mengerjakan: t.totalJoin,
                  Tanggal: getDateString(t.startDate),
                  Status: t.status,
                }));
                exportData({ downloadData: rows, fileName: 'tryout-list' });
              }}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-3xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto rounded-3xl border border-gray-100">
          <ShadTable>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-10 text-center font-bold text-gray-600 text-xs">
                  No.
                </TableHead>
                <TableHead className="font-bold text-gray-600 text-xs">
                  Judul
                </TableHead>
                <TableHead className="text-center font-bold text-gray-600 text-xs">
                  Daftar
                </TableHead>
                <TableHead className="text-center font-bold text-gray-600 text-xs">
                  Mengerjakan
                </TableHead>
                <TableHead className="text-center font-bold text-gray-600 text-xs">
                  Tanggal
                </TableHead>
                <TableHead className="font-bold text-gray-600 text-xs">
                  Sesi
                </TableHead>
                <TableHead className="text-center font-bold text-gray-600 text-xs">
                  Status
                </TableHead>
                <TableHead className="text-center font-bold text-gray-600 text-xs">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Skeleton */}
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow
                    key={`sk-${i}`}
                    className="animate-pulse"
                  >
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-5 mx-auto rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48 rounded" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-8 mx-auto rounded" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-8 mx-auto rounded" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-4 w-28 mx-auto rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </TableCell>
                    <TableCell className="text-center">
                      <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        <Skeleton className="h-8 w-8 rounded-3xl" />
                        <Skeleton className="h-8 w-8 rounded-3xl" />
                        <Skeleton className="h-8 w-8 rounded-3xl" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {/* Empty */}
              {!isLoading && filtered?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-48 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-3 py-8">
                      <ClipboardList className="w-12 h-12 text-gray-300" />
                      <p className="text-sm font-semibold text-gray-500">
                        Tidak ada tryout
                      </p>
                      <p className="text-xs text-gray-400">
                        {search
                          ? 'Coba kata kunci lain'
                          : 'Belum ada tryout yang ditambahkan'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {/* Rows */}
              {!isLoading &&
                filtered?.map((item, i) => {
                  const localString =
                    typeof window !== 'undefined'
                      ? localStorage.getItem(`temporary-edit-tryout-${item.id}`)
                      : null;
                  const statusCfg = STATUS_CONFIG[item.status] ?? {
                    label: item.status,
                    className: 'bg-gray-100 text-gray-600 border-gray-200',
                  };

                  return (
                    <TableRow
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors"
                    >
                      <TableCell className="text-center text-sm text-gray-500 font-medium">
                        {i + 1}
                      </TableCell>

                      <TableCell className="max-w-[220px]">
                        <div className="space-y-0.5">
                          <p
                            className="font-semibold text-gray-800 text-sm leading-tight"
                            title={item.title}
                          >
                            {item.title}
                          </p>
                          <button
                            className="inline-flex items-center gap-1 text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(item.id);
                              toaster({
                                title: 'ID disalin',
                                description: item.id,
                                duration: 2000,
                              });
                            }}
                          >
                            <Copy className="w-2.5 h-2.5" />
                            {item.id.slice(0, 12)}…
                          </button>
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {item.totalRegistration}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="text-sm font-semibold text-gray-700">
                          {item.totalJoin}
                        </span>
                      </TableCell>

                      <TableCell className="text-center">
                        <span className="text-xs text-gray-600 whitespace-nowrap">
                          {getDateString(item.startDate)}
                          <br />
                          <span className="text-gray-400">
                            {getHours(item.startDate)}
                          </span>
                        </span>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.TryoutSession.map((s, si) => (
                            <button
                              key={si}
                              title={`Download IRT: ${s.TryoutCategory.name} - ${s.TryoutSubCategory.name}`}
                              onClick={() => {
                                const fileName = `${s.TryoutCategory.name} - ${s.TryoutSubCategory.name}`;
                                const data = s.TryoutQuestion.map((q) => ({
                                  Session: fileName,
                                  Question: q.number,
                                  a: q.a_discrimination,
                                  b: q.b_difficulty,
                                  c: q.c_guessing,
                                  SubCategory: q.subCategory,
                                  SubSubCategory: q.subSubCategory,
                                }));
                                exportData({ downloadData: data, fileName });
                              }}
                              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full text-xs font-medium hover:bg-indigo-100 transition-colors"
                            >
                              <FileSpreadsheet className="w-3 h-3" />
                              {s.TryoutSubCategory.name}
                            </button>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="text-center">
                        <Badge
                          className={`border text-xs font-semibold rounded-full hover:opacity-80 ${statusCfg.className}`}
                        >
                          {statusCfg.label}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/${website_sub_category_id}/admin/tryout/edit/${item.id}`}
                            title="Edit tryout"
                            className="flex items-center justify-center w-8 h-8 rounded-3xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          {item.irt && (
                            <Link
                              href={`/${website_sub_category_id}/admin/tryout/irt/${item.id}`}
                              title="Lihat IRT"
                              className="flex items-center justify-center w-8 h-8 rounded-3xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            >
                              <BarChart2 className="w-4 h-4" />
                            </Link>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!localString || isLoading}
                            title="Clear local storage"
                            className="w-8 h-8 rounded-3xl text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                            onClick={async () => {
                              localStorage.removeItem(
                                `temporary-edit-tryout-${item.id}`,
                              );
                              await refetch();
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </ShadTable>
        </div>

        {!isLoading && filtered && filtered.length > 0 && (
          <p className="text-center text-xs text-gray-400">
            {filtered.length} tryout ditemukan
          </p>
        )}
      </div>
    </div>
  );
}
