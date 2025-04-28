import uploadFileImg from "@/_assest/icon/uploadDokumen.png";
import { toaster } from "@/components/ui/toaster";
import { env } from "@/env.mjs";
import { supabase } from "@/supabaseClient";

import Image from "next/image";
import React, { SetStateAction, useEffect, useState } from "react";
import { Spinner } from "../../ui/spinner";
import { mutateGeneral } from "@/lib/fetch-helper";
import { useSession } from "@/components/provider/session-provider-auth";

const ReportBug = ({
  setIsReportBugOpen,
  isReportBugOpen,
}: {
  setIsReportBugOpen: React.Dispatch<SetStateAction<boolean>>;
  isReportBugOpen: boolean;
}) => {
  const { data: session } = useSession();

  const [category, setCategory] = useState<string>("");
  const [detail, setDetail] = useState<string>("");
  const [image, setImage] = useState<File | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  // const { mutate: createBugReport } = api.category.reportBug.useMutation({
  //   onSuccess() {
  //     setIsReportBugOpen(false);
  //     toaster({
  //       title: "Success",
  //       condition: "success",
  //       description: "Berhasil mengirim laporan",
  //     });
  //     setLoading(false);
  //   },
  //   onError() {
  //     toaster({
  //       title: "Failed",
  //       condition: "warning",
  //       description: "Gagal Mengirim Laporan, silahkan coba lagi",
  //     });
  //     setLoading(false);
  //   },
  // });

  const createBugReport = async (payload: {
    category: string;
    detail: string;
    image: string | null;
  }) => {
    await mutateGeneral("/category/reportBug", {
      payload: { ...payload, userId: session?.user.id },
      type: "post",
      setLoading: setLoading,
      onSuccess: () => {
        setIsReportBugOpen(false);
      },
    });
  };

  useEffect(() => {
    console.log({ category, detail, image });
  }, [category, detail, image]);

  const handleSubmit = async () => {
    setLoading(true);
    const filename = crypto.randomUUID();
    if (!image) {
      createBugReport({ category, detail, image: null });
      return;
    }
    const upload = await supabase.storage
      .from("img")
      .upload(`${filename}`, image);
    if (upload.data) {
      createBugReport({
        category,
        detail,
        image: `${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/${filename}`,
      });
    }
    if (upload.error) {
      toaster({
        title: "Failed",
        condition: "warning",
        description: `${upload.error.message}`,
      });
      setLoading(false);
    }
  };

  if (isReportBugOpen) {
    return (
      <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
        <form
          className="mx-[1rem] w-full max-w-[500px] rounded-[2rem] bg-white p-[3rem]"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h1 className="mb-[1rem] text-center text-[1.1rem] font-medium">
            Laporkan Kendala
          </h1>
          <div className="flex flex-col gap-[1rem]">
            <div className="flex flex-col gap-[.5rem] text-[.9rem]">
              <p>
                Kategori kendala<span className="text-red-600">*</span>
              </p>
              <select
                className="rounded-[.8rem] border border-main-gray-input px-[1rem] py-[.8rem] text-main-gray-text outline-none"
                required
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <option value="">Pilih kategori</option>
                <option value="chat">Chat AI</option>
                <option value="notes">Notes</option>
                <option value="quis">Quiz</option>
                <option value="lain">Lainnya</option>
              </select>
            </div>
            <div className="flex flex-col gap-[.5rem] text-[.9rem]">
              <p>
                Detail kendala<span className="text-red-600">*</span>
              </p>
              <input
                type="text"
                className="rounded-[.8rem] border border-main-gray-input px-[1rem] py-[.8rem] outline-none"
                placeholder="Jelaskan kendala yang dialami..."
                required
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-[.5rem] text-[.9rem]">
              <p>
                Foto / screenshot kendala{" "}
                <span className="text-main-gray-text">(optional)</span>
              </p>
              <UploadImage
                inputId="editThumbnail"
                file={image}
                setFile={setImage}
              />
            </div>

            <div className="flex h-[50px] w-full items-center justify-center gap-[1rem]">
              {!loading ? (
                <>
                  <div
                    className="flex h-full w-full cursor-pointer items-center justify-center rounded-[.8rem] bg-transparent px-[1rem] text-main-gray-text duration-300 md:hover:text-black"
                    onClick={() => {
                      setIsReportBugOpen(false);
                    }}
                  >
                    Batalkan
                  </div>
                  <button
                    type="submit"
                    className="h-full w-full rounded-[.8rem] bg-main px-[1rem] text-white duration-300 hover:bg-main/85"
                  >
                    Kirim laporan
                  </button>
                </>
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        </form>
      </div>
    );
  }
  return null;
};

export default ReportBug;

const UploadImage = ({ file, setFile, inputId }: any) => {
  const [previewHover, setPreviewHover] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>("");

  useEffect(() => {
    setPreviewImage("");
    if (file) {
      console.log("ada file");
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };

      reader.readAsDataURL(file);
    }
  }, [file]);

  return (
    <div className="relative">
      <input
        id={`${inputId}`}
        type="file"
        onChange={(e: any) => {
          console.log("awdwad", e.target.files[0]);
          setFile(e.target.files[0]);
        }}
        className="absolute right-0 top-0 h-0 w-0"
      />
      <div className="relative flex flex-col gap-[1rem] rounded-[1rem] border-2 border-dashed border-main-gray-input p-[1rem]">
        {!previewImage ? (
          <>
            <div className="flex flex-col items-center gap-[.5rem] text-center">
              <Image
                src={uploadFileImg}
                alt="Bimbelio - Bimbel AI untuk SNBT/UTBK"
              />
              <p className="text-[.8rem] text-main-gray-text">
                {!file
                  ? "Pilih gambar untuk di-upload (.jpg / .png)"
                  : `${file.name}`}
              </p>
            </div>
            <div
              className="w-full cursor-pointer rounded-[.5rem] border border-main-gray-input py-[.5rem] text-center text-[.8rem] text-main-gray-text duration-300 hover:border-main hover:bg-main hover:text-white active:bg-main"
              onClick={() => {
                document.getElementById(`${inputId}`)?.click();
              }}
            >
              Upload foto
            </div>
          </>
        ) : (
          <>
            <div className={`relative ${previewHover ? "z-[4]" : "z-[6]"}`}>
              <Image
                src={previewImage}
                alt="Bimbelio - Bimbel AI untuk SNBT/UTBK"
                layout="responsive"
                width={500}
                height={300}
                onMouseOver={() => {
                  if (previewImage) {
                    setPreviewHover(true);
                  }
                }}
              />
            </div>
            <div className="absolute left-0 top-0 z-[5] flex h-full w-full items-center justify-center bg-[#ffffffc4] p-[1rem]">
              <div
                className="flex h-full w-full items-center justify-center"
                onClick={() => {
                  document.getElementById(`${inputId}`)?.click();
                }}
                onMouseLeave={() => {
                  if (previewImage) {
                    setPreviewHover(false);
                  }
                }}
              >
                <div className="flex flex-col items-center text-center text-main-gray-text">
                  <i className="bx bx-upload text-[1.5rem]" />
                  <p>Ganti Thumbnail</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
