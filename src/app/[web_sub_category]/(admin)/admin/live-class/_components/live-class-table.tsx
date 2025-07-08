'use client';

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
import {
  LiveClassStatus,
  MockLiveClass,
  formatDateTime,
  formatDuration,
  getStatusColor,
  getStatusText,
  mockLiveClasses,
} from '@/lib/mock-data/live-class';
import {
  Clock,
  Copy,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Trash2,
  Users,
  Video,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface TableProps {
  searchTerm: string;
  statusFilter: LiveClassStatus | 'ALL';
  subjectFilter: string;
}

export function LiveClassTable({
  searchTerm,
  statusFilter,
  subjectFilter,
}: TableProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<MockLiveClass | null>(
    null,
  );

  // Filter data
  const filteredClasses = mockLiveClasses.filter((liveClass) => {
    // Search filter - empty search should match all
    const matchesSearch =
      !searchTerm.trim() ||
      liveClass.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      liveClass.tutorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      liveClass.subject.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus =
      statusFilter === 'ALL' || liveClass.status === statusFilter;

    // Subject filter
    const matchesSubject =
      subjectFilter === 'Semua Mata Pelajaran' ||
      liveClass.subject === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  const handleEdit = (classId: string) => {
    router.push(`/${website_sub_category_id}/admin/live-class/edit/${classId}`);
  };

  const handleDelete = (liveClass: MockLiveClass) => {
    setSelectedClass(liveClass);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // TODO: Implement delete logic when backend is ready
    console.log('Deleting class:', selectedClass?.id);

    toaster({
      title: 'Live Class Dihapus',
      description: `Kelas "${selectedClass?.title}" berhasil dihapus`,
      condition: 'success',
    });

    setDeleteDialogOpen(false);
    setSelectedClass(null);
  };

  const handleCopyMeetLink = (meetLink: string) => {
    navigator.clipboard.writeText(meetLink);

    toaster({
      title: 'Link Disalin',
      description: 'Link meet berhasil disalin ke clipboard',
      condition: 'success',
    });

    console.log('Meet link copied:', meetLink);
  };

  const handleSendReminder = (classTitle: string) => {
    // TODO: Implement send reminder logic when backend is ready
    toaster({
      title: 'Reminder Dikirim',
      description: `Reminder untuk kelas "${classTitle}" berhasil dikirim`,
      condition: 'success',
    });

    console.log('Reminder sent for class:', classTitle);
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
          <Button
            className="rounded-xl bg-blue-600 hover:bg-blue-700"
            onClick={() =>
              router.push(`/${website_sub_category_id}/admin/live-class/new`)
            }
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kelas
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">
                    Kelas & Tutor
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Mata Pelajaran
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Jadwal
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Durasi
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Peserta
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.length === 0 ? (
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
                            <AvatarImage src={liveClass.tutorAvatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                              {getInitials(liveClass.tutorName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {liveClass.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {liveClass.tutorName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-lg"
                        >
                          {liveClass.subject}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatDateTime(liveClass.scheduleDate)}
                          </div>
                          <div className="text-gray-500">
                            {liveClass.startTime} - {liveClass.endTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {formatDuration(liveClass.duration)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">
                            {liveClass.currentParticipants}
                          </span>
                          {liveClass.maxParticipants && (
                            <span className="text-gray-400">
                              /{liveClass.maxParticipants}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-lg ${getStatusColor(liveClass.status)}`}
                        >
                          {getStatusText(liveClass.status)}
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
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </DropdownMenuItem>
                              {liveClass.status === 'SCHEDULED' && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleSendReminder(liveClass.title)
                                  }
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  Kirim Reminder
                                </DropdownMenuItem>
                              )}
                              {liveClass.status === 'ONGOING' && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleCopyMeetLink(liveClass.meetLink)
                                  }
                                >
                                  <Copy className="mr-2 h-4 w-4" />
                                  Salin Link Meet
                                </DropdownMenuItem>
                              )}
                              {liveClass.isRecorded &&
                                liveClass.status === 'COMPLETED' && (
                                  <DropdownMenuItem>
                                    <Video className="mr-2 h-4 w-4" />
                                    Lihat Rekaman
                                  </DropdownMenuItem>
                                )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(liveClass)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Hapus Kelas
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Live Class</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kelas "{selectedClass?.title}"?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
