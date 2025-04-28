'use client';

import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
import LoadingPage from '@/components/ui/Loading-Page';
import Logo from '@/components/ui/logo';
import { env } from '@/env.mjs';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';

export const Login = ({ showAuth, setShowAuth }: any) => {
  const [loading, setLoading] = useState<boolean>(false);

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
      Cookies.set('token', res.data.data.token);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      return;
    }
  };

  const [stepLogin, setStepLogin] = useState<number>(1);

  return (
    <GoogleOAuthProvider clientId={env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
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
          <form className="flex flex-col gap-[1.5rem]">
            <div className="flex w-full justify-center">
              <Logo
                className="text-[1.5rem]"
                imageWidth={40}
              />
            </div>
            <div className="mt-[1rem] flex flex-col items-center gap-[1.5rem]">
              <h1 className="text-[1.5rem] font-semibold">Masuk</h1>
              <div className="flex w-full justify-center">
                <GoogleButton handleSubmit={handleSubmit} />
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
          <div className="flex flex-col items-center gap-[1rem]">
            <p className="font-regular">Ayo mulai sekarang! </p>
            <p className="font-regular text-center text-[.8rem] text-main-gray-text">
              Dengan melanjutkan, kamu setuju dengan ketentuan Layanan dan
              Kebijakan Privasi Bimbelio
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;

const GoogleButton = ({
  handleSubmit,
}: {
  handleSubmit: (googleToken: any) => void;
}) => {
  return (
    <>
      <GoogleLogin
        onSuccess={handleSubmit}
        onError={() => console.log('Login Failed')}
        text={'signin_with'}
        width={1000}
      />
    </>
  );
};
