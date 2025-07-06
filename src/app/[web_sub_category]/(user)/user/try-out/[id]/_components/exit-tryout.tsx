'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Save,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { SetStateAction } from 'react';

interface ExitTryoutProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
  done: boolean;
  timeRemaining?: string;
  answeredQuestions?: number;
  totalQuestions?: number;
}

const ExitTryout: React.FC<ExitTryoutProps> = ({
  open,
  setOpen,
  done,
  timeRemaining = '0:00',
  answeredQuestions = 0,
  totalQuestions = 0,
}) => {
  const router = useRouter();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const completionPercentage =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  const handleExit = () => {
    router.push(`/${website_sub_category_id}/user/try-out`);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent className="max-w-md mx-4 rounded-3xl border-0 shadow-2xl">
        <DialogTitle className="sr-only">
          {done ? 'Keluar Try Out' : 'Yakin Ingin Keluar?'}
        </DialogTitle>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6"
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-lg ${
                done ? 'bg-green-100' : 'bg-orange-100'
              }`}
            >
              {done ? (
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-orange-600" />
              )}
            </motion.div>

            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                {done ? 'Keluar Try Out' : 'Yakin Ingin Keluar?'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 text-base leading-relaxed">
                {done
                  ? 'Try out sudah selesai. Kamu bisa keluar sekarang.'
                  : 'Try out belum selesai. Pastikan progress kamu sudah tersimpan.'}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Progress Section - Only show if not done */}
          {!done && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div
                className="p-6 rounded-2xl border-2 space-y-4"
                style={{
                  borderColor: `${mainColor}20`,
                  backgroundColor: `${mainColor}05`,
                }}
              >
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Save
                    className="w-5 h-5"
                    style={{ color: mainColor }}
                  />
                  Status Progress
                </h4>

                {/* Progress Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <div
                      className="text-2xl font-bold mb-1"
                      style={{ color: mainColor }}
                    >
                      {answeredQuestions}
                    </div>
                    <div className="text-sm text-gray-600">Terjawab</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                    <div className="text-2xl font-bold mb-1 text-orange-600">
                      {totalQuestions - answeredQuestions}
                    </div>
                    <div className="text-sm text-gray-600">Tersisa</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span
                      className="font-bold"
                      style={{ color: mainColor }}
                    >
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${completionPercentage}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: mainColor }}
                    />
                  </div>
                </div>

                {/* Time Remaining */}
                <div className="flex items-center justify-center gap-2 p-3 bg-white rounded-xl shadow-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Sisa waktu:</span>
                  <span className="font-mono font-bold text-orange-600">
                    {timeRemaining}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Warning Message - Only show if not done */}
          {!done && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-red-800 mb-1">Perhatian!</h5>
                    <p className="text-red-700 text-sm leading-relaxed">
                      <span className="font-medium">
                        Waktu akan tetap berjalan
                      </span>{' '}
                      meski kamu keluar. Progress jawaban sudah tersimpan
                      otomatis, jadi kamu bisa melanjutkan nanti.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-4"
          >
            <Button
              variant="outline"
              onClick={handleCancel}
              className="h-12 rounded-xl border-2 font-bold text-gray-700 hover:bg-gray-50 transition-all duration-300"
              style={{ borderColor: `${mainColor}30` }}
            >
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>

            <Button
              onClick={handleExit}
              className="h-12 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300"
              style={{
                background: done
                  ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                  : 'linear-gradient(135deg, #EF4444, #DC2626)',
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {done ? 'Keluar' : 'Keluar Try Out'}
            </Button>
          </motion.div>

          {/* Footer Note */}
          {!done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-xs text-gray-500">
                💡 Tip: Kamu bisa melanjutkan try out kapan saja sebelum waktu
                habis
              </p>
            </motion.div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitTryout;
