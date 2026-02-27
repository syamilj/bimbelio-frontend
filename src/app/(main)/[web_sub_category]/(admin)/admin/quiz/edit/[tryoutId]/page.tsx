'use client';

import { Button } from '@/components/ui/button';
import LoadingPageWithText from '@/components/ui/spinner';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response, responseError } from '@/lib/response';
import { cn, getDateHourStr } from '@/lib/utils';
import {
  CourseChapter,
  Pivot_TryoutQuestion_CourseChapter,
  QuizVolume,
  Tryout,
  TryoutAnswer,
  TryoutQuestion,
  TryoutSession,
  TryoutSubCategory,
} from '@/types/database';
import 'katex/dist/katex.min.css';
import { ChevronLeft, Loader2 } from 'lucide-react';
import LZString from 'lz-string';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { EditQuizTryoutContext } from '../../_component/provider-edit-tryout';
import SessionOption from './_components/session-option';
import TryoutOption from './_components/tryout-option';

export interface TryoutProps {
  id?: string;
  title?: string;
  restTime?: number;
  status?: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
  startDate?: string;
  endDate?: string;
  image?: string | null;
  resultDate?: string;
  instagram?: string | null;
  tiktok?: string | null;
  updateAt?: string;
}

interface AnswerProps {
  id?: string;
  answer: string;
  value: number;
  image?: string | null;
}

export interface QuestionProps {
  id?: string;
  number: number;
  question: string;
  image?: string | null;
  explanation?: string;
  subCategory?: string;
  subSubCategory?: string;
  categoryId?: string;
  courseChapterIds: string[];
  Answers: AnswerProps[];
}

export interface SessionProps {
  id?: string;
  tryoutId?: string;
  categoryId?: string;
  category?: string;
  subCategoryId?: string;
  subCategory?: string;
  documentId?: string | null;
  name?: string;
  slug?: string;
  description?: string;
  duration?: number | string;
  thresholdValue?: number;
  assessmentType?: string;
  Questions: QuestionProps[];
}

export interface Category {
  image: string | null;
  id: string;
  description: string | null;
  createAt: Date;
  updateAt: Date;
  name: string;
  slug: string;
  TryoutSubCategory: TryoutSubCategory[];
}

type TryoutDataType = Tryout & {
  TryoutSession: (TryoutSession & {
    TryoutQuestion: (TryoutQuestion & {
      TryoutAnswers: TryoutAnswer[];
      Pivot_TryoutQuestion_CourseChapter: (Pivot_TryoutQuestion_CourseChapter & {
        CourseChapter: CourseChapter & {
          Category: Category;
        };
      })[];
    })[];
  })[];
  QuizVolume: QuizVolume | null;
};

