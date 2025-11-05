'use client';

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
import { getDateString } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import { User } from '@/types/database';
import { MidtransTransaction } from '@/types/midtrans-type';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';

export default function Detail() {
  const { voucherId }: { voucherId: string } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  // const [type, setType] = useState<'ALL' | 'Percentage' | 'Fixed_Amount'>(
  //   'ALL',
  // );
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const {
    data: VoucherHistories,
    totalPages,
    isLoading,
  } = useGet<
    (MidtransTransaction & {
      user: User;
      total_amount: number;
      status: string;
    })[]
  >('/voucher/getVoucherHistory', {
    params: {
      id: voucherId,
      page,
      take,
      search: searchTerm,
    },
    useEffectDependencies: [page, take, searchTerm, voucherId],
  });

  return (
    <>
      {/* {isLoadingMessage && <AbsoluteLoader heading={isLoadingMessage} />} */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">
              Voucher Hisitory
            </h1>
            <p className="text-sm text-gray-500">
              View and manage voucher history.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>List Voucher History</CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            {/* <div className="grid gap-4 md:grid-cols-4 mb-4">
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
            </div> */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead className="min-w-[200px]">User</TableHead>
                  <TableHead>Token</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell
                        colSpan={8}
                        className="h-[48.5px]"
                      >
                        <Skeleton className="w-full h-full rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : VoucherHistories?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada history yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  VoucherHistories?.map((transaction, index) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{page * take - take + index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <UserAvatar
                            name={transaction.user.name}
                            image={transaction.user.image}
                          />
                          <div className="flex flex-col min-w-[140px]">
                            <span className="font-medium text-black/70 whitespace-nowrap">
                              {transaction.user.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {transaction.user.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-black/70">
                        {transaction.token}
                      </TableCell>
                      <TableCell className="text-black/70">
                        {(transaction.item_details as any[])[0].name}
                      </TableCell>
                      <TableCell className="text-black/70">
                        {formatIDR(transaction.total_amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-black/70">
                        {getDateString(transaction.transaction_time)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DetailTransaction transaction={transaction as any}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-700"
                          >
                            Detail
                          </Button>
                        </DetailTransaction>
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
      <DialogContent className="mb:max-w-md space-y-4">
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
          {transaction.item_details.map((item) => (
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'settlement':
      return 'bg-green-100 text-green-700';
    case 'pending':
      return 'bg-yellow-100 text-yellow-700';
    case 'Failed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
