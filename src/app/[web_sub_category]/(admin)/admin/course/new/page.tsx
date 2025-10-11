'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingPageWithText, { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { supabase } from '@/supabaseClient';
import { Category } from '@/types/database';
import 'katex/dist/katex.min.css';
import { ArrowLeft, Check, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import ChapterOption from './_component/chapter-option';
import SubChapterOption from './_component/sub-chapter-option';

export interface ChapterProps {
  title?: string;
  categoryId?: string;
  status?: 'PRIVATE' | 'PUBLIC';
  number?: number;
}

interface AnswerProps {
  answer: string;
  value: number;
}

export interface QuestionProps {
  number: number;
  question: string;
  image?: string | null;
  explanation?: string;
  subCategory?: string;
  subSubCategory?: string;
  Answers: AnswerProps[];
}

export interface SubChapterProps {
  number?: string;
  title?: string;
  spendTime?: number | string;
  type?: 'VIDEO' | 'DOCUMENT' | 'TRYOUT' | 'MATERI';
  description?: string;
  video?: string;
  premium?: boolean;
  document?: string;
  documentTitle?: string;
  materi?: string;
  status?: 'DRAFT' | 'PUBLISH' | 'UPCOMING';
  publishedAt?: Date | string;
  Questions: QuestionProps[];
}

const Index = () => {
  const router = useRouter();

  const [showDetailSubChapter, setShowDetailSubChapter] =
    useState<boolean>(true);
  const [currentIndexEdit, setCurrentIndexEdit] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [chapter, setChapter] = useState<ChapterProps | null>(null);
  const [subChapter, setSubChapter] = useState<SubChapterProps[]>([]);

  const EditSubChapter =
    currentIndexEdit !== null ? subChapter[currentIndexEdit] : null;
  const [assessmentType, setAssesmentType] = useState<string>('+5/0');

  const { mutate: createCourse, isLoading } = useMutation(
    '/course/createCourse',
    'post',
    {
      onSuccess() {
        toaster({
          title: 'Berhasil!',
          description: 'Kursus berhasil dibuat',
          condition: 'success',
          duration: 3000,
        });
        resetCourse({ deleteFile: false });
        router.push(`/${website_sub_category_id}/admin/course`);
      },
      onError({ message }) {
        toaster({
          title: 'Gagal!',
          description: message,
          condition: 'warning',
          duration: 3000,
        });
      },
    },
  );

  const { data: category, isLoading: isLoadingCategory } = useGet<Category[]>(
    '/category/getAllCategoryAdminCourse',
  );

  const resetCourse = async ({ deleteFile }: { deleteFile: boolean }) => {
    setChapter(null);
    setSubChapter([]);
    setAssesmentType('');
    localStorage.removeItem(`temporary-course`);
    if (deleteFile) {
      const fileDocument: string[] = [];
      const fileVideo: string[] = [];
      subChapter.forEach((sChapter) => {
        if (sChapter.document && sChapter.document.length > 0) {
          fileDocument.push(`course/${sChapter.document}`);
        }
        if (sChapter.video && sChapter.video.length > 0) {
          fileVideo.push(`course/${sChapter.video}`);
        }
      });
      if (fileDocument.length > 0) {
        await supabase.storage.from('pdf').remove(fileDocument);
      }
      if (fileVideo.length > 0) {
        await supabase.storage.from('video').remove(fileVideo);
      }
    }
  };

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
    const saveDataString = localStorage.getItem(`temporary-course`);
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
    if (chapter) {
      localStorage.setItem(`temporary-course`, JSON.stringify(saveData));
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

  const handleSubmit = () => {
    if (subChapter.length === 0)
      toaster({
        title: 'Error',
        description: 'Buat Minimal 1 Sub Chapter',
        condition: 'warning',
        duration: 3000,
      });
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
    if (showToast(checkTitleSubChapter)) return;
    if (showToast(checkSpendTimeSubChapter)) return;
    if (showToast(checkDescriptionSubChapter)) return;
    if (showToast(checkTypeSubChapter)) return;
    if (showToast(checkQuestion)) return;
    if (showToast(checkAnswers)) return;
    if (showToast(checkDocument)) return;
    if (showToast(checkVideo)) return;
    if (showToast(checkMateri)) return;

    if (!chapter?.categoryId) {
      showToast({ value: true, message: 'Pilih Course Kategori' });
      return;
    }
    if (chapter.status === undefined) {
      showToast({ value: true, message: 'Pilih Course Status' });
      return;
    }
    if (!chapter?.title) {
      showToast({ value: true, message: 'Masukan Judul Course' });
      return;
    }
    if (!chapter?.number) {
      showToast({ value: true, message: 'Masukan Number Course' });
      return;
    }

    const CourseSubChapter = subChapter.map((sChapter) => {
      return {
        title: sChapter.title || 'Default Title',
        number: (sChapter.number && parseInt(sChapter.number.toString())) || 0,
        description: sChapter.description || '',
        spendTime:
          (sChapter.spendTime && parseInt(sChapter.spendTime.toString())) || 0,
        premium: sChapter.premium !== undefined ? sChapter.premium : true,
        type: sChapter.type || 'TRYOUT',
        document: sChapter.document,
        video: sChapter.video,
        materi: sChapter.materi,
        status: sChapter.status,
        publishedAt:
          sChapter.publishedAt && sChapter.status === 'PUBLISH'
            ? sChapter.publishedAt
            : null,
        Questions: sChapter.Questions.map((quest) => {
          return {
            number: quest.number || 0,
            question: quest.question,
            image: quest.image,
            explanation: quest.explanation,
            subCategory: quest.subCategory,
            subSubCategory: quest.subSubCategory,
            TryoutAnswers: quest.Answers,
          };
        }),
      };
    });

    const course = {
      categoryId: chapter.categoryId,
      title: chapter.title,
      status: chapter.status,
      number: chapter.number,
      CourseSubChapter,
    };

    createCourse({ payload: course });
  };

  if (isLoadingCategory) {
    return <Spinner />;
  }

  // Calculate progress
  const getProgress = () => {
    let progress = 0;
    if (chapter?.title && chapter?.categoryId) progress += 25;
    if (chapter?.number && chapter?.status) progress += 25;
    if (subChapter.length > 0) progress += 25;
    if (subChapter.some((sc) => sc.title && sc.spendTime && sc.type))
      progress += 25;
    return progress;
  };

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
        heading="Menyimpan kursus..."
      />

      <div className=" bg-gray-50">
        {/* Simplified Header */}
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
                <div>
                  <h1 className="text-xl font-bold">
                    {chapter?.title || 'Kursus Baru'}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-32 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${getProgress()}%` }}
                      />
                    </div>
                    <span>{getProgress()}% selesai</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!canSave() || isLoading}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Simpan
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Simplified Layout */}
        <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Chapter Setup */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {chapter?.title && chapter?.categoryId ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                  )}
                  Setup Kursus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChapterOption
                  chapter={chapter}
                  subChapter={subChapter}
                  setSubChapter={setSubChapter}
                  setChapter={setChapter}
                  currentIndexEdit={currentIndexEdit}
                  setCurrentIndexEdit={setCurrentIndexEdit}
                  setQuestionIndex={setQuestionIndex}
                  isLoading={isLoading}
                  resetCourse={resetCourse}
                  category={category}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right: Sub Chapter Editor */}
          <div className="lg:col-span-2">
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
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">
                    Pilih Sub Chapter
                  </h3>
                  <p className="text-sm">
                    Pilih atau buat sub chapter untuk mulai editing
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
