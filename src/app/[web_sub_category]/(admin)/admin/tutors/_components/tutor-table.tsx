'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ModalVerification } from '@/components/ui/modal-verification';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { supabase } from '@/supabaseClient';
import {
  BookOpen,
  Edit,
  Eye,
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
  Star,
  Trash,
  UserCheck,
  UserX,
} from 'lucide-react';
import Link from 'next/link';
import { InstructorsType } from '../page';

interface Props {
  instructor: InstructorsType;
  RefetchInstructors: () => any;
  isLoading: boolean;
}

export function TutorTable({
  instructor,
  RefetchInstructors,
  isLoading,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex w-full justify-center items-center h-[300px]">
        <Loader2 className="animate-spin w-12 h-12" />
      </div>
    );
  }

  if (instructor.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <UserX className="h-12 w-12 mx-auto mb-3 text-gray-300" />
        <p>Tidak ada tutor yang ditemukan</p>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const { mutate: DeleteInstructor, isLoading: DeleteInstructorIsLoading } =
    useMutation('/instructor/deleteInstructor', 'delete', {
      onSuccess() {
        RefetchInstructors();
      },
    });

  const { mutate: UpdateStatus, isLoading: UpdateStatusIsLoading } =
    useMutation('/instructor/updateStatus', 'put', {
      onSuccess() {
        RefetchInstructors();
      },
    });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tutor</TableHead>
            <TableHead>Kontak</TableHead>
            <TableHead>Mata Pelajaran</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Total Kelas</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instructor.map((tutor) => (
            <TableRow key={tutor.id}>
              {/* Tutor Info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      className="object-contain w-full h-full"
                      src={tutor.image || undefined}
                      alt={tutor.name}
                    />
                    <AvatarFallback>{getInitials(tutor.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">
                      {tutor.name}
                    </div>
                    <div className="text-sm text-gray-500 max-w-[200px] truncate">
                      {tutor.description}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Contact */}
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span className="truncate max-w-[150px]">
                      {tutor.email}
                    </span>
                  </div>
                  {tutor.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{tutor.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Subjects */}
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {tutor.Category.slice(0, 2).map((subject) => (
                    <Badge
                      key={subject.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {subject.name}
                    </Badge>
                  ))}
                  {tutor.Category.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      +{tutor.Category.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>

              {/* Rating */}
              <TableCell>{renderStarRating(4)}</TableCell>

              {/* Total Classes */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{tutor.totalLiveClass}</span>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant={tutor.status ? 'default' : 'secondary'}
                  className={
                    tutor.status
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                  }
                >
                  {tutor.status ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </TableCell>

              {/* Actions */}
              <TableCell>
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
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${website_sub_category_id}/admin/tutors/${tutor.id}`}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </Link>
                    </DropdownMenuItem>
                    <ModalVerification
                      type="delete"
                      onClick={async () => {
                        await DeleteInstructor({ params: { id: tutor.id } });
                        const existhingImageName =
                          tutor?.image?.split('/tutor/')[1];

                        const deleteData = await supabase.storage
                          .from('img')
                          .remove([`tutor/${existhingImageName}`]);

                        console.log({ deleteData });
                      }}
                      isLoading={DeleteInstructorIsLoading}
                    >
                      <DropdownMenuItem
                        asChild
                        onSelect={(e) => e.preventDefault()}
                      >
                        <div className="items-center flex justify-start w-full">
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </div>
                      </DropdownMenuItem>
                    </ModalVerification>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${website_sub_category_id}/admin/tutors/edit/${tutor.id}`}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <ModalVerification
                      type="submit"
                      submitTitle={tutor.status ? 'Nonaktifkan' : 'Aktifkan'}
                      description="Ubah status instructor"
                      onClick={() => UpdateStatus({ params: { id: tutor.id } })}
                      isLoading={UpdateStatusIsLoading}
                    >
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        {tutor.status ? (
                          <>
                            <UserX className="mr-2 h-4 w-4" />
                            Nonaktifkan
                          </>
                        ) : (
                          <>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Aktifkan
                          </>
                        )}
                      </DropdownMenuItem>
                    </ModalVerification>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
