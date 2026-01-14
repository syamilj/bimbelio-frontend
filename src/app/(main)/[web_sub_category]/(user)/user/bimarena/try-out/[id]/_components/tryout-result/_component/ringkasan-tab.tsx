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
import { motion } from 'framer-motion';
import {
  Award,
  BarChart3,
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
      description: 'Estimasi universitas target',
      icon: Award,
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      bgColor: '#F59E0B10',
      borderColor: '#F59E0B20',
      locked: !unlockTryout,
    },
    {
      title: 'Ranking Jurusan',
      value: unlockTryout ? ResultData?.choiceAnalisis.rankingMajor : '...',
      description: 'Estimasi jurusan target',
      icon: Target,
      gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      bgColor: '#8B5CF610',
      borderColor: '#8B5CF620',
      locked: !unlockTryout,
    },
  ];

  console.log({ check: ResultData?.summaryTryout.Result });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h1
          className="text-3xl font-bold mb-2"
          style={{ color: mainColor }}
        >
          Ringkasan Hasil
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Berikut adalah ringkasan lengkap dari performa Kamu dalam try out ini
        </p>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {summaryCards.map((card, index) => {
          const IconComponent = card.icon;

          return (
            <Card
              key={index}
              className="relative border-2 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: card.bgColor,
                borderColor: card.borderColor,
              }}
            >
              {card.locked && <UpgradeLayer />}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">
                    {card.title}
                  </CardTitle>
                  <div
                    className="w-10 h-10 rounded-3xl flex items-center justify-center text-white shadow-sm"
                    style={{ background: card.gradient }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {card.value}
                  {card.percentage && (
                    <span className="text-lg text-green-600 ml-2">
                      (Top {card.percentage}%)
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Detailed Results by Category */}
      {ResultData?.summaryTryout.Result?.map((category, categoryIndex) => (
        <motion.div
          key={categoryIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + categoryIndex * 0.1 }}
          className="space-y-6"
        >
          {/* Category Header */}
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-3xl flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <BookOpen
                className="w-6 h-6"
                style={{ color: mainColor }}
              />
            </div>
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: mainColor }}
              >
                {category.category}
              </h2>
              <p className="text-gray-600">
                Analisis detail per mata pelajaran
              </p>
            </div>
          </div>

          {/* Subject Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {category.data.map((subject, subjectIndex) => (
              <Card
                key={subject.id}
                className="border-2 border-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <CardHeader
                  className="pb-4 relative"
                  style={{ backgroundColor: `${mainColor}05` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-3xl flex items-center justify-center"
                        style={{ backgroundColor: `${mainColor}20` }}
                      >
                        <BookOpen
                          className="w-5 h-5"
                          style={{ color: mainColor }}
                        />
                      </div>
                      <CardTitle className="text-lg font-bold text-gray-900">
                        {subject.title}
                      </CardTitle>
                    </div>
                    <div
                      className="text-2xl font-bold px-3 py-1 rounded-3xl"
                      style={{
                        color: mainColor,
                        backgroundColor: `${mainColor}15`,
                      }}
                    >
                      {subject.score.toFixed(1)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress Jawaban</span>
                      <span className="font-semibold">
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
                      className="h-3 rounded-full"
                      style={{
                        backgroundColor: '#f3f4f6',
                      }}
                    />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-3xl">
                      <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-green-600" />
                      <div className="text-lg font-bold text-green-700">
                        {subject.correctAnswers}
                      </div>
                      <div className="text-xs text-green-600">Benar</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-3xl">
                      <XCircle className="w-6 h-6 mx-auto mb-1 text-red-600" />
                      <div className="text-lg font-bold text-red-700">
                        {subject.wrongAnswers}
                      </div>
                      <div className="text-xs text-red-600">Salah</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-3xl">
                      <Users className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <div className="text-lg font-bold text-blue-700">
                        {subject.totalQuestions}
                      </div>
                      <div className="text-xs text-blue-600">Total</div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Peringkat:
                    </span>
                    {unlockTryout ? (
                      <span className="font-bold text-gray-900">
                        {subject.ranking} dari {subject.totalParticipants}
                      </span>
                    ) : (
                      <ButtonUpgradeTryout>
                        <span className="text-yellow-600 underline cursor-pointer font-semibold">
                          Unlock
                        </span>
                      </ButtonUpgradeTryout>
                    )}
                  </div>

                  {unlockTryout && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-green-600">
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
        </motion.div>
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
