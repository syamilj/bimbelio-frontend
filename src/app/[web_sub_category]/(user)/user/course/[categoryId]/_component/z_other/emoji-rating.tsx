'use client';

import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const labels = ['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];
const emojis = ['😞', '😕', '😐', '😊', '😍'];

export default function EmojiRating() {
  const searchParams = useSearchParams();
  const sub = searchParams?.get('sub');

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
      <div className="w-full text-center py-4">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Simple Rating Stars for Popup */}
      <div className="flex justify-center items-center space-x-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className="focus:outline-none p-1 rounded transition-colors duration-200"
            disabled={isSubmitted}
          >
            <StarIcon
              className={cn(
                'w-6 h-6 transition-colors duration-200',
                rating !== null && rating >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300 hover:text-yellow-300',
              )}
            />
          </button>
        ))}
      </div>

      {/* Simple Label */}
      {rating !== null && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">{labels[rating - 1]}</p>
          <div className="text-2xl mb-2">{emojis[rating - 1]}</div>
        </div>
      )}

      {/* Thank you message */}
      {isSubmitted && (
        <div className="text-center">
          <p className="text-xs text-green-600">
            Terima kasih atas penilaian Anda!
          </p>
        </div>
      )}
    </div>
  );
}
