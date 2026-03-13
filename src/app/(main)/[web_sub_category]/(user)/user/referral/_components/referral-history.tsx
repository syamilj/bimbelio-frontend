'use client';

import { Loader2, Search } from 'lucide-react';
import Papa from 'papaparse';
import { ReactNode, useEffect, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';

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
import { toaster } from '@/components/ui/toaster';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { formatDateTime } from '@/lib/utils';
import { formatIDR } from '@/lib/utils/currency';
import { Transaction } from '@/types/database';

export default function ReferralHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState<'ALL' | 'Percentage' | 'Fixed_Amount'>(
    'ALL',
  );
  const [take, setTake] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const {
    data: ReferralHistories,
    totalPages,
    isLoading,
    refetch: ReferralHistoriesRefetch,
  } = useGet<
    (Transaction & {
      total_amount: number;
      user: {
        email: string;
        name: string;
      };
    })[]
  >('/referral/getUserReferralHistory', {
    params: {
      page,
      take,
      search: searchTerm,
    },
    useEffectDependencies: [page, take, searchTerm],
  });

  console.log({ ReferralHistories });

  return (
    <>
      {/* {isLoadingMessage && <AbsoluteLoader heading={isLoadingMessage} />} */}

      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          History Referral
        </h2>
        <Card>
          <CardContent className="pb-0">
            <div className="grid gap-4 md:grid-cols-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari judul voucher atau code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-3xl border-gray-200 focus:border-blue-500"
                />
              </div>
              <Select
                value={type}
                onValueChange={(value: any) => setType(value)}
              >
                <SelectTrigger className="rounded-3xl border-gray-200">
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
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Komisi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell
                        colSpan={5}
                        className="h-[48.5px]"
                      >
                        <Skeleton className="w-full h-full rounded-3xl" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : ReferralHistories?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      Tidak ada voucher yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  ReferralHistories?.map((history, index) => (
                    <TableRow key={history.id}>
                      <TableCell>{page * take - take + index + 1}</TableCell>
                      <TableCell>{history.user.name}</TableCell>
                      <TableCell className="font-medium text-black">
                        {history.user.email}
                      </TableCell>
                      <TableCell className="text-black">
                        {formatDateTime(history.createdAt)}
                      </TableCell>

                      <TableCell>
                        {history.referral_discount_type === 'FIXED_AMOUNT' &&
                        history.referral_discount
                          ? formatIDR(history.referral_discount)
                          : history.referral_discount_type === 'PERCENTAGE' &&
                              history.referral_discount
                            ? `${formatIDR((history.total_amount * history.referral_discount) / 100)}`
                            : '-'}
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

const DialogImportVouchers = ({
  children,
  onSuccess,
}: {
  children: ReactNode;
  onSuccess: () => Promise<any>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const [file, setFile] = useState<File | undefined>();

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const { mutate: SaveVouchers } = useMutation(
    '/voucher/createManyVoucher',
    'post',
  );

  type Payload = {
    title: string;
    voucherCode: string;
    type: 'Percentage' | 'Fixed_Amount';
    discount: number;
    startDate: string;
    endDate?: string;
    usageLimit?: number;
    voucherPlanType: 'ALL_PLAN' | 'SELECTED_PLAN';
    planIds: string[];
  };

  const handleGenerate = () => {
    setIsLoading(true);
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results: any) {
          const data = results.data;

          const fixData: Payload[] = data.map((item: any) => {
            return {
              title: item?.Title,
              voucherCode: item?.Code,
              type:
                item?.Tipe === 'Fixed'
                  ? 'Fixed_Amount'
                  : item?.Tipe === 'Percentage'
                    ? 'Percentage'
                    : null,
              discount: parseFloat(item?.Discount),
              startDate: new Date(),
              usageLimit: parseInt(item?.Limit),
              voucherPlanType: item?.PlanType,
              planIds: item?.PlanIds || [],
            };
          });

          await SaveVouchers({
            payload: {
              vouchers: fixData,
            },
          });
          await onSuccess();

          setIsLoading(false);
          setOpen(false);
        },
        error: function (error: any) {
          console.error(error);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Gagal membaca file CSV!',
          });
          setIsLoading(false);
        },
      });
    }
  };

  useEffect(() => {
    if (!open) {
      setFile(undefined);
    }
  }, [open]);

  return (
    <Dialog
      open={isLoading ? true : open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold mb-2">
            Import Soal dari CSV
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-semibold underline">Format CSV:</p>
          <p className="font-semibold">
            Title | Code | Tipe{' '}
            <span className="text-xs text-gray-500 my-auto">
              (&quot;Percentage&quot; / &quot;Fixed&quot;){' '}
            </span>{' '}
            | Discount | Limit | Plan_Type{' '}
            <span className="text-xs text-gray-500 my-auto">
              (&quot;ALL_PLAN&quot; / &quot;SELECTED_PLAN&quot;)
            </span>{' '}
            | PlanIds
          </p>

          <div className="relative grid w-full grid-cols-1 gap-[.5rem] pt-8 text-[.9rem]">
            <input
              id="uploadCSV"
              type="file"
              accept=".csv"
              className="absolute left-0 top-0 w-0 p-0"
              onChange={(e) => handleChangeFile(e)}
            />
            {file ? (
              <button
                className="w-full shrink-0 cursor-pointer rounded-3xl bg-blue-100 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                ) : (
                  'Generate'
                )}
              </button>
            ) : (
              <div
                className="w-full shrink-0 cursor-pointer rounded-3xl bg-blue-100 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
                onClick={() => {
                  document.getElementById('uploadCSV')?.click();
                }}
              >
                Upload
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
