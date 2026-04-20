'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import LoadingPageWithText, {
  LoadingComponentWithText,
} from '@/components/ui/spinner';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { responseError } from '@/lib/response';
import { cn, getDateForInputDateTime } from '@/lib/utils';
import { IconPlus } from '@/styles/icon';
import {
  Pivot_TryoutCoupon_Tryout,
  Tryout,
  TryoutCoupon,
} from '@/types/database';
import { ArrowLeft, Check, ChevronsUpDown, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type VoucherPayloadType = {
  title: string;
  code: string;
  startDate: string;
  endDate?: string;
  usageLimit?: string;
};

export default function CreateVoucher() {
  const router = useRouter();
  const { voucherId }: { voucherId: string } = useParams();

  const [searchTryout, setSearchTryout] = useState<string>('');
  const [showDeleteIndex, setShowDeleteIndex] = useState<number | null>(null);

  const {
    register,
    // handleSubmit: SubmitForm,
    // reset,
    watch,
    setValue,
    // formState: { isSubmitting },
  } = useForm<VoucherPayloadType>({
    defaultValues: {
      title: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
    },
  });

  const title = watch('title');
  const code = watch('code');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const usageLimit = watch('usageLimit');

  const { data: TryoutList } = useGet<Tryout[]>('/tryoutCoupon/getTryoutList', {
    params: {
      search: searchTryout,
      take: 10,
      page: 1,
    },
    debounceTime: 1000,
    enabled: searchTryout.length >= 3 || searchTryout.length === 0,
    useEffectDependencies: [searchTryout],
  });

  const [selectedTryout, setSelectedTryout] = useState<
    { title: string; id: string; open: boolean }[]
  >([]);

  const { data: Coupon, isLoading: CouponIsLoading } = useGet<
    TryoutCoupon & {
      Pivot_TryoutCoupon_Tryout: (Pivot_TryoutCoupon_Tryout & {
        Tryout: Tryout;
      })[];
    }
  >('/tryoutCoupon/getSingleCoupon', {
    params: { id: voucherId },
    useEffectDependencies: [voucherId],
  });

  useEffect(() => {
    if (Coupon) {
      setValue('title', Coupon.title);
      setValue('code', Coupon.code);
      setValue('startDate', getDateForInputDateTime(Coupon.startDate));
      if (Coupon.endDate) {
        setValue('endDate', getDateForInputDateTime(Coupon.endDate));
      }
      if (Coupon.usageLimit) {
        setValue('usageLimit', Coupon.usageLimit.toString());
      }
      setSelectedTryout(
        Coupon.Pivot_TryoutCoupon_Tryout.map((item) => ({
          id: item.Tryout.id,
          title: item.Tryout.title,
          open: false,
        })),
      );
    }
  }, [Coupon]);

  const { mutate: SaveCoupon } = useMutation('/tryoutCoupon/editCoupon', 'put');

  // ==================================================

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const payload = {
        id: Coupon?.id,
        title,
        code,
        startDate,
        endDate,
        usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
        tryoutIds: selectedTryout
          .map((item) => item.id)
          .filter((id) => id.length > 0),
      };
      await SaveCoupon({ payload });
    } catch (error) {
      responseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (CouponIsLoading) {
    return <LoadingComponentWithText heading="Mengambil data vocuher" />;
  }

  return (
    <div className="space-y-6">
      <LoadingPageWithText
        loading={isLoading}
        heading="Mengupdate Voucher..."
      />
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Update Voucher</h1>
          <p className="text-gray-600">Update data voucher</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...register('title')}
                    placeholder="Voucher Lebaran"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">
                    Code Voucher<span className="text-red-500">*</span>{' '}
                    <span
                      className="bg-main-default rounded-full px-3 text-xs text-white py-1 cursor-pointer hover:bg-main-default/90"
                      onClick={() => {
                        setValue(
                          'code',
                          crypto.randomUUID().toUpperCase().slice(0, 6),
                        );
                      }}
                    >
                      generate
                    </span>
                  </Label>
                  <Input
                    {...register('code')}
                    placeholder="YS3ND8"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">
                    Mulai <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    {...register('startDate')}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">
                    Berakhir <span className="text-gray-500">(optional)</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    {...register('endDate')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">
                  Batas Penggunaan{' '}
                  <span className="text-gray-500">(optional)</span>
                </Label>
                <Input
                  type="number"
                  {...register('usageLimit')}
                  placeholder="contoh: 3"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pilih Tryout
              </CardTitle>
            </CardHeader>
            <CardContent className="">
              <div className="flex items-start gap-4">
                {selectedTryout.map((tryout, tryoutIndex) => (
                  <Popover
                    open={tryout.open}
                    onOpenChange={() => {
                      setSelectedTryout((prev) => {
                        return prev.map((item, index) => {
                          if (tryoutIndex === index)
                            return { ...item, open: !item.open };
                          else return { ...item };
                        });
                      });
                    }}
                    key={tryoutIndex}
                  >
                    <div
                      className="relative pb-6"
                      onMouseOver={() => setShowDeleteIndex(tryoutIndex)}
                      onMouseLeave={() => setShowDeleteIndex(null)}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={tryout.open}
                          className="min-w-[200px] justify-between"
                        >
                          {tryout.title || 'Select Tryout'}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      {showDeleteIndex === tryoutIndex && (
                        <div
                          className="absolute bottom-[0] right-0 cursor-pointer rounded-3xl bg-red-100 px-[.5rem] py-[.1rem] text-[.75rem] text-red-800 duration-300 md:hover:bg-red-200"
                          onClick={() => {
                            setSelectedTryout((prev) =>
                              prev.filter((_, i) => i !== tryoutIndex),
                            );
                          }}
                        >
                          Hapus
                        </div>
                      )}
                    </div>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Tags..."
                          value={searchTryout}
                          onValueChange={(value) => setSearchTryout(value)}
                        />
                        <CommandList>
                          <CommandEmpty>No tryout found.</CommandEmpty>
                          <CommandGroup>
                            {(TryoutList || []).map((tryoutItem) => {
                              const isExsist = selectedTryout.find(
                                (item) => item.id === tryoutItem.id,
                              );
                              return (
                                <CommandItem
                                  key={tryoutItem.title}
                                  value={tryoutItem.title}
                                  onSelect={(currentValue) => {
                                    if (isExsist) return;
                                    setSelectedTryout((prev) => {
                                      return prev.map((item, valIndex) => {
                                        if (tryoutIndex === valIndex) {
                                          return {
                                            open: false,
                                            title: currentValue,
                                            id: tryoutItem.id,
                                          };
                                        }
                                        return { ...item };
                                      });
                                    });
                                  }}
                                  className={cn(
                                    isExsist &&
                                      'opacity-50  pointer-events-none',
                                  )}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      isExsist ? 'opacity-100' : 'opacity-0',
                                    )}
                                  />
                                  {tryoutItem.title}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ))}
                <div
                  className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-3xl bg-blue-100 font-medium text-blue-600 duration-300 md:hover:bg-blue-200 md:hover:shadow-default md:active:bg-blue-100"
                  onClick={() => {
                    setSelectedTryout((prev) => [
                      ...prev,
                      { title: '', open: false, id: '' },
                    ]);
                  }}
                >
                  <IconPlus w={15} />
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="w-full flex items-center justify-end">
            <div className="flex gap-3 w-fit">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                Simpan
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
