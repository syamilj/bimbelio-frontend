"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/components/provider/provider-session-auth";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { getGeneral } from "@/lib/fetch-helper/fetch-helper";
import { env } from "@/env.mjs";
import { LoadingRetro } from "@/components/ui/loading-retro";

// import WelcomeSection from "./WelcomeSection";
import StatsCards from "./StatsCards";
import QuickActions from "./QuickActions";
import LiveClassSection from "./LiveClassSection";
import ContentSection from "./ContentSection";
import CalendarSection from "./CalendarSection";
import PricingPlans from "./PricingPlans";
import SubscriptionUpsell from "./SubscriptionUpsell";

// Types
interface DashboardData {
  user: {
    name: string;
    avatarUrl: string | null;
  };
  stats: {
    studyHours: number;
    totalScore: number;
    rank: number;
    rankFrom: number;
    tryoutsCompleted: number;
    lastTryoutTitle: string | null;
  };
  counts: {
    upcomingTryouts: number;
    upcomingLiveClasses: number;
  };
  subscription: {
    isPremium: boolean;
    planName: string;
    planExpiresAt?: string;
    usageStats: {
      tryoutsUsed: number;
      tryoutsLimit: number;
      coursesUsed: number;
      coursesLimit: number;
      aiChatsUsed: number;
      aiChatsLimit: number;
    };
  };
  liveClasses: Array<{
    id: string;
    title: string;
    scheduleTime: string;
    thumbnail: string | null;
    instructorName: string;
    isPremium: boolean;
  }>;
  content: {
    tryouts: Array<{
      id: string;
      src: string;
      title: string;
    }>;
    materials: Array<{
      id: string;
      src: string;
      title: string;
    }>;
    recordings: Array<{
      id: string;
      src: string;
      title: string;
      hasVideo: boolean;
    }>;
  };
}

