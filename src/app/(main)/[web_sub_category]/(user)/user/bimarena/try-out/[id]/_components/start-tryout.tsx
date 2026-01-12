'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn, getDateString } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Play,
  Shield,
  Timer,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import { TryoutDataType } from '../page';

interface Props {
  sessionData: NonNullable<TryoutDataType>['TryoutSession'];
  tryoutName: string;
  tryoutData: NonNullable<TryoutDataType>;
  currentIndexSession: number;
}

const StartTryout = ({
  currentIndexSession,
  tryoutName,
  sessionData,
  tryoutData,
}: Props) => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [loading, setLoading] = useState(false);
  const [agreedToRules, setAgreedToRules] = useState(false);

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

  const handleStart = () => {
    if (!agreedToRules) return;
    setLoading(true);
    createTryoutSessionParticipant({
      sessionId: sessionData[currentIndexSession].id,
      userId: session?.user.id || '',
    });
  };

  const currentSession = sessionData[currentIndexSession];
  const totalQuestions = sessionData.reduce(
    (acc, session) => acc + session.TryoutQuestion.length,
    0,
  );
  const totalDuration = sessionData.reduce(
    (acc, session) => acc + session.duration,
    0,
  );

  const rules = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Waktu Terbatas',
      description: `Setiap sesi memiliki waktu yang telah ditentukan dan tidak dapat diperpanjang`,
      highlight: `${currentSession?.duration} menit`,
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Tidak Boleh Curang',
      description:
        'Dilarang membuka tab lain, menggunakan bantuan, atau bekerja sama dengan orang lain',
      highlight: 'Fair Play',
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Simpan Jawaban Berkala',
      description:
        'Jawaban akan tersimpan otomatis, namun pastikan koneksi internet stabil',
      highlight: 'Auto Save',
    },
    {
      icon: <AlertCircle className="w-5 h-5" />,
      title: 'Tidak Dapat Mengulang',
      description: 'Setelah selesai, Kamu tidak dapat mengulang sesi yang sama',
      highlight: 'Final',
    },
  ];

  return (
    <div className="h-screen bg-gray-50 overflow-y-auto">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: mainColor }}
              >
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {tryoutName}
                </h1>
                <p className="text-sm text-gray-600">
                  Sesi {currentIndexSession + 1} dari {sessionData.length}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Progress</div>
              <div
                className="text-lg font-bold"
                style={{ color: mainColor }}
              >
                {currentIndexSession + 1}/{sessionData.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Session Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className="border-2 rounded-3xl overflow-hidden shadow-lg"
                style={{ borderColor: `${mainColor}20` }}
              >
                <CardHeader
                  className="text-center py-8"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
                  }}
                >
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center"
                    style={{ backgroundColor: mainColor }}
                  >
                    <Play className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {currentSession?.TryoutCategory.name}
                  </h2>
                  <p className="text-lg text-gray-600">
                    {currentSession?.name}
                  </p>
                </CardHeader>

                <CardContent className="p-8">
                  {/* Session Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="text-center">
                      <div
                        className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <BookOpen
                          className="w-6 h-6"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: mainColor }}
                      >
                        {currentSession?.TryoutQuestion.length}
                      </div>
                      <div className="text-sm text-gray-600">Soal</div>
                    </div>

                    <div className="text-center">
                      <div
                        className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <Timer
                          className="w-6 h-6"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: mainColor }}
                      >
                        {currentSession?.duration}
                      </div>
                      <div className="text-sm text-gray-600">Menit</div>
                    </div>

                    <div className="text-center">
                      <div
                        className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <Users
                          className="w-6 h-6"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: mainColor }}
                      >
                        {tryoutData.TryoutRegistration.length}
                      </div>
                      <div className="text-sm text-gray-600">Peserta</div>
                    </div>

                    <div className="text-center">
                      <div
                        className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <Calendar
                          className="w-6 h-6"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: mainColor }}
                      >
                        {getDateString(tryoutData.startDate).split(' ')[0]}
                      </div>
                      <div className="text-sm text-gray-600">Tanggal</div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-center">
                    <p className="text-gray-600 leading-relaxed">
                      Siap memulai try out? Pastikan Kamu sudah memahami semua
                      aturan dan memiliki koneksi internet yang stabil. Semoga
                      berhasil!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rules Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 rounded-3xl overflow-hidden shadow-lg border-orange-200">
                <CardHeader className="bg-orange-50 py-6">
                  <h3 className="text-xl font-bold text-orange-800 flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    Aturan dan Ketentuan
                  </h3>
                  <p className="text-orange-700 mt-2">
                    Harap baca dan pahami dengan baik sebelum memulai
                  </p>
                </CardHeader>

                <CardContent className="p-6">
                  <ScrollArea className="h-80">
                    <div className="space-y-6">
                      {rules.map((rule, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-4 p-4 rounded-3xl bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${mainColor}15` }}
                          >
                            <div style={{ color: mainColor }}>{rule.icon}</div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-bold text-gray-900">
                                {rule.title}
                              </h4>
                              <span
                                className="px-2 py-1 rounded-full text-xs font-bold text-white"
                                style={{ backgroundColor: mainColor }}
                              >
                                {rule.highlight}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {rule.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Agreement Checkbox */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="agree-rules"
                        checked={agreedToRules}
                        onCheckedChange={(checked) =>
                          setAgreedToRules(checked as boolean)
                        }
                        className="mt-1"
                      />
                      <label
                        htmlFor="agree-rules"
                        className="text-sm text-gray-700 leading-relaxed cursor-pointer"
                      >
                        Aku telah membaca dan memahami semua aturan dan
                        ketentuan try out ini. Aku setuju untuk mematuhi semua
                        aturan yang berlaku dan siap memulai try out dengan
                        sportif.
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Summary & Start Button */}
          <div className="space-y-6">
            {/* Progress Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className="border-2 rounded-3xl overflow-hidden shadow-lg"
                style={{ borderColor: `${mainColor}20` }}
              >
                <CardHeader
                  className="text-center py-6"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
                  }}
                >
                  <h3
                    className="text-lg font-bold"
                    style={{ color: mainColor }}
                  >
                    Ringkasan Try Out
                  </h3>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Sesi</span>
                      <span className="font-bold text-gray-900">
                        {sessionData.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Soal</span>
                      <span className="font-bold text-gray-900">
                        {totalQuestions}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Waktu</span>
                      <span className="font-bold text-gray-900">
                        {totalDuration} menit
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Sesi Saat Ini
                      </span>
                      <span
                        className="font-bold"
                        style={{ color: mainColor }}
                      >
                        {currentIndexSession + 1} dari {sessionData.length}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(currentIndexSession / sessionData.length) * 100}%`,
                        backgroundColor: mainColor,
                      }}
                    />
                  </div>
                  <div className="text-center text-xs text-gray-500">
                    Progress:{' '}
                    {Math.round(
                      (currentIndexSession / sessionData.length) * 100,
                    )}
                    %
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 rounded-3xl overflow-hidden shadow-lg border-green-200">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                      {agreedToRules ? (
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      ) : (
                        <AlertCircle className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {agreedToRules
                          ? 'Siap Memulai!'
                          : 'Setujui Aturan Dulu'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {agreedToRules
                          ? 'Klik tombol di bawah untuk memulai try out'
                          : 'Centang kotak persetujuan untuk melanjutkan'}
                      </p>
                    </div>

                    <motion.div
                      whileHover={agreedToRules ? { scale: 1.05 } : {}}
                      whileTap={agreedToRules ? { scale: 0.95 } : {}}
                    >
                      <Button
                        onClick={handleStart}
                        disabled={!agreedToRules || loading}
                        className={cn(
                          'w-full h-12 rounded-xl font-bold text-white shadow-lg transition-all duration-300',
                          agreedToRules
                            ? 'hover:shadow-xl'
                            : 'cursor-not-allowed opacity-50',
                        )}
                        style={{
                          backgroundColor: agreedToRules
                            ? mainColor
                            : '#9CA3AF',
                          background: agreedToRules
                            ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                            : '#9CA3AF',
                        }}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                            Memulai...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5 mr-3" />
                            Mulai Try Out
                          </>
                        )}
                      </Button>
                    </motion.div>

                    {!agreedToRules && (
                      <p className="text-xs text-red-500">
                        Kamu harus menyetujui aturan terlebih dahulu
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tips Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 rounded-3xl overflow-hidden shadow-lg border-blue-200">
                <CardHeader className="bg-blue-50 py-4">
                  <h3 className="text-lg font-bold text-blue-800">
                    💡 Tips Sukses
                  </h3>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li>• Pastikan koneksi internet stabil</li>
                    <li>• Siapkan alat tulis untuk coret-coretan</li>
                    <li>• Fokus dan jangan terburu-buru</li>
                    <li>• Baca soal dengan teliti</li>
                    <li>• Manfaatkan waktu dengan efisien</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartTryout;
