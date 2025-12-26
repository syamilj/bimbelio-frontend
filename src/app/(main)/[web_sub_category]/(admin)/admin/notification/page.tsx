'use client';

import { MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ListPagination from '@/components/ui/list-pagination';
// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ModalVerification } from '@/components/ui/modal-verification';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toaster } from '@/components/ui/toaster';
import { socketApi } from '@/lib/socket/api/_core';
import { NotificationQueueType } from '@/lib/socket/api/getNotificationQueue';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';

export default function NotificationQueuePage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [data, setData] = useState<NotificationQueueType[]>([]);
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchNotificationQueue = useDebouncedCallback(
    async (page: number, take: number, search?: string) => {
      const {
        data,
        error,
        page: currentPage,
        total_data,
        total_pages,
      } = await socketApi.getNotificationQueue({
        page,
        take,
        search: searchTerm,
        userType: 'BROADCAST',
      });
      setData(data);
      setPage(currentPage);
      setTotalData(total_data);
      setTotalPages(total_pages);
      if (error) {
        setErrorMessage(error);
      }
    },
    1000,
  );

  useEffect(() => {
    fetchNotificationQueue(page, take, searchTerm);
  }, [page, take, searchTerm]);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const deleteNotification = async (id: string) => {
    setIsDeleting(true);
    const success = await socketApi.deleteNotification({ id });
    if (success) {
      await fetchNotificationQueue(page, take);
      toaster({
        title: 'Success',
        description: 'Notification deleted successfully.',
        condition: 'success',
      });
    } else {
      toaster({
        title: 'Failed',
        description: 'Notification deleted failed.',
        condition: 'warning',
      });
    }
    setIsDeleting(false);
  };

  return (
    <>
      {/* {isLoadingMessage && <AbsoluteLoader heading={isLoadingMessage} />} */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">
              Notification Queue
            </h1>
            <p className="text-sm text-gray-500">
              View and manage notification queue.
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link href={'notification/new'}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Buat Notifikasi
              </Button>
            </Link>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>List Notification Queue</CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="grid gap-4 md:grid-cols-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari judul notifikasi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Send Type</TableHead>
                  <TableHead>Pop Up</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Run At</TableHead>
                  <TableHead>Job Scheduled</TableHead>
                  <TableHead>Retry Count</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell
                        colSpan={11}
                        className="h-[48.5px]"
                      >
                        <Skeleton className="w-full h-full rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : data?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada notifikasi yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.map((notif, index) => (
                    <TableRow key={notif.id}>
                      <TableCell>{page * take - take + index + 1}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {notif.title}
                      </TableCell>
                      <TableCell className="text-black text-sm">
                        {notif.userId ? notif.userId : 'Broadcast'}
                      </TableCell>
                      <TableCell className="text-black text-sm">
                        {notif.isPopUp ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell className="text-black text-sm">
                        {notif.type}
                      </TableCell>
                      <TableCell className="text-black text-sm">
                        {notif.category}
                      </TableCell>
                      <TableCell className="text-black text-sm">
                        {formatDateTime(notif.runAt)}
                      </TableCell>
                      <TableCell className="text-black text-sm">
                        {notif.job ? (
                          <Badge
                            variant="default"
                            className="bg-green-600 hover:bg-green-400"
                          >
                            Scheduled
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Not Scheduled</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-black text-sm">
                        {notif.retryCount}/{notif.maxRetries}
                      </TableCell>
                      <TableCell className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <ModalVerification
                              isLoading={isDeleting}
                              onClick={async () => {
                                await deleteNotification(notif.id);
                              }}
                              type="delete"
                              title="Hapus Notifikasi"
                              description={`Apakah Kamu yakin ingin menghapus notifikasi ini?\nTindakan ini tidak dapat dibatalkan.`}
                            >
                              <DropdownMenuItem
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </ModalVerification>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <ListPagination
              className="border-t"
              onSizeChange={(size) => {
                setTake(size);
              }}
              onPageChange={(page) => {
                setPage(page);
              }}
              currentPage={page}
              totalPage={totalPages}
              pageSize={take}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
