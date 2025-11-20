'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent } from '@/components/ui/card';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Coffee,
  Play,
  Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { TryoutDataType } from '../page';

interface Props {
  sessionData: NonNullable<TryoutDataType>['TryoutSession'];
  tryoutName: string;
  restTime: number;
  currentIndexSession: number;
}

const RestTime = ({
  currentIndexSession,
  tryoutName,
  sessionData,
  restTime,
}: Props) => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [timeLeft, setTimeLeft] = useState(restTime * 60); // Convert minutes to seconds
  const [loading, setLoading] = useState(false);

  const createTryoutSessionParticipant = async (payload: {
    sessionId: string;
    userId: string;
  }) => {
    await mutateGeneral('/tryoutSession/createTryoutSessionParticipant', {
      payload,
      type: 'post',
      toast: {
        errorTitle: 'Gagal Memulai Sesi',
        errorMsg: 'Silahkan ulangi',
      },
      onSuccess() {
        window.location.reload();
      },
      onError() {
        setLoading(false);
      },
    });
  };

  const handleContinue = () => {
    setLoading(true);
    createTryoutSessionParticipant({
      sessionId: sessionData[currentIndexSession].id,
      userId: session?.user.id || '',
    });
  };

  const handleContinueDebounced = useDebouncedCallback(() => {
    handleContinue();
  }, 200);

  useEffect(() => {
    if (restTime === 0) {
      handleContinueDebounced();
    }
  }, [restTime, currentIndexSession, sessionData, session]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const nextSession = sessionData[currentIndexSession];
  const completedSessions = sessionData.slice(0, currentIndexSession);
  const remainingSessions = sessionData.slice(currentIndexSession);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-6xl px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: mainColor }}
          >
            Waktu Istirahat
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Gunakan waktu ini untuk istirahat sejenak sebelum melanjutkan ke
            sesi berikutnya
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card
              className="border-2 rounded-3xl overflow-hidden shadow-xl"
              style={{ borderColor: `${mainColor}20` }}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Waktu Istirahat Tersisa
                  </h2>

                  {/* Countdown Display */}
                  <div
                    className="w-fit px-4 h-32 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl font-mono font-bold text-white shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    {formatTime(timeLeft)}
                  </div>

                  {/* Progress Ring */}
                  <div className="relative w-48 h-48 mx-auto mb-6">
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
                        strokeWidth="4"
                        fill="none"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke={mainColor}
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / (restTime * 60))}`}
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Clock
                        className="w-12 h-12"
                        style={{ color: mainColor }}
                      />
                    </div>
                  </div>
                </div>

                {/* Skip Button */}
                <motion.button
                  onClick={handleContinue}
                  disabled={loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center gap-2 mx-auto"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Memulai...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Lanjutkan Sekarang
                    </>
                  )}
                </motion.button>

                <p className="text-sm text-gray-500 mt-4">
                  Atau tunggu hingga waktu istirahat selesai
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Next Session Info */}
            <Card
              className="border-2 rounded-2xl overflow-hidden shadow-lg"
              style={{ borderColor: `${secondaryColor}20` }}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowRight
                    className="w-5 h-5"
                    style={{ color: secondaryColor }}
                  />
                  Sesi Berikutnya
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {nextSession?.TryoutCategory.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {nextSession?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {nextSession?.duration} menit
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="w-4 h-4" />
                        {nextSession?.TryoutQuestion?.length || 0} soal
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Overview */}
            <Card
              className="border-2 rounded-2xl overflow-hidden shadow-lg"
              style={{ borderColor: `${mainColor}20` }}
            >
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users
                    className="w-5 h-5"
                    style={{ color: mainColor }}
                  />
                  Progress Try Out
                </h3>

                <div className="space-y-4">
                  {/* Completed Sessions */}
                  {completedSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-xl"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-green-800">
                          {session.TryoutSubCategory.name}
                        </h4>
                        <p className="text-sm text-green-600">Selesai</p>
                      </div>
                    </div>
                  ))}

                  {/* Current Session */}
                  <div
                    className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ backgroundColor: `${mainColor}08` }}
                  >
                    <Coffee
                      className="w-5 h-5"
                      style={{ color: mainColor }}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Istirahat</h4>
                      <p className="text-sm text-gray-600">
                        Sedang berlangsung
                      </p>
                    </div>
                  </div>

                  {/* Upcoming Sessions */}
                  {remainingSessions.map((session, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-600">
                          {session.TryoutSubCategory.name}
                        </h4>
                        <p className="text-sm text-gray-500">Menunggu</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress Keseluruhan</span>
                    <span>
                      {Math.round(
                        (currentIndexSession / sessionData.length) * 100,
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(currentIndexSession / sessionData.length) * 100}%`,
                        backgroundColor: mainColor,
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-2 rounded-2xl overflow-hidden shadow-lg border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-yellow-800 mb-4">
                  💡 Tips Istirahat
                </h3>
                <ul className="space-y-2 text-sm text-yellow-700">
                  <li>• Minum air putih untuk menjaga hidrasi</li>
                  <li>• Tarik napas dalam-dalam untuk relaksasi</li>
                  <li>• Istirahatkan mata dari layar sejenak</li>
                  <li>• Regangkan badan untuk mengurangi ketegangan</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RestTime;
