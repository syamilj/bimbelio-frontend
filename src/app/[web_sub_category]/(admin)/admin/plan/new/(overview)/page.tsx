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
import LoadingPageWithText from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { responseError, throwError } from '@/lib/response';
import { cn, formatCurrency, parseCurrency } from '@/lib/utils';
import { getSlug } from '@/lib/utils/slug';
import { supabase } from '@/supabaseClient';
import { Category, Instructor, LiveClass } from '@/types/database';
import { InfoIcon, Plus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { LimitType, useProvider } from '../_provider/provider';

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Ganti karakter spesial dengan dash
    .replace(/^-|-$/g, ''); // Hapus dash di awal/akhir
};

const listLimit: LimitType[] = ['chat', 'notes', 'vision', 'quiz', 'tryout'];
export default function CreatePlanForm() {
  const {
    activeTab,
    isLoading,
    setIsLoading,
    useBenefit: { benefitRows },
    useFeature: {
      categoryIds,
      expireType,
      liveClassIds,
      validityType,
      selectedWebSubCategoryIds,
    },
    useLimitation: { limitRows, expireTypeLimit, validityTypeLimit },
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
        liveClass,
        materiPremium,
        originalPrice,
        price,
        tier,
        liveClassesPerWeek,
        image,
        status,
        durationLimit,
        timelineLimitEnd,
        timelineLimitStart,
        maxUsers,
      },
    },
  } = useProvider();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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

      let imageUrl = undefined;
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
        name,
        description,
        price: price.length > 0 ? parseFloat(price) : 0,
        maxUsers: maxUsers ? parseInt(maxUsers) : undefined,
        originalPrice: originalPrice.length > 0 ? parseFloat(originalPrice) : 0,
        status,
        image: imageUrl,
        roleDiscord,
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
                  liveClassIds: liveClassIds
                    .map((item) => item.value)
                    .filter((id) => id.length > 0),
                },
              ].filter((item) => item.type),
            }
          : undefined,
        planBenefit: benefitRows
          .filter(
            (item) => item.title.length > 0 && item.description.length > 0,
          )
          .map((row) => ({
            order: row.order,
            title: row.title,
            description: row.description,
          })),
      };

      // return;

      await mutateGeneral('/plan/createPlan', {
        payload,
        type: 'post',
        setLoading: setIsLoading,
      });
    } catch (error) {
      responseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className="mx-auto p-4 min-h-screen"
      onSubmit={handleSubmit}
    >
      <LoadingPageWithText
        loading={isLoading}
        heading="Menambahkan Plan"
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
    <div className="rounded-xl shadow-cardSoft2 p-4 mb-4">
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
      categoryIds,
      setCategoryIds,
      isCourseActive,
      isDocumentActive,
      isLiveClassActive,
      setIsCourseActive,
      setIsDocumentActive,
      setIsLiveClassActive,
      setExpireType,
      expireType,
      liveClassIds,
      setLiveClassIds,
      validityType,
      setValidityType,
      selectedWebSubCategoryIds,
      setSelectedWebSubCategoryIds,
    },
    useForm: {
      formData: { register, setValue },
    },
  } = useProvider();

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
    isLoading: LiveClassIsLoading,
    totalPages,
    refetch: LiveClassRefetch,
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
    <div className="rounded-xl shadow-cardSoft2 p-4">
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
                    webCategoryData[0].WebsiteSubCategory.map((webSub) => (
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
                onCheckedChange={(value) => {
                  setValue('course', value as boolean);
                  setIsCourseActive(value as boolean);
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
                onCheckedChange={(value) => {
                  setValue('liveClass', value as boolean);
                  setIsLiveClassActive(value as boolean);
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
                onCheckedChange={(value) => {
                  setValue('materiPremium', value as boolean);
                  setIsDocumentActive(value as boolean);
                }}
              />
              <Label
                htmlFor="materiPremium"
                className="ml-2"
              >
                Document
              </Label>
            </div>
          </div>

          <Tabs defaultValue="umum">
            <TabsList className="ml-4">
              <TabsTrigger value="umum">Umum</TabsTrigger>
              {isCourseActive && (
                <TabsTrigger value="course">Course</TabsTrigger>
              )}
              {/* {isDocumentActive && (
                <TabsTrigger value="document">Document</TabsTrigger>
              )} */}
              {isLiveClassActive && (
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
                            ? LiveClass.filter((item) => {
                                if (liveClassIds.length > 0) {
                                  return !liveClassIds
                                    .map((item) => item.value)
                                    .includes(item.id);
                                }
                                return true;
                              }).map((item) => ({
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
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
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
    const newId =
      benefitRows.length > 0
        ? Math.max(...benefitRows.map((row) => row.id)) + 1
        : 1;
    setBenefitRows([
      ...benefitRows,
      { id: newId, title: '', description: '', order: benefitRows.length + 1 },
    ]);
  };

  const removeBenefitRow = (id: number) => {
    if (benefitRows.length > 1) {
      setBenefitRows(benefitRows.filter((row) => row.id !== id));
    }
  };

  const updateBenefitRow = (
    id: number,
    field: 'title' | 'description',
    value: string,
  ) => {
    setBenefitRows(
      benefitRows.map((row) =>
        row.id === id ? { ...row, [field]: value } : row,
      ),
    );
  };

  const moveBenefitRow = (id: number, direction: 'up' | 'down') => {
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
