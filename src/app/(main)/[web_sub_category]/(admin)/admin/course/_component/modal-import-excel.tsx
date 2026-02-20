import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toaster } from '@/components/ui/toaster';
import { env } from '@/env.mjs';
import { ParseMarkdownToHTML } from '@/lib/utils/editor';
import { storage } from '@/supabaseClient';
import { useCreateBlockNote } from '@blocknote/react';
import { Loader2 } from 'lucide-react';
import Papa from 'papaparse';
import React, { SetStateAction, useEffect, useState } from 'react';
import { QuestionProps, SubChapterProps } from '../new/page';

const ModalImportExcel = ({
  setSubChapter,
  currentIndexEdit,
  assessmentType,
}: {
  setSubChapter: React.Dispatch<SetStateAction<SubChapterProps[]>>;
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

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      if (file) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: async function (results: any) {
            const data: any[] = results.data;
            console.log('[Import CSV] 1 : ', { data, results });

            let isAssesmentTypeValid = {
              value: true,
              number: 0,
            };
            let isValid = true;

            console.log({ data });

            isValid = validateFormat(data);

            if (assessmentType !== '+5/0') {
              toaster({
                title: 'Upss',
                condition: 'warning',
                description: 'Assessment Type Tidak Valid!',
              });
              return;
            }

            if (!isValid) {
              toaster({
                title: 'Upss',
                condition: 'warning',
                description: 'Format Exel Tidak Valid!',
              });
              return;
            }

            const QuestionsData = handleGenerateQuestions(data);
            QuestionsData.forEach((item) => {
              const isCorrect =
                item.Answers.find((item2) => item2.value === 5) || null;
              if (!isCorrect) {
                isAssesmentTypeValid = {
                  value: false,
                  number: item.number,
                };
              }
            });

            let Error = '';
            const ParseQuestions = await Promise.all(
              QuestionsData.map(async (item) => {
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
            setSubChapter((prev) =>
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
    } catch (error: any) {
      setIsLoading(false);
      console.error('Error processing file:', error);
      toaster({
        title: 'Upss',
        condition: 'warning',
        description: JSON.stringify(error?.message),
      });
    }
  };

  return (
    <Dialog
      open={isLoading ? true : open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <button
          className="shrink-0 cursor-pointer rounded-3xl bg-blue-50 border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 active:bg-blue-50"
          onClick={() => setOpen(true)}
        >
          Import CSV
        </button>
      </DialogTrigger>
      <DialogContent className="w-[400px]">
        <DialogTitle className="text-center text-lg font-semibold mb-2">
          Import Soal dari Excel/CSV
        </DialogTitle>
        <div className="flex flex-col items-center justify-center text-center">
          <p className="font-semibold underline">Format Excel:</p>
          <p className="font-semibold">
            Number | Question | SubCategory | SubSubCategory | A | B | C | D | E
            | Correct | Explanation
          </p>
          {file ? (
            <p className="mt-4 font-semibold text-blue-700">{file.name}</p>
          ) : null}

          <div className="relative grid w-full grid-cols-1 gap-[.5rem] pt-8 text-[.9rem]">
            <input
              id="uploadCSV"
              type="file"
              className="absolute left-0 top-0 w-0 p-0"
              onChange={(e) => handleChangeFile(e)}
            />
            {file ? (
              <button
                className="w-full shrink-0 cursor-pointer rounded-3xl bg-blue-600 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 active:bg-blue-600 disabled:opacity-60 flex items-center justify-center gap-2"
                onClick={handleGenerate}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4" /> Memproses...
                  </>
                ) : (
                  'Generate Soal'
                )}
              </button>
            ) : (
              <button
                className="w-full shrink-0 cursor-pointer rounded-3xl bg-blue-50 border border-blue-200 py-2.5 font-medium text-blue-700 transition-colors hover:bg-blue-100 active:bg-blue-50 flex items-center justify-center gap-2"
                onClick={() => {
                  document.getElementById('uploadCSV')?.click();
                }}
              >
                Upload File CSV
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalImportExcel;

const handleGenerateQuestions = (data: any[]) => {
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

const validateFormat = (data: any[]) => {
  let isValid = true;
  let message = '';
  data.forEach((item: any, i: number) => {
    if (item.Number === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom Number kosong`;
    }
    if (item.Question === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom Question kosong`;
    }
    if (item.SubCategory === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom SubCategory kosong`;
    }
    if (item.SubSubCategory === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom SubSubCategory kosong`;
    }
    if (item.A === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom A kosong`;
    }
    if (item.B === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom B kosong`;
    }
    if (item.C === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom C kosong`;
    }
    if (item.D === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom D kosong`;
    }
    if (item.E === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom E kosong`;
    }
    if (item.Correct === undefined) {
      isValid = false;
      message = `Index ke-${i} kolom Correct kosong`;
    }
    // if (!item.Explanation) {
    //   isValid = false;
    //   message = `Index ke-${i} kolom Explanation kosong`;
    // }
  });
  console.log({ message });
  return isValid;
};
