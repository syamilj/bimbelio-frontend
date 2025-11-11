'use client';

import {
  Edit,
  Eye,
  Import,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Trash,
} from 'lucide-react';
import Papa from 'papaparse';
import { ReactNode, useEffect, useState } from 'react';

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
import { toaster } from '@/components/ui/toaster';
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
import { Pivot_Voucher_Plan, Plan, Voucher } from '@/types/database';
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
      _count: {
        Transaction: number;
      };
    })[]
  >('/voucher/getAllVoucher', {
    params: {
      page,
      take,
      search: searchTerm,
    },
    useEffectDependencies: [page, take, searchTerm],
  });

  console.log({ Vouchers });

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
          <div className="flex items-center justify-center gap-4">
            {/* <Button className="gap-2">
              <Import className="h-4 w-4" />
              Import CSV
            </Button> */}
            <DialogImportVouchers onSuccess={VouchersRefetch}>
              <Button className="gap-2">
                <Import className="h-4 w-4" />
                Import CSV
              </Button>
            </DialogImportVouchers>
            <Link href={'voucher/new'}>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Buat Voucher
              </Button>
            </Link>
          </div>
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
                  <TableHead>Digunakan</TableHead>
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
                        {voucher._count.Transaction} kali
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
                                    <Badge key={item.id}>
                                      {item.Plan.name}
                                    </Badge>
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
                className="w-full shrink-0 cursor-pointer rounded-[.8rem] bg-blue-100 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
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
                className="w-full shrink-0 cursor-pointer rounded-[.8rem] bg-blue-100 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
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
