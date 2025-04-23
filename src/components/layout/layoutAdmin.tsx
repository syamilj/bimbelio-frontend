"use client";

import CheckSubscription from "@/components/provider/check-subscription";
import { useAppContext } from "@/components/provider/provider-app";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";
import Navbar from "../../app/(admin)/admin/_components/navbar";
import Sidebar from "../../app/(admin)/admin/_components/sidebar";

interface LayoutAdminProps {
  children: ReactNode;
}

export default function LayoutAdmin({ children }: LayoutAdminProps) {
  const params = useParams();
  const pathname = usePathname();
  const { minimizeSidebar, setMinimizeSidebar } = useAppContext();

  const [hideLayout, setHideLayout] = useState<boolean>(false);

  console.log({ params });

  useEffect(() => {
    if (pathname?.includes("try-out") && params && params.id) {
      setHideLayout(true);
    } else {
      setHideLayout(false);
    }
  }, [params, pathname]);

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <Suspense>
      <CheckSubscription>
        <div className="h-full">
          <div
            id="border"
            className={cn(
              "fixed inset-y-0 z-50 h-[80px] w-full duration-300 md:pl-[calc(254px+1rem)]",
              minimizeSidebar && "md:pl-[calc(73px+1rem)]"
            )}
          >
            <Navbar />
          </div>
          <div
            id="border"
            className={`md-flex h-full max-sm:hidden ${
              !minimizeSidebar ? "w-[16rem]" : "w-[75px]"
            } fixed inset-y-0 z-50 flex-col duration-300`}
            onMouseOver={() => {
              setMinimizeSidebar(false);
            }}
            onMouseOut={() => {
              setMinimizeSidebar(true);
            }}
          >
            <Sidebar />
          </div>
          <main
            className={`${
              !minimizeSidebar
                ? "pl-[calc(16rem+3rem)]"
                : "pl-[calc(75px+3rem)]"
            } ml-[16px] mt-[80px] h-full min-h-[100vh] bg-bg-workspace pr-10 pt-12 duration-300`}
          >
            {children}
          </main>
        </div>
      </CheckSubscription>
    </Suspense>
  );
}
