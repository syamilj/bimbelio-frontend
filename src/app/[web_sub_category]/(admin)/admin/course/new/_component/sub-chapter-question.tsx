'use client';

import ReactMarkdown from '@/components/ui/react-markdown';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { env } from '@/env.mjs';
import { cn, replaceLatexNotation } from '@/lib/utils';
import { supabase } from '@/supabaseClient';
import 'katex/dist/katex.min.css';
import { CircleCheck, CircleX } from 'lucide-react';
import React, { SetStateAction, useCallback, useState } from 'react';
import { SubChapterProps } from '../page';

interface Props {
  EditSubChapter: SubChapterProps;
  questionIndex: number;
  setQuestionIndex: React.Dispatch<SetStateAction<number>>;
  currentIndexEdit: number | null;
  assessmentType: string;
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
}

const SubChapterQuestion = ({
  EditSubChapter,
  setSubChapter,
  currentIndexEdit,
  questionIndex,
  setQuestionIndex,
  assessmentType,
}: Props) => {
  const [showPreview, setShowPreview] = useState<number>(99999);
  const [showAnswerPreview, setShowAnswerPreview] = useState<number>(99999);
  const [showExplanationPreview, setShowExplanationPreview] =
    useState<number>(99999);

  const deleteQuestion = async (questionIndex: number) => {
    if (!EditSubChapter?.Questions) {
      return;
    }
    if (questionIndex === EditSubChapter?.Questions?.length - 1) {
      setQuestionIndex((prev) => {
        if (prev > 0) return prev - 1;
        else return prev;
      });
    }
    if (EditSubChapter.Questions[questionIndex].image) {
      const title = EditSubChapter.Questions[questionIndex].image;
      const deleteImage = await supabase?.storage
        .from('to_question')
        .remove([`${title}`]);
      if (deleteImage?.data) {
        setSubChapter((prev) =>
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
    setSubChapter((prev) =>
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
    setSubChapter((prev) => {
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
    if (
      EditSubChapter?.Questions &&
      EditSubChapter.Questions[questionIndex].image
    ) {
      const title = EditSubChapter.Questions[questionIndex].image;
      const deleteImage = await supabase?.storage
        .from('to_question')
        .remove([`${title}`]);
      if (deleteImage?.data) {
        setSubChapter((prev) =>
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
    setSubChapter((prev) => {
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
    setSubChapter((prev) => {
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

  const onChangeExplanation = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    questionIndex: number,
  ) => {
    setSubChapter((prev) => {
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
                return { ...item2, explanation: e.target.value };
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
    (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
      const newQuestionValue = e.target.value;
      setSubChapter((prev) => {
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
    [currentIndexEdit, setSubChapter],
  );

  const onChangeQuestionImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (EditSubChapter === null) return;
    const image = e.target.files ? e.target.files[0] : null;
    if (
      image &&
      EditSubChapter.Questions &&
      EditSubChapter.Questions[index].image
    ) {
      const filename = `${EditSubChapter.Questions[index].image}`;
      const upload = await supabase?.storage
        .from('to_question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await supabase?.storage
            .from('to_question')
            .update(`${filename}`, image);
          if (update?.data) {
          }
          if (update?.error) {
          }
        }
      }
      setSubChapter((prev) => {
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
        .from('to_question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await supabase?.storage
            .from('to_question')
            .update(`${filename}`, image);
          if (update?.data) {
          }
          if (update?.error) {
          }
        }
      }
      setSubChapter((prev) => {
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
    setSubChapter((prev) =>
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
    setSubChapter((prev) =>
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
    if (!EditSubChapter.Questions) return;

    const fixValue = parseInt(value) - 1;
    const currentAnswers = [...EditSubChapter.Questions[questionIndex].Answers];

    const [movedAnswer] = currentAnswers.splice(answerIndex, 1);

    currentAnswers.splice(fixValue, 0, movedAnswer);

    setSubChapter((prev) =>
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
    if (!EditSubChapter.Questions) return;

    const fixValue = parseInt(value) - 1;
    const currentQuestions = [...EditSubChapter.Questions];

    const [movedQuestion] = currentQuestions.splice(questionIndex, 1);

    currentQuestions.splice(fixValue, 0, movedQuestion);

    setSubChapter((prev) =>
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

  if (!EditSubChapter || EditSubChapter?.Questions.length < 1) {
    return null;
  }

  return (
    <div className="flex items-start">
      <div className="flex h-fit items-center justify-center px-[1rem] text-[1.2rem] font-medium">
        {/* {EditSubChapter.Questions[questionIndex].number} */}

        <Select
          value={`${EditSubChapter.Questions[questionIndex].number}`}
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
            {EditSubChapter.Questions.map((quest, i) => (
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
      <div className="flex w-full flex-col gap-[1rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              className="rounded-[.8rem] border border-transparent px-[1rem] py-[.5rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              placeholder="Subcategory soal"
              value={
                EditSubChapter.Questions[questionIndex].subCategory
                  ? EditSubChapter.Questions[questionIndex].subCategory
                  : ''
              }
              onChange={(e) => onChangeSubcategoryQuestion(e, questionIndex)}
            />
            <input
              type="text"
              className="rounded-[.8rem] border border-transparent px-[1rem] py-[.5rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              placeholder="SubSubCategory soal"
              value={
                EditSubChapter?.Questions[questionIndex].subSubCategory
                  ? EditSubChapter?.Questions[questionIndex].subSubCategory
                  : ''
              }
              onChange={(e) => onChangeSubSubCategoryQuestion(e, questionIndex)}
            />
          </div>
          <div
            className="shrink-0 cursor-pointer rounded-[.8rem] bg-red-100 px-[1.5rem] py-[.5rem] font-medium text-red-700 duration-300 md:hover:bg-red-200 md:active:bg-red-100"
            onClick={() => {
              deleteQuestion(questionIndex);
            }}
          >
            Hapus
          </div>
        </div>
        <div className="relative mt-[-.5rem]">
          {showPreview === questionIndex ? (
            <>
              <div className="absolute top-[calc(100%-2.5rem)] z-[1] h-[250px] w-full overflow-y-auto rounded-[.8rem] border bg-white p-[.5rem] shadow-default">
                <ReactMarkdown
                  value={replaceLatexNotation(
                    EditSubChapter?.Questions[questionIndex].question,
                  )}
                />
              </div>
              <textarea
                id={`question-${questionIndex}`}
                placeholder="Soal"
                className="relative z-0 h-[200px] w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
                required
                value={EditSubChapter.Questions[questionIndex].question}
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
              className="relative z-0 w-full rounded-[.8rem] border border-transparent bg-white px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              onClick={() => {
                setShowPreview(questionIndex);
                setTimeout(() => {
                  document.getElementById(`question-${questionIndex}`)?.focus();
                }, 200);
              }}
            >
              <input
                type="text"
                defaultValue={EditSubChapter.Questions[questionIndex].question}
                required
                className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
              />
              <ReactMarkdown
                value={
                  replaceLatexNotation(
                    EditSubChapter?.Questions[questionIndex].question,
                  ).length > 0
                    ? replaceLatexNotation(
                        EditSubChapter?.Questions[questionIndex].question,
                      )
                    : '.....'
                }
              />
            </div>
          )}
          {EditSubChapter.Questions[questionIndex].image ? (
            <div className="flex w-full gap-[1rem]">
              <div
                className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-[1rem] py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
                onClick={() => {
                  if (!EditSubChapter.Questions) {
                    return;
                  }
                  const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSubChapter.Questions[questionIndex].image} "")`;
                  navigator.clipboard.writeText(image);
                  addImageToQuestion(image, questionIndex);
                }}
              >
                Add Image
              </div>
              <div
                className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-[1rem] py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
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
              </div>
              <div
                className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-red-100 px-[1rem] py-[.5rem] text-[.8rem] font-medium text-red-700 duration-300 md:hover:shadow-default md:active:shadow-none"
                onClick={() => {
                  if (!EditSubChapter.Questions) {
                    return;
                  }
                  const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSubChapter.Questions[questionIndex].image} "")`;
                  navigator.clipboard.writeText(image);
                  deleteImageQuestion(questionIndex);
                }}
              >
                Delete Image
              </div>
            </div>
          ) : (
            <div
              className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-[1rem] py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
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
        </div>
        <div className="flex flex-col gap-[1rem]">
          {EditSubChapter.Questions[questionIndex].Answers?.map(
            (item2, answerIndex: number) => (
              <div
                key={answerIndex}
                className="flex items-center gap-[1rem]"
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
                  {showAnswerPreview === answerIndex ? (
                    <>
                      <div className="absolute top-[100%] z-[1] h-[250px] w-full overflow-y-auto rounded-[.8rem] border bg-white p-[.5rem] shadow-default">
                        <ReactMarkdown
                          value={replaceLatexNotation(item2.answer)}
                        />
                      </div>
                      <textarea
                        id={`answer-${answerIndex}`}
                        placeholder="Jawaban"
                        className="h-[50px] w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none focus:shadow-default md:hover:shadow-default"
                        required
                        value={item2.answer}
                        onChange={(e) => {
                          onChangeAnswer(
                            e.target.value,
                            questionIndex,
                            answerIndex,
                          );
                        }}
                        onFocus={() => setShowAnswerPreview(answerIndex)}
                        onBlur={() => setShowAnswerPreview(9999)}
                      />
                    </>
                  ) : (
                    <div
                      className="relative z-0 w-full rounded-[.8rem] border border-transparent bg-white px-[1rem] py-[.8rem] outline-none focus:shadow-default md:hover:shadow-default"
                      onClick={() => {
                        setShowAnswerPreview(answerIndex);
                        setTimeout(() => {
                          document
                            .getElementById(`answer-${answerIndex}`)
                            ?.focus();
                        }, 200);
                      }}
                    >
                      <input
                        type="text"
                        defaultValue={item2.answer}
                        required
                        className="absolute bottom-0 left-[1rem] h-1 w-1 p-0 text-transparent outline-none"
                      />
                      <ReactMarkdown
                        value={
                          replaceLatexNotation(item2.answer).length > 0
                            ? replaceLatexNotation(item2.answer)
                            : '.....'
                        }
                      />
                    </div>
                  )}
                  {/* <textarea placeholder="Jawaban" className="outline-none rounded-[.8rem] px-[1rem] py-[.8rem] h-[50px] w-full border border-transparent focus:shadow-default md:hover:shadow-default " required value={item2.answer} onChange={(e) => { onChangeAnswer(e.target.value, questionIndex, answerIndex) }} onFocus={() => setShowAnswerPreview(answerIndex)} onBlur={() => setShowAnswerPreview(9999)} /> */}
                </div>
                <div className="flex h-full items-center gap-[.5rem]">
                  {Array.from({
                    length:
                      assessmentType === '1-5'
                        ? 5
                        : assessmentType === '+5/0'
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
                        } else {
                          onChangeAnswerValue(
                            i + 1,
                            questionIndex,
                            answerIndex,
                            item2.value,
                          );
                        }
                      }}
                    >
                      {assessmentType === '1-5' ? (
                        <>{i + 1}</>
                      ) : assessmentType === '+5/0' ? (
                        <>{i * 5}</>
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
        {showExplanationPreview === questionIndex ? (
          <textarea
            id={`explanation-${questionIndex}`}
            placeholder="Explanation.."
            className="relative z-0 h-[200px] w-full rounded-[.8rem] border border-transparent px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
            required
            value={EditSubChapter?.Questions[questionIndex].explanation}
            onChange={(e) => {
              onChangeExplanation(e, questionIndex);
            }}
            onFocus={() => setShowExplanationPreview(questionIndex)}
            onBlur={() => {
              setShowExplanationPreview(99999);
            }}
          />
        ) : (
          <div
            className=""
            onClick={() => {
              setShowExplanationPreview(questionIndex);
              setTimeout(() => {
                const input = document.getElementById(
                  `explanation-${questionIndex}`,
                );
                input?.focus();
              }, 200);
            }}
          >
            <ReactMarkdown
              value={
                replaceLatexNotation(
                  EditSubChapter?.Questions[questionIndex]
                    .explanation as string,
                ).length > 0
                  ? replaceLatexNotation(
                      EditSubChapter?.Questions[questionIndex]
                        .explanation as string,
                    )
                  : '.....'
              }
            />
          </div>
        )}
        {showExplanationPreview === questionIndex && (
          <div
            className="relative z-0 w-full rounded-[.8rem] border border-transparent bg-white px-[1rem] py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
            onClick={() => {
              setShowExplanationPreview(questionIndex);
              setTimeout(() => {
                document
                  .getElementById(`explanation-${questionIndex}`)
                  ?.focus();
              }, 200);
            }}
          >
            <ReactMarkdown
              value={
                replaceLatexNotation(
                  EditSubChapter?.Questions[questionIndex]
                    .explanation as string,
                ).length > 0
                  ? replaceLatexNotation(
                      EditSubChapter?.Questions[questionIndex]
                        .explanation as string,
                    )
                  : '.....'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SubChapterQuestion;
