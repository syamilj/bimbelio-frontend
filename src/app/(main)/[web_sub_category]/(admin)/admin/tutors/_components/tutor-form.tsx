'use client';

import {
  AdminFormActions,
  AdminFormSection,
  AdminNotFound,
  AdminPageHeader,
} from '@/components/admin/admin-page';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';
import LoadingPageWithText, {
  LoadingComponentWithText,
} from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { responseError } from '@/lib/response';
import { storage } from '@/supabaseClient';
import { Category } from '@/types/database';
import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { InstructorsType } from '../page';

// Satu form untuk tambah & edit tutor (dulu dua halaman salinan ~440 baris
// yang mengisi input lewat document.getElementsByName).

type TutorFields = {
  name: string;
  email: string;
  phone: string;
  description: string;
  lastEducation: string;
};

const EMPTY_FIELDS: TutorFields = {
  name: '',
  email: '',
  phone: '',
  description: '',
  lastEducation: '',
};

export const TutorForm = ({ instructorId }: { instructorId?: string }) => {
  const isEdit = !!instructorId;

  const [fields, setFields] = useState<TutorFields>(EMPTY_FIELDS);
  const [file, setFile] = useState<File>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [certificateList, setCertificateList] = useState<string[]>([]);
  const [status, setStatus] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const setField =
    (key: keyof TutorFields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const { data: instructor, isLoading: isLoadingInstructor } = useGet<
    InstructorsType[0]
  >('/instructor/getSingleInstructor', {
    enabled: isEdit,
    params: { id: instructorId },
    useEffectDependencies: [instructorId],
  });
  const { data: categories } = useGet<Category[]>('/category/getAllCategories');

  const { mutate: saveTutor } = useMutation(
    isEdit ? '/instructor/updateInstructor' : '/instructor/addInstructor',
    isEdit ? 'put' : 'post',
  );

  useEffect(() => {
    if (!instructor) return;
    setFields({
      name: instructor.name,
      email: instructor.email,
      phone: instructor.phone,
      description: instructor.description,
      lastEducation: instructor.lastEducation,
    });
    setCertificateList(
      instructor.InstructorCertificate.map((item) => item.title),
    );
    setSelectedSubjects(instructor.Category.map((item) => item.id));
    setStatus(instructor.status);
    setAvatarPreview(instructor.image);
  }, [instructor]);

  const toggleSubject = (id: string) =>
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    const reader = new FileReader();
    reader.onload = (event) => setAvatarPreview(event.target?.result as string);
    reader.readAsDataURL(picked);
  };

  /** Unggah foto baru (bila ada) dan kembalikan URL gambar yang dipakai. */
  const uploadAvatar = async () => {
    if (!file) return instructor?.image ?? null;
    const existingName = instructor?.image?.split('/tutor/')[1];
    if (existingName)
      await storage.from('img').remove([`tutor/${existingName}`]);

    const filePath = `tutor/${fields.email}-${crypto.randomUUID().slice(0, 4)}`;
    const { error } = await storage.from('img').upload(filePath, file);
    if (error) throw new Error('Gagal mengunggah foto profil');
    return `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/${filePath}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedSubjects.length === 0) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Pilih mata pelajaran',
      });
      return;
    }
    // Backend mewajibkan field image.
    if (!file && !instructor?.image) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Unggah foto profil tutor',
      });
      return;
    }

    setIsSaving(true);
    try {
      const image = await uploadAvatar();
      const res = await saveTutor({
        payload: {
          ...(isEdit ? { id: instructorId } : {}),
          ...fields,
          image,
          status,
          certificateList,
          categoryIds: selectedSubjects,
        },
      });
      if (!isEdit && res?.status === 200) {
        setFields(EMPTY_FIELDS);
        setFile(undefined);
        setAvatarPreview(null);
        setSelectedSubjects([]);
        setCertificateList([]);
        setStatus(false);
      }
    } catch (error) {
      responseError(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isEdit && isLoadingInstructor) {
    return <LoadingComponentWithText heading="Mengambil data tutor..." />;
  }
  if (isEdit && !instructor)
    return <AdminNotFound title="Tutor tidak ditemukan" />;

  return (
    <div className="space-y-6">
      <LoadingPageWithText
        loading={isSaving}
        heading="Menyimpan tutor..."
      />
      <AdminPageHeader
        title={isEdit ? 'Edit Tutor' : 'Tambah Tutor'}
        description={
          isEdit
            ? 'Perbarui data tutor live class'
            : 'Tambahkan tutor baru untuk mengajar live class'
        }
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <AdminFormSection title="Informasi Dasar">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={fields.name}
                    onChange={setField('name')}
                    placeholder="Dr. Ahmad Sukri, M.Si"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={fields.email}
                    onChange={setField('email')}
                    placeholder="ahmad.sukri@bimbelio.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={fields.phone}
                  onChange={setField('phone')}
                  placeholder="+6281234567890"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Deskripsi <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={fields.description}
                  onChange={setField('description')}
                  placeholder="Dosen Matematika dengan pengalaman 15 tahun..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sertifikat</Label>
                  <InputTags
                    value={certificateList}
                    onChange={setCertificateList}
                    placeholder="Tambahkan sertifikat"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-education">
                    Pendidikan Terakhir <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="last-education"
                    value={fields.lastEducation}
                    onChange={setField('lastEducation')}
                    placeholder="S1 Pendidikan Kedokteran"
                    required
                  />
                </div>
              </div>
            </AdminFormSection>

            <AdminFormSection
              title="Mata Pelajaran"
              description="Pilih mata pelajaran yang dapat diajar oleh tutor"
            >
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {categories?.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={subject.id}
                      checked={selectedSubjects.includes(subject.id)}
                      onCheckedChange={() => toggleSubject(subject.id)}
                    />
                    <Label
                      htmlFor={subject.id}
                      className="text-sm font-normal"
                    >
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>

              {selectedSubjects.length > 0 && (
                <div className="border-t pt-3">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Mata pelajaran terpilih:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubjects.map((id) => (
                      <Badge
                        key={id}
                        variant="secondary"
                        className="gap-1"
                      >
                        {categories?.find((item) => item.id === id)?.name}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => toggleSubject(id)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </AdminFormSection>
          </div>

          <div className="space-y-6">
            <AdminFormSection title="Foto Profil">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={avatarPreview || undefined}
                    className="h-full w-full object-contain"
                  />
                  <AvatarFallback className="text-lg">IMG</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Unggah Foto</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <p className="text-xs text-gray-500">
                  Format: JPG, PNG. Maksimal 2MB.
                </p>
              </div>
            </AdminFormSection>

            <AdminFormSection title="Status">
              <div className="flex items-center justify-between">
                <div>
                  <Label
                    htmlFor="isActive"
                    className="text-sm font-medium"
                  >
                    Status Aktif
                  </Label>
                  <p className="text-xs text-gray-500">
                    Tutor dapat mengajar live class
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={status}
                  onCheckedChange={setStatus}
                />
              </div>
            </AdminFormSection>
          </div>
        </div>

        <AdminFormActions isSubmitting={isSaving} />
      </form>
    </div>
  );
};
