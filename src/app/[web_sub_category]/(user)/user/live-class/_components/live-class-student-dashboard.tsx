'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  formatDateTime,
  formatDuration,
  getStatusColor,
  getStatusText,
  getSubjectList,
  MockLiveClass,
  mockLiveClasses,
  mockLiveClassParticipants,
} from '@/lib/mock-data/live-class';
import {
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Search,
  Star,
  Users,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { JoinLiveClassModal } from './join-live-class-modal';
import { LiveClassNotifications } from './live-class-notifications';
import { RatingModal } from './rating-modal';
import { RegisterLiveClassModal } from './register-live-class-modal';
import { UpcomingLiveClasses } from './upcoming-live-classes';

interface StudentEnrollment {
  liveClassId: string;
  enrolledAt: Date;
  status: 'enrolled' | 'completed' | 'missed';
  rating?: number;
  review?: string;
}

// Mock user ID dan email untuk demo
const CURRENT_USER_ID = 'user2'; // Changed to user2 untuk demo yang lebih baik
const CURRENT_USER_EMAIL = 'siti.nurhaliza@student.bimbelio.com'; // Mock email from user login

// Helper function untuk get participant status
const getParticipantStatus = (
  liveClassId: string,
  userId: string = CURRENT_USER_ID,
) => {
  const participant = mockLiveClassParticipants.find(
    (p) => p.liveClassId === liveClassId && p.userId === userId,
  );
  return participant?.status || null;
};

// Helper function untuk check if user has registered
const isUserRegistered = (
  liveClassId: string,
  userId: string = CURRENT_USER_ID,
) => {
  return mockLiveClassParticipants.some(
    (p) => p.liveClassId === liveClassId && p.userId === userId,
  );
};

// Mock data untuk enrollment student (akan diganti dengan participant data)
const mockStudentEnrollments: StudentEnrollment[] = [
  {
    liveClassId: '1',
    enrolledAt: new Date('2025-01-10T10:00:00'),
    status: 'enrolled',
  },
  {
    liveClassId: '2',
    enrolledAt: new Date('2025-01-11T09:00:00'),
    status: 'enrolled',
  },
  {
    liveClassId: '4',
    enrolledAt: new Date('2025-01-08T14:00:00'),
    status: 'completed',
    rating: 5,
    review: 'Penjelasan sangat detail dan mudah dipahami!',
  },
];

export function LiveClassStudentDashboard() {
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    liveClass: MockLiveClass | null;
  }>({ isOpen: false, liveClass: null });
  const [registerModal, setRegisterModal] = useState<{
    isOpen: boolean;
    liveClass: MockLiveClass | null;
  }>({ isOpen: false, liveClass: null });
  const [joinModal, setJoinModal] = useState<{
    isOpen: boolean;
    liveClass: MockLiveClass | null;
  }>({ isOpen: false, liveClass: null });

  // Get subjects for filter
  const subjects = getSubjectList();

  // Get enrolled live classes - berdasarkan participant data
  const enrolledLiveClassIds = mockLiveClassParticipants
    .filter((p) => p.userId === CURRENT_USER_ID)
    .map((p) => p.liveClassId);
  const enrolledLiveClasses = mockLiveClasses.filter((lc) =>
    enrolledLiveClassIds.includes(lc.id),
  );

  // Get available live classes (not enrolled yet)
  const availableLiveClasses = mockLiveClasses.filter(
    (lc) => !enrolledLiveClassIds.includes(lc.id) && lc.status !== 'CANCELLED',
  );

  // Filter functions
  const filterLiveClasses = (classes: MockLiveClass[]) => {
    return classes.filter((liveClass) => {
      const matchesSearch =
        liveClass.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        liveClass.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        liveClass.tutorName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject =
        selectedSubject === 'all' || liveClass.subject === selectedSubject;
      const matchesStatus =
        selectedStatus === 'all' || liveClass.status === selectedStatus;

      return matchesSearch && matchesSubject && matchesStatus;
    });
  };

  const filteredAvailable = filterLiveClasses(availableLiveClasses);
  const filteredEnrolled = filterLiveClasses(enrolledLiveClasses);

  const getEnrollmentInfo = (liveClassId: string) => {
    return mockStudentEnrollments.find((e) => e.liveClassId === liveClassId);
  };

  const handleEnroll = (liveClass: MockLiveClass) => {
    // Open register modal instead of direct enrollment
    setRegisterModal({ isOpen: true, liveClass });
  };

  const handleJoinClass = (liveClass: MockLiveClass) => {
    // Open join modal instead of direct redirect
    setJoinModal({ isOpen: true, liveClass });
  };

  const canJoinClass = (liveClass: MockLiveClass) => {
    const userStatus = getParticipantStatus(liveClass.id);
    return (
      liveClass.status === 'ONGOING' &&
      (userStatus === 'invited' || userStatus === 'registered')
    );
  };

  const canEnroll = (liveClass: MockLiveClass) => {
    return (
      liveClass.status === 'SCHEDULED' &&
      !isUserRegistered(liveClass.id) &&
      (!liveClass.maxParticipants ||
        liveClass.currentParticipants < liveClass.maxParticipants)
    );
  };

  const getParticipantInfo = (liveClassId: string) => {
    return mockLiveClassParticipants.find(
      (p) => p.liveClassId === liveClassId && p.userId === CURRENT_USER_ID,
    );
  };

  const handleRatingSubmit = async (rating: number, review: string) => {
    if (!ratingModal.liveClass) return;

    // TODO: Implement actual API call to submit rating
    console.log('Submitting rating:', {
      liveClassId: ratingModal.liveClass.id,
      rating,
      review,
    });

    // For now, just show success message
    alert(`Rating ${rating} bintang berhasil dikirim!`);

    // Update local mock data (in real app, this would be handled by API response)
    const existingEnrollment = mockStudentEnrollments.find(
      (e) => e.liveClassId === ratingModal.liveClass!.id,
    );
    if (existingEnrollment) {
      existingEnrollment.rating = rating;
      existingEnrollment.review = review;
    }
  };

  const openRatingModal = (liveClass: MockLiveClass) => {
    setRatingModal({ isOpen: true, liveClass });
  };

  const closeRatingModal = () => {
    setRatingModal({ isOpen: false, liveClass: null });
  };

  const closeRegisterModal = () => {
    setRegisterModal({ isOpen: false, liveClass: null });
  };

  const closeJoinModal = () => {
    setJoinModal({ isOpen: false, liveClass: null });
  };

  const handleRegisterSuccess = (email: string) => {
    // Modal akan otomatis close, dan kita bisa refresh atau update state
    setRegisterModal({ isOpen: false, liveClass: null });
    console.log('User registered with email:', email);
    // Dalam implementasi nyata, ini akan trigger refresh data
  };

  const handleJoinSuccess = (email: string) => {
    // Modal akan otomatis close setelah redirect
    setJoinModal({ isOpen: false, liveClass: null });
    console.log('User joined with email:', email);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Class</h1>
          <p className="text-muted-foreground">
            Ikuti kelas langsung dengan tutor ahli
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LiveClassNotifications />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kelas Diikuti</p>
                <p className="text-2xl font-bold">
                  {enrolledLiveClasses.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kelas Selesai</p>
                <p className="text-2xl font-bold">
                  {
                    mockStudentEnrollments.filter(
                      (e) => e.status === 'completed',
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Rating Rata-rata
                </p>
                <p className="text-2xl font-bold">
                  {mockStudentEnrollments
                    .filter((e) => e.rating)
                    .reduce((acc, e) => acc + (e.rating || 0), 0) /
                    mockStudentEnrollments.filter((e) => e.rating).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-1">
          <UpcomingLiveClasses />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari kelas, tutor, atau mata pelajaran..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Mata Pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Mata Pelajaran</SelectItem>
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

            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="SCHEDULED">Terjadwal</SelectItem>
                <SelectItem value="ONGOING">Berlangsung</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="available">
            Kelas Tersedia ({filteredAvailable.length})
          </TabsTrigger>
          <TabsTrigger value="enrolled">
            Kelas Saya ({filteredEnrolled.length})
          </TabsTrigger>
        </TabsList>

        {/* Available Classes Tab */}
        <TabsContent
          value="available"
          className="space-y-4"
        >
          {filteredAvailable.length > 0 ? (
            <div className="grid gap-4">
              {filteredAvailable.map((liveClass) => (
                <Card
                  key={liveClass.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Main Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">
                              {liveClass.title}
                            </h3>
                            <p className="text-gray-600 mb-3">
                              {liveClass.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDateTime(liveClass.scheduleDate)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDuration(liveClass.duration)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {liveClass.currentParticipants}
                                {liveClass.maxParticipants &&
                                  `/${liveClass.maxParticipants}`}{' '}
                                peserta
                              </div>
                            </div>
                          </div>

                          <Badge className={getStatusColor(liveClass.status)}>
                            {getStatusText(liveClass.status)}
                          </Badge>
                        </div>

                        {/* Tutor Info */}
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={liveClass.tutorAvatar} />
                            <AvatarFallback>
                              {liveClass.tutorName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{liveClass.tutorName}</p>
                            <p className="text-sm text-gray-500">
                              {liveClass.subject}
                            </p>
                          </div>
                        </div>

                        {/* References Preview */}
                        {(liveClass.readingReferences.length > 0 ||
                          liveClass.recordingReferences.length > 0) && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">
                              Materi Referensi:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {liveClass.readingReferences
                                .slice(0, 2)
                                .map((ref) => (
                                  <Badge
                                    key={ref.id}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    <BookOpen className="h-3 w-3 mr-1" />
                                    {ref.title}
                                  </Badge>
                                ))}
                              {liveClass.recordingReferences
                                .slice(0, 2)
                                .map((ref) => (
                                  <Badge
                                    key={ref.id}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    <Video className="h-3 w-3 mr-1" />
                                    {ref.title}
                                  </Badge>
                                ))}
                              {liveClass.readingReferences.length +
                                liveClass.recordingReferences.length >
                                4 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                >
                                  +
                                  {liveClass.readingReferences.length +
                                    liveClass.recordingReferences.length -
                                    4}{' '}
                                  lainnya
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 lg:w-48">
                        {canEnroll(liveClass) && (
                          <Button
                            onClick={() => handleEnroll(liveClass)}
                            className="w-full"
                          >
                            Daftar Kelas
                          </Button>
                        )}

                        {isUserRegistered(liveClass.id) && (
                          <Button
                            disabled
                            className="w-full"
                          >
                            Sudah Terdaftar
                          </Button>
                        )}

                        {!canEnroll(liveClass) &&
                          !isUserRegistered(liveClass.id) &&
                          liveClass.status === 'SCHEDULED' && (
                            <Button
                              disabled
                              className="w-full"
                            >
                              Kelas Penuh
                            </Button>
                          )}

                        <Button
                          variant="outline"
                          className="w-full"
                        >
                          <Link
                            href={`/${website_sub_category_id}/user/live-class/${liveClass.id}`}
                          >
                            Lihat Detail
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  Tidak ada kelas tersedia
                </h3>
                <p className="text-gray-500">
                  Coba ubah filter pencarian atau kembali lagi nanti
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Enrolled Classes Tab */}
        <TabsContent
          value="enrolled"
          className="space-y-4"
        >
          {filteredEnrolled.length > 0 ? (
            <div className="grid gap-4">
              {filteredEnrolled.map((liveClass) => {
                const enrollment = getEnrollmentInfo(liveClass.id);
                const participant = getParticipantInfo(liveClass.id);
                return (
                  <Card
                    key={liveClass.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Main Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2">
                                {liveClass.title}
                              </h3>
                              <p className="text-gray-600 mb-3">
                                {liveClass.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {formatDateTime(liveClass.scheduleDate)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {formatDuration(liveClass.duration)}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col gap-2">
                              <Badge
                                className={getStatusColor(liveClass.status)}
                              >
                                {getStatusText(liveClass.status)}
                              </Badge>
                              {participant && (
                                <Badge variant="outline">
                                  {participant.status === 'registered' &&
                                    'Terdaftar'}
                                  {participant.status === 'invited' &&
                                    'Diundang'}
                                  {participant.status === 'expired' &&
                                    'Kedaluwarsa'}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Tutor Info */}
                          <div className="flex items-center gap-3 mb-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={liveClass.tutorAvatar} />
                              <AvatarFallback>
                                {liveClass.tutorName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {liveClass.tutorName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {liveClass.subject}
                              </p>
                            </div>
                          </div>

                          {/* Rating & Review */}
                          {enrollment?.rating && (
                            <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < enrollment.rating!
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm font-medium">
                                  Rating Anda
                                </span>
                              </div>
                              {enrollment.review && (
                                <p className="text-sm text-gray-600">
                                  "{enrollment.review}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 lg:w-48">
                          {canJoinClass(liveClass) && (
                            <Button
                              onClick={() => handleJoinClass(liveClass)}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Join Kelas
                            </Button>
                          )}

                          {participant?.status === 'registered' &&
                            liveClass.status === 'SCHEDULED' && (
                              <Button
                                disabled
                                className="w-full"
                              >
                                Menunggu Undangan
                              </Button>
                            )}

                          <Button
                            variant="outline"
                            className="w-full"
                          >
                            <Link
                              href={`/${website_sub_category_id}/user/live-class/${liveClass.id}`}
                            >
                              Lihat Materi
                            </Link>
                          </Button>

                          {liveClass.status === 'COMPLETED' &&
                            !enrollment?.rating && (
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => openRatingModal(liveClass)}
                              >
                                Beri Rating
                              </Button>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">
                  Belum ada kelas yang diikuti
                </h3>
                <p className="text-gray-500 mb-4">
                  Daftar ke kelas yang tersedia untuk mulai belajar
                </p>
                <Button onClick={() => setActiveTab('available')}>
                  Lihat Kelas Tersedia
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Rating Modal */}
      {ratingModal.liveClass && (
        <RatingModal
          isOpen={ratingModal.isOpen}
          onClose={closeRatingModal}
          liveClass={ratingModal.liveClass}
          onSubmit={handleRatingSubmit}
        />
      )}

      {/* Register Modal */}
      {registerModal.liveClass && (
        <RegisterLiveClassModal
          isOpen={registerModal.isOpen}
          onClose={closeRegisterModal}
          liveClass={registerModal.liveClass}
          userEmail={CURRENT_USER_EMAIL}
          onRegister={handleRegisterSuccess}
        />
      )}

      {/* Join Modal */}
      {joinModal.liveClass && (
        <JoinLiveClassModal
          isOpen={joinModal.isOpen}
          onClose={closeJoinModal}
          liveClass={joinModal.liveClass}
          userEmail={CURRENT_USER_EMAIL}
          onJoin={handleJoinSuccess}
        />
      )}
    </div>
  );
}
