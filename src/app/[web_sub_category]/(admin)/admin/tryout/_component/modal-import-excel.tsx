'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { toaster } from '@/components/ui/toaster';
import { supabase } from '@/supabaseClient';
import { BlockNoteEditor } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import React, { SetStateAction, useEffect, useState } from 'react';
import { QuestionProps, SessionProps } from '../new/page';

const ModalImportCSV = ({
  setSessions,
  currentIndexEdit,
  assessmentType,
}: {
  setSessions: React.Dispatch<SetStateAction<SessionProps[]>>;
  currentIndexEdit: number | null;
  assessmentType: string;
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

  const handleGenerate = () => {
    setIsLoading(true);
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async function (results: any) {
          const data: any[] = results.data;

          // Validasi dan transformasi data
          let isAssesmentTypeValid = {
            value: true,
            number: 0,
          };
          let isValid = true;

          if (assessmentType === 'IRT') {
            const Questions = handleGenerateIRT(data);
            Questions.forEach((item) => {
              const isCorrect =
                item.Answers.find((item2) => item2.value === 5) || null;
              if (!isCorrect) {
                isAssesmentTypeValid = {
                  value: false,
                  number: item.number,
                };
              }
            });
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

                  const { error } = await supabase.storage
                    .from('dump-images')
                    .upload(fileName, buffer, {
                      contentType: mime,
                      upsert: true,
                    });

                  if (error) {
                    console.error('Upload error:', error);
                    continue;
                  }

                  const { data: publicUrlData } = supabase.storage
                    .from('dump-images')
                    .getPublicUrl(fileName);

                  const publicUrl = publicUrlData?.publicUrl || '';

                  questionValue = questionValue.replace(
                    fullMatch,
                    `![Gambar](${publicUrl})`,
                  );
                }

                console.log({ questionValue });

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

            if (!isAssesmentTypeValid.value) {
              toaster({
                title: `Number ${isAssesmentTypeValid.number}`,
                condition: 'warning',
                description: 'Jawaban benar tidak ditemukan',
                duration: 3000,
              });
              return;
            }
            console.log({ ParseQuestions });
            setSessions((prev) =>
              prev.map((session, sessionId) => {
                if (sessionId === currentIndexEdit) {
                  return {
                    ...session,
                    Questions: ParseQuestions,
                  };
                }
                return { ...session };
              }),
            );
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
                const answerText = quest[`Answer_${suffix}`];
                const answerValue = parseInt(quest[`Value_${suffix}`]); // Pastikan nilai berupa angka
                if (answerText && !isNaN(answerValue)) {
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
            if (assessmentType === '+5/0') {
              transformedAnswers = answers.map((item) => ({
                answer: item.answer,
                value: item.value === 5 ? 5 : 0,
              }));
            } else if (assessmentType === 'IRT') {
              transformedAnswers = answers.map((item) => ({
                answer: item.answer,
                value: item.value === 5 ? 1 : 0,
              }));
            } else if (assessmentType === '+4/-1/0') {
              transformedAnswers = answers.map((item) => ({
                answer: item.answer,
                value: item.value === 5 ? 4 : -1,
              }));
            } else {
              transformedAnswers = answers;
            }

            return {
              number: parseInt(quest.Number), // Konversi string ke number
              question: quest.Question,
              subCategory: quest.Subcategory,
              Answers: transformedAnswers,
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

          setSessions((prev) =>
            prev.map((session, sessionId) => {
              if (sessionId === currentIndexEdit) {
                return {
                  ...session,
                  Questions: fixData,
                };
              }
              return { ...session };
            }),
          );
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
          className="shrink-0 cursor-pointer rounded-[.8rem] bg-blue-100 px-[1rem] py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
          onClick={() => setOpen(true)}
        >
          Import CSV
        </div>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-semibold underline">Format CSV:</p>
          {assessmentType === 'IRT' ? (
            <p className="font-semibold">
              Number | Question | SubCategory | SubSubCategory | A | B | C | D |
              E | Correct | Explanation
            </p>
          ) : (
            <p className="font-semibold">
              Number | Question | Subcategory | Answer_A | Value_A | Answer_B |
              Value_B | Answer_C | Value_C | Answer_D | Value_D | Answer_E |
              Value_E
            </p>
          )}
          {file ? (
            <p className="mt-[1rem] font-semibold text-blue-700">{file.name}</p>
          ) : null}

          <div className="relative grid w-full grid-cols-1 gap-[.5rem] pt-[2rem] text-[.9rem]">
            <input
              id="uploadCSV"
              type="file"
              accept=".csv"
              className="absolute left-0 top-0 w-0 p-0"
              onChange={(e) => handleChangeFile(e)}
            />
            {file ? (
              <button
                className="w-full shrink-0 cursor-pointer rounded-[.8rem] bg-blue-100 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
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
                className="w-full shrink-0 cursor-pointer rounded-[.8rem] bg-blue-100 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
                onClick={() => {
                  document.getElementById('uploadCSV')?.click();
                }}
              >
                Upload
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalImportCSV;

const handleGenerateIRT = (data: any[]) => {
  const fixData: QuestionProps[] = data.map((quest: any) => {
    const Correct = (quest.Correct as string).toLowerCase();
    const getAnswers = [
      { answer: quest.A as string, value: 0, type: 'a' },
      { answer: quest.B as string, value: 0, type: 'b' },
      { answer: quest.C as string, value: 0, type: 'c' },
      { answer: quest.D as string, value: 0, type: 'd' },
      { answer: quest.E as string, value: 0, type: 'e' },
    ];

    const Answers: QuestionProps['Answers'] = getAnswers.map((item) => {
      const isCorrect = item.type === Correct;
      return {
        answer: item.answer,
        value: isCorrect ? 5 : 0,
      };
    });

    return {
      Answers,
      number: parseInt(quest.Number),
      question: quest.Question,
      subCategory: quest.SubCategory,
      subSubCategory: quest.SubSubCategory,
      explanation: quest.Explanation,
    };
  });
  return fixData;
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
