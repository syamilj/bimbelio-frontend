'use client';
import { Spinner } from '@/components/ui/spinner';

import { useAppContext } from '@/components/provider/provider-app';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response, responseError } from '@/lib/response';
import { cn } from '@/lib/utils';
import { TryoutSubCategory } from '@/types/database';
import 'katex/dist/katex.min.css';
import LZString from 'lz-string';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
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

  const [selectedQuizVolume, setSelectedQuizVolume] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const EditSession = sessions;

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
      const res = await axiosInstance.post(
        '/quizTryout/createQuizTryout',
        data,
      );
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

  const { minimizeSidebar } = useAppContext();

  const resetTryout = async () => {
    setTryout(null);
    setSessions({
      categoryId: '',
      name: '',
      description: '',
      duration: 0,
      thresholdValue: 0,
      assessmentType: '0-100',
      Questions: [],
    });
    setAssesmentType('');
    setStartDate('');
    setStartDateTime('');
    setEndDate('');
    setEndDateTime('');
    setResultDate('');
    setResultDateTime('');
    localStorage.removeItem('temporary-add-quiz');
    localStorage.removeItem('temporary-selectedQuizVolume');
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

  useEffect(() => {
    const saveDataString = LZString.decompress(
      localStorage.getItem('temporary-add-quiz') || '',
    );
    if (saveDataString) {
      const saveData = JSON.parse(saveDataString);
      setTryout({ ...saveData.tryout });
      setSessions({ ...saveData.sessions });
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
    // document.body.style.overflow = 'hidden';
  }, []);

  const handleSetLocalData = useDebouncedCallback((saveData: any) => {
    // const notCompressed = JSON.stringify(saveData);
    try {
      const compressed = LZString.compress(JSON.stringify(saveData));
      localStorage.setItem(`temporary-add-quiz`, compressed);
    } catch (error) {
      console.log('Failed to save temporary data:', error);
    }
  }, 1000);

  useEffect(() => {
    const saveData = {
      tryout,
      sessions,
    };
    if (tryout) {
      handleSetLocalData(saveData);
    }
    if (selectedQuizVolume) {
      localStorage.setItem(
        'temporary-selectedQuizVolume',
        JSON.stringify(selectedQuizVolume),
      );
    }
  }, [tryout, sessions, selectedQuizVolume]);

  const handleSubmit = () => {
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

      const validSessions = {
        name: sessions.name || 'Default session Name',
        categoryId: sessions.categoryId || 'defaultCategoryId',
        subCategoryId: sessions.subCategoryId || 'defaultSubCategoryId',
        documentId: sessions.documentId,
        duration:
          typeof sessions.duration === 'string'
            ? parseFloat(sessions.duration)
            : sessions.duration || 0,
        TryoutQuestion:
          sessions.Questions.map((quest) => {
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
        description: sessions.description,
        assessmentType: sessions.assessmentType || 'defaultAssessmentType',
        thresholdValue: sessions.thresholdValue,
      };
      const checkCategoryId = validSessions.categoryId === 'defaultCategoryId';
      const checkSubCategoryId =
        validSessions.categoryId === 'defaultSubCategoryId';

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

      createTryout({
        QuizVolumeId: selectedQuizVolume?.id || undefined,
        Tryout: validTryout,
        TryoutSession: validSessions,
      });
      // alert("Dijalankan")
    } else {
      console.error('Tryout object is missing required properties');
    }
  };

  if (isLoadingCategory) {
    return <Spinner />;
  }

  return (
    <div
      className={cn(
        'fixed left-0 top-[80px] h-full w-full bg-workspace duration-300',
        minimizeSidebar && 'pl-[calc(73px+1rem)]',
        !minimizeSidebar && 'pl-[calc(254px+1rem)]',
      )}
    >
      <form
        id="tryout-admin"
        className="flex w-full"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div
          className={cn(
            'col-span-2 h-[90vh] w-[40%] overflow-y-auto pb-4 pt-4 duration-300',
            currentIndexEdit === null && 'col-span-5 w-full',
            currentIndexEdit !== null && !showDetailTryout && 'w-0',
          )}
        >
          <TryoutOption
            tryout={tryout}
            setTryout={setTryout}
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
            isLoading={isLoading}
            resetTryout={resetTryout}
            selectedQuizVolume={selectedQuizVolume}
            setSelectedQuizVolume={setSelectedQuizVolume}
          />
        </div>
        <div
          className={cn(
            'relative col-span-3 mt-4 h-[90vh] w-[60%] duration-300',
            currentIndexEdit !== null && !showDetailTryout && '-ml-4 w-full',
            currentIndexEdit === null && 'w-0',
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
