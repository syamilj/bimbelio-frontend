'use client';

import { useEditTryoutContext } from '@/app/[web_sub_category]/(admin)/admin/tryout/_component/provider-edit-tryout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toaster } from '@/components/ui/toaster';
import axiosInstance from '@/lib/axios/axiosInstance';
import { response, responseError } from '@/lib/response';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import ModalDeleteSession from './modal-delete';

type QuestionProps = {
  number: number;
  question: string;
  image?: string;
  explanation?: string;
  subCategory?: string;
  Answers: AnswerProps[];
};
type AnswerProps = {
  answer: string;
  value: number;
};

const HeadingSessionTryout = () => {
  const {
    EditSession,
    category,
    assessmentType,
    setAssesmentType,
    setSessions,
    currentIndexEdit,
    setCurrentIndexEdit,
  } = useEditTryoutContext();

  const [loading, setLoading] = useState<boolean>(false);

  const generateTryout = async (context: string) => {
    try {
      const res = await axiosInstance.post('/tryout/generateTryout', {
        context,
      });
      const resData = response(res, true);
      return resData.data as QuestionProps[];
    } catch (error) {
      responseError(error, true);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    const input = document.getElementById(
      'context-for-generate-ai-edit',
    ) as HTMLTextAreaElement;
    if (input.value.length < 10) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Masukan Conteks untuk generate soal tryout',
        duration: 3000,
      });
      return;
    }
    setLoading(true);
    const res = await generateTryout(input.value);
    const data = res;
    setSessions((prev) =>
      prev.map((session) => {
        return {
          ...session,
          Questions: [
            ...session.Questions,
            ...data.map((quest) => {
              return {
                number: quest.number + session.Questions.length,
                question: quest.question,
                Answers: quest.Answers.map((answer) => {
                  let value = 0;
                  if (session.assessmentType === '1-5') {
                    value = answer.value;
                  } else if (session.assessmentType === '+5/0') {
                    if (answer.value === 5) value = 5;
                    else value = 0;
                  } else if (session.assessmentType === 'IRT') {
                    if (answer.value === 5) value = 5;
                    else value = 0;
                  } else if (session.assessmentType === '+4/-1/0') {
                    if (answer.value === 5) value = 4;
                    else value = -1;
                  }
                  return {
                    answer: answer.answer,
                    value,
                  };
                }),
              };
            }),
          ],
        };
      }),
    );
  };

  const onChangeCategory = (value: string) => {
    if (value === '') {
      setSessions((prev) =>
        prev.map((item, i: number) => {
          if (i === currentIndexEdit) {
            return {
              ...item,
              categoryId: '',
              category: '',
            };
          }
          return { ...item };
        }),
      );
    }
    const categoryId = value.split('-')[0];
    const category = value.split('-')[1];
    setSessions((prev) =>
      prev.map((item, i: number) => {
        if (i === currentIndexEdit) {
          return {
            ...item,
            categoryId,
            category,
            subCategory: '',
            subCategoryId: '',
          };
        }
        return { ...item };
      }),
    );
  };

  const onChangeSubCategory = (value: string) => {
    if (value === '') {
      setSessions((prev) =>
        prev.map((item, i: number) => {
          if (i === currentIndexEdit) {
            return {
              ...item,
              subCategoryId: '',
              subCategory: '',
            };
          }
          return { ...item };
        }),
      );
    }
    const subCategoryId = value.split('-')[0];
    const subCategory = value.split('-')[1];
    setSessions((prev) =>
      prev.map((item, i: number) => {
        if (i === currentIndexEdit) {
          return {
            ...item,
            subCategoryId,
            subCategory,
          };
        }
        return { ...item };
      }),
    );
  };

  const onChangeDuration = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setSessions((prev) =>
        prev.map((item, i: number) => {
          if (i === currentIndexEdit) {
            return {
              ...item,
              duration: '',
            };
          }
          return { ...item };
        }),
      );
      return;
    }
    setSessions((prev) =>
      prev.map((item, i: number) => {
        if (i === currentIndexEdit) {
          return {
            ...item,
            duration: parseInt(e.target.value),
          };
        }
        return { ...item };
      }),
    );
  };

  const changeQuestionAssestmentType = (assessmentType: string) => {
    if (EditSession === null) return;
    if (assessmentType === '1-5') {
      setSessions((prev) =>
        prev.map((item, sessionIndex: number) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2) => {
                if (item2.Answers && item2.Answers.length > 4) {
                  const correctValue = 5;
                  let value = 0;
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer) => {
                      if (item.assessmentType === '+4/-1/0') {
                        if (answer.value !== 4) {
                          value = value + 1;
                          return { ...answer, value: value };
                        }
                      } else if (item.assessmentType === '+1/0') {
                        if (answer.value !== 1) {
                          value = value + 1;
                          return { ...answer, value: value };
                        }
                      } else {
                        if (answer.value !== 5) {
                          value = value + 1;
                          return { ...answer, value: value };
                        }
                      }
                      return { ...answer, value: correctValue };
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return { ...item };
        }),
      );
      return;
    } else if (assessmentType === '+5/0') {
      setSessions((prev) =>
        prev.map((item, sessionIndex: number) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2) => {
                if (item2.Answers && item2.Answers.length > 4) {
                  const correctValue = 5;
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer) => {
                      if (item.assessmentType === '+4/-1/0') {
                        if (answer.value !== 4) {
                          return { ...answer, value: 0 };
                        }
                      } else if (item.assessmentType === '+1/0') {
                        if (answer.value !== 1) {
                          return { ...answer, value: 0 };
                        }
                      } else {
                        if (answer.value !== 5) {
                          return { ...answer, value: 0 };
                        }
                      }
                      return { ...answer, value: correctValue };
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return { ...item };
        }),
      );
      return;
    } else if (assessmentType === '+1/0') {
      setSessions((prev) =>
        prev.map((item, sessionIndex: number) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2) => {
                if (item2.Answers && item2.Answers.length > 4) {
                  const correctValue = 1;
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer) => {
                      if (item.assessmentType === '+4/-1/0') {
                        if (answer.value !== 4) {
                          return { ...answer, value: 0 };
                        }
                      } else {
                        if (answer.value !== 5) {
                          return { ...answer, value: 0 };
                        }
                      }
                      return { ...answer, value: correctValue };
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return { ...item };
        }),
      );
      return;
    } else if (assessmentType === 'IRT') {
      setSessions((prev) =>
        prev.map((item, sessionIndex: number) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2) => {
                if (item2.Answers && item2.Answers.length > 4) {
                  const correctValue = 5;
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer) => {
                      if (item.assessmentType === '+4/-1/0') {
                        if (answer.value !== 4) {
                          return { ...answer, value: 0 };
                        }
                      } else if (item.assessmentType === '+1/0') {
                        if (answer.value !== 1) {
                          return { ...answer, value: 0 };
                        }
                      } else {
                        if (answer.value !== 5) {
                          return { ...answer, value: 0 };
                        }
                      }
                      return { ...answer, value: correctValue };
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return { ...item };
        }),
      );
      return;
    } else if (assessmentType === '+4/-1/0') {
      setSessions((prev) =>
        prev.map((item, sessionIndex: number) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2) => {
                if (item2.Answers && item2.Answers.length > 4) {
                  const correctValue = 4;
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer) => {
                      if (item.assessmentType === '+1/0') {
                        if (answer.value !== 1) {
                          return { ...answer, value: -1 };
                        }
                      } else {
                        if (answer.value !== 5) {
                          return { ...answer, value: -1 };
                        }
                      }
                      return { ...answer, value: correctValue };
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return { ...item };
        }),
      );
      return;
    }
  };

  const deleteSession = () => {
    setCurrentIndexEdit(null);
    setSessions((prev) =>
      prev.filter((_, i: number) => i !== currentIndexEdit),
    );
  };

  if (!EditSession) {
    return null;
  }

  return (
    <>
      <div
        id="heading"
        className="flex shrink-0 flex-col gap-[1rem] overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-[.5rem]">
            <div className="relative w-full overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
              <input
                type="text"
                value={
                  EditSession.categoryId
                    ? `${EditSession.categoryId}-${EditSession.category}`
                    : ''
                }
                required
                className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
              />
              <Select
                value={
                  EditSession.categoryId
                    ? `${EditSession.categoryId}-${EditSession.category}`
                    : 'placeholder'
                }
                onValueChange={(value) => {
                  value && onChangeCategory(value);
                }}
              >
                <SelectTrigger className="h-full w-full rounded-[.8rem] border-none bg-white shadow-none outline-none">
                  <SelectValue placeholder="Tes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="placeholder"
                    disabled
                  >
                    Tes
                  </SelectItem>
                  {category?.map((item) => (
                    <SelectItem
                      key={item.id}
                      value={`${item.id}-${item.name}`}
                    >
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {EditSession.categoryId && EditSession.categoryId?.length > 0 && (
              <div className="relative w-full overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
                <input
                  type="text"
                  value={
                    EditSession.subCategoryId
                      ? `${EditSession.subCategoryId}-${EditSession.subCategory}`
                      : ''
                  }
                  required
                  className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
                />
                <Select
                  value={
                    EditSession.subCategoryId
                      ? `${EditSession.subCategoryId}-${EditSession.subCategory}`
                      : 'placeholder'
                  }
                  onValueChange={(value) => {
                    value && onChangeSubCategory(value);
                  }}
                >
                  <SelectTrigger className="h-full w-full rounded-[.8rem] border-none bg-white shadow-none outline-none">
                    <SelectValue placeholder="Sub Tes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="placeholder"
                      disabled
                    >
                      Sub Tes
                    </SelectItem>
                    {category
                      ?.find((item) => item.id === EditSession.categoryId)
                      ?.TryoutSubCategory.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={`${item.id}-${item.name}`}
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <input
              type="number"
              placeholder="Durasi waktu"
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] text-[.9rem] outline-none duration-100 focus:shadow-default md:hover:shadow-default"
              required
              value={EditSession.duration === 0 ? '' : EditSession.duration}
              onChange={(e) => onChangeDuration(e)}
            />

            <div className="w-full overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
              <input
                type="text"
                defaultValue={assessmentType !== '' ? `${assessmentType}` : ''}
                required
                className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
              />
              <Select
                value={
                  assessmentType !== '' ? `${assessmentType}` : 'placeholder'
                }
                onValueChange={(value) => {
                  setAssesmentType(value);
                  changeQuestionAssestmentType(value);
                }}
              >
                <SelectTrigger className="h-full w-full rounded-[.8rem] border-none bg-white shadow-none outline-none">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="placeholder"
                    disabled
                  >
                    Penilain
                  </SelectItem>
                  <SelectItem value="1-5">1-5</SelectItem>
                  <SelectItem value="+5/0">+5/0</SelectItem>
                  <SelectItem value="IRT">IRT</SelectItem>
                  <SelectItem value="+4/-1/0">+4/-1/0</SelectItem>
                  <SelectItem value="+1/0">+1/0</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* <div className="bg-red-100 md:hover:bg-red-200 md:active:bg-red-100 text-red-700 font-medium rounded-[.8rem] py-[.8rem] px-[1rem] shrink-0 cursor-pointer duration-300 " onClick={deleteSession}>
                    Hapus sesi
                </div> */}
          <ModalDeleteSession deleteSession={deleteSession} />
        </div>
        <div className="grid w-full grid-cols-2 gap-[1rem]">
          <div className="flex w-full flex-col gap-[.5rem]">
            <p className="font-medium">Judul sesi</p>
            <input
              type="text"
              placeholder="Judul sesi...."
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] text-[.9rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              required
              value={EditSession.name}
              onChange={(e) => {
                setSessions((prev) =>
                  prev.map((item, i) => {
                    if (i === currentIndexEdit) {
                      return { ...item, name: e.target.value };
                    }
                    return { ...item };
                  }),
                );
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-[.5rem]">
            <p className="font-medium">
              Ambang batas{' '}
              <span className="text-main-gray-text2">(optional)</span>
            </p>
            <input
              type="number"
              placeholder="Ambang batas...."
              className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] text-[.9rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              value={
                EditSession.thresholdValue === 0
                  ? ''
                  : EditSession.thresholdValue
              }
              onChange={(e) => {
                setSessions((prev) =>
                  prev.map((item, i) => {
                    if (i === currentIndexEdit) {
                      return {
                        ...item,
                        thresholdValue: parseInt(e.target.value),
                      };
                    }
                    return { ...item };
                  }),
                );
              }}
            />
          </div>
        </div>
        <div className="flex w-full flex-col gap-[.5rem]">
          <p className="font-medium">
            Document ID untuk pembahasan{' '}
            <span className="text-main-gray-text2">(optional)</span>
          </p>
          <input
            type="text"
            placeholder="Document ID...."
            className="w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] text-[.9rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
            value={EditSession.documentId || ''}
            onChange={(e) => {
              setSessions((prev) =>
                prev.map((item, i) => {
                  if (i === currentIndexEdit) {
                    return { ...item, documentId: e.target.value };
                  }
                  return { ...item };
                }),
              );
            }}
          />
        </div>
        <div className="flex w-full flex-col gap-[.5rem] pb-[.8rem]">
          <div className="flex w-full items-center justify-between">
            <p className="font-medium">Generate soal</p>
            <div
              className="shrink-0 cursor-pointer rounded-[.4rem] bg-blue-100 px-[1rem] py-[.2rem] text-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
              onClick={() => {
                handleGenerate();
              }}
            >
              Generate
            </div>
          </div>
          <textarea
            id="context-for-generate-ai-edit"
            placeholder="Prompt generation"
            className="w-full shrink-0 rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
          />
        </div>
      </div>
      {loading && (
        <Dialog open={true}>
          <DialogContent
            className="overflow-hidden border-none bg-[#fff0] p-0 shadow-none"
            classOverlay="bg-[#ffffffe3]"
            hideClose
          >
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-semibold mb-2">
                Sedang Menggenerate Soal
              </DialogTitle>
            </DialogHeader>
            <div className="z-[100000000] flex items-center justify-center p-[1.5rem]">
              <div className="flex flex-col items-center">
                <Loader2 className="h-[2rem] w-[2rem] animate-spin" />
                <p className="text-center text-[1.1rem] font-medium">
                  AI Sedang Generate soal Tryout{' '}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default HeadingSessionTryout;
