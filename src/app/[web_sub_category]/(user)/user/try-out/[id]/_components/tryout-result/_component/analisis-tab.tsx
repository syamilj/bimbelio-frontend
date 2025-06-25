//src/pages/client/try-out/[id]/_component/tryout-result/_components/analisis-tab.tsx
'use client';

import ButtonUpgradeTryout from '@/app/[web_sub_category]/(user)/user/try-out/_components/ui/button-upgrade-tryout';
// import { InputOptionUniversity } from '@/app/[web_sub_category]/(user)/user/try-out/_components/ui/registration-try-out';
import { useSession } from '@/components/provider/provider-session-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
// import University from '@/lib/data/university';
import { ComboboxSelect } from '@/components/ui/combobox-select';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { IconStar, IconTryOut } from '@/styles/icon';
import {
  CheckCircle,
  Loader2,
  Minus,
  School,
  Sparkles,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ResultDataProps, TryoutAccountType } from '..';
import { useProvider } from '../../../../provider';

interface Recommendation {
  univ: string;
  study: string;
  averageScore: number;
}

export function AnalisisTab({
  tryoutId,
  ResultData,
  unlockTryout,
  tryoutAccount,
}: {
  tryoutId: string;
  ResultData: ResultDataProps;
  unlockTryout: boolean;
  tryoutAccount: TryoutAccountType;
}) {
  const { data: session } = useSession();
  const { UniversityOptions } = useProvider();

  // const { mutateAsync: SimulationData } =
  //   api.tryout.getSimulationDataByTryoutId.useMutation();

  const userScore = ResultData?.userScore || 0;
  const totalParticipants = ResultData?.totalParticipants || 0;

  const [selectedUniversity, setSelectedUniversity] = useState<string>('');
  const [selectedMajor, setSelectedMajor] = useState<string>('');
  const [simualationLoad, setSimulationLoad] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<{
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
  } | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const getTrendIcon = (score: number, threshold: number) => {
    if (score > threshold)
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (score < threshold)
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
  };

  const getSimulationData = async () => {
    if (!unlockTryout) return null;
    setSelectedData(null);
    setSimulationLoad(true);
    // const data = await SimulationData({
    //   tryoutId,
    //   university: selectedUniversity,
    //   major: selectedMajor,
    // });
    const res = await getGeneral(
      `/tryout/getSimulationDataByTryoutId?userId=${session?.user.id}&tryoutId=${tryoutId}&university=${selectedUniversity}&major=${selectedMajor}`,
    );
    if (res?.data) {
      setSelectedData(res?.data);
    }
    setSimulationLoad(false);
  };

  const renderAnalysisSimulasi = () => {
    const data = selectedData;
    // if (!data) return null;

    if (selectedUniversity.length === 0 || selectedMajor.length === 0)
      return null;

    const univTotalApplicants = data?.univTotalAplicants;
    const majorTotalApplicants = data?.majorTotalAplicants;

    const passingUniv = data?.univAverageScore;
    const passingMajor = data?.majorAverageScore;

    const isUnivPass = passingUniv ? userScore > passingUniv : true;
    const isMajorPass = passingMajor ? userScore > passingMajor : true;

    const uniRank = data?.univRanking;
    const majorRank = data?.majorRanking;

    const univPercentage = data?.univPercentage;
    const majorPercentage = data?.majorPercentage;

    const chartData = [
      { name: 'Skor Kamu', score: userScore, fill: '#3b82f6' },
      {
        name: 'Passing Grade Universitas',
        score: passingUniv,
        fill: '#16a34a',
      },
      { name: 'Passing Grade Jurusan', score: passingMajor, fill: '#ca8a04' },
    ];

    if (simualationLoad)
      return (
        <div className="flex w-full justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-main" />
        </div>
      );

    return (
      <div className="flex flex-col gap-20">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-none bg-workspace">
            <CardHeader className="flex items-center justify-between md:flex-row">
              <CardTitle className="text-lg">Analisis Universitas</CardTitle>
              {isUnivPass ? (
                <Badge
                  variant="default"
                  className="flex items-center gap-1 bg-green-100 text-green-600"
                >
                  <CheckCircle className="h-4 w-4" /> Lulus Passing Grade
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1 bg-red-100 text-red-600"
                >
                  <XCircle className="h-4 w-4" /> Belum Lulus Passing Grade
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Skor Kamu: {unlockTryout ? userScore : '-'}
                    </span>
                    <span className="text-sm font-semibold">
                      Passing Grade: {unlockTryout ? passingMajor : '-'}
                    </span>
                  </div>
                  <Progress
                    value={passingUniv ? (userScore / passingUniv) * 100 : 30}
                    className="mb-2 h-1"
                    classNameThumb={cn(
                      isUnivPass ? 'bg-green-600' : 'bg-red-600',
                    )}
                  />
                  <div className="flex items-center justify-end">
                    {getTrendIcon(userScore, passingUniv ? passingUniv : 1000)}
                  </div>
                </div>
                <div>
                  <h1 className="mb-4 text-sm font-semibold">Peringkatmu:</h1>
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-xl font-bold">
                        {unlockTryout ? majorRank : '-'}
                      </h1>
                      <p className="text-xs font-semibold text-muted-foreground">
                        dari {unlockTryout ? majorTotalApplicants : '-'} peserta
                      </p>
                    </div>
                    <div className="ml-[-1rem] flex flex-col gap-2 border-l pl-4">
                      <h1 className="text-xl font-bold">
                        {unlockTryout ? majorPercentage : '-'}%
                      </h1>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Kamu berada di top{' '}
                        {unlockTryout ? majorPercentage : '-'}% peserta
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none bg-workspace">
            <CardHeader className="flex items-center justify-between md:flex-row">
              <CardTitle className="text-lg">Analisis Jurusan</CardTitle>
              {isMajorPass ? (
                <Badge
                  variant="default"
                  className="flex items-center gap-1 bg-green-100 text-green-600"
                >
                  <CheckCircle className="h-4 w-4" /> Lulus Passing Grade
                </Badge>
              ) : (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1 bg-red-100 text-red-600"
                >
                  <XCircle className="h-4 w-4" /> Belum Lulus Passing Grade
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold">
                      Skor Kamu: {unlockTryout ? userScore : '-'}
                    </span>
                    <span className="text-sm font-semibold">
                      Passing Grade: {unlockTryout ? passingMajor : '-'}
                    </span>
                  </div>
                  <Progress
                    value={passingMajor ? (userScore / passingMajor) * 100 : 30}
                    className="mb-2 h-1"
                    classNameThumb={cn(
                      isMajorPass ? 'bg-green-600' : 'bg-red-600',
                    )}
                  />
                  <div className="flex items-center justify-end">
                    {getTrendIcon(
                      userScore,
                      passingMajor ? passingMajor : 1000,
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Peringkatmu</h4>
                  <div className="grid grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <h1 className="text-xl font-bold">
                        {unlockTryout ? majorRank : '-'}
                      </h1>
                      <p className="text-xs font-semibold text-muted-foreground">
                        dari {unlockTryout ? majorTotalApplicants : '-'} peserta
                      </p>
                    </div>
                    <div className="ml-[-1rem] flex flex-col gap-2 border-l pl-4">
                      <h1 className="text-xl font-bold">
                        {unlockTryout ? majorPercentage : '-'}%
                      </h1>
                      <p className="text-xs font-semibold text-muted-foreground">
                        Kamu berada di top{' '}
                        {unlockTryout ? majorPercentage : '-'}% peserta
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score">
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const handleUnivChoice = () => {
    if (website_sub_category_id !== 'snbt') {
      setSimulationLoad(true);
      setSelectedUniversity(tryoutAccount?.univChoiceOne || '');
      setTimeout(() => {
        setSelectedMajor(tryoutAccount?.univStudyChoiceOne || '');
      }, 1000);
    }
  };

  const UnivChoice =
    selectedUniversity.length > 0
      ? UniversityOptions.find((item) => item.university === selectedUniversity)
      : null;

  useEffect(() => {
    handleUnivChoice();
  }, [tryoutAccount]);

  useEffect(() => {
    if (
      website_sub_category_id !== 'snbt' &&
      selectedUniversity.length > 0 &&
      selectedMajor.length > 0
    ) {
      getSimulationData();
    }
  }, [tryoutAccount, selectedUniversity, selectedMajor]);

  useEffect(() => {
    const findUniv = UniversityOptions.filter(
      (univ) => univ.averageScore < userScore,
    );
    const recomendationsData = findUniv
      .map((univ) => {
        const recomendationsMajor = univ.studyProgramList
          .filter((item) => {
            if (item.averageScore === null) return false;
            if (item.averageScore < userScore) {
              return true;
            }
            return false;
          })
          .map((item) => ({
            ...item,
            univ: univ.university,
            averageScore: item.averageScore || 0,
          }));
        return recomendationsMajor;
      })
      .flat()
      .sort((a, b) => (b.averageScore || 0) - (a.averageScore || 0))
      .slice(0, 10);
    setRecommendations(recomendationsData);
  }, [userScore, ResultData]);

  useEffect(() => {
    setSelectedMajor('');
  }, [selectedUniversity]);

  return (
    <div className="space-y-6">
      <Card className="border-none bg-transparent p-6 px-0">
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Sparkles className="h-6 w-6" />
            Analisis Hasil Try Out
          </CardTitle>
          <CardDescription>
            Analisis peluang kelulusan berdasarkan passing grade dan peringkat
            Kamu
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Tabs defaultValue="analisis">
            <TabsList className="mb-8 flex w-fit gap-2">
              <TabsTrigger
                value="analisis"
                className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm data-[state=active]:bg-main data-[state=active]:text-white"
              >
                Analisis Pilihan
              </TabsTrigger>
              {website_sub_category_id === 'snbt' && (
                <TabsTrigger
                  value="rekomendasi"
                  className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm data-[state=active]:bg-main data-[state=active]:text-white"
                >
                  Rekomendasi
                </TabsTrigger>
              )}
              <TabsTrigger
                value="simulasi"
                className="flex flex-1 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm data-[state=active]:bg-main data-[state=active]:text-white"
              >
                Simulasi
              </TabsTrigger>
            </TabsList>
            <TabsContent
              value="analisis"
              className="relative"
            >
              <UpgareLayer unlockTryout={unlockTryout} />
              {!unlockTryout && (
                <div className="flex flex-col gap-12">
                  <div className="space-y-4">
                    <h1 className="text-2xl font-semibold">Analisis Pilihan</h1>
                    <div className="grid grid-cols-1 gap-4 pt-0 md:grid-cols-3">
                      <Card
                        id="skor_snbt"
                        className="flex flex-col justify-between rounded-2xl border-none bg-main/15 shadow-none"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-semibold">
                            Skor
                          </CardTitle>
                          <IconStar
                            active
                            className="text-main"
                            w={20}
                          />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 pb-0">
                          <div className="text-2xl font-bold">-</div>
                          <Progress
                            value={80}
                            className="mb-2 h-1"
                            classNameThumb="bg-blue-400"
                          />
                        </CardContent>
                        <CardFooter className="pt-2 text-xs font-medium text-main-gray-text">
                          Dari poin maksimum
                        </CardFooter>
                      </Card>
                      <Card
                        id="ranking"
                        className="flex flex-col rounded-2xl border-none bg-green-100 shadow-none"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-semibold">
                            Ranking Kamu
                          </CardTitle>
                          <IconTryOut
                            active
                            className="text-green-600"
                            w={20}
                          />
                        </CardHeader>
                        <CardContent className="mt-2 grid grid-cols-2">
                          <div className="flex flex-col">
                            <div className="flex flex-col gap-2 pb-0">
                              <div className="text-2xl font-bold">-</div>
                            </div>
                            <div className="pt-2 text-xs font-medium text-main-gray-text">
                              Dari - peserta
                            </div>
                          </div>
                          <div className="ml-[-1rem] flex flex-col border-l-2 border-green-400 pl-4">
                            <div className="flex flex-col gap-2 pb-0">
                              <div className="text-2xl font-bold">Top -%</div>
                            </div>
                            <div className="pt-2 text-xs font-medium text-main-gray-text">
                              Peserta
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card
                        id="ranking_univ"
                        className="flex flex-col rounded-2xl border-none bg-yellow-50 shadow-none"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-semibold">
                            Ranking Universitas & Jurusan
                          </CardTitle>
                          <IconTryOut
                            active
                            className="text-yellow-500"
                            w={20}
                          />
                        </CardHeader>
                        <CardContent className="mt-2 grid grid-cols-2">
                          <div className="flex flex-col">
                            <div className="flex flex-col gap-2 pb-0">
                              <div className="text-2xl font-bold">-</div>
                            </div>
                            <div className="pt-2 text-xs font-medium text-main-gray-text">
                              Estimasi Universitas
                            </div>
                          </div>
                          <div className="ml-[-1rem] flex flex-col border-l-2 border-yellow-400 pl-4">
                            <div className="flex flex-col gap-2 pb-0">
                              <div className="text-2xl font-bold">-</div>
                            </div>
                            <div className="pt-2 text-xs font-medium text-main-gray-text">
                              Estimasi Jurusan
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-2xl font-semibold">
                      Universitas dan Jurusan
                    </h1>
                    {ResultData?.choiceAnalisis.university.map((choice) => {
                      const passingUniv = choice.univAverageScore;
                      const passingMajor = choice.majorAverageScore;

                      return (
                        <Card
                          key={choice.univ}
                          className="mt-6"
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl md:text-xl">
                              <School className="hidden h-6 w-6 md:block" />
                              Universitas - Jurusan
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Card>
                                <CardHeader className="flex items-center justify-between md:flex-row">
                                  <CardTitle className="text-lg">
                                    Analisis Universitas
                                  </CardTitle>
                                  <Badge
                                    variant="default"
                                    className="flex items-center gap-1 bg-green-100 text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4" /> Lulus
                                    atau tidak
                                  </Badge>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-semibold">
                                          Skormu: -
                                        </span>
                                        <span className="text-sm font-semibold">
                                          Passing Grade: -
                                        </span>
                                      </div>
                                      <Progress
                                        value={90}
                                        className="mb-2 h-1"
                                        classNameThumb={cn('bg-green-600')}
                                      />
                                      <div className="flex items-center justify-end">
                                        {getTrendIcon(userScore, passingUniv)}
                                      </div>
                                    </div>
                                    <div>
                                      <h1 className="mb-4 text-sm font-semibold">
                                        Peringkatmu:
                                      </h1>
                                      <div className="grid grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                          <h1 className="text-xl font-bold">
                                            -
                                          </h1>
                                          <p className="text-xs font-semibold text-muted-foreground">
                                            dari - peserta
                                          </p>
                                        </div>
                                        <div className="ml-[-1rem] flex flex-col gap-2 border-l pl-4">
                                          <h1 className="text-xl font-bold">
                                            -%
                                          </h1>
                                          <p className="text-xs font-semibold text-muted-foreground">
                                            Kamu berada di top -% peserta
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="flex items-center justify-between md:flex-row">
                                  <CardTitle className="text-lg">
                                    Analisis Jurusan
                                  </CardTitle>
                                  <Badge
                                    variant="default"
                                    className="flex items-center gap-1 bg-green-100 text-green-600"
                                  >
                                    <CheckCircle className="h-4 w-4" /> Lulus
                                    atau tidak
                                  </Badge>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-semibold">
                                          Skormu: -
                                        </span>
                                        <span className="text-sm font-semibold">
                                          Passing Grade: -
                                        </span>
                                      </div>
                                      <Progress
                                        value={80}
                                        className="mb-2 h-1"
                                        classNameThumb={cn('bg-green-600')}
                                      />
                                      <div className="flex items-center justify-end">
                                        {getTrendIcon(userScore, passingMajor)}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="mb-2 text-sm font-semibold">
                                        Peringkatmu
                                      </h4>
                                      <div className="grid grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                          <h1 className="text-xl font-bold">
                                            -
                                          </h1>
                                          <p className="text-xs font-semibold text-muted-foreground">
                                            dari - peserta
                                          </p>
                                        </div>
                                        <div className="ml-[-1rem] flex flex-col gap-2 border-l pl-4">
                                          <h1 className="text-xl font-bold">
                                            -%
                                          </h1>
                                          <p className="text-xs font-semibold text-muted-foreground">
                                            Kamu berada di top -% peserta
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
              {unlockTryout && (
                <div className="flex flex-col gap-12">
                  <div className="space-y-4">
                    <h1 className="text-2xl font-semibold">Analisis Pilihan</h1>
                    <div className="grid grid-cols-1 gap-4 pt-0 md:grid-cols-3">
                      <Card
                        id="skor_snbt"
                        className="flex flex-col justify-between rounded-2xl border-none bg-main/15 shadow-none"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-semibold">
                            Skor
                          </CardTitle>
                          <IconStar
                            active
                            className="text-main"
                            w={20}
                          />
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2 pb-0">
                          <div className="text-2xl font-bold">
                            {userScore.toFixed(2)}
                          </div>
                          <Progress
                            value={(userScore / 1000) * 100}
                            className="mb-2 h-1"
                            classNameThumb="bg-blue-400"
                          />
                        </CardContent>
                        <CardFooter className="pt-2 text-xs font-medium text-main-gray-text">
                          Dari poin maksimum
                        </CardFooter>
                      </Card>
                      <Card
                        id="ranking"
                        className="flex flex-col rounded-2xl border-none bg-green-100 shadow-none"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-semibold">
                            Ranking Kamu
                          </CardTitle>
                          <IconTryOut
                            active
                            className="text-green-600"
                            w={20}
                          />
                        </CardHeader>
                        <CardContent className="mt-2 grid grid-cols-2">
                          <div className="flex flex-col">
                            <div className="flex flex-col gap-2 pb-0">
                              <div className="text-2xl font-bold">
                                {ResultData?.choiceAnalisis.rankingTryout}
                              </div>
                            </div>
                            <div className="pt-2 text-xs font-medium text-main-gray-text">
                              Dari {totalParticipants} peserta
                            </div>
                          </div>
                          <div className="ml-[-1rem] flex flex-col border-l-2 border-green-400 pl-4">
                            <div className="flex flex-col gap-2 pb-0">
                              <div className="text-2xl font-bold">
                                Top{' '}
                                {ResultData?.choiceAnalisis.tryoutPersentage}%
                              </div>
                            </div>
                            <div className="pt-2 text-xs font-medium text-main-gray-text">
                              Peserta
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card
                        id="ranking_univ"
                        className="flex flex-col rounded-2xl border-none bg-yellow-50 shadow-none"
                      >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-semibold">
                            Ranking Universitas & Jurusan
                          </CardTitle>
                          <IconTryOut
                            active
                            className="text-yellow-500"
                            w={20}
                          />
                        </CardHeader>
                        <CardContent className="mt-2 grid grid-cols-2">
                          <div className="flex flex-col">
                            <div className="flex flex-col gap-2 pb-0">
                              <div className="text-2xl font-bold">
                                {ResultData?.choiceAnalisis.rankingUniv}
                              </div>
                            </div>
                            <div className="pt-2 text-xs font-medium text-main-gray-text">
                              Estimasi Universitas
                            </div>
                          </div>
                          <div className="ml-[-1rem] flex flex-col border-l-2 border-yellow-400 pl-4">
                            <div className="flex flex-col gap-2 pb-0">
                              <div className="text-2xl font-bold">
                                {ResultData?.choiceAnalisis.rankingMajor}
                              </div>
                            </div>
                            <div className="pt-2 text-xs font-medium text-main-gray-text">
                              Estimasi Jurusan
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-2xl font-semibold">
                      Universitas dan Jurusan
                    </h1>
                    {ResultData?.choiceAnalisis.university.map((choice) => {
                      const passingUniv = choice.univAverageScore;
                      const passingMajor = choice.majorAverageScore;

                      const uniRank = choice.univRanking;
                      const majorRank = choice.majorRanking;

                      const univTotalApplicants = choice.univTotalAplicants;
                      const majorTotalApplicants = choice.majorTotalAplicants;

                      const isUnivPass = passingUniv < userScore;
                      const isMajorPass = passingMajor < userScore;

                      return (
                        <Card
                          key={choice.univ}
                          className="mt-6"
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl md:text-xl">
                              <School className="hidden h-6 w-6 md:block" />
                              {choice.univ} - {choice.major}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <Card>
                                <CardHeader className="flex items-center justify-between md:flex-row">
                                  <CardTitle className="text-lg">
                                    Analisis Universitas
                                  </CardTitle>
                                  {isUnivPass ? (
                                    <Badge
                                      variant="default"
                                      className="flex items-center gap-1 bg-green-100 text-green-600"
                                    >
                                      <CheckCircle className="h-4 w-4" /> Lulus
                                      Passing Grade
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="destructive"
                                      className="flex items-center gap-1 bg-red-100 text-red-600"
                                    >
                                      <XCircle className="h-4 w-4" /> Belum
                                      Lulus Passing Grade
                                    </Badge>
                                  )}
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-semibold">
                                          Skormu: {userScore}
                                        </span>
                                        <span className="text-sm font-semibold">
                                          Passing Grade: {passingUniv}
                                        </span>
                                      </div>
                                      <Progress
                                        value={(userScore / passingUniv) * 100}
                                        className="mb-2 h-1"
                                        classNameThumb={cn(
                                          isUnivPass
                                            ? 'bg-green-600'
                                            : 'bg-red-600',
                                        )}
                                      />
                                      <div className="flex items-center justify-end">
                                        {getTrendIcon(userScore, passingUniv)}
                                      </div>
                                    </div>
                                    <div>
                                      <h1 className="mb-4 text-sm font-semibold">
                                        Peringkatmu:
                                      </h1>
                                      <div className="grid grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                          <h1 className="text-xl font-bold">
                                            {uniRank}
                                          </h1>
                                          <p className="text-xs font-semibold text-muted-foreground">
                                            dari {univTotalApplicants} peserta
                                          </p>
                                        </div>
                                        <div className="ml-[-1rem] flex flex-col gap-2 border-l pl-4">
                                          <h1 className="text-xl font-bold">
                                            {choice.univPercentage}%
                                          </h1>
                                          <p className="text-xs font-semibold text-muted-foreground">
                                            Kamu berada di top{' '}
                                            {choice.univPercentage}% peserta
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card>
                                <CardHeader className="flex items-center justify-between md:flex-row">
                                  <CardTitle className="text-lg">
                                    Analisis Jurusan
                                  </CardTitle>
                                  {isMajorPass ? (
                                    <Badge
                                      variant="default"
                                      className="flex items-center gap-1 bg-green-100 text-green-600"
                                    >
                                      <CheckCircle className="h-4 w-4" /> Lulus
                                      Passing Grade
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="destructive"
                                      className="flex items-center gap-1 bg-red-100 text-red-600"
                                    >
                                      <XCircle className="h-4 w-4" /> Belum
                                      Lulus Passing Grade
                                    </Badge>
                                  )}
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div>
                                      <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-semibold">
                                          Skormu: {userScore}
                                        </span>
                                        <span className="text-sm font-semibold">
                                          Passing Grade: {passingMajor}
                                        </span>
                                      </div>
                                      <Progress
                                        value={(userScore / passingMajor) * 100}
                                        className="mb-2 h-1"
                                        classNameThumb={cn(
                                          isMajorPass
                                            ? 'bg-green-600'
                                            : 'bg-red-600',
                                        )}
                                      />
                                      <div className="flex items-center justify-end">
                                        {getTrendIcon(userScore, passingMajor)}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="mb-2 text-sm font-semibold">
                                        Peringkatmu
                                      </h4>
                                      <div className="grid grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                          <h1 className="text-xl font-bold">
                                            {majorRank}
                                          </h1>
                                          <p className="text-xs font-semibold text-muted-foreground">
                                            dari {majorTotalApplicants} peserta
                                          </p>
                                        </div>
                                        <div className="ml-[-1rem] flex flex-col gap-2 border-l pl-4">
                                          <h1 className="text-xl font-bold">
                                            {choice.majorPercentage}%
                                          </h1>
                                          <p className="text-xs font-semibold text-muted-foreground">
                                            Kamu berada di top{' '}
                                            {choice.majorPercentage}% peserta
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="rekomendasi"
              className="relative"
            >
              <UpgareLayer unlockTryout={unlockTryout} />
              {!unlockTryout && (
                <div className="flex flex-col gap-4">
                  <h1 className="text-2xl font-semibold">
                    Rekomendasi Universitas dan Jurusan
                  </h1>
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">Universitas</CardTitle>
                          <CardDescription>Jurusan</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Skor Kamu: -
                            </span>
                            <span className="text-sm font-medium">
                              Passing Grade: -
                            </span>
                          </div>
                          <Progress
                            value={80}
                            className="mb-2"
                          />
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="default"
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-4 w-4" /> Lulus atau
                              tidak
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              {unlockTryout && (
                <div className="flex flex-col gap-4">
                  <h1 className="text-2xl font-semibold">
                    Rekomendasi Universitas dan Jurusan
                  </h1>
                  <div className="space-y-4">
                    {recommendations.map((item, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-lg">{item.univ}</CardTitle>
                          <CardDescription>{item.study}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Skor Kamu: {userScore}
                            </span>
                            <span className="text-sm font-medium">
                              Passing Grade: {item.averageScore}
                            </span>
                          </div>
                          <Progress
                            value={(userScore / item.averageScore) * 100}
                            className="mb-2"
                          />
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="default"
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-4 w-4" /> Lulus Passing
                              Grade
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent
              value="simulasi"
              className="relative"
            >
              <UpgareLayer unlockTryout={unlockTryout} />
              <Card className="border-none bg-transparent shadow-none">
                <CardHeader className="px-0">
                  <CardTitle>
                    Simulasi Pilihan Universitas dan Jurusan
                  </CardTitle>
                  <CardDescription>
                    Pilih universitas dan jurusan untuk melihat peluang
                    kelulusan Kamu
                  </CardDescription>
                </CardHeader>
                <CardContent className="rounded-xl border bg-white p-6">
                  <div className="space-y-4">
                    <form
                      className="flex flex-col gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        getSimulationData();
                      }}
                    >
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* <InputOptionUniversity
                          heading="Pilihan 1 - Universitas"
                          placeholder="Universitas"
                          value={selectedUniversity}
                          setValue={setSelectedUniversity}
                          type="university"
                          disabled={website_sub_category_id !== 'snbt'}
                        />
                        <InputOptionUniversity
                          heading="Pilihan 1 - Jurusan"
                          placeholder="Jurusan"
                          value={selectedMajor}
                          setValue={setSelectedMajor}
                          type="studyProgramList"
                          university={selectedUniversity}
                          disabled={website_sub_category_id !== 'snbt'}
                        /> */}
                        <ComboboxSelect
                          heading="Pilihan 1 - Universitas"
                          placeholder="Universitas"
                          value={selectedUniversity}
                          setValue={setSelectedUniversity}
                          isUniversity={true}
                          options={UniversityOptions.map((item) => ({
                            label: item.university,
                            value: item.university,
                          }))}
                          disabled={website_sub_category_id !== 'snbt'}
                        />
                        <ComboboxSelect
                          heading="Pilihan 1 - Jurusan"
                          placeholder="Jurusan"
                          value={selectedMajor}
                          setValue={setSelectedMajor}
                          options={(UnivChoice?.studyProgramList || [])
                            .map((item) => {
                              return {
                                label: item.study,
                                value: item.study,
                              };
                            })
                            .filter((item) => item !== null)
                            .flat(Infinity)}
                          disabled={
                            website_sub_category_id !== 'snbt' || !UnivChoice
                          }
                        />
                      </div>
                      {website_sub_category_id === 'snbt' && (
                        <div className="flex w-full justify-start">
                          <Button
                            className={cn(
                              'h-9 w-30 bg-main duration-300 hover:bg-main/85',
                              !unlockTryout && 'cursor-not-allowed',
                            )}
                            disabled={simualationLoad}
                          >
                            {simualationLoad && unlockTryout ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Submit'
                            )}
                          </Button>
                        </div>
                      )}
                    </form>
                    <div>{unlockTryout && renderAnalysisSimulasi()}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default AnalisisTab;

const UpgareLayer = ({ unlockTryout }: { unlockTryout: boolean }) => {
  if (unlockTryout) return null;
  return (
    <div className="absolute -top-4 -left-4 -bottom-4 -right-4 rounded-xl bg-white/70 z-[1] flex justify-end pt-4 pr-4">
      <ButtonUpgradeTryout />
    </div>
  );
};
