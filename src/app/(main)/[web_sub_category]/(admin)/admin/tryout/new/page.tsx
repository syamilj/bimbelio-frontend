'use client';
import { Spinner } from '@/components/ui/spinner';

import { useAppContext } from '@/components/provider/provider-app';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response, responseError } from '@/lib/response';
import { cn } from '@/lib/utils';
import { TryoutSubCategory } from '@/types/database';
import 'katex/dist/katex.min.css';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import SessionOption from './_component/session-option';
import TryoutOption from './_component/tryout-option';

export interface TryoutProps {
  title?: string;
  restTime?: number;
  status?: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
  startDate?: string;
  endDate?: string;
  image?: string;
  resultDate?: string;
  instagram?: string;
  tiktok?: string;
}

interface AnswerProps {
  answer: string;
  value: number;
  image?: string | null;
}

export interface QuestionProps {
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
  categoryId?: string;
  category?: string;
  subCategoryId?: string;
  subCategory?: string;
  documentId?: string | null;
  name?: string;
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

const NewTryOut = () => {
  // const [headingSessionHeight, setHeadingSessionHeight] = useState<number>(0)
  // const [showHeadingSession, setShowHeadingSession] = useState<boolean>(true)

  // const [listQuestionHeight, setListQuestionHeight] = useState<number>(0)
  // const [showListQuestion, setShowListQuestion] = useState<boolean>(true)

  const [showDetailTryout, setShowDetailTryout] = useState<boolean>(true);

  const [currentIndexEdit, setCurrentIndexEdit] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const [tryout, setTryout] = useState<TryoutProps | null>(null);
  const [sessions, setSessions] = useState<SessionProps[]>([]);

  const [startDate, setStartDate] = useState<string>('');
  const [startDateTime, setStartDateTime] = useState<string>('');

  const [endDate, setEndDate] = useState<string>('');
  const [endDateTime, setEndDateTime] = useState<string>('');

  const [resultDate, setResultDate] = useState<string>('');
  const [resultDateTime, setResultDateTime] = useState<string>('');

  const EditSession =
    currentIndexEdit !== null ? sessions[currentIndexEdit] : null;
  const [assessmentType, setAssesmentType] = useState<string>('');

  // const { mutate: createTryout, isPending: isLoading } =
  //   api.tryout.createTryout.useMutation({
  //     onSuccess(data, variables) {
  //       alert("Success");
  //       resetTryout();
  //     },
  //     onError(error, variables) {
  //       alert(`${error.message}`);
  //     },
  //   });
  // const { data: category, isLoading: isLoadingCategory } =
  //   api.tryoutCategory.getCategory.useQuery(undefined, {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const createTryout = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await axiosInstance.post('/tryout/createTryout', data);
      resetTryout();
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    } finally {
      setIsLoading(false);
    }
  };

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

  useAppContext();
  const params = useParams();
  const webSubCategory = Array.isArray(params?.web_sub_category)
    ? params.web_sub_category[0]
    : (params?.web_sub_category ?? '');

  const resetTryout = async () => {
    setTryout(null);
    setSessions([]);
    setAssesmentType('');
    setStartDate('');
    setStartDateTime('');
    setEndDate('');
    setEndDateTime('');
    setResultDate('');
    setResultDateTime('');
    localStorage.removeItem('temporary-add-tryout');
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
      setSessions((prev) =>
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
    const saveDataString = localStorage.getItem('temporary-add-tryout');
    if (saveDataString) {
      const saveData = JSON.parse(saveDataString);
      setTryout({ ...saveData.tryout });
      setSessions([...saveData.sessions]);
      const startDate = saveData.tryout.startDate.split('T');
      setStartDate(startDate[0]);
      setStartDateTime(startDate[1]);
      const endDate = saveData.tryout.endDate.split('T');
      setEndDate(endDate[0]);
      setEndDateTime(endDate[1]);
      const resultDate = saveData.tryout.endDate.split('T');
      setResultDate(resultDate[0]);
      setResultDateTime(resultDate[1]);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = '';
      body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const saveData = {
      tryout,
      sessions,
    };
    if (tryout) {
      localStorage.setItem('temporary-add-tryout', JSON.stringify(saveData));
    }
  }, [tryout, sessions]);

  const handleSubmit = () => {
    // localStorage.removeItem("temporary-add-tryout")
    if (sessions.length === 0) {
      // toast({
      //     variant: "success",
      //     title: 'Success',
      // });
      alert('Buat Minimal 1 Sesi');
      return;
    }
    if (
      tryout?.title &&
      tryout.status &&
      tryout.startDate &&
      tryout.endDate &&
      tryout.resultDate
      // tryout.image
    ) {
      const validTryout: TryoutProps = {
        status: tryout.status as 'PUBLIC' | 'PRIVATE' | 'DRAFT',
        title: tryout.title,
        restTime: tryout.restTime ? tryout.restTime : 0,
        startDate: tryout.startDate,
        endDate: tryout.endDate,
        image: tryout.image || '',
        resultDate: tryout.resultDate,
        instagram: tryout.instagram,
        tiktok: tryout.tiktok,
      };

      const validSessions = sessions.map((session) => ({
        name: session.name || 'Default session Name',
        categoryId: session.categoryId || 'defaultCategoryId',
        subCategoryId: session.subCategoryId || 'defaultSubCategoryId',
        documentId: session.documentId,
        duration:
          typeof session.duration === 'string'
            ? parseFloat(session.duration)
            : session.duration || 0,
        TryoutQuestion:
          session.Questions.map((quest) => {
            return {
              TryoutAnswers: quest.Answers,
              explanation: quest.explanation,
              image: quest.image,
              number: quest.number,
              question: quest.question,
              subCategory: quest.subCategory,
              subSubCategory: quest.subSubCategory,
              courseChapterIds: quest.courseChapterIds,
            };
          }) || [],
        description: session.description,
        assessmentType: session.assessmentType || 'defaultAssessmentType',
        thresholdValue: session.thresholdValue,
      }));
      const checkCategoryId = validSessions.find(
        (item) => item.categoryId === 'defaultCategoryId',
      );
      const checkSubCategoryId = validSessions.find(
        (item) => item.categoryId === 'defaultSubCategoryId',
      );
      let checkQuestion = false;
      let checkQuestionValue = { value: false, message: '' };
      let checkAnswers = { value: false, message: '' };
      validSessions.forEach((item) => {
        if (item.TryoutQuestion && item.TryoutQuestion.length < 1) {
          checkQuestion = true;
        }
        item.TryoutQuestion.forEach((quest, qIndex) => {
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
                message: `Jawaban masih ada yang kosong pada soal ${
                  qIndex + 1
                }`,
              };
            }
          });
        });
      });
      let checkDuration = false;
      let checkName = false;
      let checkAssestmentType = false;
      validSessions.forEach((item) => {
        if (item.duration < 5) {
          checkDuration = true;
        }
        if (item.name === 'Default Session Name' || item.name === '') {
          checkName = true;
        }
        if (
          item.assessmentType === 'defaultAssessmentType' ||
          item.assessmentType === ''
        ) {
          checkAssestmentType = true;
        }
      });
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

      createTryout({ Tryout: validTryout, TryoutSession: validSessions });
      // alert("Dijalankan")
    } else {
      console.error('Tryout object is missing required properties');
    }
  };

  if (isLoadingCategory) {
    return <Spinner />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="h-[53px] shrink-0 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
        <Link
          href={`/${webSubCategory}/admin/tryout`}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Kembali
        </Link>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm font-semibold text-gray-800">Tambah Tryout</p>
        </div>
        <button
          type="submit"
          form="tryout-admin"
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
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
            currentIndexEdit === null && 'flex-1',
            currentIndexEdit !== null && showDetailTryout && 'w-80',
            currentIndexEdit !== null &&
              !showDetailTryout &&
              'w-0 overflow-hidden',
          )}
        >
          <TryoutOption
            tryout={tryout}
            setTryout={setTryout}
            setSessions={setSessions}
            sessions={sessions}
            startDate={startDate}
            setStartDate={setStartDate}
            startDateTime={startDateTime}
            setStartDateTime={setStartDateTime}
            endDate={endDate}
            setEndDate={setEndDate}
            endDateTime={endDateTime}
            setEndDateTime={setEndDateTime}
            resultDate={resultDate}
            setResultDate={setResultDate}
            resultDateTime={resultDateTime}
            setResultDateTime={setResultDateTime}
            currentIndexEdit={currentIndexEdit}
            setCurrentIndexEdit={setCurrentIndexEdit}
            setQuestionIndex={setQuestionIndex}
            isLoading={isLoading}
            setAssesmentType={setAssesmentType}
            resetTryout={resetTryout}
          />
        </div>
        <div
          className={cn(
            'relative h-full overflow-hidden bg-gray-50 transition-all duration-300',
            currentIndexEdit === null && 'w-0 overflow-hidden',
            currentIndexEdit !== null && 'flex-1',
          )}
        >
          <SessionOption
            EditSession={EditSession}
            category={category}
            setSessions={setSessions}
            currentIndexEdit={currentIndexEdit}
            setCurrentIndexEdit={setCurrentIndexEdit}
            showDetailTryout={showDetailTryout}
            setShowDetailTryout={setShowDetailTryout}
            assessmentType={assessmentType}
            setAssesmentType={setAssesmentType}
            questionIndex={questionIndex}
            setQuestionIndex={setQuestionIndex}
          />
        </div>
      </form>
    </div>
  );
};

export default NewTryOut;
