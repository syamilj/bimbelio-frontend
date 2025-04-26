"use client";

import ReactMarkdown from "@/components/ui/react-markdown";
import { SpinnerPageCentered } from "@/components/ui/spinner";
import { toaster } from "@/components/ui/toaster";
import { cn, replaceLatexNotation, TncTryout } from "@/lib/utils";
import { TryoutCategory, TryoutSession } from "@/types/database";
import "katex/dist/katex.min.css";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "./header";
import { mutateGeneral } from "@/lib/fetch-helper";
import { useSession } from "@/components/provider/session-provider-auth";
import { TryoutDataType } from "../page";

interface SessionWithCategory extends TryoutSession {
  TryoutCategory: TryoutCategory;
}

interface Props {
  sessionData: NonNullable<TryoutDataType>["TryoutSession"];
  tryoutName: string;
  restTime: number;
  currentIndexSession: number;
}

const StartTryout = ({
  currentIndexSession,
  tryoutName,
  sessionData,
  restTime,
}: Props) => {
  const { data: session } = useSession();

  // const trpc = api.useUtils();
  // const { mutate: createTryoutSessionParticipant } =
  //   api.tryoutSession.createTryoutSessionParticipant.useMutation({
  //     onSuccess() {
  //       trpc.tryout.getTryoutById.refetch();
  //     },
  //     onError() {
  //       setLoading(false);
  //       toaster({
  //         title: "Gagal Memulai Tryout",
  //         description: "Silahkan ulangi",
  //         condition: "warning",
  //         duration: 3000,
  //       });
  //     },
  //   });

  const createTryoutSessionParticipant = async (payload: {
    sessionId: string;
    userId: string;
  }) => {
    await mutateGeneral("/tryoutSession/createTryoutSessionParticipant", {
      payload,
      type: "post",
      toast: {
        errorTitle: "Gagal Memulai Tryout",
        errorMsg: "Silahkan ulangi",
      },
      onSuccess() {
        //       trpc.tryout.getTryoutById.refetch();
        window.location.reload();
      },
      onError() {
        setLoading(false);
      },
    });
  };

  const [tnc, setTnc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleStart = () => {
    setLoading(true);
    createTryoutSessionParticipant({
      sessionId: sessionData[currentIndexSession].id,
      userId: session?.user.id || "",
    });
  };

  console.log("sessionData", sessionData);

  useEffect(() => {
    if (sessionData) {
      const data = TncTryout.find(
        (item) =>
          item.category === sessionData[0]?.TryoutCategory.name.toLowerCase()
      );
      console.log("ketentuan", data);
      if (data) setTnc(data?.value);
      else setTnc(".....");
    }
  }, [sessionData]);

  if (!sessionData || sessionData.length === 0 || tnc === "")
    return <SpinnerPageCentered />;

  return (
    <>
      <Header current={0} total={-1} name={tryoutName} />
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-workspace pt-14 md:pt-4">
        <form
          className="flex h-full w-full flex-col justify-between gap-4 bg-white px-8 py-8 md:h-auto md:max-w-2xl md:justify-start md:rounded-3xl md:shadow-lg"
          onSubmit={(e) => {
            handleStart();
            e.preventDefault();
          }}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-xl font-medium">{tryoutName}</h1>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
                        <p>{item.TryoutCategory.name}</p>
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
              "flex h-10 w-full items-center justify-center rounded-2xl bg-main text-white transition-colors duration-200 hover:bg-main/85",
              loading && "cursor-default hover:bg-main/85"
            )}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span>Mulai Tryout</span>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default StartTryout;
