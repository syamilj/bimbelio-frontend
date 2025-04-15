import { cn } from "@/lib/utils";
import { IconOpenAI } from "@/styles/icon";
import { motion } from "framer-motion";
import { PointerIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import AnimatedGradientText from "../../magicui/animated-gradient-text";
import GridPattern from "../../magicui/animated-grid-pattern";
import PulsatingButton from "../../magicui/pulsating-button";
import WordRotate from "../../magicui/word-rotate";
import { AspectRatio } from "../../ui/aspect-ratio";
import { useSession } from "@/components/provider/session-provider-auth";

interface HeroSectionProps {
  setShowAuth: (show: { signUp: boolean; login: boolean }) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ setShowAuth }) => {
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (videoRef.current) {
      videoRef.current.playbackRate = 2;
    }

    if (mobileVideoRef.current) {
      mobileVideoRef.current.playbackRate = 2; // Untuk mobile
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (videoRef.current && videoContainerRef.current) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            videoRef.current?.play();
          } else {
            videoRef.current?.pause();
          }
        });
      }, options);

      observer.observe(videoContainerRef.current);

      return () => {
        if (videoContainerRef.current) {
          observer.unobserve(videoContainerRef.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (mobileVideoRef.current && mobileVideoContainerRef.current) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mobileVideoRef.current?.play();
          } else {
            mobileVideoRef.current?.pause();
          }
        });
      }, options);

      observer.observe(mobileVideoContainerRef.current);

      return () => {
        if (mobileVideoContainerRef.current) {
          observer.unobserve(mobileVideoContainerRef.current);
        }
      };
    }
  }, []);

  // Handler untuk tombol "Try out gratis" yang melakukan scroll ke #tryout
  const handleScrollToTryout = () => {
    const element = document.getElementById("tryout");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handler untuk tombol "Coba gratis!" yang menavigasi ke /try-out
  const handlePushToTryOut = () => {
    if (!session) {
      // Jika pengguna belum login, tampilkan otentikasi
      setShowAuth({ signUp: false, login: true });
    }
    // else {
    //   // Jika pengguna sudah login, navigasi ke /try-out
    //   router.push('/user/try-out');
    // }
  };

  const handleWhatsAppClick = () => {
    window.open("https://chat.whatsapp.com/LMcwXg3olvX09TAXHhmUbz", "_blank");
  };

  return (
    <div
      id="hero"
      className="relative flex min-h-[80vh] flex-col items-center justify-start overflow-hidden pt-[64px]"
    >
      {/* Konten Utama */}
      <div className="relative z-[20] mx-auto flex max-w-[1024px] justify-center pt-[5rem] text-center">
        <div className="flex shrink-0 flex-col justify-center gap-[0.25rem]">
          <motion.div
            className="mx-auto mb-2 flex rounded-full bg-blue-100/60 px-4 py-2 text-sm font-semibold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, yoyo: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="mr-2 inline-block h-4 w-4 fill-current text-yellow-400" />
            <AnimatedGradientText className="animate-gradient bg-gradient-to-r from-[#ffaa40] via-main to-[#ffaa40]">
              Bimbel AI untuk SNBT/UTBK Pertama di Indonesia!
            </AnimatedGradientText>
          </motion.div>
          <div className="mx-auto my-[0.25rem] mb-4 flex flex-col items-center rounded-[1rem] bg-transparent px-[0.25rem] py-[.5rem] md:flex-row">
            <div className="flex items-center gap-[.25rem] text-[.85rem] font-[450]">
              <p>Powered by</p>
              <IconOpenAI />
            </div>
          </div>
          <div className="">
            <div className="flex flex-col text-[1.8rem] md:text-[3rem]">
              <WordRotate
                className="font-bold text-[#0091FF]"
                words={[
                  "Sudah Siap Masuk <br /> Universitas Impianmu?",
                  "Takut dengan <br /> Persaingan Ketat SNBT/UTBK?",
                ]}
              />
            </div>
          </div>
          <p className="font-regular py-[1rem] text-[1.1rem] text-black">
            Jangan khawatir, <br className="md:hidden" /> persiapkan dirimu
            bersama kami!
          </p>
          <div className="mt-4 flex justify-center gap-[1rem]">
            {/* Tombol "Try out gratis" dengan scroll */}
            <button
              className="flex items-center justify-center rounded-[1.5rem] border border-main-gray-input bg-white/50 px-[1.5rem] py-[.5rem] font-[500] duration-300 md:hover:bg-main-gray-input"
              onClick={handleScrollToTryout}
            >
              Try out gratis
            </button>
            {/* Tombol "Coba gratis!" dengan navigasi */}
            <Link href={"/user/explore"}>
              <PulsatingButton onClick={handlePushToTryOut}>
                Coba gratis!
              </PulsatingButton>
            </Link>
          </div>
        </div>
      </div>
      {/* Mockup Area */}
      <div
        className={cn(
          "relative max-w-5xl mx-auto mb-12 mt-12 z-[20]",
          isMobile ? "w-[320px] h-[568px]" : "w-[1024px] h-[576px]"
        )}
      >
        {isMobile ? (
          // **Mobile View:** Menggunakan frame iPhone dengan Video WebM
          <div
            className="relative aspect-[366/729] mx-auto max-w-[366px]"
            ref={mobileVideoContainerRef}
          >
            {/* Content Container (behind the frame) */}
            <div className="absolute left-[calc(23/366*100%)] top-[calc(23/729*100%)] h-[calc(686/729*100%)] w-[calc(318/366*100%)] overflow-visible rounded-[calc(38/366*100%)/calc(38/729*100%)] [mask-image:linear-gradient(to_bottom,white_60%,transparent)]">
              {/* <video
                ref={mobileVideoRef}
                src="https://tklsekuymvxxcvnkifbx.supabase.co/storage/v1/object/public/dont-delete/tutorsnbt-mobile.webm"
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
              /> */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
            </div>
            {/* Phone Frame (on top) */}
            <Image
              src="https://tklsekuymvxxcvnkifbx.supabase.co/storage/v1/object/public/dont-delete/iphone-frame.svg"
              alt="Phone frame"
              layout="fill"
              className="object-contain pointer-events-none z-10 [mask-image:linear-gradient(to_bottom,white_60%,transparent)]"
              priority
            />
            {/* Tombol Join Grup */}
            <motion.div
              className="absolute -top-2 right-0 z-10 transform -rotate-12 flex items-center gap-1 rounded-full bg-yellow-100/80 p-1 shadow-md cursor-pointer hover:bg-yellow-200 transition-colors duration-300"
              onClick={handleWhatsAppClick}
            >
              <Sparkles className="inline-block h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-bold">
                <AnimatedGradientText className="animate-gradient bg-gradient-to-r from-[#ffaa40] via-main to-[#ffaa40]">
                  Grup Belajar!
                </AnimatedGradientText>
              </span>
            </motion.div>
            <motion.div
              className="absolute -top-8 z-10 right-10 transform translate-x-1/2"
              initial={{ y: 0 }}
              animate={{ y: [-3, 3, -3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <PointerIcon
                fill="yellow"
                className="h-6 w-6 text-blue-500 transform rotate-180"
              />
            </motion.div>
          </div>
        ) : (
          // **Desktop View:** Menggunakan mockup custom frame dengan video
          <div
            className="absolute inset-0 bg-transparent"
            ref={videoContainerRef}
          >
            {/* Tombol Join Grup */}
            <motion.div
              className="absolute -top-4 right-2 z-10 flex items-center transform -rotate-12 gap-1 rounded-full bg-yellow-100/80 p-1 shadow-md cursor-pointer hover:bg-yellow-200 transition-colors duration-300"
              onClick={handleWhatsAppClick}
            >
              <Sparkles className="inline-block h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-bold">
                <AnimatedGradientText className="animate-gradient bg-gradient-to-r from-[#ff4040] via-main to-[#ffaa40]">
                  Grup Belajar!
                </AnimatedGradientText>
              </span>
            </motion.div>
            <motion.div
              className="absolute -top-10 z-10 right-14 transform translate-x-1/2"
              initial={{ y: 0 }}
              animate={{ y: [-3, 3, -3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <PointerIcon
                fill="yellow"
                className="h-6 w-6 text-blue-500 transform rotate-180"
              />
            </motion.div>
            {/* Container Video */}
            <div className="absolute w-full h-full rounded-3xl shadow-md overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                {/* <video
                  ref={videoRef}
                  src="https://tklsekuymvxxcvnkifbx.supabase.co/storage/v1/object/public/dont-delete/tutorsnbt.webm"
                  loop
                  muted
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover object-top p-1 border-4 border-b-8 border-main rounded-3xl"
                /> */}
              </AspectRatio>
            </div>
          </div>
        )}
      </div>
      {/* Grid Pattern Background */}
      <div className="absolute left-0 top-0 z-[1] h-full w-full overflow-hidden">
        <GridPattern
          numSquares={50}
          maxOpacity={0.1}
          duration={3}
          repeatdelay={1}
          className="[mask-image:radial-gradient(ellipse_at_center,white_20%,transparent_95%)] h-full w-full"
        />
      </div>
    </div>
  );
};

export default HeroSection;
