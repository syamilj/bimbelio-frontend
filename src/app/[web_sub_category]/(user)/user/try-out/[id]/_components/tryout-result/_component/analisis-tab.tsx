//src/pages/client/try-out/[id]/_component/tryout-result/_components/analisis-tab.tsx
'use client';

import ButtonUpgradeTryout from '@/app/[web_sub_category]/(user)/user/try-out/_components/ui/button-upgrade-tryout';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ComboboxSelect } from '@/components/ui/combobox-select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  BarChart3,
  CheckCircle,
  Crown,
  Loader2,
  Lock,
  Minus,
  School,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Trophy,
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
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { UniversityOptions } = useProvider();

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

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
                    <div className="-ml-4 flex flex-col gap-2 border-l pl-4">
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
                    <div className="-ml-4 flex flex-col gap-2 border-l pl-4">
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
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: mainColor }}
        >
          Analisis Mendalam
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Analisis komprehensif peluang kelulusan berdasarkan passing grade
          universitas dan jurusan target Anda
        </p>
      </motion.div>

      {/* Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="analisis">
          <TabsList
            className="grid w-full grid-cols-3 h-14 p-1 rounded-2xl border-0 shadow-lg mb-8"
            style={{ backgroundColor: `${mainColor}08` }}
          >
            <TabsTrigger
              value="analisis"
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:text-white data-[state=active]:shadow-md"
              // style={{
              //   backgroundColor: 'transparent',
              // }}
            >
              <BarChart3 className="w-4 h-4" />
              <span className=" sm:inline">Analisis Pilihan</span>
            </TabsTrigger>

            {website_sub_category_id === 'snbt' && (
              <TabsTrigger
                value="rekomendasi"
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                <Trophy className="w-4 h-4" />
                <span className="sm:inline">Rekomendasi</span>
              </TabsTrigger>
            )}

            <TabsTrigger
              value="simulasi"
              className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Target className="w-4 h-4" />
              <span className=" sm:inline">Simulasi</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent
            value="analisis"
            className={cn('relative')}
          >
            <UpgradeLayer unlockTryout={unlockTryout} />

            <div className={cn('space-y-8', !unlockTryout && 'py-10')}>
              {/* Summary Statistics */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                {/* Score Card */}
                <Card
                  className="border-2 rounded-2xl overflow-hidden shadow-lg"
                  style={{
                    borderColor: `${mainColor}20`,
                    backgroundColor: `${mainColor}05`,
                  }}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-sm font-semibold text-gray-700">
                      Skor Total
                    </CardTitle>
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: mainColor }}
                    >
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div
                      className="text-3xl font-bold mb-2"
                      style={{ color: mainColor }}
                    >
                      {unlockTryout ? userScore.toFixed(1) : '---'}
                    </div>
                    <Progress
                      value={unlockTryout ? (userScore / 1000) * 100 : 0}
                      className="h-2 mb-2"
                      style={{ backgroundColor: '#f3f4f6' }}
                    />
                    <p className="text-xs font-medium text-gray-600">
                      Dari skor maksimum 1000
                    </p>
                  </CardContent>
                </Card>

                {/* Ranking Card */}
                <Card className="border-2 border-green-200 bg-green-50 rounded-2xl overflow-hidden shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-sm font-semibold text-green-700">
                      Ranking Anda
                    </CardTitle>
                    <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                      <Crown className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-green-700">
                        {unlockTryout
                          ? ResultData?.choiceAnalisis.rankingTryout
                          : '---'}
                      </div>
                      <p className="text-xs text-green-600">
                        Dari {unlockTryout ? totalParticipants : '---'} peserta
                      </p>
                    </div>
                    <div className="-ml-4 flex flex-col border-l-2 border-green-400 pl-4">
                      <div className="flex flex-col gap-2 pb-0">
                        <div className="text-2xl font-bold text-green-700">
                          Top{' '}
                          {unlockTryout
                            ? ResultData?.choiceAnalisis.tryoutPersentage
                            : '--'}
                          %
                        </div>
                      </div>
                      <div className="pt-2 text-xs font-medium text-main-gray-text">
                        Peserta
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* University Ranking Card */}
                <Card className="border-2 border-yellow-200 bg-yellow-50 rounded-2xl overflow-hidden shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-sm font-semibold text-yellow-700">
                      Estimasi Universitas
                    </CardTitle>
                    <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center">
                      <School className="h-5 w-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-yellow-700">
                        {unlockTryout
                          ? ResultData?.choiceAnalisis.rankingUniv
                          : '---'}
                      </div>
                      <p className="text-xs text-yellow-600">
                        Ranking Universitas
                      </p>
                    </div>
                    <div className="-ml-4 flex flex-col border-l-2 border-yellow-400 pl-4">
                      <div className="flex flex-col gap-2 pb-0">
                        <div className="text-2xl font-bold text-yellow-700">
                          {unlockTryout
                            ? ResultData?.choiceAnalisis.rankingMajor
                            : '---'}
                        </div>
                      </div>
                      <div className="pt-2 text-xs font-medium text-main-gray-text">
                        Ranking Jurusan
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* University Analysis */}
              {unlockTryout && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <School
                      className="w-6 h-6"
                      style={{ color: mainColor }}
                    />
                    Analisis Universitas dan Jurusan
                  </h2>

                  {ResultData?.choiceAnalisis.university.map(
                    (choice, index) => {
                      const passingUniv = choice.univAverageScore;
                      const passingMajor = choice.majorAverageScore;
                      const isUnivPass = passingUniv < userScore;
                      const isMajorPass = passingMajor < userScore;

                      return (
                        <Card
                          key={choice.univ}
                          className="border-2 border-gray-100 rounded-2xl shadow-lg overflow-hidden"
                        >
                          <CardHeader
                            className="border-b"
                            style={{ backgroundColor: `${mainColor}03` }}
                          >
                            <CardTitle className="text-xl font-bold flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: `${mainColor}15` }}
                              >
                                <School
                                  className="w-5 h-5"
                                  style={{ color: mainColor }}
                                />
                              </div>
                              {choice.univ} - {choice.major}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* University Analysis */}
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    Analisis Universitas
                                  </h3>
                                  <Badge
                                    className={cn(
                                      'flex items-center gap-1 px-3 py-1',
                                      isUnivPass
                                        ? 'bg-green-100 text-green-700 border-green-200'
                                        : 'bg-red-100 text-red-700 border-red-200',
                                    )}
                                  >
                                    {isUnivPass ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <XCircle className="h-4 w-4" />
                                    )}
                                    {isUnivPass
                                      ? 'Lulus Passing Grade'
                                      : 'Belum Lulus'}
                                  </Badge>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex justify-between text-sm font-medium">
                                    <span>Skor Anda: {userScore}</span>
                                    <span>Passing Grade: {passingUniv}</span>
                                  </div>
                                  <Progress
                                    value={(userScore / passingUniv) * 100}
                                    className="h-3"
                                  />
                                  <div className="flex justify-end">
                                    {getTrendIcon(userScore, passingUniv)}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <div className="text-2xl font-bold text-gray-900">
                                      {choice.univRanking}
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      Dari {choice.univTotalAplicants} peserta
                                    </p>
                                  </div>
                                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <div className="text-2xl font-bold text-gray-900">
                                      {choice.univPercentage}%
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      Top peserta
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Major Analysis */}
                              <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    Analisis Jurusan
                                  </h3>
                                  <Badge
                                    className={cn(
                                      'flex items-center gap-1 px-3 py-1',
                                      isMajorPass
                                        ? 'bg-green-100 text-green-700 border-green-200'
                                        : 'bg-red-100 text-red-700 border-red-200',
                                    )}
                                  >
                                    {isMajorPass ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      <XCircle className="h-4 w-4" />
                                    )}
                                    {isMajorPass
                                      ? 'Lulus Passing Grade'
                                      : 'Belum Lulus'}
                                  </Badge>
                                </div>

                                <div className="space-y-4">
                                  <div className="flex justify-between text-sm font-medium">
                                    <span>Skor Anda: {userScore}</span>
                                    <span>Passing Grade: {passingMajor}</span>
                                  </div>
                                  <Progress
                                    value={(userScore / passingMajor) * 100}
                                    className="h-3"
                                  />
                                  <div className="flex justify-end">
                                    {getTrendIcon(userScore, passingMajor)}
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <div className="text-2xl font-bold text-gray-900">
                                      {choice.majorRanking}
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      Dari {choice.majorTotalAplicants} peserta
                                    </p>
                                  </div>
                                  <div className="text-center p-4 bg-gray-50 rounded-xl">
                                    <div className="text-2xl font-bold text-gray-900">
                                      {choice.majorPercentage}%
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      Top peserta
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    },
                  )}
                </motion.div>
              )}
            </div>
          </TabsContent>

          {/* Rekomendasi Tab */}
          {website_sub_category_id === 'snbt' && (
            <TabsContent
              value="rekomendasi"
              className="relative"
            >
              <UpgradeLayer unlockTryout={unlockTryout} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Rekomendasi Universitas & Jurusan
                  </h2>
                  <p className="text-gray-600">
                    Berdasarkan skor Anda, berikut adalah rekomendasi
                    universitas dan jurusan dengan peluang kelulusan tinggi
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {unlockTryout
                    ? recommendations.map((item, index) => (
                        <Card
                          key={index}
                          className="border-2 border-gray-100 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                          <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                              <CardTitle className="text-lg font-bold">
                                {item.univ}
                              </CardTitle>
                              <CardDescription className="text-base">
                                {item.study}
                              </CardDescription>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Rekomendasi Tinggi
                            </Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between text-sm font-medium">
                                <span>Skor Anda: {userScore}</span>
                                <span>Passing Grade: {item.averageScore}</span>
                              </div>
                              <Progress
                                value={(userScore / item.averageScore) * 100}
                                className="h-3"
                              />
                              <div className="text-center">
                                <span className="text-green-700 font-semibold">
                                  Peluang Lulus:{' '}
                                  {Math.min(
                                    95,
                                    Math.round(
                                      (userScore / item.averageScore) * 100,
                                    ),
                                  )}
                                  %
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    : // Locked content preview
                      Array.from({ length: 4 }).map((_, index) => (
                        <Card
                          key={index}
                          className="border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden opacity-60"
                        >
                          <CardHeader>
                            <CardTitle className="text-lg">
                              Universitas ---
                            </CardTitle>
                            <CardDescription>Jurusan ---</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between text-sm">
                                <span>Skor Anda: ---</span>
                                <span>Passing Grade: ---</span>
                              </div>
                              <Progress
                                value={0}
                                className="h-3"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                </div>
              </motion.div>
            </TabsContent>
          )}

          {/* Simulasi Tab */}
          <TabsContent
            value="simulasi"
            className="relative"
          >
            <UpgradeLayer unlockTryout={unlockTryout} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Card className="border-2 border-gray-100 rounded-2xl shadow-lg overflow-hidden">
                <CardHeader
                  className="border-b"
                  style={{ backgroundColor: `${mainColor}05` }}
                >
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <Target
                      className="w-6 h-6"
                      style={{ color: mainColor }}
                    />
                    Simulasi Pilihan Universitas dan Jurusan
                  </CardTitle>
                  <CardDescription className="text-base">
                    Pilih universitas dan jurusan untuk melihat analisis peluang
                    kelulusan yang detail
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-8">
                  <form
                    className="space-y-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      getSimulationData();
                    }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ComboboxSelect
                        heading="Pilihan Universitas"
                        placeholder="Pilih universitas target"
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
                        heading="Pilihan Jurusan"
                        placeholder="Pilih jurusan target"
                        value={selectedMajor}
                        setValue={setSelectedMajor}
                        options={(UnivChoice?.studyProgramList || [])
                          .map((item) => ({
                            label: item.study,
                            value: item.study,
                          }))
                          .filter((item) => item !== null)}
                        disabled={
                          website_sub_category_id !== 'snbt' || !UnivChoice
                        }
                      />
                    </div>

                    {website_sub_category_id === 'snbt' && (
                      <div className="flex justify-center">
                        <Button
                          type="submit"
                          className={cn(
                            'px-8 py-3 rounded-xl font-bold text-white shadow-lg',
                            !unlockTryout && 'cursor-not-allowed opacity-50',
                          )}
                          style={{ backgroundColor: mainColor }}
                          disabled={simualationLoad || !unlockTryout}
                        >
                          {simualationLoad && unlockTryout ? (
                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          ) : (
                            <Target className="h-5 w-5 mr-2" />
                          )}
                          Analisis Simulasi
                        </Button>
                      </div>
                    )}
                  </form>

                  {/* Simulation Results */}
                  {unlockTryout && renderAnalysisSimulasi()}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

const UpgradeLayer = ({ unlockTryout }: { unlockTryout: boolean }) => {
  if (unlockTryout) return null;

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl z-10 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
          <Lock className="w-8 h-8 text-yellow-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-gray-900">
            Fitur Premium Diperlukan
          </h3>
          <p className="text-gray-600 max-w-md">
            Upgrade ke premium untuk mengakses analisis mendalam dan rekomendasi
            personal
          </p>
        </div>
        <ButtonUpgradeTryout>
          <Button className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-bold px-8 py-3 rounded-xl shadow-lg">
            <Crown className="w-5 h-5 mr-2" />
            Upgrade Sekarang
          </Button>
        </ButtonUpgradeTryout>
      </div>
    </div>
  );
};

export default AnalisisTab;
