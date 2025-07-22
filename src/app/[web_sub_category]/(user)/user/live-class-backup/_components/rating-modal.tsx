'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { MockLiveClass } from '@/lib/mock-data/live-class';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  liveClass: MockLiveClass;
  onSubmit: (rating: number, review: string) => void;
}

export function RatingModal({
  isOpen,
  onClose,
  liveClass,
  onSubmit,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit(rating, review);
      setRating(0);
      setReview('');
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const displayRating = hoveredRating || rating;

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return 'Sangat Buruk';
      case 2:
        return 'Buruk';
      case 3:
        return 'Cukup';
      case 4:
        return 'Baik';
      case 5:
        return 'Sangat Baik';
      default:
        return 'Pilih rating';
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Beri Rating & Review</DialogTitle>
          <DialogDescription>
            Bagaimana pengalaman Anda mengikuti kelas "{liveClass.title}"?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating Stars */}
          <div className="text-center">
            <div className="flex justify-center items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 hover:scale-110 transition-transform"
                  type="button"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= displayRating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-600">
              {getRatingText(displayRating)}
            </p>
          </div>

          {/* Review Textarea */}
          <div className="space-y-2">
            <label
              htmlFor="review"
              className="text-sm font-medium"
            >
              Review (Opsional)
            </label>
            <Textarea
              id="review"
              placeholder="Ceritakan pengalaman Anda mengikuti kelas ini..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {review.length}/500 karakter
            </p>
          </div>

          {/* Class Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">{liveClass.title}</h4>
            <p className="text-xs text-gray-600">
              Tutor: {liveClass.tutorName} • {liveClass.subject}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Rating'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
