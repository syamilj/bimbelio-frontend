'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ComboboxSelect2 } from '@/components/ui/combobox-select-2';
import { Input } from '@/components/ui/input';
import { InputImage } from '@/components/ui/input-image';
import { Label } from '@/components/ui/label';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/components/ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingPageWithText, {
  LoadingComponentWithText,
} from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { responseError, throwError } from '@/lib/response';
import {
  cn,
  formatCurrency,
  getDateForInputDateTime,
  parseCurrency,
} from '@/lib/utils';
import { getSlug } from '@/lib/utils/slug';
import { supabase } from '@/supabaseClient';
import {
  Category,
  Instructor,
  LiveClass,
  Pivot_LiveClass_Plan,
  Pivot_Plan_Category,
  Plan,
  PlanBenefit,
  PlanFeature,
  PlanInstallmentConfig,
  PlanInstallmentSchedule,
  PlanInstallmentScheduleLimitation,
  PlanLimitation,
  PlanSubscription,
  PlanSubscriptionBundle,
} from '@/types/database';
import {
  // ...existing imports...
  AlertCircleIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  EyeIcon,
  FileTextIcon,
  HelpCircleIcon,
  InfoIcon,
  ListIcon,
  MessageSquareIcon,
  Plus,
  StickyNoteIcon,
  TargetIcon,
  Trash2,
  XCircleIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { LimitType, useProvider } from '../_provider/provider';

const listLimit: LimitType[] = ['chat', 'notes', 'vision', 'quiz', 'tryout'];

type PlanDataType = Plan & {
  Pivot_LiveClass_Plan: (Pivot_LiveClass_Plan & {
    LiveClass: LiveClass;
  })[];
  PlanLimitation?: PlanLimitation;
  PlanSubscription?: PlanSubscription & {
    PlanSubscriptionBundle: PlanSubscriptionBundle[];
    PlanFeature: (PlanFeature & {
      Pivot_Plan_Category: (Pivot_Plan_Category & { Category: Category })[];
    })[];
  };
  PlanBenefit?: PlanBenefit[];
  PlanInstallmentConfig?: PlanInstallmentConfig & {
    PlanInstallmentSchedule: (PlanInstallmentSchedule & {
      PlanInstallmentScheduleLimitation?: PlanInstallmentScheduleLimitation;
    })[];
  };
};

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Ganti karakter spesial dengan dash
    .replace(/^-|-$/g, ''); // Hapus dash di awal/akhir
};

