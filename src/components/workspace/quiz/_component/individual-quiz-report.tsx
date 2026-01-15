import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import ReactMarkdown from '@/components/ui/react-markdown';
import { IconSuccess, IconX } from '@/styles/icon';
import 'katex/dist/katex.min.css';
import { RefreshCwIcon } from 'lucide-react';
import { useProvider } from '../provider';
import Feedback from './feedback';

const IndividualQuizReport = ({
  toggleAttempt,
  completion,
  isLoading,
  userResponse,
  setUserResponse,
}: {
  toggleAttempt: () => void;
  completion: string;
  isLoading: boolean;
  userResponse: string;
  setUserResponse: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const {
    useCurrentData: { question, answer, opsi },
  } = useProvider();
  const splitResponse = completion.split('||');

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
  // ${userResponse.includes(item.value) && userResponse.includes(answer) ? 'bg-main text-white' : userResponse.includes(item.value) && !userResponse.includes(answer) ? "bg-main-red-hover text-main-red" : 'bg-white text-black'}
  const StyleStream = (item: any) => {
    if (userResponse.includes(item.value) && userResponse.includes(answer)) {
      return 'bg-main text-white';
    } else if (
      userResponse.includes(item.value) &&
      !userResponse.includes(answer)
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
  };

  const StyleYourResponseStream = () => {
    if (userResponse.includes(answer)) {
      return 'bg-blue-100 text-main';
    } else if (!userResponse.includes(answer)) {
      return 'bg-main-red-hover text-main-red';
    } else {
      return 'bg-white';
    }
  };

  const replaceLatexNotation = (content: any) => {
    return content
      .replace(/\\\[/g, '$$$') // Replace all occurrences of \[ with $$
      .replace(/\\\]/g, '$$$') // Replace all occurrences of \] with $$
      .replace(/\\\(/g, '$$$') // Replace all occurrences of \( with $$
      .replace(/\\\)/g, '$$$'); // Replace all occurrences of \) with $$
  };

  const remarkMathOptions = {
    singleDollarTextMath: false,
  };

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold text-main-gray-text">
            {question}
          </h1>
          {!opsi && (
            <Button
              title="Try again"
              variant="ghost"
              onClick={() => {
                toggleAttempt();
                setUserResponse('');
              }}
              className="h-fit w-fit p-0"
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
        {}
        {userResponse && !opsi && (
          <div className="mx-[.5rem] mb-[.5rem] mt-[1rem] rounded-[.8rem] border border-main-gray-input bg-white px-[1rem] py-[.8rem]">
            {userResponse}
          </div>
        )}
        {userResponse && opsi && (
          <div className="flex flex-col gap-[.5rem] px-[.5rem]">
            {option.map((item: any, i: number) => {
              return (
                <div
                  className={`w-full rounded-[.7rem] p-4 text-[1rem] duration-300 ${StyleStream(item)}`}
                  key={i}
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
          </div>
        )}
        {(isLoading || completion) && (
          <>
            {opsi ? (
              <div className="p-4">
                <>
                  <h2 className="mb-2 font-semibold text-gray-600">
                    Your Response
                  </h2>

                  <div
                    className={`mb-4 rounded-3xl p-4 ${StyleYourResponseStream()} font-medium`}
                  >
                    {userResponse.includes(answer) ? (
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
                    <p className="ml-[.3rem] text-sm">{userResponse}</p>
                  </div>

                  <div className="">
                    <h2 className="mb-2 font-semibold text-gray-600">
                      Feedback
                    </h2>
                  </div>

                  <div className="flex flex-col gap-4">
                    <div
                      className={`rounded-3xl ${userResponse.includes(answer) ? 'bg-[#E1F7EB]' : 'bg-[#E1F7EB]'} p-4`}
                    >
                      <h4
                        className={
                          'mb-2 flex items-center text-sm font-semibold text-[#006426]'
                        }
                      >
                        Jawaban Yang Benar :
                      </h4>
                      {/* a */}
                      <ReactMarkdown value={answer} />
                    </div>
                    <Feedback moreInfo={splitResponse[2]} />
                  </div>
                </>
              </div>
            ) : (
              <div className="p-4">
                <h2 className="mb-2 text-lg font-semibold text-main-gray-text">
                  Feedback:
                </h2>
                <Feedback
                  correctResponse={splitResponse[0]}
                  wrongResponse={splitResponse[1]}
                  moreInfo={splitResponse[2]}
                />
              </div>
            )}
          </>
        )}
        {!opsi && (
          <Accordion
            type="single"
            collapsible
            defaultValue={isLoading || completion ? undefined : 'answer'}
          >
            <AccordionItem value="answer">
              <AccordionTrigger className="px-2 text-lg font-semibold text-main-gray-text">
                Answer
              </AccordionTrigger>
              <AccordionContent className="rounded-3xl bg-[#E1F2FF] p-4 text-black">
                {answer}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </>
  );
};

export default IndividualQuizReport;