function getImageUrl(
  imageId: string | null | undefined,
  type: "tryout" | "liveclass" | "course" | "document" = "tryout"
): string | undefined {
  if (!imageId || imageId.trim() === "") return undefined;
  if (
    imageId.startsWith("http://") ||
    imageId.startsWith("https://") ||
    imageId.startsWith("/")
  ) {
    return imageId;
  }
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_IMG_URL;
  switch (type) {
    case "tryout":
      return `${baseUrl}/tryout/${imageId}`;
    case "liveclass":
      return `${baseUrl}/${imageId}`;
    case "document":
      return `${baseUrl}/document/${imageId}`;
    case "course":
      return `${baseUrl}/${imageId}`;
    default:
      return `${baseUrl}/${imageId}`;
  }
}

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const { data: session } = useSession();
  const { websiteSubCategory, id: webSubCategoryId } = useWebsiteSubCategory();

  const fetchDashboardData = useCallback(async () => {
    if (!webSubCategoryId || !session?.user?.id) return;

    try {
      setLoading(true);

      const [reportRes, upcomingTryoutsRes, liveClassRes, doneTryoutsRes, documentsRes, coursesRes] =
        await Promise.all([
          getGeneral(`/report/getReportData`, {
            params: {
              userId: session.user.id,
              website_sub_category_id: webSubCategoryId,
            },
          }),
          getGeneral(`/tryout/getTryOutCardUpcoming`, {
            params: {
              website_sub_category_id: webSubCategoryId,
              userId: session.user.id,
              limit: 5,
            },
          }),
          getGeneral(`/liveClass/getAllLiveClassAvailable`, {
            params: {
              website_sub_category_id: webSubCategoryId,
              userId: session.user.id,
              limit: 5,
            },
          }),
          getGeneral(`/tryout/getTryOutCardDone`, {
            params: {
              website_sub_category_id: webSubCategoryId,
              userId: session.user.id,
              limit: 5,
            },
          }),
          getGeneral(`/document/getDocumentTerbaru`, {
            params: {
              website_sub_category_id: webSubCategoryId,
            },
          }),
          getGeneral(`/course/getCategoryForCard`, {
            params: {
              website_sub_category_id: webSubCategoryId,
              userId: session.user.id,
            },
          }),
        ]);

      const report = reportRes?.data;
      const upcomingTryouts = upcomingTryoutsRes?.data || [];
      const liveClasses = liveClassRes?.data || [];
      const doneTryouts = doneTryoutsRes?.data || [];
      const documents = documentsRes?.data || [];
      const courses = coursesRes?.data || [];

      // Get last tryout info
      const tryoutHistory = report?.tryoutHistory?.history || [];
      const lastTryout = tryoutHistory[0];

      // Build content arrays
      const tryoutImages = [...upcomingTryouts, ...doneTryouts]
        .filter((t: any) => t.image)
        .slice(0, 10)
        .map((t: any) => ({
          id: t.id,
          src: getImageUrl(t.image, "tryout") || "",
          title: t.title,
        }));

      // Documents = Materi (PDF, text, etc) - uses img field, not thumbnail
      const materialImages = documents
        .filter((d: any) => d.img)
        .slice(0, 10)
        .map((d: any) => ({
          id: d.id,
          src: getImageUrl(d.img, "document") || "",
          title: d.title || d.name || "Materi",
        }));

      // Helper to get YouTube thumbnail from video ID or URL
      const getYouTubeThumbnail = (video: string): string => {
        if (!video) return "";
        // If already a full URL, extract video ID
        const youtubeMatch = video.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        const videoId = youtubeMatch ? youtubeMatch[1] : video;
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      };

      // Extract video recordings from courses
      const recordingImages: { id: string; src: string; title: string; hasVideo: boolean }[] = [];
      courses.forEach((course: any) => {
        course.CourseChapter?.forEach((chapter: any) => {
          chapter.CourseSubChapter?.forEach((subChapter: any) => {
            if (subChapter.type === "VIDEO" && subChapter.video) {
              recordingImages.push({
                id: subChapter.id,
                src: getYouTubeThumbnail(subChapter.video),
                title: subChapter.title || "Video",
                hasVideo: true,
              });
            }
          });
        });
      });
      // Limit to 10 recordings
      recordingImages.splice(10);

      const dashboardData: DashboardData = {
        user: {
          name: report?.userHeader?.name || session.user.name || "User",
          avatarUrl: report?.userHeader?.avatarUrl || session.user.image,
        },
        stats: {
          studyHours: report?.studyHabits?.totalHoursStudied || 0,
          totalScore: report?.learningReport?.totalScore || 0,
          rank: lastTryout?.rank || report?.learningReport?.rank || 0,
          rankFrom: lastTryout?.totalParticipants || 1000,
          tryoutsCompleted: tryoutHistory.length || 0,
          lastTryoutTitle: lastTryout?.title || null,
        },
        counts: {
          upcomingTryouts: upcomingTryouts.length,
          upcomingLiveClasses: liveClasses.length,
        },
        subscription: {
          isPremium:
            report?.userHeader?.status === "SUBSCRIBER" ||
            report?.userHeader?.status === "ADMIN",
          planName:
            report?.userHeader?.status === "SUBSCRIBER" ? "Premium" : "Free",
          planExpiresAt: report?.userHeader?.daysLeft
            ? new Date(
                Date.now() + report.userHeader.daysLeft * 24 * 60 * 60 * 1000
              ).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : undefined,
          usageStats: {
            tryoutsUsed: 3,
            tryoutsLimit: 5,
            coursesUsed: 2,
            coursesLimit: 3,
            aiChatsUsed: 8,
            aiChatsLimit: 10,
          },
        },
        liveClasses: liveClasses.map((lc: any) => ({
          id: lc.id,
          title: lc.title,
          scheduleTime: lc.scheduleTime || lc.startDate,
          thumbnail: getImageUrl(lc.thumbnail || lc.image, "liveclass") || null,
          instructorName: lc.Instructor?.name || "Tutor",
          isPremium: lc.accessType === "PREMIUM",
        })),
        content: {
          tryouts: tryoutImages,
          materials: materialImages,
          recordings: recordingImages,
        },
      };

      setData(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [webSubCategoryId, session?.user?.id]);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session, fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingRetro />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">Gagal memuat data dashboard</p>
        <button onClick={fetchDashboardData} className="text-primary underline">
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden px-4 pt-4 md:px-0 md:pt-0">
      <div className="flex flex-col gap-4">

        <StatsCards
          studyHours={data.stats.studyHours}
          totalScore={data.stats.totalScore}
          rank={data.stats.rank}
          rankFrom={data.stats.rankFrom}
          tryoutsCompleted={data.stats.tryoutsCompleted}
          lastTryoutTitle={data.stats.lastTryoutTitle}
        />

        <QuickActions
          upcomingTryoutCount={data.counts.upcomingTryouts}
          upcomingLiveClassCount={data.counts.upcomingLiveClasses}
        />

        <LiveClassSection liveClasses={data.liveClasses} />

        <ContentSection
          tryouts={data.content.tryouts}
          materials={data.content.materials}
          recordings={data.content.recordings}
        />

        <CalendarSection />

        {!data.subscription.isPremium && (
          <PricingPlans
            webSubCategory={websiteSubCategory?.id || ""}
            isPremium={data.subscription.isPremium}
          />
        )}

        {data.subscription.isPremium && (
          <SubscriptionUpsell
            isPremium={data.subscription.isPremium}
            planName={data.subscription.planName}
            planExpiresAt={data.subscription.planExpiresAt}
            usageStats={data.subscription.usageStats}
            webSubCategory={websiteSubCategory?.id || ""}
          />
        )}
      </div>
    </div>
  );
}
