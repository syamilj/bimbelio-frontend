'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  getSubjectList,
  MockTutor,
  mockTutors,
} from '@/lib/mock-data/live-class';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  subjects: string[];
  avatar?: File;
  isActive: boolean;
}

interface EditTutorFormProps {
  tutorId: string;
}

export function EditTutorForm({ tutorId }: EditTutorFormProps) {
  const router = useRouter();
  const availableSubjects = getSubjectList();

  const [tutor, setTutor] = useState<MockTutor | null>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    subjects: [],
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const foundTutor = mockTutors.find((t) => t.id === tutorId);
    if (foundTutor) {
      setTutor(foundTutor);
      setFormData({
        fullName: foundTutor.fullName,
        email: foundTutor.email,
        phone: foundTutor.phone || '',
        bio: foundTutor.bio,
        subjects: foundTutor.subjects,
        isActive: foundTutor.isActive,
      });
      setAvatarPreview(foundTutor.avatar || null);
    }
  }, [tutorId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim())
      newErrors.fullName = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.bio.trim()) newErrors.bio = 'Bio wajib diisi';
    if (formData.subjects.length === 0)
      newErrors.subjects = 'Minimal pilih satu mata pelajaran';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toaster({
        title: 'Form Tidak Valid',
        description: 'Mohon periksa kembali data yang diisi',
        condition: 'warning',
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toaster({
        title: 'Tutor Berhasil Diupdate',
        description: `Data ${formData.fullName} berhasil diperbarui`,
        condition: 'success',
      });

      router.push(`/${website_sub_category_id}/admin/tutors/${tutorId}`);
    } catch (error) {
      toaster({
        title: 'Gagal Mengupdate Tutor',
        description: 'Terjadi kesalahan saat mengupdate data tutor',
        condition: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!tutor) {
    return (
      <div className="space-y-6">
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
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>Tutor tidak ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Tutor</h1>
          <p className="text-gray-600">
            Perbarui informasi tutor {tutor.fullName}
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
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      className={errors.fullName ? 'border-red-500' : ''}
                      placeholder="Dr. Ahmad Sukri, M.Si"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={errors.email ? 'border-red-500' : ''}
                      placeholder="ahmad.sukri@bimbelio.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+6281234567890"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Bio/Deskripsi <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className={errors.bio ? 'border-red-500' : ''}
                    placeholder="Dosen Matematika dengan pengalaman 15 tahun..."
                    rows={4}
                  />
                  {errors.bio && (
                    <p className="text-sm text-red-500">{errors.bio}</p>
                  )}
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
                  {errors.subjects && (
                    <p className="text-sm text-red-500">{errors.subjects}</p>
                  )}
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {availableSubjects.map((subject) => (
                      <div
                        key={subject}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={subject}
                          checked={formData.subjects.includes(subject)}
                          onCheckedChange={() => handleSubjectToggle(subject)}
                        />
                        <Label
                          htmlFor={subject}
                          className="text-sm font-normal"
                        >
                          {subject}
                        </Label>
                      </div>
                    ))}
                  </div>

                  {/* Selected Subjects Preview */}
                  {formData.subjects.length > 0 && (
                    <div className="pt-3 border-t">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Mata pelajaran terpilih:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.subjects.map((subject) => (
                          <Badge
                            key={subject}
                            variant="secondary"
                            className="gap-1"
                          >
                            {subject}
                            <X
                              className="h-3 w-3 cursor-pointer hover:text-red-500"
                              onClick={() => handleSubjectToggle(subject)}
                            />
                          </Badge>
                        ))}
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
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback className="text-lg">
                      {formData.fullName
                        ? getInitials(formData.fullName)
                        : 'TU'}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Upload Foto Baru</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="avatar"
                      type="file"
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
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistik Saat Ini</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Kelas</span>
                  <span className="font-medium">{tutor.totalClasses}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium">
                    {tutor.rating.toFixed(1)}/5.0
                  </span>
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
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
