'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { getRatingText } from '@/lib/utils/live-class';
import { LiveClassRating } from '@/types/database';
import { Heart, Send, Star, ThumbsUp } from 'lucide-react';
import { useState } from 'react';
import { LiveClassType } from '../[classId]/page';

export function RatingModal({
  onClose,
  liveClass,
  children,
  onSuccess,
}: {
  onClose?: () => void;
  liveClass: LiveClassType;
  children: React.ReactNode;
  onSuccess?: () => any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // === DESIGN SYSTEM FROM LEADERBOARD ===
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [existingRating, setExistingRating] = useState<{
  //   rating: number;
  //   review?: string;
  // } | null>(null);

  const { data: existingRating, isLoading } = useGet<LiveClassRating>(
    `/liveClass/getIsUserRatingLiveClass`,
    {
      params: { id: liveClass.id },
      useEffectDependencies: [liveClass],
    },
  );

  const { mutate: addRating } = useMutation(
    '/liveClass/addRatingLiveClass',
    'post',
  );

  // Reset state ketika modal ditutup
  const resetState = () => {
    setRating(0);
    setReview('');
    setHoveredRating(0);
    setIsSubmitting(false);
    // setExistingRating(null);
  };

  // Reset state saat modal ditutup
  const handleClose = () => {
    resetState();
    if (onClose) onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      console.log({ rating, review });
      const payload = {
        instructorId: liveClass.instructorId,
        liveClassId: liveClass.id,
        score: rating,
        comment: review,
      };
      await addRating({ payload });
      if (onSuccess) await onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
    setHoveredRating(0); // Reset hover saat diklik
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  const getRatingDescription = (rating: number): string => {
    return rating > 0 ? getRatingText(rating) : 'Pilih rating';
  };

  // Enhanced color mapping for rating
  const getRatingColor = (starRating: number): string => {
    if (starRating <= 2) return '#ef4444'; // red
    if (starRating <= 3) return '#f59e0b'; // amber
    if (starRating <= 4) return '#10b981'; // emerald
    return '#8b5cf6'; // purple for 5 stars
  };

  if (!liveClass) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg overflow-hidden border-0 shadow-xl rounded-2xl">
        {/* ENHANCED HEADER WITH GRADIENT */}
        <DialogHeader className="relative pb-6 border-b border-gray-100">
          <div
            className="absolute inset-0 opacity-5 rounded-t-2xl"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          />
          <div className="relative z-10">
            <DialogTitle className="flex items-center gap-3 text-xl font-bold">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <Heart
                  className="w-5 h-5"
                  style={{ color: mainColor }}
                />
              </div>
              <span style={{ color: mainColor }}>
                {existingRating
                  ? 'Edit Rating & Review'
                  : 'Beri Rating & Review'}
              </span>
            </DialogTitle>
            <DialogDescription className="text-base mt-2 text-gray-600">
              {existingRating ? (
                <>Ubah rating Anda untuk kelas "{liveClass.title}"</>
              ) : (
                <>
                  Bagaimana pengalaman Anda mengikuti kelas "{liveClass.title}"?
                </>
              )}
              {existingRating && (
                <div className="mt-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="text-sm text-blue-700 font-medium">
                    Rating sebelumnya: {existingRating.score} ⭐
                  </span>
                </div>
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* ENHANCED RATING STARS SECTION */}
          <div className="text-center">
            <div
              className="p-6 rounded-2xl border-2 relative overflow-hidden"
              style={{
                backgroundColor:
                  displayRating > 0
                    ? `${getRatingColor(displayRating)}08`
                    : 'rgb(249 250 251)',
                borderColor:
                  displayRating > 0
                    ? `${getRatingColor(displayRating)}20`
                    : 'rgb(229 231 235)',
              }}
            >
              {displayRating > 0 && (
                <div
                  className="absolute -right-4 -top-4 w-12 h-12 rounded-full opacity-10"
                  style={{ backgroundColor: getRatingColor(displayRating) }}
                />
              )}

              <div className="flex justify-center items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarLeave}
                    className="p-2 hover:scale-110 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 rounded-xl hover:bg-white/50"
                    type="button"
                    disabled={isSubmitting}
                  >
                    <Star
                      className={`h-10 w-10 transition-all duration-200 ${
                        star <= displayRating
                          ? 'text-yellow-400 fill-yellow-400 drop-shadow-sm'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="text-center">
                <p
                  className="text-lg font-semibold mb-1"
                  style={{
                    color:
                      displayRating > 0
                        ? getRatingColor(displayRating)
                        : '#6b7280',
                  }}
                >
                  {displayRating > 0
                    ? getRatingText(displayRating)
                    : 'Pilih rating Anda'}
                </p>
                {displayRating > 0 && (
                  <p className="text-sm text-gray-600">
                    {displayRating} dari 5 bintang
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ENHANCED REVIEW TEXTAREA */}
          <div className="space-y-3">
            <label
              htmlFor="review"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <ThumbsUp
                className="h-4 w-4"
                style={{ color: mainColor }}
              />
              Review (Opsional)
            </label>
            <div className="relative">
              <Textarea
                id="review"
                placeholder="Ceritakan pengalaman Anda mengikuti kelas ini..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                maxLength={500}
                className="border-2 border-gray-200 rounded-xl focus:border-2 transition-colors resize-none"
                style={
                  {
                    '--tw-ring-color': `${mainColor}20`,
                    borderColor: review ? `${mainColor}40` : undefined,
                  } as React.CSSProperties & { [key: string]: string }
                }
              />
              <div className="absolute bottom-3 right-3">
                <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-lg">
                  {review.length}/500
                </span>
              </div>
            </div>
          </div>

          {/* ENHANCED CLASS INFO CARD */}
          <div
            className="p-4 rounded-xl border-2 relative overflow-hidden"
            style={{
              backgroundColor: `${mainColor}05`,
              borderColor: `${mainColor}15`,
            }}
          >
            <div
              className="absolute -right-3 -top-3 w-8 h-8 rounded-full opacity-10"
              style={{ backgroundColor: mainColor }}
            />
            <h4 className="font-semibold text-gray-900 mb-2">
              {liveClass.title}
            </h4>
            <p className="text-sm text-gray-600">
              Tutor:{' '}
              <span className="font-medium">{liveClass.Instructor.name}</span> •{' '}
              {liveClass.Category.name}
            </p>
          </div>
        </div>

        {/* ENHANCED FOOTER */}
        <DialogFooter className="gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-6 py-2 h-11 border-2 hover:bg-gray-50 transition-colors rounded-xl"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="px-6 py-2 h-11 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor:
                rating > 0 ? getRatingColor(displayRating) : mainColor,
              backgroundImage:
                rating > 0
                  ? `linear-gradient(135deg, ${getRatingColor(displayRating)}, ${getRatingColor(displayRating)}dd)`
                  : `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Kirim Rating
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
