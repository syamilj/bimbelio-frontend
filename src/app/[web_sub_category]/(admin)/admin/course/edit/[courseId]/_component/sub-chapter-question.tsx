'use client';

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
import { Textarea } from '@/components/ui/textarea';
import { env } from '@/env.mjs';
import { supabase } from '@/supabaseClient';
import 'katex/dist/katex.min.css';
import { AlertCircle, ArrowUpDown, ImageIcon, Trash2 } from 'lucide-react';
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
              <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold">
                {currentQuestion.number}
              </div>
              <span>Soal {currentQuestion.number}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={`${currentQuestion.number}`}
                onValueChange={(value) => {
                  changeQuestionOrder(value, questionIndex);
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
                onClick={() => {
                  deleteQuestion(questionIndex);
                }}
                className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Hapus
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Question Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Column - Question and Image */}
        <div className="space-y-6">
          {/* Question */}
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Soal
            </Label>
            <Textarea
              placeholder="Tulis soal di sini..."
              className="resize-none"
              value={currentQuestion.question}
              onChange={(e) => onChangeQuestion(e, questionIndex)}
              required
            />
          </div>

          {/* Image Upload */}
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Gambar
            </Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  document.getElementById(`image-${questionIndex}`)?.click();
                }}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                {currentQuestion.image ? 'Ubah Gambar' : 'Unggah Gambar'}
              </Button>
              {currentQuestion.image && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    deleteImageQuestion(questionIndex);
                  }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  Hapus Gambar
                </Button>
              )}
              <input
                id={`image-${questionIndex}`}
                type="file"
                className="hidden"
                onChange={(e) => {
                  onChangeQuestionImage(e, questionIndex);
                }}
              />
            </div>
            {currentQuestion.image && (
              <div className="mt-4">
                <img
                  src={`${env.NEXT_PUBLIC_SUPABASE_IMG_TO_URL}/${currentQuestion.image}`}
                  alt="Preview"
                  className="h-32 w-full rounded-md object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Settings and Preview */}
        <div className="space-y-6">
          {/* Subcategory and SubSubcategory */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                Subkategori
              </Label>
              <Input
                placeholder="Subkategori soal"
                value={currentQuestion.subCategory}
                onChange={(e) => onChangeSubcategoryQuestion(e, questionIndex)}
              />
            </div>
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700">
                SubSubkategori
              </Label>
              <Input
                placeholder="SubSubkategori soal"
                value={currentQuestion.subSubCategory}
                onChange={(e) =>
                  onChangeSubSubCategoryQuestion(e, questionIndex)
                }
              />
            </div>
          </div>

          {/* Explanation */}
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              Penjelasan
            </Label>
            <Textarea
              placeholder="Tulis penjelasan di sini..."
              className="resize-none"
              value={currentQuestion.explanation}
              onChange={(e) => onChangeExplanation(e, questionIndex)}
              required
            />
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQuestion.Answers?.map((item2, answerIndex: number) => (
              <div
                key={answerIndex}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <Label className="block text-sm font-medium text-gray-700">
                    Jawaban {answerIndex + 1}
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      changeAnswerOrder(`${answerIndex + 1}`, answerIndex);
                    }}
                    className="gap-2"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    Urutkan
                  </Button>
                </div>
                <Textarea
                  placeholder="Tulis jawaban di sini..."
                  className="mt-2 resize-none"
                  value={item2.answer}
                  onChange={(e) => {
                    onChangeAnswer(e.target.value, questionIndex, answerIndex);
                  }}
                  required
                />
                <div className="mt-2 flex gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Button
                      key={i}
                      variant={item2.value === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        onChangeAnswerValue(
                          i + 1,
                          questionIndex,
                          answerIndex,
                          item2.value,
                        );
                      }}
                      className="flex-1"
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubChapterQuestion;
