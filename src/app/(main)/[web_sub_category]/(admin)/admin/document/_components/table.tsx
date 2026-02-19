import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
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
import { env } from '@/env.mjs';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { deleteGeneral } from '@/lib/fetch-helper/fetch-helper';
import { storage } from '@/supabaseClient';
import { Category, Document, Subcategory, Video } from '@/types/database';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileX,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useProvider } from '../provider';

export default function Table() {
  const {
    setEditData,
    useDocument: {
      documentData,
      fetchDocument,
      page,
      setPage,
      isLoading,
      totalPages,
      errorMessage,
    },
  } = useProvider();
  const {
    type: { isCore },
    sharingWebSubIds,
  } = useWebsiteSubCategory();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteData, setDeleteData] = useState({ id: '', title: '', videoTitle: '' });

  const fileDownload = async (fileName: string) => {
    try {
      await storage.from('pdf').download(`document/${fileName}`);
    } catch { /* silent */ }
  };

  const removeDocument = async () => {
    await deleteGeneral(`/document/deleteDocument?id=${deleteData.id}`, {
      setLoading,
      async onSuccess() {
        fetchDocument();
        setDeleteData({ id: '', title: '', videoTitle: '' });
        await storage.from('pdf').remove([`document/${deleteData.title}`]);
        await storage.from('img').remove([`document/${deleteData.title}`]);
        if (deleteData.videoTitle.length > 0) {
          await storage.from('video').remove([`document/${deleteData.videoTitle}`]);
        }
      },
    });
  };

  if (errorMessage) return null;

  const SKELETON_ROWS = 8;

  return (
    <>
      {/* Loading ghost from hapus-dokumen is handled inline since we inlined it */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-main border-t-transparent" />
        </div>
      )}

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-gray-100">
        <ShadTable>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-12 text-center font-bold text-gray-600 text-xs">No.</TableHead>
              <TableHead className="font-bold text-gray-600 text-xs">Judul</TableHead>
              <TableHead className="font-bold text-gray-600 text-xs">ID</TableHead>
              <TableHead className="text-center font-bold text-gray-600 text-xs">Dipilih</TableHead>
              {isCore && (
                <TableHead className="text-center font-bold text-gray-600 text-xs">Visible At</TableHead>
              )}
              <TableHead className="text-center font-bold text-gray-600 text-xs">Status</TableHead>
              <TableHead className="text-center font-bold text-gray-600 text-xs">Kategori</TableHead>
              <TableHead className="text-center font-bold text-gray-600 text-xs">Sub Kategori</TableHead>
              <TableHead className="text-center font-bold text-gray-600 text-xs">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {/* Loading skeleton */}
            {isLoading &&
              Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                <TableRow key={`skel-${i}`} className="animate-pulse">
                  <TableCell className="text-center"><Skeleton className="h-4 w-6 mx-auto rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-lg" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-4 w-8 mx-auto rounded" /></TableCell>
                  {isCore && <TableCell><Skeleton className="h-4 w-16 mx-auto rounded" /></TableCell>}
                  <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}

            {/* Empty state */}
            {!isLoading && documentData.length === 0 && (
              <TableRow>
                <TableCell colSpan={isCore ? 9 : 8} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-3 py-8">
                    <FileX className="w-12 h-12 text-gray-300" />
                    <p className="text-sm font-semibold text-gray-500">Tidak ada dokumen</p>
                    <p className="text-xs text-gray-400">Belum ada dokumen yang ditambahkan</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {/* Data rows */}
            {!isLoading &&
              documentData.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <TableCell className="text-center text-sm text-gray-500 font-medium">
                    {(page - 1) * 10 + (index + 1)}
                  </TableCell>

                  <TableCell className="max-w-[220px]">
                    <p className="font-semibold text-gray-800 text-sm leading-tight truncate" title={item.title}>
                      {item.title}
                    </p>
                  </TableCell>

                  <TableCell>
                    <button
                      title="Salin ID"
                      className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-mono text-gray-600 max-w-[130px]"
                      onClick={() => {
                        navigator.clipboard.writeText(item.id);
                        toaster({
                          title: 'ID Disalin',
                          description: `ID: ${item.id}`,
                          duration: 2000,
                        });
                      }}
                    >
                      <Copy className="w-3 h-3 text-gray-400 group-hover:text-gray-600 shrink-0" />
                      <span className="truncate">{item.id.slice(0, 10)}…</span>
                    </button>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {item._count.userDocuments}
                    </span>
                  </TableCell>

                  {isCore && (
                    <TableCell className="text-center">
                      <span className="text-xs text-gray-500">
                        {item.visibleAtWebSubIds.length > 0
                          ? item.visibleAtWebSubIds.join(', ')
                          : sharingWebSubIds.join(',')}
                      </span>
                    </TableCell>
                  )}

                  <TableCell className="text-center">
                    {item.premium ? (
                      <Badge className="bg-amber-100 text-amber-700 border-amber-200 border hover:bg-amber-100 text-xs font-semibold rounded-full">
                        Premium
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 border hover:bg-emerald-50 text-xs font-semibold rounded-full">
                        Free
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 border hover:bg-indigo-50 text-xs font-medium rounded-full">
                      {item.category.name}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge className="bg-violet-50 text-violet-700 border-violet-200 border hover:bg-violet-50 text-xs font-medium rounded-full">
                      {item.subCategory.name}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      {/* Preview */}
                      <a
                        href={`${env.NEXT_PUBLIC_SUPABASE_PDF_URL}/document/${item.url}`}
                        target="_blank"
                        title="Lihat dokumen"
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Download */}
                      <button
                        title="Unduh dokumen"
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => fileDownload(item.title)}
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      {/* Edit */}
                      <button
                        title="Edit dokumen"
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        onClick={() => setEditData({ ...item })}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        title="Hapus dokumen"
                        className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => {
                          setDeleteData({ id: item.id, title: item.title, videoTitle: item.video?.title || '' });
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </ShadTable>
      </div>

      {/* Pagination */}
      {!isLoading && documentData.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-gray-500">
            Halaman <span className="font-semibold text-gray-700">{page}</span> dari{' '}
            <span className="font-semibold text-gray-700">{totalPages || 1}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {/* Page number pills */}
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-8 text-center text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                      page === p
                        ? 'bg-main text-white shadow-sm'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            <button
              disabled={page >= (totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="rounded-2xl max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-2">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center">Hapus Dokumen?</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Dokumen{' '}
              <span className="font-semibold text-gray-800">&quot;{deleteData.title}&quot;</span>{' '}
              akan dihapus permanen dan tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 justify-center">
            <AlertDialogCancel className="flex-1 rounded-xl">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
              onClick={() => removeDocument()}
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

