'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ListPagination from '@/components/ui/list-pagination';
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
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import {
  LiveClassStatus,
  formatDateTime,
  formatDuration,
} from '@/lib/mock-data/live-class';
import { cn } from '@/lib/utils';
import { sanitizeFileName } from '@/lib/utils/storage';
import { storage } from '@/storageClient';
import { Category, Instructor, LiveClass } from '@/types/database';
import {
  AccessibilityIcon,
  Clock,
  Copy,
  Edit,
  MoreHorizontal,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  searchTerm: string;
  statusFilter: LiveClassStatus | 'ALL';
  subjectFilter: string | undefined;
}

export function LiveClassTable({
  searchTerm,
  statusFilter,
  subjectFilter,
}: Props) {
  const router = useRouter();

  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const {
    data: LiveClass,
    isLoading: LiveClassIsLoading,
    totalPages,
    refetch: LiveClassRefetch,
  } = useGet<
    (LiveClass & {
      Instructor: Instructor;
      Category: Category;
      endDate: string;
      status: string;
    })[]
  >('/liveClass/getAllLiveClass', {
    params: {
      take,
      page,
      status: statusFilter,
      categoryId: subjectFilter,
      search: searchTerm,
    },
    useEffectDependencies: [
      take,
      page,
      statusFilter,
      subjectFilter,
      searchTerm,
    ],
  });

  const { mutate: DeleteLiveClass, isLoading: DeleteLiveClassIsLoading } =
    useMutation<{ title: string }>('/liveClass/deleteLiveClass', 'delete', {
      async onSuccess({ data }) {
        if (data?.title) {
          storage
            .from('img')
            .remove([`live-learning/${sanitizeFileName(data.title)}`]);
        }

        LiveClassRefetch();
      },
    });

  // Filter data
  const filteredClasses = (LiveClass || []).filter((liveClass) => {
    // Search filter - empty search should match all
    const matchesSearch =
      !searchTerm.trim() ||
      liveClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      liveClass.Instructor.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      liveClass.Category.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    // const matchesStatus =
    //   statusFilter === 'ALL' || liveClass?.status === statusFilter;

    // Subject filter
    // const matchesSubject =
    //   subjectFilter === 'ALL' || liveClass.Category.id === subjectFilter;

    return matchesSearch;
  });

  const handleEdit = (classId: string) => {
    router.push(
      `/${website_sub_category_id}/admin/live-learning/edit/${classId}`,
    );
  };

  const handleManageParticipants = (classId: string) => {
    router.push(
      `/${website_sub_category_id}/admin/live-learning/participants?classId=${classId}`,
    );
  };

  const handleCopyMeetLink = (meetLink: string) => {
    navigator.clipboard.writeText(meetLink);

    toaster({
      title: 'Link Disalin',
      description: 'Link meet berhasil disalin ke clipboard',
      condition: 'success',
    });
  };

  const handleSendReminder = (classTitle: string) => {
    // TODO: Implement send reminder logic when backend is ready
    toaster({
      title: 'Reminder Dikirim',
      description: `Reminder untuk kelas "${classTitle}" berhasil dikirim`,
      condition: 'success',
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Daftar Live Class ({filteredClasses.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-3xl border border-gray-200 overflow-hidden">
            <Table className="border-b">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Kelas & Tutor
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Mata Pelajaran
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Jadwal
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Durasi
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Akses
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Tipe
                  </TableHead>
                  {/* <TableHead className="font-semibold text-gray-700 py-4">
                    Peserta
                  </TableHead> */}
                  <TableHead className="font-semibold text-gray-700 py-4">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 py-4 text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {LiveClassIsLoading ? (
                  Array.from({ length: 7 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell
                        colSpan={7}
                        className="h-[48.5px]"
                      >
                        <Skeleton className="w-full h-full rounded-3xl" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredClasses.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada kelas yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClasses.map((liveClass) => (
                    <TableRow
                      key={liveClass.id}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              className="object-contain"
                              src={liveClass.Instructor.image || undefined}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                              {getInitials(liveClass.Instructor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {liveClass.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {liveClass.Instructor.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-3xl"
                        >
                          {liveClass.Category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatDateTime(new Date(liveClass.startDate))}
                          </div>
                          {/* <div className="text-gray-500">
                            {liveClass.duration} menit
                          </div> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {formatDuration(liveClass.duration)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-black-600">
                          <AccessibilityIcon className="w-4 h-4" />
                          {liveClass.accessType}
                        </div>
                      </TableCell>
                      {/* <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            statis
                          </span>
                          {liveClass.maxParticipant && (
                            <span className="text-gray-400">
                              /{liveClass.maxParticipant}
                            </span>
                          )}
                        </div>
                      </TableCell> */}
                      <TableCell>
                        <Badge
                          className={cn(
                            `rounded-3xl`,
                            liveClass.type === 'LIVECLASS' &&
                              'bg-green-100 text-green-800',
                            liveClass.type === 'LIVESTREAM' &&
                              'bg-red-100 text-red-800',
                            liveClass.type === 'WEBINAR' &&
                              'bg-blue-100 text-blue-800',
                          )}
                        >
                          {liveClass?.type === 'LIVECLASS'
                            ? 'Live Class'
                            : liveClass?.type === 'LIVESTREAM'
                              ? 'Live Stream'
                              : 'Webinar'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-3xl ${getStatusColor(liveClass?.status)}`}
                        >
                          {liveClass?.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48"
                            >
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleEdit(liveClass.id)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Kelas
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleManageParticipants(liveClass.id)
                                }
                              >
                                <Users className="mr-2 h-4 w-4" />
                                Kelola Peserta
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </DropdownMenuItem> */}
                              {liveClass?.status === 'SCHEDULED' && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleSendReminder(liveClass.title)
                                  }
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  Kirim Reminder
                                </DropdownMenuItem>
                              )}
                              {liveClass?.status === 'ONGOING' && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCopyMeetLink(liveClass.link)
                                  }
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Salin Link Meet
                                </DropdownMenuItem>
                              )}
                              {liveClass.isRecord &&
                                liveClass?.status === 'COMPLETED' && (
                                  <DropdownMenuItem>
                                    <Video className="mr-2 h-4 w-4" />
                                    Lihat Rekaman
                                  </DropdownMenuItem>
                                )}
                              <DropdownMenuSeparator />
                              <ModalVerification
                                isLoading={DeleteLiveClassIsLoading}
                                onClick={() => {
                                  DeleteLiveClass({
                                    params: { id: liveClass.id },
                                  });
                                }}
                                type="delete"
                                title="Hapus Live Class"
                                description={`Apakah Kamu yakin ingin menghapus kelas ini?\nTindakan ini tidak dapat dibatalkan.`}
                              >
                                <DropdownMenuItem
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Hapus Kelas
                                </DropdownMenuItem>
                              </ModalVerification>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <ListPagination
              className="px-4"
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
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Sedang Berlangsung':
      return 'bg-blue-100 text-blue-800';
    case 'Akan Datang':
      return 'bg-green-100 text-green-800';
    case 'Selesai':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
