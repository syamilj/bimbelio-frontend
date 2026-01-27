'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck,
  Send,
  TrendingUp,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface SessionAnswer {
  number: number;
  questionId: string;
  answerId: string | null;
  answer: string;
  type: string;
  notSure: boolean;
}

const SubmitTryout = ({
  sessionAnswer,
  sessionId,
}: {
  sessionAnswer: SessionAnswer[];
  sessionId: string;
}) => {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [open, setOpen] = useState(false);
  const unAnswered = sessionAnswer?.filter((item) => item.answer === '');
  const notSure = sessionAnswer?.filter((item) => item.notSure === true);
  const answered = sessionAnswer?.filter((item) => item.answer !== '');

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  const completionPercentage = (answered.length / sessionAnswer.length) * 100;

  const FinishTryOut = async (payload: {
    userId: string;
    sessionId: string;
    answer: any[];
  }) => {
    await mutateGeneral('/tryoutSession/finishSession', {
      payload,
      type: 'post',
      toast: {
        successMsg: 'Try out berhasil dikumpulkan',
        errorMsg: 'Gagal mengumpulkan try out, coba lagi!',
      },
      onSuccess() {
        localStorage.removeItem(`sessionAnswer-${sessionId}`);
        window.location.reload();
        setLoading(false);
        setHasSubmitted(false);
        setOpen(false);
      },
      onError() {
        setLoading(false);
        setHasSubmitted(false);
      },
    });
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1);
      }, 500);
    }
  }, [open]);

  const handleSubmit = () => {
    if (loading || hasSubmitted) return;

    setLoading(true);
    setHasSubmitted(true);
    FinishTryOut({
      sessionId,
      answer: sessionAnswer,
      userId: session?.user.id || '',
    });
  };

  const getCompletionStatus = () => {
    if (completionPercentage === 100)
      return { color: '#10B981', label: 'Sempurna!' };
    if (completionPercentage >= 80)
      return { color: '#3B82F6', label: 'Sangat Baik' };
    if (completionPercentage >= 60)
      return { color: '#F59E0B', label: 'Cukup Baik' };
    return { color: '#EF4444', label: 'Perlu Ditingkatkan' };
  };

  const completionStatus = getCompletionStatus();

  return (
    <Dialog
      open={loading ? true : open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className={cn(
            'w-full h-12 rounded-3xl font-bold text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2',
            loading || hasSubmitted
              ? 'cursor-not-allowed opacity-50'
              : 'hover:shadow-xl hover:scale-105',
          )}
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
          disabled={loading || hasSubmitted}
        >
          <Send className="w-5 h-5" />
          Kumpulkan Jawaban
        </Button>
      </DialogTrigger>

      <DialogContent className="mb:max-w-md rounded-3xl max-h-[90vh] overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DialogHeader className="text-center mb-6">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${mainColor}15` }}
                >
                  <FileCheck
                    className="w-8 h-8"
                    style={{ color: mainColor }}
                  />
                </div>
                <DialogTitle className="text-xl text-center font-bold text-gray-900">
                  Kumpulkan Jawaban?
                </DialogTitle>
                <p className="text-gray-600 text-center">
                  Pastikan semua jawaban sudah benar sebelum dikumpulkan
                </p>
              </DialogHeader>

              {/* Progress Overview */}
              <Card
                className="mb-6 border-2"
                style={{ borderColor: `${mainColor}20` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Progress Pengerjaan
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: completionStatus.color }}
                    >
                      {Math.round(completionPercentage)}% -{' '}
                      {completionStatus.label}
                    </span>
                  </div>
                  <Progress
                    value={completionPercentage}
                    className="h-3 mt-2"
                    style={{ backgroundColor: '#f3f4f6' }}
                  />
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {answered.length}
                      </div>
                      <div className="text-xs text-gray-600">Terjawab</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {notSure.length}
                      </div>
                      <div className="text-xs text-gray-600">Ragu-ragu</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {unAnswered.length}
                      </div>
                      <div className="text-xs text-gray-600">Kosong</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warnings */}
              <div className="space-y-4 mb-6">
                {unAnswered?.length > 0 && (
                  <div className="p-4 bg-red-50 rounded-3xl border border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">
                          Soal belum dijawab ({unAnswered.length})
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {unAnswered.slice(0, 10).map((item, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-1 rounded-3xl bg-red-100 text-red-700 text-xs font-medium"
                            >
                              {item.number}
                            </span>
                          ))}
                          {unAnswered.length > 10 && (
                            <span className="text-red-600 text-xs">
                              +{unAnswered.length - 10} lainnya
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {notSure?.length > 0 && (
                  <div className="p-4 bg-yellow-50 rounded-3xl border border-yellow-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-1">
                          Jawaban belum yakin ({notSure.length})
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {notSure.slice(0, 10).map((item, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center px-2 py-1 rounded-3xl bg-yellow-100 text-yellow-700 text-xs font-medium"
                            >
                              {item.number}
                            </span>
                          ))}
                          {notSure.length > 10 && (
                            <span className="text-yellow-600 text-xs">
                              +{notSure.length - 10} lainnya
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {completionPercentage === 100 && (
                  <div className="p-4 bg-green-50 rounded-3xl border border-green-200">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-800 mb-1">
                          Semua soal sudah terjawab!
                        </h4>
                        <p className="text-green-700 text-sm">
                          Kamu telah menyelesaikan semua soal dalam sesi ini.
                          Siap untuk melanjutkan!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="px-6 py-3 rounded-3xl font-medium border-2"
                  style={{ borderColor: `${mainColor}30` }}
                >
                  Periksa Lagi
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-3xl font-bold text-white shadow-lg"
                  style={{ backgroundColor: mainColor }}
                >
                  Lanjutkan
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DialogHeader className="text-center mb-6">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  <Award className="w-8 h-8 text-white" />
                </div>
                <DialogTitle className="text-xl text-center font-bold text-gray-900">
                  Konfirmasi Pengumpulan
                </DialogTitle>
                <p className="text-gray-600 text-center">
                  Setelah dikumpulkan, Kamu tidak dapat mengubah jawaban lagi
                </p>
              </DialogHeader>

              {/* Final Summary */}
              <Card
                className="mb-6 border-2"
                style={{ borderColor: `${mainColor}20` }}
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="space-y-2">
                      <BookOpen
                        className="w-8 h-8 mx-auto"
                        style={{ color: mainColor }}
                      />
                      <div className="text-2xl font-bold text-gray-900">
                        {sessionAnswer.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Soal</div>
                    </div>
                    <div className="space-y-2">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-green-600" />
                      <div className="text-2xl font-bold text-green-600">
                        {answered.length}
                      </div>
                      <div className="text-sm text-gray-600">Terjawab</div>
                    </div>
                    <div className="space-y-2">
                      <AlertTriangle className="w-8 h-8 mx-auto text-yellow-600" />
                      <div className="text-2xl font-bold text-yellow-600">
                        {notSure.length}
                      </div>
                      <div className="text-sm text-gray-600">Ragu-ragu</div>
                    </div>
                    <div className="space-y-2">
                      <TrendingUp
                        className="w-8 h-8 mx-auto"
                        style={{ color: completionStatus.color }}
                      />
                      <div
                        className="text-2xl font-bold"
                        style={{ color: completionStatus.color }}
                      >
                        {Math.round(completionPercentage)}%
                      </div>
                      <div className="text-sm text-gray-600">Selesai</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Warning Message */}
              <div className="p-4 bg-orange-50 rounded-3xl border border-orange-200 mb-6">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium text-orange-800 mb-1">
                      Perhatian!
                    </h4>
                    <p className="text-orange-700 text-sm">
                      Setelah mengklik &quot;Kumpulkan Jawaban&quot;, sesi ini
                      akan berakhir dan Kamu tidak dapat mengubah jawaban lagi.
                      Pastikan Kamu sudah yakin dengan semua jawaban yang
                      dipilih.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="px-6 py-3 rounded-3xl font-medium border-2"
                  style={{ borderColor: `${mainColor}30` }}
                >
                  Kembali
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={loading || hasSubmitted}
                  className={cn(
                    'px-6 py-3 rounded-3xl font-bold text-white shadow-lg transition-all duration-300',
                    (loading || hasSubmitted) &&
                      'cursor-not-allowed opacity-50',
                  )}
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  }}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Mengumpulkan...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Kumpulkan Jawaban
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitTryout;
