'use client';

import BlocknoteEditor from '@/components/ui/blocknote-editor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { env } from '@/env.mjs';
import { cn } from '@/lib/utils';
import { storage } from '@/supabaseClient';
import 'katex/dist/katex.min.css';
import {
  AlertCircle,
  CircleCheck,
  CircleX,
  ImageIcon,
  Trash2,
  Upload,
} from 'lucide-react';
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
      const deleteImage = await storage
        .from('to-question')
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
      const deleteImage = await storage
        .from('to-question')
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

  const onChangeExplanation = (value: string, questionIndex: number) => {
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
      const upload = await storage
        .from('to-question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await storage
            .from('to-question')
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
      const upload = await storage
        .from('to-question')
        .upload(`${filename}`, image);
      if (upload?.data) {
      }
      if (upload?.error) {
        if (upload.error.message === 'The resource already exists') {
          const update = await storage
            .from('to-question')
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
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Belum Ada Soal
          </h3>
          <p className="text-gray-500 mb-4">
            Tambahkan soal pertama untuk memulai membuat tryout
          </p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = EditSubChapter.Questions[questionIndex];

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-3xl flex items-center justify-center font-bold">
                {currentQuestion.number}
              </div>
              <span>Soal {currentQuestion.number}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={`${currentQuestion.number}`}
                onValueChange={(value) => {
                  value && changeQuestionOrder(value, questionIndex);
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EditSubChapter.Questions.map((quest, i) => (
                    <SelectItem
                      key={i}
                      value={`${quest.number}`}
                    >
                      Soal {quest.number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteQuestion(questionIndex)}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Question Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kategori Soal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sub-category">Sub Kategori</Label>
              <Input
                id="sub-category"
                placeholder="Contoh: Aljabar, Geometri"
                value={currentQuestion.subCategory || ''}
                onChange={(e) => onChangeSubcategoryQuestion(e, questionIndex)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-sub-category">Sub Sub Kategori</Label>
              <Input
                id="sub-sub-category"
                placeholder="Contoh: Persamaan Linear"
                value={currentQuestion.subSubCategory || ''}
                onChange={(e) =>
                  onChangeSubSubCategoryQuestion(e, questionIndex)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Soal</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <BlocknoteEditor
            value={currentQuestion.question}
            onValueChange={(value) => {
              onChangeQuestion(value, questionIndex);
            }}
            type="BORDERED"
          />

          {/* Image Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              {currentQuestion.image ? (
                <div className="space-y-3">
                  <p className="text-sm text-green-600 font-medium">
                    Gambar terupload: {currentQuestion.image}
                  </p>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // const image = `![Image](${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${currentQuestion.image} "")`;
                        const image = `
                        <div class="bn-block-outer" data-node-type="blockOuter" data-id="aed85167-c23d-4804-8abd-b774b8adfb50">
                          <div class="bn-block" data-node-type="blockContainer" data-id="aed85167-c23d-4804-8abd-b774b8adfb50">
                            <div class="bn-block-content ProseMirror-selectednode" data-content-type="image" data-url="${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${currentQuestion.image}" data-file-block="" contenteditable="false" draggable="true">
                              <div class="bn-file-block-content-wrapper" style="width: fit-content;">
                                <div class="bn-visual-media-wrapper">
                                  <img class="bn-visual-media" src="${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${currentQuestion.image}" alt="BlockNote image" contenteditable="false" draggable="false">
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        `;
                        addImageToQuestion(image, questionIndex);
                      }}
                      className="gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Sisipkan ke Soal
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        document
                          .getElementById(`image-${questionIndex}`)
                          ?.click()
                      }
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Ganti Gambar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteImageQuestion(questionIndex)}
                      className="gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Upload gambar untuk soal (opsional)
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById(`image-${questionIndex}`)?.click()
                    }
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Gambar
                  </Button>
                </div>
              )}
              <input
                id={`image-${questionIndex}`}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onChangeQuestionImage(e, questionIndex)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pilihan Jawaban</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentQuestion.Answers?.map((answer, answerIndex) => (
            <div
              key={answerIndex}
              className="space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Select
                    value={`${answerIndex + 1}`}
                    onValueChange={(value) =>
                      changeAnswerOrder(value, answerIndex)
                    }
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem
                          key={num}
                          value={`${num}`}
                        >
                          {String.fromCharCode(64 + num)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Label className="font-medium">
                    {String.fromCharCode(65 + answerIndex)}.
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <BlocknoteEditor
                  value={answer.answer}
                  onValueChange={(value) => {
                    onChangeAnswer(value, questionIndex, answerIndex);
                  }}
                  type="BORDERED"
                />

                <div className="flex items-center justify-end ">
                  {/* Score Buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Poin:</span>
                    {Array.from({
                      length: assessmentType === '1-5' ? 5 : 2,
                    }).map((_, i) => {
                      const isSelected =
                        assessmentType === '1-5'
                          ? i + 1 === answer.value
                          : assessmentType === '+5/0'
                            ? i * 5 === answer.value
                            : assessmentType === 'IRT'
                              ? i * 5 === answer.value
                              : i * 5 - 1 === answer.value;

                      return (
                        <Button
                          key={i}
                          variant={isSelected ? 'default' : 'outline'}
                          size="sm"
                          className={cn(
                            'w-10 h-10 p-0',
                            isSelected && 'bg-green-500 hover:bg-green-600',
                          )}
                          onClick={() => {
                            if (assessmentType === '1-5') {
                              onChangeAnswerValue(
                                i + 1,
                                questionIndex,
                                answerIndex,
                                answer.value,
                              );
                            } else if (
                              assessmentType === '+5/0' ||
                              assessmentType === 'IRT'
                            ) {
                              onChangeAnswerValue(
                                i * 5,
                                questionIndex,
                                answerIndex,
                                answer.value,
                              );
                            } else if (assessmentType === '+4/-1/0') {
                              onChangeAnswerValue(
                                i * 5 - 1,
                                questionIndex,
                                answerIndex,
                                answer.value,
                              );
                            }
                          }}
                        >
                          {assessmentType === '1-5' ? (
                            i + 1
                          ) : assessmentType === '+5/0' ? (
                            i * 5
                          ) : assessmentType === 'IRT' && i === 0 ? (
                            <CircleX className="w-4 h-4" />
                          ) : assessmentType === 'IRT' && i === 1 ? (
                            <CircleCheck className="w-4 h-4" />
                          ) : assessmentType === '+4/-1/0' && i === 0 ? (
                            <CircleX className="w-4 h-4" />
                          ) : assessmentType === '+4/-1/0' && i === 1 ? (
                            <CircleCheck className="w-4 h-4" />
                          ) : (
                            i + 1
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Pembahasan</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <BlocknoteEditor
            value={currentQuestion.explanation || ''}
            onValueChange={(value) => {
              onChangeExplanation(value, questionIndex);
            }}
            type="BORDERED"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default SubChapterQuestion;
