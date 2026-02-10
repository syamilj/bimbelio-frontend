'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useCallback, useEffect, useState } from 'react';
import { type DashboardData, getImageUrl } from './dashboard-types';

/**
 * Custom hook that fetches and transforms all dashboard data.
 * Extracts the massive data layer from DashboardClientNew.
 */
export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  const { data: session } = useSession();
  const { websiteSubCategory, id: webSubCategoryId } = useWebsiteSubCategory();

  const fetchDashboardData = useCallback(async () => {
    if (!webSubCategoryId || !session?.user?.id) return;

    try {
      setLoading(true);

      const [reportRes, tryoutsRes, liveClassRes, documentsRes, coursesRes] =
        await Promise.all([
          getGeneral(`/report/getReportData`, {
            params: {
              userId: session.user.id,
              website_sub_category_id: webSubCategoryId,
            },
          }),
          getGeneral(`/tryout/getTryOutCardUpcoming2`, {
            params: {
              website_sub_category_id: webSubCategoryId,
              userId: session.user.id,
              take: 10,
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
      const tryoutsData = tryoutsRes?.data || [];
      const liveClasses = liveClassRes?.data || [];
      const documents = documentsRes?.data || [];
      const courses = coursesRes?.data || [];

      // Tryout history
      const tryoutHistory = report?.tryoutHistory?.history || [];

      // Calculate study time this week from recent tryout sessions
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const tryoutsThisWeek = tryoutHistory.filter(
        (t: any) => new Date(t.startTryout) > oneWeekAgo,
      );
      const studyHoursThisWeek =
        Math.round(
          tryoutsThisWeek.reduce((sum: number, t: any) => {
            const durationStr = t.duration || '0:0';
            const [mins] = durationStr.split(':').map(Number);
            return sum + mins / 60;
          }, 0) * 10,
        ) / 10;

      // Build learning progress
      const courseProgress = courses.slice(0, 5).map((course: any) => {
        const totalChapters = course.CourseChapter?.length || 0;
        const completedChapters =
          course.CourseChapter?.filter((ch: any) =>
            ch.CourseSubChapter?.every((sub: any) => sub.isCompleted),
          ).length || 0;
        const progress =
          totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

        return {
          id: course.id,
          name: course.name,
          category: course.Category?.name || 'Umum',
          progress: Math.round(progress),
          totalChapters,
          completedChapters,
          thumbnail:
            getImageUrl(course.thumbnail || course.image, 'course') || null,
          lastAccessed: course.updatedAt || course.createdAt,
        };
      });

      // Map tryout data
      const tryoutProgress = tryoutsData.slice(0, 10).map((tryout: any) => {
        let status: 'completed' | 'in-progress' | 'not-started' = 'not-started';
        if (tryout.isDone) {
          status = 'completed';
        } else if (tryout.isActive || tryout.isJoin) {
          status = 'in-progress';
        }

        const totalQuestions =
          tryout.TryoutSession?.reduce(
            (sum: number, ses: any) =>
              sum + (ses._count?.TryoutQuestion || 0),
            0,
          ) || 0;

        return {
          id: tryout.id,
          title: tryout.title,
          score: null,
          totalQuestions,
          answeredQuestions: 0,
          status,
          thumbnail: getImageUrl(tryout.image, 'tryout') || null,
          deadline: tryout.endDate,
        };
      });

      // Build recent activity from tryout history
      const recentActivity = tryoutHistory.slice(0, 10).map((item: any) => ({
        id: item.id,
        type: 'tryout' as const,
        title: item.title,
        description: `Skor: ${item.score} • Peringkat: #${item.rank}/${item.totalParticipants}`,
        timestamp:
          item.finishedAt || item.createdAt || new Date().toISOString(),
        icon: 'target',
      }));

      // Build upcoming schedule
      const upcomingScheduleData = {
        tryouts: tryoutsData.slice(0, 5).map((t: any) => ({
          id: t.id,
          title: t.title,
          startDate: t.startDate,
          endDate: t.endDate,
          thumbnail: getImageUrl(t.image, 'tryout') || null,
          isPremium: false,
          totalQuestions:
            t.TryoutSession?.reduce(
              (sum: number, s: any) => sum + (s._count?.TryoutQuestion || 0),
              0,
            ) || 0,
        })),
        liveClasses: liveClasses.slice(0, 5).map((lc: any) => ({
          id: lc.id,
          title: lc.title,
          scheduleTime: lc.scheduleTime || lc.startDate,
          duration: lc.duration || 60,
          thumbnail: getImageUrl(lc.thumbnail || lc.image, 'liveclass') || null,
          instructorName: lc.Instructor?.name || 'Tutor',
          instructorAvatar: lc.Instructor?.image || null,
          isPremium: lc.accessType === 'PREMIUM',
          isRegistered: false,
        })),
      };

      // Build performance data
      const tryoutHistoryData = report?.tryoutHistory?.history || [];
      const isSNBT = websiteSubCategory?.name?.toUpperCase().includes('SNBT');

      const scoreHistory = tryoutHistoryData
        .filter((item: any) => {
          const hasScore = item.totalScore != null && item.totalScore > 0;
          return item.show && hasScore;
        })
        .slice(-10)
        .map((item: any, index: number, arr: any[]) => {
          let calculatedScore = item.totalScore || 0;

          if (
            isSNBT &&
            item.TryoutSessionResult &&
            item.TryoutSessionResult.length > 0
          ) {
            const subtestScores = item.TryoutSessionResult.map(
              (ses: any) => ses.totalScore || 0,
            );
            const totalSubtestScore = subtestScores.reduce(
              (sum: number, score: number) => sum + score,
              0,
            );
            calculatedScore = Math.round(
              totalSubtestScore / subtestScores.length,
            );
          }

          const previousRank = index > 0 ? arr[index - 1].rank : item.rank;
          const rankChange = previousRank - item.rank;

          return {
            date: item.startTryout || item.createdAt,
            score: calculatedScore,
            tryoutTitle: item.Tryout?.title || 'Try Out',
            rank: item.rank || 0,
            totalParticipants: item.totalParticipants || 0,
            rankChange: index > 0 ? rankChange : 0,
          };
        });

      // Filter valid tryouts
      const validTryouts = tryoutHistoryData.filter((item: any) => {
        const hasScore = item.totalScore != null && item.totalScore > 0;
        return item.show && hasScore;
      });

      // Build recommendations
      const recommendedCourses = courses.slice(0, 4).map((course: any) => {
        const totalChapters = course.CourseChapter?.length || 0;
        const completedChapters =
          course.CourseChapter?.filter((ch: any) =>
            ch.CourseSubChapter?.every((sub: any) => sub.isCompleted),
          ).length || 0;
        const progress =
          totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

        return {
          id: course.id,
          name: course.name,
          category: course.Category?.name || 'Umum',
          thumbnail:
            getImageUrl(course.thumbnail || course.image, 'course') || null,
          progress: Math.round(progress),
          isLocked: false,
          isPremium: course.accessType === 'PREMIUM',
        };
      });

      const recommendedTryouts = tryoutsData.slice(0, 4).map((t: any) => ({
        id: t.id,
        title: t.title,
        thumbnail: getImageUrl(t.image, 'tryout') || null,
        difficulty: 'Sedang',
        totalQuestions:
          t.TryoutSession?.reduce(
            (sum: number, s: any) => sum + (s._count?.TryoutQuestion || 0),
            0,
          ) || 0,
        isPremium: false,
      }));

      const recommendedDocuments = documents.slice(0, 4).map((d: any) => ({
        id: d.id,
        title: d.title || d.name,
        category: d.Category?.name || 'Materi',
        thumbnail: getImageUrl(d.img, 'document') || null,
        type: d.type || 'PDF',
      }));

      // Build achievements
      const achievements = [
        {
          id: '1',
          title: 'Pemula Sejati',
          description: 'Selesaikan tryout pertama kamu',
          icon: 'star',
          isUnlocked: tryoutHistory.length > 0,
          unlockedAt: tryoutHistory[0]?.finishedAt || null,
          progress: Math.min(tryoutHistory.length, 1),
          target: 1,
        },
        {
          id: '2',
          title: 'Konsisten',
          description: 'Belajar selama 7 hari berturut-turut',
          icon: 'flame',
          isUnlocked: false,
          unlockedAt: null,
          progress: 3,
          target: 7,
        },
        {
          id: '3',
          title: 'Juara Kelas',
          description: 'Raih peringkat 1 dalam tryout',
          icon: 'trophy',
          isUnlocked: tryoutHistory.some((t: any) => t.rank === 1),
          unlockedAt:
            tryoutHistory.find((t: any) => t.rank === 1)?.finishedAt || null,
          progress: tryoutHistory.some((t: any) => t.rank === 1) ? 1 : 0,
          target: 1,
        },
        {
          id: '4',
          title: 'Pembelajar Aktif',
          description: 'Selesaikan 10 tryout',
          icon: 'target',
          isUnlocked: tryoutHistory.length >= 10,
          unlockedAt:
            tryoutHistory.length >= 10 ? tryoutHistory[9]?.finishedAt : null,
          progress: Math.min(tryoutHistory.length, 10),
          target: 10,
        },
      ];

      // Get last tryout for ranking
      const lastTryout =
        validTryouts.length > 0 ? validTryouts[validTryouts.length - 1] : null;
      const previousTryout =
        validTryouts.length > 1 ? validTryouts[validTryouts.length - 2] : null;

      const dashboardData: DashboardData = {
        user: {
          name: session.user.name || 'User',
          email: session.user.email || '',
          avatarUrl: session.user.image || null,
          tier: report?.userHeader?.status || 'FREE',
          joinedDate: new Date().toISOString(),
          streak: 0,
        },
        stats: {
          studyHours: report?.studyHabits?.totalHoursStudied || 0,
          studyHoursThisWeek,
          totalScore: report?.learningReport?.totalScore || 0,
          averageScore:
            validTryouts.length > 0
              ? Math.round(
                  validTryouts.reduce((sum: number, t: any) => {
                    let score = t.totalScore || 0;
                    if (
                      isSNBT &&
                      t.TryoutSessionResult &&
                      t.TryoutSessionResult.length > 0
                    ) {
                      const subtestScores = t.TryoutSessionResult.map(
                        (ses: any) => ses.totalScore || 0,
                      );
                      const totalSubtestScore = subtestScores.reduce(
                        (s: number, val: number) => s + val,
                        0,
                      );
                      score = Math.round(
                        totalSubtestScore / subtestScores.length,
                      );
                    }
                    return sum + score;
                  }, 0) / validTryouts.length,
                )
              : 0,
          rank: lastTryout?.rank || 0,
          rankFrom: lastTryout?.totalParticipants || 0,
          previousRank: previousTryout?.rank || 0,
          rankChange: previousTryout
            ? previousTryout.rank - (lastTryout?.rank || 0)
            : 0,
          tryoutsCompleted: validTryouts.length,
          coursesCompleted: courses.filter((c: any) => {
            const totalChapters = c.CourseChapter?.length || 0;
            const completedChapters =
              c.CourseChapter?.filter((ch: any) =>
                ch.CourseSubChapter?.every((sub: any) => sub.isCompleted),
              ).length || 0;
            return totalChapters > 0 && totalChapters === completedChapters;
          }).length,
          coursesInProgress: courses.filter((c: any) => {
            const totalChapters = c.CourseChapter?.length || 0;
            if (totalChapters === 0) return false;
            const completedChapters =
              c.CourseChapter?.filter((ch: any) =>
                ch.CourseSubChapter?.every((sub: any) => sub.isCompleted),
              ).length || 0;
            return totalChapters > 0 && completedChapters < totalChapters;
          }).length,
          documentsRead: documents.length,
          liveClassesAttended: liveClasses.length,
        },
        learningProgress: {
          courses: courseProgress,
          tryouts: tryoutProgress,
        },
        recentActivity,
        upcomingSchedule: upcomingScheduleData,
        performanceData: {
          scoreHistory,
          studyTimeHistory: [],
        },
        recommendations: {
          courses: recommendedCourses,
          tryouts: recommendedTryouts,
          documents: recommendedDocuments,
        },
        achievements,
        subscription: {
          isPremium:
            report?.userHeader?.status === 'SUBSCRIBER' ||
            report?.userHeader?.status === 'ADMIN',
          planName:
            report?.userHeader?.status === 'SUBSCRIBER' ? 'Premium' : 'Free',
          planExpiresAt: report?.userHeader?.daysLeft
            ? new Date(
                Date.now() + report.userHeader.daysLeft * 24 * 60 * 60 * 1000,
              ).toISOString()
            : null,
          daysLeft: report?.userHeader?.daysLeft || null,
          features:
            report?.userHeader?.status === 'SUBSCRIBER'
              ? [
                  'Akses semua tryout',
                  'Akses semua course',
                  'AI Chat unlimited',
                  'Live class premium',
                ]
              : ['Tryout terbatas', 'Course terbatas', 'Fitur dasar'],
        },
      };

      setData(dashboardData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [webSubCategoryId, session?.user?.id, session?.user, websiteSubCategory?.name]);

  useEffect(() => {
    if (session) {
      fetchDashboardData();
    }
  }, [session, fetchDashboardData]);

  return { data, loading, refetch: fetchDashboardData };
}