const NewTryOut = () => {
  const params = useParams();
  const tryoutId = Array.isArray(params?.tryoutId)
    ? params.tryoutId[0]
    : (params?.tryoutId ?? '');

  const [selectedQuizVolume, setSelectedQuizVolume] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [assessmentType, setAssesmentType] = useState<string>('0-100');

  const [showDetailTryout, setShowDetailTryout] = useState<boolean>(true);

  const [currentIndexEdit, setCurrentIndexEdit] = useState<number | null>(0);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const [tryout, setTryout] = useState<TryoutProps | null>(null);
  const [sessions, setSessions] = useState<SessionProps>({
    categoryId: '',
    name: '',
    description: '',
    duration: 0,
    thresholdValue: 0,
    assessmentType: '0-100',
    Questions: [],
  });

  const [startDate, setStartDate] = useState<string>('');
  const [startDateTime, setStartDateTime] = useState<string>('');

  const [endDate, setEndDate] = useState<string>('');
  const [endDateTime, setEndDateTime] = useState<string>('');

  const [resultDate, setResultDate] = useState<string>('');
  const [resultDateTime, setResultDateTime] = useState<string>('');

  const EditSession = sessions;

  const [isTryoutUpdated, setIsTryoutUpdated] = useState<{
    value: boolean;
    dbs: any;
    temporary: any;
    temporary_quiz_volume?: any;
  }>({
    value: false,
    dbs: null,
    temporary: null,
    temporary_quiz_volume: null,
  });

  // const trpc = api.useUtils();
  // const { data: category, isLoading: isLoadingCategory } =
  //   api.tryoutCategory.getCategory.useQuery(undefined, {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   });

  const [category, setCategory] = useState<Category[]>([]);
  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(true);

  useEffect(() => {
    axiosInstance
      .get('/tryoutCategory/getCategory')
      .then((res) => {
        const resData = response(res);
        setCategory(resData.data);
      })
      .finally(() => {
        setIsLoadingCategory(false);
      });
  }, []);

  // const { data: tryoutData, isLoading: isLoadingTryout } =
  //   api.tryout.getTryoutForUpdate.useQuery(
  //     { id: tryoutId },
  //     { refetchOnWindowFocus: false }
  //   );
  // const [tryoutData, setTryoutData] = useState<any>();
  const [isLoadingTryout, setIsLoadingTryout] = useState<boolean>(true);

  const getTryoutForUpdate = async () => {
    try {
      setIsLoadingTryout(true);
      const res = await axiosInstance.get(
        `/tryout/getTryoutForUpdate?id=${tryoutId}`,
      );
      const resData = response(res);
      return resData.data;
    } catch (error) {
      responseError(error, true);
    } finally {
      setIsLoadingTryout(false);
    }
  };

  const getTryoutFromDbs = (tryoutData: TryoutDataType) => {
    if (!tryoutData) return;

    console.log({ QuizVolume: tryoutData.QuizVolume });
    if (tryoutData.QuizVolume) {
      setSelectedQuizVolume({
        id: tryoutData.QuizVolume.id,
        name: tryoutData.QuizVolume.title || '',
      });
    }

    const session = tryoutData.TryoutSession[0];
    const getCategory = category.find((item) => item.id === session.categoryId);
    const getSubCategory = getCategory?.TryoutSubCategory.find(
      (item) => item.id === session.subCategoryId,
    );

    const sessionData = {
      id: session.id,
      tryoutId: session.tryoutId,
      categoryId: session.categoryId,
      category: getCategory?.name,
      subCategoryId: session.subCategoryId,
      subCategory: getSubCategory?.name,
      documentId: session.documentId,
      name: session.name,
      slug: session.slug,
      description: session.description ?? undefined,
      duration: session.duration,
      thresholdValue: session.thresholdValue ?? undefined,
      assessmentType: session.assessmentType,
      Questions: session.TryoutQuestion.map((question) => {
        return {
          id: question.id,
          number: question.number,
          question: question.question,
          image: question.image,
          explanation: question.explanation ?? undefined,
          subCategory: question.subCategory ?? undefined,
          subSubCategory: question.subSubCategory ?? undefined,
          categoryId:
            question.Pivot_TryoutQuestion_CourseChapter.length > 0
              ? question.Pivot_TryoutQuestion_CourseChapter[0].CourseChapter
                  .categoryId
              : undefined,
          courseChapterIds: question.Pivot_TryoutQuestion_CourseChapter.map(
            (item) => item.courseChapterId,
          ),
          Answers: question.TryoutAnswers.map((item) => {
            return {
              id: item.id,
              answer: item.answer,
              value: item.value,
              image: item.image,
            };
          }),
        };
      }),
    };
    setAssesmentType(session.assessmentType);
    setSessions({ ...sessionData });
    const startDateArr = getDateHourStr(tryoutData.startDate).split('T');
    const endDateArr = getDateHourStr(tryoutData.endDate).split('T');
    const resultDateArr = getDateHourStr(tryoutData.resultDate).split('T');
    setTryout({
      id: tryoutData.id,
      title: tryoutData.title,
      restTime: tryoutData.restTime,
      status: tryoutData.status,
      startDate: `${startDateArr[0]}T${startDateArr[1]}`,
      endDate: `${endDateArr[0]}T${endDateArr[1]}`,
      image: tryoutData.image,
      resultDate: `${resultDateArr[0]}T${resultDateArr[1]}`,
      instagram: tryoutData.instagram,
      tiktok: tryoutData.tiktok,
      updateAt: tryoutData.updateAt,
    });
    setStartDate(startDateArr[0]);
    setStartDateTime(startDateArr[1]);
    setEndDate(endDateArr[0]);
    setEndDateTime(endDateArr[1]);
    setResultDate(resultDateArr[0]);
    setResultDateTime(resultDateArr[1]);
    setIsTryoutUpdated({
      value: false,
      dbs: null,
      temporary: null,
      temporary_quiz_volume: null,
    });
  };

  console.log({ selectedQuizVolume });

  const getTryoutFromTemporary = (
    saveData: any,
    selectedQuizVolume: QuizVolume | null | undefined,
  ) => {
    if (!tryoutId) return;
    if (!saveData) return;
    setTryout({ ...saveData.tryout });
    setSessions({ ...saveData.sessions });
    if (saveData.sessions.assessmentType) {
      setAssesmentType(saveData.sessions.assessmentType);
    }
    const startDate = saveData.tryout.startDate.split('T');
    setStartDate(startDate[0]);
    setStartDateTime(startDate[1]);
    const endDate = saveData.tryout.endDate.split('T');
    setEndDate(endDate[0]);
    setEndDateTime(endDate[1]);
    const resultDate = saveData.tryout.endDate.split('T');
    setResultDate(resultDate[0]);
    setResultDateTime(resultDate[1]);
    if (selectedQuizVolume) {
      setSelectedQuizVolume({
        id: selectedQuizVolume.id,
        name: selectedQuizVolume.title || '',
      });
    }
    setIsTryoutUpdated({
      value: false,
      dbs: null,
      temporary: null,
      temporary_quiz_volume: null,
    });
  };

  useEffect(() => {
    if (category.length > 0) {
      getTryoutForUpdate()
        .then((data) => {
          const saveDataString = LZString.decompress(
            localStorage.getItem(`temporary-edit-quiz-${tryoutId}`) || '',
          );
          const tryoutData = data;
          if (!saveDataString) {
            getTryoutFromDbs(tryoutData);
          } else {
            const saveData = JSON.parse(saveDataString);
            const updatedAtDbs = new Date(tryoutData.updateAt);
            const updatedAtTemporary = new Date(saveData.tryout.updateAt);
            updatedAtTemporary.setMinutes(updatedAtTemporary.getMinutes() + 1);
            const isUpdatedAtTemporaryWins = updatedAtTemporary > updatedAtDbs;

            const selectedQuizVolumeString = localStorage.getItem(
              `temporary-selectedQuizVolume-${tryoutId}`,
            );
            let selectedQuizVolume = null;
            if (selectedQuizVolumeString) {
              selectedQuizVolume = JSON.parse(selectedQuizVolumeString);
            }

            if (isUpdatedAtTemporaryWins) {
              localStorage.removeItem(`temporary-edit-quiz-${tryoutId}`);
              localStorage.removeItem(
                `temporary-selectedQuizVolume-${tryoutId}`,
              );
              getTryoutFromTemporary(saveData, selectedQuizVolume);
            } else {
              setIsTryoutUpdated({
                value: true,
                dbs: tryoutData,
                temporary: saveData,
                temporary_quiz_volume: selectedQuizVolume,
              });
            }
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [category, tryoutId]);

  // const { mutate: updateTryout, isPending: isLoading } =
  //   api.tryout.updateTryout.useMutation({
  //     onSuccess() {
  //       alert("Success");
  //       trpc.tryout.getTryoutForUpdate.refetch();
  //     },
  //     onError(error, variables) {
  //       alert(`${error.message}`);
  //     },
  //   });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateTryout = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.put(`/quizTryout/updateQuizTryout`, data);
      await getTryoutForUpdate();
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    } finally {
      localStorage.removeItem(`temporary-edit-quiz-${tryoutId}`);
      localStorage.removeItem(`temporary-selectedQuizVolume-${tryoutId}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTryout((prev) => {
      return {
        ...prev,
        startDate: `${startDate}T${startDateTime}`,
        endDate: `${endDate}T${endDateTime}`,
        resultDate: `${resultDate}T${resultDateTime}`,
      };
    });
  }, [
    startDate,
    endDate,
    resultDate,
    startDateTime,
    endDateTime,
    resultDateTime,
  ]);

  useEffect(() => {
    if (currentIndexEdit !== null && EditSession?.assessmentType !== '') {
      setAssesmentType((prev) =>
        EditSession?.assessmentType ? EditSession?.assessmentType : prev,
      );
    }
  }, [currentIndexEdit]);

  useEffect(() => {
    if (assessmentType !== '') {
      setSessions((prev) => ({
        ...prev,
        assessmentType: assessmentType,
      }));
    }
  }, [assessmentType]);

  const handleSetLocalData = useDebouncedCallback(
    (tryoutId: string, saveData: any) => {
      // const notCompressed = JSON.stringify(saveData);
      try {
        const compressed = LZString.compress(JSON.stringify(saveData));
        localStorage.setItem(`temporary-edit-quiz-${tryoutId}`, compressed);
      } catch (error) {
        console.log('Failed to save temporary data:', error);
      }
    },
    1000,
  );

  useEffect(() => {
    const saveData = {
      tryout,
      sessions,
    };
    if (tryout && tryout.id) {
      handleSetLocalData(tryout.id, saveData);
    }
    if (selectedQuizVolume) {
      localStorage.setItem(
        `temporary-selectedQuizVolume-${tryoutId}`,
        JSON.stringify(selectedQuizVolume),
      );
    }
  }, [tryout, sessions, selectedQuizVolume]);

  const handleSubmit = () => {
    // if (sessions.length === 0) {
    //   alert('Buat Minimal 1 Sesi');
    //   return;
    // }
    if (
      tryout?.id &&
      tryout?.title &&
      tryout.status &&
      tryout.startDate &&
      tryout.endDate &&
      tryout.resultDate
      // tryout.image
    ) {
      const validTryout: TryoutProps = {
        id: tryout.id,
        title: tryout.title,
        restTime: tryout.restTime ? tryout.restTime : 0,
        status: tryout.status as 'PUBLIC' | 'PRIVATE' | 'DRAFT',
        startDate: tryout.startDate,
        endDate: tryout.endDate,
        image: tryout.image || '',
        resultDate: tryout.resultDate,
        instagram: tryout.instagram,
        tiktok: tryout.tiktok,
      };

      const validSessions = {
        id: sessions.id,
        name: sessions.name || 'Default session Name',
        categoryId: sessions.categoryId || 'defaultCategoryId',
        subCategoryId: sessions.subCategoryId || 'defaultSubCategoryId',
        documentId: sessions.documentId,
        description: sessions.description ?? undefined,
        duration:
          typeof sessions.duration === 'string'
            ? parseFloat(sessions.duration)
            : sessions.duration || 0,
        thresholdValue: sessions.thresholdValue,
        assessmentType: sessions.assessmentType || 'defaultAssessmentType',
        TryoutQuestion:
          sessions.Questions?.map((question) => {
            return {
              id: question.id || 'new',
              number: question.number,
              question: question.question,
              image: question.image,
              explanation: question.explanation,
              subCategory: question.subCategory,
              subSubCategory: question.subSubCategory,
              courseChapterIds: question.courseChapterIds,
              TryoutAnswers: question.Answers.map((answer) => {
                return {
                  id: answer.id || 'new',
                  answer: answer.answer,
                  value: answer.value,
                };
              }),
            };
          }) || [],
      };
      // return;
      const checkCategoryId = validSessions.categoryId === 'defaultCategoryId';
      const checkSubCategoryId =
        validSessions.subCategoryId === 'defaultSubCategoryId';
      let checkQuestion = false;
      let checkQuestionValue = { value: false, message: '' };
      let checkAnswers = { value: false, message: '' };

      if (
        validSessions.TryoutQuestion &&
        validSessions.TryoutQuestion.length < 1
      ) {
        checkQuestion = true;
      }
      validSessions.TryoutQuestion.forEach((quest, qIndex) => {
        if (quest.question === '' || quest.question.length === 0) {
          checkQuestionValue = {
            value: true,
            message: `Soal ${qIndex + 1} masih kosong`,
          };
          return;
        }
        quest.TryoutAnswers.forEach((answer) => {
          if (answer.answer === '' || answer.answer.length === 0) {
            checkAnswers = {
              value: true,
              message: `Jawaban masih ada yang kosong pada soal ${qIndex + 1}`,
            };
          }
        });
      });

      let checkDuration = false;
      let checkName = false;
      let checkAssestmentType = false;

      if (validSessions.duration < 5) {
        checkDuration = true;
      }
      if (
        validSessions.name === 'Default Session Name' ||
        validSessions.name === ''
      ) {
        checkName = true;
      }
      if (
        validSessions.assessmentType === 'defaultAssessmentType' ||
        validSessions.assessmentType === ''
      ) {
        checkAssestmentType = true;
      }
      if (checkCategoryId) {
        alert('Pilih Tes');
        return;
      }
      if (checkSubCategoryId) {
        alert('Pilih Sub Tes');
        return;
      }
      if (checkName) {
        alert('Masukan Nama Session');
        return;
      }
      if (checkAssestmentType) {
        alert('Pilih Penilaian');
        return;
      }
      if (checkDuration) {
        alert('Durasi Tryout terlalu singkat');
        return;
      }
      if (checkQuestion) {
        alert('Setiap Sesi Harus memiliki Soal');
        return;
      }
      if (checkQuestionValue.value) {
        alert(checkQuestionValue.message);
        return;
      }
      if (checkAnswers.value) {
        alert(checkAnswers.message);
        return;
      }

      updateTryout({
        QuizVolumeId: selectedQuizVolume?.id || undefined,
        Tryout: validTryout,
        TryoutSession: validSessions,
      });
      // alert("Dijalankan")
    } else {
      console.error('Tryout object is missing required properties');
    }
  };

  // useEffect(() => {
  //   if (tryoutData && category) {
  //     const sessionData = tryoutData.TryoutSession.map((session) => {
  //       const getCategory = category.find(
  //         (item) => item.id === session.categoryId
  //       );
  //       const getSubCategory = getCategory?.TryoutSubCategory.find(
  //         (item) => item.id === session.subCategoryId
  //       );
  //       return {
  //         ...session,
  //         id: session.id,
  //         tryoutId: session.tryoutId,
  //         categoryId: session.categoryId,
  //         category: getCategory?.name,
  //         subCategoryId: session.subCategoryId,
  //         subCategory: getSubCategory?.name,
  //         documentId: session.documentId,
  //         name: session.name,
  //         slug: session.slug,
  //         description: session.description ?? undefined,
  //         duration: session.duration,
  //         thresholdValue: session.thresholdValue ?? undefined,
  //         assessmentType: session.assessmentType,
  //         Questions: session.TryoutQuestion.map((question) => {
  //           return {
  //             id: question.id,
  //             number: question.number,
  //             question: question.question,
  //             image: question.image,
  //             explanation: question.explanation ?? undefined,
  //             subCategory: question.subCategory ?? undefined,
  //             subSubCategory: question.subSubCategory ?? undefined,
  //             Answers: question.TryoutAnswers.map((item) => {
  //               return {
  //                 id: item.id,
  //                 answer: item.answer,
  //                 value: item.value,
  //               };
  //             }),
  //           };
  //         }),
  //       };
  //     });
  //     setSessions([...sessionData]);
  //     const startDateArr = getDateHourStr(tryoutData.startDate).split("T");
  //     const endDateArr = getDateHourStr(tryoutData.endDate).split("T");
  //     const resultDateArr = getDateHourStr(tryoutData.resultDate).split("T");
  //     setTryout({
  //       id: tryoutData.id,
  //       title: tryoutData.title,
  //       restTime: tryoutData.restTime,
  //       status: tryoutData.status,
  //       startDate: `${startDateArr[0]}T${startDateArr[1]}`,
  //       endDate: `${endDateArr[0]}T${endDateArr[1]}`,
  //       image: tryoutData.image,
  //       resultDate: `${resultDateArr[0]}T${resultDateArr[1]}`,
  //     });
  //     setStartDate(startDateArr[0]);
  //     setStartDateTime(startDateArr[1]);
  //     setEndDate(endDateArr[0]);
  //     setEndDateTime(endDateArr[1]);
  //     setResultDate(resultDateArr[0]);
  //     setResultDateTime(resultDateArr[1]);
  //   }
  // }, [tryoutData, category]);

  console.log({ sessions, assessmentType });

  // useEffect(() => {
  //   document.body.style.overflow = 'hidden';
  // }, []);

  if (isLoadingTryout || isLoadingCategory) {
    return (
      <div className="flex justify-center items-center h-full w-full">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>
    );
  }

  if (isTryoutUpdated.value) {
    return (
      <div className="flex flex-col gap-4 justify-center items-center h-full w-full">
        <h1 className="text-xl font-medium">
          There is an update from this tryout
        </h1>
        <div className="flex gap-4 items-center justify-center w-full">
          <Button
            onClick={() => {
              localStorage.removeItem(`temporary-edit-quiz-${tryoutId}`);
              localStorage.removeItem(
                `temporary-selectedQuizVolume-${tryoutId}`,
              );
              getTryoutFromDbs(isTryoutUpdated.dbs);
            }}
          >
            Use Data From Database
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-400"
            onClick={() => {
              getTryoutFromTemporary(
                isTryoutUpdated.temporary,
                isTryoutUpdated.temporary_quiz_volume,
              );
            }}
          >
            Use Data From Temporary
          </Button>
        </div>
      </div>
    );
  }

  const ContextValue = {
    tryout,
    currentIndexEdit,
    setCurrentIndexEdit,
    questionIndex,
    setQuestionIndex,
    showDetailTryout,
    setShowDetailTryout,
    setTryout,
    sessions,
    setSessions,
    startDate,
    setStartDate,
    startDateTime,
    setStartDateTime,
    endDate,
    setEndDate,
    endDateTime,
    setEndDateTime,
    resultDate,
    setResultDate,
    resultDateTime,
    setResultDateTime,
    EditSession,
    assessmentType,
    setAssesmentType,
    category,
    isLoading,
    selectedQuizVolume,
    setSelectedQuizVolume,
  };

  return (
    <EditQuizTryoutContext.Provider value={ContextValue}>
      <LoadingPageWithText
        loading={isLoading}
        heading="Menyimpan Tryout..."
      />
      <div className="h-screen flex flex-col bg-gray-50">
        <header className="h-[53px] shrink-0 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
          <Link
            href={`/${Array.isArray(params.web_sub_category) ? params.web_sub_category[0] : params.web_sub_category}/admin/quiz`}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali
          </Link>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm font-semibold text-gray-800">Edit Quiz</p>
          </div>
          <button
            type="submit"
            form="tryout-admin"
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-3xl transition-colors"
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Simpan
          </button>
        </header>

        <form
          id="tryout-admin"
          className="flex flex-1 overflow-hidden"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div
            className={cn(
              'h-full overflow-y-auto bg-white border-r border-gray-200 transition-all duration-300',
              currentIndexEdit === null && 'col-span-5 w-full',
              currentIndexEdit !== null && showDetailTryout && 'w-80',
              currentIndexEdit !== null && !showDetailTryout && 'w-0 overflow-hidden',
            )}
          >
            <TryoutOption />
          </div>
          <div
            className={cn(
              'relative h-full overflow-hidden bg-gray-50 transition-all duration-300',
              currentIndexEdit === null && 'w-0 overflow-hidden',
              currentIndexEdit !== null && 'flex-1',
            )}
          >
            <SessionOption />
          </div>
        </form>
      </div>
    </EditQuizTryoutContext.Provider>
  );
};

export default NewTryOut;
