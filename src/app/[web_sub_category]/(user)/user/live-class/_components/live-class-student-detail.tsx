'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  formatDateTime,
  formatDuration,
  getStatusColor,
  getStatusText,
  MockLiveClass,
  mockLiveClasses,
  mockLiveClassParticipants,
} from '@/lib/mock-data/live-class';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Play,
  Star,
  Users,
  Video,
  Volume2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { JoinLiveClassModal } from './join-live-class-modal';
import { RatingModal } from './rating-modal';
import { RegisterLiveClassModal } from './register-live-class-modal';

interface LiveClassStudentDetailProps {
  classId: string;
}

// Mock user ID dan email untuk demo
const CURRENT_USER_ID = 'user2'; // Changed to user2 untuk demo yang lebih baik
const CURRENT_USER_EMAIL = 'siti.nurhaliza@student.bimbelio.com'; // Mock email from user login

// Helper functions
const getParticipantStatus = (
  liveClassId: string,
  userId: string = CURRENT_USER_ID,
) => {
  const participant = mockLiveClassParticipants.find(
    (p) => p.liveClassId === liveClassId && p.userId === userId,
  );
  return participant?.status || null;
};

const isUserRegistered = (
  liveClassId: string,
  userId: string = CURRENT_USER_ID,
) => {
  return mockLiveClassParticipants.some(
    (p) => p.liveClassId === liveClassId && p.userId === userId,
  );
};

const getParticipantInfo = (
  liveClassId: string,
  userId: string = CURRENT_USER_ID,
) => {
  return mockLiveClassParticipants.find(
    (p) => p.liveClassId === liveClassId && p.userId === userId,
  );
};

// Mock enrollment status (akan diganti dengan participant data)
const mockStudentEnrollments = ['1', '2', '4']; // IDs of enrolled classes

