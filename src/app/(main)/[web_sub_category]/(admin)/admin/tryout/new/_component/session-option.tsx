'use client';

import { cn } from '@/lib/utils';
import {
  IconDown,
  IconFullscreen,
  IconMinimizeScreen,
  IconPlus,
  IconUp,
} from '@/styles/icon';
import React, { SetStateAction, useState } from 'react';
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
  const [headingSessionHeight, setHeadingSessionHeight] = useState<number>(0);
  const [showHeadingSession, setShowHeadingSession] = useState<boolean>(true);

  const [listQuestionHeight, setListQuestionHeight] = useState<number>(0);
  const [showListQuestion, setShowListQuestion] = useState<boolean>(true);

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
    <div className="absolute left-0 top-0 flex h-full w-full flex-col gap-4 overflow-y-auto border-l p-4 pb-[100px] text-[.9rem]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-[1.2rem] font-medium">
            Sesi {currentIndexEdit + 1}
          </h1>
          {showDetailTryout ? (
            <div
              className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
              onClick={() => {
                setShowDetailTryout(false);
              }}
            >
              <IconFullscreen w={15} />
            </div>
          ) : (
            <div
              className="font-regular relative mr-[.5rem] cursor-pointer rounded-[.7rem] border border-main-gray-input2 bg-transparent px-[.5rem] py-[.5rem] text-[.95rem] capitalize text-main-gray-text duration-200 hover:bg-main-gray-input2"
              onClick={() => {
                setShowDetailTryout(true);
              }}
            >
              <IconMinimizeScreen w={15} />
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ModalImportCSV
            setSessions={setSessions}
            currentIndexEdit={currentIndexEdit}
            assessmentType={assessmentType}
            setQuestionIndex={setQuestionIndex}
          />
          <div
            className="cursor-pointer text-main-gray-text duration-300 md:hover:text-black"
            onClick={() => {
              const div = document.querySelector(
                '#tryout-admin #heading',
              ) as HTMLDivElement;
              if (div) {
                if (div.clientHeight !== 0) {
                  div.style.height = `${div.clientHeight}px`;
                  setHeadingSessionHeight(div.clientHeight);
                  setShowHeadingSession(false);
                } else {
                  setShowHeadingSession(true);
                }
                div.style.height =
                  div.clientHeight === 0 ? `${headingSessionHeight}px` : '0px';
                div.style.overflow = 'hidden';
                div.style.transition = 'height 0.3s ease';
              }
            }}
          >
            {showHeadingSession ? <IconUp /> : <IconDown />}
          </div>
        </div>
      </div>
      <HeadingSessionTryout
        EditSession={EditSession}
        category={category}
        assessmentType={assessmentType}
        setAssesmentType={setAssesmentType}
        setSessions={setSessions}
        currentIndexEdit={currentIndexEdit}
        setCurrentIndexEdit={setCurrentIndexEdit}
      />
      <div className="my-[.5rem] h-px w-full shrink-0 bg-main-gray-disabled/60" />
      <div className="mb-[.5rem] flex w-full items-center justify-between">
        <h1 className="text-[1.1rem] font-medium">Daftar soal</h1>

        <div
          className="cursor-pointer text-main-gray-text duration-300 md:hover:text-black"
          onClick={() => {
            const div = document.querySelector(
              '#tryout-admin #numberList',
            ) as HTMLDivElement;
            if (div) {
              if (div.clientHeight !== 0) {
                div.style.height = `${div.clientHeight}px`;
                setListQuestionHeight(div.clientHeight);
                setShowListQuestion(false);
              } else {
                setShowListQuestion(true);
              }
              div.style.height =
                div.clientHeight === 0 ? `${listQuestionHeight}px` : '0px';
              div.style.overflow = 'hidden';
              div.style.transition = 'height 0.3s ease';
            }
          }}
        >
          {showListQuestion ? <IconUp /> : <IconDown />}
        </div>
      </div>
      <div
        id="numberList"
        className="-mt-4 flex shrink-0 flex-wrap items-center justify-start gap-[.5rem]"
      >
        {EditSession.Questions &&
          EditSession.Questions?.length > 0 &&
          EditSession.Questions?.map((question, qIndex) => (
            <div
              key={qIndex}
              className={cn(
                'flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[.8rem] bg-white font-medium text-main-gray-text duration-300 md:hover:bg-main-gray-input md:active:shadow-default',
                qIndex === questionIndex &&
                  'bg-main text-white md:hover:bg-main',
              )}
              onClick={() => setQuestionIndex(qIndex)}
            >
              {question.number}
            </div>
          ))}
        <div
          className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[.8rem] bg-blue-100 font-medium text-blue-600 duration-300 md:hover:bg-blue-200 md:hover:shadow-default md:active:bg-blue-100"
          onClick={addQuestion}
        >
          <IconPlus w={15} />
        </div>
      </div>
      <div id="question">
        <QuestionSessionTryout
          EditSession={EditSession}
          questionIndex={questionIndex}
          setQuestionIndex={setQuestionIndex}
          currentIndexEdit={currentIndexEdit}
          assessmentType={assessmentType}
          setSessions={setSessions}
        />
      </div>
    </div>
  );
};

export default SessionOption;
