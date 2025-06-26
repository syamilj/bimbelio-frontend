'use client';

import { EditTryoutContext } from '@/app/[web_sub_category]/(admin)/admin/tryout/_component/provider-edit-tryout';
import SessionOption from '@/app/[web_sub_category]/(admin)/admin/tryout/edit/[tryoutId]/_components/session-option';
import TryoutOption from '@/app/[web_sub_category]/(admin)/admin/tryout/edit/[tryoutId]/_components/tryout-option';
import { useAppContext } from '@/components/provider/provider-app';
import { Button } from '@/components/ui/button';
import LoadingPageWithText from '@/components/ui/spinner';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response, responseError } from '@/lib/response';
import { cn, getDateHourStr } from '@/lib/utils';
import { TryoutSubCategory } from '@/types/database';
import 'katex/dist/katex.min.css';
import { Loader2 } from 'lucide-react';
import LZString from 'lz-string';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export interface TryoutProps {
  id?: string;
  title?: string;
  restTime?: number;
  status?: 'PUBLIC' | 'PRIVATE' | 'DRAFT';
  startDate?: string;
  endDate?: string;
  image?: string | null;
  resultDate?: string;
  instagram?: string;
  tiktok?: string;
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

const NewTryOut = () => {
  const params = useParams();
  const tryoutId = Array.isArray(params?.tryoutId)
    ? params.tryoutId[0]
    : (params?.tryoutId ?? '');
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

  const [isTryoutUpdated, setIsTryoutUpdated] = useState<{
    value: boolean;
    dbs: any;
    temporary: any;
  }>({
    value: false,
    dbs: null,
    temporary: null,
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

  const getTryoutFromDbs = (tryoutData: any) => {
    if (!tryoutData) return;
    const sessionData = tryoutData.TryoutSession.map((session: any) => {
      const getCategory = category.find(
        (item) => item.id === session.categoryId,
      );
      const getSubCategory = getCategory?.TryoutSubCategory.find(
        (item) => item.id === session.subCategoryId,
      );
      return {
        ...session,
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
        Questions: session.TryoutQuestion.map((question: any) => {
          return {
            id: question.id,
            number: question.number,
            question: question.question,
            image: question.image,
            explanation: question.explanation ?? undefined,
            subCategory: question.subCategory ?? undefined,
            subSubCategory: question.subSubCategory ?? undefined,
            Answers: question.TryoutAnswers.map((item: any) => {
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
    });
    setSessions([...sessionData]);
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
    setIsTryoutUpdated({ value: false, dbs: null, temporary: null });
  };

  const getTryoutFromTemporary = (saveData: any) => {
    if (!tryoutId) return;
    if (!saveData) return;
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
    setIsTryoutUpdated({ value: false, dbs: null, temporary: null });
    // const saveDataString = localStorage.getItem(
    //   `temporary-edit-tryout-${tryoutId}`,
    // );
    // if (saveDataString) {
    //   const saveData = JSON.parse(saveDataString);
    //   setTryout({ ...saveData.tryout });
    //   setSessions([...saveData.sessions]);
    //   const startDate = saveData.tryout.startDate.split('T');
    //   setStartDate(startDate[0]);
    //   setStartDateTime(startDate[1]);
    //   const endDate = saveData.tryout.endDate.split('T');
    //   setEndDate(endDate[0]);
    //   setEndDateTime(endDate[1]);
    //   const resultDate = saveData.tryout.endDate.split('T');
    //   setResultDate(resultDate[0]);
    //   setResultDateTime(resultDate[1]);
    // }
  };

  useEffect(() => {
    if (category.length > 0) {
      getTryoutForUpdate()
        .then((data) => {
          // const saveDataString = localStorage.getItem(
          //   `temporary-edit-tryout-${tryoutId}`,
          // );
          const saveDataString = LZString.decompress(
            localStorage.getItem(`temporary-edit-tryout-${tryoutId}`) || '',
          );
          console.log({ saveDataString });
          const tryoutData = data;
          if (!saveDataString) {
            getTryoutFromDbs(tryoutData);
          } else {
            const saveData = JSON.parse(saveDataString);
            const updatedAtDbs = new Date(tryoutData.updateAt);
            const updatedAtTemporary = new Date(saveData.tryout.updateAt);
            updatedAtTemporary.setMinutes(updatedAtTemporary.getMinutes() + 1);
            const isUpdatedAtTemporaryWins = updatedAtTemporary > updatedAtDbs;
            if (isUpdatedAtTemporaryWins) {
              localStorage.removeItem(`temporary-edit-tryout-${tryoutId}`);
              getTryoutFromTemporary(saveData);
            } else {
              setIsTryoutUpdated({
                value: true,
                dbs: tryoutData,
                temporary: saveData,
              });
            }
            // if (isUpdatedAtTemporaryWins) {
            //   getTryoutFromTemporary(saveData);
            // } else {
            //   localStorage.removeItem(`temporary-edit-tryout-${tryoutId}`);
            //   getTryoutFromDbs(tryoutData);
            // }
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
      const res = await axiosInstance.put(`/tryout/updateTryout`, data);
      await getTryoutForUpdate();
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    } finally {
      localStorage.removeItem(`temporary-edit-tryout-${tryoutId}`);
      setIsLoading(false);
    }
  };

  const { minimizeSidebar } = useAppContext();

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

  // useEffect(() => {
  //   if (!tryoutId) return;
  //   const saveDataString = localStorage.getItem(
  //     `temporary-edit-tryout-${tryoutId}`,
  //   );
  //   if (saveDataString) {
  //     const saveData = JSON.parse(saveDataString);
  //     setTryout({ ...saveData.tryout });
  //     setSessions([...saveData.sessions]);
  //     const startDate = saveData.tryout.startDate.split('T');
  //     setStartDate(startDate[0]);
  //     setStartDateTime(startDate[1]);
  //     const endDate = saveData.tryout.endDate.split('T');
  //     setEndDate(endDate[0]);
  //     setEndDateTime(endDate[1]);
  //     const resultDate = saveData.tryout.endDate.split('T');
  //     setResultDate(resultDate[0]);
  //     setResultDateTime(resultDate[1]);
  //   }
  //   document.body.style.overflow = 'hidden';
  // }, [tryoutId]);

  const handleSetLocalData = useDebouncedCallback(
    (tryoutId: string, saveData: any) => {
      const notCompressed = JSON.stringify(saveData);
      const compressed = LZString.compress(JSON.stringify(saveData));
      localStorage.setItem(`temporary-edit-tryout-${tryoutId}`, compressed);
      console.log('123');
    },
    1000,
  );

  useEffect(() => {
    const saveData = {
      tryout,
      sessions,
    };
    if (tryout && tryout.id) {
      // const compressed = LZString.compress(JSON.stringify(saveData));
      // localStorage.setItem(`temporary-edit-tryout-${tryout.id}`, compressed);
      handleSetLocalData(tryout.id, saveData);
    }
  }, [tryout, sessions]);

  const handleSubmit = () => {
    if (sessions.length === 0) {
      alert('Buat Minimal 1 Sesi');
      return;
    }
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

      const validSessions = sessions.map((session) => ({
        id: session.id || 'new',
        name: session.name || 'Default session Name',
        categoryId: session.categoryId || 'defaultCategoryId',
        subCategoryId: session.subCategoryId || 'defaultSubCategoryId',
        documentId: session.documentId,
        description: session.description ?? undefined,
        duration:
          typeof session.duration === 'string'
            ? parseFloat(session.duration)
            : session.duration || 0,
        thresholdValue: session.thresholdValue,
        assessmentType: session.assessmentType || 'defaultAssessmentType',
        TryoutQuestion:
          session.Questions?.map((question) => {
            return {
              id: question.id || 'new',
              number: question.number,
              question: question.question,
              image: question.image,
              explanation: question.explanation,
              subCategory: question.subCategory,
              subSubCategory: question.subSubCategory,
              TryoutAnswers: question.Answers.map((answer) => {
                return {
                  id: answer.id || 'new',
                  answer: answer.answer,
                  value: answer.value,
                };
              }),
            };
          }) || [],
      }));
      // return;
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

      updateTryout({ Tryout: validTryout, TryoutSession: validSessions });
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

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
              localStorage.removeItem(`temporary-edit-tryout-${tryoutId}`);
              getTryoutFromDbs(isTryoutUpdated.dbs);
            }}
          >
            Use Data From Database
          </Button>
          <Button
            className="bg-yellow-500 hover:bg-yellow-400"
            onClick={() => {
              getTryoutFromTemporary(isTryoutUpdated.temporary);
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
  };

  return (
    <EditTryoutContext.Provider value={ContextValue}>
      <LoadingPageWithText
        loading={isLoading}
        heading="Menyimpan Tryout..."
      />
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
            <TryoutOption />
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
            <SessionOption />
          </div>
        </form>
      </div>
    </EditTryoutContext.Provider>
  );
};

export default NewTryOut;
