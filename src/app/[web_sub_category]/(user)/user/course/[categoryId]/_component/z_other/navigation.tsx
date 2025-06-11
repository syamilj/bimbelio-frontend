// src/app/(user)/workspace-course/_component/NavigationButtons.tsx
'use client';

import { Button } from '@/components/ui/button';
import LoadingPageWithText from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useProvider } from '../../_provider/provider';
import { Data } from '../../page';

interface NavigationButtonsProps {
  data: Data;
}

const NavigationButtons = () => {
  const {
    useData: { CourseData },
  } = useProvider();

  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isDone = CourseData && CourseData.CourseProgress?.length > 0;
  const categoryId = params?.categoryId as string | undefined;
  const sub = searchParams?.get('sub');

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [prevLink, setPrevLink] = useState<string | undefined>(undefined);
  const [nextLink, setNextLink] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false); // Status lokal submit

  const { mutate: saveProgress } = useMutation(
    '/course/saveProgressCourse',
    'post',
    {
      onSuccess() {
        // await trpc.course.getCourseUserByCategoryId.invalidate();
        setLoading(false);
        setSubmitted(true); // Tandai bahwa submit telah berhasil
      },
      onError() {
        setLoading(false);
      },
    },
  );

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
      if (currentIndex > 0) {
        setPrevLink(
          `/${website_sub_category_id_params}/user/course/${categoryId}?sub=${allSubChapters[currentIndex - 1].id}`,
        );
      } else {
        setPrevLink(undefined);
      }
      if (currentIndex < allSubChapters.length - 1) {
        setNextLink(
          `/${website_sub_category_id_params}/user/course/${categoryId}?sub=${allSubChapters[currentIndex + 1].id}`,
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
              `/${website_sub_category_id_params}/user/course/${categoryId}?sub=${nextChapter.CourseSubChapter[0].id}`,
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

  const handleNextClick = async () => {
    // Hanya melakukan submit jika progress belum selesai, belum submit sebelumnya, dan tidak sedang loading
    if (!isDone && !submitted && !loading) {
      setLoading(true);
      if (CourseData?.id) {
        await saveProgress({ payload: { subCourseId: CourseData?.id } });
      } else {
        toaster({
          title: 'Sub Id Tidak ada',
          condition: 'warning',
        });
        setLoading(false);
      }
    }
    if (nextLink) {
      router.push(nextLink);
    }
  };

  if (sub === 'report') return null;

  return (
    <footer>
      {loading && (
        <LoadingPageWithText
          loading={loading}
          heading="Menyimpan Progress..."
        />
      )}
      <div className="flex w-fit justify-between items-center gap-6">
        {prevLink ? (
          <Link href={prevLink}>
            <Button className="px-4 py-2 bg-main-gray-disabled text-white rounded-full hover:bg-main-gray-disabled/95">
              ← Sebelumnya
            </Button>
          </Link>
        ) : (
          <div />
        )}
        {nextLink ? (
          <Button
            onClick={handleNextClick}
            className="px-4 py-2 bg-main text-white rounded-full hover:bg-main/90"
            disabled={loading}
          >
            Selanjutnya →
          </Button>
        ) : (
          <div />
        )}
      </div>
    </footer>
  );
};

export default NavigationButtons;
