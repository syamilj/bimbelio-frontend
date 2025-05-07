'use client';

import { useSession } from '@/components/provider/session-provider-auth';
import ReactMarkdown from '@/components/ui/react-markdown';
import { SpinnerPageCentered } from '@/components/ui/spinner';
import { mutateGeneral } from '@/lib/fetch-helper';
import { cn, replaceLatexNotation, TncTryout } from '@/lib/utils';
import 'katex/dist/katex.min.css';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TryoutDataType } from '../page';
import CountDownRestTime from './countdown-rest-time';
import Header from './header';

// interface SessionWithCategory extends TryoutSession {
//   TryoutCategory: TryoutCategory;
//   TryoutSessionParticipant: any;
// }

interface Props {
  sessionData: NonNullable<TryoutDataType>['TryoutSession'];
  tryoutName: string;
  restTime: number;
  currentIndexSession: number;
}

const RestTime = ({
  currentIndexSession,
  tryoutName,
  sessionData,
  restTime,
}: Props) => {
  const { data: session } = useSession();

  const [loading, setLoading] = useState<boolean>(false);

  // const { mutate: createTryoutSessionParticipant } =
  //   api.tryoutSession.createTryoutSessionParticipant.useMutation({
  //     onSuccess() {
  //       trpc.tryout.getTryoutById.refetch();
  //     },
  //     onError() {
  //       setLoading(false);
  //     },
  //   });
  const createTryoutSessionParticipant = async (payload: {
    sessionId: string;
    userId: string;
  }) => {
    await mutateGeneral('/tryoutSession/createTryoutSessionParticipant', {
      payload,
      type: 'post',
      // onSuccess: refresh,
      onSuccess() {
        //       trpc.tryout.getTryoutById.refetch();
        window.location.reload();
      },
      onError() {
        setLoading(false);
      },
    });
  };

  const [tnc, setTnc] = useState<string>('');

  useEffect(() => {
    if (sessionData) {
      const data = TncTryout.find(
        (item) =>
          item.category ===
          sessionData[currentIndexSession]?.TryoutCategory.name.toLowerCase(),
      );
      if (data) setTnc(data.value);
      else setTnc('.....');
    }
  }, [sessionData, currentIndexSession]);

  if (!sessionData || sessionData.length === 0 || tnc === '')
    return <SpinnerPageCentered />;

  const handleStart = () => {
    setLoading(true);
    createTryoutSessionParticipant({
      sessionId: sessionData[currentIndexSession].id,
      userId: session?.user.id || '',
    });
  };

  const getDuration = () => {
    const durationInSeconds = restTime * 60;
    const dateNow = new Date().getTime();
    const participant =
      sessionData[currentIndexSession - 1].TryoutSessionParticipant[0];
    const dateStart = participant.endSession
      ? new Date(participant.endSession).getTime()
      : new Date().getTime();

    const diffInMilliseconds = dateNow - dateStart;
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const currentDuration = durationInSeconds - diffInSeconds;
    return currentDuration < 0 ? 0 : currentDuration;
  };

  return (
    <>
      <Header
        current={0}
        total={-1}
        name={tryoutName}
      />
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-workspace pt-14 md:pt-4">
        <form
          className="flex h-full w-full flex-col justify-between gap-4 bg-white px-8 py-8 md:h-auto md:max-w-2xl md:justify-start md:rounded-3xl md:shadow-lg"
          onSubmit={(e) => {
            e.preventDefault();
            handleStart();
          }}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-xl font-medium">Waktu Istirahat</h1>
            <div className="flex w-full items-center justify-center font-medium text-blue-700">
              <div className="rounded-xl bg-workspace px-4 py-2">
                <CountDownRestTime
                  sessionId={
                    sessionData[currentIndexSession] &&
                    sessionData[currentIndexSession].id
                  }
                  seconds={getDuration()}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-workspace p-4">
                <p className="pb-4 text-main-gray-text">Ketentuan Tryout:</p>
                <div className="ml-2 font-medium">
                  <ReactMarkdown value={replaceLatexNotation(tnc)} />
                </div>
              </div>
              <div className="rounded-xl bg-workspace p-4">
                <p className="pb-4 text-main-gray-text">
                  Tryout ini terdiri dari:
                </p>
                <div className="ml-2 flex flex-col text-sm font-medium">
                  {sessionData?.map((item, i: number) => (
                    <div key={i}>
                      <div className="flex items-center justify-between bg-white px-4 py-1">
                        <p
                          className={cn(
                            i < currentIndexSession &&
                              'text-main-gray-text line-through',
                          )}
                        >
                          {item.TryoutCategory.name}
                        </p>
                        <p className="text-sm text-main-gray-text">
                          {item.duration} menit
                        </p>
                      </div>
                      {i % 2 === 0 && sessionData.length > 1 && (
                        <div className="flex items-center justify-between bg-transparent px-4 py-1">
                          <p>Istirahat</p>
                          <p className="text-sm text-main-gray-text">
                            {restTime} menit
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={cn(
              'flex h-10 w-full items-center justify-center rounded-2xl bg-main text-white transition-colors duration-200 hover:bg-main/85',
              loading && 'cursor-default hover:bg-main/85',
            )}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span>Lanjut ke sesi berikutnya</span>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default RestTime;
