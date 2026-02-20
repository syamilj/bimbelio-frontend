'use client';

import { Button } from '@/components/ui/button';
import { MultiSelectVisibleAt } from '@/components/ui/multi-select-visibleAt';
import LoadingPageWithText, { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { storage } from '@/supabaseClient';
import { Category } from '@/types/database';
import 'katex/dist/katex.min.css';
import { ArrowLeft, Check, Save } from 'lucide-react';
import LZString from 'lz-string';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChapterOption from './_component/chapter-option';
import SubChapterOption from './_component/sub-chapter-option';

export interface ChapterProps {
  id?: string;
  title?: string;
  categoryId?: string;
  status?: 'PRIVATE' | 'PUBLIC';
  number?: number;
}

interface AnswerProps {
  id?: string;
  answer: string;
  value: number;
}

export interface QuestionProps {
  id?: string;
  number: number;
  question: string;
  image?: string | null;
  explanation?: string;
  subCategory?: string;
  subSubCategory?: string;
  Answers: AnswerProps[];
}

export interface SubChapterProps {
  id?: string;
  number?: string;
  title?: string;
  spendTime?: number | string;
  type?: 'VIDEO' | 'DOCUMENT' | 'TRYOUT' | 'MATERI' | 'PROGRESS_TEST';
  description?: string;
  video?: string;
  premium?: boolean;
  document?: string;
  documentTitle?: string;
  materi?: string;
  image?: string | null;
  imageFile?: File | null;
  tryoutSessionId?: string;
  status?: 'DRAFT' | 'PUBLISH' | 'UPCOMING';
  publishedAt?: Date | string;
  Questions: QuestionProps[];
}

const Index = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = Array.isArray(params?.courseId)
    ? params.courseId[0]
    : (params?.courseId ?? '');

  const [visibleAtWebSubIds, setVisibleAtWebSubIds] = useState<string[]>([]);
  const [showDetailSubChapter, setShowDetailSubChapter] =
    useState<boolean>(true);
  const [currentIndexEdit, setCurrentIndexEdit] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [chapter, setChapter] = useState<ChapterProps | null>(null);
  const [subChapter, setSubChapter] = useState<SubChapterProps[]>([]);

  const EditSubChapter =
    currentIndexEdit !== null ? subChapter[currentIndexEdit] : null;
  const [assessmentType] = useState<string>('+5/0');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { mutate: updateCourse } = useMutation('/course/updateCourse', 'put', {
    onSuccess() {
      toaster({
        title: 'Berhasil!',
        description: 'Kursus berhasil diperbarui',
        condition: 'success',
        duration: 3000,
      });
      setIsLoading(false);
      localStorage.removeItem(`temporary-course-${courseId}`);
      router.push(`/${website_sub_category_id}/admin/course`);
    },
    onError({ message }) {
      setIsLoading(false);
      toaster({
        title: 'Gagal!',
        description: message,
        condition: 'warning',
        duration: 3000,
      });
    },
  });

  const { data: Course } = useGet('/course/getCourseForUpdate', {
    params: { courseId },
    useEffectDependencies: [courseId],
  });

  const { data: category, isLoading: isLoadingCategory } = useGet<Category[]>(
    '/category/getAllCategoryAdminCourse',
  );

  useEffect(() => {
    if (Course?.chapter && Course.subChapter) {
      setChapter(Course.chapter);
      setSubChapter(Course.subChapter);
    }
    if (Course?.visibleAtWebSubIds) {
      setVisibleAtWebSubIds(Course.visibleAtWebSubIds);
    }
  }, [Course]);

  useEffect(() => {
    if (assessmentType !== '') {
      setSubChapter((prev) =>
        prev.map((item, i: number) => {
          if (i === currentIndexEdit) {
            return { ...item, assessmentType: assessmentType };
          }
          return { ...item };
        }),
      );
    }
  }, [assessmentType]);

  useEffect(() => {
    // const saveDataString = localStorage.getItem(
    //   `temporary-course-${courseId}-${courseId}`,
    // );
    const saveDataString = LZString.decompress(
      localStorage.getItem(`temporary-course-${courseId}-${courseId}`) || '',
    );
    if (saveDataString) {
      const saveData = JSON.parse(saveDataString);
      setChapter({ ...saveData.chapter });
      setSubChapter([...saveData.subChapter]);
    }
    // document.body.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    const saveData = {
      chapter,
      subChapter,
    };
    const compressed = LZString.compress(JSON.stringify(saveData));
    if (chapter && compressed) {
      try {
        localStorage.setItem(
          `temporary-course-${courseId}-${courseId}`,
          compressed,
        );
      } catch (error) {
        console.error('Failed to save data to localStorage:', error);
      }
    }
  }, [chapter, subChapter]);

  const showToast = ({
    value,
    message,
  }: {
    value: boolean;
    message: string;
  }) => {
    if (value) {
      toaster({
        title: 'Error',
        description: message,
        condition: 'warning',
        duration: 3000,
      });
    }
    return value;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (subChapter.length === 0) {
      toaster({
        title: 'Error',
        description: 'Buat Minimal 1 Sub Chapter',
        condition: 'warning',
        duration: 3000,
      });
      setIsLoading(false);
      return;
    }
    let checkTitleSubChapter = { value: false, message: '' };
    let checkSpendTimeSubChapter = { value: false, message: '' };
    let checkDescriptionSubChapter = { value: false, message: '' };
    let checkTypeSubChapter = { value: false, message: '' };
    let checkQuestion = { value: false, message: '' };
    let checkAnswers = { value: false, message: '' };
    let checkDocument = { value: false, message: '' };
    let checkVideo = { value: false, message: '' };
    let checkMateri = { value: false, message: '' };

    subChapter.forEach((sChapter, index) => {
      if (!sChapter.title || sChapter.title.length === 0) {
        checkTitleSubChapter = {
          value: true,
          message: `Masukan Title SubChapter ke ${index + 1}`,
        };
      } else if (
        !sChapter.spendTime ||
        parseInt(sChapter.spendTime?.toString()) === 0
      ) {
        checkSpendTimeSubChapter = {
          value: true,
          message: `Masukan Lama Belajar SubChapter ke ${index + 1}`,
        };
      } else if (!sChapter.description || sChapter.description.length === 0) {
        checkDescriptionSubChapter = {
          value: true,
          message: `Masukan Deskripsi SubChapter ke ${index + 1}`,
        };
      } else if (!sChapter.type) {
        checkTypeSubChapter = {
          value: true,
          message: `Pilih Type SubChapter ke ${index + 1}`,
        };
      } else if (sChapter.status !== 'UPCOMING') {
        if (
          (sChapter.type === 'DOCUMENT' && !sChapter.document) ||
          sChapter.document?.length === 0
        ) {
          checkDocument = {
            value: true,
            message: `Pada sub chapter ${index + 1}, Document masih kosong`,
          };
        } else if (
          (sChapter.type === 'VIDEO' && !sChapter.video) ||
          sChapter.video?.length === 0
        ) {
          checkVideo = {
            value: true,
            message: `Pada sub chapter ${index + 1}, Video masih kosong`,
          };
        } else if (
          (sChapter.type === 'MATERI' && !sChapter.materi) ||
          sChapter.materi?.length === 0
        ) {
          checkMateri = {
            value: true,
            message: `Pada sub chapter ${index + 1}, Materi masih kosong`,
          };
        } else if (sChapter.type === 'TRYOUT') {
          sChapter.Questions.forEach((quest, qIndex) => {
            if (quest.question.length === 0) {
              checkQuestion = {
                value: true,
                message: `Pada sub chapter ${index + 1}, Soal ${qIndex + 1} masih kosong`,
              };
            }
            quest.Answers.forEach((answer) => {
              if (answer.answer.length === 0) {
                checkAnswers = {
                  value: true,
                  message: `Pada sub chapter ${index + 1}, Pada soal ${qIndex + 1} Jawaban masih ada yang kosong`,
                };
              }
            });
          });
        }
      }
    });
    if (showToast(checkTitleSubChapter)) {
      setIsLoading(false);
      return;
    }
    if (showToast(checkSpendTimeSubChapter)) {
      setIsLoading(false);
      return;
    }
    if (showToast(checkDescriptionSubChapter)) {
      setIsLoading(false);
      return;
    }
    if (showToast(checkTypeSubChapter)) {
      setIsLoading(false);
      return;
    }
    if (showToast(checkQuestion)) {
      setIsLoading(false);
      return;
    }
    if (showToast(checkAnswers)) {
      setIsLoading(false);
      return;
    }
    if (showToast(checkDocument)) {
      setIsLoading(false);
      return;
    }
    if (showToast(checkVideo)) {
      setIsLoading(false);
      return;
    }
    if (showToast(checkMateri)) {
      setIsLoading(false);
      return;
    }

    if (!chapter?.id) {
      setIsLoading(false);
      showToast({ value: true, message: 'ID Not Found!!' });
      return;
    }
    if (!chapter?.categoryId) {
      setIsLoading(false);
      showToast({ value: true, message: 'Pilih Course Kategori' });
      return;
    }
    if (chapter.status === undefined) {
      setIsLoading(false);
      showToast({ value: true, message: 'Pilih Course Status' });
      return;
    }
    if (!chapter?.title) {
      setIsLoading(false);
      showToast({ value: true, message: 'Masukan Judul Course' });
      return;
    }
    if (!chapter?.number) {
      setIsLoading(false);
      showToast({ value: true, message: 'Masukan Number Course' });
      return;
    }

    let subChapterData = subChapter;

    for (const sub of subChapterData) {
      if (sub.imageFile) {
        const newFilename = `${crypto.randomUUID().slice(0, 8)}`;
        const upload = await storage
          .from('img')
          .upload(`course/${newFilename}`, sub.imageFile);
        if (upload?.error) {
          toaster({
            title: 'Error',
            description:
              upload?.error?.message ||
              'Terjadi kesalahan saat mengupload gambar.',
            condition: 'warning',
          });
          setIsLoading(false);
          return;
        }
        if (sub.image) {
          const fileNameArray = sub.image.split(
            `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/course/`,
          );
          const fileName = fileNameArray[1] || null;
          if (fileName) {
            await storage.from('img').remove([`course/${fileName}`]);
          }
        }
        sub.image = `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/course/${newFilename}`;
      }
    }

    const CourseSubChapter = subChapter.map((sChapter) => {
      return {
        id: sChapter.id || 'new',
        title: sChapter.title || 'Default Title',
        number: (sChapter.number && parseInt(sChapter.number.toString())) || 0,
        description: sChapter.description || '',
        spendTime:
          (sChapter.spendTime && parseInt(sChapter.spendTime.toString())) || 0,
        type: sChapter.type || 'TRYOUT',
        tryoutSessionId: sChapter.tryoutSessionId,
        document: sChapter.document,
        premium: sChapter.premium !== undefined ? sChapter.premium : true,
        video: sChapter.video,
        materi: sChapter.materi,
        status: sChapter.status,
        image: sChapter.image || null,
        publishedAt:
          sChapter.publishedAt && sChapter.status === 'PUBLISH'
            ? sChapter.publishedAt
            : null,
        Questions: sChapter.Questions.map((quest) => {
          return {
            id: quest.id || 'new',
            number: quest.number || 0,
            question: quest.question,
            image: quest.image,
            explanation: quest.explanation,
            subCategory: quest.subCategory,
            subSubCategory: quest.subSubCategory,
            TryoutAnswers: quest.Answers.map((answer) => {
              return {
                id: answer.id || 'new',
                answer: answer.answer.toString(),
                value: answer.value,
              };
            }),
          };
        }),
      };
    });

    const course = {
      id: chapter.id,
      categoryId: chapter.categoryId,
      title: chapter.title,
      status: chapter.status,
      number: chapter.number,
      CourseSubChapter,
      visibleAtWebSubIds:
        visibleAtWebSubIds.length > 0 ? visibleAtWebSubIds : undefined,
    };

    updateCourse({ payload: course });
  };

  if (isLoadingCategory) {
    return <Spinner />;
  }

  const canSave = () => {
    return (
      chapter?.title &&
      chapter?.categoryId &&
      chapter?.number &&
      chapter?.status &&
      subChapter.length > 0 &&
      subChapter.every((sc) => sc.title && sc.spendTime && sc.type)
    );
  };

  return (
    <>
      <LoadingPageWithText
        loading={isLoading}
        heading="Menyimpan perubahan..."
      />

      {/* Top Header */}
      <div className="bg-white border-b sticky top-0 z-40 px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.back()}
            className="shrink-0 w-8 h-8 rounded-3xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-gray-900 truncate">
              Edit: {chapter?.title || 'Loading...'}
            </h1>
            <p className="text-xs text-gray-400">Edit kursus</p>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!canSave() || isLoading}
          size="sm"
          className="shrink-0 rounded-3xl gap-2"
        >
          <Save className="h-3.5 w-3.5" />
          {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>

      {/* Two-panel layout */}
      <div className="flex h-[calc(100vh-53px)] overflow-hidden">
        {/* Left panel — config + sub-chapter list */}
        <div className="w-80 shrink-0 border-r border-gray-100 bg-white flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <MultiSelectVisibleAt
              value={visibleAtWebSubIds}
              onValuesChange={setVisibleAtWebSubIds}
            />
            <ChapterOption
              chapter={chapter}
              subChapter={subChapter}
              setSubChapter={setSubChapter}
              setChapter={setChapter}
              currentIndexEdit={currentIndexEdit}
              setCurrentIndexEdit={setCurrentIndexEdit}
              setQuestionIndex={setQuestionIndex}
              isLoading={isLoading}
              category={category}
            />
          </div>
        </div>

        {/* Right panel — sub-chapter editor */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {currentIndexEdit !== null ? (
            <SubChapterOption
              EditSubChapter={EditSubChapter}
              setSubChapter={setSubChapter}
              currentIndexEdit={currentIndexEdit}
              setCurrentIndexEdit={setCurrentIndexEdit}
              showDetailSubChapter={showDetailSubChapter}
              setShowDetailSubChapter={setShowDetailSubChapter}
              assessmentType={assessmentType}
              questionIndex={questionIndex}
              setQuestionIndex={setQuestionIndex}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-7 w-7 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-gray-700 mb-1">
                  Pilih Sub Chapter
                </h3>
                <p className="text-sm text-gray-400">
                  Klik sub chapter di panel kiri untuk mulai edit
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
