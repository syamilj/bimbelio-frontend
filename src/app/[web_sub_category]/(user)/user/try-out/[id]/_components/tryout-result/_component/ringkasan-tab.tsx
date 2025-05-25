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
  IconCheckList,
  IconDocumentAdmin,
  IconStar,
  IconTryOut,
  IconX,
} from '@/styles/icon';
import { Lock, Trophy } from 'lucide-react';
import { ResultDataProps } from '..';
import ButtonUpgradeTryout from '../../../../_components/ui/button-upgrade-tryout';

interface RingkasanTabProps {
  ResultData: ResultDataProps;
  unlockTryout: boolean;
}

export function RingkasanTab({ ResultData, unlockTryout }: RingkasanTabProps) {
  const userScore = ResultData?.userScore || 0;
  // const userScore = 750;
  const totalParticipants = ResultData?.totalParticipants || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-[3rem]">
        {/* {userChoices.map(choice => renderAnalysis(choice))} */}

        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Analisis Pilihan</h1>
          <div className="grid grid-cols-1 gap-4 pt-0 md:grid-cols-3">
            <Card
              id="skor_snbt"
              className="flex flex-col justify-between rounded-[.8rem] border-none bg-blue-100 shadow-none"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold">Skor</CardTitle>
                <IconStar
                  active
                  className="text-blue-600"
                  w={20}
                />
              </CardHeader>
              <CardContent className="flex flex-col gap-[.5rem] pb-0">
                <div className="text-2xl font-bold">{userScore.toFixed(2)}</div>
                {/* <Progress
                  value={(userScore / 1000) * 100}
                  className="mb-2 h-1"
                  classNameThumb="bg-blue-400"
                /> */}
              </CardContent>
              <CardFooter className="pt-2 text-xs font-medium text-main-gray-text">
                Rata rata skor
              </CardFooter>
            </Card>
            <Card
              id="ranking"
              className="flex flex-col rounded-[.8rem] border-none bg-green-100 shadow-none relative"
            >
              <UpgareLayer unlockTryout={unlockTryout} />
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
              <CardContent className="mt-[.5rem] grid grid-cols-2">
                <div className="flex flex-col">
                  <div className="flex flex-col gap-[.5rem] pb-0">
                    <div className="text-2xl font-bold">
                      {unlockTryout
                        ? ResultData?.choiceAnalisis.rankingTryout
                        : '...'}
                    </div>
                  </div>
                  <div className="pt-2 text-xs font-medium text-main-gray-text">
                    Dari {unlockTryout ? totalParticipants : '...'} peserta
                  </div>
                </div>
                <div className="ml-[-1rem] flex flex-col border-l-2 border-green-400 pl-[1rem]">
                  <div className="flex flex-col gap-[.5rem] pb-0">
                    <div className="text-2xl font-bold">
                      Top{' '}
                      {unlockTryout
                        ? ResultData?.choiceAnalisis.tryoutPersentage
                        : '...'}
                      %
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
              className="flex flex-col rounded-[.8rem] border-none bg-yellow-50 shadow-none relative"
            >
              <UpgareLayer unlockTryout={unlockTryout} />
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
              <CardContent className="mt-[.5rem] grid grid-cols-2">
                <div className="flex flex-col">
                  <div className="flex flex-col gap-[.5rem] pb-0">
                    <div className="text-2xl font-bold">
                      {unlockTryout
                        ? ResultData?.choiceAnalisis.rankingUniv
                        : '...'}
                    </div>
                  </div>
                  <div className="pt-2 text-xs font-medium text-main-gray-text">
                    Estimasi Universitas
                  </div>
                </div>
                <div className="ml-[-1rem] flex flex-col border-l-2 border-yellow-400 pl-[1rem]">
                  <div className="flex flex-col gap-[.5rem] pb-0">
                    <div className="text-2xl font-bold">
                      {unlockTryout
                        ? ResultData?.choiceAnalisis.rankingMajor
                        : '...'}
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
      </div>

      {ResultData?.summaryTryout.Result?.map((category, index) => (
        <div
          key={index}
          className="mb-[1rem] flex flex-col gap-2"
        >
          <h1 className="text-2xl font-semibold">{category.category}</h1>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {category.data.map((subject) => (
              <Card
                key={subject.id}
                className="flex flex-col gap-4 rounded-[.6rem] border-none p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    <IconDocumentAdmin
                      className="text-green-600"
                      active
                      w={20}
                    />
                    <h1>{subject.title}</h1>
                  </div>
                  <div className="text-lg font-bold">
                    {subject.score.toFixed(2)}
                  </div>
                </div>
                <Progress
                  value={
                    (subject.correctAnswers / subject.totalQuestions) * 100
                  }
                  className="h-1"
                />
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs font-medium text-main-gray-text md:text-sm">
                      {/* <CheckCircle className="h-4 w-4 text-green-600" /> */}
                      <IconCheckList
                        w={16}
                        className="text-green-600"
                      />
                      <span>
                        {subject.correctAnswers}/{subject.totalQuestions} Benar
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-main-gray-text md:text-sm">
                      {/* <XCircle className="h-4 w-4 text-red-500" /> */}
                      <IconX
                        w={16}
                        className="text-red-500"
                      />
                      <span>
                        {subject.wrongAnswers}/{subject.totalQuestions} Salah
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <Trophy className="h-4 w-4 text-yellow-400" />
                    {unlockTryout ? (
                      <span>
                        Peringkat: {subject.ranking} dari{' '}
                        {subject.totalParticipants}
                      </span>
                    ) : (
                      <span>
                        Peringkat:{' '}
                        <ButtonUpgradeTryout>
                          <span className="text-yellow-500 underline cursor-pointer">
                            Unlock this
                          </span>
                        </ButtonUpgradeTryout>
                      </span>
                    )}
                    {/* <Button
                      onClick={() =>
                        alert(`Review soal untuk ${subject.title}`)
                      }
                      className="ml-2 h-8 px-2 py-0 text-xs"
                      variant="outline"
                    >
                      Review Soal
                    </Button> */}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default RingkasanTab;

const UpgareLayer = ({ unlockTryout }: { unlockTryout: boolean }) => {
  if (unlockTryout) return null;
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 rounded-xl bg-white/40 flex justify-end items-end pt-4 pr-4">
      <ButtonUpgradeTryout>
        <Button className="text-xs px-4 h-[unset] flex justify-center items-center gap-2 bg-yellow-400 hover:bg-yellow-300">
          <p>Unlock</p>
          <Lock className="w-3 h-3" />
        </Button>
      </ButtonUpgradeTryout>
    </div>
  );
};
