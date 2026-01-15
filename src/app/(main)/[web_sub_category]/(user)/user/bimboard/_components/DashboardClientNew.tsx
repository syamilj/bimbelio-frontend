"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "@/components/provider/provider-session-auth";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { getGeneral } from "@/lib/fetch-helper/fetch-helper";
import { env } from "@/env.mjs";
import { LoadingRetro } from "@/components/ui/loading-retro";

// Bim Components
import BimHeroWelcome from "./new/BimHeroWelcome";
import BimQuickStatsOverview from "./new/BimQuickStatsOverview";
import BimLearningProgress from "./new/BimLearningProgress";
import BimRecentActivity from "./new/RecentActivity";
import BimUpcomingSchedule from "./new/UpcomingSchedule";
import BimPerformanceChart from "./new/BimPerformanceChart";
import BimRecommendedContent from "./new/RecommendedContent";
import BimAchievementBadges from "./new/AchievementBadges";
import BimQuickAccessMenu from "./new/BimQuickAccessMenu";

// Types
export interface DashboardData {
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
    tier: string;
    joinedDate: string;
    streak: number;
  };
  stats: {
    studyHours: number;
    studyHoursThisWeek: number;
    totalScore: number;
    averageScore: number;
    rank: number;
    rankFrom: number;
    previousRank: number;
    rankChange: number;
    tryoutsCompleted: number;
    coursesCompleted: number;
    coursesInProgress: number;
    documentsRead: number;
    liveClassesAttended: number;
  };
  learningProgress: {
    courses: Array<{
      id: string;
      name: string;
      category: string;
      progress: number;
      totalChapters: number;
      completedChapters: number;
      thumbnail: string | null;
      lastAccessed: string;
    }>;
    tryouts: Array<{
      id: string;
      title: string;
      score: number | null;
      totalQuestions: number;
      answeredQuestions: number;
      status: "completed" | "in-progress" | "not-started";
      thumbnail: string | null;
      deadline: string | null;
    }>;
  };
  recentActivity: Array<{
    id: string;
    type: "tryout" | "course" | "document" | "liveclass";
    title: string;
    description: string;
    timestamp: string;
    icon: string;
  }>;
  upcomingSchedule: {
    tryouts: Array<{
      id: string;
      title: string;
      startDate: string;
      endDate: string;
      thumbnail: string | null;
      isPremium: boolean;
      totalQuestions: number;
    }>;
    liveClasses: Array<{
      id: string;
      title: string;
      scheduleTime: string;
      duration: number;
      thumbnail: string | null;
      instructorName: string;
      instructorAvatar: string | null;
      isPremium: boolean;
      isRegistered: boolean;
    }>;
  };
  performanceData: {
    scoreHistory: Array<{
      date: string;
      score: number;
      tryoutTitle: string;
      rank: number;
      totalParticipants: number;
      rankChange: number;
    }>;
    studyTimeHistory: Array<{
      date: string;
      hours: number;
    }>;
  };
  recommendations: {
    courses: Array<{
      id: string;
      name: string;
      category: string;
      thumbnail: string | null;
      progress: number;
      isLocked: boolean;
      isPremium: boolean;
    }>;
    tryouts: Array<{
      id: string;
      title: string;
      thumbnail: string | null;
      difficulty: string;
      totalQuestions: number;
      isPremium: boolean;
    }>;
    documents: Array<{
      id: string;
      title: string;
      category: string;
      thumbnail: string | null;
      type: string;
    }>;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    unlockedAt: string | null;
    progress: number;
    target: number;
  }>;
  subscription: {
    isPremium: boolean;
    planName: string;
    planExpiresAt: string | null;
    daysLeft: number | null;
    features: string[];
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

export default function DashboardClientNew() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const { data: session } = useSession();
  const { websiteSubCategory, id: webSubCategoryId } = useWebsiteSubCategory();

  const fetchDashboardData = useCallback(async () => {
    if (!webSubCategoryId || !session?.user?.id) return;

    try {
      setLoading(true);

      const [
        reportRes,
        upcomingTryoutsRes,
        doneTryoutsRes,
        liveClassRes,
        documentsRes,
        coursesRes,
      ] = await Promise.all([
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
            limit: 10,
          },
        }),
        getGeneral(`/tryout/getTryOutCardDone`, {
          params: {
            website_sub_category_id: webSubCategoryId,
            userId: session.user.id,
            limit: 10,
          },
        }),
        getGeneral(`/liveClass/getAllLiveClassAvailable`, {
          params: {
            website_sub_category_id: webSubCategoryId,
            userId: session.user.id,
            limit: 10,
          },
        }),
        getGeneral(`/document/getDocumentTerbaru`, {
          params: {
            website_sub_category_id: webSubCategoryId,
            limit: 10,
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
      const doneTryouts = doneTryoutsRes?.data || [];
      const liveClasses = liveClassRes?.data || [];
      const documents = documentsRes?.data || [];
      const courses = coursesRes?.data || [];

      // Tryout history
      const tryoutHistory = report?.tryoutHistory?.history || [];

      // Calculate study time this week from recent tryout sessions
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const tryoutsThisWeek = tryoutHistory.filter((t: any) =>
        new Date(t.startTryout) > oneWeekAgo
      );
      const studyHoursThisWeek = Math.round(tryoutsThisWeek.reduce((sum: number, t: any) => {
        const durationStr = t.duration || "0:0";
        const [mins, secs] = durationStr.split(":").map(Number);
        return sum + (mins / 60);
      }, 0) * 10) / 10; // Round to 1 decimal place

      // Build learning progress
      const courseProgress = courses.slice(0, 5).map((course: any) => {
        const totalChapters = course.CourseChapter?.length || 0;
        const completedChapters = course.CourseChapter?.filter((ch: any) =>
          ch.CourseSubChapter?.every((sub: any) => sub.isCompleted)
        ).length || 0;
        const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

        return {
          id: course.id,
          name: course.name,
          category: course.Category?.name || "Umum",
          progress: Math.round(progress),
          totalChapters,
          completedChapters,
          thumbnail: getImageUrl(course.thumbnail || course.image, "course") || null,
          lastAccessed: course.updatedAt || course.createdAt,
        };
      });

// Combine upcoming and done tryouts (backend already sorted)
      const tryoutProgress = [...upcomingTryouts, ...doneTryouts].slice(0, 5).map((tryout: any) => {
        // Get user session from TryoutSessionParticipant (through TryoutSession)
        const userSession = tryout.TryoutSession?.[0]?.TryoutSessionParticipant?.[0];
        // Get result from TryoutResult
        const result = tryout.TryoutResult?.[0];
        let status: "completed" | "in-progress" | "not-started" = "not-started";
        if (userSession) {
          if (userSession.isDone) {
            status = "completed";
          } else {
            status = "in-progress";
          }
        }

        return {
          id: tryout.id,
          title: tryout.title,
          score: result?.totalScore || null,
          totalQuestions: tryout.TryoutSession?.reduce((sum: number, session: any) => sum + (session._count?.TryoutQuestion || 0), 0) || 0,
          answeredQuestions: result?.answeredQuestions || 0,
          status,
          thumbnail: getImageUrl(tryout.image, "tryout") || null,
          deadline: tryout.endDate,
        };
      });

      // Build recent activity from tryout history
      const recentActivity = tryoutHistory.slice(0, 10).map((item: any) => ({
        id: item.id,
        type: "tryout" as const,
        title: item.title,
        description: `Skor: ${item.score} • Peringkat: #${item.rank}/${item.totalParticipants}`,
        timestamp: item.finishedAt || item.createdAt || new Date().toISOString(),
        icon: "target",
      }));

      // Build upcoming schedule
      const upcomingScheduleData = {
        tryouts: upcomingTryouts.slice(0, 5).map((t: any) => ({
          id: t.id,
          title: t.title,
          startDate: t.startDate,
          endDate: t.endDate,
          thumbnail: getImageUrl(t.image, "tryout") || null,
          isPremium: t.accessType === "PREMIUM",
          totalQuestions: t.totalQuestion || 0,
        })),
        liveClasses: liveClasses.slice(0, 5).map((lc: any) => ({
          id: lc.id,
          title: lc.title,
          scheduleTime: lc.scheduleTime || lc.startDate,
          duration: lc.duration || 60,
          thumbnail: getImageUrl(lc.thumbnail || lc.image, "liveclass") || null,
          instructorName: lc.Instructor?.name || "Tutor",
          instructorAvatar: lc.Instructor?.image || null,
          isPremium: lc.accessType === "PREMIUM",
          isRegistered: false, // TODO: check registration status
        })),
      };

      // Build performance data - use tryout history from report
      const tryoutHistoryData = report?.tryoutHistory?.history || [];
      const isSNBT = websiteSubCategory?.name?.toUpperCase().includes('SNBT');
      console.log('Tryout History Data:', tryoutHistoryData, 'Is SNBT:', isSNBT); // Debug log

      const scoreHistory = tryoutHistoryData
        .filter((item: any) => {
          // Filter: must have show flag true and have a score
          const hasScore = (item.totalScore != null && item.totalScore > 0);
          console.log('Item:', item.Tryout?.title, 'Show:', item.show, 'Score:', item.totalScore, 'Pass:', hasScore);
          return item.show && hasScore;
        })
        .slice(-10) // Get last 10 tryouts
        .map((item: any, index: number, arr: any[]) => {
          // Calculate score: For SNBT, use average of subtests. For others, use totalScore
          let calculatedScore = item.totalScore || 0;

          if (isSNBT && item.TryoutSessionResult && item.TryoutSessionResult.length > 0) {
            // SNBT: Calculate average from subtests
            const subtestScores = item.TryoutSessionResult.map((session: any) => session.totalScore || 0);
            const totalSubtestScore = subtestScores.reduce((sum: number, score: number) => sum + score, 0);
            calculatedScore = Math.round(totalSubtestScore / subtestScores.length);
          }

          // Calculate rank change
          const previousRank = index > 0 ? arr[index - 1].rank : item.rank;
          const rankChange = previousRank - item.rank; // Positive = improved (rank went down in number)

          return {
            date: item.startTryout || item.createdAt,
            score: calculatedScore,
            tryoutTitle: item.Tryout?.title || 'Try Out',
            rank: item.rank || 0,
            totalParticipants: item.totalParticipants || 0,
            rankChange: index > 0 ? rankChange : 0,
          };
        });

      console.log('Score History:', scoreHistory); // Debug log

      // Filter valid tryouts (same filter as scoreHistory for consistency)
      const validTryouts = tryoutHistoryData.filter((item: any) => {
        const hasScore = (item.totalScore != null && item.totalScore > 0);
        return item.show && hasScore;
      });

      // Build recommendations
      const recommendedCourses = courses.slice(0, 4).map((course: any) => {
        const totalChapters = course.CourseChapter?.length || 0;
        const completedChapters = course.CourseChapter?.filter((ch: any) =>
          ch.CourseSubChapter?.every((sub: any) => sub.isCompleted)
        ).length || 0;
        const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

        return {
          id: course.id,
          name: course.name,
          category: course.Category?.name || "Umum",
          thumbnail: getImageUrl(course.thumbnail || course.image, "course") || null,
          progress: Math.round(progress),
          isLocked: false, // TODO: check lock status
          isPremium: course.accessType === "PREMIUM",
        };
      });

      const recommendedTryouts = upcomingTryouts.slice(0, 4).map((t: any) => ({
        id: t.id,
        title: t.title,
        thumbnail: getImageUrl(t.image, "tryout") || null,
        difficulty: t.difficulty || "Sedang",
        totalQuestions: t.totalQuestion || 0,
        isPremium: t.accessType === "PREMIUM",
      }));

      const recommendedDocuments = documents.slice(0, 4).map((d: any) => ({
        id: d.id,
        title: d.title || d.name,
        category: d.Category?.name || "Materi",
        thumbnail: getImageUrl(d.img, "document") || null,
        type: d.type || "PDF",
      }));

      // Build achievements (mock data for now)
      const achievements = [
        {
          id: "1",
          title: "Pemula Sejati",
          description: "Selesaikan tryout pertama kamu",
          icon: "star",
          isUnlocked: tryoutHistory.length > 0,
          unlockedAt: tryoutHistory[0]?.finishedAt || null,
          progress: Math.min(tryoutHistory.length, 1),
          target: 1,
        },
        {
          id: "2",
          title: "Konsisten",
          description: "Belajar selama 7 hari berturut-turut",
          icon: "flame",
          isUnlocked: false,
          unlockedAt: null,
          progress: 3,
          target: 7,
        },
        {
          id: "3",
          title: "Juara Kelas",
          description: "Raih peringkat 1 dalam tryout",
          icon: "trophy",
          isUnlocked: tryoutHistory.some((t: any) => t.rank === 1),
          unlockedAt: tryoutHistory.find((t: any) => t.rank === 1)?.finishedAt || null,
          progress: tryoutHistory.some((t: any) => t.rank === 1) ? 1 : 0,
          target: 1,
        },
        {
          id: "4",
          title: "Pembelajar Aktif",
          description: "Selesaikan 10 tryout",
          icon: "target",
          isUnlocked: tryoutHistory.length >= 10,
          unlockedAt: tryoutHistory.length >= 10 ? tryoutHistory[9]?.finishedAt : null,
          progress: Math.min(tryoutHistory.length, 10),
          target: 10,
        },
      ];

      // Get last tryout (most recent) for ranking - use validTryouts for consistency
      const lastTryout = validTryouts.length > 0 ? validTryouts[validTryouts.length - 1] : null;
      const previousTryout = validTryouts.length > 1 ? validTryouts[validTryouts.length - 2] : null;

      console.log('Valid Tryouts:', validTryouts.length); // Debug
      console.log('Last Valid Tryout:', lastTryout); // Debug
      console.log('Previous Valid Tryout:', previousTryout); // Debug
      console.log('Rank from last TO:', lastTryout?.rank);
      console.log('Total Participants:', lastTryout?.totalParticipants);
      console.log('Rank Change:', previousTryout ? (previousTryout.rank - (lastTryout?.rank || 0)) : 0);

      const dashboardData: DashboardData = {
        user: {
          name: session.user.name || "User",
          email: session.user.email || "",
          avatarUrl: session.user.image || null,
          tier: report?.userHeader?.status || "FREE",
          joinedDate: new Date().toISOString(),
          streak: 0, // TODO: calculate streak
        },
        stats: {
          studyHours: report?.studyHabits?.totalHoursStudied || 0,
          studyHoursThisWeek,
          totalScore: report?.learningReport?.totalScore || 0,
          averageScore: validTryouts.length > 0
            ? Math.round(validTryouts.reduce((sum: number, t: any) => {
                // For SNBT, use average of subtests; for others, use totalScore
                let score = t.totalScore || 0;
                if (isSNBT && t.TryoutSessionResult && t.TryoutSessionResult.length > 0) {
                  const subtestScores = t.TryoutSessionResult.map((session: any) => session.totalScore || 0);
                  const totalSubtestScore = subtestScores.reduce((s: number, val: number) => s + val, 0);
                  score = Math.round(totalSubtestScore / subtestScores.length);
                }
                return sum + score;
              }, 0) / validTryouts.length)
            : 0,
          rank: lastTryout?.rank || 0,
          rankFrom: lastTryout?.totalParticipants || 0,
          previousRank: previousTryout?.rank || 0,
          rankChange: previousTryout ? (previousTryout.rank - (lastTryout?.rank || 0)) : 0,
          tryoutsCompleted: validTryouts.length,
          coursesCompleted: courses.filter((c: any) => {
            const totalChapters = c.CourseChapter?.length || 0;
            const completedChapters = c.CourseChapter?.filter((ch: any) =>
              ch.CourseSubChapter?.every((sub: any) => sub.isCompleted)
            ).length || 0;
            return totalChapters > 0 && totalChapters === completedChapters;
          }).length,
          coursesInProgress: courses.filter((c: any) => {
            const totalChapters = c.CourseChapter?.length || 0;
            if (totalChapters === 0) return false; // Skip courses without chapters
            const completedChapters = c.CourseChapter?.filter((ch: any) =>
              ch.CourseSubChapter?.every((sub: any) => sub.isCompleted)
            ).length || 0;
            // Count as in-progress if has chapters and not fully completed
            return totalChapters > 0 && completedChapters < totalChapters;
          }).length,
          documentsRead: documents.length, // Count of available documents
          liveClassesAttended: liveClasses.length, // Count of available live classes (user can join)
        },
        learningProgress: {
          courses: courseProgress,
          tryouts: tryoutProgress,
        },
        recentActivity,
        upcomingSchedule: upcomingScheduleData,
        performanceData: {
          scoreHistory,
          studyTimeHistory: [], // TODO: implement study time tracking per day
        },
        recommendations: {
          courses: recommendedCourses,
          tryouts: recommendedTryouts,
          documents: recommendedDocuments,
        },
        achievements,
        subscription: {
          isPremium: report?.userHeader?.status === "SUBSCRIBER" || report?.userHeader?.status === "ADMIN",
          planName: report?.userHeader?.status === "SUBSCRIBER" ? "Premium" : "Free",
          planExpiresAt: report?.userHeader?.daysLeft
            ? new Date(Date.now() + report.userHeader.daysLeft * 24 * 60 * 60 * 1000).toISOString()
            : null,
          daysLeft: report?.userHeader?.daysLeft || null,
          features: report?.userHeader?.status === "SUBSCRIBER"
            ? ["Akses semua tryout", "Akses semua course", "AI Chat unlimited", "Live class premium"]
            : ["Tryout terbatas", "Course terbatas", "Fitur dasar"],
        },
      };

      setData(dashboardData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [webSubCategoryId, session?.user?.id, session?.user]);

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
        <p className="text-slate-500">Gagal memuat data dashboard</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-500 text-white rounded-3xl hover:bg-blue-600 transition-colors"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden pb-6 px-4 md:px-0">
      <div className="flex flex-col gap-4 lg:gap-6 min-w-0">
        {/* Hero Welcome Section */}
        <BimHeroWelcome
          user={data.user}
          stats={data.stats}
          subscription={data.subscription}
        />

        {/* Quick Access Menu */}
        <BimQuickAccessMenu />

        {/* Stats Overview Grid */}
        <BimQuickStatsOverview stats={data.stats} />

        {/* Main Content - 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 flex flex-col gap-4 lg:gap-6">
            {/* Learning Progress */}
            <BimLearningProgress
              courses={data.learningProgress.courses}
              tryouts={data.learningProgress.tryouts}
              liveClasses={data.upcomingSchedule.liveClasses}
            />

            {/* Performance Chart */}
            <BimPerformanceChart
              scoreHistory={data.performanceData.scoreHistory}
              studyTimeHistory={data.performanceData.studyTimeHistory}
            />

            {/* Recommended Content */}
            <BimRecommendedContent
              courses={data.recommendations.courses}
              tryouts={data.recommendations.tryouts}
              documents={data.recommendations.documents}
            />
          </div>

          {/* Right Column - 1/3 width */}
          <div className="flex flex-col gap-4 lg:gap-6">
            {/* Achievement Badges */}
            <BimAchievementBadges achievements={data.achievements} />

            {/* Upcoming Schedule */}
            <BimUpcomingSchedule
              tryouts={data.upcomingSchedule.tryouts}
              liveClasses={data.upcomingSchedule.liveClasses}
            />

            {/* Recent Activity */}
            <BimRecentActivity activities={data.recentActivity} />
          </div>
        </div>
      </div>
    </div>
  );
}
