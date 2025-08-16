'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LoadingPageWithText, {
  LoadingComponentWithText,
} from '@/components/ui/spinner';

import { toaster } from '@/components/ui/toaster';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import {
  Tryout,
  TryoutAnswer,
  TryoutCategory,
  TryoutQuestion,
  TryoutSession,
  TryoutSessionParticipant,
  TryoutSubCategory,
  TryoutUserAnswer,
} from '@/types/database';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import ResultsOverview from '../_components/ResultsOverview';

export type OverallStatsProps = {
  totalParticipants: number;
  averageScores: number;
  averageTheta: number;
  minScores: number;
  maxScores: number;
  medianScores: number;
  minTheta: number;
  maxTheta: number;
};

export type DataIRTProps = {
  participants: {
    p: string;
    theta: number;
    score: number;
  }[];
  question: {
    q: number;
    a: number;
    b: number;
    c: number;
  }[];
};

type TryoutDataType = Tryout & {
  TryoutSession: (TryoutSession & {
    TryoutSessionParticipant: (TryoutSessionParticipant & {
      TryoutUserAnswer: (TryoutUserAnswer & {
        TryoutQuestion: TryoutQuestion;
        TryoutAnswers: TryoutAnswer;
      })[];
    })[];
    TryoutCategory: TryoutCategory;
    TryoutSubCategory: TryoutSubCategory;
  })[];
};

