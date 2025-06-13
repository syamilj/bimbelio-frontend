'use client';

// import Cookies from "js-cookie";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

import {
  IconCrown,
  // IconHistoryTransaction,
  IconMinimizeSidebar,
  IconSetting,
} from '@/styles/icon';

import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

import LogoMinimize from '@/_assest/logo-minimize.png';

import SidebarRoute from '@/app/[web_sub_category]/(user)/user/_components/sidebar-route';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import { useAppContext } from '@/components/provider/provider-app';
import { Button } from '@/components/ui/button';

import { useSession } from '@/components/provider/provider-session-auth';
import Logo from '@/components/ui/logo';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { signOut } from '@/lib/auth-helper';
// Main Sidebar Component
const Sidebar = ({ category }: { category: any }) => {
  const { data: session } = useSession();
  const userImage = session?.user.image || null;
  const router = useRouter();
  // const { query } = router;

  // const searchParams = useSearchParams();
  // const order_id = searchParams?.get('order_id');

  const {
    minimizeSidebar,
    setMinimizeSidebar,
    transactionPopUp,
    setTransactionPopUp,
    transactionHistory,
    setTransactionHistory,
    setSidebarMobile,
    // pagesSetting,
    setPagesSetting,
  } = useAppContext();

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  // Handle body overflow based on pop-ups
  useEffect(() => {
    if (transactionPopUp || transactionHistory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [transactionPopUp, transactionHistory]);

  // Fetch user history
  // const { data: riwayat } = api.document.getHistoryByUser.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });
  // const riwayat: any = undefined;

  return (
    <Fragment>
      {/* Desktop Sidebar */}
      <div className="relative hidden h-full flex-col bg-white shadow-xl md:flex">
        {/* Header */}
        <div
          className={`flex ${
            !minimizeSidebar
              ? 'justify-between p-6'
              : 'justify-center px-[.5rem] py-[0]'
          } items-center`}
        >
          {!minimizeSidebar ? (
            <>
              <Logo href={`/${website_sub_category_id}/user/try-out`} />
              <div
                onClick={() => {
                  setMinimizeSidebar(true);
                }}
              >
                <IconMinimizeSidebar className="cursor-pointer text-main-gray-text duration-300 hover:text-main-gray-text2" />
              </div>
            </>
          ) : (
            <div
              className="mt-[1rem] flex h-[50px] w-full cursor-pointer items-center justify-center rounded-[.5rem] bg-main text-white duration-200"
              onClick={() => {
                setMinimizeSidebar(false);
              }}
            >
              <IconMinimizeSidebar className="scale-x-[-1]" />
            </div>
          )}
        </div>

        {/* Sidebar Routes */}
        <div
          className={cn(
            'mt-12 overflow-y-auto pb-[60px]',
            session?.user.role === 'USER' && 'pb-[calc(60px+154px)]',
          )}
        >
          <SidebarRoute
            category={category}
            minimizeSidebar={minimizeSidebar}
            setMinimizeSidebar={setMinimizeSidebar}
          />
        </div>

        {/* History Section */}
        {/* <div
          id="riwayat"
          className="mt-[1rem] flex flex-col gap-[2rem] px-[.5rem]"
        >
          {!minimizeSidebar ? (
            <>
              {riwayat && riwayat?.today.length > 0 && (
                <div className="flex flex-col gap-[.2rem]">
                  <ButtonRiwayat heading={"Hari ini"} data={riwayat.today} />
                </div>
              )}
              {riwayat && riwayat.yesterday.length > 0 && (
                <div className="flex flex-col gap-[.2rem]">
                  <ButtonRiwayat heading={"Kemarin"} data={riwayat.yesterday} />
                </div>
              )}
            </>
          ) : (
            <div className="flex w-full justify-center">
              <div onClick={() => setMinimizeSidebar(false)}>
                <IconClock className="cursor-pointer text-main-gray-text" />
              </div>
            </div>
          )}
        </div> */}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full">
          {/* Upgrade Premium (Conditionally Rendered) */}
          {!session?.user.tier && (
            <div
              className={`flex flex-col gap-[.6rem] bg-white ${
                !minimizeSidebar ? 'p-4' : 'mb-[1rem] items-center p-0'
              }`}
            >
              {!minimizeSidebar && (
                <>
                  <h1 className="font-semibold">Subscription</h1>
                  <p className="text-[.8rem] text-main-gray-text">
                    Beli subscription sekarang untuk meningkatkan akses layanan
                    terbaik dan terlengkap dari Bimbelio
                  </p>
                </>
              )}
              <Button
                className="flex w-fit items-center gap-[.5rem] rounded-[.8rem] bg-gradient md:hover:opacity-80 px-[1rem] py-[.7rem] text-white duration-300"
                onClick={() => setTransactionPopUp(true)}
              >
                <IconCrown />
                {!minimizeSidebar && (
                  <p className="font-regular">Subscription</p>
                )}
              </Button>
            </div>
          )}
          {/* Separator */}
          <div className="border-t border-gray-200" />
          {/* User Profile & Settings */}
          <div
            id="logout"
            className={`${
              session?.user.role !== 'USER' && 'border-t'
            } relative flex items-center justify-between gap-[.5rem] border-main-gray-input bg-white p-4`}
          >
            <div
              className={`flex items-center gap-[.5rem] ${
                minimizeSidebar && 'w-full justify-center'
              }`}
            >
              <div className="flex w-[1.8rem] items-center justify-center rounded-full">
                <div className="flex h-[1.8rem] w-[1.8rem] items-center justify-center overflow-hidden rounded-[50%] border border-main-gray-input">
                  {userImage && (
                    <img
                      src={userImage}
                      alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
                      // width={500}
                      // height={300}
                      // layout="responsive"
                    />
                  )}
                </div>
              </div>
              {!minimizeSidebar && (
                <span className="gap-1">
                  <p className="font-xl font-semibold capitalize">
                    {session?.user.name}
                  </p>
                </span>
              )}
            </div>
            {!minimizeSidebar && (
              <div
                className="cursor-pointer"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <IconSetting className="rounded-[50%] p-[.1rem] text-main-gray-text2 duration-300 hover:bg-main-gray-input" />
              </div>
            )}
            {openMenu && (
              <>
                {/* Overlay */}
                <div
                  className="fixed left-0 top-0 h-full w-full bg-transparent"
                  onClick={() => setOpenMenu(false)}
                />

                {/* Dropdown Menu */}

                <div className="absolute bottom-[100%] right-[.5rem] w-[14rem] overflow-hidden rounded-xl border bg-[#ffffffea] text-sm font-medium shadow-lg backdrop-blur-[10px]">
                  {/* Admin Section (Jika role user adalah ADMIN) */}
                  {session?.user.role === 'ADMIN' && (
                    <>
                      <div className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700">
                        <AnimatedGradientText className="font-semibold">
                          {session?.user.name}
                        </AnimatedGradientText>
                      </div>
                    </>
                  )}

                  {/* Separator */}
                  <div className="border-t border-gray-200" />

                  {/* Admin Section (Jika role user adalah ADMIN) */}
                  {session?.user.role === 'ADMIN' && (
                    <>
                      <div
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                        onClick={() => {
                          setOpenMenu(false);
                          router.push(`/${website_sub_category_id}/admin`);
                        }}
                      >
                        <User className="h-4 w-4 text-sm font-medium text-foreground" />
                        <span>Admin</span>
                      </div>
                    </>
                  )}

                  {/* Profile Section */}
                  <div
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                    onClick={() => {
                      setOpenMenu(false);
                      setPagesSetting('account');
                      setTransactionHistory(true);
                    }}
                  >
                    <User className="h-4 w-4 text-foreground" />
                    <span>Profil</span>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200" />

                  {/* Logout Section */}
                  <div
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 text-red-600 transition duration-200 hover:bg-red-50"
                    onClick={() => {
                      setOpenMenu(false);
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <i className="bx bx-log-out text-[16px]" />
                    <span>Keluar</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className="relative flex h-full flex-col bg-bg-workspace shadow-xl md:hidden">
        {/* Header */}
        <div
          className={`flex ${
            !minimizeSidebar ? 'justify-between p-6' : 'justify-center p-[1rem]'
          } items-center`}
        >
          {!minimizeSidebar ? (
            <>
              <Logo href={`/${website_sub_category_id}/user/try-out`} />
              <div
                onClick={() => {
                  setSidebarMobile(false);
                }}
              >
                <IconMinimizeSidebar className="cursor-pointer text-main-gray-text duration-300 hover:text-main-gray-text2" />
              </div>
            </>
          ) : (
            <Image
              src={LogoMinimize}
              alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
              className="w-[40px]"
            />
          )}
        </div>

        {/* Sidebar Routes */}
        <div
          className={cn(
            'mt-12 overflow-y-auto pb-[60px]',
            session?.user.role === 'USER' && 'pb-[calc(60px+154px)]',
          )}
        >
          <SidebarRoute
            category={category}
            minimizeSidebar={minimizeSidebar}
            setMinimizeSidebar={setMinimizeSidebar}
          />
        </div>

        {/* History Section */}
        {/* <div
          id="riwayat"
          className="mt-[1rem] flex-col gap-[2rem] px-[.5rem] md:flex"
        >
          {!minimizeSidebar ? (
            <>
              {riwayat && riwayat?.today.length > 0 && (
                <div className="flex flex-col gap-[.2rem]">
                  <ButtonRiwayat heading={"Hari ini"} data={riwayat.today} />
                </div>
              )}
              {riwayat && riwayat.yesterday.length > 0 && (
                <div className="flex flex-col gap-[.2rem]">
                  <ButtonRiwayat heading={"Kemarin"} data={riwayat.yesterday} />
                </div>
              )}
            </>
          ) : (
            <div className="flex w-full justify-center">
              <i
                className="bx bx-history cursor-pointer text-[1.5rem] text-main"
                onClick={() => setMinimizeSidebar(false)}
              />
            </div>
          )}
        </div> */}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full">
          {/* Upgrade Premium (Conditionally Rendered) */}
          {!session?.user.tier && (
            <div
              className={`flex flex-col gap-[.6rem] bg-white ${
                !minimizeSidebar ? 'p-5' : 'mb-[1rem] items-center p-0'
              }`}
            >
              {!minimizeSidebar && (
                <>
                  <h1 className="font-semibold">Subscription</h1>
                  <p className="text-[.8rem] text-main-gray-text">
                    Upgrade akunmu sekarang untuk meningkatkan akses layanan
                    terbaik dan terlengkap dari Bimbelio
                  </p>
                </>
              )}
              <Button
                className="flex w-fit items-center gap-[.5rem] rounded-[.8rem] bg-gradient px-[1rem] py-[.7rem] text-white duration-300 hover:opacity-85"
                onClick={() => setTransactionPopUp(true)}
              >
                <IconCrown />
                {!minimizeSidebar && (
                  <p className="font-regular">Upgrade akun</p>
                )}
              </Button>
            </div>
          )}

          {/* Separator */}
          <div className="border-t border-gray-200" />

          {/* User Profile & Settings */}
          <div
            id="logout"
            className={`${
              session?.user.role !== 'USER' && 'border-t'
            } relative flex items-center justify-between gap-[.5rem] border-main-gray-input bg-white p-5`}
          >
            <div
              className={`flex items-center gap-[.5rem] ${
                minimizeSidebar && 'w-full justify-center'
              }`}
            >
              <div className="flex w-[1.8rem] items-center justify-center rounded-full">
                <div className="flex h-[1.8rem] w-[1.8rem] items-center justify-center overflow-hidden rounded-[50%] border border-main-gray-input">
                  {userImage && (
                    <img
                      src={userImage}
                      alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
                      // width={500}
                      // height={300}
                      // layout="responsive"
                    />
                  )}
                </div>
              </div>
              {!minimizeSidebar && (
                <span className="gap-1">
                  <p className="font-xl font-semibold capitalize">
                    {session?.user.name}
                  </p>
                </span>
              )}
            </div>
            {!minimizeSidebar && (
              <div
                className="cursor-pointer"
                onClick={() => setOpenMenu(!openMenu)}
              >
                <IconSetting className="rounded-[50%] p-[.1rem] text-main-gray-text2 duration-300 hover:bg-main-gray-input" />
              </div>
            )}
            {openMenu && (
              <>
                {/* Overlay */}
                <div
                  className="fixed left-0 top-0 h-full w-full bg-transparent"
                  onClick={() => setOpenMenu(false)}
                />

                {/* Dropdown Menu */}

                <div className="absolute bottom-[100%] right-[.5rem] w-[14rem] overflow-hidden rounded-xl border bg-[#ffffffea] text-sm font-medium shadow-lg backdrop-blur-[10px]">
                  {/* Admin Section (Jika role user adalah ADMIN) */}
                  {session?.user.role === 'ADMIN' && (
                    <>
                      <div className="flex items-center justify-center gap-2 px-4 py-2 text-gray-700">
                        <AnimatedGradientText className="font-semibold">
                          {session?.user.name}
                        </AnimatedGradientText>
                      </div>
                    </>
                  )}

                  {/* Separator */}
                  <div className="border-t border-gray-200" />

                  {/* Admin Section (Jika role user adalah ADMIN) */}
                  {session?.user.role === 'ADMIN' && (
                    <>
                      <div
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                        onClick={() => {
                          setOpenMenu(false);
                          router.push(`/${website_sub_category_id}/admin`);
                        }}
                      >
                        <User className="h-4 w-4 text-sm font-medium text-foreground" />
                        <span>Admin</span>
                      </div>
                    </>
                  )}

                  {/* Profile Section */}
                  <div
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                    onClick={() => {
                      setOpenMenu(false);
                      setPagesSetting('account');
                      setTransactionHistory(true);
                    }}
                  >
                    <User className="h-4 w-4 text-foreground" />
                    <span>Profil</span>
                  </div>

                  {/* Separator */}
                  <div className="border-t border-gray-200" />

                  {/* Logout Section */}
                  <div
                    className="flex cursor-pointer items-center gap-2 px-4 py-2 text-red-600 transition duration-200 hover:bg-red-50"
                    onClick={() => {
                      setOpenMenu(false);
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <i className="bx bx-log-out text-[16px]" />
                    <span>Keluar</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Sidebar;

// ButtonRiwayat Component
// const ButtonRiwayat = ({ data, heading, lastAccessed }: any) => {
//   const pathname = usePathname();
//   const [docId, setDocId] = useState<any>([]);

//   useEffect(() => {
//     if (pathname?.includes('workspace')) {
//       const dataPath = pathname.split('/');
//       const documentId = dataPath[dataPath.length - 1];
//       setDocId(documentId);
//     }
//   }, [pathname]);

//   return (
//     <>
//       <h1 className="pl-[.5rem] text-[.9rem] text-main-gray-text">{heading}</h1>
//       {lastAccessed ? (
//         <Link
//           href={`/user/workspace/${data.document.categoryId}/${data.document.id}?tab=chat`}
//           className={`cursor-pointer ${
//             docId === data.document.id
//               ? 'bg-main text-white'
//               : 'bg-transparent active:bg-main md:hover:bg-main-gray-input md:hover:text-main-gray-text'
//           } overflow-x-hidden text-ellipsis whitespace-nowrap rounded-[.5rem] px-[.8rem] py-[.5rem] text-[.9rem]`}
//         >
//           {data.document.title}
//         </Link>
//       ) : (
//         <>
//           {data?.map((item: any) => (
//             <Link
//               key={item.document.id} // Add key prop here
//               href={`/user/workspace/${item.document.categoryId}/${item.document.id}?tab=chat`}
//               className={`cursor-pointer ${
//                 docId === item.document.id
//                   ? 'bg-main text-white'
//                   : 'bg-transparent active:bg-main md:hover:bg-main-gray-input md:hover:text-main-gray-text'
//               } overflow-x-hidden text-ellipsis whitespace-nowrap rounded-[.5rem] px-[.8rem] py-[.5rem] text-[.9rem]`}
//             >
//               {item.document.title}
//             </Link>
//           ))}
//         </>
//       )}
//     </>
//   );
// };
