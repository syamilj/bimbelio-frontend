'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { toaster } from '@/components/ui/toaster';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { motion } from 'framer-motion';
import { Clock, Coffee, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const timeFormat = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time - minutes * 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function CountDownRestTime({
  seconds,
  sessionId,
}: {
  seconds: number;
  sessionId: string;
}) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [countdown, setCountdown] = useState<number>(seconds);
  const [execute, setExecute] = useState<boolean>(false);
  const [isBlinking, setIsBlinking] = useState<boolean>(false);
  const timerId = useRef<any>(null);

  const createTryoutSessionParticipant = async (payload: {
    sessionId: string;
    userId: string;
  }) => {
    await mutateGeneral('/tryoutSession/createTryoutSessionParticipant', {
      payload,
      type: 'post',
      toast: {
        errorMsg: 'Gagal memulai sesi berikutnya',
        errorTitle: 'Error',
      },
      onSuccess() {
        window.location.reload();
      },
    });
  };

  useEffect(() => {
    timerId.current = setInterval(() => {
      setCountdown((prev: number) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId.current);
  }, []);

  useEffect(() => {
    // Start blinking when less than 30 seconds
    if (countdown <= 30 && countdown > 0) {
      setIsBlinking(true);
    } else {
      setIsBlinking(false);
    }

    if (countdown <= 0) {
      clearInterval(timerId.current);
      toaster({
        title: 'Waktu Istirahat Selesai!',
        description: 'Melanjutkan ke sesi berikutnya...',
        condition: 'warning',
        duration: 3000,
      });
      setExecute(true);
    }
  }, [countdown]);

  useEffect(() => {
    if (execute) {
      createTryoutSessionParticipant({
        sessionId: sessionId,
        userId: session?.user.id || '',
      });
    }
  }, [execute]);

  const getTimeStatus = () => {
    const percentage = (countdown / seconds) * 100;
    if (percentage > 50) {
      return {
        color: 'text-green-600',
        bgColor: 'from-green-500 to-emerald-600',
        status: 'Santai',
        icon: <Coffee className="w-6 h-6" />,
      };
    }
    if (percentage > 25) {
      return {
        color: 'text-yellow-600',
        bgColor: 'from-yellow-500 to-orange-600',
        status: 'Bersiap',
        icon: <Clock className="w-6 h-6" />,
      };
    }
    return {
      color: 'text-red-600',
      bgColor: 'from-red-500 to-pink-600',
      status: 'Segera Dimulai',
      icon: <Play className="w-6 h-6" />,
    };
  };

  const timeStatus = getTimeStatus();
  const progressPercentage = ((seconds - countdown) / seconds) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            ...(isBlinking && { scale: [1, 1.05, 1] }),
          }}
          transition={{
            duration: 0.5,
            ...(isBlinking && { repeat: Infinity, duration: 1 }),
          }}
          className="text-center space-y-8"
        >
          {/* Main Timer Display */}
          <div className="relative">
            {/* Background Circle */}
            <div className="w-48 h-48 mx-auto relative">
              <svg
                className="w-48 h-48 transform -rotate-90"
                viewBox="0 0 100 100"
              >
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#e5e7eb"
                  strokeWidth="6"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={mainColor}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              {/* Timer Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  {timeStatus.icon}
                </div>

                <div
                  className={`text-3xl font-mono font-bold ${timeStatus.color} ${isBlinking ? 'animate-pulse' : ''}`}
                >
                  {timeFormat(countdown)}
                </div>

                <div className="text-sm text-gray-600 mt-1">
                  {timeStatus.status}
                </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-2xl shadow-lg border-2"
            style={{ borderColor: `${mainColor}20` }}
          >
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">
                Waktu Istirahat
              </h3>

              <p className="text-gray-600">
                Gunakan waktu ini untuk istirahat sejenak sebelum melanjutkan ke
                sesi berikutnya.
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-1000"
                    style={{
                      width: `${progressPercentage}%`,
                      backgroundColor: mainColor,
                    }}
                  />
                </div>
              </div>

              {/* Time Breakdown */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: mainColor }}
                  >
                    {Math.floor(countdown / 60)}
                  </div>
                  <div className="text-sm text-gray-600">Menit</div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: secondaryColor }}
                  >
                    {countdown % 60}
                  </div>
                  <div className="text-sm text-gray-600">Detik</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-50 rounded-2xl border border-blue-200"
          >
            <h4 className="font-medium text-blue-800 mb-2">
              💡 Tips Istirahat:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Minum air putih untuk menjaga hidrasi</li>
              <li>• Tarik napas dalam-dalam untuk relaksasi</li>
              <li>• Istirahatkan mata dari layar sejenak</li>
            </ul>
          </motion.div>

          {/* Auto-start Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-sm text-gray-500">
              Sesi berikutnya akan dimulai otomatis setelah waktu selesai
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
