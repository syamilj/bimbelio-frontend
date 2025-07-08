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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { MockTutor } from '@/lib/mock-data/live-class';
import {
  BookOpen,
  Edit,
  Eye,
  Mail,
  MoreHorizontal,
  Phone,
  Star,
  UserCheck,
  UserX,
} from 'lucide-react';
import Link from 'next/link';

interface TutorTableProps {
  tutors: MockTutor[];
}

export function TutorTable({ tutors }: TutorTableProps) {
  if (tutors.length === 0) {
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
          {tutors.map((tutor) => (
            <TableRow key={tutor.id}>
              {/* Tutor Info */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={tutor.avatar}
                      alt={tutor.fullName}
                    />
                    <AvatarFallback>
                      {getInitials(tutor.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">
                      {tutor.fullName}
                    </div>
                    <div className="text-sm text-gray-500 max-w-[200px] truncate">
                      {tutor.bio}
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
                  {tutor.subjects.slice(0, 2).map((subject) => (
                    <Badge
                      key={subject}
                      variant="secondary"
                      className="text-xs"
                    >
                      {subject}
                    </Badge>
                  ))}
                  {tutor.subjects.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                    >
                      +{tutor.subjects.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>

              {/* Rating */}
              <TableCell>{renderStarRating(tutor.rating)}</TableCell>

              {/* Total Classes */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{tutor.totalClasses}</span>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant={tutor.isActive ? 'default' : 'secondary'}
                  className={
                    tutor.isActive
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                  }
                >
                  {tutor.isActive ? 'Aktif' : 'Tidak Aktif'}
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
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/${website_sub_category_id}/admin/tutors/edit/${tutor.id}`}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      {tutor.isActive ? (
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
