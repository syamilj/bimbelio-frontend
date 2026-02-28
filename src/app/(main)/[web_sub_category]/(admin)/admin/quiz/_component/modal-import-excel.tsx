'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { useGet } from '@/lib/fetch-helper/useGet';
import { responseError, throwError } from '@/lib/response';
import { storage } from '@/supabaseClient';
import { BlockNoteEditor } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import React, { SetStateAction, useEffect, useState } from 'react';
import { QuestionProps, SessionProps } from '../new/page';

type ChapterOptionsType = {
  id: string;
  title: string;
  Category: {
    id: string;
    name: string;
  };
}[];

const ModalImportCSV = ({
  setSessions,
  currentIndexEdit,
  assessmentType,
  setQuestionIndex,
}: {
  setSessions: React.Dispatch<SetStateAction<SessionProps>>;
  currentIndexEdit: number | null;
  assessmentType: string;
  setQuestionIndex: React.Dispatch<SetStateAction<number>>;
}) => {
  const editor = useCreateBlockNote();
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (!open) {
      setFile(undefined);
    }
  }, [open]);

  const [isCourseOptionsLoaded, setIsCourseOptionsLoaded] = useState(false);

  const { data: ChapterOptions, isLoading: isCourseOptionsLoading } =
    useGet<ChapterOptionsType>('/course/getAllCourseChapterId', {
      enabled: open && !isCourseOptionsLoaded,
      onSuccess: () => setIsCourseOptionsLoaded(true),
      useEffectDependencies: [open, isCourseOptionsLoaded],
    });

  console.log('[Import CSV] : ', { ChapterOptions });

  const handleGenerate = () => {
    setIsLoading(true);
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results: any) {
          const data: any[] = results.data;
          console.log('[Import CSV] 1 : ', { data, results });

          // Validasi dan transformasi data
          let isAssesmentTypeValid = {
            value: true,
            number: 0,
          };
          let isValid = true;

          if (assessmentType === 'IRT') {
            toaster({
              title: 'Error',
              condition: 'warning',
              description: 'Import untuk tipe IRT tidak tersedia pada quiz',
              duration: 5000,
            });
            setOpen(false);
            setIsLoading(false);
            return;
          }
          if (assessmentType !== '1-5') {
            let Questions;
            if (assessmentType === '+1/0' || assessmentType === '0-100') {
              Questions = handleGenerateQuestion(
                data,
                1,
                0,
                ChapterOptions || [],
              );
            } else if (assessmentType === '+5/0') {
              Questions = handleGenerateQuestion(
                data,
                5,
                0,
                ChapterOptions || [],
              );
            } else if (assessmentType === '+4/-1/0') {
              Questions = handleGenerateQuestion(
                data,
                4,
                -1,
                ChapterOptions || [],
              );
            } else {
              toaster({
                title: 'Error',
                condition: 'warning',
                description: 'Assestment Type tidak valid',
                duration: 3000,
              });
              return;
            }
            Questions.forEach((item) => {
              let isCorrect = false;
              if (
                (assessmentType === '+1/0' || assessmentType === '0-100') &&
                (!!item.Answers.find((item2) => item2.value === 1) || false)
              ) {
                isCorrect = true;
              } else if (
                assessmentType === '+4/-1/0' &&
                (!!item.Answers.find((item2) => item2.value === 4) || false)
              ) {
                isCorrect = true;
              } else if (
                assessmentType === '+5/0' &&
                (!!item.Answers.find((item2) => item2.value === 5) || false)
              ) {
                isCorrect = true;
              }
              if (!isCorrect) {
                isAssesmentTypeValid = {
                  value: false,
                  number: item.number,
                };
              }
            });
            let Error = '';
            const ParseQuestions = await Promise.all(
              Questions.map(async (item) => {
                let questionValue = item.question;

                const matches = [
                  ...item.question.matchAll(
                    /!\[.*?\]\((data:image\/.*?;base64,.*?)\)/g,
                  ),
                ];

                for (const match of matches) {
                  const fullMatch = match[0];
                  const base64Data = match[1];

                  const parsed = base64Data.match(
                    /^data:(image\/\w+);base64,(.+)$/,
                  );
                  if (!parsed) continue;

                  const mime = parsed[1];
                  const ext = mime.split('/')[1];
                  const base64 = parsed[2];

                  const fileName = `${crypto.randomUUID()}.${ext}`;
                  const buffer = Buffer.from(base64, 'base64');

                  const { error } = await storage
                    .from('dump-images')
                    .upload(fileName, buffer);

                  if (error) {
                    console.error('Upload error:', error);
                    Error = error.message;
                    break;
                  }

                  const publicUrl = `${env.NEXT_PUBLIC_SUPABASE_DUMP_IMAGES_URL}/${fileName}`;

                  questionValue = questionValue.replace(
                    fullMatch,
                    `![Gambar](${publicUrl})`,
                  );
                }

                return {
                  ...item,
                  question: await ParseMarkdownToHTML(questionValue, editor),
                  Answers: await Promise.all(
                    item.Answers.map(async (aItem) => {
                      return {
                        ...aItem,
                        answer: await ParseMarkdownToHTML(aItem.answer, editor),
                      };
                    }),
                  ),
                  explanation: await ParseMarkdownToHTML(
                    item.explanation || '',
                    editor,
                  ),
                };
              }),
            );

            if (Error.length > 0) {
              toaster({
                title: 'Error',
                condition: 'warning',
                description: Error,
                duration: 3000,
              });
              setOpen(false);
              setIsLoading(false);
              return;
            }

            if (!isAssesmentTypeValid.value) {
              toaster({
                title: `Number ${isAssesmentTypeValid.number}`,
                condition: 'warning',
                description: 'Jawaban benar tidak ditemukan',
                duration: 3000,
              });
              return;
            }

            console.log('[Import CSV] : ', { ParseQuestions });
            setQuestionIndex(0);
            setSessions((prev) => ({
              ...prev,
              Questions: ParseQuestions,
            }));
            setOpen(false);
            setIsLoading(false);
            return;
          }

          // Definisikan suffix untuk Answer dan Value
          const answerSuffixes = ['A', 'B', 'C', 'D', 'E'];

          const fixData: QuestionProps[] = data.map((quest: any) => {
            // Mengumpulkan jawaban dan nilai berdasarkan suffix
            const answers = answerSuffixes
              .map((suffix) => {
                const answerText = getCsvText(quest, [
                  `Answer_${suffix}`,
                  `Answer ${suffix}`,
                  suffix,
                ]);
                const answerValue = parseCsvNumber(
                  getCsvCell(quest, [`Value_${suffix}`, `Value ${suffix}`]),
                );
                if (answerText && answerValue !== null) {
                  return {
                    answer: answerText,
                    value: answerValue,
                  };
                }
                return null;
              })
              .filter((item) => item !== null) as {
              answer: string;
              value: number;
            }[];

            // Validasi jawaban
            let checkAnswer = true;
            answers.forEach((item) => {
              if (
                typeof item.answer !== 'string' ||
                typeof item.value !== 'number'
              )
                checkAnswer = false;
            });
            if (!checkAnswer) isValid = false;

            // Validasi jumlah jawaban sesuai assessmentType
            if (answers.length !== 5) {
              isAssesmentTypeValid = { value: false, number: quest.Number };
            }

            // Transformasi nilai sesuai assessmentType
            let transformedAnswers;
            if ((assessmentType as string) === '+5/0') {
              transformedAnswers = answers.map((item) => ({
                answer: item.answer,
                value: item.value === 5 ? 5 : 0,
              }));
            } else if ((assessmentType as string) === 'IRT') {
              transformedAnswers = answers.map((item) => ({
                answer: item.answer,
                value: item.value === 5 ? 1 : 0,
              }));
            } else if ((assessmentType as string) === '+4/-1/0') {
              transformedAnswers = answers.map((item) => ({
                answer: item.answer,
                value: item.value === 5 ? 4 : -1,
              }));
            } else {
              transformedAnswers = answers;
            }

            return {
              Answers: transformedAnswers,
              number: parseCsvNumber(getCsvCell(quest, ['Number', 'No'])) || 0,
              question: getCsvText(quest, ['Question']) || '',
              subCategory:
                getCsvText(quest, ['SubCategory', 'Subcategory']) || undefined,
              subSubCategory:
                getCsvText(quest, ['SubSubCategory', 'Sub Sub Category']) ||
                undefined,
              categoryId: getCsvText(quest, ['categoryId']) || undefined,
              explanation:
                getCsvText(quest, ['Explanation', 'explanation']) || undefined,
              courseChapterIds: quest?.courseChapterIds || [],
            };
          });

          if (!isValid) {
            toaster({
              title: 'Upss',
              condition: 'warning',
              description: 'Format Answer Tidak Valid!',
            });
            setIsLoading(false);
            return;
          }

          if (!isAssesmentTypeValid.value) {
            toaster({
              title: `Number ${isAssesmentTypeValid.number}`,
              condition: 'warning',
              description: 'Sesuaikan jumlah jawaban dengan tipe penilaian!',
              duration: 3000,
            });
            setIsLoading(false);
            return;
          }

          console.log('[Import CSV] : ', { fixData });

          setSessions((prev) => ({
            ...prev,
            Questions: fixData,
          }));
          setIsLoading(false);
          setOpen(false);
        },
        error: function (error: any) {
          console.error(error);
          toaster({
            title: 'Upss',
            condition: 'warning',
            description: 'Gagal membaca file CSV!',
          });
          setIsLoading(false);
        },
      });
    }
  };

  return (
    <Dialog
      open={isLoading ? true : open}
      onOpenChange={setOpen}
    >
      <DialogTrigger>
        <div
          className="shrink-0 cursor-pointer rounded-3xl bg-blue-100 px-4 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
          onClick={() => setOpen(true)}
        >
          Import CSV
        </div>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold mb-2">
            Import Soal dari CSV
          </DialogTitle>
        </DialogHeader>
        {isCourseOptionsLoading && (
          <div className="flex w-full justify-center gap-1 items-center">
            <Loader2 className="animate-spin w-4 h-4 text-black mb-[-3px]" />
            <span>Loading</span>
          </div>
        )}
        {!isCourseOptionsLoading && (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="font-semibold underline">Format CSV:</p>
            {assessmentType === 'IRT' ? (
              <p className="font-semibold">
                Number | Question | SubCategory | SubSubCategory | A | B | C | D
                | E | Correct | Explanation
              </p>
            ) : assessmentType !== '1-5' ? (
              <p className="font-semibold">
                Number | Question | SubCategory | SubSubCategory | A | B | C | D
                | E | Correct | Explanation
              </p>
            ) : (
              <p className="font-semibold">
                Number | Question | Subcategory | Answer_A | Value_A | Answer_B
                | Value_B | Answer_C | Value_C | Answer_D | Value_D | Answer_E |
                Value_E
              </p>
            )}
            {file ? (
              <p className="mt-4 font-semibold text-blue-700">
                {file.name.length > 30
                  ? `${file.name.slice(0, 30)}...`
                  : file.name}
              </p>
            ) : null}

            <div className="relative grid w-full grid-cols-1 gap-[.5rem] pt-8 text-[.9rem]">
              <input
                id="uploadCSV"
                type="file"
                accept=".csv"
                className="absolute left-0 top-0 w-0 p-0"
                onChange={(e) => handleChangeFile(e)}
              />
              {file ? (
                <button
                  className="w-full shrink-0 cursor-pointer rounded-3xl bg-blue-100 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
                  onClick={handleGenerate}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                  ) : (
                    'Generate'
                  )}
                </button>
              ) : (
                <div
                  className="w-full shrink-0 cursor-pointer rounded-3xl bg-blue-100 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
                  onClick={() => {
                    document.getElementById('uploadCSV')?.click();
                  }}
                >
                  Upload
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalImportCSV;

const normalizeCsvKey = (value: string) =>
  value.toLowerCase().replace(/[\s_-]/g, '');

const getCsvCell = (row: Record<string, unknown>, keys: string[]) => {
  const rowEntries = Object.entries(row || {});

  for (const key of keys) {
    const directValue = row[key];
    if (directValue !== undefined && directValue !== null) {
      return directValue;
    }

    const normalizedKey = normalizeCsvKey(key);
    const found = rowEntries.find(([entryKey]) => {
      return normalizeCsvKey(entryKey) === normalizedKey;
    });

    if (found && found[1] !== undefined && found[1] !== null) {
      return found[1];
    }
  }

  return undefined;
};

const getCsvText = (row: Record<string, unknown>, keys: string[]) => {
  const value = getCsvCell(row, keys);
  if (value === undefined || value === null) {
    return '';
  }
  return String(value).trim();
};

const parseCsvNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const parseCorrectOption = (value: string) => {
  const cleaned = value.toLowerCase().replace(/\s+/g, '');
  if (!cleaned) {
    return '';
  }

  const letterMatch = cleaned.match(/[abcde]/);
  if (letterMatch) {
    return letterMatch[0];
  }

  const numberMatch = cleaned.match(/[1-5]/);
  if (numberMatch) {
    const number = Number(numberMatch[0]);
    return ['a', 'b', 'c', 'd', 'e'][number - 1] || '';
  }

  return '';
};

const handleGenerateQuestion = (
  data: any[],
  correctValue: number,
  wrongValue: number,
  ChapterOptions: ChapterOptionsType,
) => {
  try {
    // console.log('[Import CSVV] : ', { data });
    const fixData: QuestionProps[] = data.map((quest: any) => {
      const Correct = parseCorrectOption(
        getCsvText(quest, ['Correct', 'Kunci', 'KunciJawaban']),
      );

      const getAnswers = [
        {
          answer: getCsvText(quest, ['A', 'Answer_A', 'Answer A']),
          value: 0,
          type: 'a',
        },
        {
          answer: getCsvText(quest, ['B', 'Answer_B', 'Answer B']),
          value: 0,
          type: 'b',
        },
        {
          answer: getCsvText(quest, ['C', 'Answer_C', 'Answer C']),
          value: 0,
          type: 'c',
        },
        {
          answer: getCsvText(quest, ['D', 'Answer_D', 'Answer D']),
          value: 0,
          type: 'd',
        },
        {
          answer: getCsvText(quest, ['E', 'Answer_E', 'Answer E']),
          value: 0,
          type: 'e',
        },
      ];

      const Answers: QuestionProps['Answers'] = getAnswers.map((item) => {
        const isCorrect = item.type === Correct;
        return {
          answer: item.answer,
          value: isCorrect ? correctValue : wrongValue,
        };
      });

      let CourseData = null;

      if (quest?.Chapter) {
        const CategoryName = getCsvText(quest, ['Category']) || null;
        const CourseChapterNamesArray = getCsvText(quest, ['Chapter'])
          .split('|')
          .map((name: string) => name.trim().toLowerCase());

        CourseData = getCourseChapterIds(
          CategoryName,
          CourseChapterNamesArray,
          ChapterOptions || [],
          parseCsvNumber(getCsvCell(quest, ['Number', 'No'])) || 0,
        );
      }

      return {
        Answers,
        number: parseCsvNumber(getCsvCell(quest, ['Number', 'No'])) || 0,
        question: getCsvText(quest, ['Question']) || '',
        subCategory:
          getCsvText(quest, ['SubCategory', 'Subcategory']) || undefined,
        subSubCategory:
          getCsvText(quest, ['SubSubCategory', 'Sub Sub Category']) ||
          undefined,
        explanation:
          getCsvText(quest, ['Explanation', 'explanation']) || undefined,
        categoryId: CourseData?.categoryId || undefined,
        courseChapterIds: CourseData?.courseChapterIds || [],
      };
    });
    return fixData;
  } catch (error) {
    responseError(error, true, undefined, undefined, 10000000);
    return [];
  }
};

const ParseMarkdownToHTML = async (
  markdownValue: string,
  editor: BlockNoteEditor,
) => {
  const rawQuestion = markdownValue;
  const parseQuestionToBlocks =
    await editor.tryParseMarkdownToBlocks(rawQuestion);
  const parseQuestionBlockToHTML = await editor.blocksToFullHTML(
    parseQuestionToBlocks,
  );

  return parseQuestionBlockToHTML;
};

const getCourseChapterIds = (
  categoryName: string | null,
  chapterNameArray: string[],
  ChapterOptions: ChapterOptionsType,
  questionNumber: number,
) => {
  if (!categoryName) {
    throw throwError(
      404,
      `Kategori tidak ditemukan pada soal nomor ${questionNumber}`,
    );
  }

  const matchedCategory = ChapterOptions.find(
    (chapter) =>
      chapter.Category.name.toLowerCase() === categoryName.toLowerCase(),
  )?.Category;

  if (!matchedCategory) {
    throw throwError(
      404,
      `Kategori "${categoryName}" tidak ditemukan pada soal nomor ${questionNumber}`,
    );
  }

  const matchedChapters = ChapterOptions.filter((chapter) => {
    const isCategoryMatch =
      chapter.Category.name.toLowerCase() === categoryName.toLowerCase();
    const isChapterMatch = chapterNameArray.includes(
      chapter.title.toLowerCase(),
    );
    const isMatch = isCategoryMatch && isChapterMatch;

    return isMatch;
  });

  chapterNameArray.forEach((chapterName) => {
    const isMatched = matchedChapters.find(
      (chapter) => chapter.title.toLowerCase() === chapterName.toLowerCase(),
    );

    if (!isMatched) {
      throw throwError(
        404,
        `Chapter "${chapterName}" tidak ditemukan pada soal nomor ${questionNumber}`,
      );
    }

    return !isMatched;
  });

  return {
    categoryId: matchedCategory.id,
    courseChapterIds: matchedChapters.map((chapter) => chapter.id),
  };
};
