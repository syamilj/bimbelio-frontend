'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { formatDateTime } from '@/lib/utils/live-class';
import { Video } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { LiveClassType } from '../detail/[classId]/page';

// Custom hook untuk countdown dengan dependency yang stabil
function useCountdown(targetDate: string | Date) {
  const [timeLeft, setTimeLeft] = useState<{
    totalMinutes: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    canJoinSoon: boolean; // 5 menit sebelum dimulai
  }>({
    totalMinutes: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: true,
    canJoinSoon: false,
  });

  // Stabilkan targetDate dengan useMemo
  const stableTargetDate = useMemo(
    () => new Date(targetDate).getTime(),
    [targetDate],
  );

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = stableTargetDate - now;

      if (difference > 0) {
        const totalMinutes = Math.floor(difference / (1000 * 60));
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        const canJoinSoon = totalMinutes <= 5; // Bisa join 5 menit sebelumnya

        setTimeLeft({
          totalMinutes,
          hours,
          minutes,
          seconds,
          isExpired: false,
          canJoinSoon,
        });
      } else {
        setTimeLeft({
          totalMinutes: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          canJoinSoon: true,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [stableTargetDate]);

  return timeLeft;
}

export function JoinLiveClassModal({
  onClose,
  liveClass,
  onSuccess,
  children,
  refetchAttendanceData,
}: {
  onClose?: () => void;
  liveClass: LiveClassType;
  onSuccess?: (message: string) => void;
  children: React.ReactNode;
  refetchAttendanceData: () => Promise<any>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [isJoining, setIsJoining] = useState(false);
  const { data: sessionData } = useSession();
  const userEmail = sessionData?.user?.email;

  // Stabilkan liveClass.startDate untuk menghindari re-render berulang
  const startDate = useMemo(
    () => liveClass?.startDate || new Date(),
    [liveClass?.startDate],
  );
  const timeLeft = useCountdown(startDate);

  if (!liveClass) return null;

  const isLive = liveClass.status === 'Sedang Berlangsung';
  const isUpcoming = liveClass.status === 'Akan Datang' && !timeLeft.isExpired;
  const canJoinNow = isLive || (isUpcoming && timeLeft.canJoinSoon);

  const { mutate: AddAttendance } = useMutation(
    '/liveClass/addLiveClassAttendance',
    'post',
    {
      payload: {
        liveClassId: liveClass.id,
        status: 'PRESENT',
        type: 'IN',
      },
      onSuccess() {
        refetchAttendanceData();
      },
    },
  );

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      if (liveClass.link) {
        await AddAttendance();
        window.open(liveClass.link, '_blank');
        if (onSuccess) onSuccess('Redirected to Meeting');
      }
      if (onClose) onClose();
    } catch (error) {
      console.error('Error redirecting to meeting:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && onClose) onClose();
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="md:max-w-md overflow-hidden border-2 border-gray-100 shadow-sm rounded-3xl">
        {/* Header */}
        <DialogHeader className="relative pb-4 border-b-2 border-gray-100 text-center">
          <div
            className="absolute inset-0 opacity-5 rounded-t-3xl"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          />
          <div className="relative z-10">
            <div className="flex justify-center mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border-2 border-gray-100"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Video
                  className="w-6 h-6"
                  style={{ color: mainColor }}
                />
              </div>
            </div>
            <DialogTitle
              className="text-xl text-center font-black"
              style={{ color: mainColor }}
            >
              {isLive ? 'Join Live Class' : 'Ready to Join'}
            </DialogTitle>
            <DialogDescription className="text-sm text-center mt-1 text-gray-500 font-medium">
              {isLive ? 'Kelas sedang berlangsung!' : 'Bergabung ke live class'}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Live Class Info */}
          <div className="text-center py-2">
            <h4 className="font-black text-gray-900 mb-2">{liveClass.title}</h4>
            <div className="text-sm text-gray-500 space-y-1 font-medium">
              <p>{formatDateTime(liveClass.startDate)}</p>
              <p>
                {liveClass.duration} menit • {liveClass.Instructor.name}
              </p>
            </div>
          </div>

          {/* Status Display */}
          {isLive && (
            <div className="p-3 bg-red-50 border-2 border-red-200 rounded-2xl text-center">
              <div className="flex justify-center items-center gap-2 text-red-600 mb-1">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                <span className="font-black">LIVE NOW</span>
              </div>
              <p className="text-sm text-red-700 font-medium">
                Kelas sedang berlangsung
              </p>
            </div>
          )}

          {/* Countdown Timer */}
          {isUpcoming && (
            <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-2xl text-center">
              <p className="text-sm font-bold text-blue-700 mb-2">
                {timeLeft.canJoinSoon
                  ? 'Dapat bergabung dalam:'
                  : 'Dimulai dalam:'}
              </p>
              <div className="flex justify-center gap-2">
                <div className="bg-white rounded-2xl px-2 py-1 shadow-sm border-2 border-gray-100">
                  <div className="text-sm font-black text-gray-900">
                    {timeLeft.hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 font-bold">jam</div>
                </div>
                <div className="bg-white rounded-2xl px-2 py-1 shadow-sm border-2 border-gray-100">
                  <div className="text-sm font-black text-gray-900">
                    {timeLeft.minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 font-bold">mnt</div>
                </div>
                <div className="bg-white rounded-2xl px-2 py-1 shadow-sm border-2 border-gray-100">
                  <div className="text-sm font-black text-gray-900">
                    {timeLeft.seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs text-gray-500 font-bold">dtk</div>
                </div>
              </div>
              {!timeLeft.canJoinSoon && (
                <p className="text-xs text-blue-600 mt-2 font-medium">
                  Tombol join akan aktif 5 menit sebelum dimulai
                </p>
              )}
            </div>
          )}

          {/* Access Info */}
          {userEmail && (
            <div className="p-3 bg-green-50 border-2 border-green-200 rounded-2xl text-center">
              <p className="text-sm font-bold text-green-800 mb-1">
                Email Terdaftar
              </p>
              <p className="text-xs text-green-700 font-medium">{userEmail}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex gap-3 pt-4 border-t-2 border-gray-100">
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              if (onClose) onClose();
            }}
            className="flex-1 rounded-2xl font-bold border-2"
          >
            Batal
          </Button>
          {liveClass.participantStatus !== 'Tidak Terdaftar' && (
            <Button
              onClick={handleJoin}
              disabled={!canJoinNow || isJoining}
              className="flex-1 rounded-2xl font-bold border-2"
            >
              {isJoining ? (
                'Bergabung...'
              ) : isLive ? (
                <>
                  <Video className="mr-2 h-4 w-4" />
                  Join Live
                </>
              ) : timeLeft.canJoinSoon ? (
                'Bergabung'
              ) : (
                'Belum Bisa Join'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
