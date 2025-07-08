'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  mockLiveClasses,
  MockTutor,
  mockTutors,
} from '@/lib/mock-data/live-class';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Mail,
  Phone,
  Star,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TutorDetailProps {
  tutorId: string;
}

export function TutorDetail({ tutorId }: TutorDetailProps) {
  const router = useRouter();
  const [tutor, setTutor] = useState<MockTutor | null>(null);

  useEffect(() => {
    const foundTutor = mockTutors.find((t) => t.id === tutorId);
    setTutor(foundTutor || null);
  }, [tutorId]);

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
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p>Tutor tidak ditemukan</p>
        </div>
      </div>
    );
  }

  // Get tutor's live classes
  const tutorClasses = mockLiveClasses.filter(
    (liveClass) => liveClass.tutorId === tutor.id,
  );
  const upcomingClasses = tutorClasses.filter(
    (liveClass) => liveClass.status === 'SCHEDULED',
  );
  const completedClasses = tutorClasses.filter(
    (liveClass) => liveClass.status === 'COMPLETED',
  );

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={i}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star
          key="half"
          className="h-4 w-4 fill-yellow-400/50 text-yellow-400"
        />,
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="h-4 w-4 text-gray-300"
        />,
      );
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
            <h1 className="text-2xl font-bold text-gray-900">Detail Tutor</h1>
            <p className="text-gray-600">
              Informasi lengkap dan performa tutor
            </p>
          </div>
        </div>
        <Button asChild>
          <Link
            href={`/${website_sub_category_id}/admin/tutors/edit/${tutor.id}`}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Tutor
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tutor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src={tutor.avatar}
                      alt={tutor.fullName}
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(tutor.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {tutor.fullName}
                    </h2>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">
                        {renderStarRating(tutor.rating)}
                      </div>
                      <span className="text-sm font-medium">
                        {tutor.rating.toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        • {tutor.totalClasses} kelas
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{tutor.email}</span>
                    </div>
                    {tutor.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{tutor.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Bio</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {tutor.bio}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">
                      Mata Pelajaran
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                        >
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Classes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Kelas Live Class
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tutorClasses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Belum ada kelas yang dijadwalkan</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tutorClasses.slice(0, 5).map((liveClass) => (
                    <div
                      key={liveClass.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {liveClass.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {liveClass.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {liveClass.scheduleDate.toLocaleDateString('id-ID')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {liveClass.startTime} - {liveClass.endTime}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {liveClass.currentParticipants}/
                            {liveClass.maxParticipants || '∞'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            liveClass.status === 'COMPLETED'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            liveClass.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : liveClass.status === 'SCHEDULED'
                                ? 'bg-blue-100 text-blue-800'
                                : liveClass.status === 'ONGOING'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                          }
                        >
                          {liveClass.status === 'SCHEDULED' && 'Terjadwal'}
                          {liveClass.status === 'ONGOING' && 'Berlangsung'}
                          {liveClass.status === 'COMPLETED' && 'Selesai'}
                          {liveClass.status === 'CANCELLED' && 'Dibatalkan'}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {tutorClasses.length > 5 && (
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                      >
                        Lihat Semua Kelas ({tutorClasses.length})
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${tutor.isActive ? 'bg-green-100' : 'bg-gray-100'}`}
                >
                  <CheckCircle
                    className={`h-4 w-4 ${tutor.isActive ? 'text-green-600' : 'text-gray-400'}`}
                  />
                </div>
                <div>
                  <p className="font-medium">
                    {tutor.isActive ? 'Aktif' : 'Tidak Aktif'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {tutor.isActive
                      ? 'Dapat mengajar live class'
                      : 'Tidak dapat mengajar live class'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Total Kelas</span>
                </div>
                <span className="font-medium">{tutor.totalClasses}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Kelas Mendatang</span>
                </div>
                <span className="font-medium">{upcomingClasses.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Kelas Selesai</span>
                </div>
                <span className="font-medium">{completedClasses.length}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Rating</span>
                </div>
                <span className="font-medium">
                  {tutor.rating.toFixed(1)}/5.0
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link
                  href={`/${website_sub_category_id}/admin/tutors/edit/${tutor.id}`}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Informasi
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link
                  href={`/${website_sub_category_id}/admin/live-class/new?tutorId=${tutor.id}`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Buat Live Class
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
