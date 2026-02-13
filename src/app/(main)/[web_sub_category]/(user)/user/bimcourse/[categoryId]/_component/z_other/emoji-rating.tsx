'use client';

import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="p-0.5">
            <StarIcon className="w-4 h-4 text-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRating(star)}
            className="focus:outline-none p-0.5 rounded transition-colors duration-200"
            disabled={isSubmitted}
          >
            <StarIcon
              className={cn(
                'w-4 h-4 transition-colors duration-200',
                rating !== null && rating >= star
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-slate-300 hover:text-amber-300',
              )}
            />
          </button>
        ))}
      </div>

      {rating !== null && (
        <span className="text-xs text-slate-500 ml-1">{emojis[rating - 1]}</span>
      )}

      {isSubmitted && (
        <span className="text-[10px] text-emerald-500 ml-1">Terima kasih!</span>
      )}
    </div>
  );
}
