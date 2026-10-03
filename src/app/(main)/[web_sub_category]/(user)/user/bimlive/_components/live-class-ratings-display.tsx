'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGet } from '@/lib/fetch-helper/useGet';
import { formatDateTime } from '@/lib/utils';
import { LiveClassRating } from '@/types/database';
import { Progress as ProgressPrimitive } from 'radix-ui';

import { Heart, MessageSquare, Star, TrendingUp } from 'lucide-react';

const Progress = ProgressPrimitive.Root;

type RatingDataType = {
  totalRating: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  userRating: LiveClassRating & {
    User: {
      id: string;
      email: string;
      image: string;
      name: string;
    };
  };
  ratings: (LiveClassRating & {
    User: {
      id: string;
      email: string;
      image: string;
      name: string;
    };
  })[];
};

export function LiveClassRatingsDisplay({
  liveClassId,
}: {
  liveClassId: string;
}) {
  // return null;
  const { websiteSubCategory } = useWebsiteSubCategory();

  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#4C94FF';

  const { data: ratingsData, isLoading } = useGet<RatingDataType>(
    `/liveClass/getRatingLiveClass`,
    {
      params: { id: liveClassId },
      useEffectDependencies: [liveClassId],
    },
  );

  const renderStars = (rating: number) => {
    const starArray = Array.from({ length: 5 }, (_, index) => index < rating);
    return starArray.map((filled, i) => (
      <Star
        key={i}
        className={`h-4 w-4 transition-colors ${
          filled ? 'fill-current text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-3xl border-2 border-gray-100 bg-white shadow-sm">
        <CardHeader
          className="relative overflow-hidden border-b-2 border-gray-100 pb-4"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <CardTitle className="flex items-center gap-3 text-lg">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-3xl border-2 border-gray-100"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Star
                className="h-4 w-4"
                style={{ color: mainColor }}
              />
            </div>
            <span
              style={{ color: mainColor }}
              className="font-black"
            >
              Rating & Review
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex h-32 items-center justify-center">
            <div
              className="h-8 w-8 animate-spin rounded-full border-3 border-t-transparent"
              style={{
                borderColor: `${mainColor}30`,
                borderTopColor: 'transparent',
              }}
            ></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!ratingsData || ratingsData.totalRating === 0) {
    return (
      <Card className="overflow-hidden rounded-3xl border-2 border-gray-100 bg-white shadow-sm">
        <CardHeader
          className="relative overflow-hidden border-b-2 border-gray-100 pb-4"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <CardTitle className="flex items-center gap-3 text-lg">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-3xl border-2 border-gray-100"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Star
                className="h-4 w-4"
                style={{ color: mainColor }}
              />
            </div>
            <span
              style={{ color: mainColor }}
              className="font-black"
            >
              Rating & Review
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="py-8 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border-2 border-gray-100"
              style={{ backgroundColor: `${mainColor}08` }}
            >
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <p className="font-bold text-gray-500">
              Belum ada rating untuk live class ini
            </p>
            <p className="mt-1 text-sm font-medium text-gray-400">
              Jadilah yang pertama memberikan rating!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const {
    totalRating,
    averageRating,
    ratingDistribution,
    userRating,
    ratings,
  } = ratingsData;

  return (
    <Card className="overflow-hidden rounded-3xl border-2 border-gray-100 bg-white shadow-sm">
      {/* ENHANCED HEADER */}
      <CardHeader
        className="relative overflow-hidden border-b-2 border-gray-100 pb-6"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div
          className="absolute -top-6 -right-6 h-12 w-12 rounded-full opacity-5"
          style={{ backgroundColor: mainColor }}
        />
        <CardTitle className="relative z-10 flex items-center gap-3 text-lg">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-3xl border-2 border-gray-100 shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <TrendingUp
              className="h-5 w-5"
              style={{ color: mainColor }}
            />
          </div>
          <span
            style={{ color: mainColor }}
            className="font-black"
          >
            Rating & Review ({totalRating})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        {/* ENHANCED RATING SUMMARY */}
        <div className="flex items-center gap-8">
          {/* Average Rating Display */}
          <div
            className="relative overflow-hidden rounded-3xl border-2 p-6 text-center shadow-sm"
            style={{
              backgroundColor: `${mainColor}05`,
              borderColor: `${mainColor}15`,
            }}
          >
            <div
              className="absolute -top-4 -right-4 h-10 w-10 rounded-full opacity-10"
              style={{ backgroundColor: mainColor }}
            />
            <div className="relative z-10">
              <div
                className="mb-2 text-4xl font-black"
                style={{ color: mainColor }}
              >
                {averageRating.toFixed(1)}
              </div>
              <div className="mb-2 flex items-center justify-center gap-1">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm font-bold text-gray-500">
                {totalRating} ulasan
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-3">
            {[5, 4, 3, 2, 1].map((star) => (
              <div
                key={star}
                className="flex items-center gap-3 text-sm"
              >
                <div className="flex w-8 items-center gap-1">
                  <span className="font-bold">{star}</span>
                  <Star className="h-3 w-3 fill-current text-yellow-400" />
                </div>
                <Progress
                  value={getRatingPercentage(
                    ratingDistribution[star as keyof typeof ratingDistribution],
                    totalRating,
                  )}
                  className="h-2 flex-1"
                  style={
                    {
                      '--progress-foreground': mainColor,
                    } as React.CSSProperties & { [key: string]: string }
                  }
                />
                <span className="w-8 text-right font-bold text-gray-500">
                  {ratingDistribution[star as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* USER'S RATING */}
        {userRating && (
          <div
            className="relative overflow-hidden rounded-3xl border-2 p-5 shadow-sm"
            style={{
              backgroundColor: `${mainColor}08`,
              borderColor: `${mainColor}20`,
            }}
          >
            <div
              className="absolute -top-3 -right-3 h-8 w-8 rounded-full opacity-10"
              style={{ backgroundColor: mainColor }}
            />
            <div className="relative z-10">
              <div className="mb-3 flex items-center gap-3">
                <Badge
                  className="rounded-3xl border-2 font-black text-white"
                  style={{ backgroundColor: mainColor }}
                >
                  Rating Kamu
                </Badge>
                <div className="flex items-center gap-1">
                  {renderStars(userRating.score)}
                </div>
              </div>
              {userRating.comment && (
                <p className="mb-3 leading-relaxed font-medium text-gray-900">
                  {userRating.comment}
                </p>
              )}
              <p className="text-xs font-medium text-gray-500">
                Diberikan pada {formatDateTime(userRating.createdAt)}
              </p>
            </div>
          </div>
        )}

        {/* OTHER REVIEWS */}
        <div className="space-y-4">
          <h4 className="flex items-center gap-2 font-black text-gray-900">
            <Heart
              className="h-5 w-5"
              style={{ color: mainColor }}
            />
            Ulasan Peserta
          </h4>

          <div className="space-y-4">
            {ratings.slice(0, 5).map((rating) => (
              <div
                key={rating.id}
                className="rounded-3xl border-2 border-gray-100 p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 border-2 border-gray-100 ring-2 ring-gray-100">
                    <AvatarImage src={rating.User.image || undefined} />
                    <AvatarFallback
                      className="font-black text-white"
                      style={{ backgroundColor: `${mainColor}60` }}
                    >
                      {rating.User.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-3">
                      <p className="font-black text-gray-900">
                        {rating.User.name}
                      </p>
                      <div className="flex items-center gap-1">
                        {renderStars(rating.score)}
                      </div>
                    </div>

                    {rating.comment && (
                      <p className="mb-3 leading-relaxed font-medium text-gray-900">
                        {rating.comment}
                      </p>
                    )}

                    <p className="text-xs font-bold text-gray-500">
                      {formatDateTime(rating.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ratings.length > 5 && (
            <div
              className="rounded-3xl border-2 border-dashed p-4 text-center"
              style={{ borderColor: `${mainColor}20` }}
            >
              <p
                className="text-sm font-bold"
                style={{ color: mainColor }}
              >
                Dan {ratings.length - 5} ulasan lainnya...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const getRatingPercentage = (count: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
};
