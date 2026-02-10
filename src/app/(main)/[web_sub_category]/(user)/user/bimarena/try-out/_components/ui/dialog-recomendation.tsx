'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import {
  Award,
  Crown,
  Gift,
  Heart,
  Rocket,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type Dispatch, type SetStateAction } from 'react';
import { EmptyState } from '@/components/ds';
import CardTryOut from './card-tryout';

type Props = {
  setOpenExternal: Dispatch<SetStateAction<boolean>>;
  openExternal: boolean;
};

export default function DialogRecomendation({
  openExternal,
  setOpenExternal,
}: Props) {
  const searchParams = useSearchParams();
  const register_tryout = searchParams?.get('register_tryout');
  const router = useRouter();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const {
    data,
    isLoading,
    refetch: fetchData,
  } = useGet('/tryout/getTryOutCardUpcomingAnotherWeb', {
    params: { userId: session?.user.id },
    useEffectDependencies: [session],
  });

  return (
    <Dialog
      open={openExternal}
      onOpenChange={(value) => {
        setOpenExternal(value);
        if (register_tryout) {
          router.push(`${window.location.pathname}`);
        }
      }}
    >
      <DialogContent className="md:max-w-[1200px] w-[90%] xl:w-full overflow-y-auto max-h-[90vh] bg-white border-0 shadow-2xl rounded-3xl">
        {/* Enhanced Header Section */}
        <div className="relative text-center mb-8 pt-6 px-4 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute top-4 left-8 w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="absolute top-12 right-12 w-3 h-3 rounded-full animate-pulse animation-delay-300"
              style={{ backgroundColor: secondaryColor }}
            />
            <div
              className="absolute bottom-8 left-12 w-1.5 h-1.5 rounded-full animate-pulse animation-delay-700"
              style={{ backgroundColor: mainColor }}
            />
            <div
              className="absolute bottom-4 right-8 w-2.5 h-2.5 rounded-full animate-pulse animation-delay-1000"
              style={{ backgroundColor: secondaryColor }}
            />
          </div>

          {/* Floating Decorative Icons */}
          <div className="absolute top-8 left-1/4 animate-float">
            <div
              className="w-8 h-8 rounded-3xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Star
                className="w-4 h-4"
                style={{ color: mainColor }}
              />
            </div>
          </div>
          <div className="absolute top-12 right-1/4 animate-float animation-delay-500">
            <div
              className="w-7 h-7 rounded-3xl flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${secondaryColor}15` }}
            >
              <Sparkles
                className="w-3.5 h-3.5"
                style={{ color: secondaryColor }}
              />
            </div>
          </div>
          <div className="absolute top-6 left-1/3 animate-float animation-delay-1000">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${mainColor}20` }}
            >
              <Target
                className="w-3 h-3"
                style={{ color: mainColor }}
              />
            </div>
          </div>
          <div className="absolute top-16 right-1/3 animate-float animation-delay-700">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${secondaryColor}20` }}
            >
              <Award
                className="w-3.5 h-3.5"
                style={{ color: secondaryColor }}
              />
            </div>
          </div>

          {/* Main Icon */}
          <div className="relative mb-6">
            <div
              className="inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-3xl shadow-2xl relative z-10 group hover:scale-105 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <Trophy className="w-10 h-10 lg:w-12 lg:h-12 text-white" />

              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-3xl opacity-30 animate-pulse"
                style={{
                  boxShadow: `0 0 30px ${mainColor}, 0 0 60px ${mainColor}40`,
                }}
              />
            </div>

            {/* Crown for special effect */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Crown
                className="w-6 h-6 text-yellow-500 animate-bounce"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
              />
            </div>
          </div>

          {/* Enhanced Title */}
          <div className="space-y-4 mb-6">
            <h1 className="text-2xl lg:text-4xl font-bold leading-tight">
              <span
                className="bg-linear-to-r bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                Rekomendasi Try Out Terbaik
              </span>
            </h1>

            <div className="flex items-center justify-center gap-2 text-lg lg:text-xl">
              <Gift
                className="w-5 h-5 lg:w-6 lg:h-6"
                style={{ color: mainColor }}
              />
              <span
                className="font-semibold"
                style={{ color: mainColor }}
              >
                Khusus Untukmu!
              </span>
              <Sparkles
                className="w-5 h-5 lg:w-6 lg:h-6"
                style={{ color: secondaryColor }}
              />
            </div>

            <p className="text-gray-600 text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              Tingkatkan kemampuanmu dengan try out berkualitas dari berbagai
              kategori
            </p>
          </div>

          {/* Enhanced Decorative Line */}
          <div className="flex items-center justify-center mb-6">
            <div
              className="h-1 w-16 lg:w-20 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            />
            <div
              className="mx-3 w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shadow-lg"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Sparkles
                className="w-4 h-4 lg:w-5 lg:h-5"
                style={{ color: mainColor }}
              />
            </div>
            <div
              className="h-1 w-16 lg:w-20 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
              }}
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { icon: TrendingUp, label: 'Berkualitas', color: mainColor },
              { icon: Zap, label: 'Gratis', color: secondaryColor },
              { icon: Heart, label: 'Terpercaya', color: mainColor },
            ].map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-3xl border border-gray-100 bg-white/50 backdrop-blur-sm hover:shadow-md transition-all duration-300"
                style={{ backgroundColor: `${item.color}05` }}
              >
                <div
                  className="w-8 h-8 mx-auto rounded-3xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <item.icon
                    className="w-4 h-4"
                    style={{ color: item.color }}
                  />
                </div>
                <p
                  className="text-xs font-semibold"
                  style={{ color: item.color }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 lg:px-6">
          {!isLoading && data && data.length > 0 && (
            <div className="space-y-6">
              {/* Section Header */}
              <div className="text-center space-y-2">
                <h2
                  className="text-xl lg:text-2xl font-bold flex items-center justify-center gap-2"
                  style={{ color: mainColor }}
                >
                  <Rocket className="w-5 h-5 lg:w-6 lg:h-6" />
                  Pilih Try Out Favoritmu
                </h2>
                <p className="text-gray-600 text-sm lg:text-base">
                  {data.length} try out tersedia untuk meningkatkan kemampuanmu
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <CardTryOut
                  data={data}
                  userTryOutId={session?.user.userTryOutId || ''}
                  isPrivate
                  refresh={fetchData}
                  reloadHref
                />
              </div>
            </div>
          )}

          {!isLoading && data?.length === 0 && (
            <div className="py-12">
              <EmptyState
                icon={Rocket}
                color="blue"
                title="Belum ada try out tersedia"
                description="Try out rekomendasi untukmu akan muncul di sini"
              />
            </div>
          )}

          {isLoading && (
            <div className="space-y-6">
              {/* Section Header Skeleton */}
              <div className="text-center space-y-2">
                <Skeleton className="h-8 w-64 mx-auto rounded-3xl" />
                <Skeleton className="h-4 w-48 mx-auto rounded-3xl" />
              </div>

              {/* Cards Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-[300px] lg:h-[350px] rounded-3xl"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="text-center space-y-4">
            <div
              className="inline-flex items-center space-x-3 px-6 py-3 rounded-3xl shadow-sm"
              style={{ backgroundColor: `${mainColor}05` }}
            >
              <Sparkles
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
              <span
                className="text-sm lg:text-base font-semibold"
                style={{ color: mainColor }}
              >
                Semangat belajar dan raih prestasi terbaikmu!
              </span>
              <Rocket
                className="w-5 h-5"
                style={{ color: secondaryColor }}
              />
            </div>

            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3 h-3 transition-all duration-300',
                    i < 5 ? 'text-yellow-400 fill-current' : 'text-gray-300',
                  )}
                />
              ))}
              <span className="ml-2 text-xs text-gray-500">
                Dipercaya ribuan siswa
              </span>
            </div>
          </div>
        </div>

        {/* Custom CSS for animations */}
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animation-delay-300 {
            animation-delay: 300ms;
          }
          .animation-delay-500 {
            animation-delay: 500ms;
          }
          .animation-delay-700 {
            animation-delay: 700ms;
          }
          .animation-delay-1000 {
            animation-delay: 1000ms;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
