'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { InputImage } from '@/components/ui/input-image';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import LoadingPageWithText, {
  LoadingComponentWithText,
} from '@/components/ui/spinner';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn, getDateForInputDateTime } from '@/lib/utils';
import { storage } from '@/supabaseClient';
import {
  QuizVolume,
  Tryout,
  TryoutCategory,
  TryoutSession,
  TryoutSubCategory,
} from '@/types/database';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';

const STATUS_OPTIONS = [
  {
    value: 'DRAFT',
    label: 'Draft',
    color: 'bg-amber-50 border-amber-200 text-amber-700',
  },
  {
    value: 'PUBLIC',
    label: 'Publish',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  },
];

type TryoutListType = Tryout & {
  TryoutCategory: TryoutCategory;
  TryoutSubCategory: TryoutSubCategory;
  TryoutSession: TryoutSession;
};

export default function FormSubmit({ mode }: { mode: 'edit' | 'create' }) {
  const { id } = useParams<{ id: string }>();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#4C94FF';

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    volumeNumber: '',
    status: 'DRAFT',
    startDate: '',
    endDate: '',
    resultDate: '',
    image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedTryouts, setSelectedTryouts] = useState<TryoutListType[]>([]);

  const normalizeOrdersBySubCategory = (tryoutData: TryoutListType[]) => {
    if (!SubCategory || SubCategory.length === 0) return tryoutData;

    let normalizedTryouts: TryoutListType[] = [];
    for (const sub of SubCategory) {
      const grouped = tryoutData
        .filter((tryout) => tryout.TryoutSubCategory.id === sub.id)
        .sort((a, b) => (a.quizOrder || 10000) - (b.quizOrder || 10000))
        .map((tryout, index) => ({
          ...tryout,
          quizOrder: index + 1,
        }));

      normalizedTryouts = [...normalizedTryouts, ...grouped];
    }

    return normalizedTryouts;
  };

  const reorderTryoutWithinSubCategory = ({
    data,
    subCategoryId,
    tryoutId,
    targetOrder,
  }: {
    data: TryoutListType[];
    subCategoryId: string;
    tryoutId: string;
    targetOrder: number;
  }) => {
    const group = data
      .filter((item) => item.TryoutSubCategory.id === subCategoryId)
      .sort((a, b) => (a.quizOrder || 10000) - (b.quizOrder || 10000));

    const movingIndex = group.findIndex((item) => item.id === tryoutId);
    if (movingIndex < 0) return data;

    const [movingItem] = group.splice(movingIndex, 1);
    const boundedOrder = Math.max(1, Math.min(targetOrder, group.length + 1));
    group.splice(boundedOrder - 1, 0, movingItem);

    const reorderedGroup = group.map((item, index) => ({
      ...item,
      quizOrder: index + 1,
    }));

    const otherGroups = data.filter(
      (item) => item.TryoutSubCategory.id !== subCategoryId,
    );

    return [...otherGroups, ...reorderedGroup];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleStatusChange = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      status,
    }));
  };

  const handleToggleTryout = (tryout: TryoutListType) => {
    setSelectedTryouts((prev) => {
      const isExsist = prev.find((item) => item.id === tryout.id);
      if (isExsist) {
        return normalizeOrdersBySubCategory(
          prev.filter((item) => item.id !== tryout.id),
        );
      }
      return normalizeOrdersBySubCategory([...prev, tryout]);
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama volume harus diisi';
    }

    if (!formData.volumeNumber.trim()) {
      newErrors.volumeNumber = 'Nomor volume harus diisi';
    } else if (isNaN(Number(formData.volumeNumber))) {
      newErrors.volumeNumber = 'Nomor volume harus berupa angka';
    }

    if (!formData.startDate.trim()) {
      newErrors.startDate = 'Start date harus diisi';
    }

    if (!formData.endDate.trim()) {
      newErrors.endDate = 'End date harus diisi';
    }

    if (!formData.resultDate.trim()) {
      newErrors.resultDate = 'Tanggal pembahasan harus diisi';
    }

    // if (selectedTryouts.length === 0) {
    //   newErrors.tryouts = 'Pilih minimal 1 tryout';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSortTryouts = (tryoutData: TryoutListType[]) =>
    normalizeOrdersBySubCategory(tryoutData);

  const { data: SubCategory } = useGet<TryoutSubCategory[]>(
    '/tryoutCategory/getSubCategory',
  );

  const { isLoading: isLoadingGetData } = useGet<
    QuizVolume & {
      resultDate?: string | null;
      Tryout: TryoutListType[];
    }
  >('/quizTryout/getSingleQuizVolume', {
    params: { id },
    enabled:
      mode === 'edit' && !!id && !!SubCategory && SubCategory?.length > 0,
    onSuccess: ({ data }) => {
      if (data) {
        setFormData({
          name: data.title || '',
          volumeNumber: data.number?.toString() || '',
          status: data.status || 'DRAFT',
          startDate: getDateForInputDateTime(data.startDate) || '',
          endDate: getDateForInputDateTime(data.endDate) || '',
          resultDate:
            getDateForInputDateTime(
              data.resultDate || data.Tryout?.[0]?.resultDate || data.startDate,
            ) || '',
          image: data.image || '',
        });
        const sortedTryouts = normalizeOrdersBySubCategory(data.Tryout);
        setSelectedTryouts(sortedTryouts);
      }
    },
    useEffectDependencies: [id, SubCategory],
  });

  const [searchTryout, setSearchTryout] = useState<string>('');
  const { data: TryoutList } = useGet<TryoutListType[]>(
    '/quizTryout/getQuizTryoutList',
    {
      params: {
        search: searchTryout,
        take: 10,
        page: 1,
      },
      debounceTime: 1000,
      enabled: searchTryout.length >= 3 || searchTryout.length === 0,
      useEffectDependencies: [searchTryout],
    },
  );

  const { isLoading: isLoadingCreate, mutate: createQuizVolume } = useMutation(
    '/quizTryout/createQuizVolume',
    'post',
  );

  const { isLoading: isLoadingUpdate, mutate: updateQuizVolume } = useMutation(
    '/quizTryout/updateQuizVolume',
    'post',
  );

  const isLoading = isLoadingCreate || isLoadingUpdate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Here you would typically send the data to your API
    const normalizedTryouts = normalizeOrdersBySubCategory(selectedTryouts);

    const submitData = {
      ...formData,
      tryoutIds: normalizedTryouts.map((tryout) => ({
        id: tryout.id,
        quizOrder: tryout.quizOrder,
      })),
    };
    if (mode === 'create') {
      await createQuizVolume({
        payload: {
          title: submitData.name,
          number: Number(submitData.volumeNumber),
          status: submitData.status,
          startDate: submitData.startDate,
          endDate: submitData.endDate,
          resultDate: submitData.resultDate,
          image: submitData.image || null,
          TryoutIds: submitData.tryoutIds,
        },
      });
    }
    if (mode === 'edit' && id) {
      await updateQuizVolume({
        payload: {
          id,
          title: submitData.name,
          number: Number(submitData.volumeNumber),
          status: submitData.status,
          startDate: submitData.startDate,
          endDate: submitData.endDate,
          resultDate: submitData.resultDate,
          image: submitData.image || null,
          TryoutIds: submitData.tryoutIds,
        },
      });
    }
  };

  if (isLoadingGetData && mode === 'edit' && id) {
    return <LoadingComponentWithText heading="Mengambil Data Quiz Volume..." />;
  }

  return (
    <div className="min-h-screen pb-12">
      <LoadingPageWithText
        loading={isLoading}
        heading={
          mode === 'create'
            ? 'Menyimpan Volume Quiz....'
            : 'Memperbarui Volume Quiz....'
        }
      />

      {/* Header Section */}
      <div className=" mx-auto px-4 md:px-6 py-6">
        {/* Back Button & Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="../quiz-volume"
            className="p-2 rounded-3xl hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-3xl flex items-center justify-center text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                  {mode === 'create'
                    ? 'Create Quiz Volume'
                    : 'Edit Quiz Volume'}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {mode === 'create'
                    ? 'Buat volume quiz baru untuk mengelola tryout.'
                    : 'Perbarui detail volume quiz di sini.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Volume Name & Number */}
          <Card
            style={{
              borderColor: `${mainColor}15`,
              borderWidth: '2px',
            }}
          >
            <CardHeader className="pb-4">
              <h2 className="text-lg font-bold text-slate-900">
                Volume Details
              </h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-2">
                    Nama Volume *
                  </p>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Persiapan Awal UTBK"
                    className={cn(errors.name && 'border-red-500 bg-red-50')}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-2">
                    Nomor Volume *
                  </p>
                  <Input
                    type="number"
                    name="volumeNumber"
                    value={formData.volumeNumber || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., 1"
                    className={cn(
                      errors.volumeNumber && 'border-red-500 bg-red-50',
                    )}
                  />
                  {errors.volumeNumber && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.volumeNumber}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm font-bold text-slate-700 mb-2">
                    Image Volume
                  </p>
                  <InputImage
                    preview={
                      formData.image
                        ? `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/quiz-volume/${formData.image}`
                        : undefined
                    }
                    onChange={async (image) => {
                      if (!image) return;

                      const oldImage = formData.image;
                      const filename = `quiz-volume-${crypto.randomUUID()}`;
                      const upload = await storage
                        .from('img')
                        .upload(`quiz-volume/${filename}`, image);

                      if (
                        upload?.error?.message === 'The resource already exists'
                      ) {
                        await storage
                          .from('img')
                          .update(`quiz-volume/${filename}`, image);
                      }

                      if (oldImage) {
                        await storage
                          .from('img')
                          .remove([`quiz-volume/${oldImage}`]);
                      }

                      setFormData((prev) => ({
                        ...prev,
                        image: filename,
                      }));
                    }}
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-2">
                    Start Date *
                  </p>
                  <Input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate || ''}
                    onChange={handleInputChange}
                    className={cn(
                      errors.startDate && 'border-red-500 bg-red-50',
                    )}
                  />
                  {errors.startDate && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.startDate}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-2">
                    End Date *
                  </p>
                  <Input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate || ''}
                    onChange={handleInputChange}
                    className={cn(errors.endDate && 'border-red-500 bg-red-50')}
                  />
                  {errors.endDate && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.endDate}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-2">
                    Tanggal Pembahasan *
                  </p>
                  <Input
                    type="datetime-local"
                    name="resultDate"
                    value={formData.resultDate || ''}
                    onChange={handleInputChange}
                    className={cn(
                      errors.resultDate && 'border-red-500 bg-red-50',
                    )}
                  />
                  {errors.resultDate && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.resultDate}
                    </div>
                  )}
                </div>

                {/* Status Selection */}
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-3">
                    Status *
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {STATUS_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        onClick={() => handleStatusChange(option.value)}
                        variant={
                          formData.status === option.value
                            ? 'default'
                            : 'outline'
                        }
                        className={cn(
                          'flex items-center justify-center gap-2',
                          formData.status === option.value &&
                            'text-white shadow-lg',
                        )}
                        style={
                          formData.status === option.value
                            ? {
                                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                                border: 'none',
                              }
                            : {}
                        }
                      >
                        {formData.status === option.value && (
                          <Check className="w-4 h-4" />
                        )}
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Tryout Selection */}
          <Card
            style={{
              borderColor: `${mainColor}15`,
              borderWidth: '2px',
            }}
          >
            <CardHeader className="pb-4">
              <h2 className="text-lg font-bold text-slate-900">Pilih Tryout</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tryout Dropdown */}
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      // aria-expanded={tryout.open}
                      className="min-w-[200px] justify-between"
                    >
                      {'Pilih Tryout'}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search Tags..."
                        value={searchTryout}
                        onValueChange={(value) => setSearchTryout(value)}
                      />
                      <CommandList>
                        {TryoutList && TryoutList.length === 0 ? (
                          <CommandEmpty>No tryout found.</CommandEmpty>
                        ) : null}
                        <CommandGroup>
                          {TryoutList?.map((tryoutItem) => {
                            const isExsist = selectedTryouts.find(
                              (item) => item.id === tryoutItem.id,
                            );
                            return (
                              <CommandItem
                                key={tryoutItem.id}
                                value={tryoutItem.id}
                                onSelect={() => {
                                  if (isExsist) return;
                                  handleToggleTryout(tryoutItem);
                                }}
                                className={cn(
                                  isExsist && 'opacity-50  pointer-events-none',
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
              </div>

              {errors.tryouts && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.tryouts}
                </div>
              )}

              <div className="space-y-4 pt-4 border-t">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Tryout Terpilih
                </p>
                {SubCategory?.map((item) => (
                  <TryoutItem
                    key={item.id}
                    selectedTryouts={selectedTryouts}
                    setSelectedTryouts={setSelectedTryouts}
                    sub={item}
                    handleSortTryouts={handleSortTryouts}
                    reorderTryoutWithinSubCategory={
                      reorderTryoutWithinSubCategory
                    }
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 w-full justify-end">
            <Button
              asChild
              variant="outline"
              className="w-fit"
            >
              <Link href="../quiz-volume">Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="w-fit text-white shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                border: 'none',
              }}
            >
              <Check className="w-5 h-5" />
              {mode === 'create' ? 'Create Volume' : 'Update Volume'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const TryoutItem = ({
  selectedTryouts,
  setSelectedTryouts,
  sub,
  handleSortTryouts,
  reorderTryoutWithinSubCategory,
}: {
  sub: TryoutSubCategory;
  selectedTryouts: TryoutListType[];
  setSelectedTryouts: Dispatch<SetStateAction<TryoutListType[]>>;
  handleSortTryouts: (data: TryoutListType[]) => TryoutListType[];
  reorderTryoutWithinSubCategory: (data: {
    data: TryoutListType[];
    subCategoryId: string;
    tryoutId: string;
    targetOrder: number;
  }) => TryoutListType[];
}) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const tryouts = selectedTryouts
    .filter((tryout) => tryout.TryoutSubCategory.id === sub.id)
    .sort((a, b) => (a.quizOrder || 10000) - (b.quizOrder || 10000));

  return (
    <div className="space-y-2">
      <p className="text-base font-bold text-slate-700 px-1">{sub.name}</p>
      <div className="grid grid-cols-1 gap-3">
        {tryouts.map((tryout, index) => (
          <div
            key={tryout.id}
            className="flex justify-between p-3 rounded-3xl w-full border"
            style={{
              background: `${mainColor}10`,
              borderLeft: `4px solid ${mainColor}`,
              borderColor: `${mainColor}30`,
            }}
          >
            <div className="flex-1">
              <div className="flex gap-2 items-center">
                <Select
                  value={tryout.quizOrder?.toString() || ''}
                  onValueChange={(value) => {
                    setSelectedTryouts((prev) =>
                      reorderTryoutWithinSubCategory({
                        data: prev,
                        subCategoryId: sub.id,
                        tryoutId: tryout.id,
                        targetOrder: Number(value),
                      }),
                    );
                  }}
                >
                  <SelectTrigger className="py-1 pr-0 pl-2 h-fit w-fit">
                    {tryout.quizOrder}
                  </SelectTrigger>
                  <SelectContent>
                    {tryouts.map((_, idx) => {
                      const order = idx + 1;
                      return (
                        <SelectItem
                          key={idx}
                          value={order.toString()}
                        >
                          {order}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5"
                    disabled={index === 0}
                    onClick={() =>
                      setSelectedTryouts((prev) =>
                        reorderTryoutWithinSubCategory({
                          data: prev,
                          subCategoryId: sub.id,
                          tryoutId: tryout.id,
                          targetOrder: (tryout.quizOrder || index + 1) - 1,
                        }),
                      )
                    }
                  >
                    <ArrowUp className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-5 w-5"
                    disabled={index === tryouts.length - 1}
                    onClick={() =>
                      setSelectedTryouts((prev) =>
                        reorderTryoutWithinSubCategory({
                          data: prev,
                          subCategoryId: sub.id,
                          tryoutId: tryout.id,
                          targetOrder: (tryout.quizOrder || index + 1) + 1,
                        }),
                      )
                    }
                  >
                    <ArrowDown className="w-3 h-3" />
                  </Button>
                </div>
                <p className="font-bold text-slate-900 text-sm line-clamp-2">
                  {tryout.title}
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {tryout.TryoutCategory.name} - {tryout.TryoutSubCategory.name}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Duration: {tryout.TryoutSession.duration} mins
              </p>
            </div>
            <div className="flex flex-col">
              <Button
                type="button"
                onClick={() =>
                  setSelectedTryouts((prev) =>
                    handleSortTryouts(
                      prev.filter((item) => item.id !== tryout.id),
                    ),
                  )
                }
                variant="ghost"
                size="sm"
                className="self-end"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {tryouts.length === 0 && (
          <div
            className="flex justify-between p-3 rounded-3xl w-full bg-gray-100 border-l-4 border-gray-600"
            // style={{
            //   background: `${mainColor}10`,
            //   borderLeft: `4px solid ${mainColor}`,
            // }}
          >
            <div className="flex-1">
              <p className="text-xs text-slate-500 mt-1">
                Belum ada tryout terpilih
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
