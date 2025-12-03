'use client';

import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Download,
  Search,
} from 'lucide-react';
import { ReactNode, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import ListPagination from '@/components/ui/list-pagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn, getDateString } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import { exportToExcel } from '@/lib/utils/excel';
import {
  SubscriptionInstallment,
  SubscriptionInstallmentLimitation,
  User,
} from '@/types/database';
import toast from 'react-hot-toast';

type DataType = (User & {
  SubscriptionInstallment: (SubscriptionInstallment & {
    SubscriptionInstallmentLimitation: SubscriptionInstallmentLimitation | null;
  })[];
})[];

export default function InstallmentPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState('');

  const { data: installmentUser, totalPages } = useGet<DataType>(
    '/payment/getInstallment',
    {
      params: {
        page,
        take,
        search: search.length > 0 ? search : undefined,
      },
      useEffectDependencies: [take, page, search],
    },
  );

  console.log({ installmentUser });

  const handleExport = () => {
    try {
      setIsExporting(true);
      const dataToExport = installmentUser?.flatMap((user) => {
        return user.SubscriptionInstallment.map((installment) => ({
          'User ID': user.id,
          'User Name': user.name,
          'User Email': user.email,
          'Installment ID': installment.id,
          'Installment Number': installment.installmentNumber,
          Amount: formatIDR(installment.amount),
          'Due Date': getDateString(installment.dueDate),
          Status: installment.isPaid ? 'Lunas' : 'Pending',
          'Late Fee':
            installment.lateFee > 0 ? formatIDR(installment.lateFee) : '-',
          'Expired Access Date': getDateString(installment.expiredAccessDate),
          'Grace Period End': installment.gracePeriodEndDate
            ? getDateString(installment.gracePeriodEndDate)
            : '-',
        }));
      });

      exportToExcel(
        dataToExport || [],
        `installments-${new Date().toISOString().split('T')[0]}`,
      );

      toast.success('Export Successful');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export Failed');
    } finally {
      setIsExporting(false);
    }
  };

  const getInstallmentStatus = (isPaid: boolean, dueDate: string) => {
    if (isPaid) {
      return { label: 'Lunas', color: 'bg-green-100 text-green-700' };
    }
    if (new Date(dueDate) < new Date()) {
      return { label: 'Tertunda', color: 'bg-red-100 text-red-700' };
    }
    return { label: 'Pending', color: 'bg-blue-100 text-blue-700' };
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">
              Riwayat Cicilan
            </h1>
            <p className="text-sm text-gray-500">
              Kelola semua cicilan pembayaran pengguna.
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
            <CardTitle>Daftar Cicilan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari email atau nama user..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 focus:border-blue-500"
                />
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead className="min-w-[200px]">User</TableHead>
                  <TableHead>Cicilan Ke</TableHead>
                  <TableHead>Nominal</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Akses Berakhir</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {installmentUser && installmentUser.length > 0 ? (
                  installmentUser.map((user, userIndex) => {
                    return user.SubscriptionInstallment.map(
                      (installment, instIndex) => {
                        const status = getInstallmentStatus(
                          installment.isPaid,
                          installment.dueDate,
                        );
                        const isFirstInstallment = instIndex === 0;
                        const isLastInstallment =
                          instIndex === user.SubscriptionInstallment.length - 1;

                        return (
                          <TableRow key={installment.id}>
                            {isFirstInstallment && (
                              <TableCell
                                rowSpan={user.SubscriptionInstallment.length}
                                className="align-text-top border-b border-r"
                              >
                                {page * take -
                                  take +
                                  userIndex *
                                    user.SubscriptionInstallment.length +
                                  instIndex +
                                  1}
                              </TableCell>
                            )}
                            {isFirstInstallment ? (
                              <TableCell
                                rowSpan={user.SubscriptionInstallment.length}
                                className="align-top border-b border-r"
                              >
                                <div className="flex items-center gap-3">
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
                                  </div>
                                </div>
                              </TableCell>
                            ) : null}
                            <TableCell
                              className={cn(
                                'text-black/70 text-center',
                                isLastInstallment && 'border-b',
                              )}
                            >
                              <span className="font-semibold">
                                #{installment.installmentNumber}
                              </span>
                            </TableCell>
                            <TableCell
                              className={cn(
                                'text-black/70',
                                isLastInstallment && 'border-b',
                              )}
                            >
                              <div className="flex flex-col">
                                <span className="font-bold">
                                  {formatIDR(installment.amount)}
                                </span>
                                {installment.lateFee > 0 && (
                                  <span className="text-xs text-orange-600">
                                    +Denda: {formatIDR(installment.lateFee)}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              className={cn(
                                'text-black/70',
                                isLastInstallment && 'border-b',
                              )}
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {getDateString(installment.dueDate)}
                                </span>
                                {installment.gracePeriodEndDate && (
                                  <span className="text-xs text-green-600">
                                    Tenggang:{' '}
                                    {getDateString(
                                      installment.gracePeriodEndDate,
                                    )}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell
                              className={cn(
                                'text-black/70',
                                isLastInstallment && 'border-b',
                              )}
                            >
                              {getDateString(installment.expiredAccessDate)}
                            </TableCell>
                            <TableCell
                              className={cn(isLastInstallment && 'border-b')}
                            >
                              <Badge className={status.color}>
                                {status.label}
                              </Badge>
                            </TableCell>
                            <TableCell
                              className={cn(
                                'text-right',
                                isLastInstallment && 'border-b',
                              )}
                            >
                              <DetailInstallment
                                user={user}
                                installment={installment}
                              >
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                >
                                  Detail
                                </Button>
                              </DetailInstallment>
                            </TableCell>
                          </TableRow>
                        );
                      },
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8"
                    >
                      <p className="text-gray-500">Tidak ada data cicilan</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ListPagination
              onSizeChange={(size) => {
                setTake(size);
              }}
              onPageChange={(pageNum) => {
                setPage(pageNum);
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

const DetailInstallment = ({
  user,
  installment,
  children,
}: {
  user: User;
  installment: SubscriptionInstallment & {
    SubscriptionInstallmentLimitation: SubscriptionInstallmentLimitation | null;
  };
  children: ReactNode;
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const isPaid = installment.isPaid;
  const isOverdue = !isPaid && new Date(installment.dueDate) < new Date();
  const hasLateFee = installment.lateFee > 0 && isOverdue;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl space-y-4 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Cicilan</DialogTitle>
        </DialogHeader>

        {/* User Info */}
        <div className="space-y-3 pb-4 border-b">
          <div>
            <div className="font-semibold mb-2">User</div>
            <div className="flex items-center gap-3">
              <UserAvatar
                name={user.name}
                image={user.image}
              />
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                User ID
              </p>
              <p className="font-mono text-sm text-black">{user.id}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Bergabung Sejak
              </p>
              <p className="font-medium text-black/70">
                {getDateString(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Installment Details */}
        <div className="space-y-3">
          <div className="font-semibold text-lg">
            Cicilan #{installment.installmentNumber}
          </div>

          <div className="p-4 border rounded-lg space-y-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <Badge
                className={
                  isPaid
                    ? 'bg-green-100 text-green-700'
                    : isOverdue
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                }
              >
                {isPaid ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Lunas
                  </div>
                ) : isOverdue ? (
                  <div className="flex items-center gap-1">
                    <AlertTriangle size={12} />
                    Tertunda
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    Pending
                  </div>
                )}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Nominal
                </p>
                <p className="text-xl font-bold text-black">
                  {formatPrice(installment.amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Jatuh Tempo
                </p>
                <p className="font-medium text-black">
                  {getDateString(installment.dueDate)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Akses Berakhir
                </p>
                <p className="font-medium text-black">
                  {getDateString(installment.expiredAccessDate)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold">
                  Reminder Dikirim
                </p>
                <p className="font-medium text-black">
                  {installment.reminderSentAt
                    ? getDateString(installment.reminderSentAt)
                    : '-'}
                </p>
                {installment.reminderCount > 0 && (
                  <p className="text-xs text-gray-500">
                    ({installment.reminderCount}x)
                  </p>
                )}
              </div>
            </div>

            {installment.gracePeriodEndDate && (
              <div className="p-3 bg-green-50 rounded border border-green-200">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">
                  Masa Tenggang
                </p>
                <p className="text-green-700 font-medium">
                  Hingga {getDateString(installment.gracePeriodEndDate)}
                </p>
              </div>
            )}

            {hasLateFee && (
              <div className="p-3 bg-orange-50 rounded border border-orange-200">
                <p className="text-xs font-semibold text-orange-900 mb-1">
                  Denda Keterlambatan
                </p>
                <p className="text-sm text-orange-700">
                  {formatPrice(installment.lateFee)}
                </p>
                <p className="text-xs text-orange-600 mt-1">
                  Total dengan denda:{' '}
                  {formatPrice(installment.amountWithLateFee)}
                </p>
              </div>
            )}
          </div>

          {installment.SubscriptionInstallmentLimitation && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Limitasi Akses
              </p>
              <div className="flex flex-wrap gap-2">
                {['chat', 'notes', 'vision', 'quiz', 'tryout'].map((key) => {
                  const value =
                    installment.SubscriptionInstallmentLimitation?.[
                      key as keyof SubscriptionInstallmentLimitation
                    ];
                  return value ? (
                    <Badge
                      key={key}
                      variant="outline"
                      className="text-xs capitalize"
                    >
                      {key}: {value}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {installment.transactionId && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase font-semibold">
                Transaction ID
              </p>
              <p className="font-mono text-sm text-black">
                {installment.transactionId}
              </p>
            </div>
          )}
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
