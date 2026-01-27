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
import { cn, getDateForInputDateTime } from '@/lib/utils';
import {
  QuizVolume,
  Tryout,
  TryoutCategory,
  TryoutSession,
  TryoutSubCategory,
} from '@/types/database';
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronsUpDown,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

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
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    volumeNumber: '',
    status: 'DRAFT',
    startDate: '',
    endDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [selectedTryouts, setSelectedTryouts] = useState<TryoutListType[]>([]);

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
        return prev;
      }
      return [...prev, tryout];
    });
  };

  const handleRemoveTryout = (tryoutId: string) => {
    setSelectedTryouts((prev) => prev.filter((item) => item.id !== tryoutId));
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

    // if (selectedTryouts.length === 0) {
    //   newErrors.tryouts = 'Pilih minimal 1 tryout';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { isLoading: isLoadingGetData, refetch } = useGet<
    QuizVolume & {
      Tryout: TryoutListType[];
    }
  >('/quizTryout/getSingleQuizVolume', {
    params: { id },
    enabled: mode === 'edit' && !!id,
    onSuccess: ({ data }) => {
      if (data) {
        setFormData({
          name: data.title || '',
          volumeNumber: data.number?.toString(),
          status: data.status,
          startDate: getDateForInputDateTime(data.startDate),
          endDate: getDateForInputDateTime(data.endDate),
        });
        setSelectedTryouts(data.Tryout || []);
      }
    },
    useEffectDependencies: [id],
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

  const { data: SubCategory } = useGet<TryoutSubCategory[]>(
    '/tryoutCategory/getSubCategory',
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

  console.log({ SubCategory });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Here you would typically send the data to your API
    const submitData = {
      ...formData,
      tryoutIds: selectedTryouts.map((tryout) => tryout.id),
    };
    console.log('Submitting:', submitData);
    if (mode === 'create') {
      await createQuizVolume({
        payload: {
          title: submitData.name,
          number: Number(submitData.volumeNumber),
          status: submitData.status,
          startDate: submitData.startDate,
          endDate: submitData.endDate,
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
          TryoutIds: submitData.tryoutIds,
        },
      });
    }
  };

  console.log({ TryoutList });

  if (isLoadingGetData && mode === 'edit' && id) {
    return <LoadingComponentWithText heading="Mengambil Data Quiz Volume..." />;
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
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
            className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
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
                    value={formData.name}
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
                    value={formData.volumeNumber}
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
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-2">
                    Start Date *
                  </p>
                  <Input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
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
                    value={formData.endDate}
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
                      {'Select Tryout'}
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
                {SubCategory?.map((item, index) => {
                  const tryouts = selectedTryouts.filter(
                    (tryout) => tryout.TryoutSubCategory.id === item.id,
                  );

                  return (
                    <div
                      key={index}
                      className="space-y-2"
                    >
                      <p className="text-base font-bold text-slate-700 px-1">
                        {item.name}
                      </p>
                      <div className="grid grid-cols-4 gap-3">
                        {tryouts.map((tryout) => (
                          <div
                            key={tryout.id}
                            className="flex justify-between p-3 rounded-lg w-full"
                            style={{
                              background: `${mainColor}10`,
                              borderLeft: `4px solid ${mainColor}`,
                            }}
                          >
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 text-sm line-clamp-2">
                                {tryout.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {tryout.TryoutCategory.name} -{' '}
                                {tryout.TryoutSubCategory.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Duration: {tryout.TryoutSession.duration} mins
                              </p>
                            </div>
                            <Button
                              type="button"
                              onClick={() => handleRemoveTryout(tryout.id)}
                              variant="ghost"
                              size="sm"
                              className="self-end mt-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        {tryouts.length === 0 && (
                          <div
                            className="flex justify-between p-3 rounded-lg w-full bg-gray-100 border-l-4 border-gray-600"
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
                })}
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
