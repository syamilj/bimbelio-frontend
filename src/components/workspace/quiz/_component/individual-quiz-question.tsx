import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import ReactMarkdown from '@/components/ui/react-markdown';
import { Textarea } from '@/components/ui/textarea';
import { IconSend, IconSuccess, IconX } from '@/styles/icon';
import { type CompletionRequestOptions } from 'ai';
import 'katex/dist/katex.min.css';
import { useState } from 'react';
import { useProvider } from '../provider';
import Feedback from './feedback';

const IndividualQuizQuestion = ({
  complete,
  toggleAttempt,
  userResponse,
  setUserResponse,
}: {
  complete: (
    prompt: string,
    options?: CompletionRequestOptions | undefined,
  ) => Promise<string | null | undefined>;
  toggleAttempt: () => void;
  userResponse: string;
  setUserResponse: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {
    useCurrentData: { question, answer, opsi, attempts },
  } = useProvider();
  const option = [
    {
      opsi: 'A',
      value: opsi ? opsi.a : null,
    },
    {
      opsi: 'B',
      value: opsi ? opsi.b : null,
    },
    {
      opsi: 'C',
      value: opsi ? opsi.c : null,
    },
    {
      opsi: 'D',
      value: opsi ? opsi.d : null,
    },
    {
      opsi: 'E',
      value: opsi ? opsi.e : null,
    },
  ];

  const [choice, setChoice] = useState<any>({
    opsi: '',
    data: {},
  });

  const handleAnswer = (item: any) => {
    if (attempts.length === 0) {
      setChoice({ opsi: '', data: {} });
      toggleAttempt();
      complete(`${item.opsi.toLowerCase()}. ${item.value}`);
      setUserResponse(`${item.opsi.toLowerCase()}. ${item.value}`);
    }
  };

  const Style = (item: any) => {
    if (attempts?.length > 0) {
      if (
        attempts[0].userResponse.includes(item.value) &&
        answer.includes(attempts[0].userResponse)
      ) {
        return 'bg-main text-white';
      } else if (
        attempts[0].userResponse.includes(item.value) &&
        !answer.includes(attempts[0].userResponse)
      ) {
        return 'bg-main-red text-white';
      } else {
        if (answer.includes(item.value)) {
          return 'bg-blue-100 text-main';
        } else if (!answer.includes(item.value)) {
          return 'bg-main-red-hover text-main-red';
        }
        return 'bg-white';
      }
    } else {
      return 'bg-white text-[#000] md:hover:text-white md:hover:bg-main-hover md:active:bg-main cursor-pointer ';
    }
  };

  const StyleYourResponse = () => {
    if (answer.includes(attempts[0].userResponse)) {
      return 'bg-blue-100 text-main';
    } else if (!answer.includes(attempts[0].userResponse)) {
      return 'bg-main-red-hover text-main-red';
    } else {
      return 'bg-white';
    }
  };

  return (
    <div className="flex h-full flex-grow flex-col justify-start">
      <div>
        <div className="mb-4">
          <div className="rounded-t-lg bg-gray-100 p-4">
            <h1 className="text-lg font-semibold text-main-gray-text">
              {question}
            </h1>
          </div>
          {!opsi && (
            <div className="p-4">
              <div className="relative">
                <Textarea
                  value={userResponse}
                  onChange={(e) => setUserResponse(e.target.value)}
                  className="h-24 w-full rounded-3xl border-2 border-main p-4 focus:border-main"
                  placeholder="Enter your answer..."
                />
                <Button
                  onClick={() => {
                    if (userResponse?.length > 0) toggleAttempt();
                    complete(userResponse);
                  }}
                  className={`absolute bottom-4 right-4 h-fit w-fit bg-transparent p-0 hover:bg-transparent ${userResponse?.length > 0 ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <IconSend
                    className={`${userResponse?.length > 0 ? 'text-main hover:text-main-hover' : 'text-main-gray-disabled'} duration-200`}
                  />
                </Button>
              </div>
              <button
                className="mx-[.5rem] my-[.5rem] text-[.9rem] font-medium text-main-gray-text hover:text-black"
                onClick={() => setUserResponse('')}
              >
                Kosongkan jawaban
              </button>
            </div>
          )}
          {opsi && (
            <div className="flex flex-col gap-[.5rem] px-[.5rem]">
              {option.map((item: any, i: number) => {
                return (
                  <div
                    className={`w-full rounded-3xl p-4 text-[1rem] duration-300 ${attempts[0]?.userResponse && Style(item)} ${!attempts[0]?.userResponse && choice.opsi == item.opsi ? 'bg-main text-white' : !attempts[0]?.userResponse && choice.opsi !== item.opsi ? 'bg-white text-black md:hover:bg-main-hover md:hover:text-white' : null} cursor-pointer`}
                    key={i}
                    onClick={() => {
                      // handleAnswer(item);
                      setChoice({ opsi: item.opsi, data: item });
                    }}
                  >
                    <div className="flex items-center gap-[0] text-sm font-semibold">
                      <div className="flex items-center gap-[1rem]">
                        <p>{item.opsi}.</p>
                        <p className="font-regular">{item.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!attempts[0]?.userResponse && (
                <div className="mt-[.5rem] flex w-full items-center justify-between">
                  <button
                    className="mx-[.5rem] my-[.5rem] text-[.9rem] font-medium text-main-gray-text hover:text-black"
                    onClick={() => {
                      setUserResponse('');
                      setChoice({ opsi: '', data: {} });
                    }}
                  >
                    Kosongkan jawaban
                  </button>
                  <button
                    className={`${choice.opsi === '' ? 'bg-main-gray-disabled text-white md:hover:bg-main-gray-disabled-hover' : 'bg-main text-white md:hover:bg-main-hover'} flex items-center gap-[.5rem] rounded-3xl px-[1rem] py-[.8rem] text-[.9rem] duration-200`}
                    onClick={() => {
                      handleAnswer(choice.data);
                    }}
                  >
                    Pilih Jawaban
                    <IconSend w={15} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {}
      </div>

      {!opsi && (
        <div>
          {attempts.length > 0 && (
            <>
              <h2 className="mb-2 font-semibold text-gray-600">
                Previous attempts
              </h2>

              <Accordion
                type="single"
                collapsible
              >
                {attempts.map((attempt, index) => (
                  <AccordionItem
                    value={index.toString()}
                    key={index}
                  >
                    <AccordionTrigger className="px-2 font-semibold">
                      {index + 1}
                    </AccordionTrigger>
                    <AccordionContent className="rounded-3xl bg-gray-50 p-4">
                      <div className="mb-4 rounded-3xl bg-[#F7F5FB] p-4">
                        <h4 className="mb-2 flex items-center text-sm font-semibold text-[#5937AB]">
                          Your Response
                        </h4>
                        <p className="text-sm">{attempt.userResponse}</p>
                      </div>
                      <Feedback
                        correctResponse={attempt.correctResponse}
                        wrongResponse={attempt.incorrectResponse}
                        moreInfo={attempt.moreInfo}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </>
          )}
        </div>
      )}
      {opsi && (
        <div className="p-4">
          {attempts.length > 0 && (
            <>
              <h2 className="mb-2 font-semibold text-gray-600">
                Your Response
              </h2>

              <div
                className={`mb-4 rounded-3xl p-4 ${StyleYourResponse()} font-medium`}
              >
                {answer.includes(attempts[0].userResponse) ? (
                  <div className="mb-2 flex items-center gap-[.5rem]">
                    <IconSuccess />
                    <h4 className="flex items-center text-sm font-semibold text-main">
                      Correct Answer
                    </h4>
                  </div>
                ) : (
                  <div className="mb-2 flex items-center gap-[.5rem]">
                    <IconX />
                    <h4 className="flex items-center text-sm font-semibold text-main-red">
                      Wrong Answer
                    </h4>
                  </div>
                )}
                <p className="ml-[.3rem] text-sm">{attempts[0].userResponse}</p>
              </div>

              <div className="">
                <h2 className="mb-2 font-semibold text-gray-600">Feedback</h2>
              </div>

              <div className="flex flex-col gap-4">
                <div
                  className={`rounded-3xl ${attempts[0].userResponse.includes(answer) ? 'bg-[#E1F7EB]' : 'bg-[#E1F7EB]'} p-4`}
                >
                  <h4
                    className={
                      'mb-2 flex items-center text-sm font-semibold text-[#006426]'
                    }
                  >
                    Jawaban Yang Benar :
                  </h4>

                  <ReactMarkdown value={answer} />
                </div>
                <Feedback moreInfo={attempts[0].moreInfo} />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default IndividualQuizQuestion;
