'use client';

import { AdminFormActions, AdminFormSection, AdminNotFound, AdminPageHeader } from '@/components/admin/admin-page';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingPageWithText, { LoadingComponentWithText } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { responseError } from '@/lib/response';
import { getDateForInputDateTime } from '@/lib/utils';
import { Pivot_Voucher_Plan, Plan, Voucher } from '@/types/database';
import { Percent } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { CardSubs } from '@/components/admin/card-subs';

// Satu form untuk tambah & edit voucher (dulu dua halaman salinan ~520 baris).

type VoucherPayloadType = {
  title: string;
  voucherCode: string;
  type: 'Percentage' | 'Fixed_Amount' | '';
  discount: string;
  startDate: string;
  endDate?: string;
  usageLimit?: string;
};

type VoucherDetail = Voucher & {
  Pivot_Voucher_Plan: (Pivot_Voucher_Plan & { Plan: Plan })[];
};

type PlanDataType = {
  id: string;
  tier: string;
  name: string;
  description: string;
  price: number;
  timeline: string | null;
  features: { name: string; features: string[] }[] | undefined;
  coins: { name: string; total: any }[] | undefined;
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

type PlanType = {
  bundles: PlanDataType[];
  subscriptions: PlanDataType[];
  topping: PlanDataType[];
};

const PlanGroup = ({
  label,
  hint,
  plans,
  selectedIds,
  onToggle,
}: {
  label: string;
  hint?: string;
  plans: PlanDataType[] | undefined;
  selectedIds: string[];
  onToggle: (id: string) => void;
}) => (
  <div className="space-y-4">
    <Label className="text-xl font-semibold">
      {label} {hint && <span className="text-xs font-medium text-gray-400">{hint}</span>}
    </Label>
    <div className="flex flex-wrap justify-start gap-4">
      {plans?.map((item) => (
        <CardSubs
          key={item.id}
          data={item}
          isSelected={selectedIds.includes(item.id)}
          onClick={() => onToggle(item.id)}
        />
      ))}
    </div>
  </div>
);

export const VoucherForm = ({ voucherId }: { voucherId?: string }) => {
  const isEdit = !!voucherId;

  const { register, control, watch, setValue } = useForm<VoucherPayloadType>({
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
  const [title, voucherCode, type, discount, startDate, endDate, usageLimit] = watch([
    'title',
    'voucherCode',
    'type',
    'discount',
    'startDate',
    'endDate',
    'usageLimit',
  ]);

  const { data: plans } = useGet<PlanType>('/plan/getAllPlanForPricingPage');

  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
  const [planType, setPlanType] = useState<'ALL_PLAN' | 'SELECTED_PLAN'>('ALL_PLAN');
  const togglePlan = (id: string) =>
    setSelectedPlanIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const { data: voucher, isLoading: isLoadingVoucher } = useGet<VoucherDetail>(
    '/voucher/getSingleVoucher',
    {
      enabled: isEdit,
      params: { id: voucherId },
      useEffectDependencies: [voucherId],
    },
  );

  useEffect(() => {
    if (!voucher) return;
    setValue('title', voucher.title);
    setValue('type', voucher.type);
    setValue('discount', voucher.discount.toString());
    setValue('voucherCode', voucher.voucherCode);
    setValue('startDate', getDateForInputDateTime(voucher.startDate));
    if (voucher.endDate) setValue('endDate', getDateForInputDateTime(voucher.endDate));
    if (voucher.usageLimit) setValue('usageLimit', voucher.usageLimit.toString());
    setPlanType(voucher.voucherPlanType);
    setSelectedPlanIds(voucher.Pivot_Voucher_Plan.map((item) => item.planId));
  }, [voucher, setValue]);

  const { mutate: saveVoucher } = useMutation(
    isEdit ? '/voucher/editVoucher' : '/voucher/createVoucher',
    isEdit ? 'put' : 'post',
  );

  const [isSaving, setIsSaving] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveVoucher({
        payload: {
          ...(isEdit ? { id: voucher?.id } : {}),
          title,
          voucherCode,
          type,
          discount: parseFloat(discount),
          // ISO (UTC) agar tidak bergantung zona waktu server.
          startDate: new Date(startDate).toISOString(),
          endDate: endDate ? new Date(endDate).toISOString() : undefined,
          usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
          voucherPlanType: planType,
          planIds: planType === 'ALL_PLAN' ? [] : selectedPlanIds,
        },
      });
    } catch (error) {
      responseError(error);
    } finally {
      setIsSaving(false);
    }
  };

  // useGet mulai dalam status loading walau dinonaktifkan; hanya relevan saat edit.
  if (isEdit && isLoadingVoucher) {
    return <LoadingComponentWithText heading="Mengambil data voucher..." />;
  }
  if (isEdit && !voucher) return <AdminNotFound title="Voucher tidak ditemukan" />;

  return (
    <div className="space-y-6">
      <LoadingPageWithText loading={isSaving} heading="Menyimpan voucher..." />
      <AdminPageHeader
        title={isEdit ? 'Edit Voucher' : 'Tambah Voucher'}
        description={isEdit ? 'Perbarui data voucher' : 'Buat voucher diskon baru'}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminFormSection title="Informasi Dasar">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">
                Judul <span className="text-red-500">*</span>
              </Label>
              <Input id="title" {...register('title')} placeholder="Voucher Lebaran" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="voucherCode">
                Kode Voucher <span className="text-red-500">*</span>{' '}
                <button
                  type="button"
                  className="bg-main-default hover:bg-main-default/90 rounded-full px-3 py-1 text-xs text-white"
                  onClick={() => setValue('voucherCode', crypto.randomUUID().toUpperCase().slice(0, 6))}
                >
                  Buat otomatis
                </button>
              </Label>
              <Input id="voucherCode" {...register('voucherCode')} placeholder="YS3ND8" maxLength={10} required />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">
                Tipe Voucher <span className="text-red-500">*</span>
              </Label>
              {/* Saat edit, Select baru dirender setelah nilai terisi supaya tampil benar. */}
              {(!isEdit || type) && (
                <Select
                  name="type"
                  required
                  onValueChange={(value) => setValue('type', value as VoucherPayloadType['type'])}
                  value={type}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Pilih tipe voucher" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Percentage">Persentase</SelectItem>
                    <SelectItem value="Fixed_Amount">Nominal tetap</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">
                Nilai Diskon <span className="text-red-500">*</span>
              </Label>
              {!type ? (
                <Input placeholder="Pilih tipe voucher dahulu" disabled />
              ) : (
                <Controller
                  name="discount"
                  control={control}
                  render={({ field }) => {
                    const rawValue = field.value?.replace(/\D/g, '') || '';
                    const formatted = new Intl.NumberFormat('id-ID').format(Number(rawValue));
                    return (
                      <div className="relative overflow-hidden rounded-3xl">
                        <div className="bg-main absolute top-0 left-0 flex h-full w-10 items-center justify-center text-white">
                          {type === 'Fixed_Amount' ? <p>Rp</p> : <Percent className="h-4 w-4" />}
                        </div>
                        <Input
                          id="discount"
                          className="pl-12"
                          {...field}
                          value={formatted === '0' ? '' : formatted}
                          onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(/\D/g, '');
                            if (type === 'Percentage' && parseInt(onlyNumbers) > 100) return;
                            field.onChange(onlyNumbers);
                          }}
                          placeholder={type === 'Fixed_Amount' ? 'contoh: 100000' : 'rentang: 0 - 100'}
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
              <Input id="startDate" type="datetime-local" {...register('startDate')} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">
                Berakhir <span className="text-gray-500">(opsional)</span>
              </Label>
              <Input id="endDate" type="datetime-local" {...register('endDate')} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usageLimit">
              Batas Penggunaan <span className="text-gray-500">(opsional)</span>
            </Label>
            <Input id="usageLimit" type="number" {...register('usageLimit')} placeholder="contoh: 3" />
          </div>
        </AdminFormSection>

        <AdminFormSection title="Berlaku untuk Plan">
          <Tabs value={planType} className="w-full" onValueChange={(value) => setPlanType(value as typeof planType)}>
            <TabsList className="mx-start mb-8 grid w-fit max-w-md grid-cols-2 rounded-full bg-[#e6f0ff] p-1">
              <TabsTrigger value="ALL_PLAN" className="data-[state=active]:bg-main-default rounded-full">
                Semua Plan
              </TabsTrigger>
              <TabsTrigger value="SELECTED_PLAN" className="data-[state=active]:bg-main-default rounded-full">
                Plan Tertentu
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ALL_PLAN" />
            <TabsContent value="SELECTED_PLAN" className="flex flex-col gap-4">
              <PlanGroup
                label="Bundles"
                hint="( Subscription + Coin )"
                plans={plans?.bundles}
                selectedIds={selectedPlanIds}
                onToggle={togglePlan}
              />
              <PlanGroup
                label="Subscription"
                plans={plans?.subscriptions}
                selectedIds={selectedPlanIds}
                onToggle={togglePlan}
              />
              <PlanGroup label="Koin" plans={plans?.topping} selectedIds={selectedPlanIds} onToggle={togglePlan} />
            </TabsContent>
          </Tabs>
        </AdminFormSection>

        <AdminFormActions isSubmitting={isSaving} />
      </form>
    </div>
  );
};