export default function SNBTProcessor() {
  // const router = useRouter();
  // const { tryoutId } = router.query;
  const params = useParams();
  const tryoutId = params?.tryoutId as string;

  // const [loading, setLoading] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');

  // const { data: TryoutData } = api.irt.getTryoutDataForIrt.useQuery(
  //   { tryoutId: tryoutId as string },
  //   { refetchOnWindowFocus: false, enabled: !!tryoutId }
  // );

  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [TryoutData, setTryoutData] = useState<TryoutDataType>();

  const {
    data: TryoutData,
    isLoading,
    refetch: TryoutDataRefetch,
  } = useGet<TryoutDataType>('/irt/getTryoutDataForIrt', {
    params: {
      tryoutId,
    },
  });

  // useEffect(() => {
  //   getGeneral(`/irt/getTryoutDataForIrt?tryoutId=${tryoutId}`, {
  //     setData: setTryoutData,
  //     setLoading: setIsLoading,
  //   });
  // }, [tryoutId]);

  const isIrtBefore = () => {
    if (!TryoutData) return false;
    const session = TryoutData.TryoutSession.find(
      (item) => item.id === sessionId,
    );
    if (!session) return false;
    if (session.TryoutSessionParticipant.length > 0) {
      let isDone = false;
      outer: for (const participant of session.TryoutSessionParticipant) {
        for (const uAnswer of participant.TryoutUserAnswer) {
          if (
            uAnswer.TryoutQuestion.a_discrimination &&
            uAnswer.TryoutQuestion.b_difficulty &&
            uAnswer.TryoutQuestion.c_guessing
          ) {
            isDone = true;
            break outer;
          }
        }
      }
      // session.TryoutSessionParticipant[0].TryoutUserAnswer.forEach(
      //   (uAnswer) => {
      //     if (
      //       uAnswer.TryoutQuestion.a_discrimination &&
      //       uAnswer.TryoutQuestion.b_difficulty &&
      //       uAnswer.TryoutQuestion.c_guessing
      //     ) {
      //       isDone = true;
      //     }
      //   },
      // );
      return isDone;
    }
    return false;
  };

  const { mutate: saveSessionIRT, isLoading: saveSessionIRTIsLoading } =
    useMutation('/irt/saveIrtForSession', 'post', {
      onSuccess() {
        TryoutDataRefetch();
      },
    });

  const { mutate: ProcessIRT, isLoading: ProcessIrtIsLoading } = useMutation<
    DataIRTProps & {
      overallStats: OverallStatsProps;
    }
  >('/irt/processIrtForSession', 'post', {
    onSuccess({ data }) {
      console.log({ data });
      if (data?.overallStats) {
        setOverallStats(data.overallStats);
      }
      if (data?.participants && data.question) {
        setSaveDataIRT({
          participants: data?.participants,
          question: data?.question,
        });
      }
    },
  });

  const [overallStats, setOverallStats] = useState<OverallStatsProps | null>(
    null,
  );
  const [saveDataIRT, setSaveDataIRT] = useState<DataIRTProps | null>(null);

  console.log({ overallStats });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <LoadingPageWithText
        loading={ProcessIrtIsLoading}
        heading="Sedang Memproses Data IRT"
      />
      <LoadingPageWithText
        loading={saveSessionIRTIsLoading}
        heading="Sedang Menyimpan Data IRT"
      />
      <Card className="bg-linear-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">Processor</CardTitle>
          <CardDescription className="text-xl text-gray-100">
            Analisis komprehensif data dalam 6 langkah mudah
          </CardDescription>
        </CardHeader>
      </Card>
      {isLoading && (
        <LoadingComponentWithText heading="Mengambil Data Tryout..." />
      )}
      {TryoutData && (
        <Card>
          <CardHeader>
            <CardTitle>IRT Tryout</CardTitle>
            <div className="flex flex-col gap-2 pt-4">
              <h1 className="font-semibold text-lg">Pilih Sesi</h1>
              <Select
                value={sessionId}
                onValueChange={(value) =>
                  // value && setSessionIndex(parseInt(value))
                  {
                    setSessionId(value);
                    setSaveDataIRT(null);
                    setOverallStats(null);
                  }
                }
              >
                <SelectTrigger className="font-medium text-base py-[.6rem] h-[unset]">
                  <SelectValue placeholder="Pilih Sesi" />
                </SelectTrigger>
                <SelectContent>
                  {TryoutData?.TryoutSession.map((item, index) => (
                    <SelectItem
                      key={index}
                      value={item.id}
                      className="font-medium text-base"
                    >
                      {item.TryoutCategory.name} - {item.TryoutSubCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {TryoutData && (
                <div className="flex flex-col gap-4">
                  <Button
                    className="bg-main hover:bg-main/85 w-fit"
                    onClick={() => {
                      // exportData(sessionIndex);
                      if (!sessionId) {
                        toaster({
                          title: 'Error',
                          condition: 'warning',
                          description: 'Pilih Sesi Tryout!',
                        });
                        return;
                      }
                      ProcessIRT({
                        payload: {
                          sessionId,
                          tryoutId,
                        },
                      });
                    }}
                  >
                    Process Data
                  </Button>

                  {isIrtBefore() ? (
                    <p className="text-green-600 font-semibold">
                      Sesi ini sudah pernah di IRT sebelumnya
                    </p>
                  ) : (
                    <p className="text-red-600 font-semibold">
                      Sesi ini belum pernah di IRT sebelumnya
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {/* <div className="grid grid-cols-2 gap-4">
              <UploadParticipantData setParticipantFile={setParticipantFile} />
              <Upload3PLData setThreePLFile={setThreePLFile} />
            </div> */}
            {/* <UploadSummary
              participantFile={participantFile}
              threePLFile={threePLFile}
            /> */}
            {/* {participantFile && threePLFile && (
              <ProcessData
                setSaveDataIRT={setSaveDataIRT}
                participantFile={participantFile}
                setOverallStats={setOverallStats}
                threePLFile={threePLFile}
              />
            )} */}
            {overallStats && <ResultsOverview overallStats={overallStats} />}
            {saveDataIRT && (
              <Button
                onClick={() => {
                  if (!TryoutData || !saveDataIRT || !tryoutId) return;
                  saveSessionIRT({
                    payload: {
                      SaveDataIRT: saveDataIRT,
                      sessionId,
                      tryoutId: tryoutId as string,
                    },
                  });
                }}
              >
                Simpan Data IRT untuk Sesi Ini
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
