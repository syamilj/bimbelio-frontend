//src/components/workspace-course/_component/submit-course.tsx
import LoadingPageWithText from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { IconCheckList } from '@/styles/icon';

import { useState } from 'react';

const SubmitCourse = ({ subCourseId }: { subCourseId: string }) => {
  // const subCourseId = Array.isArray(query.sub)
  //   ? query.sub[0]
  //   : query.sub || null;

  const [loading, setLoading] = useState<boolean>(false);

  // const trpc = api.useUtils();

  // const { mutateAsync: saveProgress } =
  //   api.course.saveProgressCourse.useMutation({
  //     onSuccess: async () => {
  //       await trpc.course.getCourseUserByCategoryId.invalidate();
  //       setLoading(false);
  //       toaster({
  //         title: 'Success',
  //         condition: 'success',
  //         description: 'Berhasil Menyimpan Progress',
  //         duration: 2000,
  //       });
  //     },
  //     onError() {
  //       toaster({
  //         title: 'Error',
  //         condition: 'warning',
  //         description: 'Gagal Menyimpan Progress',
  //         duration: 2000,
  //       });
  //       setLoading(false);
  //     },
  //   });

  const { mutate: saveProgress } = useMutation(
    '/course/saveProgressCourse',
    'post',
    {
      payload: { subCourseId },
      onSuccess: async () => {
        // await trpc.course.getCourseUserByCategoryId.invalidate();
        setLoading(false);
      },
      onError() {
        setLoading(false);
      },
    },
  );

  const handleSubmit = () => {
    // const subCourseId = query.sub || null;
    setLoading(true);

    console.log('sub', subCourseId);

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
      <div
        className="flex w-fit cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-greenUpgrade px-[1rem] py-[.7rem] text-[.9rem] text-white duration-300 active:bg-greenUpgradeHover md:hover:bg-greenUpgradeHover md:active:bg-greenUpgrade"
        onClick={() => {
          handleSubmit();
        }}
      >
        <p>Selesai</p>
        <IconCheckList />
      </div>
    </>
  );
};

export default SubmitCourse;
