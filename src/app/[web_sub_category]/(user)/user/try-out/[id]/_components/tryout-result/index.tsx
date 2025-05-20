'use client';

import { useSession } from '@/components/provider/session-provider-auth';
import { Button } from '@/components/ui/button';
import LoaderEyeAnimation from '@/components/ui/loading/loading-bounce';
import LoadingPageWithText from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper';
import { getDateString, getHoursDetail } from '@/lib/utils';
import { IconDocumentAdmin, IconTabsQuiz, IconTimer2 } from '@/styles/icon';
import { GenderEnum } from '@/types/database';
import { Sparkles } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TryoutDataType } from '../../page';
import CountdownResult from '../countdown-result';
import { AnalisisTab } from './_component/analisis-tab';
import Header from './_component/header';
import { ReviewTab } from './_component/review-tab';
import { RingkasanTab } from './_component/ringkasan-tab';

export interface SessionOptionsProps {
  id: string;
  name: string;
  TryoutCategory: string;
  TryoutSubCategory: string;
}

interface Props {
  sessionData: NonNullable<TryoutDataType>['TryoutSession'];
  tryoutId: string;
  sessionOptions: SessionOptionsProps[];
  resultDate: Date;
}

export interface ResultDataProps {
  userScore: number;
  totalParticipants: number;
  summaryTryout: SummaryTryout;
  choiceAnalisis: ChoiceAnalisis;
  TryoutSession: {
    userScore: number;
    totalParticipants: number;
  }[];
}

interface SummaryTryout {
  userScore: number;
  sessionResult: {
    id: string;
    category: string;
    subCategory: string;
    correctAnswers: number;
    wrongAnswers: number;
    totalQuestions: number;
    score: number;
    totalParticipants: number;
    ranking: number;
  }[];
  Result: {
    category: string;
    data: {
      id: string;
      title: string;
      correctAnswers: number;
      wrongAnswers: number;
      totalQuestions: number;
      score: number;
      totalParticipants: number;
      ranking: number;
    }[];
  }[];
}

interface ChoiceAnalisis {
  userScore: number;
  rankingTryout: number;
  tryoutPersentage: number;
  rankingUniv: number;
  rankingMajor: number;
  university: {
    univ: string;
    univAverageScore: number;
    major: string;
    majorAverageScore: number;
    univRanking: number;
    univPercentage: number;
    univTotalAplicants: number;
    majorRanking: number;
    majorPercentage: number;
    majorTotalAplicants: number;
  }[];
}

type TabsProps = 'ringkasan' | 'review' | 'analisis';

export type TryoutAccountType =
  | {
      gender: GenderEnum;
      age: number;
      phone: string;
      kabupaten: string;
      provinsi: string;
      channel: string;
      website_sub_category_id: string;
      id: string;
      userTryOutId: string;
      targetValue: number | null;
      univChoiceOne: string | null;
      univStudyChoiceOne: string | null;
      univChoiceTwo: string | null;
      univStudyChoiceTwo: string | null;
    }
  | undefined;

