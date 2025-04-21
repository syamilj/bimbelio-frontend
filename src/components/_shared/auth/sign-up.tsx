"use client";

import LoadingPage from "@/components/ui/Loading-Page";
import { toaster } from "@/components/ui/toaster";
// import { api } from '@/trpc/react';
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SignUp = ({ showAuth, setShowAuth }: any) => {
  const router = useRouter();

  // const createUsers = api.user.createUser.useMutation({
  //   onMutate() {
  //     setLoading(true);
  //   },
  //   onSettled(data, error) {
  //     if (!error) {
  //       setLoading(false);
  //       setShowAuth({ login: true, signUp: false });
  //     }
  //   },
  //   onSuccess(data, variables, context) {
  //     console.log({ data, variables, context });
  //     // toaster({
  //     //   title: 'Verifikasi email Kamu untuk login',
  //     //   description: 'Periksa email Kamu!',
  //     //   duration: 6000,
  //     //   condition: 'success',
  //     // });
  //     toaster({
  //       title: 'Akun berhasil dibuat',
  //       description: 'Periksa email Kamu!',
  //       duration: 6000,
  //       condition: 'success',
  //     });
  //   },
  //   onError(error) {
  //     toaster({
  //       title: 'Gagal',
  //       description: `${error.shape?.message}`,
  //       duration: 5000,
  //       condition: 'warning',
  //     });
  //     setLoading(false);
  //   },
  // });

  const [loading, setLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // try {
    //   if (name.length < 1) {
    //     toaster({
    //       title: "Gagal",
    //       description: "Masukan Nama",
    //       duration: 5000,
    //       condition: "warning",
    //     });
    //     setLoading(false);
    //     return;
    //   }
    //   if (password.length < 6) {
    //     toaster({
    //       title: "Gagal",
    //       description: "Password minimal 6 karakter",
    //       duration: 5000,
    //       condition: "warning",
    //     });
    //     setLoading(false);
    //     return;
    //   }
    //   const data = await createUsers.mutateAsync({
    //     name: name,
    //     password: password,
    //     email: email,
    //   });
    //   if (data && data.data.id) {
    //     router.push(`/send-verify?id=${data.data.id}`);
    //   }
    //   console.log({ data });
    //   setLoading(false);
    // } catch (error: any) {
    //   setLoading(false);
    //   return;
    // }
  };
  return (
    <div
      id="login"
      className="fixed left-0 top-0 z-[3000] flex h-full w-full items-center justify-center bg-[#0000005e] backdrop-blur-[8px]"
    >
      {loading && <LoadingPage />}
      {showAuth && (
        <div
          className="fixed left-0 top-0 z-[1] h-full w-full bg-transparent"
          onClick={() =>
            setShowAuth((prev: any) => ({ ...prev, signUp: false }))
          }
        />
      )}

      <div className="z-[2] mx-[1rem] flex w-[500px] flex-col gap-[2rem] rounded-[1rem] bg-white p-[2rem] md:mx-0">
        <div className="flex flex-col gap-[.5rem]">
          <h1 className="font-regular text-[1.5rem]">
            Mulai <span className="text-main">sekarang</span>
          </h1>
          <p className="text-main-gray-text">Daftarkan akunmu</p>
        </div>

        <form
          className="flex flex-col gap-[1.5rem]"
          onSubmit={(e: any) => handleSubmit(e)}
        >
          <div id="nama" className="">
            <input
              type="text"
              placeholder="Nama Lengkap..."
              className="w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.8rem] text-[.9rem] outline-none"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>

          <div id="email" className="">
            <input
              type="email"
              placeholder="Email..."
              className="w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.8rem] text-[.9rem] outline-none"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          <div id="password" className="relative flex items-center">
            <input
              type={`${showPassword ? "text" : "password"}`}
              placeholder="Kata sandi..."
              className="w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.8rem] text-[.9rem] outline-none"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <i
              className={`bx ${
                !showPassword ? "bxs-hide" : "bxs-show"
              } absolute right-[1rem] cursor-pointer text-[1.5rem] text-[#5A5D66]`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <div className="flex items-start gap-[.5rem] px-[.2rem]">
            <input type="checkbox" className="mt-[.3rem]" required />
            <p className="text-[.9rem]">
              Saya telah membaca dan setuju dengan{" "}
              <span
                className="cursor-pointer text-main underline"
                onClick={() => router.push("/terms-of-service")}
              >
                Ketentuan Layanan
              </span>{" "}
              dan{" "}
              <span
                className="cursor-pointer text-main underline"
                onClick={() => router.push("/privacy-policy")}
              >
                Kebijakan Privasi
              </span>{" "}
              bimbelio.com
            </p>
          </div>

          <button className="font-regular rounded-[.5rem] bg-gradient py-[.8rem] text-white">
            Daftar Akun
          </button>
        </form>

        <div className="flex flex-col items-center gap-[1rem]">
          <p className="font-regular">
            Sudah punya akun?{" "}
            <span
              className="cursor-pointer text-main underline"
              onClick={() =>
                setShowAuth(() => ({ signUp: false, login: true }))
              }
            >
              masuk sekarang
            </span>
          </p>
          <p className="font-regular text-center text-[.8rem]">
            Dengan melanjutkan, kamu setuju dengan ketentuan Layanan dan
            Kebijakan Privasi Tutor SNBT/UTBK
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
