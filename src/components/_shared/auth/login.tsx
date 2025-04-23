"use client";

import GoogleImage from "@/_assest/Google.png";
import LOGO from "@/_assest/logomark.png";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import LoadingPage from "@/components/ui/Loading-Page";
import { toaster } from "@/components/ui/toaster";
import Cookies from "js-cookie";
import Image from "next/image";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Logo from "@/components/ui/logo";
import { env } from "@/env.mjs";

export const Login = ({ showAuth, setShowAuth }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // const getProfile = api.user.getProfileImage.useMutation();

  const handleSubmit = async (googleToken: any) => {
    setLoading(true);
    try {
      const { credential } = googleToken as { credential: string };
      console.log({ credential });
      // Kirim token ke backend
      const res = await axios.post(`${env.NEXT_PUBLIC_API_URL}/auth/google`, {
        token: credential,
      });

      console.log(res.data);
      Cookies.set("token", res.data.data.token);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const handleSubmitGoogle = async () => {
    setLoading(true);
    try {
      // const image = await getProfile.mutateAsync({ email });
      // console.log(image);
      // if (image !== "null") Cookies.set('image-profile', `${image}`);
      // await signIn("google", { redirect: false, callbackUrl: "/user/try-out" });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const [forgotPasswordPage, setForgotPasswordPage] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [stepLogin, setStepLogin] = useState<number>(1);
  const [passwordFg, setPasswordFg] = useState<string>("");
  const [confirmPasswordFg, setConfirmPasswordFg] = useState<string>("");
  const [showPasswordFg, setShowPasswordFg] = useState<boolean>(false);
  const [showConfirmPasswordFg, setShowConfirmPasswordFg] =
    useState<boolean>(false);
  const [code, setCode] = useState<string>("");

  // const forgotPassword = api.user.forgotPassword.useMutation();
  // const confirmForgotPassword = api.user.confirmForgotPassword.useMutation();

  const ForgotPassword = async () => {
    try {
      // const data = await forgotPassword.mutateAsync({ email: email });
      // if (data) {
      //   setStep(2);
      //   return data;
      // } else {
      //   toaster({
      //     title: "Upss",
      //     description: "Coba lagi nanti!",
      //     condition: "warning",
      //     duration: 5000,
      //   });
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const confirmFg = async () => {
    try {
      if (passwordFg !== confirmPasswordFg) {
        toaster({
          title: "Upss",
          description: "Password dan konfirmasi password harus sama!",
          condition: "warning",
          duration: 5000,
        });
        return;
      } else {
        // const data = await confirmForgotPassword.mutateAsync({
        //   email: email,
        //   code: code,
        //   newPassword: passwordFg,
        // });
        // if (data?.status) {
        //   setForgotPasswordPage(false);
        //   toaster({
        //     title: "Sukses",
        //     description: "Berhasil mengubah kata sandi!",
        //     condition: "success",
        //     duration: 5000,
        //   });
        //   return;
        // } else if (!data?.status) {
        //   toaster({
        //     title: "Upss",
        //     description: data?.message,
        //     condition: "warning",
        //     duration: 5000,
        //   });
        //   return;
        // }
        toaster({
          title: "Upss",
          description: "Kesalahan tidak diketahui, coba lagi nanti!",
          condition: "warning",
          duration: 5000,
        });
        return;
      }
    } catch (error) {
      {
        console.error(error);
      }
    }
  };

  const onTimeout = async () => {
    toaster({
      title: "Upss",
      description: "Verifikasi kode sudah habis masa berlakunya!",
      condition: "warning",
      duration: 5000,
    });
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
          onClick={() => {
            setShowAuth((prev: any) => ({ ...prev, login: false }));
            setStepLogin(1);
          }}
        />
      )}

      <div className="z-[2] mx-[1rem] flex w-[500px] flex-col gap-[2rem] rounded-[1rem] bg-white p-[2rem] md:mx-0">
        {stepLogin !== 1 && (
          <div className="flex flex-col gap-[.5rem]">
            <h1 className="text-[1.5rem] font-bold">
              <AnimatedGradientText>Selamat datang di </AnimatedGradientText>
              <span className="font-regular text-main">Bimbelio!</span>
            </h1>
            <p className="font-regular text-main-gray-text">
              Masuk dengan akunmu
            </p>
          </div>
        )}
        {!forgotPasswordPage && stepLogin === 1 ? (
          <form className="flex flex-col gap-[1.5rem]">
            <div className="flex w-full justify-center">
              <Logo className="text-[1.5rem]" imageWidth={40} />
            </div>
            <div className="mt-[1rem] flex flex-col items-center gap-[1.5rem]">
              <h1 className="text-[1.5rem] font-semibold">Masuk</h1>
              <div className="flex w-full flex-col gap-[1rem]">
                <GoogleOAuthProvider
                  clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
                >
                  <GoogleLogin
                    onSuccess={handleSubmit}
                    onError={() => console.log("Login Failed")}
                    text={"signin_with"}
                  />
                </GoogleOAuthProvider>
                {/* <div
                    className="bg-white w-full flex justify-center items-center gap-[.5rem] border rounded-[.5rem] font-semibold text-[.9rem] h-[40px] cursor-pointer duration-300 md:hover:bg-main-gray-input/15"
                    onClick={() => {
                      setStepLogin(2);
                    }}
                  >
                    <Image src={EmailImage} alt="Email" className="w-[1.1rem]" />
                    <p>Masuk dengan Email</p>
                  </div> */}
              </div>
            </div>
          </form>
        ) : !forgotPasswordPage && stepLogin === 2 ? (
          <form
            className="flex flex-col gap-[1.5rem]"
            onSubmit={(e: any) => handleSubmit(e)}
          >
            <div id="email" className="">
              <input
                type="text"
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

            <div className="flex w-full justify-end">
              <p
                className="cursor-pointer text-[.8rem] underline hover:text-main"
                onClick={() => setForgotPasswordPage(true)}
              >
                Lupa kata sandi?
              </p>
            </div>
            <button className="font-regular rounded-[.5rem] bg-greenUpgrade py-[.8rem] text-white md:hover:bg-greenUpgradeHover">
              Masuk
            </button>
          </form>
        ) : null}
        {forgotPasswordPage && step === 1 ? (
          <form
            className="flex flex-col gap-[1.5rem]"
            onSubmit={(e) => {
              e.preventDefault();
              ForgotPassword();
            }}
          >
            <div id="email" className="">
              <p className="mb-[.5rem] text-[.9rem]">Your Email :</p>
              <input
                type="text"
                placeholder="Email..."
                className="w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.8rem] text-[.9rem] outline-none"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
            <button className="font-regular rounded-[.5rem] bg-gradient py-[.8rem] text-white">
              Next
            </button>
          </form>
        ) : forgotPasswordPage && step === 2 ? (
          <form
            className="flex flex-col gap-[1.5rem]"
            onSubmit={(e) => {
              e.preventDefault();
              confirmFg();
            }}
          >
            <div id="email" className="">
              <p className="ml-[.3rem] text-[.9rem] text-main-gray-text">
                Make New Password :
              </p>
              <div className="relative flex items-center">
                <input
                  type={`${showPasswordFg ? "text" : "password"}`}
                  placeholder="Kata sandi baru..."
                  className="w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.8rem] text-[.9rem] outline-none"
                  onChange={(e) => setPasswordFg(e.target.value)}
                  value={passwordFg}
                />
                <i
                  className={`bx ${
                    !showPasswordFg ? "bxs-hide" : "bxs-show"
                  } absolute right-[1rem] cursor-pointer text-[1.5rem] text-[#5A5D66]`}
                  onClick={() => setShowPasswordFg(!showPasswordFg)}
                />
              </div>
            </div>
            <div id="email" className="relative flex items-center">
              <input
                type={`${showConfirmPasswordFg ? "text" : "password"}`}
                placeholder="Konfirmasi sandi baru..."
                className="w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.8rem] text-[.9rem] outline-none"
                onChange={(e) => setConfirmPasswordFg(e.target.value)}
                value={confirmPasswordFg}
              />
              <i
                className={`bx ${
                  !showConfirmPasswordFg ? "bxs-hide" : "bxs-show"
                } absolute right-[1rem] cursor-pointer text-[1.5rem] text-[#5A5D66]`}
                onClick={() => setShowConfirmPasswordFg(!showConfirmPasswordFg)}
              />
            </div>
            <div id="email" className="">
              <p className="ml-[.3rem] text-[.9rem] text-main-gray-text">
                Code Verification (Check your email) :
              </p>
              <input
                type="text"
                placeholder="Kode..."
                className="w-full rounded-[.5rem] border border-main-gray-input px-[1rem] py-[.8rem] text-[.9rem] outline-none"
                onChange={(e) => setCode(e.target.value)}
                value={code}
              />
              <div className="ml-[.3rem] text-[.9rem] text-main-gray-text">
                <Timer initialSeconds={60} onTimeout={onTimeout} />
              </div>
            </div>
            <button className="font-regular rounded-[.5rem] bg-gradient py-[.8rem] text-white">
              Submit
            </button>
          </form>
        ) : null}
        <div className="flex flex-col items-center gap-[1rem]">
          <p className="font-regular">Ayo mulai sekarang! </p>
          <p className="font-regular text-center text-[.8rem] text-main-gray-text">
            Dengan melanjutkan, kamu setuju dengan ketentuan Layanan dan
            Kebijakan Privasi Bimbelio
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

const Timer = ({ initialSeconds, onTimeout }: any) => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    if (seconds > 0) {
      const timerId = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timerId);
    } else if (seconds === 0) {
      onTimeout();
    }
  }, [seconds, onTimeout]);

  return (
    <div>
      <p>Expired in : {seconds} seconds</p>
    </div>
  );
};
