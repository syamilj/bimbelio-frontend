'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  CourseReference,
  getCoursesBySubject,
  getSubjectList,
  mockTutorsForForm,
  URLReferenceInput,
} from '@/lib/mock-data/live-class';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  FileText,
  Link,
  Play,
  Plus,
  Save,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface FormData {
  title: string;
  description: string;
  subject: string;
  tutorId: string;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  maxParticipants: string;
  meetLink: string;
  isRecorded: boolean;
  agenda: AgendaInput[];
  readingReferences: CourseReference[];
  recordingReferences: CourseReference[];
}

interface AgendaInput {
  id: string;
  title: string;
  description: string;
  duration: string;
}

export function CreateLiveClassForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    subject: '',
    tutorId: '',
    scheduleDate: '',
    startTime: '',
    endTime: '',
    maxParticipants: '',
    meetLink: '',
    isRecorded: false,
    agenda: [],
    readingReferences: [],
    recordingReferences: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // URL Reference Form States
  const [showURLReadingForm, setShowURLReadingForm] = useState(false);
  const [showURLRecordingForm, setShowURLRecordingForm] = useState(false);
  const [urlReadingData, setUrlReadingData] = useState<URLReferenceInput>({
    title: '',
    description: '',
    url: '',
    type: 'website',
  });
  const [urlRecordingData, setUrlRecordingData] = useState<URLReferenceInput>({
    title: '',
    description: '',
    url: '',
    type: 'video',
  });

  // Get subjects dynamically from mock data
  const subjects = getSubjectList();

  const selectedTutor = mockTutorsForForm.find(
    (t) => t.id === formData.tutorId,
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Judul wajib diisi';
    if (!formData.description.trim())
      newErrors.description = 'Deskripsi wajib diisi';
    if (!formData.subject) newErrors.subject = 'Mata pelajaran wajib dipilih';
    if (!formData.tutorId) newErrors.tutorId = 'Tutor wajib dipilih';
    if (!formData.scheduleDate)
      newErrors.scheduleDate = 'Tanggal wajib dipilih';
    if (!formData.startTime) newErrors.startTime = 'Waktu mulai wajib diisi';
    if (!formData.endTime) newErrors.endTime = 'Waktu selesai wajib diisi';
    if (!formData.meetLink.trim()) newErrors.meetLink = 'Link meet wajib diisi';

    if (formData.maxParticipants && parseInt(formData.maxParticipants) < 1) {
      newErrors.maxParticipants = 'Jumlah peserta minimal 1';
    }

    // Validate time
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (end <= start) {
        newErrors.endTime = 'Waktu selesai harus setelah waktu mulai';
      }
    }

    // Validate date not in past
    if (formData.scheduleDate) {
      const selectedDate = new Date(formData.scheduleDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.scheduleDate = 'Tanggal tidak boleh di masa lalu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addAgenda = () => {
    setFormData((prev) => ({
      ...prev,
      agenda: [
        ...prev.agenda,
        {
          id: Date.now().toString(),
          title: '',
          description: '',
          duration: '',
        },
      ],
    }));
  };

  const removeAgenda = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.filter((a) => a.id !== id),
    }));
  };

  const updateAgenda = (
    id: string,
    field: keyof AgendaInput,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((a) =>
        a.id === id ? { ...a, [field]: value } : a,
      ),
    }));
  };

  // References management functions
  const addReference = (subchapter: any, course: any, chapter: any) => {
    const newReference: CourseReference = {
      id: Date.now().toString(),
      source: 'subchapter',
      courseId: course.id,
      courseTitle: course.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      subchapterId: subchapter.id,
      subchapterTitle: subchapter.title,
      title: subchapter.title,
      description: subchapter.content,
      type: subchapter.type,
      content: subchapter.content,
      fileUrl: subchapter.fileUrl,
      duration: subchapter.duration,
    };

    // Check if reference already exists in either reading or recording references
    const existsInReading = formData.readingReferences.some(
      (ref) => ref.subchapterId === subchapter.id,
    );
    const existsInRecording = formData.recordingReferences.some(
      (ref) => ref.subchapterId === subchapter.id,
    );

    if (existsInReading || existsInRecording) {
      toaster({
        title: 'Reference Sudah Ditambahkan',
        description: 'Subchapter ini sudah ada dalam daftar references',
        condition: 'warning',
      });
      return;
    }

    // For now, add to reading references by default (we'll add buttons to choose later)
    setFormData((prev) => ({
      ...prev,
      readingReferences: [...prev.readingReferences, newReference],
    }));

    toaster({
      title: 'Reading Reference Ditambahkan',
      description: `"${subchapter.title}" berhasil ditambahkan ke referensi bacaan`,
      condition: 'success',
    });
  };

  const addReadingReference = (subchapter: any, course: any, chapter: any) => {
    const newReference: CourseReference = {
      id: `ref-${Date.now()}`,
      source: 'subchapter',
      courseId: course.id,
      courseTitle: course.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      subchapterId: subchapter.id,
      subchapterTitle: subchapter.title,
      title: subchapter.title,
      description: subchapter.content,
      type: subchapter.type,
      content: subchapter.content,
      fileUrl: subchapter.fileUrl,
      duration: subchapter.duration,
    };

    const exists = formData.readingReferences.some(
      (ref) => ref.subchapterId === subchapter.id,
    );

    if (exists) {
      toaster({
        title: 'Reference Sudah Ditambahkan',
        description: 'Subchapter ini sudah ada dalam daftar referensi bacaan',
        condition: 'warning',
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      readingReferences: [...prev.readingReferences, newReference],
    }));

    toaster({
      title: 'Reading Reference Ditambahkan',
      description: `"${subchapter.title}" berhasil ditambahkan ke referensi bacaan`,
      condition: 'success',
    });
  };

  const addRecordingReference = (
    subchapter: any,
    course: any,
    chapter: any,
  ) => {
    const newReference: CourseReference = {
      id: `ref-${Date.now()}`,
      source: 'subchapter',
      courseId: course.id,
      courseTitle: course.title,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      subchapterId: subchapter.id,
      subchapterTitle: subchapter.title,
      title: subchapter.title,
      description: subchapter.content,
      type: subchapter.type,
      content: subchapter.content,
      fileUrl: subchapter.fileUrl,
      duration: subchapter.duration,
    };

    const exists = formData.recordingReferences.some(
      (ref) => ref.subchapterId === subchapter.id,
    );

    if (exists) {
      toaster({
        title: 'Reference Sudah Ditambahkan',
        description: 'Subchapter ini sudah ada dalam daftar referensi rekaman',
        condition: 'warning',
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      recordingReferences: [...prev.recordingReferences, newReference],
    }));

    toaster({
      title: 'Recording Reference Ditambahkan',
      description: `"${subchapter.title}" berhasil ditambahkan ke referensi rekaman`,
      condition: 'success',
    });
  };

  const removeReadingReference = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      readingReferences: prev.readingReferences.filter((ref) => ref.id !== id),
    }));
  };

  const removeRecordingReference = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      recordingReferences: prev.recordingReferences.filter(
        (ref) => ref.id !== id,
      ),
    }));
  };

  const removeReference = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      readingReferences: prev.readingReferences.filter((ref) => ref.id !== id),
      recordingReferences: prev.recordingReferences.filter(
        (ref) => ref.id !== id,
      ),
    }));
  };

  // Get filtered courses based on selected subject
  const getAvailableCourses = () => {
    if (!formData.subject) return [];
    return getCoursesBySubject(formData.subject);
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
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toaster({
        title: 'Live Class Berhasil Dibuat',
        description: `Kelas "${formData.title}" telah dibuat`,
        condition: 'success',
      });

      router.push(`/${website_sub_category_id}/admin/live-class`);
    } catch (error) {
      toaster({
        title: 'Gagal Membuat Live Class',
        description: 'Terjadi kesalahan saat menyimpan data',
        condition: 'warning',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(`/${website_sub_category_id}/admin/live-class`);
  };

  // URL Reference Functions
  const addURLReadingReference = (urlData: URLReferenceInput) => {
    const newReference: CourseReference = {
      id: `url-ref-${Date.now()}`,
      source: 'url',
      title: urlData.title,
      description: urlData.description,
      url: urlData.url,
      type: urlData.type,
      content: urlData.description,
      createdAt: new Date(),
    };

    setFormData((prev) => ({
      ...prev,
      readingReferences: [...prev.readingReferences, newReference],
    }));

    toaster({
      title: 'URL Reference Ditambahkan',
      description: `"${urlData.title}" berhasil ditambahkan ke referensi bacaan`,
      condition: 'success',
    });
  };

  const addURLRecordingReference = (urlData: URLReferenceInput) => {
    const newReference: CourseReference = {
      id: `url-ref-${Date.now()}`,
      source: 'url',
      title: urlData.title,
      description: urlData.description,
      url: urlData.url,
      type: urlData.type,
      content: urlData.description,
      createdAt: new Date(),
    };

    setFormData((prev) => ({
      ...prev,
      recordingReferences: [...prev.recordingReferences, newReference],
    }));

    toaster({
      title: 'URL Reference Ditambahkan',
      description: `"${urlData.title}" berhasil ditambahkan ke referensi rekaman`,
      condition: 'success',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
            Buat Live Class Baru
          </h1>
          <p className="text-muted-foreground">
            Isi form di bawah untuk membuat live class baru
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
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Contoh: Matematika Dasar - Aljabar Linear"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Mata Pelajaran *</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, subject: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.subject ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        key={subject}
                        value={subject}
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subject && (
                  <p className="text-sm text-red-500">{errors.subject}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Jelaskan materi yang akan dibahas dalam live class ini..."
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

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
                {mockTutorsForForm.map((tutor) => (
                  <div
                    key={tutor.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      formData.tutorId === tutor.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, tutorId: tutor.id }))
                    }
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={tutor.avatar}
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
                          {tutor.experience}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-xs text-yellow-600">
                            ⭐ {tutor.rating}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tutor.specializations.slice(0, 2).map((spec) => (
                            <Badge
                              key={spec}
                              variant="secondary"
                              className="text-xs"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.tutorId && (
                <p className="text-sm text-red-500">{errors.tutorId}</p>
              )}
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
                <Label htmlFor="scheduleDate">Tanggal *</Label>
                <Input
                  id="scheduleDate"
                  type="date"
                  value={formData.scheduleDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      scheduleDate: e.target.value,
                    }))
                  }
                  className={errors.scheduleDate ? 'border-red-500' : ''}
                />
                {errors.scheduleDate && (
                  <p className="text-sm text-red-500">{errors.scheduleDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Waktu Mulai *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  className={errors.startTime ? 'border-red-500' : ''}
                />
                {errors.startTime && (
                  <p className="text-sm text-red-500">{errors.startTime}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Waktu Selesai *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  className={errors.endTime ? 'border-red-500' : ''}
                />
                {errors.endTime && (
                  <p className="text-sm text-red-500">{errors.endTime}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Maksimal Peserta</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxParticipants: e.target.value,
                    }))
                  }
                  placeholder="Kosongkan untuk unlimited"
                  className={errors.maxParticipants ? 'border-red-500' : ''}
                />
                {errors.maxParticipants && (
                  <p className="text-sm text-red-500">
                    {errors.maxParticipants}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="meetLink">Link Meet *</Label>
                <Input
                  id="meetLink"
                  value={formData.meetLink}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      meetLink: e.target.value,
                    }))
                  }
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  className={errors.meetLink ? 'border-red-500' : ''}
                />
                {errors.meetLink && (
                  <p className="text-sm text-red-500">{errors.meetLink}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <h4 className="font-medium">Rekam Sesi</h4>
                <p className="text-sm text-gray-500">
                  Live class akan direkam untuk review nanti
                </p>
              </div>
              <Switch
                checked={formData.isRecorded}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, isRecorded: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Agenda (Optional) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Agenda Live Class (Opsional)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Buat agenda atau rundown untuk live class ini
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Daftar Agenda</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAgenda}
              >
                <FileText className="h-4 w-4 mr-2" />
                Tambah Agenda
              </Button>
            </div>

            {formData.agenda.length > 0 && (
              <div className="space-y-3">
                {formData.agenda.map((agenda, index) => (
                  <div
                    key={agenda.id}
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
                        onClick={() => removeAgenda(agenda.id)}
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
                            updateAgenda(agenda.id, 'title', e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Durasi (menit)</Label>
                        <Input
                          type="number"
                          placeholder="e.g., 10"
                          value={agenda.duration}
                          onChange={(e) =>
                            updateAgenda(agenda.id, 'duration', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Deskripsi</Label>
                      <Textarea
                        placeholder="Jelaskan aktivitas yang akan dilakukan pada agenda ini..."
                        value={agenda.description}
                        onChange={(e) =>
                          updateAgenda(agenda.id, 'description', e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.agenda.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Belum ada agenda. Klik "Tambah Agenda" untuk memulai.</p>
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
            {/* Tab-like Navigation */}
            <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-lg">
              <span className="flex-1 text-center py-2 px-3 rounded-md bg-white shadow-sm text-sm font-medium">
                📚 Dari Course
              </span>
              <span className="flex-1 text-center py-2 px-3 rounded-md text-sm text-gray-600">
                🔗 Dari URL
              </span>
            </div>

            {/* Course References Section */}
            {formData.subject ? (
              <div className="space-y-4">
                {/* Available Courses */}
                <div className="space-y-3">
                  <Label>Course yang Tersedia untuk {formData.subject}</Label>
                  {getAvailableCourses().length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>
                        Belum ada course tersedia untuk mata pelajaran{' '}
                        {formData.subject}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getAvailableCourses().map((course) => (
                        <div
                          key={course.id}
                          className="border rounded-lg p-4"
                        >
                          <h4 className="font-medium text-gray-900 mb-3">
                            {course.title}
                          </h4>
                          <div className="space-y-3">
                            {course.chapters.map((chapter) => (
                              <div
                                key={chapter.id}
                                className="ml-4"
                              >
                                <h5 className="font-medium text-sm text-gray-700 mb-2">
                                  {chapter.title}
                                </h5>
                                <div className="grid gap-2 md:grid-cols-2">
                                  {chapter.subchapters.map((subchapter) => {
                                    const isAddedReading =
                                      formData.readingReferences.some(
                                        (ref) =>
                                          ref.subchapterId === subchapter.id,
                                      );
                                    const isAddedRecording =
                                      formData.recordingReferences.some(
                                        (ref) =>
                                          ref.subchapterId === subchapter.id,
                                      );

                                    return (
                                      <div
                                        key={subchapter.id}
                                        className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                                      >
                                        <div className="flex items-start gap-3 flex-1">
                                          <div className="mt-1">
                                            {subchapter.type === 'reading' && (
                                              <FileText className="h-4 w-4 text-blue-600" />
                                            )}
                                            {subchapter.type === 'video' && (
                                              <Play className="h-4 w-4 text-green-600" />
                                            )}
                                            {subchapter.type === 'audio' && (
                                              <Volume2 className="h-4 w-4 text-purple-600" />
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <h6 className="font-medium text-sm truncate">
                                              {subchapter.title}
                                            </h6>
                                            <p className="text-xs text-gray-500 mt-1">
                                              {subchapter.content}
                                            </p>
                                            {subchapter.duration && (
                                              <p className="text-xs text-gray-400 mt-1">
                                                Durasi: {subchapter.duration}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex gap-2 ml-3">
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                              isAddedReading
                                                ? 'secondary'
                                                : 'outline'
                                            }
                                            onClick={() =>
                                              addReadingReference(
                                                subchapter,
                                                course,
                                                chapter,
                                              )
                                            }
                                            disabled={isAddedReading}
                                            className="text-xs"
                                          >
                                            <FileText className="h-3 w-3 mr-1" />
                                            {isAddedReading
                                              ? 'Bacaan ✓'
                                              : 'Bacaan'}
                                          </Button>
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant={
                                              isAddedRecording
                                                ? 'secondary'
                                                : 'outline'
                                            }
                                            onClick={() =>
                                              addRecordingReference(
                                                subchapter,
                                                course,
                                                chapter,
                                              )
                                            }
                                            disabled={isAddedRecording}
                                            className="text-xs"
                                          >
                                            <Play className="h-3 w-3 mr-1" />
                                            {isAddedRecording
                                              ? 'Rekaman ✓'
                                              : 'Rekaman'}
                                          </Button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Selected Reading References */}
                {formData.readingReferences.length > 0 && (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      Referensi Bacaan ({formData.readingReferences.length})
                    </Label>
                    <div className="space-y-2">
                      {formData.readingReferences.map((reference) => (
                        <div
                          key={reference.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-blue-50"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              {reference.type === 'reading' && (
                                <FileText className="h-4 w-4 text-blue-600" />
                              )}
                              {reference.type === 'video' && (
                                <Play className="h-4 w-4 text-green-600" />
                              )}
                              {reference.type === 'audio' && (
                                <Volume2 className="h-4 w-4 text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-sm">
                                {reference.subchapterTitle}
                              </h6>
                              <p className="text-xs text-gray-600">
                                {reference.courseTitle} →{' '}
                                {reference.chapterTitle}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {reference.content}
                              </p>
                              {reference.duration && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Durasi: {reference.duration}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => removeReadingReference(reference.id)}
                            className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Recording References */}
                {formData.recordingReferences.length > 0 && (
                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-green-600" />
                      Referensi Rekaman ({formData.recordingReferences.length})
                    </Label>
                    <div className="space-y-2">
                      {formData.recordingReferences.map((reference) => (
                        <div
                          key={reference.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-green-50"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div className="mt-1">
                              {reference.type === 'reading' && (
                                <FileText className="h-4 w-4 text-blue-600" />
                              )}
                              {reference.type === 'video' && (
                                <Play className="h-4 w-4 text-green-600" />
                              )}
                              {reference.type === 'audio' && (
                                <Volume2 className="h-4 w-4 text-purple-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-sm">
                                {reference.subchapterTitle}
                              </h6>
                              <p className="text-xs text-gray-600">
                                {reference.courseTitle} →{' '}
                                {reference.chapterTitle}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {reference.content}
                              </p>
                              {reference.duration && (
                                <p className="text-xs text-gray-400 mt-1">
                                  Durasi: {reference.duration}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              removeRecordingReference(reference.id)
                            }
                            className="ml-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

            {/* URL References Section */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">
                  References dari URL
                </Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowURLReadingForm(true)}
                    className="text-xs"
                  >
                    <Link className="h-3 w-3 mr-1" />
                    <FileText className="h-3 w-3 mr-1" />
                    Tambah URL Bacaan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowURLRecordingForm(true)}
                    className="text-xs"
                  >
                    <Link className="h-3 w-3 mr-1" />
                    <Play className="h-3 w-3 mr-1" />
                    Tambah URL Rekaman
                  </Button>
                </div>
              </div>

              {/* URL Reading Form */}
              {showURLReadingForm && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Tambah URL Bacaan
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowURLReadingForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
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
                          value={urlReadingData.type}
                          onValueChange={(value: any) =>
                            setUrlReadingData((prev) => ({
                              ...prev,
                              type: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="document">Dokumen</SelectItem>
                            <SelectItem value="reading">Artikel</SelectItem>
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
                            url: '',
                            type: 'website',
                          });
                          setShowURLReadingForm(false);
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
                            url: '',
                            type: 'website',
                          });
                          setShowURLReadingForm(false);
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* URL Recording Form */}
              {showURLRecordingForm && (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Play className="h-4 w-4 text-green-600" />
                        Tambah URL Rekaman
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowURLRecordingForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label className="text-xs">Judul *</Label>
                        <Input
                          placeholder="e.g., Video Tutorial Aljabar"
                          value={urlRecordingData.title}
                          onChange={(e) =>
                            setUrlRecordingData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Tipe</Label>
                        <Select
                          value={urlRecordingData.type}
                          onValueChange={(value: any) =>
                            setUrlRecordingData((prev) => ({
                              ...prev,
                              type: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">URL *</Label>
                      <Input
                        placeholder="https://youtube.com/watch?v=..."
                        value={urlRecordingData.url}
                        onChange={(e) =>
                          setUrlRecordingData((prev) => ({
                            ...prev,
                            url: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Deskripsi</Label>
                      <Textarea
                        placeholder="Jelaskan konten video/audio ini..."
                        value={urlRecordingData.description}
                        onChange={(e) =>
                          setUrlRecordingData((prev) => ({
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
                          if (
                            !urlRecordingData.title ||
                            !urlRecordingData.url
                          ) {
                            toaster({
                              title: 'Form Tidak Lengkap',
                              description: 'Title dan URL wajib diisi',
                              condition: 'warning',
                            });
                            return;
                          }
                          addURLRecordingReference(urlRecordingData);
                          setUrlRecordingData({
                            title: '',
                            description: '',
                            url: '',
                            type: 'video',
                          });
                          setShowURLRecordingForm(false);
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
                          setUrlRecordingData({
                            title: '',
                            description: '',
                            url: '',
                            type: 'video',
                          });
                          setShowURLRecordingForm(false);
                        }}
                      >
                        Batal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
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
            disabled={loading}
          >
            {loading ? (
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
