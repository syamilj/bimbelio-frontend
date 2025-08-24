import { SpinnerPage } from '@/components/ui/spinner';
import { useGet } from '@/lib/fetch-helper/useGet';
import { IconAward, IconCircleLoop, IconTimer } from '@/styles/icon';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Result({ setAccuracy }: { setAccuracy: any }) {
  const pathname = usePathname();
  const pathnameArray = pathname?.split('/');
  const documentId = `${pathnameArray && pathnameArray[pathnameArray?.length - 1]}`;

  // const {
  //   data: quiz,
  //   isLoading,
  //   // isError,
  // } = api.quiz.getQuizResult.useQuery(
  //   { documentId },
  //   { refetchOnWindowFocus: false },
  // );

  const { data: quiz, isLoading } = useGet(`/quiz/getQuizResult`, {
    params: { documentId },
    useEffectDependencies: [documentId],
  });

  let data = [];
  useEffect(() => {
    if (quiz && quiz.accuracy) {
      setAccuracy(quiz?.accuracy);
    }
  }, [quiz]);

  if (isLoading) {
    return <SpinnerPage />;
  }
  if (quiz) {
    data = quiz.data;
  }

  return (
    <div className="flex flex-col gap-[1rem] overflow-y-auto px-[1rem] pb-[2rem] pt-[1rem]">
      <h1 className="font-regular w-full text-center text-[2.5rem]">
        Hasil Akhir
      </h1>
      <div className="flex flex-col items-center gap-[1rem] rounded-[1rem] bg-flascardResult py-[1rem]">
        <IconAward
          w={60}
          className="text-main"
        />
        <p className="font-medium">{quiz?.accuracy.toFixed(2)}% akurasi</p>
      </div>
      <div className="grid grid-cols-2 gap-[1rem]">
        <div className="flex gap-[.5rem] rounded-[1rem] bg-flascardResult p-[1rem]">
          <div className="">
            <IconCircleLoop className="mt-[.1rem] text-main" />
          </div>
          <div className="flex w-full flex-col">
            <h1 className="font-medium">Jawaban Benar</h1>
            <p className="font-regular text-[.9rem] text-main-gray-text">
              {quiz?.totalCorrect}/{quiz?.data.length} soal
            </p>
          </div>
        </div>
        <div className="flex gap-[.5rem] rounded-[1rem] bg-flascardResult p-[1rem]">
          <div className="">
            <IconTimer className="mt-[.1rem] text-main" />
          </div>
          <div className="flex w-full flex-col">
            <h1 className="font-medium">Waktu pengerjaaan</h1>
            <p className="font-regular text-[.9rem] text-main-gray-text">
              Cooming soon
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[] flex flex-col rounded-[1rem]">
        {data.map((item: any, i: number) => (
          <div
            key={i}
            className="grid w-full grid-cols-2 gap-[.8rem] border-b border-main-gray-input bg-flascardResult p-[1rem]"
          >
            <div className="flex flex-col justify-between gap-[.5rem]">
              <h1 className="text-[1.1rem] font-medium">Soal Nomor {i + 1}</h1>
              <p className="text-[.9rem] text-main-gray-text">
                {item.question}
              </p>
              <h1 className="text-[.9rem] font-semibold">
                Jawaban: <br /> {item.answer}
              </h1>
            </div>
            <div className="flex flex-col justify-between gap-[.5rem]">
              <h1 className="text-[1.1rem] font-medium">Jawabanmu</h1>
              <div className="flex flex-col gap-[.5rem] text-[.9rem] text-black">
                <p>
                  {item.QuizAttempt.length > 0 &&
                    item.QuizAttempt[0].userResponse}
                </p>
                {item.correct == null ? (
                  <p className="font-semibold text-main-red">Belum Dijawab</p>
                ) : (
                  <>
                    {item.correct ? (
                      <p className="font-semibold text-blue-600">Benar</p>
                    ) : (
                      <p className="font-semibold text-main-red">Salah</p>
                    )}
                  </>
                )}
              </div>
              <div className=""></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
