"use client";

import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";

import { env } from "@/env.mjs";
import { supabase } from "@/supabaseClient";

import {
  IconClock,
  IconCopy,
  IconCrown,
  // IconHistoryTransaction,
  IconMinimizeSidebar,
  IconSetting,
  // IconUser,
  IconX,
} from "@/styles/icon";

import { Spinner } from "@/components/ui/spinner";
import { toaster } from "@/components/ui/toaster";
import {
  getDateString,
  getHours,
  getHoursDetail,
  imageProfile,
} from "@/lib/utils";
import { User } from "lucide-react";

import male from "@/_assest/default-profile/male.png";
import LogoMinimize from "@/_assest/logo-minimize.png";
import Logo from "@/_assest/logo.svg";
import LOGO from "@/_assest/logomark.png";

import ButtonPayment from "@/app/(user)/user/_components/button-payment";
import SidebarRoute from "@/app/(user)/user/_components/sidebar-route";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import { useAppContext } from "@/components/provider/provider-app";
import { Button } from "@/components/ui/button";

import { Payment } from "./payment";
import { useSession } from "@/components/provider/session-provider-auth";
import { Transaction, UserRoleEnum } from "@/types/database";
import { response, responseError } from "@/lib/response";
import axiosInstance from "@/lib/axios/axiosInstance";
import { getGeneral } from "@/lib/fetch-helper";
// Main Sidebar Component
const Sidebar = ({ category }: any) => {
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
    pagesSetting,
    setPagesSetting,
  } = useAppContext();

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  // Handle body overflow based on pop-ups
  useEffect(() => {
    if (transactionPopUp || transactionHistory) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [transactionPopUp, transactionHistory]);

  // Fetch user history
  // const { data: riwayat } = api.document.getHistoryByUser.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });
  const riwayat: any = undefined;

  return (
    <Fragment>
      <Payment />
      {transactionHistory && <HistoryPayment pages={`${pagesSetting}`} />}
      {/* Desktop Sidebar */}
      <div className="relative hidden h-full flex-col bg-white shadow-xl md:flex">
        {/* Header */}
        <div
          className={`flex ${
            !minimizeSidebar
              ? "justify-between p-6"
              : "justify-center px-[.5rem] py-[0]"
          } items-center`}
        >
          {!minimizeSidebar ? (
            <>
              <Link href="/user/try-out" className="cursor-pointer">
                <div className="flex items-center gap-2">
                  <Image
                    alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
                    src={LOGO}
                    width={30}
                  />
                  <span className="font-semibold">TutorSNBT</span>
                </div>
              </Link>
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
              className="mt-[1rem] flex h-[50px] w-full cursor-pointer items-center justify-center rounded-[.5rem] bg-main text-white duration-200 md:hover:bg-main-hover"
              onClick={() => {
                setMinimizeSidebar(false);
              }}
            >
              <IconMinimizeSidebar className="scale-x-[-1]" />
            </div>
          )}
        </div>

        {/* Sidebar Routes */}
        <div className="mt-12">
          <SidebarRoute
            category={category}
            minimizeSidebar={minimizeSidebar}
            setMinimizeSidebar={setMinimizeSidebar}
          />
        </div>

        {/* History Section */}
        <div
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
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full">
          {/* Upgrade Premium (Conditionally Rendered) */}
          {session?.user.role === "USER" && (
            <div
              className={`flex flex-col gap-[.6rem] bg-white ${
                !minimizeSidebar ? "p-4" : "mb-[1rem] items-center p-0"
              }`}
            >
              {!minimizeSidebar && (
                <>
                  <h1 className="font-semibold">Upgrade premium</h1>
                  <p className="text-[.8rem] text-main-gray-text">
                    Upgrade akunmu sekarang untuk meningkatkan akses layanan
                    terbaik dan terlengkap dari TutorSNBT
                  </p>
                </>
              )}
              <Button
                className="flex w-fit items-center gap-[.5rem] rounded-[.8rem] bg-greenUpgrade px-[1rem] py-[.7rem] text-white duration-300 active:bg-greenUpgradeHover md:hover:bg-greenUpgradeHover md:active:bg-greenUpgrade"
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
              session?.user.role !== "USER" && "border-t"
            } relative flex items-center justify-between gap-[.5rem] border-main-gray-input bg-white p-4`}
          >
            <div
              className={`flex items-center gap-[.5rem] ${
                minimizeSidebar && "w-full justify-center"
              }`}
            >
              <div className="flex w-[1.8rem] items-center justify-center rounded-full">
                <div className="flex h-[1.8rem] w-[1.8rem] items-center justify-center overflow-hidden rounded-[50%] border border-main-gray-input">
                  {userImage && (
                    <Image
                      src={userImage}
                      alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
                      width={500}
                      height={300}
                      layout="responsive"
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
                  {session?.user.role === "ADMIN" && (
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
                  {session?.user.role === "ADMIN" && (
                    <>
                      <div
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                        onClick={() => {
                          setOpenMenu(false);
                          router.push("/admin");
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
                      setPagesSetting("account");
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
                      // signOut({ callbackUrl: "/" });
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
            !minimizeSidebar ? "justify-between p-6" : "justify-center p-[1rem]"
          } items-center`}
        >
          {!minimizeSidebar ? (
            <>
              <Image src={Logo} alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK" />
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
              alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
              className="w-[40px]"
            />
          )}
        </div>

        {/* Sidebar Routes */}
        <div className="mt-12">
          <SidebarRoute
            category={category}
            minimizeSidebar={minimizeSidebar}
            setMinimizeSidebar={setMinimizeSidebar}
          />
        </div>

        {/* History Section */}
        <div
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
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full">
          {/* Upgrade Premium (Conditionally Rendered) */}
          {session?.user.role === "USER" && (
            <div
              className={`flex flex-col gap-[.6rem] bg-white ${
                !minimizeSidebar ? "p-5" : "mb-[1rem] items-center p-0"
              }`}
            >
              {!minimizeSidebar && (
                <>
                  <h1 className="font-semibold">Upgrade premium</h1>
                  <p className="text-[.8rem] text-main-gray-text">
                    Upgrade akunmu sekarang untuk meningkatkan akses layanan
                    terbaik dan terlengkap dari TutorSNBT
                  </p>
                </>
              )}
              <Button
                className="flex w-fit items-center gap-[.5rem] rounded-[.8rem] bg-greenUpgrade px-[1rem] py-[.7rem] text-white duration-300 active:bg-greenUpgradeHover md:hover:bg-greenUpgradeHover md:active:bg-greenUpgrade"
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
              session?.user.role !== "USER" && "border-t"
            } relative flex items-center justify-between gap-[.5rem] border-main-gray-input bg-white p-5`}
          >
            <div
              className={`flex items-center gap-[.5rem] ${
                minimizeSidebar && "w-full justify-center"
              }`}
            >
              <div className="flex w-[1.8rem] items-center justify-center rounded-full">
                <div className="flex h-[1.8rem] w-[1.8rem] items-center justify-center overflow-hidden rounded-[50%] border border-main-gray-input">
                  {userImage && (
                    <Image
                      src={userImage}
                      alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
                      width={500}
                      height={300}
                      layout="responsive"
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
                  {session?.user.role === "ADMIN" && (
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
                  {session?.user.role === "ADMIN" && (
                    <>
                      <div
                        className="flex cursor-pointer items-center gap-2 px-4 py-2 text-gray-700 transition duration-200 hover:bg-gray-100"
                        onClick={() => {
                          setOpenMenu(false);
                          router.push("/admin");
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
                      setPagesSetting("account");
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
                      // signOut({ callbackUrl: "/" });
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

// Subcomponents

// ButtonRiwayat Component
const ButtonRiwayat = ({ data, heading, lastAccessed }: any) => {
  const pathname = usePathname();
  const [docId, setDocId] = useState<any>([]);

  useEffect(() => {
    if (pathname?.includes("workspace")) {
      const dataPath = pathname.split("/");
      const documentId = dataPath[dataPath.length - 1];
      setDocId(documentId);
    }
  }, [pathname]);

  return (
    <>
      <h1 className="pl-[.5rem] text-[.9rem] text-main-gray-text">{heading}</h1>
      {lastAccessed ? (
        <Link
          href={`/user/workspace/${data.document.categoryId}/${data.document.id}?tab=chat`}
          className={`cursor-pointer ${
            docId === data.document.id
              ? "bg-main text-white"
              : "bg-transparent active:bg-main md:hover:bg-main-gray-input md:hover:text-main-gray-text"
          } overflow-x-hidden text-ellipsis whitespace-nowrap rounded-[.5rem] px-[.8rem] py-[.5rem] text-[.9rem]`}
        >
          {data.document.title}
        </Link>
      ) : (
        <>
          {data?.map((item: any) => (
            <Link
              key={item.document.id} // Add key prop here
              href={`/user/workspace/${item.document.categoryId}/${item.document.id}?tab=chat`}
              className={`cursor-pointer ${
                docId === item.document.id
                  ? "bg-main text-white"
                  : "bg-transparent active:bg-main md:hover:bg-main-gray-input md:hover:text-main-gray-text"
              } overflow-x-hidden text-ellipsis whitespace-nowrap rounded-[.5rem] px-[.8rem] py-[.5rem] text-[.9rem]`}
            >
              {item.document.title}
            </Link>
          ))}
        </>
      )}
    </>
  );
};

// HistoryPayment Component
const HistoryPayment = ({ pages }: { pages?: string }) => {
  const router = useRouter();
  const { setTransactionPopUp, setTransactionHistory } = useAppContext();

  const [page, setPage] = useState<string>(pages ? pages : "account");
  const [loading, setLoading] = useState<boolean>(false);
  const [profile, setProfile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>("");

  const { data: session } = useSession();
  // const { data }: any = api.payment.getPaymentInProses.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });
  // const { data: limitaionUsed }: any = api.user.getCurrentLimitation.useQuery(
  //   undefined,
  //   { refetchOnWindowFocus: false }
  // );

  const [data, setData] = useState<{
    waiting: Transaction[];
    riwayat: Transaction[];
  }>({ riwayat: [], waiting: [] });

  type LimitationUsedType = {
    user: {
      id: string;
      Role: UserRoleEnum;
    };
    chat: number;
    quiz: number;
    notes: number;
    vision: number;
    chatLimit: number;
    notesLimit: number;
    visionLimit: number;
    quizLimit: number;
  };
  const [limitaionUsed, setLimitaionUsed] = useState<
    (LimitationUsedType & { Limit: LimitationUsedType }) | null
  >();

  useEffect(() => {
    getGeneral("/payment/getPaymentInProses", {
      setData: setData,
    });
    getGeneral("/user/getCurrentLimitation", {
      setData: setLimitaionUsed,
    });
  }, []);

  console.log({ test: data });

  const handlePay = async (token: string) => {
    window.snap.pay(token, {
      onClose: () => {
        toaster({
          title: "Gagal",
          description: "Pembayaran belum selesai!",
          condition: "warning",
        });
      },
    });
  };

  // const { mutateAsync: updateProfileImage } =
  //   api.user.updateProfileImage.useMutation({
  //     onSettled() {
  //       setProfile(undefined);
  //       setTimeout(() => {
  //         router.refresh();
  //       }, 500);
  //     },
  //     onSuccess() {
  //       toaster({
  //         title: "Sukses",
  //         condition: "success",
  //         description: "Gambar profil berhasil di update!",
  //         duration: 3000,
  //       });
  //     },
  //     onError(error) {
  //       toaster({
  //         title: "Upss",
  //         condition: "warning",
  //         description: `${error.message}`,
  //         duration: 3000,
  //       });
  //     },
  //   });

  const updateProfileImage = async (data: any) => {
    try {
      const res = await axiosInstance.put(`/user/updateProfileImage`, data);
      setProfile(undefined);
      setTimeout(() => {
        router.refresh();
      }, 500);
      return response(res, true);
    } catch (error) {
      return responseError(error, true);
    }
  };

  const handleChangeProfile = async () => {
    try {
      setLoading(true);
      if (profile) {
        const fileName = `${
          env.NEXT_PUBLIC_SUPABASE_URL
        }/storage/v1/object/public/img/${session?.user.id}-${new Date()}`;
        const { data, error } = await supabase.storage
          .from("img")
          .upload(`${session?.user.id}-${new Date()}`, profile);
        if (data) {
          setProfileImage(fileName);
          Cookies.set("image-profile", fileName);
          await updateProfileImage({ image: fileName });
          setLoading(false);
        }
        if (error) {
          toaster({
            title: "Upss",
            condition: "warning",
            description: "Gagal upload gambar profil!",
            duration: 3000,
          });
          console.log(error);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  // Preview image when profile changes
  useEffect(() => {
    setPreview("");
    if (profile) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
      };

      reader.readAsDataURL(profile);
    }
  }, [profile]);

  // Set initial profile image
  useEffect(() => {
    if (imageProfile && imageProfile !== "null") {
      setProfileImage(imageProfile);
    }
  }, []);

  return (
    <div className="fixed left-0 top-0 z-[1000] flex h-full w-full items-center justify-center bg-[#0000007a]">
      <div className="h-full w-full max-w-[800px] overflow-hidden bg-white md:max-h-[600px] md:rounded-[1.5rem]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-main-gray-input p-[1.5rem]">
          <h1 className="text-[1.2rem] font-semibold">Profile</h1>
          <div
            onClick={() => {
              setTransactionHistory(false);
            }}
          >
            <IconX className="cursor-pointer text-main-gray-text duration-300 hover:text-main-gray-text2" />
          </div>
        </div>

        {/* Content */}
        <div className="flex h-full w-full flex-col md:flex-row">
          {/* Sidebar Menu */}
          <div className="flex shrink-0 gap-[.5rem] overflow-auto whitespace-nowrap border-r border-main-gray-input px-[.5rem] py-[1.5rem] md:flex-col">
            <div
              className={`${
                page === "account" ? "bg-main text-white" : "text-bla"
              } w-[210px] cursor-pointer rounded-[.6rem] px-[1rem] py-[.6rem] text-[.9rem]`}
              onClick={() => setPage("account")}
            >
              Akun
            </div>
            <div
              className={`${
                page === "rt" ? "bg-main text-white" : "text-bla"
              } w-[210px] cursor-pointer rounded-[.6rem] px-[1rem] py-[.6rem] text-[.9rem]`}
              onClick={() => setPage("rt")}
            >
              Rencana dan Tagihan
            </div>
            <div
              className={`${
                page === "riwayat" ? "bg-main text-white" : "text-bla"
              } w-[210px] cursor-pointer rounded-[.6rem] px-[1rem] py-[.6rem] text-[.9rem]`}
              onClick={() => setPage("riwayat")}
            >
              Riwayat transaksi
            </div>
            <ButtonPayment
              text={
                session?.user.role === "USER"
                  ? "Upgrade Premium"
                  : "Upgrade Limitasi"
              }
            />
          </div>

          {/* Page Content */}
          {page === "account" && (
            <div className="w-full p-[1.5rem]">
              <h1 className="font-regular text-[1.2rem]">Akun</h1>
              <div>
                <div className="my-[1rem] h-[1px] w-full bg-main-gray-input" />
                <div className="flex flex-col gap-[.5rem]">
                  <div className="flex flex-col gap-[1rem]">
                    <p className="font-medium">Informasi Akun</p>
                    <div className="relative flex w-full items-center justify-between gap-[1rem]">
                      <input
                        id="ubahFotoProfile"
                        type="file"
                        className="absolute left-0 top-0 w-0 p-0"
                        onChange={(e) => {
                          if (e.target.files) {
                            setProfile(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="flex gap-[1rem]">
                        <div className="h-[3.5rem] w-[3.5rem] overflow-hidden rounded-[.5rem]">
                          {preview !== "" ? (
                            <Image
                              src={preview}
                              alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
                              width={500}
                              height={300}
                              layout="responsive"
                            />
                          ) : (
                            <Image
                              src={profileImage !== "" ? profileImage : male}
                              alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
                              width={500}
                              height={300}
                              layout="responsive"
                            />
                          )}
                        </div>
                        <div className="flex h-full flex-col justify-between py-[.2rem]">
                          <p className="font-medium">{session?.user.name}</p>
                          <p className="font-regular text-[.9rem] text-main-gray-text">
                            {session?.user.email}
                          </p>
                        </div>
                      </div>
                      <Button
                        className="rounded-[.8rem] border border-main-gray-disabled px-[1rem] py-[.5rem] text-[.9rem] font-medium text-main-gray-text duration-200 md:hover:border-main md:hover:bg-main md:hover:text-white"
                        onClick={() => {
                          document.getElementById("ubahFotoProfile")?.click();
                        }}
                      >
                        Ubah foto profile
                      </Button>
                    </div>
                    {profile && !loading ? (
                      <div className="flex w-full justify-end">
                        <div className="flex items-center gap-[.5rem]">
                          <Button
                            className="rounded-[.8rem] px-[1rem] py-[.5rem] text-[.9rem] font-medium text-main-gray-text md:hover:text-black"
                            onClick={() => setProfile(undefined)}
                          >
                            Batalkan
                          </Button>
                          <Button
                            className="rounded-[.8rem] border border-main-gray-disabled px-[1rem] py-[.5rem] text-[.9rem] font-medium text-main-gray-text duration-200 md:hover:border-main md:hover:bg-main md:hover:text-white"
                            onClick={handleChangeProfile}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : profile && loading ? (
                      <div className="flex w-full justify-end">
                        <div className="flex h-[40px] items-center justify-center px-[1rem]">
                          <Spinner />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === "rt" && (
            <div className="w-full p-[1.5rem]">
              <h1 className="font-regular text-[1.2rem]">
                Rencana dan Tagihan
              </h1>
              <div className="my-[1rem] h-[1px] w-full bg-main-gray-input" />
              {data?.waiting?.length > 0 ? (
                <p className="mb-[.5rem] text-[.9rem] text-main-gray-text">
                  Kamu memiliki tagihan yang perlu dibayar:
                </p>
              ) : (
                <>
                  <p className="mb-[.5rem] text-[.9rem] text-main-gray-text">
                    Kamu tidak memiliki tagihan yang perlu dibayar
                  </p>
                  <div className="flex h-[380px] flex-col gap-[.5rem] overflow-y-auto pr-[.5rem]">
                    <Plans
                      chat={`${limitaionUsed?.chat}`}
                      notes={`${limitaionUsed?.notes}`}
                      quiz={`${limitaionUsed?.quiz}`}
                      vision={`${limitaionUsed?.vision}`}
                      role={`${session?.user.role}`}
                      Limit={limitaionUsed?.Limit}
                    />
                    {session?.user.role === "USER" && (
                      <div className="font-regular flex flex-col gap-[1rem] text-[.9rem] text-main-gray-text">
                        <p>
                          Kamu belum premium. Yuk,{" "}
                          <span className="text-main">upgrade premium</span>{" "}
                          untuk menikmati layanan terbaik dan lebih lengkap!
                        </p>
                        <Button
                          className="flex w-fit items-center gap-[.5rem] rounded-[.8rem] bg-main px-[1rem] py-[.7rem] text-white duration-300 hover:bg-main-hover active:bg-main"
                          onClick={() => {
                            setTransactionPopUp(true);
                            setTransactionHistory(false);
                          }}
                        >
                          <IconCrown />
                          <p className="font-regular">Upgrade akun</p>
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
              <div className="flex h-[380px] flex-col gap-[.5rem] overflow-y-auto pr-[.5rem]">
                {data?.waiting?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-[1.5rem] rounded-[1.5rem] bg-bg-layout p-[1rem]"
                  >
                    <div id="heading" className="flex flex-col gap-[.8rem]">
                      <div className="flex items-center gap-[.5rem]">
                        <p className="font-semibold">
                          {item.item_details[0].name}
                        </p>
                        <IconCrown className="text-main-yellow" />
                      </div>
                      <div className="flex w-full items-center justify-between">
                        <p className="text-[.8rem] text-main-gray-text">
                          ID: {item.transaction_details.order_id}
                        </p>
                        <div>
                          <IconCopy className="text-main" />
                        </div>
                      </div>
                    </div>
                    <div id="info" className="grid grid-cols-2">
                      <div className="flex flex-col justify-between">
                        <p className="text-[.8rem] text-main-gray-text">
                          Nominal tagihan:
                        </p>
                        <h1 className="text-[1.2rem] font-semibold">
                          {item.transaction_details.gross_amount.toLocaleString(
                            "id-ID",
                            { style: "currency", currency: "IDR" }
                          )}
                        </h1>
                      </div>
                      <div className="flex flex-col justify-between">
                        <p className="text-[.8rem] text-main-gray-text">
                          Batas waktu pembayaran:
                        </p>
                        <h1 className="font-regular text-[1rem]">
                          {getDateString(item.expired_time)} .{" "}
                          {getHoursDetail(item.expired_time)}
                        </h1>
                      </div>
                    </div>
                    <div id="action" className="flex items-center">
                      <Button
                        className="active:main rounded-[.8rem] bg-main px-[1.5rem] py-[.8rem] text-[.9rem] text-white duration-300 hover:bg-main-hover"
                        onClick={() => handlePay(item.token)}
                      >
                        Bayar sekarang
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === "riwayat" && (
            <div className="w-full p-[1.5rem]">
              <h1 className="font-regular text-[1.2rem]">Riwayat Transaksi</h1>
              <div className="my-[1rem] h-[1px] w-full bg-main-gray-input" />
              <div className="flex h-[380px] flex-col gap-[.5rem] overflow-y-auto pr-[.5rem]">
                {data?.riwayat?.map((item: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col gap-[1.5rem] rounded-[1.5rem] bg-bg-layout p-[1rem]"
                  >
                    <div id="heading" className="flex flex-col gap-[1.5rem]">
                      <div className="flex w-full items-center justify-between">
                        <div className="flex items-center gap-[.5rem]">
                          <p className="font-semibold">
                            {item.item_details[0].name}
                          </p>
                          <IconCrown className="text-main-yellow" />
                        </div>
                        {item.settlement_time ? (
                          <div className="rounded-[1rem] bg-main px-[.6rem] py-[.2rem] text-[.8rem] text-white">
                            Berhasil
                          </div>
                        ) : (
                          <div className="rounded-[1rem] bg-main-yellow px-[.6rem] py-[.2rem] text-[.8rem] text-black">
                            Menunggu
                          </div>
                        )}
                      </div>
                      <div className="flex w-full items-center justify-between">
                        <div className="text-[.8rem] text-main-gray-text">
                          <p>
                            {getDateString(item.transaction_time)} .{" "}
                            {getHours(item.transaction_time)}
                          </p>
                        </div>
                        <div className="flex items-center gap-[.5rem]">
                          <p className="text-[.8rem] text-main-gray-text">
                            ID: {item.transaction_details.order_id}
                          </p>
                          <div>
                            <IconCopy className="text-main-gray-text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Plans Component
const Plans = ({
  chat,
  notes,
  quiz,
  // vision,
  role,
  Limit,
}: {
  chat: string;
  notes: string;
  quiz: string;
  vision: string;
  role: string;
  Limit: any;
}) => {
  return (
    <div className="flex flex-col gap-[1.5rem] rounded-[1.5rem] bg-bg-layout p-[1rem]">
      <div id="heading" className="flex flex-col">
        <div className="flex items-center gap-[.5rem]">
          {role === "USER" ? (
            <p className="font-semibold">Gratis</p>
          ) : role === "PREMIUM" ? (
            <p className="font-semibold">Premium</p>
          ) : (
            <p className="font-semibold">Admin</p>
          )}
          {(role === "PREMIUM" || role === "ADMIN") && (
            <IconCrown className="text-main-yellow" />
          )}
        </div>
      </div>
      <div id="info" className="grid grid-cols-2 gap-y-[2rem]">
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Akses bahan ajar</p>
          <h1 className="text-[1rem] font-medium">
            {role !== "ADMIN" ? "Terbatas" : "Semua"}
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Sisa Chat AI</p>
          <h1 className="text-[1rem] font-medium">
            {role === "ADMIN" ? "-" : chat}/
            {Limit?.chat ? Limit?.chat : "Unlimited"}{" "}
            <span className="font-regular text-[.8rem] text-main-gray-disabled">
              chat
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Sisa Notes</p>
          <h1 className="text-[1rem] font-medium">
            {role === "ADMIN" ? "-" : notes}/
            {Limit?.notes ? Limit?.notes : "Unlimited"}{" "}
            <span className="font-regular text-[.8rem] text-main-gray-disabled">
              kata
            </span>
          </h1>
        </div>
        <div className="flex flex-col gap-[.2rem]">
          <p className="text-[.8rem] text-main-gray-text">Sisa Quiz</p>
          <h1 className="text-[1rem] font-medium">
            {role === "ADMIN" ? "-" : quiz}/
            {Limit?.quiz ? Limit?.quiz : "Unlimited"}{" "}
            <span className="font-regular text-[.8rem] text-main-gray-disabled">
              soal
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
};
