"use client";

import LogoMinimize from "@/_assest/logo-minimize.png";
import test from "@/_assest/logo.png";
import Logo from "@/_assest/logo.svg";
import { useAppContext } from "@/components/provider/provider-app";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SidebarRoute from "./sidebar-route";
import { useSession } from "@/components/provider/session-provider-auth";
import { signOut } from "@/lib/auth-helper";

const Sidebar = () => {
  const { minimizeSidebar, setMinimizeSidebar } = useAppContext();
  const router = useRouter();
  const { data } = useSession();
  return (
    <div className="flex h-full flex-col bg-white shadow-xl">
      <div
        className={`flex ${
          !minimizeSidebar ? "justify-between p-6" : "justify-center p-[1rem]"
        } items-center`}
      >
        {!minimizeSidebar ? (
          <>
            <Image
              src={Logo}
              alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
              className="cursor-pointer"
              onClick={() => {
                router.push("/user/try-out");
              }}
            />
            <i
              className="bx bx-chevron-left cursor-pointer text-[1.5rem] text-main-gray-text"
              onClick={() => setMinimizeSidebar(true)}
            />
          </>
        ) : (
          <Image
            src={LogoMinimize}
            alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
            className="w-[40px] cursor-pointer"
            onClick={() => setMinimizeSidebar(false)}
          />
        )}
      </div>
      <div className="mt-12">
        <SidebarRoute />
      </div>
      <div
        id="logout"
        className="absolute bottom-0 left-0 flex w-full items-center justify-between gap-[.5rem] border-t border-main-gray-input bg-white p-4"
      >
        <div
          className={`flex items-center gap-[.5rem] ${
            minimizeSidebar && "w-full justify-center"
          }`}
        >
          <div
            className={
              "flex w-[1.8rem] items-center justify-center rounded-full border border-main-gray-input"
            }
          >
            <Image
              src={test}
              alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
              className="w-full"
            />
          </div>
          {!minimizeSidebar && (
            <p className="font-semibold capitalize">{data?.user.name}</p>
          )}
        </div>
        {!minimizeSidebar && (
          <i
            className="bx bx-log-out cursor-pointer rounded-full p-[.2rem] text-[1.2rem] text-main-gray-text duration-200 hover:bg-main-gray-input"
            onClick={() => {
              signOut({ callbackUrl: "/" });
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Sidebar;