export default function UpdatePlanForm() {
  const { id } = useParams();
  const {
    activeTab,
    setActiveTab,
    isLoading,
    setIsLoading,
    useBenefit: { benefitRows, setBenefitRows },
    useFeature: {
      categoryIds,
      expireType,
      liveClassIds,
      setCategoryIds,
      setLiveClassIds,
      validityType,
      setValidityType,
      selectedWebSubCategoryIds,
      setSelectedWebSubCategoryIds,
    },
    useLimitation: {
      limitRows,
      setLimitRows,
      expireTypeLimit,
      validityTypeLimit,
      setValidityTypeLimit,
    },
    useForm: {
      formData: { register, setValue },
      formDataValues: {
        roleDiscord,
        name,
        course,
        description,
        duration,
        timelineStart,
        timelineEnd,
        durationLimit,
        timelineLimitEnd,
        timelineLimitStart,
        liveClass,
        materiPremium,
        privateTalk,
        originalPrice,
        price,
        tier,
        liveClassesPerWeek,
        image,
        status,
        previewImage,
        maxUsers,
      },
    },
    useInstallment: {
      installmentConfig,
      isInstallmentEnabled,
      alertAmount,
      alertLimitation,
      setInstallmentConfig,
      setIsInstallmentEnabled,
    },
  } = useProvider();

  const { data: planData, isLoading: planDataIsLoading } = useGet<PlanDataType>(
    `/plan/getSinglePlan?id=${id}`,
    {
      onSuccess({ data: planData }) {
        if (planData) {
          setValue('name', planData.name);
          setValue('description', planData.description);
          setValue('price', planData.price.toString());
          if (planData.roleDiscord) {
            setValue('roleDiscord', planData.roleDiscord);
          }
          if (planData.maxUsers) {
            setValue('maxUsers', planData.maxUsers.toString());
          }
          if (planData.originalPrice) {
            setValue('originalPrice', planData.originalPrice.toString());
          }
          if (planData.PlanSubscription) {
            if (planData.PlanSubscription.PlanSubscriptionBundle.length > 0) {
              setSelectedWebSubCategoryIds(
                planData.PlanSubscription.PlanSubscriptionBundle.map(
                  (item) => item.websiteSubCategoryId,
                ),
              );
            }
            if (planData.PlanSubscription.expireDays) {
              setValue(
                'duration',
                planData.PlanSubscription.expireDays.toString(),
              );
              const isTimebound = planData.PlanSubscription.PlanFeature.some(
                (item) => item.isTimebound,
              );
              if (!isTimebound) {
                setValidityType('duration');
              }
            } else if (
              planData.PlanSubscription.PlanFeature.length > 0 &&
              planData.PlanSubscription.PlanFeature.some(
                (item) => item.isTimebound && item.validFrom && item.validUntil,
              )
            ) {
              setValue(
                'timelineStart',
                getDateForInputDateTime(
                  planData.PlanSubscription.PlanFeature[0].validFrom || '',
                ),
              );
              setValue(
                'timelineEnd',
                getDateForInputDateTime(
                  planData.PlanSubscription.PlanFeature[0].validUntil || '',
                ),
              );
              setValidityType('timeline');
            }
            setActiveTab((prev) => ({ ...prev, feature: true }));
            setValue('tier', planData.PlanSubscription.tier);
            planData.PlanSubscription.PlanFeature.forEach((item) => {
              if (item.type === 'COURSE') {
                setValue('course', true);
                setCategoryIds(
                  item.Pivot_Plan_Category.map((cat) => cat.categoryId),
                );
              }
              if (item.type === 'LIVECLASS') {
                setValue('liveClass', true);
                setValue(
                  'liveClassesPerWeek',
                  (item.liveClassesPerWeek || 0)?.toString(),
                );
                setLiveClassIds(
                  planData.Pivot_LiveClass_Plan.map((item) => ({
                    label: item.LiveClass.title,
                    value: item.liveClassId,
                  })),
                );
              }
              if (item.type === 'DOCUMENT') {
                setValue('materiPremium', true);
              }
              if (item.type === 'PRIVATE') {
                setValue('privateTalk', true);
              }
            });
          }
          if (planData.PlanLimitation) {
            if (
              planData.PlanLimitation.isTimebound === false &&
              planData.PlanLimitation.expireDays
            ) {
              setValue(
                'durationLimit',
                planData.PlanLimitation.expireDays.toString(),
              );
              setValidityTypeLimit('duration');
            } else if (
              planData.PlanLimitation.isTimebound === true &&
              planData.PlanLimitation.validFrom &&
              planData.PlanLimitation.validUntil
            ) {
              setValue(
                'timelineLimitStart',
                getDateForInputDateTime(
                  planData.PlanLimitation.validFrom || '',
                ),
              );
              setValue(
                'timelineLimitEnd',
                getDateForInputDateTime(
                  planData.PlanLimitation.validUntil || '',
                ),
              );
              setValidityTypeLimit('timeline');
            }
            setActiveTab((prev) => ({ ...prev, limit: true }));
            const limit = planData.PlanLimitation;
            setLimitRows([
              { id: 1, type: 'chat', limit: limit.chat.toString() },
              { id: 2, type: 'notes', limit: limit.notes.toString() },
              { id: 3, type: 'vision', limit: limit.vision.toString() },
              { id: 4, type: 'quiz', limit: limit.quiz.toString() },
              { id: 5, type: 'tryout', limit: limit.tryout.toString() },
            ]);
          }
          if (planData.PlanBenefit) {
            setBenefitRows(
              planData.PlanBenefit.map((item) => ({
                id: item.id,
                order: item.order,
                description: item.description,
                title: item.title,
              })),
            );
          }
          console.log({ check: planData.PlanInstallmentConfig });
          if (
            planData.PlanInstallmentConfig &&
            planData.PlanInstallmentConfig.PlanInstallmentSchedule.length > 0
          ) {
            setIsInstallmentEnabled(true);
            const isCustomeLimitation = planData.PlanInstallmentConfig
              .PlanInstallmentSchedule[0].PlanInstallmentScheduleLimitation
              ? true
              : false;

            setInstallmentConfig({
              id: planData.PlanInstallmentConfig.id,
              totalInstallments:
                planData.PlanInstallmentConfig.totalInstallments.toString(),
              totalAmount:
                planData.PlanInstallmentConfig.totalAmount.toString(),
              gracePeriodDays:
                planData.PlanInstallmentConfig.gracePeriodDays.toString(),
              isCustomeLimitation,
              InstallmentSchedules:
                planData.PlanInstallmentConfig.PlanInstallmentSchedule.map(
                  (item) => {
                    return {
                      id: item.id,
                      installmentNumber: item.installmentNumber.toString(),
                      daysAfterFirstPayment:
                        item.daysAfterFirstPayment.toString(),
                      amount: item.amount.toString(),
                      description: item.description || undefined,
                      lateFeeType: item.lateFeeType,
                      lateFeeAmount:
                        item.lateFeeAmount?.toString() || undefined,
                      expireDaysAfterFirstPayment:
                        item.expireDaysAfterFirstPayment.toString(),
                      PlanInstallmentScheduleLimitation:
                        item.PlanInstallmentScheduleLimitation
                          ? {
                              chat: item.PlanInstallmentScheduleLimitation.chat.toString(),
                              notes:
                                item.PlanInstallmentScheduleLimitation.notes.toString(),
                              vision:
                                item.PlanInstallmentScheduleLimitation.vision.toString(),
                              quiz: item.PlanInstallmentScheduleLimitation.quiz.toString(),
                              tryout:
                                item.PlanInstallmentScheduleLimitation.tryout.toString(),
                            }
                          : undefined,
                    };
                  },
                ),
            });
          }
          setValue('status', planData.status);
          if (planData.image) {
            setValue('previewImage', planData.image);
          }
        }
      },
    },
  );

  console.log({ planData });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isInstallmentEnabled) {
      if (installmentConfig.InstallmentSchedules.length === 0) {
        toaster({
          title: 'Error',
          condition: 'warning',
          description: 'Installment schedule belum terisi!',
          duration: 3000,
        });
        setIsLoading(false);
        return;
      }

      if (
        alertAmount ||
        (alertLimitation && installmentConfig.isCustomeLimitation)
      ) {
        toaster({
          title: 'Error',
          condition: 'warning',
          description: 'Cek ringkasan cicilan untuk memperbaiki kesalahan!',
          duration: 3000,
        });
        setIsLoading(false);
        return;
      }
    }

    if (activeTab.feature && validityType === 'duration' && !duration) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Duration Feature belum terisi!',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }
    if (
      activeTab.feature &&
      validityType === 'timeline' &&
      (!timelineStart || !timelineEnd)
    ) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Timeline Feature belum terisi',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    if (
      activeTab.feature &&
      !course &&
      !materiPremium &&
      !liveClass &&
      !privateTalk
    ) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Feature belum terisi',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }

    if (activeTab.limit && validityTypeLimit === 'duration' && !durationLimit) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Duration Limit belum terisi!',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }
    if (
      activeTab.limit &&
      validityTypeLimit === 'timeline' &&
      (!timelineLimitStart || !timelineLimitEnd)
    ) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Timeline Limit belum terisi',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }
    try {
      const limitRowsData = limitRows.reduce(
        (acc, row) => {
          const key = row.type as string;
          acc[key] = Number.parseInt(row.limit) || 0;
          return acc;
        },
        {} as Record<string, number>,
      );

      let imageUrl = previewImage;
      if (image) {
        const filePath = `plan/${sanitizeFileName(name)}-${crypto.randomUUID().slice(0, 4)}`;
        const { data, error } = await supabase.storage
          .from('img')
          .upload(filePath, image);
        if (error) {
          throw throwError(400, 'Gagal mengupload image');
        }
        if (data) {
          const { data: publicUrlData } = supabase.storage
            .from('img')
            .getPublicUrl(filePath);
          imageUrl = publicUrlData.publicUrl;
        }
      }

      const payload = {
        id: planData?.id,
        name,
        description,
        roleDiscord,
        price: price.length > 0 ? parseFloat(price) : 0,
        maxUsers: maxUsers ? parseInt(maxUsers) : undefined,
        originalPrice: originalPrice.length > 0 ? parseFloat(originalPrice) : 0,
        status,
        image: imageUrl,
        planLimitation: activeTab.limit
          ? {
              chat: limitRowsData?.chat || 0,
              notes: limitRowsData?.notes || 0,
              quiz: limitRowsData?.quiz || 0,
              tryout: limitRowsData?.tryout || 0,
              vision: limitRowsData?.vision || 0,
              expireDays: !durationLimit
                ? undefined
                : expireTypeLimit === 'days'
                  ? parseInt(durationLimit)
                  : expireTypeLimit === 'month'
                    ? parseInt(durationLimit) * 30
                    : expireTypeLimit === 'year'
                      ? parseInt(durationLimit) * 365
                      : 0,
              isTimebound: validityTypeLimit === 'timeline',
              validFrom:
                timelineLimitStart &&
                new Date(timelineLimitStart).toISOString(),
              validUntil:
                timelineLimitEnd && new Date(timelineLimitEnd).toISOString(),
            }
          : undefined,
        planSubscription: activeTab.feature
          ? {
              tier,
              expireDays: !duration
                ? undefined
                : expireType === 'days'
                  ? parseInt(duration)
                  : expireType === 'month'
                    ? parseInt(duration) * 30
                    : expireType === 'year'
                      ? parseInt(duration) * 365
                      : 0,
              websiteSubCategoryIds: selectedWebSubCategoryIds,
              isTimebound: validityType === 'timeline',
              validFrom: timelineStart && new Date(timelineStart).toISOString(),
              validUntil: timelineEnd && new Date(timelineEnd).toISOString(),
              planfeature: [
                { type: course ? 'COURSE' : null, categoryIds },
                { type: materiPremium ? 'DOCUMENT' : null },
                {
                  type: liveClass ? 'LIVECLASS' : null,
                  liveClassesPerWeek: parseInt(liveClassesPerWeek || '0'),
                  liveClassIds: liveClassIds.map((item) => item.value),
                },
                { type: privateTalk ? 'PRIVATE' : null },
              ].filter((item) => item.type),
            }
          : undefined,
        planBenefit: benefitRows
          .filter(
            (item) => item.title.length > 0 && item.description.length > 0,
          )
          .map((row) => ({
            id: row.id,
            order: row.order,
            title: row.title,
            description: row.description,
          })),
        PlanInstallmentConfig: isInstallmentEnabled
          ? {
              id: installmentConfig?.id || planData?.PlanInstallmentConfig?.id,
              totalInstallments: Number(installmentConfig.totalInstallments),
              totalAmount: Number(installmentConfig.totalAmount),
              gracePeriodDays: parseInt(installmentConfig.gracePeriodDays),
              PlanInstallmentSchedule:
                installmentConfig.InstallmentSchedules.map((item) => {
                  return {
                    id: item.id,
                    installmentNumber: Number(item.installmentNumber),
                    daysAfterFirstPayment: Number(item.daysAfterFirstPayment),
                    expireDaysAfterFirstPayment: Number(
                      item.expireDaysAfterFirstPayment,
                    ),
                    amount: Number(item.amount),
                    description: item.description,
                    lateFeeType: item.lateFeeType,
                    lateFeeAmount: Number(item.lateFeeAmount),
                    PlanInstallmentScheduleLimitation:
                      item.PlanInstallmentScheduleLimitation &&
                      installmentConfig.isCustomeLimitation
                        ? {
                            chat: Number(
                              item.PlanInstallmentScheduleLimitation.chat,
                            ),
                            notes: Number(
                              item.PlanInstallmentScheduleLimitation.notes,
                            ),
                            vision: Number(
                              item.PlanInstallmentScheduleLimitation.vision,
                            ),
                            quiz: Number(
                              item.PlanInstallmentScheduleLimitation.quiz,
                            ),
                            tryout: Number(
                              item.PlanInstallmentScheduleLimitation.tryout,
                            ),
                          }
                        : undefined,
                  };
                }),
            }
          : undefined,
      };

      // return;

      await mutateGeneral('/plan/editPlan', {
        payload,
        type: 'put',
        setLoading: setIsLoading,
      });
    } catch (error) {
      responseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (planDataIsLoading) {
    return <LoadingComponentWithText heading="Mengambil data plan" />;
  }

  return (
    <form
      className="mx-auto p-4 min-h-screen"
      onSubmit={handleSubmit}
    >
      <LoadingPageWithText
        loading={isLoading}
        heading="Mengupdate Plan"
      />
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 col-span-2 gap-4">
            <div className="col-span-1">
              <Label
                htmlFor="name"
                className="block mb-2"
              >
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                {...register('name')}
                onChange={(e) => {
                  setValue('name', e.target.value);
                  setValue('roleDiscord', getSlug(e.target.value));
                }}
                placeholder="Pricing Name"
                required
              />
            </div>
            <div className="col-span-1">
              <Label
                htmlFor="roleDiscord"
                className="block mb-2"
              >
                Role Discord <span className="text-gray-500">(optional)</span>
              </Label>
              <Input
                {...register('roleDiscord')}
                placeholder="Role Discord..."
              />
            </div>
          </div>
          <div className="col-span-2">
            <Label
              htmlFor="slug"
              className="block mb-2"
            >
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              {...register('description')}
              placeholder="Description"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <Label
              htmlFor="image"
              className="block mb-2"
            >
              Image <span className="text-gray-500">(optional)</span>
            </Label>
            {/* <Input
              type="file"
              {...register('image')}
              placeholder="Pricing Name"
              required
            /> */}
            <InputImage
              preview={previewImage}
              onChange={(value) => {
                setValue('image', value);
              }}
            />
          </div>
          <div className="col-span-1 flex flex-col gap-4">
            <div className="">
              <Label
                htmlFor="maxUsers"
                className="block mb-2"
              >
                Max Users <span className="text-gray-500">(optional)</span>
              </Label>
              <Input
                {...register('maxUsers')}
                placeholder="Max Users..."
              />
            </div>
            <div className="">
              <Label
                htmlFor="status"
                className="block mb-2"
              >
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={status}
                onValueChange={(value) => setValue('status', value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLIC">Public</SelectItem>
                  <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Type Section */}

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label className="text-base font-medium">Type</Label>
            </div>

            <SectionLimit />

            <SectionFeature />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label className="text-base font-medium">Plan Benefits</Label>
              <p className="text-sm text-gray-500 mt-1">
                Add key benefits that users will get with this plan
              </p>
            </div>

            <SectionBenefits />
          </CardContent>
        </Card>

        {/* Price Section */}
        <Card>
          <CardContent className="pt-6">
            <div className="mb-4">
              <Label className="text-base font-medium">Price</Label>
            </div>

            <div className="space-y-4">
              <div>
                <Label
                  htmlFor="original_price"
                  className="block mb-2"
                >
                  Original Price{' '}
                  <span className="text-xs text-gray-500">(optional)</span>
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none bg-gray-100 border-r rounded-l-xl px-2">
                    <span className="text-gray-500">Rp</span>
                  </div>
                  <Input
                    id="originalPrice"
                    type="text"
                    className="pl-12"
                    value={formatCurrency(originalPrice)}
                    onChange={(e) => {
                      const rawValue = parseCurrency(e.target.value);
                      setValue('originalPrice', rawValue);
                    }}
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="price"
                  className="block mb-2"
                >
                  Total
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none bg-gray-100 border-r rounded-l-xl px-2">
                    <span className="text-gray-500">Rp</span>
                  </div>
                  <Input
                    id="price"
                    type="text"
                    className="pl-12"
                    required
                    value={formatCurrency(price)}
                    onChange={(e) => {
                      const rawValue = parseCurrency(e.target.value);
                      setValue('price', rawValue);
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <SectionInstallment />

        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            className="bg-main hover:bg-main/80"
            disabled={isLoading}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
}

const SectionLimit = () => {
  const {
    activeTab,
    setActiveTab,
    useLimitation: {
      limitRows,
      setLimitRows,
      expireTypeLimit,
      setExpireTypeLimit,
      setValidityTypeLimit,
      validityTypeLimit,
    },
    useForm: {
      formData: { register },
    },
  } = useProvider();

  const addLimitRow = () => {
    const newId =
      limitRows.length > 0
        ? Math.max(...limitRows.map((row) => row.id)) + 1
        : 1;

    // Find the first available type that's not already selected
    const selectedTypes = limitRows.map((row) => row.type);
    const availableType = listLimit.find(
      (type) => !selectedTypes.includes(type),
    );

    if (!availableType) return; // Don't add a row if all types are used

    setLimitRows([...limitRows, { id: newId, type: availableType, limit: '' }]);
  };

  const removeLimitRow = (id: number) => {
    setLimitRows(limitRows.filter((row) => row.id !== id));
  };

  const updateLimitType = (id: number, type: LimitType) => {
    // Check if the type is already selected in another row
    const isTypeAlreadySelected = limitRows.some(
      (row) => row.id !== id && row.type === type,
    );

    // Only update if the type is not already selected elsewhere
    if (!isTypeAlreadySelected) {
      setLimitRows(
        limitRows.map((row) => (row.id === id ? { ...row, type } : row)),
      );
    }
  };
  return (
    <div className="rounded-3xl shadow-cardSoft2 p-4 mb-4">
      <div className="flex items-center mb-4">
        <Checkbox
          id="limit"
          checked={activeTab.limit}
          onCheckedChange={(check) =>
            setActiveTab((prev) => ({
              ...prev,
              limit: check.valueOf() as boolean,
            }))
          }
        />
        <Label
          htmlFor="limit"
          className="ml-2 font-medium"
        >
          Limit
        </Label>
      </div>

      {activeTab.limit && (
        <div className="space-y-4">
          {/* Replace the entire limitRows.map section with this updated version */}
          {limitRows.map((row, index) => {
            // Function to check if a type is already selected by another row
            const isTypeAlreadySelected = (type: LimitType) =>
              limitRows.some((r) => r.id !== row.id && r.type === type);

            return (
              <div
                key={row.id}
                className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <Label className="block mb-2">
                    Type <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={row.type === 'chat' ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        row.type === 'chat' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('chat') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('chat') ||
                          row.type === 'chat'
                        ) {
                          updateLimitType(row.id, 'chat');
                        }
                      }}
                    >
                      chat
                    </Button>
                    <Button
                      type="button"
                      variant={row.type === 'notes' ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        row.type === 'notes' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('notes') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('notes') ||
                          row.type === 'notes'
                        ) {
                          updateLimitType(row.id, 'notes');
                        }
                      }}
                    >
                      notes
                    </Button>
                    <Button
                      type="button"
                      variant={row.type === 'vision' ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        row.type === 'vision' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('vision') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('vision') ||
                          row.type === 'vision'
                        ) {
                          updateLimitType(row.id, 'vision');
                        }
                      }}
                    >
                      vision
                    </Button>
                    <Button
                      type="button"
                      variant={row.type === 'quiz' ? 'default' : 'outline'}
                      className={cn(
                        row.type === 'quiz' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('quiz') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      size="sm"
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('quiz') ||
                          row.type === 'quiz'
                        ) {
                          updateLimitType(row.id, 'quiz');
                        }
                      }}
                    >
                      quiz
                    </Button>
                    <Button
                      type="button"
                      variant={row.type === 'tryout' ? 'default' : 'outline'}
                      className={cn(
                        row.type === 'tryout' ? 'bg-main hover:bg-main/80' : '',
                        isTypeAlreadySelected('tryout') &&
                          'opacity-50 cursor-not-allowed',
                      )}
                      size="sm"
                      onClick={() => {
                        if (
                          !isTypeAlreadySelected('tryout') ||
                          row.type === 'tryout'
                        ) {
                          updateLimitType(row.id, 'tryout');
                        }
                      }}
                    >
                      try out
                    </Button>
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="block mb-2">
                      Limit <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={row.limit}
                      onChange={(e) => {
                        setLimitRows(
                          limitRows.map((r) =>
                            r.id === row.id
                              ? { ...r, limit: e.target.value }
                              : r,
                          ),
                        );
                      }}
                    />
                  </div>
                  <div className="flex gap-2 mb-[2px]">
                    {index === limitRows.length - 1 &&
                      limitRows.length < listLimit.length && (
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          className="rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 border-blue-100"
                          onClick={addLimitRow}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    {limitRows.length > 1 && (
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        className="rounded-full bg-red-50 text-red-500 hover:bg-red-100 border-red-100"
                        onClick={() => removeLimitRow(row.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="ml-6">
            <div className="flex">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'rounded-r-none',
                  validityTypeLimit === 'duration' &&
                    'bg-main text-white hover:text-white',
                )}
                onClick={() => setValidityTypeLimit('duration')}
              >
                Duration
              </Button>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  'rounded-l-none',
                  validityTypeLimit === 'timeline' &&
                    'bg-main text-white hover:text-white',
                )}
                onClick={() => setValidityTypeLimit('timeline')}
              >
                Timeline
              </Button>
            </div>
          </div>
          {validityTypeLimit === 'timeline' && (
            <div className="ml-6 space-y-4">
              <Alert className="bg-yellow-50 border-yellow-400">
                <AlertDescription className="flex items-center gap-2 text-yellow-600">
                  <InfoIcon className="h-4 w-4" />
                  Timeline memiliki waktu tetap. Pengguna hanya bisa mengakses
                  fitur selama periode yang ditentukan, terlepas dari kapan
                  mereka membeli.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block mb-2">Valid From</Label>
                  <Input
                    type="datetime-local"
                    {...register('timelineLimitStart')}
                  />
                </div>
                <div>
                  <Label className="block mb-2">Valid Until</Label>
                  <Input
                    type="datetime-local"
                    {...register('timelineLimitEnd')}
                  />
                </div>
              </div>
            </div>
          )}
          {validityTypeLimit === 'duration' && (
            <div className="ml-6 space-y-4">
              <Alert className="bg-yellow-50 border-yellow-400">
                <AlertDescription className="flex items-center gap-2 text-yellow-600">
                  <InfoIcon className="h-4 w-4" />
                  Duration akan menghitung masa aktif fitur mulai dari saat
                  pengguna melakukan pembelian. Misalnya jika duration 30 hari,
                  maka fitur akan aktif selama 30 hari sejak pembelian.
                </AlertDescription>
              </Alert>
              <div className="col-span-1 md:col-span-2">
                <Label
                  htmlFor="durationLimit"
                  className="block mb-2"
                >
                  Duration <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="durationLimit"
                    {...register('durationLimit')}
                    type="number"
                    placeholder="0"
                    className="flex-1"
                    required
                  />
                  <div className="flex">
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'rounded-r-none ',
                        expireTypeLimit === 'days' && 'bg-main text-white',
                      )}
                      onClick={() => setExpireTypeLimit('days')}
                    >
                      days
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'rounded-none border-l-0 border-r-0',
                        expireTypeLimit === 'month' && 'bg-main text-white',
                      )}
                      onClick={() => setExpireTypeLimit('month')}
                    >
                      month
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        'rounded-l-none',
                        expireTypeLimit === 'year' && 'bg-main text-white',
                      )}
                      onClick={() => setExpireTypeLimit('year')}
                    >
                      year
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SectionFeature = () => {
  const {
    activeTab,
    setActiveTab,
    useFeature: {
      setCategoryIds,
      isLiveClassActive,
      setExpireType,
      expireType,
      liveClassIds,
      setLiveClassIds,
      categoryIds,
      validityType,
      setValidityType,
      selectedWebSubCategoryIds,
      setSelectedWebSubCategoryIds,
    },
    useForm: {
      formData: { register, setValue },
      formDataValues: { course, liveClass, materiPremium, privateTalk },
    },
  } = useProvider();

  console.log({ selectedWebSubCategoryIds });

  const { webCategoryData } = useWebsiteSubCategory();

  const { data: Categories } = useGet<
    { categoryName: string; data: Category[] }[]
  >('/category/getAllCategoriesForPlanAdmin', {
    params: {
      website_sub_category_id: selectedWebSubCategoryIds.join(','),
    },
    useEffectDependencies: [selectedWebSubCategoryIds],
  });

  const [searchTerm, setSearchTerm] = useState<string>('');

  const {
    data: LiveClass,
    // isLoading: LiveClassIsLoading,
    // totalPages,
    // refetch: LiveClassRefetch,
  } = useGet<
    (LiveClass & {
      Instructor: Instructor;
      Category: Category;
      endDate: string;
      status: string;
    })[]
  >('/liveClass/getAllLiveClass', {
    params: {
      take: 10,
      page: 1,
      search: searchTerm,
      website_sub_category_id: 'ALL',
    },
    useEffectDependencies: [searchTerm],
  });

  return (
    <div className="rounded-3xl shadow-cardSoft2 p-4">
      <div className="flex items-center mb-4">
        <Checkbox
          id="features"
          checked={activeTab.feature}
          onCheckedChange={(check) =>
            setActiveTab((prev) => ({
              ...prev,
              feature: check.valueOf() as boolean,
            }))
          }
        />
        <Label
          htmlFor="features"
          className="ml-2 font-medium"
        >
          Features User
        </Label>
      </div>
      {activeTab.feature && (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <p>Pilih subscription ini berlaku untuk webcategory apa?</p>
            <MultiSelect
              values={selectedWebSubCategoryIds}
              onValuesChange={(value) => {
                if (!website_sub_category_id_params) return;
                const isThere = value.find(
                  (item) => item === website_sub_category_id_params,
                );
                if (isThere) {
                  setSelectedWebSubCategoryIds(value);
                } else {
                  setSelectedWebSubCategoryIds([
                    website_sub_category_id_params,
                    ...value,
                  ]);
                }
              }}
            >
              <MultiSelectTrigger className="w-full max-w-[400px]">
                <MultiSelectValue placeholder="Pilih web sub category..." />
              </MultiSelectTrigger>
              <MultiSelectContent>
                <MultiSelectGroup>
                  {webCategoryData.length > 0 &&
                    webCategoryData[0].WebsiteSubCategory.filter(
                      (item) => item.id !== 'core',
                    ).map((webSub) => (
                      <MultiSelectItem
                        key={webSub.id}
                        value={webSub.id}
                        disabled={webSub.id === website_sub_category_id_params}
                      >
                        {webSub.name}
                      </MultiSelectItem>
                    ))}
                </MultiSelectGroup>
              </MultiSelectContent>
            </MultiSelect>
          </div>
          <div className="ml-6 flex flex-wrap gap-6">
            <div className="flex items-center">
              <Checkbox
                name="course"
                checked={course}
                onCheckedChange={(value) => {
                  setValue('course', value as boolean);
                }}
              />
              <Label
                htmlFor="course"
                className="ml-2"
              >
                Course
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="liveClass"
                name="liveClass"
                checked={liveClass}
                onCheckedChange={(value) => {
                  setValue('liveClass', value as boolean);
                }}
              />
              <Label
                htmlFor="liveClass"
                className="ml-2"
              >
                Live Class
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox
                name="materiPremium"
                checked={materiPremium}
                onCheckedChange={(value) => {
                  setValue('materiPremium', value as boolean);
                }}
              />
              <Label
                htmlFor="materiPremium"
                className="ml-2"
              >
                Document
              </Label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="privateTalk"
                name="privateTalk"
                checked={privateTalk}
                onCheckedChange={(value) => {
                  setValue('privateTalk', value as boolean);
                }}
              />
              <Label
                htmlFor="privateTalk"
                className="ml-2"
              >
                Private
              </Label>
            </div>
          </div>

          <Tabs defaultValue="umum">
            <TabsList className="ml-4">
              <TabsTrigger value="umum">Umum</TabsTrigger>
              {course && <TabsTrigger value="course">Course</TabsTrigger>}
              {/* {materiPremium && (
                <TabsTrigger value="document">Document</TabsTrigger>
              )} */}
              {liveClass && (
                <TabsTrigger value="liveclass">Live Class</TabsTrigger>
              )}
            </TabsList>
            <TabsContent
              value="umum"
              className="space-y-4"
            >
              <div className="ml-6">
                <Label
                  htmlFor="tier"
                  className="block mb-2"
                >
                  Tier <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tier"
                  {...register('tier')}
                  placeholder="Tier"
                  required
                />
              </div>

              <div className="ml-6">
                <div className="flex">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'rounded-r-none',
                      validityType === 'duration' &&
                        'bg-main text-white hover:text-white',
                    )}
                    onClick={() => setValidityType('duration')}
                  >
                    Duration
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      'rounded-l-none',
                      validityType === 'timeline' &&
                        'bg-main text-white hover:text-white',
                    )}
                    onClick={() => setValidityType('timeline')}
                  >
                    Timeline
                  </Button>
                </div>
              </div>

              {validityType === 'timeline' && (
                <div className="ml-6 space-y-4">
                  <Alert className="bg-yellow-50 border-yellow-400">
                    <AlertDescription className="flex items-center gap-2 text-yellow-600">
                      <InfoIcon className="h-4 w-4" />
                      Timeline memiliki waktu tetap. Pengguna hanya bisa
                      mengakses fitur selama periode yang ditentukan, terlepas
                      dari kapan mereka membeli.
                    </AlertDescription>
                  </Alert>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block mb-2">Valid From</Label>
                      <Input
                        type="datetime-local"
                        {...register('timelineStart')}
                      />
                    </div>
                    <div>
                      <Label className="block mb-2">Valid Until</Label>
                      <Input
                        type="datetime-local"
                        {...register('timelineEnd')}
                      />
                    </div>
                  </div>
                </div>
              )}

              {validityType === 'duration' && (
                <div className="ml-6 space-y-4">
                  <Alert className="bg-yellow-50 border-yellow-400">
                    <AlertDescription className="flex items-center gap-2 text-yellow-600">
                      <InfoIcon className="h-4 w-4" />
                      Duration akan menghitung masa aktif fitur mulai dari saat
                      pengguna melakukan pembelian. Misalnya jika duration 30
                      hari, maka fitur akan aktif selama 30 hari sejak
                      pembelian.
                    </AlertDescription>
                  </Alert>
                  <div className="">
                    <Label
                      htmlFor="duration"
                      className="block mb-2"
                    >
                      Duration <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="duration"
                        {...register('duration')}
                        type="number"
                        placeholder="0"
                        className="flex-1"
                        required
                      />
                      <div className="flex">
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'rounded-r-none ',
                            expireType === 'days' && 'bg-main text-white',
                          )}
                          onClick={() => setExpireType('days')}
                        >
                          days
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'rounded-none border-l-0 border-r-0',
                            expireType === 'month' && 'bg-main text-white',
                          )}
                          onClick={() => setExpireType('month')}
                        >
                          month
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            'rounded-l-none',
                            expireType === 'year' && 'bg-main text-white',
                          )}
                          onClick={() => setExpireType('year')}
                        >
                          year
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="liveclass"
              className="space-y-4"
            >
              <div className={cn('ml-6', !isLiveClassActive && 'hidden')}>
                <Label
                  htmlFor="liveClassesPerWeek"
                  className="block mb-2"
                >
                  Live Class Per Minggu <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="liveClassesPerWeek"
                    {...register('liveClassesPerWeek')}
                    type="number"
                    placeholder="0"
                    className="flex-1"
                    required={isLiveClassActive}
                  />
                </div>
              </div>
              <div className="ml-6">
                <Label
                  htmlFor="liveClassesPerWeek"
                  className="block mb-2"
                >
                  Live Class
                </Label>
                <div className="flex items-center gap-2">
                  {liveClassIds.map((liveClass, index) => (
                    <div
                      key={liveClass.value}
                      className="relative group"
                    >
                      <div
                        className="absolute bg-red-100 right-0 bottom-[0] rounded-lg hidden items-center justify-center p-1 group-hover:flex cursor-pointer hover:bg-red-200 duration-300 z-10"
                        onClick={() => {
                          setLiveClassIds((prev) =>
                            prev.filter(
                              (classId) => classId.value !== liveClass.value,
                            ),
                          );
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </div>
                      <ComboboxSelect2
                        placeholder="Pilih Live Class"
                        className="min-w-[200px]"
                        options={
                          LiveClass
                            ? LiveClass.map((item) => ({
                                label: item.title,
                                value: item.id,
                              }))
                            : []
                        }
                        value={liveClass}
                        setValue={(value) => {
                          setLiveClassIds((prev) =>
                            prev.map((classId, cIndex) => {
                              if (cIndex === index) {
                                return value;
                              }
                              return classId;
                            }),
                          );
                          setSearchTerm('');
                        }}
                        regularInput
                        onSearchChange={(value) => setSearchTerm(value)}
                      />
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() =>
                      setLiveClassIds((prev) => [
                        ...prev,
                        { label: '', value: '' },
                      ])
                    }
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent
              value="course"
              className="flex gap-4 ml-8"
            >
              {Categories?.map((webSub) => (
                <div
                  key={webSub.categoryName}
                  className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                      {webSub.categoryName}
                    </h3>
                  </div>

                  {/* Category Options */}
                  <div className="p-4 space-y-3">
                    {webSub.data.map((category) => {
                      // const isSelected = categoryIds.includes(category.id);

                      return (
                        <div
                          key={category.id}
                          className={
                            'flex items-center p-3 rounded-lg border transition-all duration-200 gap-2'
                          }
                        >
                          <Checkbox
                            checked={categoryIds.includes(category.id)}
                            onCheckedChange={(value) => {
                              if (value === true) {
                                setCategoryIds((prev) => [
                                  ...prev,
                                  category.id,
                                ]);
                              }
                              if (value === false) {
                                setCategoryIds((prev) =>
                                  prev.filter((id) => id !== category.id),
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`category-${category.id}`}
                            className={`
                             flex-1 text-sm font-medium cursor-pointer select-none
                           `}
                          >
                            {category.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selection Summary */}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

const SectionBenefits = () => {
  const {
    useBenefit: { benefitRows, setBenefitRows },
  } = useProvider();

  const addBenefitRow = () => {
    const newId = `new-${crypto.randomUUID().slice(0, 4)}`;
    setBenefitRows([
      ...benefitRows,
      { id: newId, title: '', description: '', order: benefitRows.length + 1 },
    ]);
  };

  const removeBenefitRow = (id: string) => {
    if (benefitRows.length > 1) {
      setBenefitRows(benefitRows.filter((row) => row.id !== id));
    }
  };

  const updateBenefitRow = (
    id: string,
    field: 'title' | 'description',
    value: string,
  ) => {
    setBenefitRows(
      benefitRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    );
  };

  const moveBenefitRow = (id: string, direction: 'up' | 'down') => {
    const currentIndex = benefitRows.findIndex((row) => row.id === id);
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < benefitRows.length - 1)
    ) {
      const newBenefits = [...benefitRows];
      const targetIndex =
        direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      [newBenefits[currentIndex], newBenefits[targetIndex]] = [
        newBenefits[targetIndex],
        newBenefits[currentIndex],
      ];

      // Update order
      newBenefits.forEach((benefit, index) => {
        benefit.order = index + 1;
      });

      setBenefitRows(newBenefits);
    }
  };

  return (
    <div className="space-y-4">
      {benefitRows.map((row, index) => (
        <div
          key={row.id}
          className="border rounded-lg p-4 bg-gray-50"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block mb-2">
                Benefit Title <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g., 24/7 Customer Support"
                value={row.title}
                onChange={(e) =>
                  updateBenefitRow(row.id, 'title', e.target.value)
                }
              />
            </div>
            <div>
              <Label className="block mb-2">
                Description <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                placeholder="e.g., Get help anytime, anywhere"
                value={row.description}
                onChange={(e) =>
                  updateBenefitRow(row.id, 'description', e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => moveBenefitRow(row.id, 'up')}
                disabled={index === 0}
                className="px-2"
              >
                ↑
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => moveBenefitRow(row.id, 'down')}
                disabled={index === benefitRows.length - 1}
                className="px-2"
              >
                ↓
              </Button>
            </div>

            <div className="flex gap-2">
              {index === benefitRows.length - 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-blue-50 text-blue-500 hover:bg-blue-100 border-blue-100"
                  onClick={addBenefitRow}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Benefit
                </Button>
              )}
              {benefitRows.length > 1 && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="bg-red-50 text-red-500 hover:bg-red-100 border-red-100"
                  onClick={() => removeBenefitRow(row.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SectionInstallment = () => {
  const {
    useForm: {
      formDataValues: { price },
    },
    useInstallment: {
      installmentConfig: config,
      isInstallmentEnabled,
      setInstallmentConfig: setConfig,
      setIsInstallmentEnabled,
      alertAmount,
      alertLimitation,
      dataHelper: { limitationMismatches, priceDifference, totalLimitations },
    },
    useLimitation: { limitRows },
  } = useProvider();

  enum LateFeeType {
    FIXED = 'FIXED',
    PERCENTAGE = 'PERCENTAGE',
    NONE = 'NONE',
  }

  const updateConfig = <K extends keyof typeof config>(
    key: K,
    value: (typeof config)[K],
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const addScheduleRow = () => {
    const newSchedule: (typeof config.InstallmentSchedules)[0] = {
      id: crypto.randomUUID(),
      installmentNumber: (config.InstallmentSchedules.length + 1).toString(),
      daysAfterFirstPayment: '0',
      expireDaysAfterFirstPayment: '0',
      amount: '0',
      description: '',
      lateFeeType: 'NONE',
      lateFeeAmount: '0',
    };
    setConfig((prev) => ({
      ...prev,
      InstallmentSchedules: [...prev.InstallmentSchedules, newSchedule],
      totalInstallments: (prev.InstallmentSchedules.length + 1).toString(),
    }));
  };

  const removeScheduleRow = (id: string) => {
    setConfig((prev) => {
      const filtered = prev.InstallmentSchedules.filter((s) => s.id !== id).map(
        (s, idx) => ({
          ...s,
          installmentNumber: (idx + 1).toString(),
        }),
      );
      return {
        ...prev,
        InstallmentSchedules: filtered,
        totalInstallments: filtered.length.toString(),
      };
    });
  };

  const updateScheduleRow = <
    K extends keyof (typeof config.InstallmentSchedules)[0],
  >(
    id: string,
    key: K,
    value: (typeof config.InstallmentSchedules)[0][K],
  ) => {
    setConfig((prev) => ({
      ...prev,
      InstallmentSchedules: prev.InstallmentSchedules.map((s) =>
        s.id === id ? { ...s, [key]: value } : s,
      ),
    }));
  };

  const updateScheduleLimitation = (
    id: string,
    field: 'chat' | 'notes' | 'vision' | 'quiz' | 'tryout',
    value: string,
  ) => {
    setConfig((prev) => ({
      ...prev,
      InstallmentSchedules: prev.InstallmentSchedules.map((s) =>
        s.id === id
          ? {
              ...s,
              PlanInstallmentScheduleLimitation: {
                ...s.PlanInstallmentScheduleLimitation,
                chat: s.PlanInstallmentScheduleLimitation?.chat || '0',
                notes: s.PlanInstallmentScheduleLimitation?.notes || '0',
                vision: s.PlanInstallmentScheduleLimitation?.vision || '0',
                quiz: s.PlanInstallmentScheduleLimitation?.quiz || '0',
                tryout: s.PlanInstallmentScheduleLimitation?.tryout || '0',
                [field]: value,
              },
            }
          : s,
      ),
    }));
  };

  const moveScheduleRow = (id: string, direction: 'up' | 'down') => {
    setConfig((prev) => {
      const schedules = [...prev.InstallmentSchedules];
      const index = schedules.findIndex((s) => s.id === id);
      if (
        (direction === 'up' && index === 0) ||
        (direction === 'down' && index === schedules.length - 1)
      ) {
        return prev;
      }
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      [schedules[index], schedules[newIndex]] = [
        schedules[newIndex],
        schedules[index],
      ];
      // Update installment numbers after reordering
      const reordered = schedules.map((s, idx) => ({
        ...s,
        installmentNumber: (idx + 1).toString(),
      }));
      return { ...prev, InstallmentSchedules: reordered };
    });
  };

  const instalmentTotalAmount = config.InstallmentSchedules.reduce(
    (sum, s) => sum + Number(s.amount),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Toggle Cicilan */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-white">
        <div>
          <Label className="text-base font-medium">Aktifkan Cicilan</Label>
          <p className="text-sm text-gray-500">
            Izinkan pelanggan untuk membayar secara cicilan
          </p>
        </div>
        <Switch
          checked={isInstallmentEnabled}
          onCheckedChange={setIsInstallmentEnabled}
        />
      </div>

      {/* Konfigurasi Cicilan */}
      {isInstallmentEnabled && (
        <div className="space-y-6">
          {/* Konfigurasi Utama */}
          <div className="border rounded-lg p-4 bg-white">
            <h3 className="text-lg font-semibold mb-4">Konfigurasi Cicilan</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label className="block mb-2">
                  Total Cicilan <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  min={1}
                  placeholder="cth: 3"
                  value={config.totalInstallments}
                  onChange={(e) =>
                    updateConfig('totalInstallments', e.target.value)
                  }
                  required
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Dihitung otomatis dari jadwal cicilan
                </p>
              </div>
              <div>
                <Label className="block mb-2">
                  Total Harga <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="text"
                  disabled
                  placeholder="cth: 1.000.000"
                  required
                  value={formatCurrency(price)}
                  onChange={(e) => {
                    const rawValue = parseCurrency(e.target.value);
                    updateConfig('totalAmount', rawValue);
                  }}
                />
              </div>
              <div>
                <Label className="block mb-2">
                  Custom Limitation <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={config.isCustomeLimitation ? 'Custom' : 'Otomatis'}
                  onValueChange={(value: 'Custom' | 'Otomatis') =>
                    value &&
                    updateConfig(
                      'isCustomeLimitation',
                      value === 'Custom' ? true : false,
                    )
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'Otomatis'}>Otomatis</SelectItem>
                    <SelectItem value={'Custom'}>Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-2">
                  Masa Tenggang (Hari) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={0}
                  placeholder="cth: 7"
                  required
                  value={config.gracePeriodDays}
                  onChange={(e) =>
                    updateConfig('gracePeriodDays', e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          {/* Jadwal Cicilan */}
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Jadwal Cicilan</h3>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="bg-blue-50 text-blue-500 hover:bg-blue-100 border-blue-100"
                onClick={addScheduleRow}
              >
                <Plus className="h-4 w-4 mr-1" />
                Tambah Jadwal
              </Button>
            </div>

            <div className="space-y-4">
              {config.InstallmentSchedules.map((schedule, index) => (
                <div
                  key={schedule.id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Cicilan ke-{schedule.installmentNumber}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => moveScheduleRow(schedule.id, 'up')}
                        disabled={index === 0}
                        className="px-2"
                      >
                        ↑
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => moveScheduleRow(schedule.id, 'down')}
                        disabled={
                          index === config.InstallmentSchedules.length - 1
                        }
                        className="px-2"
                      >
                        ↓
                      </Button>
                      {config.InstallmentSchedules.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="bg-red-50 text-red-500 hover:bg-red-100 border-red-100"
                          onClick={() => removeScheduleRow(schedule.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <Label className="block mb-2">
                        Hari Setelah Pembayaran Pertama{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="cth: 30"
                        required
                        value={schedule.daysAfterFirstPayment}
                        disabled={schedule.installmentNumber === '1'}
                        onChange={(e) => {
                          updateScheduleRow(
                            schedule.id,
                            'daysAfterFirstPayment',
                            e.target.value,
                          );

                          const prevSchedule =
                            config.InstallmentSchedules[index - 1] || null;

                          if (prevSchedule) {
                            updateScheduleRow(
                              prevSchedule.id,
                              'expireDaysAfterFirstPayment',
                              e.target.value,
                            );
                          }
                        }}
                      />
                    </div>
                    <div>
                      <Label className="block mb-2">
                        Jumlah Bayar <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="text"
                        min={0}
                        required
                        placeholder="cth: 500.000"
                        value={formatCurrency(schedule.amount)}
                        onChange={(e) => {
                          const rawValue = parseCurrency(e.target.value);
                          updateScheduleRow(schedule.id, 'amount', rawValue);
                        }}
                      />
                    </div>
                    <div>
                      <Label className="block mb-2">Keterangan</Label>
                      <Input
                        type="text"
                        placeholder="cth: Cicilan pertama"
                        value={schedule.description || ''}
                        onChange={(e) =>
                          updateScheduleRow(
                            schedule.id,
                            'description',
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label className="block mb-2">
                        Hari Akses di tangguhkan{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="cth: 30"
                        required
                        value={schedule.expireDaysAfterFirstPayment}
                        disabled={
                          schedule.installmentNumber !==
                          config.InstallmentSchedules.length.toString()
                        }
                        onChange={(e) =>
                          updateScheduleRow(
                            schedule.id,
                            'expireDaysAfterFirstPayment',
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label className="block mb-2">
                        Jenis Denda Keterlambatan{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={schedule.lateFeeType}
                        onValueChange={(value: LateFeeType) =>
                          updateScheduleRow(schedule.id, 'lateFeeType', value)
                        }
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={LateFeeType.NONE}>
                            Tidak Ada
                          </SelectItem>
                          <SelectItem value={LateFeeType.FIXED}>
                            Nominal Tetap
                          </SelectItem>
                          <SelectItem value={LateFeeType.PERCENTAGE}>
                            Persentase
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {schedule.lateFeeType !== 'NONE' && (
                      <div>
                        <Label className="block mb-2">
                          Jumlah Denda{' '}
                          {schedule.lateFeeType === LateFeeType.PERCENTAGE
                            ? '(%)'
                            : '(Rp)'}
                        </Label>
                        <Input
                          type="text"
                          required
                          min={0}
                          placeholder={
                            schedule.lateFeeType === LateFeeType.PERCENTAGE
                              ? 'cth: 5'
                              : 'cth: 50.000'
                          }
                          value={
                            schedule.lateFeeType === 'FIXED' &&
                            schedule.lateFeeAmount
                              ? formatCurrency(schedule.lateFeeAmount)
                              : schedule.lateFeeAmount
                          }
                          onChange={(e) => {
                            const rawValue =
                              schedule.lateFeeType === 'FIXED'
                                ? parseCurrency(e.target.value)
                                : e.target.value;
                            updateScheduleRow(
                              schedule.id,
                              'lateFeeAmount',
                              rawValue,
                            );
                          }}
                        />
                      </div>
                    )}
                  </div>
                  {config.isCustomeLimitation && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Label className="block mb-3 font-medium text-gray-700">
                        Batas Penggunaan Fitur{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <p className="text-xs text-gray-500 mb-3">
                        Atur jumlah limit yang didapat pengguna setelah membayar
                        cicilan ini
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <div>
                          <Label className="block mb-1 text-sm text-gray-600">
                            Chat
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={
                              schedule.PlanInstallmentScheduleLimitation
                                ?.chat || ''
                            }
                            onChange={(e) =>
                              updateScheduleLimitation(
                                schedule.id,
                                'chat',
                                e.target.value,
                              )
                            }
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="block mb-1 text-sm text-gray-600">
                            Notes
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={
                              schedule.PlanInstallmentScheduleLimitation
                                ?.notes || ''
                            }
                            onChange={(e) =>
                              updateScheduleLimitation(
                                schedule.id,
                                'notes',
                                e.target.value,
                              )
                            }
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="block mb-1 text-sm text-gray-600">
                            Vision
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={
                              schedule.PlanInstallmentScheduleLimitation
                                ?.vision || ''
                            }
                            onChange={(e) =>
                              updateScheduleLimitation(
                                schedule.id,
                                'vision',
                                e.target.value,
                              )
                            }
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="block mb-1 text-sm text-gray-600">
                            Quiz
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={
                              schedule.PlanInstallmentScheduleLimitation
                                ?.quiz || ''
                            }
                            onChange={(e) =>
                              updateScheduleLimitation(
                                schedule.id,
                                'quiz',
                                e.target.value,
                              )
                            }
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label className="block mb-1 text-sm text-gray-600">
                            Tryout
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            placeholder="0"
                            value={
                              schedule.PlanInstallmentScheduleLimitation
                                ?.tryout || ''
                            }
                            onChange={(e) =>
                              updateScheduleLimitation(
                                schedule.id,
                                'tryout',
                                e.target.value,
                              )
                            }
                            className="h-9"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium text-blue-700 mb-3 flex items-center gap-2">
              <FileTextIcon className="w-4 h-4" />
              Ringkasan Cicilan
            </h4>

            {/* Info Umum */}
            <div className="text-sm text-blue-600 space-y-1 mb-3">
              <p>Total Cicilan: {config.totalInstallments}x</p>
              <p>Masa Tenggang: {config.gracePeriodDays} hari</p>
              <p>Harga Plan: Rp {Number(price).toLocaleString('id-ID')}</p>
              <p>
                Total Harga Cicilan: Rp{' '}
                {instalmentTotalAmount.toLocaleString('id-ID')}
                {!alertAmount ? (
                  <CheckCircleIcon className="inline w-4 h-4 ml-1 text-green-600" />
                ) : (
                  <XCircleIcon className="inline w-4 h-4 ml-1 text-red-600" />
                )}
              </p>
            </div>

            {/* Detail per Cicilan */}
            <div className="text-sm text-blue-600 space-y-1 mb-3">
              <p className="font-medium flex items-center gap-1">
                <ListIcon className="w-4 h-4" />
                Detail Cicilan:
              </p>
              <div className="ml-5 space-y-1">
                {config.InstallmentSchedules.map((schedule, index) => {
                  const limitation = schedule.PlanInstallmentScheduleLimitation;
                  const percentage =
                    Number(price) > 0
                      ? (
                          (Number(schedule.amount) / Number(price)) *
                          100
                        ).toFixed(1)
                      : '0';
                  return (
                    <div
                      key={schedule.id}
                      className=""
                    >
                      <p className="text-gray-600">
                        Cicilan #{schedule.installmentNumber}: Rp{' '}
                        {Number(schedule.amount).toLocaleString('id-ID')} (
                        {percentage}%)
                        {index === 0
                          ? ' - Pembayaran pertama'
                          : ` - ${schedule.daysAfterFirstPayment} hari setelah pembayaran pertama`}
                        {schedule.lateFeeType !== 'NONE' && (
                          <span className="text-orange-600 ml-1">
                            (Denda:{' '}
                            {schedule.lateFeeType === 'PERCENTAGE'
                              ? `${schedule.lateFeeAmount}%`
                              : `Rp ${Number(schedule.lateFeeAmount).toLocaleString('id-ID')}`}
                            )
                          </span>
                        )}
                      </p>
                      {config.isCustomeLimitation && (
                        <p
                          key={schedule.id}
                          className="text-gray-600 ml-8"
                        >
                          <p>
                            {limitation?.chat &&
                              Number(limitation?.chat) > 0 &&
                              `- Chat ${limitation?.chat || 0} `}
                          </p>
                          <p>
                            {' '}
                            {limitation?.notes &&
                              Number(limitation?.notes) > 0 &&
                              `- Notes ${limitation?.notes || 0} `}
                          </p>
                          <p>
                            {limitation?.vision &&
                              Number(limitation?.vision) > 0 &&
                              `- Vision ${limitation?.vision || 0} `}
                          </p>
                          <p>
                            {limitation?.quiz &&
                              Number(limitation?.quiz) > 0 &&
                              `- Quiz ${limitation?.quiz || 0} `}
                          </p>
                          <p>
                            {limitation?.tryout &&
                              Number(limitation?.tryout) > 0 &&
                              `- Tryout ${limitation?.tryout || 0} `}
                          </p>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Limitasi - Hanya muncul jika custom limitation aktif */}
            {config.isCustomeLimitation && totalLimitations && (
              <div className="text-sm text-blue-600 space-y-1 mb-3">
                <p className="font-medium flex items-center gap-1">
                  <TargetIcon className="w-4 h-4" />
                  Total Limitasi:
                </p>
                <div className="ml-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-1">
                  <p className="flex items-center gap-1 text-gray-600">
                    <MessageSquareIcon className="w-3 h-3" />
                    Chat: {totalLimitations.chat.toLocaleString('id-ID')}
                  </p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <StickyNoteIcon className="w-3 h-3" />
                    Notes: {totalLimitations.notes.toLocaleString('id-ID')}
                  </p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <EyeIcon className="w-3 h-3" />
                    Vision: {totalLimitations.vision.toLocaleString('id-ID')}
                  </p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <HelpCircleIcon className="w-3 h-3" />
                    Quiz: {totalLimitations.quiz.toLocaleString('id-ID')}
                  </p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <ClipboardListIcon className="w-3 h-3" />
                    Tryout: {totalLimitations.tryout.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            )}

            {/* Warning jika tidak match */}
            {alertAmount && (
              <div className="mt-3 p-3 bg-red-50 border border-red-300 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircleIcon className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 mb-1">
                      Peringatan: Ketidakcocokan Harga
                    </p>
                    <p className="text-sm text-red-700">
                      Total jadwal cicilan{' '}
                      <span className="font-semibold">
                        Rp {instalmentTotalAmount.toLocaleString('id-ID')}
                      </span>{' '}
                      {priceDifference > 0 ? 'kurang' : 'lebih'} Rp{' '}
                      <span className="font-semibold">
                        {Math.abs(priceDifference).toLocaleString('id-ID')}
                      </span>{' '}
                      dari harga plan{' '}
                      <span className="font-semibold">
                        Rp {Number(price).toLocaleString('id-ID')}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning jika limitasi tidak cocok */}
            {alertLimitation && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircleIcon className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-yellow-800 mb-2">
                      Peringatan: Ketidakcocokan Limitasi
                    </p>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {limitationMismatches.map((mismatch) => (
                        <li key={mismatch.type}>
                          <span className="capitalize font-medium">
                            {mismatch.type}
                          </span>
                          : Limit di pengaturan{' '}
                          <span className="font-semibold">
                            {mismatch.limitRowValue}
                          </span>
                          , tetapi total cicilan{' '}
                          <span className="font-semibold">
                            {mismatch.totalCiclanValue}
                          </span>
                          {mismatch.limitRowValue === 0 &&
                            mismatch.totalCiclanValue > 0 &&
                            ' (tidak ada limitasi yang diatur, tapi ada di cicilan)'}
                          {mismatch.limitRowValue > 0 &&
                            mismatch.totalCiclanValue === 0 &&
                            ' (ada limitasi yang diatur, tapi tidak ada di cicilan)'}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
