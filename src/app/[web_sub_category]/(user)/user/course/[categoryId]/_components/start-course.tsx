'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  FileText,
  Lightbulb,
  Play,
  Target,
  Trophy,
  Users,
  Video,
} from 'lucide-react';
import { useState } from 'react';

interface SubChapter {
  id: string;
  title: string;
  type: 'TRYOUT' | 'VIDEO' | 'DOCUMENT' | 'MATERI' | 'PROGRESS_TEST';
  spendTime: number;
  number: number;
  premium: boolean;
  description: string;
  img?: string | null;
}

interface Chapter {
  id: string;
  title: string;
  number: number;
  subChapters: SubChapter[];
}

interface Props {
  courseData: {
    id: string;
    title: string;
    description: string;
    totalChapters: number;
    totalSubChapters: number;
    estimatedDuration: number;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    category: string;
    enrolledCount?: number;
    chapters?: Chapter[];
  };
  onStart: () => void;
}

const StartCourse = ({ courseData, onStart }: Props) => {
  // const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [loading, setLoading] = useState(false);
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);

  // Function to get icon and color based on material type
  const getTypeConfig = (type: SubChapter['type']) => {
    switch (type) {
      case 'VIDEO':
        return {
          icon: <Video className="w-4 h-4" />,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          label: 'Video',
        };
      case 'DOCUMENT':
        return {
          icon: <FileText className="w-4 h-4" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          label: 'Dokumen',
        };
      case 'TRYOUT':
        return {
          icon: <Trophy className="w-4 h-4" />,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          label: 'Quiz',
        };
      case 'PROGRESS_TEST':
        return {
          icon: <Trophy className="w-4 h-4" />,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          label: 'Uji Progress',
        };
      case 'MATERI':
        return {
          icon: <BookOpen className="w-4 h-4" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          label: 'Materi',
        };
      default:
        return {
          icon: <FileText className="w-4 h-4" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          label: 'Konten',
        };
    }
  };

  const handleStart = async () => {
    if (!agreedToGuidelines) return;
    setLoading(true);

    try {
      await onStart();
    } catch (error) {
      console.error('Failed to start course:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return {
          label: 'Pemula',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        };
      case 'INTERMEDIATE':
        return {
          label: 'Menengah',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
        };
      case 'ADVANCED':
        return {
          label: 'Lanjutan',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
        };
      default:
        return {
          label: 'Umum',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
        };
    }
  };

  const levelConfig = getLevelConfig(courseData.level);

  const learningTips = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Belajar Sesuai Tempo',
      description:
        'Tidak ada batasan waktu, belajar sesuai kecepatan Kamu sendiri',
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Ikuti Urutan Materi',
      description:
        'Materi disusun sistematis dari dasar hingga mahir untuk hasil optimal',
    },
    {
      icon: <Lightbulb className="w-5 h-5" />,
      title: 'Praktikkan Langsung',
      description:
        'Gunakan fitur quiz dan latihan untuk memahami materi dengan lebih baik',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Diskusi & Bertanya',
      description: 'Jangan ragu bertanya jika ada materi yang kurang dipahami',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        {/* Simple Header Only */}
        <div className="text-center mb-6 md:mb-8">
          <div
            className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 rounded-xl flex items-center justify-center shadow-md"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 px-4">
            {courseData.title}
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-xs md:text-sm px-4">
            {courseData.description}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
          {/* MAIN FEATURE: Course Structure - Takes up 2/3 of the space */}
          {courseData.chapters && courseData.chapters.length > 0 && (
            <div className="xl:col-span-2 order-1">
              <Card className="bg-white shadow-xl border-0 rounded-2xl md:rounded-3xl overflow-hidden">
                <CardHeader
                  className="pb-3 md:pb-4 text-center px-3 md:px-6"
                  style={{
                    background: `linear-gradient(135deg, ${mainColor}10, ${secondaryColor}10)`,
                    borderBottom: `2px solid ${mainColor}20`,
                  }}
                >
                  <CardTitle
                    className="text-base md:text-xl font-bold flex items-center justify-center gap-2 md:gap-3"
                    style={{ color: mainColor }}
                  >
                    <BookOpen className="w-4 h-4 md:w-6 md:h-6" />
                    <span className="text-center">Roadmap Pembelajaran</span>
                  </CardTitle>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Jelajahi perjalanan pembelajaran Kamu step by step
                  </p>

                  {/* Quick Stats inside roadmap */}
                  <div className="grid grid-cols-4 gap-2 md:gap-4 mt-3 md:mt-4">
                    <div className="text-center bg-white rounded-lg p-2 md:p-3 shadow-sm">
                      <div className="text-sm md:text-lg font-bold text-gray-900">
                        {courseData.totalChapters}
                      </div>
                      <div className="text-xs text-gray-600">Bab</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-2 md:p-3 shadow-sm">
                      <div className="text-sm md:text-lg font-bold text-gray-900">
                        {courseData.totalSubChapters}
                      </div>
                      <div className="text-xs text-gray-600">Materi</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-2 md:p-3 shadow-sm">
                      <div className="text-sm md:text-lg font-bold text-gray-900">
                        {Math.ceil(courseData.estimatedDuration / 60)}h
                      </div>
                      <div className="text-xs text-gray-600">Durasi</div>
                    </div>
                    <div className="text-center bg-white rounded-lg p-2 md:p-3 shadow-sm">
                      <div
                        className={cn(
                          'inline-block px-1 md:px-2 py-0.5 md:py-1 rounded text-xs font-bold mb-1',
                          levelConfig.bgColor,
                          levelConfig.color,
                        )}
                      >
                        {levelConfig.label}
                      </div>
                      <div className="text-xs text-gray-600">Level</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px] md:h-[500px] px-3 md:px-6 py-4 md:py-6">
                    <div className="relative pr-2">
                      {/* Timeline Line */}
                      <div
                        className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 md:w-1 rounded-full"
                        style={{
                          background: `linear-gradient(to bottom, ${mainColor}30, ${secondaryColor}30)`,
                        }}
                      />

                      <div className="space-y-3 md:space-y-6">
                        {courseData.chapters.map((chapter, chapterIndex) => (
                          <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: chapterIndex * 0.1 }}
                            className="relative pl-12 md:pl-16"
                          >
                            {/* Chapter Indicator */}
                            <div
                              className="absolute left-2.5 md:left-4 w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 md:border-4 border-white"
                              style={{ backgroundColor: mainColor }}
                            >
                              {chapter.number}
                            </div>

                            {/* Chapter Card */}
                            <div className="bg-linear-to-r from-white to-gray-50 rounded-lg md:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
                              <div
                                className="p-2 md:p-4 border-l-4"
                                style={{ borderLeftColor: mainColor }}
                              >
                                <h3 className="font-bold text-gray-900 mb-2 md:mb-3 text-sm md:text-lg">
                                  {chapter.title}
                                </h3>

                                {/* Sub-chapters with enhanced visuals */}
                                <div className="grid gap-1.5 md:gap-3">
                                  {chapter.subChapters.map(
                                    (subChapter, subIndex) => {
                                      const typeConfig = getTypeConfig(
                                        subChapter.type,
                                      );
                                      return (
                                        <motion.div
                                          key={subChapter.id}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{
                                            delay:
                                              chapterIndex * 0.1 +
                                              subIndex * 0.05,
                                          }}
                                          className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-md md:rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all duration-200 group"
                                        >
                                          <div
                                            className={cn(
                                              'w-6 h-6 md:w-10 md:h-10 rounded-md md:rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow shrink-0',
                                              typeConfig.bgColor,
                                            )}
                                          >
                                            <div className={typeConfig.color}>
                                              {typeConfig.icon}
                                            </div>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 text-xs md:text-sm truncate">
                                              {subChapter.title}
                                            </div>
                                            <div className="flex items-center gap-1 md:gap-2 mt-0.5 md:mt-1">
                                              <span
                                                className={cn(
                                                  'text-xs px-1 md:px-2 py-0.5 rounded-full font-medium',
                                                  typeConfig.bgColor,
                                                  typeConfig.color,
                                                )}
                                              >
                                                {typeConfig.label}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                {subChapter.spendTime}m
                                              </span>
                                            </div>
                                          </div>
                                          <div className="text-right shrink-0">
                                            <div className="text-xs text-gray-400">
                                              #{subChapter.number}
                                            </div>
                                          </div>
                                        </motion.div>
                                      );
                                    },
                                  )}
                                </div>

                                {/* Chapter Summary */}
                                <div className="mt-2 md:mt-4 p-2 md:p-3 bg-gray-50 rounded-md md:rounded-xl">
                                  <div className="flex justify-between items-center text-xs md:text-sm">
                                    <span className="text-gray-600">
                                      Total: {chapter.subChapters.length} materi
                                    </span>
                                    <span className="font-medium text-gray-900">
                                      {chapter.subChapters.reduce(
                                        (total, sub) => total + sub.spendTime,
                                        0,
                                      )}{' '}
                                      menit
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Sidebar: Tips and Actions */}
          <div className="xl:col-span-1 space-y-4 md:space-y-6 order-2 xl:order-2">
            {/* Learning Tips */}
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardHeader
                className="pb-3 px-4 md:px-6"
                style={{ backgroundColor: `${mainColor}05` }}
              >
                <CardTitle
                  className="text-base md:text-lg font-bold flex items-center gap-2"
                  style={{ color: mainColor }}
                >
                  <Lightbulb className="w-4 h-4 md:w-5 md:h-5" />
                  Tips Sukses
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 md:p-4">
                <div className="space-y-2 md:space-y-3">
                  {learningTips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className="w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <div
                          style={{ color: mainColor }}
                          className="text-xs md:text-sm"
                        >
                          {tip.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-xs md:text-sm mb-1">
                          {tip.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {tip.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Start Action */}
            <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-4 md:p-6">
                <div className="text-center space-y-3 md:space-y-4">
                  <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                      Mulai Sekarang!
                    </h2>
                    <p className="text-xs md:text-sm text-gray-600">
                      Siap untuk memulai perjalanan pembelajaran Kamu?
                    </p>
                  </div>

                  <div className="text-left">
                    <div className="flex items-start gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 rounded-lg">
                      <Checkbox
                        id="agree-guidelines"
                        checked={agreedToGuidelines}
                        onCheckedChange={(checked) =>
                          setAgreedToGuidelines(checked as boolean)
                        }
                        className="mt-0.5 shrink-0"
                      />
                      <label
                        htmlFor="agree-guidelines"
                        className="text-xs text-gray-700 cursor-pointer leading-relaxed"
                      >
                        Aku berkomitmen untuk mengikuti panduan pembelajaran dan
                        menyelesaikan course ini dengan maksimal
                      </label>
                    </div>
                  </div>

                  <Button
                    onClick={handleStart}
                    disabled={!agreedToGuidelines || loading}
                    className={cn(
                      'w-full h-10 md:h-12 rounded-xl font-bold text-white shadow-lg transition-all duration-300 text-sm md:text-base',
                      agreedToGuidelines
                        ? 'hover:shadow-xl hover:scale-105'
                        : 'cursor-not-allowed opacity-50',
                    )}
                    style={{
                      background: agreedToGuidelines
                        ? `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`
                        : '#9CA3AF',
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Mempersiapkan...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        Mulai Belajar
                      </>
                    )}
                  </Button>

                  {!agreedToGuidelines && (
                    <p className="text-xs text-red-600">
                      Silakan setujui komitmen pembelajaran
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartCourse;
