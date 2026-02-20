// src/app/(user)/workspace-course/_component/NavigationButtons.tsx
'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useProvider } from '../../_provider/provider';

const NavigationButtons = () => {
  const {
    useData: { CourseData, Course, CourseRefetch, CourseProgressRefetch },
  } = useProvider();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isDone = CourseData && CourseData.CourseProgress?.length > 0;
  const sub = searchParams?.get('sub');

  const [prevLink, setPrevLink] = useState<string | undefined>(undefined);
  const [nextLink, setNextLink] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const allSubChapters = useMemo(() => {
    if (!Array.isArray(Course)) return [];
    return Course.flatMap((chapter) => chapter.CourseSubChapter || []);
  }, [Course]);

  const { mutate: saveProgress } = useMutation(
    '/course/saveProgressCourse',
    'post',
    {
      toast: {
        hideSuccess: true,
      },
      onSuccess: async () => {
        await CourseRefetch();
        await CourseProgressRefetch();
        setSubmitted(true);
      },
    },
  );

  useEffect(() => {
    if (!sub || allSubChapters.length === 0) {
      setPrevLink(undefined);
      setNextLink(undefined);
      return;
    }

    const currentIndex = allSubChapters.findIndex((item) => item.id === sub);
    const currentTab = searchParams?.get('tab') || 'chat';

    if (currentIndex === -1) {
      setPrevLink(undefined);
      setNextLink(undefined);
      return;
    }

    setPrevLink(
      currentIndex > 0
        ? `${pathname}?sub=${allSubChapters[currentIndex - 1].id}&tab=${currentTab}`
        : undefined,
    );

    setNextLink(
      currentIndex < allSubChapters.length - 1
        ? `${pathname}?sub=${allSubChapters[currentIndex + 1].id}&tab=${currentTab}`
        : undefined,
    );
  }, [allSubChapters, pathname, searchParams, sub]);

  const submitCurrentProgress = async () => {
    if (!CourseData?.id) {
      toaster({
        title: 'Gagal',
        description: 'Sub chapter tidak ditemukan.',
        condition: 'warning',
      });
      return false;
    }

    const result = await saveProgress({
      payload: { subCourseId: CourseData.id },
    });
    if (!result || result.status >= 400) {
      return false;
    }
    setSubmitted(true);
    return true;
  };

  useEffect(() => {
    setSubmitted(false);
  }, [sub]);

  const handleNextClick = async () => {
    if (!nextLink || loading) return;

    if (!isDone && !submitted) {
      setLoading(true);
      const saved = await submitCurrentProgress();
      setLoading(false);
      if (!saved) return;
    }

    router.push(nextLink);
  };

  const handlePrevClick = () => {
    if (!prevLink || loading) return;
    router.push(prevLink);
  };

  if (sub === 'report') return null;
  if (!prevLink && !nextLink) return null;

  return (
    <footer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex w-fit justify-between items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-1"
      >
        {prevLink && (
          <Button
            onClick={handlePrevClick}
            variant="outline"
            size="sm"
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-xs md:text-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sebelumnya
          </Button>
        )}

        {nextLink && (
          <Button
            onClick={handleNextClick}
            disabled={loading}
            size="sm"
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white border-0 font-medium shadow-sm hover:shadow-md transition-all duration-200 group text-xs md:text-sm',
              loading && 'opacity-50 cursor-not-allowed',
            )}
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            {loading ? (
              <>
                <Spinner />
                Menyimpan...
              </>
            ) : (
              <>
                Selanjutnya
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        )}
      </motion.div>
    </footer>
  );
};

export default NavigationButtons;
