//src/pages/user/_components/SidebarRoute.tsx

'use client';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useAppContext } from '@/components/provider/provider-app';
import { Badge } from '@/components/ui/badge';
import ChooseWebCategory from '@/components/ui/choose-web-category';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import { IconHome, IconTryOut } from '@/styles/icon';
import { AlignEndHorizontal, BotIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMedia } from 'use-media';

const SidebarRoute = ({
  category,
  minimizeSidebar,
  setMinimizeSidebar,
}: any) => {
  const pathname = usePathname();

  const [showBahanAjar, setShowBahanAjar] = useState<boolean>(false);
  // const [showCourse, setShowCourse] = useState<boolean>(false);
  const { setSidebarMobile } = useAppContext();

  useEffect(() => {
    if (pathname?.includes('workspace')) {
      setShowBahanAjar(true);
    }
    // if (pathname?.includes('course')) {
    //   setShowCourse(true);
    // }
  }, []);
  const isMobile = useMedia({ maxWidth: '768px' });

  return (
    <div className="relative">
      <div
        id="navigasi"
        className="flex flex-col gap-[.5rem]"
      >
        <div className={cn('px-2 w-full', minimizeSidebar && 'hidden')}>
          <ChooseWebCategory />
        </div>
        <Link
          className="relative"
          href={`/${website_sub_category_id}/user/dashboard`}
          passHref
          onClick={() => {
            if (isMobile) {
              setSidebarMobile(false);
            }
          }}
        >
          <div
            className={`flex items-center gap-[.8rem] ${
              pathname?.includes('dashboard') && 'bg-main'
            } mx-[.5rem] cursor-pointer rounded-[1rem] px-[1rem] py-[1rem] font-semibold transition-all duration-500 ease-in-out md:rounded-[.5rem] md:py-[.8rem] ${
              minimizeSidebar && 'justify-center'
            } text-main-gray-text ${
              !pathname?.includes('dashboard') &&
              'md:hover:bg-main-gray-input md:hover:text-main-gray-text'
            } duration-300`}
          >
            <IconHome
              className={`${
                pathname?.includes('dashboard')
                  ? 'font-semibold text-white'
                  : ' '
              }`}
              active={pathname?.includes('dashboard') ? true : false}
            />
            {!minimizeSidebar && (
              <span
                className={`text-sm ${
                  pathname?.includes('dashboard')
                    ? 'font-medium text-white'
                    : 'font-medium'
                }`}
              >
                Dashboard
              </span>
            )}
          </div>
        </Link>
        {/* <div
          className="relative"
          // href={"/user/course"}
          // passHref
          onClick={() => {
            if (isMobile) {
              setSidebarMobile(false);
            }
          }}
        >
          <ComingSoonBadge minimizeSidebar={minimizeSidebar} />
          <div
            className={`flex items-center gap-[.8rem] ${
              pathname?.includes('course') && 'bg-main'
            } mx-[.5rem] cursor-pointer rounded-[1rem] px-[1rem] py-[1rem] font-semibold transition-all duration-500 ease-in-out md:rounded-[.5rem] md:py-[.8rem] ${
              minimizeSidebar && 'justify-center'
            } text-main-gray-text ${
              !pathname?.includes('course') &&
              'md:hover:bg-main-gray-input md:hover:text-main-gray-text'
            } duration-300`}
          >
            {}
            <IconCourse
              className={`${
                pathname?.includes('course') ? 'font-semibold text-white' : ' '
              }`}
              active={pathname?.includes('course') ? true : false}
            />
            {!minimizeSidebar && (
              <span
                className={`text-sm ${
                  pathname?.includes('course')
                    ? 'font-medium text-white'
                    : 'font-medium'
                }`}
              >
                Belajar
              </span>
            )}
          </div>
        </div>
        <div
          className="relative"
          // href={"/user/explore"}
          // passHref
          onClick={() => {
            if (isMobile) {
              setSidebarMobile(false);
            }
          }}
        >
          <ComingSoonBadge minimizeSidebar={minimizeSidebar} />
          <div
            className={`flex items-center gap-[.8rem] ${
              pathname?.includes('explore') && 'bg-main'
            } mx-[.5rem] cursor-pointer rounded-[1rem] px-[1rem] py-[1rem] font-semibold transition-all duration-500 ease-in-out md:rounded-[.5rem] md:py-[.8rem] ${
              minimizeSidebar && 'justify-center'
            } text-main-gray-text ${
              !pathname?.includes('explore') &&
              'md:hover:bg-main-gray-input md:hover:text-main-gray-text'
            } duration-300`}
          >
            {}
            <IconExplore
              className={`${
                pathname?.includes('explore') ? 'font-semibold text-white' : ' '
              }`}
              active={pathname?.includes('explore') ? true : false}
            />
            {!minimizeSidebar && (
              <span
                className={`text-sm ${
                  pathname?.includes('explore')
                    ? 'font-medium text-white'
                    : 'font-medium'
                }`}
              >
                Telusuri
              </span>
            )}
          </div>
        </div>
        <div className={`${minimizeSidebar && 'flex justify-center'} relative`}>
          <ComingSoonBadge minimizeSidebar={minimizeSidebar} />
          <div
            className={`mx-[.5rem] flex cursor-pointer items-center justify-between rounded-[1rem] px-[1rem] py-[1rem] font-semibold transition-all duration-500 ease-in-out md:rounded-[.5rem] md:py-[.8rem] ${
              minimizeSidebar && pathname?.includes('workspace') && 'bg-main'
            } ${
              !minimizeSidebar && pathname?.includes('workspace')
                ? 'text-main'
                : 'text-main-gray-text'
            } ${
              !pathname?.includes('workspace') &&
              'md:hover:bg-main-gray-input md:hover:text-main-gray-text'
            } duration-300`}
            onClick={() => {
              if (!minimizeSidebar) {
                setShowBahanAjar(!showBahanAjar);
              } else {
                setShowBahanAjar(true);
                setMinimizeSidebar(false);
              }
            }}
          >
            <div className="flex items-center space-x-3">
              {}
              <IconDocument
                className={`${
                  minimizeSidebar &&
                  pathname?.includes('workspace') &&
                  'text-white'
                } ${!minimizeSidebar && ''}`}
                active={
                  minimizeSidebar && pathname?.includes('workspace')
                    ? true
                    : false
                }
              />
              {!minimizeSidebar && (
                <span className="text-sm font-medium">Material</span>
              )}
            </div>
            {!minimizeSidebar && (
              <>
                {showBahanAjar ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </>
            )}
          </div>
        </div>
        {showBahanAjar && !minimizeSidebar && (
          <div className="mt-[-.5rem] flex w-full flex-col items-end gap-[.2rem]">
            {category?.map((item: any) => (
              <div
                key={item.id}
                className="w-full"
              >
                <Link
                  key={item.id}
                  href={`/${website_sub_category_id}/user/workspace/${item.id}`}
                  className={`ml-[1rem] mr-[.5rem] flex cursor-pointer items-center gap-[1rem] px-4 py-[.5rem] ${
                    pathname?.includes(`workspace/${item.id}`) && 'bg-main'
                  } rounded-[.8rem] text-main-gray-text md:rounded-[.3rem] ${
                    !pathname?.includes(`workspace/${item.id}`) &&
                    'md:hover:bg-main-gray-input md:hover:text-main-gray-text'
                  } duration-300`}
                  onClick={() => {
                    if (isMobile) {
                      setSidebarMobile(false);
                    }
                  }}
                >
                  <IconArrowTwk
                    w={10}
                    className={`bx ${
                      pathname?.includes(`workspace/${item.id}`) &&
                      'bxs-layer text-white'
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      pathname?.includes(`workspace/${item.id}`) && 'text-white'
                    } font-medium capitalize duration-300`}
                  >
                    {item.name}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        )} */}
        <Link
          href={`/${website_sub_category_id}/user/try-out`}
          passHref
          onClick={() => {
            if (isMobile) {
              setSidebarMobile(false);
            }
          }}
        >
          <div
            className={`flex items-center gap-[.8rem] ${
              pathname?.includes('try-out') && 'bg-main'
            } mx-[.5rem] cursor-pointer rounded-[1rem] px-[1rem] py-[1rem] font-semibold transition-all duration-500 ease-in-out md:rounded-[.5rem] md:py-[.8rem] ${
              minimizeSidebar && 'justify-center'
            } text-main-gray-text ${
              !pathname?.includes('try-out') &&
              'md:hover:bg-main-gray-input md:hover:text-main-gray-text'
            } duration-300`}
          >
            {}
            <IconTryOut
              className={`${
                pathname?.includes('try-out') ? 'font-semibold text-white' : ' '
              }`}
              active={pathname?.includes('try-out') ? true : false}
            />
            {!minimizeSidebar && (
              <span
                className={`text-sm ${
                  pathname?.includes('try-out')
                    ? 'font-medium text-white'
                    : 'font-medium'
                }`}
              >
                Try Out
              </span>
            )}
          </div>
        </Link>
        <Link
          href={`/${website_sub_category_id}/user/leaderboard`}
          passHref
          onClick={() => {
            if (isMobile) {
              setSidebarMobile(false);
            }
          }}
        >
          <div
            className={`flex items-center gap-[.8rem] ${
              pathname?.includes('leaderboard') && 'bg-main'
            } mx-[.5rem] cursor-pointer rounded-[1rem] px-[1rem] py-[1rem] font-semibold transition-all duration-500 ease-in-out md:rounded-[.5rem] md:py-[.8rem] ${
              minimizeSidebar && 'justify-center'
            } text-main-gray-text ${
              !pathname?.includes('leaderboard') &&
              'md:hover:bg-main-gray-input md:hover:text-main-gray-text'
            } duration-300`}
          >
            {}
            <AlignEndHorizontal
              className={`${
                pathname?.includes('leaderboard')
                  ? ' font-medium text-white'
                  : 'stroke-[1.6] w-5 h-5'
              }`}
            />
            {!minimizeSidebar && (
              <span
                className={`text-sm ${
                  pathname?.includes('leaderboard')
                    ? 'font-medium text-white'
                    : 'font-medium'
                }`}
              >
                Peringkat
              </span>
            )}
          </div>
        </Link>
        <Link
          href={`/${website_sub_category_id}/user/chat`}
          passHref
          onClick={() => {
            if (isMobile) {
              setSidebarMobile(false);
            }
          }}
        >
          <div
            className={`flex items-center gap-[.8rem] ${
              pathname?.includes('chat') && 'bg-main'
            } mx-[.5rem] cursor-pointer rounded-[1rem] px-[1rem] py-[1rem] font-semibold transition-all duration-500 ease-in-out md:rounded-[.5rem] md:py-[.8rem] ${
              minimizeSidebar && 'justify-center'
            } text-main-gray-text ${
              !pathname?.includes('chat') &&
              'md:hover:bg-main-gray-input md:hover:text-main-gray-text'
            } duration-300`}
          >
            {}
            <BotIcon
              className={`${
                pathname?.includes('chat')
                  ? ' text-white'
                  : 'stroke-[1.6] w-5 h-5'
              }`}
            />
            {!minimizeSidebar && (
              <span
                className={`text-sm ${
                  pathname?.includes('chat')
                    ? 'font-medium text-white'
                    : 'font-medium'
                }`}
              >
                Chat
                <Badge
                  variant="secondary"
                  className={cn(
                    'relative -top-2 -right-1 bg-yellow-400 hover:bg-yellow-400 px-1 py-0 text-xs font-bold text-blue-800',
                  )}
                >
                  AI
                </Badge>
              </span>
            )}
          </div>
        </Link>
      </div>
      <div className="mx-[1rem] mt-[1rem] hidden h-[2px] w-[calc(100%-2rem)] bg-main-gray-input md:block" />
    </div>
  );
};

export default SidebarRoute;

const ComingSoonBadge = ({ minimizeSidebar }: { minimizeSidebar: boolean }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-gray-600/20">
      {!minimizeSidebar && (
        <div
          className={cn(
            'absolute right-[.5rem] top-1 mx-auto flex items-center gap-1 rounded-full border bg-white p-1 px-[.5rem] text-[.7rem] shadow-md',
          )}
        >
          <Sparkles className="inline-block h-[.7rem] w-[.7rem] fill-current text-yellow-400" />
          <span className="font-bold text-yellow-400">
            <AnimatedGradientText className="animate-gradient bg-gradient-to-r from-[#ffaa40] via-main to-[#ffaa40] text-[.7rem]">
              Coming soon!
            </AnimatedGradientText>
          </span>
        </div>
      )}
    </div>
  );
};
