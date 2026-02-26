'use client';

import { cn } from '@/lib/utils';
import { FileText, PanelLeft, PanelLeftOpen, Plus } from 'lucide-react';
import React, { SetStateAction } from 'react';
import ModalImportCSV from '../../_component/modal-import-excel';
import { Category, QuestionProps, SessionProps } from '../page';
import HeadingSessionTryout from './heading-session-tryout';
import QuestionSessionTryout from './question-session-tryout';

interface Props {
  EditSession: SessionProps | null;
  category: Category[] | undefined;
  setSessions: React.Dispatch<SetStateAction<SessionProps[]>>;
  currentIndexEdit: number | null;
  setCurrentIndexEdit: React.Dispatch<SetStateAction<number | null>>;
  showDetailTryout: boolean;
  setShowDetailTryout: React.Dispatch<SetStateAction<boolean>>;
  assessmentType: string;
  setAssesmentType: React.Dispatch<SetStateAction<string>>;
  questionIndex: number;
  setQuestionIndex: React.Dispatch<SetStateAction<number>>;
}

const SessionOption = ({
  currentIndexEdit,
  setCurrentIndexEdit,
  showDetailTryout,
  setShowDetailTryout,
  EditSession,
  category,
  assessmentType,
  setAssesmentType,
  setSessions,
  questionIndex,
  setQuestionIndex,
}: Props) => {
  const addQuestion = () => {
    if (EditSession === null) return;
    const div = document.querySelector(
      '#tryout-admin #numberList',
    ) as HTMLDivElement;
    div.style.height = 'auto';
    let newQuestion: QuestionProps;
    if (assessmentType === '1-5') {
      newQuestion = {
        number: EditSession.Questions?.length
          ? EditSession.Questions?.length + 1
          : 1,
        question: '',
        Answers: [
          { answer: '', value: 1 },
          { answer: '', value: 2 },
          { answer: '', value: 3 },
          { answer: '', value: 4 },
          { answer: '', value: 5 },
        ],
        courseChapterIds: [],
      };
    } else if (assessmentType === '+5/0') {
      newQuestion = {
        number: EditSession.Questions?.length
          ? EditSession.Questions?.length + 1
          : 1,
        question: '',
        Answers: [
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 5 },
        ],
        courseChapterIds: [],
      };
    } else if (assessmentType === '+1/0' || assessmentType === '0-100') {
      newQuestion = {
        number: EditSession.Questions?.length
          ? EditSession.Questions?.length + 1
          : 1,
        question: '',
        Answers: [
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 1 },
        ],
        courseChapterIds: [],
      };
    } else if (assessmentType === 'IRT') {
      newQuestion = {
        number: EditSession.Questions?.length
          ? EditSession.Questions?.length + 1
          : 1,
        question: '',
        Answers: [
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 0 },
          { answer: '', value: 5 },
        ],
        courseChapterIds: [],
      };
    } else if (assessmentType === '+4/-1/0') {
      newQuestion = {
        number: EditSession.Questions?.length
          ? EditSession.Questions?.length + 1
          : 1,
        question: '',
        Answers: [
          { answer: '', value: -1 },
          { answer: '', value: -1 },
          { answer: '', value: -1 },
          { answer: '', value: -1 },
          { answer: '', value: 4 },
        ],
        courseChapterIds: [],
      };
    }
    setSessions((prev) =>
      prev.map((item, i: number) => {
        if (currentIndexEdit === i) {
          if (item.Questions && item.Questions?.length > 0) {
            return { ...item, Questions: [...item.Questions, newQuestion] };
          } else {
            return { ...item, Questions: [newQuestion] };
          }
        }
        return { ...item };
      }),
    );
  };

  if (!EditSession || currentIndexEdit === null) {
    return null;
  }

  return (
    <div className="flex h-full w-full text-sm">
      {/* Left column: top bar + scrollable config + pills */}
      <div className="w-[400px] shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="shrink-0 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-3xl bg-blue-600 text-white text-xs font-bold shrink-0">
              {currentIndexEdit + 1}
            </span>
            <h2 className="text-sm font-semibold text-gray-800 truncate">
              {EditSession.name || 'Konfigurasi Sesi'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <ModalImportCSV
              setSessions={setSessions}
              currentIndexEdit={currentIndexEdit}
              assessmentType={assessmentType}
              setQuestionIndex={setQuestionIndex}
            />
            <button
              type="button"
              title={
                showDetailTryout
                  ? 'Sembunyikan panel tryout'
                  : 'Tampilkan panel tryout'
              }
              onClick={() => setShowDetailTryout((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-3xl px-2.5 py-1.5 transition-colors"
            >
              {showDetailTryout ? (
                <PanelLeft className="w-3.5 h-3.5" />
              ) : (
                <PanelLeftOpen className="w-3.5 h-3.5" />
              )}
              {showDetailTryout ? 'Tutup Panel' : 'Buka Panel'}
            </button>
          </div>
        </div>

        {/* Scrollable: config + pills */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4 border-b border-gray-100">
            <HeadingSessionTryout
              EditSession={EditSession}
              category={category}
              assessmentType={assessmentType}
              setAssesmentType={setAssesmentType}
              setSessions={setSessions}
              currentIndexEdit={currentIndexEdit}
              setCurrentIndexEdit={setCurrentIndexEdit}
            />
          </div>
          <div className="px-4 pt-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-gray-800">
                  Daftar Soal
                </h3>
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-gray-200 text-[11px] font-semibold text-gray-600">
                  {EditSession.Questions?.length ?? 0}
                </span>
              </div>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 border border-blue-200 hover:border-blue-300 bg-blue-50 hover:bg-blue-100 rounded-3xl px-3 py-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Soal
              </button>
            </div>
            <div
              id="numberList"
              className="flex flex-wrap gap-1.5"
            >
              {EditSession.Questions &&
                EditSession.Questions.length > 0 &&
                EditSession.Questions.map((question, qIndex) => (
                  <button
                    key={qIndex}
                    type="button"
                    onClick={() => setQuestionIndex(qIndex)}
                    className={cn(
                      'flex h-8 w-8 cursor-pointer items-center justify-center rounded-3xl text-xs font-semibold transition-colors',
                      qIndex === questionIndex
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600',
                    )}
                  >
                    {question.number}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right column: full-height editor */}
      <div
        id="question"
        className="flex flex-col flex-1 overflow-y-auto bg-gray-50"
      >
        {EditSession.Questions && EditSession.Questions.length > 0 ? (
          <QuestionSessionTryout
            EditSession={EditSession}
            questionIndex={questionIndex}
            setQuestionIndex={setQuestionIndex}
            currentIndexEdit={currentIndexEdit}
            assessmentType={assessmentType}
            setSessions={setSessions}
          />
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center px-10">
            <div className="h-16 w-16 rounded-3xl bg-blue-50 flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-gray-700">
                Belum ada soal
              </p>
              <p className="text-xs text-gray-400">
                Klik "Tambah Soal" di panel kiri
                <br />
                untuk mulai membuat soal sesi ini
              </p>
            </div>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-3xl transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Tambah Soal Pertama
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionOption;