export function LiveClassStudentDetail({
  classId,
}: LiveClassStudentDetailProps) {
  const router = useRouter();
  const [isEnrolling, setIsEnrolling] = useState(false);
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

  // Find the live class
  const liveClass = mockLiveClasses.find((lc) => lc.id === classId);
  const isEnrolled = isUserRegistered(classId);
  const participantInfo = getParticipantInfo(classId);
  const participantStatus = getParticipantStatus(classId);

  if (!liveClass) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Live Class Tidak Ditemukan
          </h3>
          <p className="text-gray-500 mb-4">
            Live class dengan ID "{classId}" tidak ditemukan.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const canEnroll = () => {
    return (
      !isEnrolled &&
      liveClass.status === 'SCHEDULED' &&
      (!liveClass.maxParticipants ||
        liveClass.currentParticipants < liveClass.maxParticipants)
    );
  };

  const canJoin = () => {
    return (
      isEnrolled &&
      liveClass.status === 'ONGOING' &&
      (participantStatus === 'invited' || participantStatus === 'registered')
    );
  };

  const handleEnroll = () => {
    // Open register modal instead of direct enrollment
    setRegisterModal({ isOpen: true, liveClass });
  };

  const handleJoinClass = () => {
    // Open join modal instead of direct window.open
    setJoinModal({ isOpen: true, liveClass });
  };

  const handleDownloadReference = (reference: any) => {
    if (reference.source === 'url') {
      window.open(reference.url, '_blank');
    } else if (reference.fileUrl) {
      // TODO: Implement file download
      window.open(reference.fileUrl, '_blank');
    }
  };

  const handleRatingSubmit = async (rating: number, review: string) => {
    if (!ratingModal.liveClass) return;

    // TODO: Implement actual API call to submit rating
    console.log('Submitting rating:', {
      liveClassId: ratingModal.liveClass.id,
      rating,
      review,
    });

    // Show success message
    toaster({
      title: 'Rating Berhasil Dikirim!',
      description: `Terima kasih atas rating ${rating} bintang untuk kelas "${ratingModal.liveClass.title}"`,
      condition: 'success',
    });
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
    setRegisterModal({ isOpen: false, liveClass: null });
    console.log('User registered with email:', email);
    // Dalam implementasi nyata, ini akan trigger refresh data
  };

  const handleJoinSuccess = (email: string) => {
    setJoinModal({ isOpen: false, liveClass: null });
    console.log('User joined with email:', email);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            router.push(`/${website_sub_category_id}/user/live-class`)
          }
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              {/* Title and Status */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">{liveClass.title}</h1>
                    <Badge className={getStatusColor(liveClass.status)}>
                      {getStatusText(liveClass.status)}
                    </Badge>
                  </div>
                  <p className="text-lg text-gray-600 mb-4">
                    {liveClass.description}
                  </p>

                  {/* Meta Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDateTime(liveClass.scheduleDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {liveClass.startTime} - {liveClass.endTime} (
                        {formatDuration(liveClass.duration)})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>
                        {liveClass.currentParticipants}
                        {liveClass.maxParticipants &&
                          `/${liveClass.maxParticipants}`}{' '}
                        peserta
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tutor Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={liveClass.tutorAvatar} />
                  <AvatarFallback className="text-lg">
                    {liveClass.tutorName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {liveClass.tutorName}
                  </h3>
                  <p className="text-gray-600">{liveClass.subject}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">
                      4.8 (45 ulasan)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Panel */}
            <div className="lg:w-80">
              <Card className="sticky top-4">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Enrollment Status */}
                    {isEnrolled && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          <span className="font-medium">
                            {participantStatus === 'registered' &&
                              'Anda terdaftar dalam kelas ini'}
                            {participantStatus === 'invited' &&
                              'Anda telah diundang ke kelas ini'}
                            {participantStatus === 'expired' &&
                              'Undangan telah kedaluwarsa'}
                          </span>
                        </div>
                        {participantStatus === 'registered' && (
                          <p className="text-sm text-green-600 mt-1">
                            Tunggu undangan Google Meet dari admin
                          </p>
                        )}
                      </div>
                    )}

                    {/* Main Action Button */}
                    {canJoin() && (
                      <Button
                        onClick={handleJoinClass}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <ExternalLink className="h-5 w-5 mr-2" />
                        Join Kelas Sekarang
                      </Button>
                    )}

                    {canEnroll() && (
                      <Button
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                        className="w-full"
                        size="lg"
                      >
                        {isEnrolling ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Mendaftar...
                          </>
                        ) : (
                          'Daftar Kelas'
                        )}
                      </Button>
                    )}

                    {isEnrolled &&
                      participantStatus === 'registered' &&
                      liveClass.status === 'SCHEDULED' && (
                        <Button
                          disabled
                          className="w-full"
                          size="lg"
                        >
                          Menunggu Undangan
                        </Button>
                      )}

                    {!canEnroll() &&
                      !isEnrolled &&
                      liveClass.status === 'SCHEDULED' && (
                        <Button
                          disabled
                          className="w-full"
                          size="lg"
                        >
                          Kelas Penuh
                        </Button>
                      )}

                    {liveClass.status === 'COMPLETED' && isEnrolled && (
                      <Button
                        variant="outline"
                        className="w-full"
                        size="lg"
                        onClick={() => openRatingModal(liveClass)}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Beri Rating
                      </Button>
                    )}

                    {liveClass.status === 'CANCELLED' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                        <span className="text-red-700 font-medium">
                          Kelas Dibatalkan
                        </span>
                      </div>
                    )}

                    {/* Additional Info */}
                    <Separator />

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Mata Pelajaran:</span>
                        <span className="font-medium">{liveClass.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Durasi:</span>
                        <span className="font-medium">
                          {formatDuration(liveClass.duration)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Rekaman:</span>
                        <span className="font-medium">
                          {liveClass.isRecorded ? 'Tersedia' : 'Tidak tersedia'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs
        defaultValue="agenda"
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="materials">Materi Referensi</TabsTrigger>
          <TabsTrigger value="info">Info Tambahan</TabsTrigger>
        </TabsList>

        {/* Agenda Tab */}
        <TabsContent value="agenda">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Agenda Kelas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {liveClass.agenda.length > 0 ? (
                <div className="space-y-4">
                  {liveClass.agenda
                    .sort((a, b) => a.order - b.order)
                    .map((item, index) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 border rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.title}</h4>
                          <p className="text-gray-600 mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>{item.duration} menit</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Agenda belum tersedia untuk kelas ini</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Materials Tab */}
        <TabsContent value="materials">
          <div className="space-y-4">
            {/* Reading References */}
            {liveClass.readingReferences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Referensi Bacaan ({liveClass.readingReferences.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {liveClass.readingReferences.map((reference) => (
                      <div
                        key={reference.id}
                        className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {reference.source === 'url' ? (
                            <LinkIcon className="h-5 w-5 text-blue-600" />
                          ) : (
                            <FileText className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium mb-1">
                            {reference.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {reference.description}
                          </p>
                          {reference.source === 'subchapter' && (
                            <p className="text-xs text-gray-500">
                              {reference.courseTitle} → {reference.chapterTitle}
                            </p>
                          )}
                          {reference.source === 'url' && (
                            <p className="text-xs text-blue-600 truncate">
                              {reference.url}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReference(reference)}
                          disabled={!isEnrolled}
                        >
                          {reference.source === 'url' ? (
                            <ExternalLink className="h-4 w-4" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recording References */}
            {liveClass.recordingReferences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Referensi Video/Audio (
                    {liveClass.recordingReferences.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {liveClass.recordingReferences.map((reference) => (
                      <div
                        key={reference.id}
                        className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {reference.type === 'audio' ? (
                            <Volume2 className="h-5 w-5 text-purple-600" />
                          ) : reference.source === 'url' ? (
                            <LinkIcon className="h-5 w-5 text-green-600" />
                          ) : (
                            <Play className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium mb-1">
                            {reference.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {reference.description}
                          </p>
                          {reference.duration && (
                            <p className="text-xs text-gray-500 mb-1">
                              Durasi: {reference.duration}
                            </p>
                          )}
                          {reference.source === 'subchapter' && (
                            <p className="text-xs text-gray-500">
                              {reference.courseTitle} → {reference.chapterTitle}
                            </p>
                          )}
                          {reference.source === 'url' && (
                            <p className="text-xs text-green-600 truncate">
                              {reference.url}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadReference(reference)}
                          disabled={!isEnrolled}
                        >
                          {reference.source === 'url' ? (
                            <ExternalLink className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {liveClass.readingReferences.length === 0 &&
              liveClass.recordingReferences.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">
                      Belum ada materi referensi
                    </h3>
                    <p className="text-gray-500">
                      Materi referensi akan ditambahkan sebelum kelas dimulai
                    </p>
                  </CardContent>
                </Card>
              )}

            {!isEnrolled &&
              (liveClass.readingReferences.length > 0 ||
                liveClass.recordingReferences.length > 0) && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <p className="text-amber-800">
                        Daftar kelas terlebih dahulu untuk mengakses materi
                        referensi
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </TabsContent>

        {/* Additional Info Tab */}
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Tambahan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Prerequisites */}
              <div>
                <h4 className="font-semibold mb-2">Prasyarat</h4>
                <p className="text-gray-600">
                  Pemahaman dasar tentang {liveClass.subject.toLowerCase()} dan
                  konsep-konsep fundamental
                </p>
              </div>

              {/* What You'll Learn */}
              <div>
                <h4 className="font-semibold mb-2">Yang Akan Dipelajari</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Konsep dasar dan fundamental</li>
                  <li>Penerapan dalam soal-soal</li>
                  <li>Tips dan trik untuk ujian</li>
                  <li>Sesi tanya jawab interaktif</li>
                </ul>
              </div>

              {/* Technical Requirements */}
              <div>
                <h4 className="font-semibold mb-2">Kebutuhan Teknis</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Koneksi internet yang stabil</li>
                  <li>Browser web modern (Chrome, Firefox, Safari)</li>
                  <li>Microphone dan camera (opsional)</li>
                  <li>Notebook untuk mencatat</li>
                </ul>
              </div>

              {/* Class Rules */}
              <div>
                <h4 className="font-semibold mb-2">Aturan Kelas</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Hadir tepat waktu</li>
                  <li>Aktif berpartisipasi dalam diskusi</li>
                  <li>Mute microphone saat tidak berbicara</li>
                  <li>Gunakan chat untuk bertanya</li>
                </ul>
              </div>
            </CardContent>
          </Card>
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
