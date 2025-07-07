import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import LoadingPageWithText from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useProvider } from '../../_provider/provider';

const SubmitCourse = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const {
    useData: { CourseRefetch, CourseData, CourseProgressRefetch },
  } = useProvider();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const subCourseId = CourseData?.id;
  const [loading, setLoading] = useState<boolean>(false);

  const { mutate: saveProgress } = useMutation(
    '/course/saveProgressCourse',
    'post',
    {
      payload: { subCourseId },
      onSuccess: async () => {
        await CourseRefetch();
        setLoading(false);
        await CourseProgressRefetch();
        // toaster({
        //   title: 'Berhasil!',
        //   condition: 'success',
        //   description: 'Progress berhasil disimpan',
        //   duration: 2000,
        // });
      },
      onError() {
        setLoading(false);
        // toaster({
        //   title: 'Gagal',
        //   condition: 'warning',
        //   description: 'Gagal menyimpan progress',
        //   duration: 2000,
        // });
      },
    },
  );

  const handleSubmit = () => {
    setLoading(true);

    if (subCourseId) {
      saveProgress();
    } else {
      toaster({
        title: 'Sub Id Tidak ada',
        condition: 'warning',
      });
      setLoading(false);
    }
  };

  return (
    <>
      <LoadingPageWithText
        loading={loading}
        heading="Menyimpan Progress..."
      />

      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="group relative rounded-xl px-6 py-3 font-semibold text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-shimmer" />

        <div className="relative flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>Selesai</span>
        </div>
      </Button>

      {/* Custom CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
};

export default SubmitCourse;
