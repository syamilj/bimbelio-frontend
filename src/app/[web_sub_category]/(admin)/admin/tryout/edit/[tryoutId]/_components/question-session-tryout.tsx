'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { env } from '@/env.mjs';
import { cn } from '@/lib/utils';
import { supabase } from '@/supabaseClient';
import 'katex/dist/katex.min.css';
import {
  BookOpen,
  CircleCheck,
  CircleX,
  Loader2,
  Minus,
  Plus,
} from 'lucide-react';
import React, { SetStateAction, useCallback, useState } from 'react';
// import ReactMarkdown from 'react-markdown';
import { useEditTryoutContext } from '@/app/[web_sub_category]/(admin)/admin/tryout/_component/provider-edit-tryout';
import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { BlockNoteImageHtml } from '@/components/ui/blocknote-editor/latex';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useGet } from '@/lib/fetch-helper/useGet';
import { Category, CourseChapter, CourseSubChapter } from '@/types/database';
import { SessionProps } from '../page';

const QuestionSessionTryout = () => {
  const {
    EditSession,
    questionIndex,
    setSessions,
    currentIndexEdit,
    setQuestionIndex,
    assessmentType,
  } = useEditTryoutContext();

  const [showPreview, setShowPreview] = useState<number>(99999);
  const [showAnswerPreview, setShowAnswerPreview] = useState<number>(99999);
  const [showExplanationPreview, setShowExplanationPreview] =
    useState<number>(99999);

  const deleteQuestion = async (questionIndex: number) => {
    if (!EditSession?.Questions) {
      return;
    }
    if (questionIndex === EditSession?.Questions?.length - 1) {
      setQuestionIndex((prev) => prev - 1);
    }
    if (EditSession.Questions[questionIndex].image) {
      const title = EditSession.Questions[questionIndex].image;
      const deleteImage = await supabase?.storage
        .from('to-question')
        .remove([`${title}`]);
      if (deleteImage?.data) {
        setSessions((prev) =>
          prev.map((item, sessionIndex: number) => {
            if (
              sessionIndex === currentIndexEdit &&
              item.Questions &&
              item.Questions.length > 0
            ) {
              const newQuestions = item.Questions.filter(
                (_, qIndex) => qIndex !== questionIndex,
              );
              return {
                ...item,
                Questions: newQuestions.map((question, qIndex) => {
                  return { ...question, number: qIndex + 1 };
                }),
              };
            }
            return { ...item };
          }),
        );
      }
      if (deleteImage?.error) {
        alert('Failed delete image in question, try again');
      }
      return;
    }
    setSessions((prev) =>
      prev.map((item, sessionIndex: number) => {
        if (
          sessionIndex === currentIndexEdit &&
          item.Questions &&
          item.Questions.length > 0
        ) {
          const newQuestions = item.Questions.filter(
            (_, qIndex) => qIndex !== questionIndex,
          );
          return {
            ...item,
            Questions: newQuestions.map((question, qIndex) => {
              return { ...question, number: qIndex + 1 };
            }),
          };
        }
        return { ...item };
      }),
    );
  };

  const addImageToQuestion = (image: string, questionIndex: number) => {
    setSessions((prev) => {
      return prev.map((item, sessionIndex) => {
        if (
          sessionIndex === currentIndexEdit &&
          item.Questions &&
          item.Questions.length > 0
        ) {
          return {
            ...item,
            Questions: item.Questions.map((item2, qIndex) => {
              if (qIndex === questionIndex) {
                return { ...item2, question: `${item2.question}\n\n${image}` };
              }
              return item2;
            }),
          };
        }
        return item;
      });
    });
  };

  const deleteImageQuestion = async (questionIndex: number) => {
    if (EditSession?.Questions && EditSession.Questions[questionIndex].image) {
      const title = EditSession.Questions[questionIndex].image;
      const deleteImage = await supabase?.storage
        .from('to-question')
        .remove([`${title}`]);
      if (deleteImage?.data) {
        setSessions((prev) =>
          prev.map((session, sessionIndex) => {
            if (
              sessionIndex === currentIndexEdit &&
              session.Questions &&
              session.Questions.length > 0
            ) {
              return {
                ...session,
                Questions: session.Questions.map((question, qindex) => {
                  if (qindex === questionIndex) {
                    return {
                      ...question,
                      image: null,
                    };
                  }
                  return { ...question };
                }),
              };
            }
            return { ...session };
          }),
        );
      }
      if (deleteImage?.error) {
        alert('Failed delete image, try again');
      }
    }
  };

  const onChangeSubcategoryQuestion = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
  ) => {
    setSessions((prev) => {
      return prev.map((item, sessionIndex) => {
        if (
          sessionIndex === currentIndexEdit &&
          item.Questions &&
          item.Questions.length > 0
        ) {
          return {
            ...item,
            Questions: item.Questions.map((item2, qIndex) => {
              if (qIndex === questionIndex) {
                return { ...item2, subCategory: e.target.value };
              }
              return item2;
            }),
          };
        }
        return item;
      });
    });
  };

  const onChangeSubSubCategoryQuestion = (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
  ) => {
    setSessions((prev) => {
      return prev.map((item, sessionIndex) => {
        if (
          sessionIndex === currentIndexEdit &&
          item.Questions &&
          item.Questions.length > 0
        ) {
          return {
            ...item,
            Questions: item.Questions.map((item2, qIndex) => {
              if (qIndex === questionIndex) {
                return { ...item2, subSubCategory: e.target.value };
              }
              return item2;
            }),
          };
        }
        return item;
      });
    });
  };

  const onChangeExplanation = (value: string, questionIndex: number) => {
    setSessions((prev) => {
      return prev.map((item, sessionIndex) => {
        if (
          sessionIndex === currentIndexEdit &&
          item.Questions &&
          item.Questions.length > 0
        ) {
          return {
            ...item,
            Questions: item.Questions.map((item2, qIndex) => {
              if (qIndex === questionIndex) {
                return { ...item2, explanation: value };
              }
              return item2;
            }),
          };
        }
        return item;
      });
    });
  };

  const onChangeQuestion = useCallback(
    (value: string, index: number) => {
      const newQuestionValue = value;
      setSessions((prev) => {
        return prev.map((item, sessionIndex) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2, qIndex) => {
                if (qIndex === index) {
                  return { ...item2, question: newQuestionValue };
                }
                return item2;
              }),
            };
          }
          return item;
        });
      });
    },
    [currentIndexEdit, setSessions],
  );

  const onChangeQuestionImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (EditSession === null) return;
    const image = e.target.files ? e.target.files[0] : null;
    if (image && EditSession.Questions && EditSession.Questions[index].image) {
      const filename = `${EditSession.Questions[index].image}`;
      const upload = await supabase?.storage
        .from('to-question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await supabase?.storage
            .from('to-question')
            .update(`${filename}`, image);
          if (update?.data) {
          }
          if (update?.error) {
          }
        }
      }
      setSessions((prev) => {
        return prev.map((item, sessionIndex) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2, qIndex) => {
                if (qIndex === index) {
                  return { ...item2, image: filename };
                }
                return item2;
              }),
            };
          }
          return item;
        });
      });
      return;
    }
    if (image) {
      const filename = `${crypto.randomUUID()}-${index + 1}`;
      const upload = await supabase?.storage
        .from('to-question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await supabase?.storage
            .from('to-question')
            .update(`${filename}`, image);
          if (update?.data) {
          }
          if (update?.error) {
          }
        }
      }
      setSessions((prev) => {
        return prev.map((item, sessionIndex) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2, qIndex) => {
                if (qIndex === index) {
                  return { ...item2, image: filename };
                }
                return item2;
              }),
            };
          }
          return item;
        });
      });
      return;
    }
  };

  const onChangeAnswerValue = (
    value: number,
    questionIndex: number,
    answerIndex: number,
    prevValue: number,
  ) => {
    setSessions((prev) =>
      prev.map((item, sessionIndex: number) => {
        if (
          sessionIndex === currentIndexEdit &&
          item.Questions &&
          item.Questions.length > 0
        ) {
          return {
            ...item,
            Questions: item.Questions.map((item2, qIndex) => {
              if (
                qIndex === questionIndex &&
                item2.Answers &&
                item2.Answers.length > 0
              ) {
                return {
                  ...item2,
                  Answers: item2.Answers?.map((item3, aIndex) => {
                    let data = { ...item3 };
                    if (item3.value === value) {
                      data = { ...data, value: prevValue };
                    }
                    if (aIndex === answerIndex) {
                      return { ...data, value };
                    }
                    return { ...data };
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
  };

  const onChangeAnswer = (
    answer: string,
    questionIndex: number,
    answerIndex: number,
  ) => {
    setSessions((prev) =>
      prev.map((item, sessionIndex: number) => {
        if (
          sessionIndex === currentIndexEdit &&
          item.Questions &&
          item.Questions.length > 0
        ) {
          return {
            ...item,
            Questions: item.Questions.map((item2, qIndex) => {
              if (
                qIndex === questionIndex &&
                item2.Answers &&
                item2.Answers.length > 0
              ) {
                return {
                  ...item2,
                  Answers: item2.Answers?.map((item3, aIndex) => {
                    if (aIndex === answerIndex) {
                      return { ...item3, answer };
                    }
                    return { ...item3 };
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
  };

  const changeAnswerOrder = (value: string, answerIndex: number) => {
    if (!EditSession?.Questions) return;

    const fixValue = parseInt(value) - 1;
    const currentAnswers = [...EditSession?.Questions[questionIndex].Answers];

    const [movedAnswer] = currentAnswers.splice(answerIndex, 1);

    currentAnswers.splice(fixValue, 0, movedAnswer);

    setSessions((prev) =>
      prev.map((session, sessionIndex) => {
        if (sessionIndex === currentIndexEdit && session.Questions) {
          return {
            ...session,
            Questions: session.Questions.map((question, qIndex) => {
              if (qIndex === questionIndex) {
                return {
                  ...question,
                  Answers: currentAnswers,
                };
              }
              return question;
            }),
          };
        }
        return session;
      }),
    );
  };
  const changeQuestionOrder = (value: string, questionIndex: number) => {
    if (!EditSession?.Questions) return;

    const fixValue = parseInt(value) - 1;
    const currentQuestions = [...EditSession?.Questions];

    const [movedQuestion] = currentQuestions.splice(questionIndex, 1);

    currentQuestions.splice(fixValue, 0, movedQuestion);

    setSessions((prev) =>
      prev.map((session, sessionIndex) => {
        if (sessionIndex === currentIndexEdit && session.Questions) {
          return {
            ...session,
            Questions: currentQuestions.map((quest, qIndex) => {
              return { ...quest, number: qIndex + 1 };
            }),
          };
        }
        return session;
      }),
    );
    setQuestionIndex(fixValue);
  };

  // if (!EditSession.Questions || EditSession.Questions && EditSession.Questions.length < 1) {
  //     return null
  // }
  if (!EditSession || EditSession?.Questions.length < 1) {
    return null;
  }

  return (
    <div className="flex items-start">
      <div className="flex h-fit items-center justify-center px-4 text-[1.2rem] font-medium">
        {/* {EditSession.Questions[questionIndex].number} */}

        <Select
          value={`${EditSession?.Questions[questionIndex].number}`}
          onValueChange={(value) => {
            value && changeQuestionOrder(value, questionIndex);
          }}
        >
          <SelectTrigger className="h-full rounded-[.8rem] border-none bg-white shadow-none outline-none">
            <SelectValue placeholder="Urutan Soal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              value="placeholder"
              disabled
            >
              Urutan Soal
            </SelectItem>
            {EditSession?.Questions.map((quest, i) => (
              <SelectItem
                key={i}
                value={`${quest.number}`}
              >
                {quest.number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              className="rounded-[.8rem] border border-transparent px-4 py-[.5rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              placeholder="SubCategory soal"
              value={
                EditSession?.Questions[questionIndex].subCategory
                  ? EditSession?.Questions[questionIndex].subCategory
                  : ''
              }
              onChange={(e) => onChangeSubcategoryQuestion(e, questionIndex)}
            />
            <input
              type="text"
              className="rounded-[.8rem] border border-transparent px-4 py-[.5rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              placeholder="SubSubCategory soal"
              value={
                EditSession?.Questions[questionIndex].subSubCategory
                  ? EditSession?.Questions[questionIndex].subSubCategory
                  : ''
              }
              onChange={(e) => onChangeSubSubCategoryQuestion(e, questionIndex)}
            />
          </div>
          <div
            className="shrink-0 cursor-pointer rounded-[.8rem] bg-red-100 px-6 py-[.5rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100"
            onClick={() => {
              deleteQuestion(questionIndex);
            }}
          >
            Hapus
          </div>
        </div>
        <div className="relative mt-[-.5rem]">
          {/* {showPreview === questionIndex ? (
            <>
              <div className="absolute top-[calc(100%-2.5rem)] z-1 h-[250px] w-full overflow-y-auto rounded-[.8rem] border bg-white p-[.5rem] text-[.9rem] shadow-default">
                <ReactMarkdown
                  value={replaceLatexNotation(
                    EditSession?.Questions[questionIndex].question,
                  )}
                />
              </div>
              <textarea
                id={`question-${questionIndex}`}
                placeholder="Soal"
                className="relative z-0 h-[200px] w-full rounded-[.8rem] border border-transparent px-4 py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
                required
                value={EditSession?.Questions[questionIndex].question}
                onChange={(e) => {
                  onChangeQuestion(e, questionIndex);
                }}
                onFocus={() => setShowPreview(questionIndex)}
                onBlur={() => {
                  setShowPreview(99999);
                }}
              />
            </>
          ) : (
            <div
              className="relative z-0 w-full rounded-[.8rem] border border-transparent bg-white px-4 py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              onClick={() => {
                setShowPreview(questionIndex);
                setTimeout(() => {
                  document.getElementById(`question-${questionIndex}`)?.focus();
                }, 200);
              }}
            >
              <input
                type="text"
                defaultValue={EditSession?.Questions[questionIndex].question}
                required
                className="absolute bottom-0 left-4 h-1 w-1 p-0 text-transparent outline-none"
              />
              <ReactMarkdown
                value={
                  replaceLatexNotation(
                    EditSession?.Questions[questionIndex].question,
                  ).length > 0
                    ? replaceLatexNotation(
                        EditSession?.Questions[questionIndex].question,
                      )
                    : '.....'
                }
              />
            </div>
          )} */}
          <div className="relative z-1 w-full rounded-[.8rem] border border-transparent bg-white px-4 py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default">
            <BlocknoteEditor
              value={EditSession.Questions[questionIndex].question}
              onValueChange={(value) => {
                onChangeQuestion(value, questionIndex);
              }}
            />
          </div>
          <UploadImageQuestion />
        </div>
        <div className="flex flex-col gap-4">
          {EditSession?.Questions[questionIndex].Answers?.map(
            (item2, answerIndex) => (
              <div
                key={answerIndex}
                className="flex items-center gap-4"
              >
                <div className="h-full overflow-visible rounded-[.8rem] border border-transparent bg-white duration-300 md:hover:shadow-default">
                  <Select
                    value={`${answerIndex + 1}`}
                    onValueChange={(value) => {
                      changeAnswerOrder(value, answerIndex);
                    }}
                  >
                    <SelectTrigger className="h-full rounded-[.8rem] border-none bg-white shadow-none outline-none">
                      <SelectValue placeholder="Urutan Jawaban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="placeholder"
                        disabled
                      >
                        Urutan Jawaban
                      </SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative w-full">
                  <div className="relative z-1 w-full rounded-[.8rem] border border-transparent bg-white px-4 py-[.8rem] outline-none focus:shadow-default md:hover:shadow-default">
                    <BlocknoteEditor
                      value={item2.answer}
                      onValueChange={(value) => {
                        onChangeAnswer(value, questionIndex, answerIndex);
                      }}
                    />
                  </div>
                  <UploadImageAnswer answerIndex={answerIndex} />
                </div>
                <div className="flex h-full items-center gap-[.5rem]">
                  {Array.from({
                    length:
                      assessmentType === '1-5'
                        ? 5
                        : assessmentType === '+5/0'
                          ? 2
                          : assessmentType === '+1/0'
                            ? 2
                            : assessmentType === 'IRT'
                              ? 2
                              : assessmentType === '+4/-1/0'
                                ? 2
                                : 0,
                  }).map((_: any, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        'flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[.8rem] bg-white font-medium text-main-gray-text duration-300 md:hover:bg-main-gray-input md:active:shadow-default',
                        assessmentType === '1-5' &&
                          i + 1 === item2.value &&
                          'bg-main text-white md:hover:bg-main',
                        assessmentType === '+5/0' &&
                          i * 5 === item2.value &&
                          'bg-main text-white md:hover:bg-main',
                        assessmentType === '+1/0' &&
                          i * 1 === item2.value &&
                          'bg-main text-white md:hover:bg-main',
                        assessmentType === 'IRT' &&
                          i * 5 === item2.value &&
                          'bg-main text-white md:hover:bg-main',
                        assessmentType === '+4/-1/0' &&
                          i * 5 + 1 === item2.value + 2 &&
                          'bg-main text-white md:hover:bg-main',
                      )}
                      onClick={() => {
                        if (assessmentType === '1-5') {
                          onChangeAnswerValue(
                            i + 1,
                            questionIndex,
                            answerIndex,
                            item2.value,
                          );
                        } else if (assessmentType === '+5/0') {
                          onChangeAnswerValue(
                            i * 5,
                            questionIndex,
                            answerIndex,
                            item2.value,
                          );
                        } else if (assessmentType === '+1/0') {
                          onChangeAnswerValue(
                            i * 1,
                            questionIndex,
                            answerIndex,
                            item2.value,
                          );
                        } else if (assessmentType === 'IRT') {
                          onChangeAnswerValue(
                            i * 5,
                            questionIndex,
                            answerIndex,
                            item2.value,
                          );
                        } else if (assessmentType === '+4/-1/0') {
                          onChangeAnswerValue(
                            i * 5 - 1,
                            questionIndex,
                            answerIndex,
                            item2.value,
                          );
                        }
                        // else {
                        //   onChangeAnswerValue(
                        //     i + 1,
                        //     questionIndex,
                        //     answerIndex,
                        //     item2.value,
                        //   );
                        // }
                      }}
                    >
                      {assessmentType === '1-5' ? (
                        <>{i + 1}</>
                      ) : assessmentType === '+5/0' ? (
                        <>{i * 5}</>
                      ) : assessmentType === '+1/0' ? (
                        <>{i * 1}</>
                      ) : assessmentType === 'IRT' && i == 0 ? (
                        <CircleX />
                      ) : assessmentType === 'IRT' && i == 1 ? (
                        <CircleCheck />
                      ) : assessmentType === '+4/-1/0' && i == 0 ? (
                        <CircleX />
                      ) : assessmentType === '+4/-1/0' && i == 1 ? (
                        <CircleCheck />
                      ) : (
                        <>{i + 1}</>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
        <div className="relative z-0 w-full rounded-[.8rem] border border-transparent bg-white px-4 py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default">
          <BlocknoteEditor
            value={EditSession.Questions[questionIndex].explanation}
            onValueChange={(value) => {
              onChangeExplanation(value, questionIndex);
            }}
          />
        </div>
        <SelectedCourseChapter
          setSessions={setSessions}
          currentIndexEdit={currentIndexEdit}
          questionIndex={questionIndex}
          EditSession={EditSession}
        />
      </div>
    </div>
  );
};

export default QuestionSessionTryout;

const SelectedCourseChapter = ({
  setSessions,
  currentIndexEdit,
  questionIndex,
  EditSession,
}: {
  setSessions: React.Dispatch<SetStateAction<SessionProps[]>>;
  currentIndexEdit: number | null;
  questionIndex: number;
  EditSession: SessionProps;
}) => {
  const currentQuestion = EditSession.Questions[questionIndex];

  const { data: Categories } = useGet<Category[]>('/category/getAllCategories');

  const selectedCategory = Categories?.find(
    (item) => item.id === currentQuestion.categoryId,
  );

  const { data: CourseOptions, isLoading } = useGet<
    (CourseChapter & {
      Category: Category;
      CourseSubChapter: CourseSubChapter[];
    })[]
  >('/course/getCourseUserByCategoryId', {
    params: {
      categoryId: currentQuestion.categoryId,
    },
    useEffectDependencies: [currentQuestion.categoryId],
  });

  return (
    <div className="bg-white rounded-[.8rem] p-4 flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="categoryId">Category Course</Label>
        <Select
          name="categoryId"
          value={currentQuestion.categoryId || 'placeholder'}
          onValueChange={(value) => {
            setSessions((prev) =>
              prev.map((session, sessionIndex) => {
                if (sessionIndex === currentIndexEdit && session.Questions) {
                  return {
                    ...session,
                    Questions: session.Questions.map((quest, qIndex) => {
                      if (qIndex === questionIndex) {
                        return {
                          ...quest,
                          categoryId: value,
                        };
                      }
                      return quest;
                    }),
                  };
                }
                return session;
              }),
            );
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih category course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="placeholder">Pilih category course</SelectItem>
            {Categories?.map((subject) => (
              <SelectItem
                key={subject.id}
                value={subject.id}
              >
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>Course yang Tersedia untuk {selectedCategory?.name}</Label>
          {isLoading ? (
            <div className="flex w-full justify-center items-center h-[150px]">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : CourseOptions?.length === 0 || !selectedCategory?.id ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>
                Belum ada course tersedia untuk mata pelajaran{' '}
                {selectedCategory?.name}
              </p>
            </div>
          ) : (
            <div className="space-y-4 pt-1">
              {CourseOptions?.map((chapter) => {
                const isSelected = currentQuestion.courseChapterIds.includes(
                  chapter.id,
                );

                return (
                  <div
                    key={chapter.id}
                    className={cn(
                      'flex items-center justify-between p-3 border rounded-lg bg-gray-50',
                      isSelected && 'border-main bg-main/10',
                    )}
                  >
                    <h4 className="font-medium text-gray-900 mb-3">
                      {chapter.title}
                    </h4>
                    <div className="flex gap-2 ml-3">
                      <Button
                        type="button"
                        size="sm"
                        variant={'outline'}
                        onClick={() => {
                          setSessions((prev) =>
                            prev.map((session, sessionIndex) => {
                              if (
                                sessionIndex === currentIndexEdit &&
                                session.Questions
                              ) {
                                return {
                                  ...session,
                                  Questions: session.Questions.map(
                                    (quest, qIndex) => {
                                      if (
                                        qIndex === questionIndex &&
                                        quest.courseChapterIds.includes(
                                          chapter.id,
                                        )
                                      ) {
                                        return {
                                          ...quest,
                                          courseChapterIds:
                                            quest.courseChapterIds.filter(
                                              (item) => item !== chapter.id,
                                            ),
                                        };
                                      } else if (
                                        qIndex === questionIndex &&
                                        !quest.courseChapterIds.includes(
                                          chapter.id,
                                        )
                                      ) {
                                        return {
                                          ...quest,
                                          courseChapterIds: [
                                            ...quest.courseChapterIds,
                                            chapter.id,
                                          ],
                                        };
                                      }
                                      return quest;
                                    },
                                  ),
                                };
                              }
                              return session;
                            }),
                          );
                        }}
                        className={cn(
                          'text-xs bg-main text-white cursor-pointer hover:bg-main/90 hover:text-white px-2',
                          isSelected && 'bg-red-500 hover:bg-red-400',
                        )}
                      >
                        {isSelected ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UploadImageQuestion = () => {
  const { EditSession, questionIndex, setSessions, currentIndexEdit } =
    useEditTryoutContext();

  const addImageToQuestion = (image: string, questionIndex: number) => {
    setSessions((prev) => {
      return prev.map((item, sessionIndex) => {
        if (
          sessionIndex === currentIndexEdit &&
          item.Questions &&
          item.Questions.length > 0
        ) {
          return {
            ...item,
            Questions: item.Questions.map((item2, qIndex) => {
              if (qIndex === questionIndex) {
                return { ...item2, question: `${item2.question}\n\n${image}` };
              }
              return item2;
            }),
          };
        }
        return item;
      });
    });
  };

  const onChangeQuestionImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (EditSession === null) return;
    const image = e.target.files ? e.target.files[0] : null;
    if (image && EditSession.Questions && EditSession.Questions[index].image) {
      const filename = `${EditSession.Questions[index].image}`;
      const upload = await supabase?.storage
        .from('to-question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await supabase?.storage
            .from('to-question')
            .update(`${filename}`, image);
          if (update?.data) {
          }
          if (update?.error) {
          }
        }
      }
      setSessions((prev) => {
        return prev.map((item, sessionIndex) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2, qIndex) => {
                if (qIndex === index) {
                  return { ...item2, image: filename };
                }
                return item2;
              }),
            };
          }
          return item;
        });
      });
      return;
    }
    if (image) {
      const filename = `${crypto.randomUUID()}-${index + 1}`;
      const upload = await supabase?.storage
        .from('to-question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await supabase?.storage
            .from('to-question')
            .update(`${filename}`, image);
          if (update?.data) {
          }
          if (update?.error) {
          }
        }
      }
      setSessions((prev) => {
        return prev.map((item, sessionIndex) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2, qIndex) => {
                if (qIndex === index) {
                  return { ...item2, image: filename };
                }
                return item2;
              }),
            };
          }
          return item;
        });
      });
      return;
    }
  };

  const deleteImageQuestion = async (questionIndex: number) => {
    if (EditSession?.Questions && EditSession.Questions[questionIndex].image) {
      const title = EditSession.Questions[questionIndex].image;
      const deleteImage = await supabase?.storage
        .from('to-question')
        .remove([`${title}`]);
      if (deleteImage?.data) {
        setSessions((prev) =>
          prev.map((session, sessionIndex) => {
            if (
              sessionIndex === currentIndexEdit &&
              session.Questions &&
              session.Questions.length > 0
            ) {
              return {
                ...session,
                Questions: session.Questions.map((question, qindex) => {
                  if (qindex === questionIndex) {
                    return {
                      ...question,
                      image: null,
                    };
                  }
                  return { ...question };
                }),
              };
            }
            return { ...session };
          }),
        );
      }
      if (deleteImage?.error) {
        alert('Failed delete image, try again');
      }
    }
  };

  return (
    <>
      {EditSession?.Questions[questionIndex].image ? (
        <div className="flex w-full gap-4">
          <div
            className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-4 py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
            onClick={() => {
              if (!EditSession?.Questions) {
                return;
              }
              // const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSession?.Questions[questionIndex].image} "")`;
              // navigator.clipboard.writeText(image);
              const image = BlockNoteImageHtml(
                `${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSession?.Questions[questionIndex].image}`,
              );
              addImageToQuestion(image, questionIndex);
            }}
          >
            Add Image
          </div>
          {/* <div
            className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-4 py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
            onClick={() => {
              document.getElementById(`image-${questionIndex}`)?.click();
            }}
          >
            <input
              id={`image-${questionIndex}`}
              type="file"
              className="w-0 overflow-auto p-0"
              onChange={(e) => {
                onChangeQuestionImage(e, questionIndex);
              }}
            />
            Change Image
          </div> */}
          <div
            className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-red-100 px-4 py-[.5rem] text-[.8rem] font-medium text-red-700 duration-300 md:hover:shadow-default md:active:shadow-none"
            onClick={() => {
              if (!EditSession?.Questions) {
                return;
              }
              const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSession?.Questions[questionIndex].image} "")`;
              navigator.clipboard.writeText(image);
              deleteImageQuestion(questionIndex);
            }}
          >
            Delete Image
          </div>
        </div>
      ) : (
        <div
          className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-4 py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
          onClick={() => {
            document.getElementById(`image-${questionIndex}`)?.click();
          }}
        >
          <input
            id={`image-${questionIndex}`}
            type="file"
            className="w-0 overflow-auto p-0"
            onChange={(e) => {
              onChangeQuestionImage(e, questionIndex);
            }}
          />
          Upload Gambar
        </div>
      )}
    </>
  );
};

const UploadImageAnswer = ({ answerIndex }: { answerIndex: number }) => {
  const { EditSession, questionIndex, setSessions, currentIndexEdit } =
    useEditTryoutContext();

  const imageValue =
    EditSession?.Questions[questionIndex].Answers[answerIndex].image || null;

  const addImageToQuestion = (
    image: string,
    questionIndex: number,
    answerIndex: number,
  ) => {
    setSessions((prev) => {
      return prev.map((item, sessionIndex) => {
        if (
          sessionIndex === currentIndexEdit &&
          item.Questions &&
          item.Questions.length > 0
        ) {
          return {
            ...item,
            Questions: item.Questions.map((item2, qIndex) => {
              if (qIndex === questionIndex) {
                return {
                  ...item2,
                  Answers: item2.Answers?.map((answer, aIndex) => {
                    if (aIndex === answerIndex) {
                      return {
                        ...answer,
                        answer: `${answer.answer}\n\n${image}`,
                      };
                    }
                    return answer;
                  }),
                };
              }
              return item2;
            }),
          };
        }
        return item;
      });
    });
  };
  //\n\n${image}
  const onChangeQuestionImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number,
    answerIndex: number,
  ) => {
    if (EditSession === null) return;
    const image = e.target.files ? e.target.files[0] : null;
    if (image && EditSession.Questions && imageValue) {
      const filename = `${imageValue}`;
      const upload = await supabase?.storage
        .from('to-question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await supabase?.storage
            .from('to-question')
            .update(`${filename}`, image);
          if (update?.data) {
          }
          if (update?.error) {
          }
        }
      }
      setSessions((prev) => {
        return prev.map((item, sessionIndex) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2, qIndex) => {
                if (qIndex === questionIndex) {
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer, aIndex) => {
                      if (aIndex === answerIndex) {
                        return { ...answer, image: filename };
                      }
                      return answer;
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return item;
        });
      });
      return;
    }
    if (image) {
      const filename = `${crypto.randomUUID()}-${answerIndex + 1}`;
      const upload = await supabase?.storage
        .from('to-question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await supabase?.storage
            .from('to-question')
            .update(`${filename}`, image);
          if (update?.data) {
          }
          if (update?.error) {
          }
        }
      }
      setSessions((prev) => {
        return prev.map((item, sessionIndex) => {
          if (
            sessionIndex === currentIndexEdit &&
            item.Questions &&
            item.Questions.length > 0
          ) {
            return {
              ...item,
              Questions: item.Questions.map((item2, qIndex) => {
                if (qIndex === questionIndex) {
                  return {
                    ...item2,
                    Answers: item2.Answers?.map((answer, aIndex) => {
                      if (aIndex === answerIndex) {
                        return { ...answer, image: filename };
                      }
                      return answer;
                    }),
                  };
                }
                return item2;
              }),
            };
          }
          return item;
        });
      });
      return;
    }
  };

  const deleteImageQuestion = async (
    questionIndex: number,
    answerIndex: number,
  ) => {
    if (EditSession?.Questions && imageValue) {
      const title = imageValue;
      const deleteImage = await supabase?.storage
        .from('to-question')
        .remove([`${title}`]);
      if (deleteImage?.data) {
        setSessions((prev) =>
          prev.map((session, sessionIndex) => {
            if (
              sessionIndex === currentIndexEdit &&
              session.Questions &&
              session.Questions.length > 0
            ) {
              return {
                ...session,
                Questions: session.Questions.map((question, qindex) => {
                  if (qindex === questionIndex) {
                    return {
                      ...question,
                      Answers: question.Answers?.map((answer, aIndex) => {
                        if (aIndex === answerIndex) {
                          return { ...answer, image: null };
                        }
                        return answer;
                      }),
                    };
                  }
                  return { ...question };
                }),
              };
            }
            return { ...session };
          }),
        );
      }
      if (deleteImage?.error) {
        alert('Failed delete image, try again');
      }
    }
  };

  return (
    <>
      {imageValue ? (
        <div className="flex w-full gap-4">
          <div
            className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-4 py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
            onClick={() => {
              if (!EditSession?.Questions) {
                return;
              }
              // const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSession?.Questions[questionIndex].image} "")`;
              // navigator.clipboard.writeText(image);
              const image = BlockNoteImageHtml(
                `${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${imageValue}`,
              );
              addImageToQuestion(image, questionIndex, answerIndex);
            }}
          >
            Add Image
          </div>
          {/* <div
            className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-4 py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
            onClick={() => {
              document.getElementById(`image-${questionIndex}`)?.click();
            }}
          >
            <input
              id={`image-${questionIndex}`}
              type="file"
              className="w-0 overflow-auto p-0"
              onChange={(e) => {
                onChangeQuestionImage(e, questionIndex);
              }}
            />
            Change Image
          </div> */}
          <div
            className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-red-100 px-4 py-[.5rem] text-[.8rem] font-medium text-red-700 duration-300 md:hover:shadow-default md:active:shadow-none"
            onClick={() => {
              if (!EditSession?.Questions) {
                return;
              }
              const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSession?.Questions[questionIndex].image} "")`;
              navigator.clipboard.writeText(image);
              deleteImageQuestion(questionIndex, answerIndex);
            }}
          >
            Delete Image
          </div>
        </div>
      ) : (
        <div
          className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-4 py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
          onClick={() => {
            document
              .getElementById(`answer-${questionIndex}-${answerIndex}`)
              ?.click();
          }}
        >
          <input
            id={`answer-${questionIndex}-${answerIndex}`}
            type="file"
            className="w-0 overflow-auto p-0"
            onChange={(e) => {
              onChangeQuestionImage(e, questionIndex, answerIndex);
            }}
          />
          Upload Gambar
        </div>
      )}
    </>
  );
};
