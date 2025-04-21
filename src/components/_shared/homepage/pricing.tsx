import LOGO from "@/_assest/logomark.png";
import { useAppContext } from "@/components/provider/provider-app";
import { useSession } from "@/components/provider/session-provider-auth";

import Image from "next/image";
import { useRouter } from "next/router";

const Pricing = ({ setShowAuth }: { setShowAuth: any }) => {
  const Router = useRouter();

  const { data: session } = useSession();

  const { setTransactionPopUp } = useAppContext();

  const data = [
    {
      heading: "Chat",
      free: "50 Chat",
      premium: "2.000 Chat",
    },
    {
      heading: "Limit Notes",
      free: "20 Notes",
      premium: "200 Note",
    },
    {
      heading: "Limit Quiz",
      free: "5 Quiz",
      premium: "50 Quiz",
    },
    {
      heading: "Limit Vision",
      free: "10 Vision",
      premium: "100 Vision",
    },
  ];

  return (
    <div id="pricing" className="mx-auto flex w-full max-w-[1280px] flex-col">
      <div className="mx-[1rem] rounded-[2rem] bg-white px-[2rem] py-[4rem] md:mx-0">
        <div className="grid grid-cols-2 gap-x-[3rem] md:grid-cols-3">
          <div className="hidden items-center justify-center md:flex">
            <div className="flex items-center gap-2">
              <Image
                alt="TutorSNBT - Bimbel AI untuk SNBT/UTBK"
                src={LOGO}
                width={30}
              />
              <span className="font-semibold">TutorSNBT</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[1rem] text-center">
            <h1 className="text-[2rem] font-medium text-main-gray-text">
              GRATIS
            </h1>
            <div className="text-main-gray-text">
              <p className="text-[1.5rem] font-medium">Rp0</p>
              <p className="font-regular text-[1rem] text-main-gray-text2">
                Tanpa dipungut biaya
              </p>
            </div>
            <button
              className="w-full rounded-[2rem] bg-bg-workspace py-[.8rem] font-medium text-main-gray-text"
              onClick={() => {
                if (session) Router.push("/dashboard");
                else setShowAuth({ login: true, signUp: false });
              }}
            >
              Mulai sekarang
            </button>
          </div>
          <div className="flex flex-col items-center gap-[1rem] text-center">
            <h1 className="text-[2rem] font-medium text-main">PREMIUM</h1>
            <div className="">
              <p className="text-[1.5rem] font-medium">Rp99.000/bulan</p>
              <p className="text-[1rem] font-bold text-main">
                Diskon 50%{" "}
                <span className="font-regular text-main-gray-text line-through">
                  Rp199.000
                </span>
              </p>
            </div>
            <button
              className="font-regular w-full rounded-[2rem] bg-gradientGreen py-[.8rem] text-white md:hover:bg-gradientGreenHover"
              onClick={() => {
                if (session) {
                  setTransactionPopUp(true);
                  Router.push("/user/dashboard");
                } else {
                  setShowAuth({ login: true, signUp: false });
                }
              }}
            >
              Pilih layanan
            </button>
          </div>
        </div>
        <div className="mt-[2rem] grid grid-cols-2 md:grid-cols-3">
          <div className="font-regular hidden bg-white py-[.8rem] pl-[1rem] text-start text-main-gray-text md:block">
            Akses Material
          </div>
          <div className="font-regular bg-white py-[.8rem] text-center text-main-gray-text">
            Terbatas
          </div>
          <div className="font-regular bg-white py-[.8rem] text-center text-main">
            Semua
          </div>
        </div>
        {data?.map((item: any, i: number) => (
          <div className="grid grid-cols-2 md:grid-cols-3" key={i}>
            <div
              className={`${
                i % 2 === 0 ? "bg-bg-workspace" : "bg-bg-white"
              } font-regular hidden py-[.8rem] pl-[1rem] text-start text-main-gray-text md:block`}
            >
              {item.heading}
            </div>
            <div
              className={`${
                i % 2 === 0 ? "bg-bg-workspace" : "bg-bg-white"
              } font-regular py-[.8rem] text-center text-main-gray-text`}
            >
              {item.free}
            </div>
            <div
              className={`${
                i % 2 === 0 ? "bg-bg-workspace" : "bg-bg-white"
              } font-regular py-[.8rem] text-center text-main`}
            >
              {item.premium}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
