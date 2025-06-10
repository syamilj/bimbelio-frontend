'use client';

import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { Loader2Icon, StarIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const labels = ['Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];

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
  const [hover, setHover] = useState<number | null>(null);

  useEffect(() => {
    if (ratingData?.value !== undefined) {
      setRating(ratingData.value);
    }
  }, [ratingData]);

  const handleRating = (value: number) => {
    setRating(value);
    if (sub) {
      addRating({ payload: { subChapterId: sub as string, value } });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto bg-white rounded-2xl p-6 shadow-sm min-h-[250px] flex items-center justify-center">
        <Loader2Icon className="animate-spin h-5 w-5 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl p-6 shadow-sm">
      <div className="space-y-8">
        <h1 className="text-xl font-bold text-center text-gray-900">
          Beri Penilaian Pengalaman Kamu
        </h1>

        <div className="flex justify-center items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              className="focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-full p-1 transition-all duration-200"
            >
              <StarIcon
                className={cn(
                  'w-8 h-8 transition-all duration-200',
                  (hover !== null && hover >= star) ||
                    (rating !== null && rating >= star)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300',
                )}
              />
            </button>
          ))}
        </div>

        {rating !== null ? (
          <div className="space-y-3">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 transition-all duration-500 ease-out"
                style={{ width: `${(rating / 5) * 100}%` }}
              />
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold text-gray-900">
                {labels[rating - 1]}
              </p>
              <p className="text-sm text-gray-600">
                Kamu memberi nilai: {rating}{' '}
                {rating === 1 ? 'bintang' : 'bintang'}
              </p>
              <p className="text-xs text-gray-500">
                Terima kasih atas umpan balikmu!
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-sm">
            Klik bintang untuk memberi penilaian pengalaman Kamu
          </p>
        )}
      </div>
    </div>
  );
}
