'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import LoadingPageWithText, {
  LoadingComponentWithText,
} from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { responseError } from '@/lib/response';
import { getDateForInputDateTime } from '@/lib/utils';
import { Pivot_Voucher_Plan, Plan, Voucher } from '@/types/database';
import { SelectValue } from '@radix-ui/react-select';
import { ArrowLeft, Percent, Save } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CardSubs } from './_components/card-subs';

type VoucherPayloadType = {
  title: string;
  voucherCode: string;
  type: 'Percentage' | 'Fixed_Amount' | '';
  discount: string;
  startDate: string;
  endDate?: string;
  usageLimit?: string;
  voucherPlanType: 'ALL_PLAN' | 'SELECTED_PLAN';
};

export default function CreateVoucher() {
  const router = useRouter();
  const { voucherId }: { voucherId: string } = useParams();

  const {
    register,
    handleSubmit: SubmitForm,
    control,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<VoucherPayloadType>({
    defaultValues: {
      title: '',
      voucherCode: '',
      type: '',
      discount: '',
      startDate: '',
      endDate: '',
      usageLimit: '',
    },
  });

  const title = watch('title');
  const voucherCode = watch('voucherCode');
  const type = watch('type');
  const discount = watch('discount');
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const usageLimit = watch('usageLimit');

  const { data: plans } = useGet<PlanType>('/plan/getAllPlanForPricingPage');

  const bundles = plans?.bundles;
  const subscription = plans?.subscriptions;

  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [planType, setPlanType] = useState<'ALL_PLAN' | 'SELECTED_PLAN'>(
    'ALL_PLAN',
  );

  const { data: Voucher, isLoading: VoucherIsLoading } = useGet<
    Voucher & {
      Pivot_Voucher_Plan: (Pivot_Voucher_Plan & { Plan: Plan })[];
    }
  >('/voucher/getSingleVoucher', {
    params: { id: voucherId },
    useEffectDependencies: [voucherId],
  });

  useEffect(() => {
    if (Voucher) {
      setValue('title', Voucher.title);
      setValue('type', Voucher.type);
      setValue('discount', Voucher.discount.toString());
      setValue('voucherCode', Voucher.voucherCode);
      setValue('startDate', getDateForInputDateTime(Voucher.startDate));
      if (Voucher.endDate) {
        setValue('endDate', getDateForInputDateTime(Voucher.endDate));
      }
      if (Voucher.usageLimit) {
        setValue('usageLimit', Voucher.usageLimit.toString());
      }
      setPlanType(Voucher.voucherPlanType);
      setSelectedPlanIds(Voucher.Pivot_Voucher_Plan.map((item) => item.planId));
    }
  }, [Voucher]);

  const { mutate: SaveVoucher } = useMutation('/voucher/editVoucher', 'put');

  // ==================================================

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const payload = {
        id: Voucher?.id,
        title,
        voucherCode,
        type,
        discount: parseFloat(discount),
        startDate,
        endDate,
        usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
        voucherPlanType: planType,
        planIds: planType === 'ALL_PLAN' ? [] : selectedPlanIds,
      };
      await SaveVoucher({ payload });
    } catch (error) {
      responseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (VoucherIsLoading) {
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
                          'voucherCode',
                          crypto.randomUUID().toUpperCase().slice(0, 6),
                        );
                      }}
                    >
                      generate
                    </span>
                  </Label>
                  <Input
                    {...register('voucherCode')}
                    placeholder="YS3ND8"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">
                    Type Voucher <span className="text-red-500">*</span>
                  </Label>
                  {type && (
                    <Select
                      name="type"
                      required
                      onValueChange={(value) => setValue('type', value as any)}
                      value={type}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe voucher" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Percentage">Percentage</SelectItem>
                        <SelectItem value="Fixed_Amount">
                          Fixed Amount
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code">
                    Dicount Value
                    <span className="text-red-500">*</span>
                  </Label>
                  {!type && (
                    <Input
                      placeholder="Pilih type voucher dahulu"
                      disabled
                      required
                    />
                  )}
                  {type && (
                    <Controller
                      name="discount"
                      control={control}
                      defaultValue=""
                      render={({ field }) => {
                        const rawValue = field.value?.replace(/\D/g, '') || '';

                        const formatted = new Intl.NumberFormat('id-ID').format(
                          Number(rawValue),
                        );

                        return (
                          <div className="relative rounded-xl overflow-hidden">
                            <div className="absolute top-0 left-0 h-full flex justify-center items-center bg-main w-10 text-white">
                              {type === 'Fixed_Amount' ? (
                                <p>Rp</p>
                              ) : (
                                <Percent className="w-4 h-4" />
                              )}
                            </div>
                            <Input
                              className="pl-12"
                              {...field}
                              value={formatted === '0' ? '' : formatted}
                              onChange={(e) => {
                                const onlyNumbers = e.target.value.replace(
                                  /\D/g,
                                  '',
                                );
                                if (
                                  parseInt(onlyNumbers) > 100 &&
                                  type === 'Percentage'
                                ) {
                                  return;
                                }
                                if (parseInt(onlyNumbers) < 0) {
                                  return;
                                }
                                field.onChange(onlyNumbers);
                              }}
                              placeholder={
                                type === 'Fixed_Amount'
                                  ? 'contoh: 100000'
                                  : 'rentang: 0 - 100'
                              }
                              required
                            />
                          </div>
                        );
                      }}
                    />
                  )}
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
                Pilih Plan
              </CardTitle>
            </CardHeader>
            <Tabs
              value={planType}
              className="w-full"
              onValueChange={(value) => {
                setPlanType(value as any);
              }}
            >
              <TabsList className="grid w-fit max-w-md mx-start grid-cols-2 mb-8 bg-[#e6f0ff] p-1 rounded-full">
                <TabsTrigger
                  value="ALL_PLAN"
                  className="rounded-full data-[state=active]:bg-main-default"
                >
                  Semua Plan
                </TabsTrigger>
                <TabsTrigger
                  value="SELECTED_PLAN"
                  className="rounded-full data-[state=active]:bg-main-default"
                >
                  Plan Terpilih saja
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ALL_PLAN"></TabsContent>

              <TabsContent value="SELECTED_PLAN">
                <CardContent className="flex flex-col gap-4">
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold">
                      Bundles{' '}
                      <span className="text-gray-400 text-xs font-medium">
                        ( Subscription + Coin )
                      </span>
                    </Label>
                    <div className="flex justify-start gap-4 flex-wrap">
                      {bundles?.map((item) => {
                        const isSelected = selectedPlanIds.some(
                          (id) => id === item.id,
                        );
                        return (
                          <CardSubs
                            key={item.id}
                            data={item}
                            onClick={() => {
                              if (!isSelected) {
                                setSelectedPlanIds((prev) => [
                                  ...prev,
                                  item.id,
                                ]);
                              } else {
                                setSelectedPlanIds((prev) =>
                                  prev.filter((id) => id !== item.id),
                                );
                              }
                            }}
                            isSelected={isSelected}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xl font-semibold">
                      Subscription
                    </Label>
                    <div className="flex justify-start gap-4 flex-wrap">
                      {subscription?.map((item) => {
                        const isSelected = selectedPlanIds.some(
                          (id) => id === item.id,
                        );
                        return (
                          <CardSubs
                            key={item.id}
                            data={item}
                            onClick={() => {
                              if (!isSelected) {
                                setSelectedPlanIds((prev) => [
                                  ...prev,
                                  item.id,
                                ]);
                              } else {
                                setSelectedPlanIds((prev) =>
                                  prev.filter((id) => id !== item.id),
                                );
                              }
                            }}
                            isSelected={isSelected}
                          />
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
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

type PlanType = {
  bundles: PlanDataType[];
  subscriptions: PlanDataType[];
  topping: PlanDataType[];
  productCompare: {
    subscription: PlanDataType[];
    bundles: PlanDataType[];
    listCompare: string[];
  };
};

type PlanDataType = {
  id: string;
  tier: string;
  name: string;
  description: string;
  price: number;
  timeline: string | null;
  features:
    | {
        name: string;
        features: string[];
      }[]
    | undefined;
  coins:
    | {
        name: string;
        total: any;
      }[]
    | undefined;
  limitations: {
    Document: string | null;
    Course: string | null;
    Notes: string | null;
    Chat: string | null;
    Tryout: string | null;
    Quiz: string | null;
    Vision: string | null;
  };
  popular: boolean;
};
