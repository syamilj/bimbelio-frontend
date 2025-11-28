import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toaster } from '@/components/ui/toaster';
import React, { SetStateAction, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
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
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();
  const [fileBuffer, setFileBuffer] = useState<string | ArrayBuffer | null>();

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        if (e.target) setFileBuffer(e.target.result);
      };
    }
  }, [file]);

  useEffect(() => {
    if (!open) {
      setFile(undefined);
      setFileBuffer(undefined);
    }
  }, [open]);

  const handleGenerate = () => {
    if (fileBuffer) {
      const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data: any[] = XLSX.utils.sheet_to_json(worksheet);

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

      const Questions = handleGenerateQuestions(data);
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
              Questions,
            };
          }
          return { ...session };
        }),
      );
      setOpen(false);
      return;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger>
        <div
          className="shrink-0 cursor-pointer rounded-[.8rem] bg-blue-100 px-4 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
          onClick={() => setOpen(true)}
        >
          Import CSV
        </div>
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
              <div
                className="w-full shrink-0 cursor-pointer rounded-[.8rem] bg-blue-100 py-[.8rem] font-medium text-blue-700 duration-300 md:hover:bg-blue-200 md:active:bg-blue-100"
                onClick={handleGenerate}
              >
                Generate
              </div>
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