export default function TryoutResult({
  sessionData,
  tryoutId,
  sessionOptions,
  resultDate,
}: Props) {
  const pathname = usePathname();
  const isTesting = pathname?.toLowerCase().includes('testing') || false;
  const { data: session } = useSession();
  const router = useRouter();
  // const { query } = router;
  // const tab = query.tab as TabsProps;
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab') as TabsProps;

  const currentDate = new Date();

  const [tabs, setTabs] = useState<TabsProps>('review');
  const [resultIndex, setResultIndex] = useState<number>(0);

  const [TestAgainTryoutLoading, setTestAgainTryoutLoading] =
    useState<boolean>(false);

  const sessionId =
    sessionData && sessionData.length > 0 ? sessionData[resultIndex].id : '';

  const TestAgainTryout = async (payload: {
    userId: string;
    tryoutId: string;
  }) => {
    await mutateGeneral('/tryout/testAgain', {
      payload,
      type: 'post',
      onSuccess() {
        setTestAgainTryoutLoading(false);
        router.push(`/${website_sub_category_id}/admin/tryout/testing/try-out`);
      },
      onError() {
        setTestAgainTryoutLoading(false);
      },
    });
  };

  const [unlockTryoutDbs, setUnlockTryoutDbs] = useState<any>();
  const [unlockTryoutIsLoading, setUnlockTryoutIsLoading] =
    useState<boolean>(true);
  const [unlockTryoutIsError, setUnlockTryoutIsError] =
    useState<boolean>(false);

  useEffect(() => {
    getGeneral(
      `/tryout/getTryoutUnlockByTryoutId?userId=${session?.user.id}&tryoutId=${tryoutId}`,
      {
        setData: setUnlockTryoutDbs,
        setLoading: setUnlockTryoutIsLoading,
        onError() {
          setUnlockTryoutIsError(true);
        },
      },
    );
  }, [session, tryoutId]);

  const unlockTryout =
    session && session.user.role !== 'USER' ? true : unlockTryoutDbs || false;

  console.log({ unlockTryout, unlockTryoutDbs, session });

  const [sessionResult, setSessionResult] = useState<any>();
  const [sessionResultIsLoading, setSessionResultIsLoading] =
    useState<boolean>(true);
  const [sessionResultIsError, setSessionResultIsError] =
    useState<boolean>(false);

  useEffect(() => {
    getGeneral(
      `/tryoutSession/getTryoutSessionResult?userId=${session?.user.id}&sessionId=${sessionId}`,
      {
        setData: setSessionResult,
        setLoading: setSessionResultIsLoading,
        onError() {
          setSessionResultIsError(true);
        },
      },
    );
  }, [session, sessionId]);

  console.log({ sessionResult });

  const [ResultData, setResultData] = useState<any>();
  const [ResultDataIsLoading, setResultDataIsLoading] = useState<boolean>(true);
  const [ResultDataIsError, setResultDataIsError] = useState<boolean>(false);

  useEffect(() => {
    getGeneral(
      `/tryout/getAnalisisByTryoutId?userId=${session?.user.id}&tryoutId=${tryoutId}`,
      {
        setData: setResultData,
        setLoading: setResultDataIsLoading,
        onError() {
          setResultDataIsError(true);
        },
      },
    );
  }, [session, tryoutId]);

  useEffect(() => {
    if (!isTesting) {
      router.push(
        `/${website_sub_category_id}/user/try-out/${tryoutId}?tab=${tabs}`,
      );
    } else {
      router.push(
        `/${website_sub_category_id}/admin/tryout/testing/try-out/${tryoutId}?tab=${tabs}`,
      );
    }
  }, [tabs]);

  useEffect(() => {
    if (tab) {
      setTabs(tab);
    }
  }, []);

  const [tryoutAccount, setTryoutAccount] = useState<TryoutAccountType>();

  const getUserTryout = async () => {
    getGeneral(`/user/getUserTryOut?userId=${session?.user.id}`, {
      setData: setTryoutAccount,
    });
  };

  useEffect(() => {
    getUserTryout();
  }, []);

  console.log({ bool: currentDate < resultDate });
  console.log({ currentDate: getDateString(currentDate) });
  console.log({ resultDate: getDateString(resultDate) });

  if (currentDate < resultDate && !isTesting) {
    return <CoundowntShowResult resultDate={resultDate} />;
  }

  if (ResultDataIsError || sessionResultIsError || unlockTryoutIsError) {
    return 'Error';
  }

  if (
    sessionResultIsLoading ||
    !sessionResult ||
    ResultDataIsLoading ||
    !ResultData ||
    unlockTryoutIsLoading ||
    unlockTryout === undefined
  )
    return (
      <div className="fixed flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <LoaderEyeAnimation />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto mt-[48px] px-4 py-6 md:mt-[52px]">
      <LoadingPageWithText
        loading={TestAgainTryoutLoading}
        heading="Mereset Data Tryout..."
      />
      <Header
        current={0}
        total={-1}
        name={''}
        done
      />
      <Tabs
        value={tabs}
        className="w-full"
      >
        <div className="flex w-full justify-between mb-8 ">
          <TabsList className="flex w-fit gap-2">
            <TabsTrigger
              value="ringkasan"
              className="flex flex-1 items-center gap-[.5rem] rounded-[.7rem] bg-white px-[1rem] py-[.6rem] text-sm data-[state=active]:bg-main data-[state=active]:text-white"
              onClick={() => setTabs('ringkasan')}
            >
              <IconDocumentAdmin
                active
                w={15}
              />
              <p>Ringkasan</p>
            </TabsTrigger>
            <TabsTrigger
              value="review"
              className="flex flex-1 items-center gap-[.5rem] rounded-[.7rem] bg-white px-[1rem] py-[.6rem] text-sm data-[state=active]:bg-main data-[state=active]:text-white"
              onClick={() => setTabs('review')}
            >
              <IconTabsQuiz w={15} />
              <p>Review Soal</p>
            </TabsTrigger>

            <TabsTrigger
              value="analisis"
              className="flex flex-1 items-center gap-[.5rem] rounded-[.7rem] bg-white px-[1rem] py-[.6rem] text-sm data-[state=active]:bg-main data-[state=active]:text-white"
              onClick={() => setTabs('analisis')}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <p>Analisis</p>
            </TabsTrigger>
          </TabsList>
          {isTesting && session?.user.role === 'ADMIN' && (
            <Button
              onClick={() => {
                setTestAgainTryoutLoading(true);
                TestAgainTryout({ tryoutId, userId: session.user.id });
              }}
            >
              Test Again
            </Button>
          )}
        </div>
        <TabsContent
          value="ringkasan"
          className="md:px-[1rem]"
        >
          <RingkasanTab
            ResultData={ResultData}
            unlockTryout={unlockTryout}
          />
        </TabsContent>
        <TabsContent
          value="review"
          className="md:px-[1rem]"
        >
          <ReviewTab
            sessionResult={sessionResult}
            setResultIndex={setResultIndex}
            resultIndex={resultIndex}
            sessionOptions={sessionOptions}
          />
        </TabsContent>
        <TabsContent
          value="analisis"
          className="md:px-[1rem]"
        >
          <AnalisisTab
            tryoutId={tryoutId}
            ResultData={ResultData}
            unlockTryout={unlockTryout}
            tryoutAccount={tryoutAccount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CoundowntShowResultProps {
  resultDate: Date;
}

const CoundowntShowResult = ({ resultDate }: CoundowntShowResultProps) => {
  return (
    <div className="container mx-auto mt-[48px] px-4 py-6 md:mt-[52px]">
      <Header
        current={0}
        total={-1}
        name={''}
        done
      />
      <div className="flex flex-col gap-[1rem] overflow-y-auto px-[1rem] pb-[2rem] pt-[1rem]">
        <div className="flex flex-col items-center gap-[1rem] rounded-[1rem] bg-white py-[1rem]">
          <IconTimer2
            className="my-[.5rem] text-main-gray-text"
            w={62}
          />
          <p className="font-semibold">Penilaian dapat dilihat dalam</p>
          <div className="flex flex-col items-center">
            <p className="text-[1.4rem] font-medium text-orange-500/80">
              <CountdownResult targetDate={resultDate} />
            </p>
            <p className="font-regular mt-[.5rem] text-[.9rem] text-main-gray-text">
              ({getDateString(resultDate)} - {getHoursDetail(resultDate)})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
