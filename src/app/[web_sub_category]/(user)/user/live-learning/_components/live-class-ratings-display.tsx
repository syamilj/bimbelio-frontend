'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGet } from '@/lib/fetch-helper/useGet';
import { formatDateTime } from '@/lib/utils';
import { LiveClassRating } from '@/types/database';
import { Progress } from '@radix-ui/react-progress';
import { Heart, MessageSquare, Star, TrendingUp } from 'lucide-react';

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

  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
          filled ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
        <CardHeader
          className="pb-4 border-b border-gray-100 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <CardTitle className="flex items-center gap-3 text-lg">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Star
                className="h-4 w-4"
                style={{ color: mainColor }}
              />
            </div>
            <span style={{ color: mainColor }}>Rating & Review</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div
              className="animate-spin rounded-full h-8 w-8 border-3 border-t-transparent"
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
      <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
        <CardHeader
          className="pb-4 border-b border-gray-100 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
          }}
        >
          <CardTitle className="flex items-center gap-3 text-lg">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Star
                className="h-4 w-4"
                style={{ color: mainColor }}
              />
            </div>
            <span style={{ color: mainColor }}>Rating & Review</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div
              className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ backgroundColor: `${mainColor}08` }}
            >
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">
              Belum ada rating untuk live class ini
            </p>
            <p className="text-sm text-gray-400 mt-1">
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
    <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
      {/* ENHANCED HEADER */}
      <CardHeader
        className="pb-6 border-b border-gray-100 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
        }}
      >
        <div
          className="absolute -right-6 -top-6 w-12 h-12 rounded-full opacity-5"
          style={{ backgroundColor: mainColor }}
        />
        <CardTitle className="flex items-center gap-3 text-lg relative z-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <TrendingUp
              className="h-5 w-5"
              style={{ color: mainColor }}
            />
          </div>
          <span style={{ color: mainColor }}>
            Rating & Review ({totalRating})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* ENHANCED RATING SUMMARY */}
        <div className="flex items-center gap-8">
          {/* Average Rating Display */}
          <div
            className="text-center p-6 rounded-2xl border-2 relative overflow-hidden"
            style={{
              backgroundColor: `${mainColor}05`,
              borderColor: `${mainColor}15`,
            }}
          >
            <div
              className="absolute -right-4 -top-4 w-10 h-10 rounded-full opacity-10"
              style={{ backgroundColor: mainColor }}
            />
            <div className="relative z-10">
              <div
                className="text-4xl font-bold mb-2"
                style={{ color: mainColor }}
              >
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <p className="text-sm text-gray-600 font-medium">
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
                <div className="flex items-center gap-1 w-8">
                  <span className="font-medium">{star}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                </div>
                <Progress
                  value={getRatingPercentage(
                    ratingDistribution[star as keyof typeof ratingDistribution],
                    totalRating,
                  )}
                  className="flex-1 h-2"
                  style={
                    {
                      '--progress-foreground': mainColor,
                    } as React.CSSProperties & { [key: string]: string }
                  }
                />
                <span className="w-8 text-right text-gray-500 font-medium">
                  {ratingDistribution[star as keyof typeof ratingDistribution]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* USER'S RATING */}
        {userRating && (
          <div
            className="border-2 rounded-xl p-5 relative overflow-hidden"
            style={{
              backgroundColor: `${mainColor}08`,
              borderColor: `${mainColor}20`,
            }}
          >
            <div
              className="absolute -right-3 -top-3 w-8 h-8 rounded-full opacity-10"
              style={{ backgroundColor: mainColor }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Badge
                  className="text-white font-semibold"
                  style={{ backgroundColor: mainColor }}
                >
                  Rating Kamu
                </Badge>
                <div className="flex items-center gap-1">
                  {renderStars(userRating.score)}
                </div>
              </div>
              {userRating.comment && (
                <p className="text-gray-700 mb-3 font-medium leading-relaxed">
                  {userRating.comment}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Diberikan pada {formatDateTime(userRating.createdAt)}
              </p>
            </div>
          </div>
        )}

        {/* OTHER REVIEWS */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
            <Heart
              className="h-5 w-5"
              style={{ color: mainColor }}
            />
            Ulasan Peserta
          </h4>

          <div className="space-y-4">
            {ratings.slice(0, 5).map((rating, index) => (
              <div
                key={rating.id}
                className="border-2 border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                    <AvatarImage src={rating.User.image || undefined} />
                    <AvatarFallback
                      className="font-semibold text-white"
                      style={{ backgroundColor: `${mainColor}60` }}
                    >
                      {rating.User.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-gray-900">
                        {rating.User.name}
                      </p>
                      <div className="flex items-center gap-1">
                        {renderStars(rating.score)}
                      </div>
                    </div>

                    {rating.comment && (
                      <p className="text-gray-700 mb-3 leading-relaxed">
                        {rating.comment}
                      </p>
                    )}

                    <p className="text-xs text-gray-500 font-medium">
                      {formatDateTime(rating.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ratings.length > 5 && (
            <div
              className="text-center p-4 rounded-xl border-2 border-dashed"
              style={{ borderColor: `${mainColor}20` }}
            >
              <p
                className="text-sm font-medium"
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
