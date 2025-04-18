import profileImage from '@/_assest/default-profile/male.png';
import ButtonPayment from '@/app/(user)/user/_components/button-payment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconCrown, IconTabsQuiz, IconTryOut } from '@/styles/icon';

import { cn, getDateString, getHours, imageProfile } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { SetStateAction, useEffect, useState } from 'react';

const Leaderboard = () => {
  const { data: session } = useSession();

  const [profile, setProfile] = useState<string>('');
  const [tryoutId, setTryoutId] = useState<string>('');
  const [isShowResult, setIsShowResult] = useState<boolean>(false);

  const { data: tryoutList } = api.leaderboard.getTryoutList.useQuery(
    undefined,
    { refetchOnWindowFocus: false },
  );

  const { data: quizTopFive, isLoading: isLoadingQuizTopFive } =
    api.leaderboard.getTopFiveQuiz.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const { data: tryoutTopFive, isLoading: isLoadingTryoutTopFive } =
    api.leaderboard.getTopFiveTryout.useQuery(
      { tryoutId: tryoutId },
      { refetchOnWindowFocus: false },
    );
  ('cm0eqcgyl0002byyne2dia002');

  // const { mutateAsync: programAddTryoutResult } = api.tryout.programAddTryoutResult.useMutation()

  useEffect(() => {
    if (imageProfile !== 'null' && imageProfile) setProfile(imageProfile);
  }, []);

  useEffect(() => {
    if (
      !isLoadingTryoutTopFive &&
      tryoutTopFive &&
      tryoutTopFive.length > 0 &&
      tryoutTopFive[0].Tryout.resultDate
    ) {
      const resultDate = new Date(tryoutTopFive[0].Tryout.resultDate);
      const currentDate = new Date();
      if (currentDate > resultDate) setIsShowResult(true);
    }
  }, [tryoutTopFive]);

  useEffect(() => {
    if (tryoutId === '' && tryoutList && tryoutList?.length > 0) {
      setTryoutId(tryoutList[0].id);
    }
  }, [tryoutList]);

  console.log('tryoutList', tryoutList);

  return (
    <div
      id="leaderboard"
      className="container mx-auto w-full max-w-[unset] p-4"
    >
      <Tabs
        defaultValue="semua"
        className="w-full bg-transparent"
      >
        <TabsList className="mb-[3rem] grid w-full max-w-[500px] grid-cols-5 bg-transparent">
          <TabsTrigger
            value="semua"
            className="rounded-[.5rem] py-[.8rem] text-sm data-[state=active]:bg-main data-[state=active]:text-white"
          >
            Semua
          </TabsTrigger>
          <TabsTrigger
            value="quiz"
            className="rounded-[.5rem] py-[.8rem] text-sm data-[state=active]:bg-main data-[state=active]:text-white"
          >
            Quiz
          </TabsTrigger>
          <TabsTrigger
            value="tryout"
            className="rounded-[.5rem] py-[.8rem] text-sm data-[state=active]:bg-main data-[state=active]:text-white"
          >
            Try Out
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="semua"
          className="space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="w-full overflow-hidden rounded-[1rem] border shadow-sm">
              <div className="flex w-full items-center justify-center gap-[1rem] bg-main p-[1rem] text-[1.5rem] font-medium text-white">
                <IconTabsQuiz w={42} />
                <p>Quiz</p>
              </div>
              <div
                id="table"
                className="w-full overflow-x-auto"
              >
                <table className="w-full">
                  <tbody>
                    {isLoadingQuizTopFive &&
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr
                          key={i}
                          id="loading"
                        >
                          <td
                            className={cn(
                              'bg-transparent p-[1rem] text-transparent',
                              i % 2 !== 0 && 'bg-workspace',
                              i === 0 && 'font-semibold',
                            )}
                            width="3%"
                          >
                            #{i + 1}
                          </td>
                          <td
                            className={cn(
                              'bg-transparent p-[1rem] text-transparent',
                              i % 2 !== 0 && 'bg-workspace',
                            )}
                          >
                            <div className="flex items-center gap-[.5rem]">
                              <div className="relative">
                                <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                                  <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                {i === 0 && (
                                  <IconCrown className="absolute left-[-.5rem] top-[-.5rem] -rotate-45 text-main-yellow" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  'text-transparent',
                                  i === 0 && 'font-semibold',
                                )}
                              >
                                Ruhulk Azom Pratama
                              </span>
                            </div>
                          </td>
                          <td
                            className={cn(
                              'bg-transparent p-[1rem] text-transparent',
                              i % 2 !== 0 && 'bg-workspace',
                              i === 0 && 'font-semibold',
                            )}
                          >
                            ...%
                          </td>
                        </tr>
                      ))}
                    {!isLoadingQuizTopFive &&
                      quizTopFive?.map((item, i) => (
                        <tr key={i}>
                          <td
                            className={cn(
                              'bg-white p-[1rem]',
                              i % 2 !== 0 && 'bg-workspace',
                              i === 0 && 'font-semibold',
                            )}
                            width="3%"
                          >
                            #{i + 1}
                          </td>
                          <td
                            className={cn(
                              'bg-white p-[1rem]',
                              i % 2 !== 0 && 'bg-workspace',
                            )}
                          >
                            <div className="flex items-center gap-[.5rem]">
                              <div className="relative">
                                <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt="user"
                                      layout="responsive"
                                      width={500}
                                      height={300}
                                    />
                                  ) : (
                                    <Image
                                      src={profileImage}
                                      alt="user"
                                    />
                                  )}
                                  <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                {i === 0 && (
                                  <IconCrown className="absolute left-[-.5rem] top-[-.5rem] -rotate-45 text-main-yellow" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  'text-black',
                                  i === 0 && 'font-semibold',
                                )}
                              >
                                {item.username}
                              </span>
                            </div>
                          </td>
                          <td
                            className={cn(
                              'whitespace-nowrap bg-white p-[1rem] text-center',
                              i % 2 !== 0 && 'bg-workspace',
                              i === 0 && 'font-semibold',
                            )}
                          >
                            {item.accuracy.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    {session?.user.role !== 'PREMIUM' &&
                      session?.user.role !== 'ADMIN' && (
                        <>
                          <tr>
                            <td
                              className={cn('bg-workspace p-[1rem]')}
                              width="3%"
                            >
                              ....
                            </td>
                            <td className={cn('bg-workspace p-[1rem]')}>
                              ....
                            </td>
                            <td
                              className={cn(
                                'bg-workspace p-[1rem] text-center',
                              )}
                            >
                              ....
                            </td>
                          </tr>
                          <tr>
                            <td
                              className={cn('bg-white p-[1rem]')}
                              width="3%"
                            >
                              ??
                            </td>
                            <td className={cn('bg-white p-[1rem]')}>
                              <div className="flex items-center gap-[.5rem]">
                                <div className="relative">
                                  <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                                    {profile !== '' ? (
                                      <AvatarImage
                                        src={`${profile}?height=32&width=32`}
                                        alt="User"
                                      />
                                    ) : (
                                      <Image
                                        src={profileImage}
                                        alt="user"
                                      />
                                    )}
                                    <AvatarFallback>U</AvatarFallback>
                                  </Avatar>
                                </div>
                                <span className={cn('text-black')}>
                                  {session?.user.name}
                                </span>
                              </div>
                            </td>
                            <td className={cn('bg-white px-[1rem]')}>
                              <ButtonPayment className="flex w-full min-w-[150px] justify-center px-0" />
                            </td>
                          </tr>
                        </>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="relative h-[200px] w-full overflow-hidden rounded-[1rem] border shadow-sm md:h-[unset]">
              <div className="relative flex w-full items-center gap-[1rem] bg-main p-[1rem] pl-[2rem] text-[1.5rem] font-medium text-white md:justify-center md:pl-0">
                <div className="absolute right-4 top-4 z-[99]">
                  <Select
                    value={tryoutId}
                    onValueChange={(value) => value && setTryoutId(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tryout" />
                    </SelectTrigger>
                    <SelectContent>
                      {tryoutList?.map((tryout, i) => (
                        <SelectItem
                          key={i}
                          value={`${tryout.id}`}
                        >
                          {tryout.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <IconTryOut
                  active
                  w={42}
                />
                <p>Try Out</p>
              </div>
              {isLoadingTryoutTopFive && (
                <table className="w-full">
                  <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <tr
                        key={i}
                        id="loading"
                      >
                        <td
                          className={cn(
                            'bg-transparent p-[1rem] text-transparent',
                            i % 2 !== 0 && 'bg-workspace',
                            i === 0 && 'font-semibold',
                          )}
                          width="3%"
                        >
                          #{i + 1}
                        </td>
                        <td
                          className={cn(
                            'bg-transparent p-[1rem] text-transparent',
                            i % 2 !== 0 && 'bg-workspace',
                          )}
                        >
                          <div className="flex items-center gap-[.5rem]">
                            <div className="relative">
                              <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              {i === 0 && (
                                <IconCrown className="absolute left-[-.5rem] top-[-.5rem] -rotate-45 text-main-yellow" />
                              )}
                            </div>
                            <span
                              className={cn(
                                'text-transparent',
                                i === 0 && 'font-semibold',
                              )}
                            >
                              Ruhulk Azom Pratama
                            </span>
                          </div>
                        </td>
                        <td
                          className={cn(
                            'bg-transparent p-[1rem] text-transparent',
                            i % 2 !== 0 && 'bg-workspace',
                            i === 0 && 'font-semibold',
                          )}
                        >
                          ...%
                        </td>
                        <td
                          className={cn(
                            'bg-transparent p-[1rem] text-transparent',
                            i % 2 !== 0 && 'bg-workspace',
                            i === 0 && 'font-semibold',
                          )}
                        >
                          ...%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {isShowResult ? (
                <div
                  id="table"
                  className="w-full overflow-x-auto"
                >
                  <table className="w-full">
                    <tbody>
                      {!isLoadingTryoutTopFive &&
                        tryoutTopFive?.map((item, i) => (
                          <tr key={i}>
                            <td
                              className={cn(
                                'bg-white p-[1rem]',
                                i % 2 !== 0 && 'bg-workspace',
                                i === 0 && 'font-semibold',
                              )}
                              width="3%"
                            >
                              #{i + 1}
                            </td>
                            <td
                              className={cn(
                                'bg-white p-[1rem]',
                                i % 2 !== 0 && 'bg-workspace',
                              )}
                            >
                              <div className="flex items-center gap-[.5rem]">
                                <div className="relative">
                                  <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                                    {item.User.image ? (
                                      <Image
                                        src={item.User.image}
                                        alt="user"
                                        layout="responsive"
                                        width={500}
                                        height={300}
                                      />
                                    ) : (
                                      <Image
                                        src={profileImage}
                                        alt="user"
                                      />
                                    )}
                                    <AvatarFallback>U</AvatarFallback>
                                  </Avatar>
                                  {i === 0 && (
                                    <IconCrown className="absolute left-[-.5rem] top-[-.5rem] -rotate-45 text-main-yellow" />
                                  )}
                                </div>
                                <span
                                  className={cn(
                                    'text-black',
                                    i === 0 && 'font-semibold',
                                  )}
                                >
                                  {item.User.name}
                                </span>
                              </div>
                            </td>
                            {item.TryoutSessionResult.map((session, index) => (
                              <td
                                key={index}
                                className={cn(
                                  'whitespace-nowrap bg-white p-[1rem] text-center text-[.8rem]',
                                  i % 2 !== 0 && 'bg-workspace',
                                  i === 0 && 'font-semibold',
                                )}
                              >
                                {session.TryoutCategory.name} (
                                {session.totalScore} Poin)
                              </td>
                            ))}
                            <td
                              className={cn(
                                'whitespace-nowrap bg-white p-[1rem] text-center text-[.8rem]',
                                i % 2 !== 0 && 'bg-workspace',
                                i === 0 && 'font-semibold',
                              )}
                            >
                              Total ({item.totalScore} Poin)
                            </td>
                          </tr>
                        ))}
                      {session?.user.role !== 'PREMIUM' &&
                        session?.user.role !== 'ADMIN' && (
                          <>
                            <tr>
                              <td
                                className={cn('bg-workspace p-[1rem]')}
                                width="3%"
                              >
                                ....
                              </td>
                              <td className={cn('bg-workspace p-[1rem]')}>
                                ....
                              </td>
                              {Array.from({
                                length:
                                  tryoutTopFive && tryoutTopFive.length > 0
                                    ? tryoutTopFive[0].TryoutSessionResult
                                        .length
                                    : 1,
                              }).map((_, i) => (
                                <td
                                  key={i}
                                  className={cn(
                                    'bg-workspace p-[1rem] text-center',
                                  )}
                                >
                                  ....
                                </td>
                              ))}
                              <td
                                className={cn(
                                  'bg-workspace p-[1rem] text-center',
                                )}
                              >
                                ....
                              </td>
                            </tr>
                            <tr>
                              <td
                                className={cn('bg-white p-[1rem]')}
                                width="3%"
                              >
                                ??
                              </td>
                              <td className={cn('bg-white p-[1rem]')}>
                                <div className="flex items-center gap-[.5rem]">
                                  <div className="relative">
                                    <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                                      {profile !== '' ? (
                                        <AvatarImage
                                          src={`${profile}?height=32&width=32`}
                                          alt="User"
                                        />
                                      ) : (
                                        <Image
                                          src={profileImage}
                                          alt="user"
                                        />
                                      )}
                                      <AvatarFallback>U</AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <span className={cn('text-black')}>
                                    {session?.user.name}
                                  </span>
                                </div>
                              </td>
                              {Array.from({
                                length:
                                  tryoutTopFive && tryoutTopFive.length > 0
                                    ? tryoutTopFive[0].TryoutSessionResult
                                        .length
                                    : 1,
                              }).map((_, i) => (
                                <td
                                  key={i}
                                  className={cn(
                                    'bg-white p-[1rem] text-center',
                                  )}
                                >
                                  ....
                                </td>
                              ))}
                              <td className={cn('bg-white px-[1rem]')}>
                                <ButtonPayment className="flex w-full min-w-[150px] justify-center px-0" />
                              </td>
                            </tr>
                          </>
                        )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="absolute left-0 top-[74px] mt-[-74px] flex h-full w-full items-center justify-center pt-[80px] text-center md:pt-[74px]">
                  {!isLoadingTryoutTopFive &&
                    tryoutTopFive &&
                    tryoutTopFive.length > 0 &&
                    tryoutTopFive[0].Tryout && (
                      <>
                        Hasil dapat dilihat pada: <br />
                        {getDateString(tryoutTopFive[0].Tryout.resultDate)}{' '}
                        {getHours(tryoutTopFive[0].Tryout.resultDate)} WIB
                      </>
                    )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent
          value="quiz"
          className="space-y-4"
        >
          <QuizRanking profile={profile} />
        </TabsContent>
        <TabsContent
          value="tryout"
          className="space-y-4"
        >
          <TryoutRanking
            profile={profile}
            tryoutId={tryoutId}
            setTryoutId={setTryoutId}
            tryoutList={tryoutList}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const QuizRanking = ({ profile }: { profile: string }) => {
  const { data: session } = useSession();

  const { data: quiz, isLoading: isLoadingQuiz } =
    api.leaderboard.getQuiz.useQuery(undefined, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="w-full overflow-hidden rounded-[1rem] border shadow-sm">
        <div className="flex w-full items-center justify-center gap-[1rem] bg-main p-[1rem] text-[1.5rem] font-medium text-white">
          <IconTabsQuiz w={42} />
          <p>Quiz</p>
        </div>
        <div
          id="table"
          className="w-full overflow-x-auto"
        >
          <table className="w-full">
            <tbody>
              {isLoadingQuiz &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr
                    key={i}
                    id="loading"
                  >
                    <td
                      className={cn(
                        'bg-transparent p-[1rem] text-transparent',
                        i % 2 !== 0 && 'bg-workspace',
                        i === 0 && 'font-semibold',
                      )}
                      width="3%"
                    >
                      #{i + 1}
                    </td>
                    <td
                      className={cn(
                        'bg-transparent p-[1rem] text-transparent',
                        i % 2 !== 0 && 'bg-workspace',
                      )}
                    >
                      <div className="flex items-center gap-[.5rem]">
                        <div className="relative">
                          <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                            {/* <AvatarImage src={`${item.image}?height=32&width=32`} alt="User" /> */}
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          {i === 0 && (
                            <IconCrown className="absolute left-[-.5rem] top-[-.5rem] -rotate-45 text-main-yellow" />
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-transparent',
                            i === 0 && 'font-semibold',
                          )}
                        >
                          Ruhulk Azom Pratama
                        </span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        'bg-transparent p-[1rem] text-transparent',
                        i % 2 !== 0 && 'bg-workspace',
                        i === 0 && 'font-semibold',
                      )}
                    >
                      ...%
                    </td>
                  </tr>
                ))}
              {!isLoadingQuiz &&
                quiz?.map((item, i) => (
                  <tr key={i}>
                    <td
                      className={cn(
                        'bg-white p-[1rem]',
                        i % 2 !== 0 && 'bg-workspace',
                        i === 0 && 'font-semibold',
                      )}
                      width="3%"
                    >
                      #{i + 1}
                    </td>
                    <td
                      className={cn(
                        'bg-white p-[1rem]',
                        i % 2 !== 0 && 'bg-workspace',
                      )}
                    >
                      <div className="flex items-center gap-[.5rem]">
                        <div className="relative">
                          <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                            {/* <AvatarImage src={`${profile}?height=32&width=32`} alt="User" /> */}
                            {item.image ? (
                              // <AvatarImage src={`${item.image}?height=32&width=32`} alt="User" />
                              <Image
                                src={item.image}
                                alt="user"
                                layout="responsive"
                                width={500}
                                height={300}
                              />
                            ) : (
                              <Image
                                src={profileImage}
                                alt="user"
                              />
                            )}
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          {i === 0 && (
                            <IconCrown className="absolute left-[-.5rem] top-[-.5rem] -rotate-45 text-main-yellow" />
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-black',
                            i === 0 && 'font-semibold',
                          )}
                        >
                          {item.username}
                        </span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        'min-w-[150px] whitespace-nowrap bg-white p-[1rem] text-center',
                        i % 2 !== 0 && 'bg-workspace',
                        i === 0 && 'font-semibold',
                      )}
                    >
                      {item.accuracy.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              {session?.user.role !== 'PREMIUM' &&
                session?.user.role !== 'ADMIN' && (
                  <>
                    <tr>
                      <td
                        className={cn('bg-workspace p-[1rem]')}
                        width="3%"
                      >
                        ....
                      </td>
                      <td className={cn('bg-workspace p-[1rem]')}>....</td>
                      <td className={cn('bg-workspace p-[1rem] text-center')}>
                        ....
                      </td>
                    </tr>
                    <tr>
                      <td
                        className={cn('bg-white p-[1rem]')}
                        width="3%"
                      >
                        ??
                      </td>
                      <td className={cn('bg-white p-[1rem]')}>
                        <div className="flex items-center gap-[.5rem]">
                          <div className="relative">
                            <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                              {profile !== '' ? (
                                <AvatarImage
                                  src={`${profile}?height=32&width=32`}
                                  alt="User"
                                />
                              ) : (
                                <Image
                                  src={profileImage}
                                  alt="user"
                                />
                              )}
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                          </div>
                          <span className={cn('text-black')}>
                            {session?.user.name}
                          </span>
                        </div>
                      </td>
                      <td className={cn('bg-white px-[1rem]')}>
                        <ButtonPayment className="flex w-full justify-center px-0" />
                      </td>
                    </tr>
                  </>
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const TryoutRanking = ({
  profile,
  tryoutId,
  setTryoutId,
  tryoutList,
}: {
  profile: string;
  tryoutId: string;
  setTryoutId: React.Dispatch<SetStateAction<string>>;
  tryoutList:
    | {
        id: string;
        title: string;
      }[]
    | undefined;
}) => {
  const { data: session } = useSession();
  const [isShowResult, setIsShowResult] = useState<boolean>(false);

  const { data: tryout, isLoading: isLoadingTryout } =
    api.leaderboard.getTryout.useQuery(
      { tryoutId: tryoutId },
      { refetchOnWindowFocus: false },
    );

  console.log(tryout, tryout);

  useEffect(() => {
    if (
      !isLoadingTryout &&
      tryout &&
      tryout.length > 0 &&
      tryout[0].Tryout.resultDate
    ) {
      const resultDate = new Date(tryout[0].Tryout.resultDate);
      const currentDate = new Date();
      if (currentDate > resultDate) setIsShowResult(true);
    }
  }, [tryout]);

  return (
    <div className="grid grid-cols-1 gap-4">
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-[1rem] border shadow-sm',
          !isLoadingTryout && !isShowResult && 'min-h-[500px]',
        )}
      >
        <div className="relative flex w-full items-center gap-[1rem] bg-main p-[1rem] pl-[2rem] text-[1.5rem] font-medium text-white md:justify-center md:pl-0">
          <div className="absolute right-4 top-4">
            <Select
              value={tryoutId}
              onValueChange={(value) => value && setTryoutId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tryout" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value='placeholder'>Tryout</SelectItem> */}
                {tryoutList?.map((tryout, i) => (
                  <SelectItem
                    key={i}
                    value={`${tryout.id}`}
                  >
                    {tryout.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <IconTryOut
            active
            w={42}
          />
          <p>Try Out</p>
        </div>
        {isLoadingTryout && (
          <table className="w-full">
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr
                  key={i}
                  id="loading"
                >
                  <td
                    className={cn(
                      'bg-transparent p-[1rem] text-transparent',
                      i % 2 !== 0 && 'bg-workspace',
                      i === 0 && 'font-semibold',
                    )}
                    width="3%"
                  >
                    #{i + 1}
                  </td>
                  <td
                    className={cn(
                      'bg-transparent p-[1rem] text-transparent',
                      i % 2 !== 0 && 'bg-workspace',
                    )}
                  >
                    <div className="flex items-center gap-[.5rem]">
                      <div className="relative">
                        <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                          {/* <AvatarImage src={`${item.image}?height=32&width=32`} alt="User" /> */}
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        {i === 0 && (
                          <IconCrown className="absolute left-[-.5rem] top-[-.5rem] -rotate-45 text-main-yellow" />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-transparent',
                          i === 0 && 'font-semibold',
                        )}
                      >
                        Ruhulk Azom Pratama
                      </span>
                    </div>
                  </td>
                  <td
                    className={cn(
                      'bg-transparent p-[1rem] text-transparent',
                      i % 2 !== 0 && 'bg-workspace',
                      i === 0 && 'font-semibold',
                    )}
                  >
                    ...%
                  </td>
                  <td
                    className={cn(
                      'bg-transparent p-[1rem] text-transparent',
                      i % 2 !== 0 && 'bg-workspace',
                      i === 0 && 'font-semibold',
                    )}
                  >
                    ...%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isShowResult ? (
          <div
            id="table"
            className="w-full overflow-x-auto"
          >
            <table className="w-full">
              <tbody>
                {!isLoadingTryout &&
                  tryout?.map((item, i) => (
                    <tr key={i}>
                      <td
                        className={cn(
                          'bg-white p-[1rem]',
                          i % 2 !== 0 && 'bg-workspace',
                          i === 0 && 'font-semibold',
                        )}
                        width="3%"
                      >
                        #{i + 1}
                      </td>
                      <td
                        className={cn(
                          'bg-white p-[1rem]',
                          i % 2 !== 0 && 'bg-workspace',
                        )}
                      >
                        <div className="flex items-center gap-[.5rem]">
                          <div className="relative">
                            <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                              {item.User.image ? (
                                // <AvatarImage src={`${item.user.image}?height=32&width=32`} alt="User" />
                                <Image
                                  src={item.User.image}
                                  alt="user"
                                  layout="responsive"
                                  width={500}
                                  height={300}
                                />
                              ) : (
                                <Image
                                  src={profileImage}
                                  alt="user"
                                />
                              )}
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            {i === 0 && (
                              <IconCrown className="absolute left-[-.5rem] top-[-.5rem] -rotate-45 text-main-yellow" />
                            )}
                          </div>
                          <span
                            className={cn(
                              'text-black',
                              i === 0 && 'font-semibold',
                            )}
                          >
                            {item.User.name}
                          </span>
                        </div>
                      </td>
                      {item.TryoutSessionResult.map((session, index) => (
                        <td
                          key={index}
                          className={cn(
                            'whitespace-nowrap bg-white p-[1rem] text-center',
                            i % 2 !== 0 && 'bg-workspace',
                            i === 0 && 'font-semibold',
                          )}
                        >
                          {session.TryoutCategory.name} ({session.totalScore}{' '}
                          Poin)
                        </td>
                      ))}
                      <td
                        className={cn(
                          'whitespace-nowrap bg-white p-[1rem] text-center',
                          i % 2 !== 0 && 'bg-workspace',
                          i === 0 && 'font-semibold',
                        )}
                      >
                        Total ({item.totalScore} Poin)
                      </td>
                    </tr>
                  ))}
                {session?.user.role !== 'PREMIUM' &&
                  session?.user.role !== 'ADMIN' && (
                    <>
                      <tr>
                        <td
                          className={cn('bg-workspace p-[1rem]')}
                          width="3%"
                        >
                          ....
                        </td>
                        <td className={cn('bg-workspace p-[1rem]')}>....</td>
                        {Array.from({
                          length:
                            tryout && tryout.length > 0
                              ? tryout[0].TryoutSessionResult.length
                              : 1,
                        }).map((_, i) => (
                          <td
                            key={i}
                            className={cn('bg-workspace p-[1rem] text-center')}
                          >
                            ....
                          </td>
                        ))}
                        <td className={cn('bg-workspace p-[1rem] text-center')}>
                          ....
                        </td>
                      </tr>
                      <tr>
                        <td
                          className={cn('bg-white p-[1rem]')}
                          width="3%"
                        >
                          ??
                        </td>
                        <td className={cn('bg-white p-[1rem]')}>
                          <div className="flex items-center gap-[.5rem]">
                            <div className="relative">
                              <Avatar className="h-8 w-8 border-2 border-main-gray-input">
                                {profile !== '' ? (
                                  <AvatarImage
                                    src={`${profile}?height=32&width=32`}
                                    alt="User"
                                  />
                                ) : (
                                  <Image
                                    src={profileImage}
                                    alt="user"
                                  />
                                )}
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                            </div>
                            <span className={cn('text-black')}>
                              {session?.user.name}
                            </span>
                          </div>
                        </td>
                        {Array.from({
                          length:
                            tryout && tryout.length > 0
                              ? tryout[0].TryoutSessionResult.length
                              : 1,
                        }).map((_, i) => (
                          <td
                            key={i}
                            className={cn('bg-white p-[1rem] text-center')}
                          >
                            ....
                          </td>
                        ))}
                        <td className={cn('bg-white px-[1rem]')}>
                          <ButtonPayment className="flex w-full min-w-[150px] justify-center px-0" />
                        </td>
                      </tr>
                    </>
                  )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="absolute left-0 top-[74px] flex h-full w-full items-center justify-center text-center">
            {!isLoadingTryout &&
              tryout &&
              tryout.length > 0 &&
              tryout[0].Tryout && (
                <>
                  Hasil dapat dilihat pada: <br />
                  {getDateString(tryout[0].Tryout.resultDate)}{' '}
                  {getHours(tryout[0].Tryout.resultDate)} WIB
                </>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
