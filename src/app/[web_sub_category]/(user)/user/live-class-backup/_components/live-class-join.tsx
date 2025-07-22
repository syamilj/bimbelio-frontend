'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import {
  formatDateTime,
  getStatusColor,
  getStatusText,
  mockLiveClasses,
  mockLiveClassParticipants,
} from '@/lib/mock-data/live-class';
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  Mic,
  MicOff,
  Users,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { JoinLiveClassModal } from './join-live-class-modal';

interface LiveClassJoinProps {
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

// Mock enrolled classes - berdasarkan participant data
const mockStudentEnrollments = mockLiveClassParticipants
  .filter((p) => p.userId === CURRENT_USER_ID)
  .map((p) => p.liveClassId);

export function LiveClassJoin({ classId }: LiveClassJoinProps) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [mediaPermissions, setMediaPermissions] = useState({
    camera: false,
    microphone: false,
    speaker: true,
  });
  const [deviceTest, setDeviceTest] = useState({
    camera: 'pending' as 'pending' | 'success' | 'error',
    microphone: 'pending' as 'pending' | 'success' | 'error',
    speaker: 'pending' as 'pending' | 'success' | 'error',
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdown, setCountdown] = useState(0);
  const [showJoinModal, setShowJoinModal] = useState(false);

  // Find the live class
  const liveClass = mockLiveClasses.find((lc) => lc.id === classId);
  const isEnrolled = isUserRegistered(classId);
  const participantStatus = getParticipantStatus(classId);

  useEffect(() => {
    // Test device permissions
    const testDevices = async () => {
      try {
        // Test camera
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setMediaPermissions((prev) => ({ ...prev, camera: true }));
        setDeviceTest((prev) => ({ ...prev, camera: 'success' }));
        videoStream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        setDeviceTest((prev) => ({ ...prev, camera: 'error' }));
      }

      try {
        // Test microphone
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setMediaPermissions((prev) => ({ ...prev, microphone: true }));
        setDeviceTest((prev) => ({ ...prev, microphone: 'success' }));
        audioStream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        setDeviceTest((prev) => ({ ...prev, microphone: 'error' }));
      }

      // Test speaker (assume available)
      setDeviceTest((prev) => ({ ...prev, speaker: 'success' }));
    };

    testDevices();
  }, []);

  // Timer for countdown and current time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (liveClass) {
        const diff = liveClass.scheduleDate.getTime() - now.getTime();
        setCountdown(Math.max(0, Math.floor(diff / 1000)));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [liveClass]);

  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
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

  // Check if user can join based on participant status
  const canJoin = () => {
    return (
      isEnrolled &&
      (participantStatus === 'invited' || participantStatus === 'registered') &&
      (liveClass?.status === 'ONGOING' || liveClass?.status === 'SCHEDULED')
    );
  };

