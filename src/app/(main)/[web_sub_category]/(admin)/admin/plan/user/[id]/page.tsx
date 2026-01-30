'use client';

import { ReactNode, useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// import AbsoluteLoader from '@/components/ui/loading/absolute-loader';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
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
import { useGet } from '@/lib/fetch-helper/useGet';
import { formatIDR } from '@/lib/utils/currency';
import { FeatureTypeEnum, User } from '@/types/database';
import { MidtransTransaction } from '@/types/midtrans-type';
import { format } from 'date-fns';
import { Search, Trash } from 'lucide-react';
import { useParams } from 'next/navigation';
import { DialogDeleteSubs } from './components/dialog-delete-subs';

export default function Detail() {
  const { data: session } = useSession();
  const { id }: { id: string } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');

  const {
    data: PlanUsers,
    isLoading,
    refetch,
  } = useGet<
    {
      id: string;
      name: string;
      email: string;
      image: string | null;
      subs: string;
      type: 'Active' | 'Pending';
      features: FeatureTypeEnum[];
      subId: string;
    }[]
  >('/plan/getAllUsers', {
    params: {
      planId: id,
      search: searchTerm.length > 0 ? searchTerm : undefined,
      status: status === 'ALL' ? undefined : status,
    },
    useEffectDependencies: [searchTerm, status, id],
  });

  console.log({ PlanUsers, id });

  return (
    <>
      {/* {isLoadingMessage && <AbsoluteLoader heading={isLoadingMessage} />} */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">
              User Subscription
            </h1>
            <p className="text-sm text-gray-500">
              View user subscription who subscribed to this plan.
            </p>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>List User Subscription</CardTitle>
            <CardDescription className="text-base text-black font-semibold">
              {PlanUsers && PlanUsers?.length > 0 && PlanUsers[0].subs}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <div className="grid gap-4 md:grid-cols-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari email atau nama user..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
                />
              </div>
              <Select
                value={status}
                onValueChange={(value: any) => setStatus(value)}
              >
                <SelectTrigger className="rounded-3xl border-gray-200">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead className="min-w-[200px]">User</TableHead>
                  <TableHead>Feature</TableHead>
                  <TableHead>Status</TableHead>
                  {session?.user.role === 'SUPER_ADMIN' && (
                    <TableHead className="text-right">Actions</TableHead>
                  )}
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
                ) : PlanUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada user yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  PlanUsers?.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <UserAvatar
                            name={user.name}
                            image={user.image}
                          />
                          <div className="flex flex-col min-w-[140px]">
                            <span className="font-medium text-black/70 whitespace-nowrap">
                              {user.name}
                            </span>
                            <span className="text-sm text-gray-500">
                              {user.email}
                            </span>
                            <span className="text-sm text-gray-500">
                              {user.id}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-black/70">
                        <div className="flex flex-wrap gap-1">
                          {user.features.map((feature, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.type)}>
                          {user.type}
                        </Badge>
                      </TableCell>
                      {session?.user.role === 'SUPER_ADMIN' && (
                        <TableCell className="text-right">
                          <DialogDeleteSubs
                            id={user.subId}
                            email={user.email}
                            name={user.name}
                            subs={user.subs}
                            title="Apakah kamu yakin ingin menghapus subscription pada user ini?"
                            description="Data yang terhapus tidak dapat dikembalikan."
                            getData={refetch}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 px-3 py-2 rounded-3xl"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </DialogDeleteSubs>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            {/* <ListPagination
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
            /> */}
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
const getStatusColor = (status: 'Active' | 'Pending') => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-700';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};
