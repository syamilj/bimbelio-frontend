'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputImage } from '@/components/ui/input-image';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingPageWithText from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { sanitizeFileName } from '@/lib/utils/storage';
import { supabase } from '@/supabaseClient';
import {
  Category,
  CourseChapter,
  CourseSubChapter,
  Instructor,
  LiveClassAccessTypeEnum,
  LiveClassReferenceTypeEnum,
  LiveClassReferenceUrlTypeEnum,
} from '@/types/database';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FileText,
  Play,
  Plus,
  Save,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CardSubs } from './_components/card-subs';

type AgendaType = {
  title: string;
  description: string;
  duration: number;
};

type ReferenceType = {
  title: string;
  type: LiveClassReferenceTypeEnum;
  description: string;
  url?: string;
  urlType?: LiveClassReferenceUrlTypeEnum;
  subChapterId?: string;
};

type InstructorsType = (Instructor & {
  Category: Category[];
  totalLiveClass: number;
})[];

export default function CreateLiveClassForm() {
  const router = useRouter();

  const [type, setType] = useState<
    'LIVECLASS' | 'LIVESTREAM' | 'WEBINAR' | undefined
  >();

  const [accessType, setAccessType] =
    useState<LiveClassAccessTypeEnum>('PREMIUM');

  const [agendas, setAgendas] = useState<AgendaType[]>([]);
  const [references, setReferences] = useState<ReferenceType[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);

  const [instructorId, setInstructorId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState<File | undefined>(undefined);

  const [urlReadingData, setUrlReadingData] = useState<ReferenceType>({
    title: '',
    description: '',
    type: 'URL',
  });

  // Get subjects dynamically from mock data
  // const subjects = getSubjectList();

  const { data: Categories } = useGet<Category[]>('/category/getAllCategories');

  const { data: Instructors } = useGet<InstructorsType>(
    '/instructor/getAllInstructor',
  );

  const { data: CourseOptions } = useGet<
    (CourseChapter & {
      Category: Category;
      CourseSubChapter: CourseSubChapter[];
    })[]
  >('/course/getCourseUserByCategoryId?adminPage=true', {
    params: {
      categoryId: selectedCategoryId,
    },
    useEffectDependencies: [selectedCategoryId],
  });

  console.log('CourseOptions', CourseOptions);

  const onChangeAgenda = (
    key: 'title' | 'description' | 'duration',
    value: string | number,
    index: number,
  ) => {
    setAgendas((prev) =>
      prev.map((item, aIndex) => {
        if (index === aIndex) {
          return {
            ...item,
            [key]: value,
          };
        }
        return item;
      }),
    );
  };

  const { data: plans } = useGet<PlanType>('/plan/getAllPlanForPricingPage');

  const bundles = plans?.bundles;
  const subscription = plans?.subscriptions;

  const { mutate } = useMutation('/liveClass/addLiveClass', 'post');

  const validateSubmit = () => {
    if (selectedPlanIds.length === 0 && accessType === 'PREMIUM') {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Pilih plans',
      });
      return false;
    }
    if (instructorId.length === 0) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Pilih tutor',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSubmit()) return;
    setIsLoading(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const title = formData.get('title') as string;
      const categoryId = formData.get('categoryId');
      const description = formData.get('description');
      const startDate = formData.get('startDate');
      const duration = parseInt((formData.get('duration') as string) || '0');
      const maxParticipant = formData.get('maxParticipants')
        ? parseInt((formData.get('maxParticipants') as string) || '0')
        : undefined;
      const link = formData.get('link');
      const isRecord =
        formData.get('record-live-class') === 'on' ? true : false;

      console.log({ image });

      let imageUrl = undefined;
      if (image && title) {
        const pathFile = `live-learning/${sanitizeFileName(title)}`;

        const upload = await supabase.storage
          .from('img')
          .upload(pathFile, image);

        console.log({ upload });

        const { data } = supabase.storage.from('img').getPublicUrl(pathFile);

        if (data.publicUrl) {
          imageUrl = data.publicUrl;
        }
      }

      const payload = {
        planIds: accessType === 'PREMIUM' ? selectedPlanIds : [],
        liveClass: {
          title,
          categoryId,
          description,
          startDate,
          duration,
          maxParticipant,
          link,
          isRecord,
          instructorId,
          type,
          accessType,
          image: imageUrl,
        },
        liveClassAgenda: agendas,
        liveClassReference: references,
      };

      await mutate({ payload });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${website_sub_category_id}/admin/live-class`);
  };

  const selectedCategory = Categories?.find(
    (item) => item.id === selectedCategoryId,
  );

  // URL Reference Functions
  const addURLReadingReference = (urlData: ReferenceType) => {
    setReferences((prev) => [...prev, urlData]);
  };

  const referencesCourse = references.filter((item) => item.type === 'COURSE');
  const referencesUrl = references.filter((item) => item.type === 'URL');

  return (
    <div className="space-y-6">
      {/* Header */}
      <LoadingPageWithText
        loading={isLoading}
        heading="Menyimpan Live Class"
      />
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Buat Live Learning Baru
          </h1>
          <p className="text-muted-foreground">
            Isi form di bawah untuk membuat live learning baru
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Informasi Dasar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Judul Kelas *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Contoh: Matematika Dasar - Aljabar Linear"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Mata Pelajaran *</Label>
                <Select
                  name="categoryId"
                  value={selectedCategoryId}
                  onValueChange={(value) => setSelectedCategoryId(value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {Categories?.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accessType">Akses *</Label>
                <Select
                  name="accessType"
                  value={accessType}
                  onValueChange={(value) =>
                    value && setAccessType(value as any)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe live learning" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      [
                        {
                          id: 'PREMIUM',
                          name: 'Premium',
                        },
                        {
                          id: 'FREE_WITH_REGISTRATION',
                          name: 'Gratis dengan registrasi',
                        },
                        {
                          id: 'FREE_NO_REGISTRATION',
                          name: 'Gratis tanpa registrasi',
                        },
                      ] as { id: LiveClassAccessTypeEnum; name: string }[]
                    )?.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipe Live Learning *</Label>
                <Select
                  name="type"
                  value={type}
                  onValueChange={(value) => value && setType(value as any)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe live learning" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      {
                        id: 'WEBINAR',
                        name: 'Webinar',
                      },
                      {
                        id: 'LIVECLASS',
                        name: 'Liveclass',
                      },
                      {
                        id: 'LIVESTREAM',
                        name: 'Livestream',
                      },
                    ]?.map((subject) => (
                      <SelectItem
                        key={subject.id}
                        value={subject.id}
                      >
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Jelaskan materi yang akan dibahas dalam live class ini..."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <InputImage
                  onChange={(file) => {
                    setImage(file);
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {accessType === 'PREMIUM' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pilih Plan
              </CardTitle>
            </CardHeader>
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
                            setSelectedPlanIds((prev) => [...prev, item.id]);
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
                <Label className="text-xl font-semibold">Subscription</Label>
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
                            setSelectedPlanIds((prev) => [...prev, item.id]);
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
          </Card>
        )}

        {/* Tutor Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Pilih Tutor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>Tutor *</Label>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Instructors?.map((tutor) => (
                  <div
                    key={tutor.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      instructorId === tutor.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setInstructorId(tutor.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          className="object-contain w-full h-full"
                          src={tutor.image || undefined}
                          alt={tutor.name}
                        />
                        <AvatarFallback>
                          {tutor.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {tutor.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {tutor.lastEducation}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-gray-40000">
                            {tutor.description}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tutor.Category.slice(0, 2).map((spec) => (
                            <Badge
                              key={spec.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {spec.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Schedule & Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Jadwal & Pengaturan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal *</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="datetime-local"
                  required
                />
              </div>

              <div className="space-y-2 relative">
                <button
                  type="button"
                  className="absolute bottom-[-20px] text-xs bg-main hover:bg-main/90 duration-300 text-white rounded-full px-4"
                  onClick={() => {
                    const value = agendas.reduce(
                      (acc, item) => acc + item.duration,
                      0,
                    );
                    (
                      document.getElementById('duration') as HTMLInputElement
                    ).value = value.toString();
                  }}
                >
                  Sesuaikan dengan agenda
                </button>
                <Label htmlFor="duration">
                  Perkiraan lama live class (menit) *
                </Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  placeholder="120"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maksimal Peserta</Label>
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  min="1"
                  placeholder="Kosongkan untuk unlimited"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link Meet *</Label>
              <Input
                id="link"
                name="link"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                required
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">Rekam Sesi</h4>
                <p className="text-sm text-gray-500">
                  Live class akan direkam untuk review nanti
                </p>
              </div>
              <Switch
                id="record-live-class"
                name="record-live-class"
              />
            </div>
          </CardContent>
        </Card>

        {/* Agenda (Optional) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Agenda Live Learning (Opsional)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Buat agenda atau rundown untuk live learning ini
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Daftar Agenda</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setAgendas((prev) => [
                    ...prev,
                    { title: '', duration: 0, description: '' },
                  ])
                }
              >
                <FileText className="h-4 w-4 mr-2" />
                Tambah Agenda
              </Button>
            </div>

            {agendas.length > 0 && (
              <div className="space-y-3">
                {agendas.map((agenda, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        Agenda {index + 1}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setAgendas((prev) =>
                            prev.filter((_, aIndex) => aIndex !== index),
                          )
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs">Judul Agenda *</Label>
                        <Input
                          placeholder="e.g., Pembukaan dan Perkenalan"
                          value={agenda.title}
                          onChange={(e) =>
                            onChangeAgenda('title', e.target.value, index)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Durasi (menit)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 10"
                          value={agenda.duration === 0 ? '' : agenda.duration}
                          onChange={(e) =>
                            onChangeAgenda(
                              'duration',
                              parseInt(e.target.value),
                              index,
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Deskripsi</Label>
                      <Textarea
                        placeholder="Jelaskan aktivitas yang akan dilakukan pada agenda ini..."
                        value={agenda.description}
                        rows={3}
                        onChange={(e) =>
                          onChangeAgenda('description', e.target.value, index)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {agendas.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>
                  Belum ada agenda. Klik &quot;Tambah Agenda&quot; untuk
                  memulai.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course References (Optional) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              References (Opsional)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Pilih bacaan atau rekaman dari subchapter course, atau tambahkan
              link external
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Referensi Course ({referencesCourse.length})
              </Label>
              <div className="space-y-2">
                {referencesCourse.map((reference, index) => {
                  const CourseData = CourseOptions?.find((item) =>
                    item.CourseSubChapter.find(
                      (item2) => item2.id === reference.subChapterId,
                    ),
                  );
                  const data = CourseData?.CourseSubChapter.find(
                    (item2) => item2.id === reference.subChapterId,
                  );
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {data?.type === 'DOCUMENT' && (
                            <FileText className="h-4 w-4 text-blue-600" />
                          )}
                          {data?.type === 'MATERI' && (
                            <FileText className="h-4 w-4 text-blue-600" />
                          )}
                          {data?.type === 'VIDEO' && (
                            <Play className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h6 className="font-medium text-sm">
                            {reference.title}
                          </h6>
                          {/* <p className="text-xs text-gray-600">
                              {data?.title} → {reference.chapterTitle}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {reference.content}
                            </p> */}
                          {data?.spendTime && (
                            <p className="text-xs text-gray-400 mt-1">
                              Durasi: {data?.spendTime}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setReferences((prev) =>
                            prev.filter((_, rIndex) => index !== rIndex),
                          )
                        }
                        className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Referensi URL ({referencesUrl.length})
              </Label>
              <div className="space-y-2">
                {referencesUrl.map((reference, index) => {
                  if (reference.type === 'COURSE') {
                    const CourseData = CourseOptions?.find((item) =>
                      item.CourseSubChapter.find(
                        (item2) => item2.id === reference.subChapterId,
                      ),
                    );
                    const data = CourseData?.CourseSubChapter.find(
                      (item2) => item2.id === reference.subChapterId,
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">
                            {data?.type === 'DOCUMENT' && (
                              <FileText className="h-4 w-4 text-blue-600" />
                            )}
                            {data?.type === 'MATERI' && (
                              <FileText className="h-4 w-4 text-blue-600" />
                            )}
                            {data?.type === 'VIDEO' && (
                              <Play className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h6 className="font-medium text-sm">
                              {reference.title}
                            </h6>
                            {/* <p className="text-xs text-gray-600">
                              {data?.title} → {reference.chapterTitle}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {reference.content}
                            </p> */}
                            {data?.spendTime && (
                              <p className="text-xs text-gray-400 mt-1">
                                Durasi: {data?.spendTime}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setReferences((prev) =>
                              prev.filter((_, rIndex) => index !== rIndex),
                            )
                          }
                          className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  }
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {reference.urlType === 'DOCUMENT' && (
                            <FileText className="h-4 w-4 text-blue-600" />
                          )}
                          {reference.urlType === 'WEBSITE' && (
                            <FileText className="h-4 w-4 text-blue-600" />
                          )}
                          {reference.urlType === 'ARTICLE' && (
                            <FileText className="h-4 w-4 text-blue-600" />
                          )}
                          {reference.urlType === 'VIDEO' && (
                            <Play className="h-4 w-4 text-green-600" />
                          )}
                          {reference.urlType === 'AUDIO' && (
                            <Volume2 className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h6 className="font-medium text-sm">
                            {reference.title}
                          </h6>
                          {/* <p className="text-xs text-gray-600">
                          {reference.courseTitle} → {reference.chapterTitle}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {reference.content}
                        </p>
                        {reference.duration && (
                          <p className="text-xs text-gray-400 mt-1">
                            Durasi: {reference.duration}
                          </p>
                        )} */}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setReferences((prev) =>
                            prev.filter((_, rIndex) => index !== rIndex),
                          )
                        }
                        className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            <Tabs
              defaultValue="course"
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger
                  value="course"
                  className="text-sm py-2 px-3 data-[state=active]:shadow-sm"
                >
                  📚 Dari Course
                </TabsTrigger>
                <TabsTrigger
                  value="url"
                  className="text-sm py-2 px-3 data-[state=active]:shadow-sm"
                >
                  🔗 Dari URL
                </TabsTrigger>
              </TabsList>

              {/* TAB: DARI COURSE */}
              <TabsContent
                value="course"
                className="pt-6 space-y-6"
              >
                {selectedCategoryId ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>
                        Course yang Tersedia untuk {selectedCategory?.name}
                      </Label>
                      {CourseOptions?.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p>
                            Belum ada course tersedia untuk mata pelajaran{' '}
                            {selectedCategory?.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {CourseOptions?.map((chapter) => (
                            <div
                              key={chapter.id}
                              className="border rounded-lg p-4"
                            >
                              <h4 className="font-medium text-gray-900 mb-3">
                                {chapter.title}
                              </h4>
                              <div className="space-y-3">
                                <div className="ml-4">
                                  <div className="grid gap-2 md:grid-cols-2">
                                    {chapter.CourseSubChapter.filter(
                                      (item) => item.type !== 'TRYOUT',
                                    ).map((subchapter) => {
                                      // const isAddedReading =
                                      //   formData.readingReferences.some(
                                      //     (ref) =>
                                      //       ref.subchapterId ===
                                      //       subchapter.id,
                                      //   );
                                      // const isAddedRecording =
                                      //   formData.recordingReferences.some(
                                      //     (ref) =>
                                      //       ref.subchapterId ===
                                      //       subchapter.id,
                                      //   );

                                      const isAddedReading =
                                        subchapter.type !== 'VIDEO';
                                      const isAddedRecording =
                                        subchapter.type === 'VIDEO';

                                      const isSelected = referencesCourse.some(
                                        (item) =>
                                          item.subChapterId === subchapter.id,
                                      );

                                      return (
                                        <div
                                          key={subchapter.id}
                                          className={cn(
                                            'flex items-center justify-between p-3 border rounded-lg bg-gray-50',
                                            isSelected &&
                                              'border-main bg-main/10',
                                          )}
                                        >
                                          <div className="flex items-start gap-3 flex-1">
                                            <div className="mt-1">
                                              {subchapter.type ===
                                                'DOCUMENT' && (
                                                <FileText className="h-4 w-4 text-blue-600" />
                                              )}
                                              {subchapter.type === 'MATERI' && (
                                                <FileText className="h-4 w-4 text-blue-600" />
                                              )}
                                              {subchapter.type === 'VIDEO' && (
                                                <Play className="h-4 w-4 text-green-600" />
                                              )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <h6 className="font-medium text-sm truncate">
                                                {subchapter.type}
                                              </h6>
                                              <p className="text-xs text-gray-500 mt-1">
                                                {subchapter.title}
                                              </p>
                                              {subchapter.spendTime && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                  Durasi: {subchapter.spendTime}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex gap-2 ml-3">
                                            {isAddedReading && (
                                              <Button
                                                type="button"
                                                size="sm"
                                                variant={'outline'}
                                                className="text-xs hover:bg-white cursor-default"
                                              >
                                                <FileText className="h-3 w-3 mr-1" />
                                                Bacaan
                                              </Button>
                                            )}
                                            {isAddedRecording && (
                                              <Button
                                                type="button"
                                                size="sm"
                                                variant={'outline'}
                                                className="text-xs hover:bg-white cursor-default"
                                              >
                                                <Play className="h-3 w-3 mr-1" />
                                                Rekaman
                                              </Button>
                                            )}
                                            {!isSelected && (
                                              <Button
                                                type="button"
                                                size="sm"
                                                variant={'outline'}
                                                onClick={() =>
                                                  setReferences((prev) => [
                                                    ...prev,
                                                    {
                                                      title: subchapter.title,
                                                      description:
                                                        subchapter.type ===
                                                        'VIDEO'
                                                          ? 'Video'
                                                          : subchapter.description,
                                                      type: 'COURSE',
                                                      subChapterId:
                                                        subchapter.id,
                                                    },
                                                  ])
                                                }
                                                className="text-xs bg-main text-white cursor-pointer hover:bg-main/90 hover:text-white px-2"
                                              >
                                                <Plus className="h-4 w-4" />
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>
                      Pilih mata pelajaran terlebih dahulu untuk melihat course
                      references
                    </p>
                  </div>
                )}
              </TabsContent>

              {/* TAB: DARI URL */}
              <TabsContent
                value="url"
                className="pt-6 space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">
                      References dari URL
                    </Label>
                  </div>
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          Tambah URL Bacaan
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="text-xs">Judul *</Label>
                          <Input
                            placeholder="e.g., Panduan Matematika Dasar"
                            value={urlReadingData.title}
                            onChange={(e) =>
                              setUrlReadingData((prev) => ({
                                ...prev,
                                title: e.target.value,
                              }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Tipe</Label>
                          <Select
                            value={urlReadingData.urlType}
                            onValueChange={(value) =>
                              setUrlReadingData((prev) => ({
                                ...prev,
                                urlType: value as LiveClassReferenceUrlTypeEnum,
                              }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih tipe url" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WEBSITE">Website</SelectItem>
                              <SelectItem value="DOCUMENT">Dokumen</SelectItem>
                              <SelectItem value="ARTICLE">Artikel</SelectItem>
                              <SelectItem value="VIDEO">Video</SelectItem>
                              <SelectItem value="AUDIO">Audio</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">URL *</Label>
                        <Input
                          placeholder="https://example.com/article"
                          value={urlReadingData.url}
                          onChange={(e) =>
                            setUrlReadingData((prev) => ({
                              ...prev,
                              url: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Deskripsi</Label>
                        <Textarea
                          placeholder="Jelaskan konten yang ada di URL ini..."
                          value={urlReadingData.description}
                          onChange={(e) =>
                            setUrlReadingData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          rows={2}
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => {
                            if (!urlReadingData.title || !urlReadingData.url) {
                              toaster({
                                title: 'Form Tidak Lengkap',
                                description: 'Title dan URL wajib diisi',
                                condition: 'warning',
                              });
                              return;
                            }
                            addURLReadingReference(urlReadingData);
                            setUrlReadingData({
                              title: '',
                              description: '',
                              type: 'URL',
                            });
                            // setShowURLReadingForm(false);
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Tambah
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUrlReadingData({
                              title: '',
                              description: '',
                              type: 'URL',
                            });
                            // setShowURLReadingForm(false);
                          }}
                        >
                          Batal
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Buat Live Class
              </>
            )}
          </Button>
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