  if (!canJoin() && participantStatus === 'registered') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Clock className="h-16 w-16 text-amber-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Menunggu Undangan
          </h3>
          <p className="text-gray-500 mb-4">
            Anda sudah terdaftar dalam kelas ini. Tunggu undangan Google Meet
            dari admin.
          </p>
          <Button
            onClick={() =>
              router.push(
                `/${website_sub_category_id}/user/live-class/${classId}`,
              )
            }
          >
            Lihat Detail Kelas
          </Button>
        </div>
      </div>
    );
  }

  if (participantStatus === 'expired') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Undangan Kedaluwarsa
          </h3>
          <p className="text-gray-500 mb-4">
            Undangan untuk kelas ini sudah kedaluwarsa. Silakan hubungi admin.
          </p>
          <Button
            onClick={() =>
              router.push(
                `/${website_sub_category_id}/user/live-class/${classId}`,
              )
            }
          >
            Lihat Detail Kelas
          </Button>
        </div>
      </div>
    );
  }

  if (liveClass.status !== 'ONGOING') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Kelas Belum Dimulai
          </h3>
          <p className="text-gray-500 mb-4">
            Kelas ini akan dimulai pada {formatDateTime(liveClass.scheduleDate)}
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  `/${website_sub_category_id}/user/live-class/${classId}`,
                )
              }
            >
              Lihat Detail
            </Button>
            <Button
              onClick={() =>
                router.push(`/${website_sub_category_id}/user/live-class`)
              }
            >
              Kembali ke Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleJoinClass = () => {
    // Open join modal instead of direct window.open
    setShowJoinModal(true);
  };

  const handleJoinSuccess = (email: string) => {
    setShowJoinModal(false);
  };

  const handleJoinModalClose = () => {
    setShowJoinModal(false);
  };

  const getDeviceStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'error':
        return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      default:
        return (
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
        );
    }
  };

  const getDeviceStatusText = (status: string) => {
    switch (status) {
      case 'success':
        return 'Tersedia';
      case 'error':
        return 'Tidak tersedia';
      default:
        return 'Mengecek...';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
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

        {/* Live Class Info */}
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-green-800">LIVE</span>
              </div>
              <Badge className={getStatusColor(liveClass.status)}>
                {getStatusText(liveClass.status)}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold mb-2">{liveClass.title}</h1>
            <p className="text-gray-600 mb-4">{liveClass.description}</p>

            {/* Countdown Display */}
            {countdown > 0 && (
              <div className="mb-4 p-4 bg-white rounded-lg border border-blue-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Kelas sedang berlangsung:
                  </p>
                  <div className="text-3xl font-bold text-blue-600 font-mono">
                    {formatCountdown(countdown)}
                  </div>
                </div>
              </div>
            )}

            {/* Current Time Display */}
            <div className="mb-4 p-3 bg-white rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600">Waktu saat ini:</p>
                <p className="text-lg font-semibold">
                  {currentTime.toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDateTime(liveClass.scheduleDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>
                  {liveClass.startTime} - {liveClass.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{liveClass.currentParticipants} peserta</span>
              </div>
            </div>

            {/* Tutor Info */}
            <div className="flex items-center gap-3 mt-4 p-3 bg-white rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarImage src={liveClass.tutorAvatar} />
                <AvatarFallback>
                  {liveClass.tutorName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{liveClass.tutorName}</p>
                <p className="text-sm text-gray-600">{liveClass.subject}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Device Check */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Pemeriksaan Perangkat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {mediaPermissions.camera ? (
                    <Video className="h-5 w-5 text-green-600" />
                  ) : (
                    <VideoOff className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">Kamera</p>
                    <p className="text-sm text-gray-500">
                      {getDeviceStatusText(deviceTest.camera)}
                    </p>
                  </div>
                </div>
                {getDeviceStatusIcon(deviceTest.camera)}
              </div>

              {/* Microphone */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {mediaPermissions.microphone ? (
                    <Mic className="h-5 w-5 text-green-600" />
                  ) : (
                    <MicOff className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">Mikrofon</p>
                    <p className="text-sm text-gray-500">
                      {getDeviceStatusText(deviceTest.microphone)}
                    </p>
                  </div>
                </div>
                {getDeviceStatusIcon(deviceTest.microphone)}
              </div>

              {/* Speaker */}
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {mediaPermissions.speaker ? (
                    <Volume2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <VolumeX className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="font-medium">Speaker</p>
                    <p className="text-sm text-gray-500">
                      {getDeviceStatusText(deviceTest.speaker)}
                    </p>
                  </div>
                </div>
                {getDeviceStatusIcon(deviceTest.speaker)}
              </div>

              {(deviceTest.camera === 'error' ||
                deviceTest.microphone === 'error') && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-sm text-amber-800">
                    <strong>Catatan:</strong> Beberapa perangkat tidak tersedia.
                    Anda masih bisa join kelas tetapi interaksi mungkin
                    terbatas.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pre-Join Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Panduan Join Kelas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    1
                  </div>
                  <p className="text-sm">Pastikan koneksi internet stabil</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    2
                  </div>
                  <p className="text-sm">Siapkan alat tulis untuk mencatat</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    3
                  </div>
                  <p className="text-sm">Mute mikrofon saat tidak berbicara</p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    4
                  </div>
                  <p className="text-sm">Gunakan chat untuk bertanya</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tips:</strong> Join kelas 5-10 menit sebelum dimulai
                  untuk memastikan tidak ada masalah teknis.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Join Button */}
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Siap untuk bergabung?
                </h3>
                <p className="text-gray-600">
                  Klik tombol di bawah untuk join live class sekarang
                </p>
              </div>

              <Button
                onClick={handleJoinClass}
                disabled={isJoining}
                size="lg"
                className="w-full max-w-md bg-green-600 hover:bg-green-700"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Join Live Class
              </Button>

              <p className="text-xs text-gray-500">
                Akan membuka tab baru untuk bergabung dengan kelas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <JoinLiveClassModal
          isOpen={showJoinModal}
          onClose={handleJoinModalClose}
          liveClass={liveClass}
          userEmail={CURRENT_USER_EMAIL}
          onJoin={handleJoinSuccess}
        />
      )}
    </div>
  );
}
