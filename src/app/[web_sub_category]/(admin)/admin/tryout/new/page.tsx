'use client';
import { Spinner } from '@/components/ui/spinner';

import { useAppContext } from '@/components/provider/provider-app';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response, responseError } from '@/lib/response';
import { cn } from '@/lib/utils';
import { TryoutSubCategory } from '@/types/database';
import 'katex/dist/katex.min.css';
import { useEffect, useState } from 'react';
import SessionOption from './_component/session-option';
import TryoutOption from './_component/tryout-option';
import { supabase } from '@/supabaseClient';

export interface TryoutProps {
  title?: string;
  restTime?: number;
  status?: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
  startDate?: string;
  endDate?: string;
  image?: string;
  resultDate?: string;
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
  Answers: AnswerProps[];
}

export interface SessionProps {
  categoryId?: string;
  category?: string;
  subCategoryId?: string;
  subCategory?: string;
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
  console.log('EditSession', EditSession);
  const [assessmentType, setAssesmentType] = useState<string>('');

  // const { mutate: createTryout, isPending: isLoading } =
  //   api.tryout.createTryout.useMutation({
  //     onSuccess(data, variables) {
  //       alert("Success");
  //       resetTryout();
  //       console.log("data", data);
  //       console.log("variables", variables);
  //     },
  //     onError(error, variables) {
  //       console.log(error, variables);
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

  const { minimizeSidebar } = useAppContext();

  const resetTryout = async() => {
    
    await supabase.storage.from('img').remove([`tryout/${tryout?.image}`]);
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
    console.log('change', assessmentType);
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
    document.body.style.overflow = 'hidden';
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

  console.log('tryout : ', tryout);
  console.log(
    'sessions : ',
    currentIndexEdit !== null && sessions[currentIndexEdit],
  );
  console.log('ass : ', assessmentType);
  // console.log("height2", listQuestionHeight);

  const handleSubmit = () => {
    console.log('awdwad');
    // localStorage.removeItem("temporary-add-tryout")
    console.log(sessions.length);
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
      const validTryout: {
        status: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
        title: string;
        restTime: number;
        startDate: string;
        endDate: string;
        image: string;
        resultDate: string;
      } = {
        status: tryout.status as 'PUBLIC' | 'PRIVATE' | 'DRAFT',
        title: tryout.title,
        restTime: tryout.restTime ? tryout.restTime : 0,
        startDate: tryout.startDate,
        endDate: tryout.endDate,
        image: tryout.image || '',
        resultDate: tryout.resultDate,
      };

      const validSessions = sessions.map((session) => ({
        name: session.name || 'Default session Name',
        categoryId: session.categoryId || 'defaultCategoryId',
        subCategoryId: session.subCategoryId || 'defaultSubCategoryId',
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
            'col-span-2 h-[90vh] w-[40%] overflow-y-auto pb-[1rem] pt-[1rem] duration-300',
            currentIndexEdit === null && 'col-span-5 w-[100%]',
            currentIndexEdit !== null && !showDetailTryout && 'w-0',
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
            'relative col-span-3 mt-[1rem] h-[90vh] w-[60%] duration-300',
            currentIndexEdit !== null &&
              !showDetailTryout &&
              'ml-[-1rem] w-full',
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
