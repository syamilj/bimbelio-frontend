'use client';
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
import React, { SetStateAction, useState } from 'react';
import { Category, SessionProps } from '../page';
import ModalDeleteSession from './modal-delete';
// import { toaster } from "@/lib/utils";
// import { useCompletion } from "ai/react";

interface Props {
  EditSession: SessionProps;
  category: Category[] | undefined;
  assessmentType: string;
  setAssesmentType: React.Dispatch<SetStateAction<string>>;
  setSessions: React.Dispatch<SetStateAction<SessionProps[]>>;
  currentIndexEdit: number | null;
  setCurrentIndexEdit: React.Dispatch<SetStateAction<number | null>>;
}

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

const HeadingSessionTryout = ({
  EditSession,
  category,
  assessmentType,
  setAssesmentType,
  setSessions,
  currentIndexEdit,
  setCurrentIndexEdit,
}: Props) => {
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
      'context-for-generate-ai',
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
                  } else if (session.assessmentType === '+1/0') {
                    if (answer.value === 5) value = 1;
                    else value = 0;
                  } else if (session.assessmentType === '0-100') {
                    if (answer.value === 5) value = 1;
                    else value = 0;
                  }
                  return {
                    answer: answer.answer,
                    value,
                  };
                }),
                courseChapterIds: [],
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
    } else if (assessmentType === '+1/0' || assessmentType === '0-100') {
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
                      } else if (
                        item.assessmentType === '+1/0' ||
                        item.assessmentType === '0-100'
                      ) {
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
      <div id="heading" className="flex shrink-0 flex-col gap-4 pb-2">
        {/* Row 1: Category + SubCategory */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Kategori Tes</p>
            <div className="relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <input
                type="text"
                value={EditSession.categoryId ? `${EditSession.categoryId}-${EditSession.category}` : ''}
                readOnly
                required
                className="absolute bottom-0 left-4 h-px w-px p-0 opacity-0 pointer-events-none"
              />
              <Select
                value={EditSession.categoryId ? `${EditSession.categoryId}-${EditSession.category}` : 'placeholder'}
                onValueChange={(value) => { value && onChangeCategory(value); }}
              >
                <SelectTrigger className="h-9 w-full rounded-lg border-none bg-transparent shadow-none outline-none text-sm px-3">
                  <SelectValue placeholder="Pilih Tes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>Pilih Tes</SelectItem>
                  {category?.map((item) => (
                    <SelectItem key={item.id} value={`${item.id}-${item.name}`}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Sub Tes / Subtest</p>
            {EditSession.categoryId && EditSession.categoryId.length > 0 ? (
              <div className="relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                <input
                  type="text"
                  value={EditSession.subCategoryId ? `${EditSession.subCategoryId}-${EditSession.subCategory}` : ''}
                  readOnly
                  required
                  className="absolute bottom-0 left-4 h-px w-px p-0 opacity-0 pointer-events-none"
                />
                <Select
                  value={EditSession.subCategoryId ? `${EditSession.subCategoryId}-${EditSession.subCategory}` : 'placeholder'}
                  onValueChange={(value) => { value && onChangeSubCategory(value); }}
                >
                  <SelectTrigger className="h-9 w-full rounded-lg border-none bg-transparent shadow-none outline-none text-sm px-3">
                    <SelectValue placeholder="Pilih Sub Tes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder" disabled>Pilih Sub Tes</SelectItem>
                    {category?.find((item) => item.id === EditSession.categoryId)?.TryoutSubCategory.map((item) => (
                      <SelectItem key={item.id} value={`${item.id}-${item.name}`}>{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="h-9 rounded-lg border border-dashed border-gray-200 bg-gray-50 flex items-center px-3">
                <span className="text-sm text-gray-400">Pilih tes dulu</span>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Duration + Assessment + Threshold */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Durasi (mnt)</p>
            <input
              type="number"
              placeholder="60"
              className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              required
              value={EditSession.duration === 0 ? '' : EditSession.duration}
              onChange={(e) => onChangeDuration(e)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Penilaian</p>
            <div className="relative bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
              <input
                type="text"
                defaultValue={assessmentType !== '' ? `${assessmentType}` : ''}
                required
                className="absolute bottom-0 left-4 h-px w-px p-0 opacity-0 pointer-events-none"
              />
              <Select
                value={assessmentType !== '' ? `${assessmentType}` : 'placeholder'}
                onValueChange={(value) => {
                  setAssesmentType(value);
                  changeQuestionAssestmentType(value);
                }}
              >
                <SelectTrigger className="h-9 w-full rounded-lg border-none bg-transparent shadow-none outline-none text-sm px-3">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>Pilih Tipe</SelectItem>
                  <SelectItem value="1-5">1-5</SelectItem>
                  <SelectItem value="+5/0">+5/0</SelectItem>
                  <SelectItem value="IRT">IRT</SelectItem>
                  <SelectItem value="+4/-1/0">+4/-1/0</SelectItem>
                  <SelectItem value="+1/0">+1/0</SelectItem>
                  <SelectItem value="0-100">0-100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Ambang Batas</p>
            <input
              type="number"
              placeholder="opsional"
              className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
              value={EditSession.thresholdValue === 0 ? '' : EditSession.thresholdValue}
              onChange={(e) => {
                setSessions((prev) =>
                  prev.map((item, i) => {
                    if (i === currentIndexEdit) {
                      return { ...item, thresholdValue: parseInt(e.target.value) };
                    }
                    return { ...item };
                  }),
                );
              }}
            />
          </div>
        </div>

        {/* Row 3: Session Name + Document ID */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Judul Sesi</p>
            <input
              type="text"
              placeholder="Judul sesi..."
              className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
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
          <div className="flex flex-col gap-1.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
              Doc ID Pembahasan <span className="font-normal normal-case text-gray-400">(opsional)</span>
            </p>
            <input
              type="text"
              placeholder="Document ID..."
              className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300"
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
        </div>

        {/* Row 4: AI Generate */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Generate Soal dengan AI</p>
          <div className="flex gap-2">
            <textarea
              id="context-for-generate-ai"
              placeholder="Masukkan konteks materi untuk generate soal..."
              rows={2}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors hover:border-gray-300 resize-none"
            />
            <button
              type="button"
              className="shrink-0 self-end h-9 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold px-4 transition-colors whitespace-nowrap"
              onClick={() => { handleGenerate(); }}
            >
              Generate
            </button>
          </div>
        </div>

        {/* Row 5: Delete Session */}
        <ModalDeleteSession deleteSession={deleteSession} />
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
            <div className="z-100000000 flex items-center justify-center p-6">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-[2rem] animate-spin" />
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
