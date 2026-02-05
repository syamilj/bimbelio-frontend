import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Crown,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  XCircle,
} from 'lucide-react';
import { ResultDataProps } from '..';
import ButtonUpgradeTryout from '../../../../_components/ui/button-upgrade-tryout';

interface RingkasanTabProps {
  ResultData: ResultDataProps;
  unlockTryout: boolean;
}

export function RingkasanTab({ ResultData, unlockTryout }: RingkasanTabProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const userScore = ResultData?.userScore || 0;
  const totalParticipants = ResultData?.totalParticipants || 0;
  const firstUnivChoice = ResultData?.choiceAnalisis?.university?.[0];
  const univTotal = firstUnivChoice?.univTotalAplicants || 0;
  const majorTotal = firstUnivChoice?.majorTotalAplicants || 0;

  const summaryCards = [
    {
      title: 'Skor Total',
      value: userScore.toFixed(1),
      description: 'Rata rata skor keseluruhan',
      icon: Star,
      gradient: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
      bgColor: `${mainColor}10`,
      borderColor: `${mainColor}20`,
    },
    {
      title: 'Ranking Kamu',
      value: unlockTryout ? ResultData?.choiceAnalisis.rankingTryout : '...',
      description: `Dari ${unlockTryout ? totalParticipants : '...'} peserta`,
      icon: Trophy,
      gradient: 'linear-gradient(135deg, #10B981, #065F46)',
      bgColor: '#10B98110',
      borderColor: '#10B98120',
      locked: !unlockTryout,
      percentage: unlockTryout
        ? ResultData?.choiceAnalisis.tryoutPersentage
        : null,
    },
    {
      title: 'Ranking Universitas',
      value: unlockTryout ? ResultData?.choiceAnalisis.rankingUniv : '...',
      description: unlockTryout && univTotal > 0 ? `Dari ${univTotal} peserta` : 'Estimasi universitas target',
      icon: Award,
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      bgColor: '#F59E0B10',
      borderColor: '#F59E0B20',
      locked: !unlockTryout,
    },
    {
      title: 'Ranking Jurusan',
      value: unlockTryout ? ResultData?.choiceAnalisis.rankingMajor : '...',
      description: unlockTryout && majorTotal > 0 ? `Dari ${majorTotal} peserta` : 'Estimasi jurusan target',
      icon: Target,
      gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      bgColor: '#8B5CF610',
      borderColor: '#8B5CF620',
      locked: !unlockTryout,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Summary Cards - Horizontal Scroll on Mobile - More Compact */}
      <div className="overflow-x-auto no-scrollbar pb-3">
        <div className="flex lg:grid lg:grid-cols-4 gap-3 lg:gap-4 min-w-max lg:min-w-0">

        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;

          return (
            <Card
              key={index}
              className="relative border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[200px] lg:min-w-0 flex-shrink-0"
              style={{
                backgroundColor: card.bgColor,
                borderColor: card.borderColor,
              }}
            >
              {card.locked && <UpgradeLayer />}

              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-[11px] font-black text-slate-700 leading-tight">
                    {card.title}
                  </CardTitle>
                  <div
                    className="w-8 h-8 rounded-3xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
                    style={{ background: card.gradient }}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 pb-3">
                <div className="text-2xl font-black text-slate-900 mb-1 leading-none">
                  {card.value}
                  {card.percentage && (
                    <span className="text-sm text-green-600 ml-1.5">
                      (Top {card.percentage}%)
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-600 font-medium leading-tight">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
        </div>
      </div>

     {/* Additional Detailed Stats Card */}
      {unlockTryout && (
        <Card className="border rounded-3xl shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: mainColor }} />
              <CardTitle className="text-lg font-black text-slate-900">
                Statistik Lengkap
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total Questions */}
              <div className="text-center p-3 rounded-2xl bg-slate-50">
                <div className="text-xl md:text-2xl font-black text-slate-900">
                  {ResultData?.summaryTryout?.Result?.reduce(
                    (total, cat) =>
                      total +
                      cat.data.reduce((sum, subj) => sum + subj.totalQuestions, 0),
                    0,
                  ) || 0}
                </div>
                <div className="text-[10px] md:text-xs text-slate-600 font-medium mt-1">
                  Total Soal
                </div>
              </div>

              {/* Correct Answers */}
              <div className="text-center p-3 rounded-2xl bg-green-50">
                <div className="text-xl md:text-2xl font-black text-green-600">
                  {ResultData?.summaryTryout?.Result?.reduce(
                    (total, cat) =>
                      total +
                      cat.data.reduce(
                        (sum, subj) => sum + subj.correctAnswers,
                        0,
                      ),
                    0,
                  ) || 0}
                </div>
                <div className="text-[10px] md:text-xs text-green-700 font-medium mt-1">
                  Benar
                </div>
              </div>

              {/* Wrong Answers */}
              <div className="text-center p-3 rounded-2xl bg-red-50">
                <div className="text-xl md:text-2xl font-black text-red-600">
                  {ResultData?.summaryTryout?.Result?.reduce(
                    (total, cat) =>
                      total +
                      cat.data.reduce((sum, subj) => sum + subj.wrongAnswers, 0),
                    0,
                  ) || 0}
                </div>
                <div className="text-[10px] md:text-xs text-red-700 font-medium mt-1">
                  Salah
                </div>
              </div>

              {/* Accuracy */}
              <div className="text-center p-3 rounded-2xl" style={{ backgroundColor: `${mainColor}10` }}>
                <div className="text-xl md:text-2xl font-black" style={{ color: mainColor }}>
                  {(() => {
                    const totalCorrect =
                      ResultData?.summaryTryout?.Result?.reduce(
                        (total, cat) =>
                          total +
                          cat.data.reduce(
                            (sum, subj) => sum + subj.correctAnswers,
                            0,
                          ),
                        0,
                      ) || 0;
                    const totalQuestions =
                      ResultData?.summaryTryout?.Result?.reduce(
                        (total, cat) =>
                          total +
                          cat.data.reduce(
                            (sum, subj) => sum + subj.totalQuestions,
                            0,
                          ),
                        0,
                      ) || 1;
                    return Math.round((totalCorrect / totalQuestions) * 100);
                  })()}
                  %
                </div>
                <div className="text-[10px] md:text-xs font-medium mt-1" style={{ color: mainColor }}>
                  Akurasi
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results by Category */}
      {ResultData?.summaryTryout.Result?.map((category, categoryIndex) => (
        <div
          key={categoryIndex}
          className="space-y-6"
        >
          {/* Category Header - More Compact */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-3xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <BookOpen
                className="w-5 h-5"
                style={{ color: mainColor }}
              />
            </div>
            <div>
              <h2
                className="text-xl font-black"
                style={{ color: mainColor }}
              >
                {category.category}
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Analisis detail per mata pelajaran
              </p>
            </div>
          </div>

          {/* Subject Cards - More Compact */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {category.data.map((subject, subjectIndex) => (
              <Card
                key={subject.id}
                className="border rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <CardHeader
                  className="pb-3 relative"
                  style={{ backgroundColor: `${mainColor}05` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-3xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${mainColor}20` }}
                      >
                        <BookOpen
                          className="w-4 h-4"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <CardTitle className="text-sm md:text-base font-black text-slate-900 leading-tight">
                        {subject.title}
                      </CardTitle>
                    </div>
                    <div
                      className="text-lg md:text-xl font-black px-2.5 py-1 rounded-3xl flex-shrink-0"
                      style={{
                        color: mainColor,
                        backgroundColor: `${mainColor}15`,
                      }}
                    >
                      {subject.score.toFixed(1)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-3">
                  {/* Progress Bar - Compact */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Progress</span>
                      <span className="font-black">
                        {Math.round(
                          (subject.correctAnswers / subject.totalQuestions) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (subject.correctAnswers / subject.totalQuestions) * 100
                      }
                      className="h-2 rounded-full"
                      style={{
                        backgroundColor: '#f3f4f6',
                      }}
                    />
                  </div>

                  {/* Stats Grid - Inline for Mobile */}
                  <div className="flex gap-2 md:grid md:grid-cols-3 md:gap-3">
                    <div className="flex-1 text-center p-2 bg-green-50 rounded-2xl">
                      <CheckCircle2 className="w-4 h-4 mx-auto mb-0.5 text-green-600" />
                      <div className="text-base md:text-lg font-black text-green-700 leading-none">
                        {subject.correctAnswers}
                      </div>
                      <div className="text-[10px] text-green-600 font-medium mt-0.5">
                        Benar
                      </div>
                    </div>
                    <div className="flex-1 text-center p-2 bg-red-50 rounded-2xl">
                      <XCircle className="w-4 h-4 mx-auto mb-0.5 text-red-600" />
                      <div className="text-base md:text-lg font-black text-red-700 leading-none">
                        {subject.wrongAnswers}
                      </div>
                      <div className="text-[10px] text-red-600 font-medium mt-0.5">
                        Salah
                      </div>
                    </div>
                    <div className="flex-1 text-center p-2 bg-blue-50 rounded-2xl">
                      <Users className="w-4 h-4 mx-auto mb-0.5 text-blue-600" />
                      <div className="text-base md:text-lg font-black text-blue-700 leading-none">
                        {subject.totalQuestions}
                      </div>
                      <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                        Total
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 p-3">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-slate-700">
                      Peringkat:
                    </span>
                    {unlockTryout ? (
                      <span className="font-black text-xs text-slate-900">
                        {subject.ranking} dari {subject.totalParticipants}
                      </span>
                    ) : (
                      <ButtonUpgradeTryout>
                        <span className="text-xs text-yellow-600 underline cursor-pointer font-black">
                          Unlock
                        </span>
                      </ButtonUpgradeTryout>
                    )}
                  </div>

                  {unlockTryout && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs font-black text-green-600">
                        Top{' '}
                        {Math.round(
                          ((subject.totalParticipants - subject.ranking + 1) /
                            subject.totalParticipants) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const UpgradeLayer = () => {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl z-10 flex items-end justify-end p-4">
      <ButtonUpgradeTryout>
        <Button className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-3xl shadow-lg flex items-center gap-2 text-sm">
          <Crown className="w-4 h-4" />
          Unlock
        </Button>
      </ButtonUpgradeTryout>
    </div>
  );
};

export default RingkasanTab;
