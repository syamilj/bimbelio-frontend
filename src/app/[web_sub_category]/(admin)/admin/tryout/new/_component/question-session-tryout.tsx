'use client';

import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { BlockNoteImageHtml } from '@/components/ui/blocknote-editor/latex';
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
import { CircleCheck, CircleX } from 'lucide-react';
import React, { SetStateAction, useCallback } from 'react';
import { SessionProps } from '../page';

interface Props {
  EditSession: SessionProps;
  questionIndex: number;
  setQuestionIndex: React.Dispatch<SetStateAction<number>>;
  currentIndexEdit: number | null;
  assessmentType: string;
  setSessions: React.Dispatch<SetStateAction<SessionProps[]>>;
}

const QuestionSessionTryout = ({
  EditSession,
  setSessions,
  currentIndexEdit,
  questionIndex,
  setQuestionIndex,
  assessmentType,
}: Props) => {
  const deleteQuestion = async (questionIndex: number) => {
    if (!EditSession?.Questions) {
      return;
    }
    if (questionIndex === EditSession?.Questions?.length - 1) {
      setQuestionIndex((prev) => {
        if (prev > 0) return prev - 1;
        else return prev;
      });
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
    if (!EditSession.Questions) return;

    const fixValue = parseInt(value) - 1;
    const currentAnswers = [...EditSession.Questions[questionIndex].Answers];

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
    if (!EditSession.Questions) return;

    const fixValue = parseInt(value) - 1;
    const currentQuestions = [...EditSession.Questions];

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

  if (!EditSession || EditSession?.Questions.length < 1) {
    return null;
  }

  return (
    <div className="flex items-start">
      <div className="flex h-fit items-center justify-center px-4 text-[1.2rem] font-medium">
        {/* {EditSession.Questions[questionIndex].number} */}

        <Select
          value={`${EditSession.Questions[questionIndex].number}`}
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
            {EditSession.Questions.map((quest, i) => (
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
          <input
            type="text"
            className="rounded-[.8rem] border border-transparent px-4 py-[.5rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
            placeholder="Subcategory soal"
            value={
              EditSession.Questions[questionIndex].subCategory
                ? EditSession.Questions[questionIndex].subCategory
                : ''
            }
            onChange={(e) => onChangeSubcategoryQuestion(e, questionIndex)}
          />
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
          <div className="relative z-1 w-full rounded-[.8rem] border border-transparent bg-white px-4 py-[.8rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default">
            <BlocknoteEditor
              value={EditSession.Questions[questionIndex].question}
              onValueChange={(value) => {
                onChangeQuestion(value, questionIndex);
              }}
            />
          </div>
          <UploadImageQuestion
            EditSession={EditSession}
            currentIndexEdit={currentIndexEdit}
            questionIndex={questionIndex}
            setSessions={setSessions}
          />
        </div>
        <div className="flex flex-col gap-4">
          {EditSession.Questions[questionIndex].Answers?.map(
            (item2, answerIndex: number) => (
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
                  <UploadAnswerQuestion
                    EditSession={EditSession}
                    currentIndexEdit={currentIndexEdit}
                    questionIndex={questionIndex}
                    setSessions={setSessions}
                    answerIndex={answerIndex}
                  />
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
      </div>
    </div>
  );
};

export default QuestionSessionTryout;

const UploadImageQuestion = ({
  EditSession,
  questionIndex,
  setSessions,
  currentIndexEdit,
}: {
  EditSession: SessionProps;
  questionIndex: number;
  currentIndexEdit: number | null;
  setSessions: React.Dispatch<SetStateAction<SessionProps[]>>;
}) => {
  const imageValue = EditSession.Questions[questionIndex].image || null;
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
    questionIndex: number,
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
      const filename = `${crypto.randomUUID()}-${questionIndex + 1}`;
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
      {imageValue ? (
        <div className="flex w-full gap-4">
          <div
            className="relative mt-[.5rem] flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-white px-4 py-[.5rem] text-[.8rem] font-medium text-main-gray-text duration-300 md:hover:shadow-default md:active:shadow-none"
            onClick={() => {
              if (!EditSession.Questions) {
                return;
              }
              // const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSession.Questions[questionIndex].image} "")`;
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
              if (!EditSession.Questions) {
                return;
              }
              const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSession.Questions[questionIndex].image} "")`;
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

const UploadAnswerQuestion = ({
  EditSession,
  questionIndex,
  setSessions,
  currentIndexEdit,
  answerIndex,
}: {
  EditSession: SessionProps;
  questionIndex: number;
  currentIndexEdit: number | null;
  setSessions: React.Dispatch<SetStateAction<SessionProps[]>>;
  answerIndex: number;
}) => {
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
      const filename = `${crypto.randomUUID()}-${questionIndex + 1}`;
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
              if (!EditSession.Questions) {
                return;
              }
              // const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSession.Questions[questionIndex].image} "")`;
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
              if (!EditSession.Questions) {
                return;
              }
              const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${EditSession.Questions[questionIndex].image} "")`;
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
