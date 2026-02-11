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
        size="sm"
        className="rounded-lg px-3 py-1.5 text-xs font-medium text-white border-0 shadow-sm hover:shadow transition-all duration-200"
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      >
        <CheckCircle className="w-3.5 h-3.5 mr-1" />
        Selesai
      </Button>
    </>
  );
};

export default SubmitCourse;
