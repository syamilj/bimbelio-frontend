'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Heart,
  Loader2Icon,
  Sparkles,
  StarIcon,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const labels = ['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];
const emojis = ['😞', '😕', '😐', '😊', '😍'];
const colors = [
  'from-red-500 to-red-600',
  'from-orange-500 to-orange-600',
  'from-yellow-500 to-yellow-600',
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
];

export default function EmojiRating() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const searchParams = useSearchParams();
  const sub = searchParams?.get('sub');

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // const { data: ratingData, isLoading } =
  //   api.course.getUserRatingBySubChapterId.useQuery(
  //     { subChapterId: sub as string },
  //     { enabled: !!sub, refetchOnWindowFocus: false },
  //   );

  const { data: ratingData, isLoading } = useGet(
    '/course/getUserRatingBySubChapterId',
    {
      params: { subChapterId: sub as string },
      enabled: !!sub,
      useEffectDependencies: [sub],
    },
  );

  // const { mutate: addRating } = api.course.addRatingSubChapter.useMutation();

  const { mutate: addRating } = useMutation(
    '/course/addRatingSubChapter',
    'post',
  );

  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (ratingData?.value !== undefined) {
      setRating(ratingData.value);
      setIsSubmitted(true);
    }
  }, [ratingData]);

  const handleRating = (value: number) => {
    setRating(value);
    setIsSubmitted(true);
    if (sub) {
      addRating({ payload: { subChapterId: sub as string, value } });
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
        <CardContent className="p-8 min-h-[280px] flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2Icon className="h-8 w-8 text-gray-400" />
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
      <CardHeader
        className="text-center pb-6 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            {isSubmitted ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <Heart className="w-8 h-8 text-white" />
            )}
          </motion.div>
          <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {isSubmitted ? 'Terima Kasih!' : 'Beri Penilaian'}
          </CardTitle>
          <p className="text-gray-600">
            {isSubmitted
              ? 'Penilaian Anda membantu kami meningkatkan kualitas'
              : 'Bagaimana pengalaman belajar Anda dengan materi ini?'}
          </p>
        </div>

        {/* Decorative elements */}
        <div
          className="absolute -right-6 -top-6 w-16 h-16 rounded-full opacity-10"
          style={{ backgroundColor: mainColor }}
        />
        <div
          className="absolute -left-4 -bottom-4 w-12 h-12 rounded-full opacity-10"
          style={{ backgroundColor: secondaryColor }}
        />
      </CardHeader>

      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Rating Stars */}
          <div className="flex justify-center items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-2 transition-all duration-200 relative"
                disabled={isSubmitted}
              >
                <StarIcon
                  className={cn(
                    'w-10 h-10 transition-all duration-300',
                    (hover !== null && hover >= star) ||
                      (rating !== null && rating >= star)
                      ? 'text-yellow-400 fill-yellow-400 drop-shadow-md'
                      : 'text-gray-300 hover:text-gray-400',
                  )}
                />

                {/* Sparkle effect for active stars */}
                {((hover !== null && hover >= star) ||
                  (rating !== null && rating >= star)) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Emoji Display */}
          {(hover !== null || rating !== null) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="text-6xl mb-4">
                {emojis[(hover || rating || 1) - 1]}
              </div>
            </motion.div>
          )}

          {/* Rating Result */}
          {rating !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(rating / 5) * 100}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={cn(
                    'h-full rounded-full bg-gradient-to-r transition-all duration-500',
                    colors[rating - 1],
                  )}
                />

                {/* Glow effect */}
                <div
                  className="absolute inset-0 bg-gradient-to-r opacity-30 blur-sm"
                  style={{
                    width: `${(rating / 5) * 100}%`,
                    background: `linear-gradient(to right, ${rating <= 2 ? '#ef4444' : rating === 3 ? '#f59e0b' : '#22c55e'}, transparent)`,
                  }}
                />
              </div>

              {/* Rating Info */}
              <div className="text-center space-y-2">
                <h3
                  className="text-xl font-bold"
                  style={{ color: mainColor }}
                >
                  {labels[rating - 1]}
                </h3>
                <p className="text-gray-600">
                  Anda memberi {rating} dari 5 bintang
                </p>

                {isSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200"
                  >
                    <div className="flex items-center justify-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        Feedback berhasil disimpan!
                      </span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Terima kasih telah membantu kami meningkatkan kualitas
                      pembelajaran
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Call to Action */}
          {rating === null && (
            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Klik bintang untuk memberi penilaian pengalaman belajar Anda
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
