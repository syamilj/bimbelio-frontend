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
  LiveClassStatus,
  MockLiveClass,
  mockLiveClasses,
  mockTutorsForForm,
  URLReferenceInput,
} from '@/lib/mock-data/live-class';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Calendar,
  FileText,
  Link,
  Play,
  Save,
  Users,
  Volume2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EditFormData {
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
  status: LiveClassStatus;
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

interface EditLiveClassFormProps {
  classId: string;
}

export function EditLiveClassForm({ classId }: EditLiveClassFormProps) {
  const router = useRouter();

  const [liveClass, setLiveClass] = useState<MockLiveClass | null>(null);
  const [formData, setFormData] = useState<EditFormData>({
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
    status: 'SCHEDULED',
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

  const statusOptions: {
    value: LiveClassStatus;
    label: string;
    color: string;
  }[] = [
    {
      value: 'SCHEDULED',
      label: 'Terjadwal',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      value: 'ONGOING',
      label: 'Sedang Berlangsung',
      color: 'bg-green-100 text-green-700',
    },
    {
      value: 'COMPLETED',
      label: 'Selesai',
      color: 'bg-gray-100 text-gray-700',
    },
    {
      value: 'CANCELLED',
      label: 'Dibatalkan',
      color: 'bg-red-100 text-red-700',
    },
  ];

  useEffect(() => {
    // Load existing live class data
    const existingClass = mockLiveClasses.find((c) => c.id === classId);
    if (existingClass) {
      setLiveClass(existingClass);

      // Convert to form format
      const scheduleDate = existingClass.scheduleDate
        .toISOString()
        .split('T')[0];

      setFormData({
        title: existingClass.title,
        description: existingClass.description,
        subject: existingClass.subject,
        tutorId: existingClass.tutorId,
        scheduleDate,
        startTime: existingClass.startTime,
        endTime: existingClass.endTime,
        maxParticipants: existingClass.maxParticipants?.toString() || '',
        meetLink: existingClass.meetLink,
        isRecorded: existingClass.isRecorded,
        status: existingClass.status,
        agenda: existingClass.agenda.map((a) => ({
          id: a.id,
          title: a.title,
          description: a.description,
          duration: a.duration.toString(),
        })),
        readingReferences: existingClass.readingReferences || [],
        recordingReferences: existingClass.recordingReferences || [],
      });
    }
  }, [classId]);

  // const selectedTutor = mockTutorsForForm.find(
  //   (t) => t.id === formData.tutorId,
  // );

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

    // Validate date not in past (only if status is SCHEDULED)
    if (formData.status === 'SCHEDULED' && formData.scheduleDate) {
      const selectedDate = new Date(formData.scheduleDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.scheduleDate =
          'Tanggal tidak boleh di masa lalu untuk kelas terjadwal';
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

    // Reset form and hide
    setUrlReadingData({
      title: '',
      description: '',
      url: '',
      type: 'website',
    });
    setShowURLReadingForm(false);

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

    // Reset form and hide
    setUrlRecordingData({
      title: '',
      description: '',
      url: '',
      type: 'video',
    });
    setShowURLRecordingForm(false);

    toaster({
      title: 'URL Reference Ditambahkan',
      description: `"${urlData.title}" berhasil ditambahkan ke referensi rekaman`,
      condition: 'success',
    });
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
        title: 'Live Class Berhasil Diperbarui',
        description: `Kelas "${formData.title}" telah diperbarui`,
        condition: 'success',
      });

      router.push(`/${website_sub_category_id}/admin/live-class`);
    } catch (error) {
      toaster({
        title: 'Gagal Memperbarui Live Class',
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

  if (!liveClass) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Live Class Tidak Ditemukan
          </h3>
          <p className="text-gray-500 mb-4">
            Live class dengan ID &quot;{classId}&quot; tidak ditemukan.
          </p>
          <Button onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </Button>
        </div>
      </div>
    );
  }

  const canEditSchedule = liveClass.status === 'SCHEDULED';
  const canEditStatus = true; // Admin can change status

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
          <h1 className="text-3xl font-bold tracking-tight">Edit Live Class</h1>
          <p className="text-muted-foreground">Edit informasi live class</p>
        </div>
      </div>

      {/* Status Alert */}
      {!canEditSchedule && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Perhatian</h4>
                <p className="text-sm text-yellow-700">
                  Live class ini sudah{' '}
                  {liveClass.status === 'ONGOING' ? 'berlangsung' : 'selesai'}.
                  Beberapa field tidak dapat diubah.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Status */}
        {canEditStatus && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-blue-500" />
                Status Kelas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Status Saat Ini</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: LiveClassStatus) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger className="w-full md:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2 py-1 rounded text-xs font-medium ${option.color}`}
                          >
                            {option.label}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

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
              Tutor
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
                  disabled={!canEditSchedule}
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
                  disabled={!canEditSchedule}
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
                  disabled={!canEditSchedule}
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

        {/* Agenda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Agenda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {formData.agenda.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={`agenda-title-${item.id}`}>
                        Judul Agenda
                      </Label>
                      <Input
                        id={`agenda-title-${item.id}`}
                        value={item.title}
                        onChange={(e) =>
                          updateAgenda(item.id, 'title', e.target.value)
                        }
                        placeholder="Contoh: Pengenalan Aljabar"
                        className="mt-1"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeAgenda(item.id)}
                    >
                      <span className="sr-only">Hapus Agenda</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor={`agenda-description-${item.id}`}>
                        Deskripsi
                      </Label>
                      <Textarea
                        id={`agenda-description-${item.id}`}
                        value={item.description}
                        onChange={(e) =>
                          updateAgenda(item.id, 'description', e.target.value)
                        }
                        placeholder="Jelaskan tujuan dan materi agenda ini"
                        rows={2}
                        className="mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`agenda-duration-${item.id}`}>
                        Durasi (menit)
                      </Label>
                      <Input
                        id={`agenda-duration-${item.id}`}
                        type="number"
                        min="1"
                        value={item.duration}
                        onChange={(e) =>
                          updateAgenda(item.id, 'duration', e.target.value)
                        }
                        placeholder="Contoh: 60"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                className="w-full"
                onClick={addAgenda}
              >
                Tambah Agenda
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Course References (Optional) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              References dari Course (Opsional)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Pilih bacaan atau rekaman dari subchapter course yang relevan
              dengan live class ini
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.subject ? (
              <div className="space-y-4">
                {/* Course Selection */}
                <div className="space-y-3">
                  <Label>Pilih Course dan Subchapter</Label>
                  {getAvailableCourses().length > 0 ? (
                    <div className="space-y-4">
                      {getAvailableCourses().map((course) => (
                        <div
                          key={course.id}
                          className="border rounded-lg p-4 space-y-3"
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
                  ) : null}
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
          </CardContent>
        </Card>

        {/* URL References */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              References dari URL (Opsional)
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Tambahkan referensi bacaan atau rekaman dari URL eksternal
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">URL References</Label>
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
                        onValueChange={(value) =>
                          setUrlReadingData((prev) => ({
                            ...prev,
                            type: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="document">Dokumen</SelectItem>
                          <SelectItem value="article">Artikel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">URL *</Label>
                    <Input
                      type="url"
                      placeholder="https://example.com/resource"
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
                      placeholder="Jelaskan isi dari URL ini..."
                      rows={2}
                      value={urlReadingData.description}
                      onChange={(e) =>
                        setUrlReadingData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowURLReadingForm(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addURLReadingReference(urlReadingData)}
                      disabled={!urlReadingData.title || !urlReadingData.url}
                    >
                      Tambah Reference
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
                        placeholder="e.g., Tutorial Video Matematika"
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
                        onValueChange={(value) =>
                          setUrlRecordingData((prev) => ({
                            ...prev,
                            type: value as any,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="webinar">Webinar</SelectItem>
                          <SelectItem value="recording">Recording</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">URL *</Label>
                    <Input
                      type="url"
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
                      placeholder="Jelaskan isi dari URL ini..."
                      rows={2}
                      value={urlRecordingData.description}
                      onChange={(e) =>
                        setUrlRecordingData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowURLRecordingForm(false)}
                    >
                      Batal
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => addURLRecordingReference(urlRecordingData)}
                      disabled={
                        !urlRecordingData.title || !urlRecordingData.url
                      }
                    >
                      Tambah Reference
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Display added URL references */}
            {(formData.readingReferences.filter((ref) => ref.source === 'url')
              .length > 0 ||
              formData.recordingReferences.filter((ref) => ref.source === 'url')
                .length > 0) && (
              <div className="space-y-3">
                {/* URL Reading References */}
                {formData.readingReferences.filter(
                  (ref) => ref.source === 'url',
                ).length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-blue-700 mb-2 block">
                      URL References - Bacaan (
                      {
                        formData.readingReferences.filter(
                          (ref) => ref.source === 'url',
                        ).length
                      }
                      )
                    </Label>
                    <div className="space-y-2">
                      {formData.readingReferences
                        .filter((ref) => ref.source === 'url')
                        .map((reference) => (
                          <div
                            key={reference.id}
                            className="flex items-start gap-3 p-3 border rounded-lg bg-blue-50"
                          >
                            <Link className="h-4 w-4 text-blue-600 mt-1" />
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-sm">
                                {reference.title}
                              </h6>
                              <p className="text-xs text-blue-600 truncate">
                                {reference.url}
                              </p>
                              {reference.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {reference.description}
                                </p>
                              )}
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full mt-1 inline-block">
                                {reference.type}
                              </span>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                removeReadingReference(reference.id)
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

                {/* URL Recording References */}
                {formData.recordingReferences.filter(
                  (ref) => ref.source === 'url',
                ).length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-green-700 mb-2 block">
                      URL References - Rekaman (
                      {
                        formData.recordingReferences.filter(
                          (ref) => ref.source === 'url',
                        ).length
                      }
                      )
                    </Label>
                    <div className="space-y-2">
                      {formData.recordingReferences
                        .filter((ref) => ref.source === 'url')
                        .map((reference) => (
                          <div
                            key={reference.id}
                            className="flex items-start gap-3 p-3 border rounded-lg bg-green-50"
                          >
                            <Link className="h-4 w-4 text-green-600 mt-1" />
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-sm">
                                {reference.title}
                              </h6>
                              <p className="text-xs text-green-600 truncate">
                                {reference.url}
                              </p>
                              {reference.description && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {reference.description}
                                </p>
                              )}
                              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full mt-1 inline-block">
                                {reference.type}
                              </span>
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
            )}
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
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
