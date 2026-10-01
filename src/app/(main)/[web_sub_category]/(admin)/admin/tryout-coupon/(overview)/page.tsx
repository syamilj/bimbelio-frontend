'use client';

import { Edit, Eye, MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ListPagination from '@/components/ui/list-pagination';
// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { formatDateTime } from '@/lib/utils';
import {
  Pivot_TryoutCoupon_Tryout,
  Tryout,
  TryoutCoupon,
} from '@/types/database';
import Link from 'next/link';

export default function CouponVoucherPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const {
    data: Coupons,
    totalPages,
    isLoading,
    refetch: CouponsRefetch,
  } = useGet<
    (TryoutCoupon & {
      Pivot_TryoutCoupon_Tryout: (Pivot_TryoutCoupon_Tryout & {
        Tryout: Tryout;
      })[];
      _count: {
        TryoutRegistration: number;
      };
    })[]
  >('/tryoutCoupon/getAllCoupon', {
    params: {
      page,
      take,
      search: searchTerm,
    },
    useEffectDependencies: [page, take, searchTerm],
    debounceTime: 1000,
  });

  console.log({ Coupons });

  const { mutate: DeleteCoupon, isLoading: DeleteCouponIsLoading } =
    useMutation('/tryoutCoupon/deleteCoupon', 'delete', {
      onSuccess() {
        CouponsRefetch();
      },
    });

  return (
    <>
      {/* {isLoadingMessage && <AbsoluteLoader heading={isLoadingMessage} />} */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Coupon</h1>
            <p className="text-sm text-gray-500">View and manage coupon.</p>
          </div>
          <div className="flex items-center justify-center gap-4">
            {/* <Button className="gap-2">
              <Import className="h-4 w-4" />
              Import CSV
            </Button> */}
            <Link href={'tryout-coupon/new'}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Buat Coupon
              </Button>
            </Link>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>List Coupons</CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="grid gap-4 md:grid-cols-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari judul coupon, tryout, atau code..."
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
                  <TableHead>Title</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Mulai</TableHead>
                  <TableHead>Berakhir</TableHead>
                  <TableHead>Digunakan</TableHead>
                  <TableHead>Batas Penggunaan</TableHead>
                  <TableHead>Tryout</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell
                        colSpan={10}
                        className="h-[48.5px]"
                      >
                        <Skeleton className="w-full h-full rounded-3xl" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : Coupons?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada coupon yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  Coupons?.map((coupon, index) => (
                    <TableRow key={coupon.id}>
                      <TableCell>{page * take - take + index + 1}</TableCell>
                      <TableCell>{coupon.title}</TableCell>
                      <TableCell className="font-medium text-black">
                        {coupon.code}
                      </TableCell>
                      <TableCell className="text-black">
                        {formatDateTime(coupon.startDate)}
                      </TableCell>
                      <TableCell className="text-black">
                        {coupon.endDate ? formatDateTime(coupon.endDate) : '-'}
                      </TableCell>
                      <TableCell className="text-black">
                        {coupon._count.TryoutRegistration} kali
                      </TableCell>
                      <TableCell className="text-black">
                        {coupon.usageLimit} kali
                      </TableCell>
                      <TableCell className="text-black">
                        <TooltipProvider>
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <Badge className="cursor-pointer bg-gray-500">
                                {coupon.Pivot_TryoutCoupon_Tryout.length} tryout
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="text-sm max-w-xs"
                            >
                              <div className="flex items-center justify-start flex-wrap gap-2">
                                {coupon.Pivot_TryoutCoupon_Tryout.map(
                                  (item) => (
                                    <Badge key={item.id}>
                                      {item.Tryout.title}
                                    </Badge>
                                  ),
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${website_sub_category_id}/admin/tryout-coupon/${coupon.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${website_sub_category_id}/admin/tryout-coupon/edit/${coupon.id}`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <ModalVerification
                              type="delete"
                              onClick={async () => {
                                await DeleteCoupon({
                                  params: { id: coupon.id },
                                });
                              }}
                              isLoading={DeleteCouponIsLoading}
                            >
                              <DropdownMenuItem
                                asChild
                                onSelect={(e) => e.preventDefault()}
                              >
                                <div className="items-center flex justify-start w-full">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Hapus
                                </div>
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
