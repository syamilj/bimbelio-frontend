"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingPageWithText from "@/components/ui/spinner";
import { toaster } from "@/components/ui/toaster";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { utils, writeFile } from "xlsx";
import ProcessData from "../_components/ProcessData";
import ResultsOverview from "../_components/ResultsOverview";
import Upload3PLData from "../_components/Upload3PLData";
import UploadParticipantData from "../_components/UploadParticipantData";
import UploadSummary from "../_components/UploadSummary";
import { getGeneral, mutateGeneral } from "@/lib/fetch-helper";
import {
  Tryout,
  TryoutAnswer,
  TryoutCategory,
  TryoutQuestion,
  TryoutSession,
  TryoutSessionParticipant,
  TryoutSubCategory,
  TryoutUserAnswer,
} from "@/types/database";

export interface OverallStatsProps {
  totalParticipants: number;
  averageScores: number;
  averageTheta: number;
  minScores: number;
  maxScores: number;
  medianScores: number;
  minTheta: number;
  maxTheta: number;
}

export interface DataIRTProps {
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
}

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
  console.log({ tryoutId });

  const [loading, setLoading] = useState<boolean>(false);
  const [sessionIndex, setSessionIndex] = useState<number>(0);

  // const { data: TryoutData } = api.irt.getTryoutDataForIrt.useQuery(
  //   { tryoutId: tryoutId as string },
  //   { refetchOnWindowFocus: false, enabled: !!tryoutId }
  // );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [TryoutData, setTryoutData] = useState<TryoutDataType>();

  useEffect(() => {
    getGeneral(`/irt/getTryoutDataForIrt?tryoutId=${tryoutId}`, {
      setData: setTryoutData,
      setLoading: setIsLoading,
    });
  }, [tryoutId]);

  // const { mutateAsync: saveSessionIRT } = api.irt.saveIrtForSession.useMutation(
  //   {
  //     onSuccess() {
  //       toaster({
  //         title: "Berhasil",
  //         condition: "success",
  //         description: "Berhasil Menyimpan data IRT untuk sesi ini!",
  //         duration: 4000,
  //       });
  //       setLoading(false);
  //     },
  //     onError() {
  //       toaster({
  //         title: "Gagal",
  //         condition: "warning",
  //         description: "Gagal Menyimpan data IRT untuk sesi ini!",
  //         duration: 3000,
  //       });
  //       setLoading(false);
  //     },
  //   }
  // );

  const saveSessionIRT = async (payload: any) => {
    await mutateGeneral("url", {
      payload,
      type: "post",
      setLoading: setLoading,
    });
  };

  const [participantFile, setParticipantFile] = useState<File | null>(null);
  const [threePLFile, setThreePLFile] = useState<File | null>(null);
  const [overallStats, setOverallStats] = useState<OverallStatsProps | null>(
    null
  );
  const [saveDataIRT, setSaveDataIRT] = useState<DataIRTProps | null>(null);

  //=====

  const processDataUserAnswer = (sessionIndex: number) => {
    if (!TryoutData) return;
    // const dummyData = data2;
    const dummyData = TryoutData;
    const SessionOne = dummyData.TryoutSession[sessionIndex];
    console.log({ SessionOne });
    const filterData = SessionOne.TryoutSessionParticipant.map(
      (participant) => {
        const question = participant.TryoutUserAnswer.map((uAnswer) => {
          const isCorrect = () => {
            if (uAnswer.TryoutAnswers?.value === 5) return 1;
            return 0;
          };
          return {
            q: uAnswer.TryoutQuestion.number,
            correct: isCorrect(),
          };
        }).sort((a, b) => a.q - b.q);
        return {
          p: participant.userId,
          question,
        };
      }
    ).map((participant) => {
      return {
        p: participant.p,
        question: participant.question,
      };
    });

    const groupingByParticipant = filterData.reduce(
      (
        acc: {
          [key: string]: {
            q: number;
            correct: number;
          }[];
        },
        item
      ) => {
        const key = item.p;
        const question = item.question;
        acc[key] = [...question];
        return acc;
      },
      {}
    );

    const groupingArray = Object.keys(groupingByParticipant)
      .map((key) => {
        const question = groupingByParticipant[key];
        const groupingByQuestion = question.reduce(
          (acc: { [key: string]: number }, item) => {
            const key = `q${item.q}`;
            acc[key] = item.correct;
            return acc;
          },
          {}
        );
        if (question.length == 0) {
          return null;
        }
        return {
          p: key,
          ...groupingByQuestion,
        };
      })
      .filter((item) => item);

    console.log({ groupingByParticipant, groupingArray });
    return groupingArray.map((item) => {
      return {
        ...item,
        p: item?.p,
      };
    });
  };

  const exportData = async (sessionIndex: number) => {
    const fileName = `${
      TryoutData?.TryoutSession[sessionIndex]?.TryoutCategory?.name ||
      "default_category"
    }_${
      TryoutData?.TryoutSession[sessionIndex]?.TryoutSubCategory?.name ||
      "default_subcategory"
    }`;

    const downloadData = processDataUserAnswer(sessionIndex) || null;

    if (!downloadData) return;

    let wb = utils.book_new(),
      ws = utils.json_to_sheet(downloadData);
    utils.book_append_sheet(wb, ws, "items");
    writeFile(wb, `${fileName}.csv`);
  };

  console.log({ saveDataIRT });

  return (
    <div className="container mx-auto p-4 space-y-8">
      <LoadingPageWithText
        loading={loading}
        heading="Sedang Menyimpan Data IRT"
      />
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-4xl font-bold">
            SNBT/UTBK Processor
          </CardTitle>
          <CardDescription className="text-xl text-gray-100">
            Analisis komprehensif data SNBT/UTBK dalam 6 langkah mudah
          </CardDescription>
        </CardHeader>
      </Card>
      {TryoutData && (
        <Card>
          <CardHeader>
            <CardTitle>IRT Tryout</CardTitle>
            <div className="flex flex-col gap-2 pt-4">
              <h1 className="font-semibold text-lg">Pilih Sesi</h1>
              <Select
                value={sessionIndex.toString()}
                onValueChange={(value) =>
                  value && setSessionIndex(parseInt(value))
                }
              >
                <SelectTrigger className="font-medium text-base py-[.6rem] h-[unset]">
                  <SelectValue placeholder="Pilih Sesi" />
                </SelectTrigger>
                <SelectContent>
                  {TryoutData?.TryoutSession.map((item, index) => (
                    <SelectItem
                      key={index}
                      value={index.toString()}
                      className="font-medium text-base"
                    >
                      {item.TryoutCategory.name} - {item.TryoutSubCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {TryoutData && (
                <div className="flex gap-4 items-center">
                  <Button
                    className="bg-main hover:bg-main-hover w-fit"
                    onClick={() => {
                      exportData(sessionIndex);
                    }}
                  >
                    Download CSV
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <UploadParticipantData setParticipantFile={setParticipantFile} />
              <Upload3PLData setThreePLFile={setThreePLFile} />
            </div>
            <UploadSummary
              participantFile={participantFile}
              threePLFile={threePLFile}
            />
            {participantFile && threePLFile && (
              <ProcessData
                setSaveDataIRT={setSaveDataIRT}
                participantFile={participantFile}
                setOverallStats={setOverallStats}
                threePLFile={threePLFile}
              />
            )}
            {overallStats && <ResultsOverview overallStats={overallStats} />}
            {participantFile && threePLFile && saveDataIRT && (
              <Button
                onClick={() => {
                  if (!TryoutData || !saveDataIRT || !tryoutId) return;
                  setLoading(true);
                  saveSessionIRT({
                    SaveDataIRT: saveDataIRT,
                    sessionId: TryoutData.TryoutSession[sessionIndex].id,
                    tryoutId: tryoutId as string,
                  });
                }}
              >
                Simpan Data IRT untuk Sesi Ini
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* <Tabs
        value={currentStep.toString()}
        onValueChange={(value) => setCurrentStep(parseInt(value))}
      >
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {steps.map((step, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              disabled={index > currentStep}
              className="text-sm sm:text-base"
            >
              {step.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {steps.map((step, index) => (
          <TabsContent key={index} value={index.toString()}>
            <Card>
              <CardHeader>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>
                  Langkah {index + 1} dari {steps.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <step.component
                  onNext={handleNext}
                  setParticipantFile={setParticipantFile}
                  setThreePLFile={setThreePLFile}
                  participantFile={participantFile}
                  threePLFile={threePLFile}
                  setResults={setResults}
                  setOverallStats={setOverallStats}
                  results={results}
                  overallStats={overallStats}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs> */}
    </div>
  );
}
