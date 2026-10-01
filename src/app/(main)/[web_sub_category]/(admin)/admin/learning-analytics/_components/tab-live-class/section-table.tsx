'use client';

import { BookOpen, Clock, Eye, MoreHorizontal, Search } from 'lucide-react';
import { Dispatch, Fragment, SetStateAction, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import ListPagination from '@/components/ui/list-pagination';
// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn, formatDateTime, formatDuration, getInitials } from '@/lib/utils';
import { Category, Instructor, LiveClass } from '@/types/database';

export const SectionTable = ({
  setSelectedId,
}: {
  setSelectedId: Dispatch<SetStateAction<string | null>>;
}) => {
  const { mainColor, secondaryColor } = useWebsiteSubCategory();
  const [searchTerm, setSearchTerm] = useState('');
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const {
    data: LiveClass,
    totalPages,
    isLoading,
  } = useGet<
    (LiveClass & {
      Instructor: Instructor;
      Category: Category;
      endDate: string;
      status: string;
      totalInvited: number;
      absence: {
        present: number;
        late: number;
        absent: number;
      };
    })[]
  >('/liveClass/getAllLiveClass', {
    params: {
      page,
      take,
      search: searchTerm,
    },
    useEffectDependencies: [page, take, searchTerm],
    debounceTime: 500,
  });

  console.log({ LiveClass });
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

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl overflow-hidden">
        <CardHeader
          className="pb-4 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <div className="relative z-10">
            <CardTitle
              className="text-xl font-bold flex items-center gap-3"
              style={{ color: mainColor }}
            >
              <div
                className="w-10 h-10 rounded-3xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <BookOpen
                  className="w-5 h-5"
                  style={{ color: mainColor }}
                />
              </div>
              List BimLive
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              List Live Learning yang dikelola di BimLive
            </CardDescription>
          </div>
          <div
            className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
            style={{ backgroundColor: mainColor }}
          />
        </CardHeader>
        <CardContent className="pb-0">
          <div className="grid gap-4 md:grid-cols-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cari judul live learning..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Kelas & Tutor</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Jadwal</TableHead>
                <TableHead>Durasi</TableHead>
                <TableHead>H/I/A</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell
                      colSpan={9}
                      className="h-[48.5px]"
                    >
                      <Skeleton className="w-full h-full rounded-3xl" />
                    </TableCell>
                  </TableRow>
                ))
              ) : LiveClass?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center py-8 text-gray-500"
                  >
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                LiveClass?.map((liveclass, index) => (
                  <Fragment key={liveclass.id}>
                    <TableRow>
                      <TableCell>{page * take - take + index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              className="object-contain"
                              src={liveclass.Instructor.image || undefined}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-medium">
                              {getInitials(liveclass.Instructor.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {liveclass.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {liveclass.Instructor.name}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="rounded-3xl"
                        >
                          {liveclass.Category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">
                            {formatDateTime(new Date(liveclass.startDate))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          {formatDuration(liveclass.duration)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>
                          <span>{liveclass.absence.present}</span>/
                          <span>{liveclass.absence.late}</span>/
                          <span>{liveclass.absence.absent}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            `rounded-3xl`,
                            liveclass.type === 'LIVECLASS' &&
                              'bg-green-100 text-green-800',
                            liveclass.type === 'LIVESTREAM' &&
                              'bg-red-100 text-red-800',
                            liveclass.type === 'WEBINAR' &&
                              'bg-blue-100 text-blue-800',
                          )}
                        >
                          {liveclass?.type === 'LIVECLASS'
                            ? 'Live Class'
                            : liveclass?.type === 'LIVESTREAM'
                              ? 'Live Stream'
                              : 'Webinar'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`rounded-3xl ${getStatusColor(liveclass?.status)}`}
                        >
                          {liveclass?.status}
                        </Badge>
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedId(liveclass.id);
                                const element =
                                  document.getElementById('section-liveclass');
                                if (element) {
                                  const targetPosition =
                                    element.getBoundingClientRect().top +
                                    window.scrollY -
                                    100;
                                  window.scrollTo({
                                    top: targetPosition,
                                    behavior: 'smooth',
                                  });
                                }
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Lihat Detail
                              {/* <Link
                                href={`/${website_sub_category_id}/admin/learning-analytics/bim-live/${liveclass.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </Link> */}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </Fragment>
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
  );
};
