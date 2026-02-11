// src/app/(user)/workspace-course/_component/NavigationButtons.tsx
'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import LoadingPageWithText from '@/components/ui/spinner';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProvider } from '../../_provider/provider';

const NavigationButtons = () => {
  const {
    useData: { CourseData },
  } = useProvider();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const params = useParams();
  const searchParams = useSearchParams();
  // const router = useRouter();

  const isDone = CourseData && CourseData.CourseProgress?.length > 0;
  const categoryId = params?.categoryId as string | undefined;
  const sub = searchParams?.get('sub');

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [prevLink, setPrevLink] = useState<string | undefined>(undefined);
  const [nextLink, setNextLink] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false); // Status lokal submit

  // const { mutate: saveProgress } = useMutation(
  //   '/course/saveProgressCourse',
  //   'post',
  //   {
  //     onSuccess() {
  //       // await trpc.course.getCourseUserByCategoryId.invalidate();
  //       setLoading(false);
  //       setSubmitted(true); // Tandai bahwa submit telah berhasil
  //     },
  //     onError() {
  //       setLoading(false);
  //     },
  //   },
  // );

  // const { data: courseChapters } = api.course.getCourseChapters.useQuery(
  //   { categoryId: categoryId! },
  //   { enabled: !!categoryId },
  // );

  const { data: courseChapters } = useGet('/course/getCourseChapters', {
    params: { categoryId: categoryId! },
    useEffectDependencies: [categoryId],
  });

  useEffect(() => {
    if (courseChapters) {
      setChapters(courseChapters);
      if (sub && Array.isArray(courseChapters)) {
        const allSubChapters = courseChapters.flatMap(
          (ch) => ch.CourseSubChapter,
        );
        const idx = allSubChapters.findIndex((sc) => sc.id === sub);
        setCurrentIndex(idx);
      }
    }
  }, [courseChapters, sub]);

  useEffect(() => {
    if (chapters.length && currentIndex !== null && categoryId) {
      const allSubChapters = chapters.flatMap((ch) => ch.CourseSubChapter);
      const currentTab = searchParams?.get('tab') || 'chat';
      if (currentIndex > 0) {
        setPrevLink(
          `/${website_sub_category_id_params}/user/bimcourse/${categoryId}/study?sub=${allSubChapters[currentIndex - 1].id}&tab=${currentTab}`,
        );
      } else {
        setPrevLink(undefined);
      }
      if (currentIndex < allSubChapters.length - 1) {
        setNextLink(
          `/${website_sub_category_id_params}/user/bimcourse/${categoryId}/study?sub=${allSubChapters[currentIndex + 1].id}&tab=${currentTab}`,
        );
      } else {
        const currentChapterIndex = chapters.findIndex((ch) =>
          ch.CourseSubChapter.some((sc: any) => sc.id === sub),
        );
        if (
          currentChapterIndex !== -1 &&
          currentChapterIndex < chapters.length - 1
        ) {
          const nextChapter = chapters[currentChapterIndex + 1];
          if (nextChapter.CourseSubChapter.length > 0) {
            setNextLink(
              `/${website_sub_category_id_params}/user/bimcourse/${categoryId}/study?sub=${nextChapter.CourseSubChapter[0].id}&tab=${currentTab}`,
            );
          } else {
            setNextLink(undefined);
          }
        } else {
          setNextLink(undefined);
        }
      }
    }
  }, [chapters, currentIndex, categoryId, sub]);

  // const handleNextClick = async () => {
  //   // Hanya melakukan submit jika progress belum selesai, belum submit sebelumnya, dan tidak sedang loading
  //   if (!isDone && !submitted && !loading) {
  //     setLoading(true);
  //     if (CourseData?.id) {
  //       await saveProgress({ payload: { subCourseId: CourseData?.id } });
  //     } else {
  //       toaster({
  //         title: 'Sub Id Tidak ada',
  //         condition: 'warning',
  //       });
  //       setLoading(false);
  //     }
  //   }
  //   if (nextLink) {
  //     router.push(nextLink);
  //   }
  // };

  if (sub === 'report') return null;
  if (!prevLink && !nextLink) return null;

  return (
    <footer>
      {loading && (
        <LoadingPageWithText
          loading={loading}
          heading="Menyimpan Progress..."
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-fit justify-between items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-1"
      >
        {prevLink && (
          <Link href={prevLink}>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Sebelumnya
            </Button>
          </Link>
        )}

        {nextLink && (
          <Link href={nextLink}>
            <Button
              disabled={loading}
              size="sm"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white border-0 font-medium shadow-sm hover:shadow-md transition-all duration-200 group text-xs',
                loading && 'opacity-50 cursor-not-allowed',
              )}
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : isDone || submitted ? (
                <>
                  Lanjutkan
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              ) : (
                <>
                  Selanjutnya
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </Button>
          </Link>
        )}
      </motion.div>
    </footer>
  );
};

export default NavigationButtons;
