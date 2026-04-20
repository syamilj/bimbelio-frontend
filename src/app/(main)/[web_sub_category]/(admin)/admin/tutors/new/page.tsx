'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { InputTags } from '@/components/ui/input-tags';
import { Label } from '@/components/ui/label';
import LoadingPageWithText from '@/components/ui/spinner';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { responseError } from '@/lib/response';
import { storage } from '@/supabaseClient';
import { Category } from '@/types/database';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function CreateTutorForm() {
  const router = useRouter();

  const [_file, setFile] = useState<File>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [selectedSubjects, setSelectedSubject] = useState<string[]>([]);
  const [certificateList, setCertificateList] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const { data: Categories } = useGet<Category[]>('/category/getAllCategories');

  const { mutate: SaveTutor } = useMutation(
    '/instructor/addInstructor',
    'post',
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (selectedSubjects.length === 0) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Pilih mata pelajaran',
      });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const name = formData.get('name');
      const email = formData.get('email');
      const phone = formData.get('phone');
      const description = formData.get('description');
      const profile = formData.get('profile') as File | undefined;
      const lastEducation = formData.get('last-education');
      const status = formData.get('status') === 'on' ? true : false;
      const categoryIds = selectedSubjects;

      let image = null;

      if (profile) {
        const filePath = `tutor/${email}-${crypto.randomUUID().slice(0, 4)}`;
        const { error } = await storage.from('img').upload(filePath, profile);

        if (error) {
          toaster({
            title: 'Error',
            description: 'Failed upload profile',
          });
          return;
        } else {
          image = `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/${filePath}`;
        }
      }

      const res = await SaveTutor({
        payload: {
          name,
          email,
          phone,
          image,
          description,
          profile,
          status,
          lastEducation,
          certificateList,
          categoryIds,
        },
      });
      if (res?.status === 200) {
        (e.target as HTMLFormElement).reset();
        setAvatarPreview(null);
        setSelectedSubject([]);
      }
    } catch (error) {
      responseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <LoadingPageWithText
        loading={isLoading}
        heading="Menyimpan tutor..."
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
          <h1 className="text-2xl font-bold text-gray-900">
            Tambah Tutor Baru
          </h1>
          <p className="text-gray-600">
            Tambahkan tutor baru untuk mengajar live class
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Dasar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      name="name"
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
                      name="email"
                      placeholder="ahmad.sukri@bimbelio.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+6281234567890"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Deskripsi <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="bio"
                    name="description"
                    placeholder="Dosen Matematika dengan pengalaman 15 tahun..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="bio">
                      Sertifikat <span className="text-red-500">*</span>
                    </Label>
                    <InputTags
                      value={certificateList}
                      onChange={setCertificateList}
                      placeholder="Tambahkan Sertifikat"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-education">
                      Pendidikan Terakhir{' '}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last-education"
                      name="last-education"
                      placeholder="S1 Pendidikan Kedokteran"
                      required
                    />
                  </div>

                  {/* <div className="space-y-2">
                    <Label htmlFor="certificate">Sertifikat</Label>
                    <Input
                      id="certificate"
                      type="certificate"
                      name="certificate"
                      placeholder="Sertifikat..."
                    />
                  </div> */}
                </div>
              </CardContent>
            </Card>

            {/* Subjects */}
            <Card>
              <CardHeader>
                <CardTitle>Mata Pelajaran</CardTitle>
                <p className="text-sm text-gray-600">
                  Pilih mata pelajaran yang dapat diajar oleh tutor
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {Categories?.map((subject) => {
                      const value = selectedSubjects.some(
                        (item) => item === subject.id,
                      );
                      return (
                        <div
                          key={subject.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={subject.id}
                            checked={value}
                            onCheckedChange={() => {
                              if (value) {
                                setSelectedSubject((prev) =>
                                  prev.filter((item) => item !== subject.id),
                                );
                              } else {
                                setSelectedSubject((prev) => [
                                  ...prev,
                                  subject.id,
                                ]);
                              }
                            }}
                            // checked={formData.subjects.includes(subject)}
                            // onCheckedChange={() => handleSubjectToggle(subject)}
                          />
                          <Label
                            htmlFor={subject.id}
                            className="text-sm font-normal"
                          >
                            {subject.name}
                          </Label>
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Subjects Preview */}
                  {selectedSubjects.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Mata pelajaran terpilih:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSubjects.map((id) => {
                          const subject = Categories?.find(
                            (item) => item.id === id,
                          );
                          return (
                            <Badge
                              key={subject?.id}
                              variant="secondary"
                              className="gap-1"
                            >
                              {subject?.name}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500"
                                onClick={() =>
                                  setSelectedSubject((prev) =>
                                    prev.filter((item) => item !== subject?.id),
                                  )
                                }
                              />
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar */}
            <Card>
              <CardHeader>
                <CardTitle>Foto Profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={avatarPreview || undefined}
                      className="object-contain w-full h-full"
                    />
                    <AvatarFallback className="text-lg">IMG</AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Upload Foto</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="avatar"
                      type="file"
                      name="profile"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Format: JPG, PNG. Maksimal 2MB.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
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
                    name="status"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
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
