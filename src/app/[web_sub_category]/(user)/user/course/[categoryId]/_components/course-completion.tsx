'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react';
import { useState } from 'react';

interface Props {
  courseData: {
    title: string;
    category: string;
    completionTime: number; // in minutes
    totalScore?: number;
    maxScore?: number;
    certificateUrl?: string;
  };
  onClose: () => void;
  onNextCourse?: () => void;
  onRetakeCourse?: () => void;
}

const CourseCompletion = ({
  courseData,
  onClose,
  onNextCourse,
  onRetakeCourse,
}: Props) => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [showConfetti, setShowConfetti] = useState(true);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const scorePercentage =
    courseData.totalScore && courseData.maxScore
      ? Math.round((courseData.totalScore / courseData.maxScore) * 100)
      : null;

  const getPerformanceConfig = () => {
    if (!scorePercentage) return null;

    if (scorePercentage >= 90) {
      return {
        level: 'Excellent',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        icon: <Trophy className="w-6 h-6 text-emerald-600" />,
        message: 'Luar biasa! Kamu menguasai materi dengan sempurna!',
      };
    } else if (scorePercentage >= 80) {
      return {
        level: 'Very Good',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: <Award className="w-6 h-6 text-blue-600" />,
        message: 'Bagus sekali! Kamu memahami materi dengan baik!',
      };
    } else if (scorePercentage >= 70) {
      return {
        level: 'Good',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        icon: <Star className="w-6 h-6 text-yellow-600" />,
        message: 'Tidak buruk! Masih ada ruang untuk perbaikan.',
      };
    } else {
      return {
        level: 'Need Improvement',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: <BookOpen className="w-6 h-6 text-red-600" />,
        message: 'Coba ulangi untuk pemahaman yang lebih baik.',
      };
    }
  };

  const performanceConfig = getPerformanceConfig();

  const achievements = [
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      title: 'Course Completed',
      description: 'Menyelesaikan semua materi dengan baik',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Time Efficient',
      description: `Selesai dalam ${Math.floor(courseData.completionTime / 60)} jam ${courseData.completionTime % 60} menit`,
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Knowledge Gained',
      description: 'Memperoleh pengetahuan baru yang berharga',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Confetti Animation */}
      {showConfetti && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
          onAnimationComplete={() => setShowConfetti(false)}
          className="fixed inset-0 pointer-events-none z-50"
        >
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: -10,
                rotate: 0,
                scale: 1,
              }}
              animate={{
                y: window.innerHeight + 10,
                rotate: 360,
                scale: 0,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 2,
                ease: 'easeOut',
              }}
              className="absolute w-3 h-3 rounded-full"
              style={{
                backgroundColor: i % 2 === 0 ? mainColor : secondaryColor,
              }}
            />
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="w-full max-w-2xl"
      >
        <Card
          className="border-2 rounded-3xl overflow-hidden shadow-2xl"
          style={{ borderColor: `${mainColor}20` }}
        >
          {/* Header */}
          <CardContent
            className="text-center py-12 px-8"
            style={{
              background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: mainColor }}
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              🎉 Selamat!
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 mb-2"
            >
              Kamu telah menyelesaikan course
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold mb-2"
              style={{ color: mainColor }}
            >
              {courseData.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600"
            >
              Kategori: {courseData.category}
            </motion.p>
          </CardContent>

          {/* Performance Score */}
          {performanceConfig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="px-8 py-6"
            >
              <Card
                className={cn(
                  'border-2 rounded-2xl overflow-hidden',
                  performanceConfig.bgColor,
                  performanceConfig.borderColor,
                )}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    {performanceConfig.icon}
                    <span
                      className={cn(
                        'ml-2 font-bold text-lg',
                        performanceConfig.color,
                      )}
                    >
                      {performanceConfig.level}
                    </span>
                  </div>

                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ color: mainColor }}
                  >
                    {scorePercentage}%
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    {courseData.totalScore} dari {courseData.maxScore} poin
                  </div>

                  <p className="text-sm text-gray-700">
                    {performanceConfig.message}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="px-8 py-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              Pencapaian Kamu 🏆
            </h3>

            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <div style={{ color: mainColor }}>{achievement.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="px-8 py-8 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Download Certificate */}
              {courseData.certificateUrl && (
                <Button
                  className="flex items-center gap-2 rounded-xl border-2 bg-white hover:bg-gray-50 transition-colors"
                  style={{ borderColor: mainColor, color: mainColor }}
                  variant="outline"
                >
                  <Download className="w-4 h-4" />
                  Download Sertifikat
                </Button>
              )}

              {/* Share Achievement */}
              <Button
                className="flex items-center gap-2 rounded-xl border-2 bg-white hover:bg-gray-50 transition-colors"
                style={{ borderColor: mainColor, color: mainColor }}
                variant="outline"
              >
                <Share2 className="w-4 h-4" />
                Bagikan Pencapaian
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Next Course */}
              {onNextCourse && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={onNextCourse}
                    className="w-full rounded-xl font-semibold text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Course Berikutnya
                  </Button>
                </motion.div>
              )}

              {/* Retake Course */}
              {onRetakeCourse &&
                performanceConfig &&
                scorePercentage !== null &&
                scorePercentage < 80 && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={onRetakeCourse}
                      variant="outline"
                      className="w-full rounded-xl font-semibold border-2"
                      style={{ borderColor: mainColor, color: mainColor }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Ulangi Course
                    </Button>
                  </motion.div>
                )}
            </div>

            {/* Close Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={onClose}
                variant="ghost"
                className="w-full rounded-xl text-gray-600 hover:bg-gray-100"
              >
                Kembali ke Dashboard
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default CourseCompletion;
