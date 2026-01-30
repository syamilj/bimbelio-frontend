'use client';

import { ReactNode, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import ListPagination from '@/components/ui/list-pagination';
// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { getDateString } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import {
  TransactionStatusTypeEnum,
  Tryout,
  TryoutRegistration,
  User,
} from '@/types/database';
import { MidtransTransaction } from '@/types/midtrans-type';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function Detail() {
  const { couponId }: { couponId: string } = useParams();
  const [search, setSearch] = useState('');

  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const {
    data: CouponHistories,
    totalPages,
    isLoading,
  } = useGet<
    (TryoutRegistration & {
      User: User;
      Tryout: Tryout;
    })[]
  >('/tryoutCoupon/getCouponHistory', {
    params: {
      id: couponId,
      page,
      take,
      search: search.length > 0 ? search : undefined,
    },
    useEffectDependencies: [page, take, search, status, couponId],
  });

  return (
    <>
      {/* {isLoadingMessage && <AbsoluteLoader heading={isLoadingMessage} />} */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">
              Coupon Hisitory
            </h1>
            <p className="text-sm text-gray-500">
              View and manage coupon history.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>List Coupon History</CardTitle>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="grid gap-4 md:grid-cols-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari email atau nama user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead className="min-w-[200px]">User</TableHead>
                  <TableHead>Tryout</TableHead>
                  <TableHead>Date</TableHead>
                  {/* <TableHead className="text-right">Actions</TableHead> */}
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
                        <Skeleton className="w-full h-full rounded-3xl" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : CouponHistories?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada history yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  CouponHistories?.map((coupon, index) => (
                    <TableRow key={coupon.id}>
                      <TableCell>{page * take - take + index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <UserAvatar
                            name={coupon.User.name}
                            image={coupon.User.image}
                          />
                          <div className="flex flex-col min-w-[140px]">
                            <span className="font-medium text-black/70 whitespace-nowrap">
                              {coupon.User.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {coupon.User.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-black/70">
                        {coupon.Tryout.title}
                      </TableCell>
                      <TableCell className="text-black/70">
                        {getDateString(coupon.User.createdAt)}
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
const getStatusColor = (status: TransactionStatusTypeEnum) => {
  switch (status) {
    case 'SETTLEMENT':
      return 'bg-green-100 text-green-700';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700';
    case 'FAILURE':
      return 'bg-red-100 text-red-700';
    case 'EXPIRE':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
