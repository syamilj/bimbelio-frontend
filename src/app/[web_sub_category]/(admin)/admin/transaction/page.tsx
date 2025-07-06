'use client';

import { Download } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { env } from '@/env.mjs';
import { response } from '@/lib/response';
import { getDateString } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import { exportToExcel } from '@/lib/utils/excel';
import { User } from '@/types/database';
import { MidtransTransaction } from '@/types/midtrans-type';
import axios from 'axios';
import { format } from 'date-fns';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { useDebouncedCallback } from 'use-debounce';

export default function TransactionsPage() {
  const [isExporting, setIsExporting] = useState(false);

  const [isLoadingMessage, setIsLoadingMessage] = useState<null | string>(null);
  const [transactions, setTransactions] = useState<
    (MidtransTransaction & { user: User; total_amount: number })[]
  >([]);
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(10);

  const fetchData = (page: number) => {
    const token = Cookies.get('token');
    axios
      .get(
        `${env.NEXT_PUBLIC_API_URL}/payment/getTransactions?page=${page}&take=${take}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((res) => {
        const resData = response(res);
        console.log({ resData });
        setTransactions(resData.data);
        setPage(resData?.page || 1);
        setTotalPage(resData?.total_pages || 1);
      })
      .finally(() => setIsLoadingMessage(null));
  };

  useEffect(() => {
    setIsLoadingMessage('Fetching Data....');
    fetchData(1);
  }, []);

  const fetchWithDebounced = useDebouncedCallback(() => {
    fetchData(page);
  }, 500);

  useEffect(() => {
    fetchWithDebounced();
  }, [take, page]);

  const handleExport = () => {
    try {
      setIsExporting(true);
      const dataToExport = transactions.map((transaction) => ({
        'Transaction ID': transaction.id,
        'User ID': transaction.userId,
        'User Name': transaction.user.name,
        Amount: `$${(transaction.item_details as any[]).length}`,
        Status: 'Status',
        Plan: `${(transaction.item_details as any[])[0].name}`,
        Date: new Date(transaction.transaction_time).toLocaleDateString(),
      }));

      exportToExcel(
        dataToExport,
        `transactions-${new Date().toISOString().split('T')[0]}`,
      );

      toast.success('Export Successful');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export Failed');
    } finally {
      setIsExporting(false);
    }
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

  return (
    <>
      {/* {isLoadingMessage && <AbsoluteLoader heading={isLoadingMessage} />} */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Transactions</h1>
            <p className="text-sm text-gray-500">
              View and manage payment transactions.
            </p>
          </div>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Export to Excel'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>List Transactions</CardTitle>
          </CardHeader>
          <CardContent>
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
                {transactions.map((transaction, index) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{page * take - take + index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        {/* <img
                          src={transaction.user.image || '/placeholder.svg'}
                          alt={transaction.user.name}
                          className="h-10 w-10 rounded-full bg-gray-100 object-cover"
                        /> */}
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
                      <Badge className={getStatusColor('Pending')}>
                        {'Pending'}
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
                ))}
              </TableBody>
            </Table>
            <ListPagination
              onSizeChange={(size) => {
                setTake(size);
              }}
              onPageChange={(page) => {
                setPage(page);
              }}
              currentPage={page}
              totalPage={totalPage}
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
