'use client';

import { Edit, Eye, MoreHorizontal, Plus, Search, Trash } from 'lucide-react';
import { ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ListPagination from '@/components/ui/list-pagination';
// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ModalVerification } from '@/components/ui/modal-verification';
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
import { formatIDR } from '@/lib/utils/currency';
import { Pivot_Voucher_Plan, Plan, User, Voucher } from '@/types/database';
import { MidtransTransaction } from '@/types/midtrans-type';
import { format } from 'date-fns';
import Link from 'next/link';

export default function VoucherPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState<'ALL' | 'Percentage' | 'Fixed_Amount'>(
    'ALL',
  );
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const {
    data: Vouchers,
    totalPages,
    isLoading,
    refetch: VouchersRefetch,
  } = useGet<
    (Voucher & {
      Pivot_Voucher_Plan: (Pivot_Voucher_Plan & {
        Plan: Plan;
      })[];
    })[]
  >('/voucher/getAllVoucher', {
    params: {
      page,
      take,
      search: searchTerm,
    },
    useEffectDependencies: [page, take, searchTerm],
  });

  const { mutate: DeleteVoucher, isLoading: DeleteVoucherIsLoading } =
    useMutation('/voucher/deleteVoucher', 'delete', {
      onSuccess() {
        VouchersRefetch();
      },
    });

  return (
    <>
      {/* {isLoadingMessage && <AbsoluteLoader heading={isLoadingMessage} />} */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Voucher</h1>
            <p className="text-sm text-gray-500">View and manage voucher.</p>
          </div>
          <Link href={'voucher/new'}>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Buat Voucher
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>List Voucher</CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="grid gap-4 md:grid-cols-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari judul voucher atau code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 focus:border-blue-500"
                />
              </div>
              <Select
                value={type}
                onValueChange={(value: any) => setType(value)}
              >
                <SelectTrigger className="rounded-xl border-gray-200">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Type</SelectItem>
                  <SelectItem value="Percentage">Persentase</SelectItem>
                  <SelectItem value="Fixed_Amount">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Mulai</TableHead>
                  <TableHead>Berakhir</TableHead>
                  <TableHead>Batas Penggunaan</TableHead>
                  <TableHead>Plan / Subs</TableHead>
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
                        <Skeleton className="w-full h-full rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : Vouchers?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada voucher yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  Vouchers?.map((voucher, index) => (
                    <TableRow key={voucher.id}>
                      <TableCell>{page * take - take + index + 1}</TableCell>
                      <TableCell>{voucher.title}</TableCell>
                      <TableCell className="font-medium text-black">
                        {voucher.voucherCode}
                      </TableCell>
                      <TableCell className="text-black">
                        {voucher.type}
                      </TableCell>
                      <TableCell className="text-black">
                        {voucher.type === 'Percentage' &&
                          `${voucher.discount}%`}
                        {voucher.type === 'Fixed_Amount' &&
                          `${formatIDR(voucher.discount)}`}
                      </TableCell>
                      <TableCell className="text-black">
                        {formatDateTime(voucher.startDate)}
                      </TableCell>
                      <TableCell className="text-black">
                        {voucher.endDate
                          ? formatDateTime(voucher.endDate)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-black">
                        {voucher.usageLimit} kali
                      </TableCell>
                      <TableCell className="text-black">
                        {voucher.voucherPlanType === 'SELECTED_PLAN' && (
                          <TooltipProvider>
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <Badge className="cursor-pointer bg-gray-500">
                                  {voucher.Pivot_Voucher_Plan.length} plan
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent
                                side="top"
                                className="text-sm max-w-xs"
                              >
                                <div className="flex items-center justify-start flex-wrap gap-2">
                                  {voucher.Pivot_Voucher_Plan.map((item) => (
                                    <Badge>{item.Plan.name}</Badge>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          // <div className="flex items-center justify-start flex-wrap">
                          //   {voucher.Pivot_Voucher_Plan.map((item) => (
                          //     <Badge>{item.Plan.name}</Badge>
                          //   ))}
                          // </div>
                        )}
                        {voucher.voucherPlanType === 'ALL_PLAN' &&
                          'Bisa semua plan'}
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
                                href={`/${website_sub_category_id}/admin/voucher/${voucher.id}`}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Lihat Detail
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${website_sub_category_id}/admin/voucher/edit/${voucher.id}`}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <ModalVerification
                              type="delete"
                              onClick={async () => {
                                await DeleteVoucher({
                                  params: { id: voucher.id },
                                });
                              }}
                              isLoading={DeleteVoucherIsLoading}
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

const DetailTransaction = ({
  transaction,
  children,
}: {
  transaction: MidtransTransaction & {
    total_amount: number;
    status: string;
    transaction_details: { order_id: string };
    user: User;
    customer_details: { tryout_id?: string; title_tryout?: string };
  };
  children: ReactNode;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
        </DialogHeader>

        <div className="space-y-1">
          <p>
            <span className="font-medium">Status:</span> {transaction.status}
          </p>
          <p>
            <span className="font-medium">Order ID:</span>{' '}
            {transaction.transaction_details.order_id}
          </p>
          <p>
            <span className="font-medium">Total:</span>{' '}
            {formatIDR(transaction.total_amount)}
          </p>
          <p>
            <span className="font-medium">Waktu Transaksi:</span>{' '}
            {format(
              new Date(transaction.transaction_time),
              'dd MMM yyyy, HH:mm',
            )}
          </p>
          <p>
            <span className="font-medium">Kadaluarsa:</span>{' '}
            {format(new Date(transaction.expired_time), 'dd MMM yyyy, HH:mm')}
          </p>
        </div>

        <hr />

        <div>
          <div className="font-semibold mb-2">User</div>
          <div className="flex items-center gap-3">
            {/* <img
              src={transaction.user.image}
              alt="User"
              className="w-10 h-10 rounded-full"
            /> */}
            <UserAvatar
              name={transaction.user.name}
              image={transaction.user.image}
            />
            <div>
              <p className="font-medium">{transaction.user.name}</p>
              <p className="text-sm text-muted-foreground">
                {transaction.user.email}
              </p>
            </div>
          </div>
        </div>

        {transaction.customer_details?.tryout_id && (
          <>
            <hr />

            <div>
              <div className="font-semibold mb-2">Tryout</div>
              <p>
                <span className="font-medium">Judul:</span>{' '}
                {transaction.customer_details?.title_tryout}
              </p>
              <p>
                <span className="font-medium">Tryout ID:</span>{' '}
                {transaction.customer_details?.tryout_id}
              </p>
            </div>
          </>
        )}

        <hr />

        <div>
          <div className="font-semibold mb-2">Item</div>
          {transaction.item_details.map((item, idx) => (
            <div
              key={item.id}
              className="border p-2 rounded mb-2"
            >
              <p>
                <span className="font-medium">Nama:</span> {item.name}
              </p>
              <p>
                <span className="font-medium">Brand:</span> {item.brand}
              </p>
              <p>
                <span className="font-medium">Harga:</span>{' '}
                {formatIDR(item.price)}
              </p>
              <p>
                <span className="font-medium">Jumlah:</span> {item.quantity}
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UserAvatar = ({
  name,
  image,
}: {
  name: string;
  image?: string | null;
}) => {
  const [imgError, setImgError] = useState(false);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return imgError || !image ? (
    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
      {initials}
    </div>
  ) : (
    <img
      src={image}
      alt={name}
      className="h-10 w-10 rounded-full bg-gray-100 object-cover"
      onError={() => setImgError(true)}
    />
  );
};
