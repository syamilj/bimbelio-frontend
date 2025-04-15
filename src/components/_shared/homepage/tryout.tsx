"use client";

import { cn } from "@/lib/utils";
import { IconFitur1, IconFitur2, IconFitur3 } from "@/styles/icon";
import { motion } from "framer-motion";
import {
  Award,
  Building2,
  Calendar,
  Clock,
  FileText,
  Sparkles,
  Users,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedGradientText from "../../magicui/animated-gradient-text";
import { Button } from "../../ui/button";
import { useSession } from "@/components/provider/session-provider-auth";

// Jika Kamu memilih untuk menggunakan UUID
// import { v4 as uuidv4 } from 'uuid';

interface TryoutProps {
  setShowAuth: (show: { signUp: boolean; login: boolean }) => void;
}

const Tryout: React.FC<TryoutProps> = ({ setShowAuth }) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleStartClick = () => {
    if (!session) {
      setShowAuth({ signUp: false, login: true });
    } else {
      router.push("/user/try-out");
    }
  };

  const timelineItems = [
    {
      id: "pendaftaran",
      icon: Calendar,
      title: "Pendaftaran",
      date: "1-8 Feb",
    },
    { id: "pelaksanaan", icon: Users, title: "Pelaksanaan", date: "9-12 Feb" },
    { id: "live-class", icon: Clock, title: "Live Class", date: "12 Feb" },
    { id: "hasil", icon: Award, title: "Hasil", date: "12 Feb" },
    // Atau gunakan uuid jika diperlukan
    // { id: uuidv4(), ... }
  ];

  const features = [
    { id: "analisis-360", icon: Sparkles, title: "Analisis 360°" },
    { id: "soal-standar", icon: FileText, title: "Soal Standar SNBT/UTBK" },
    { id: "hasil-pembahasan", icon: Building2, title: "Hasil & Pembahasan" },
    { id: "live-class-zoom", icon: Video, title: "Live Class (Zoom)" },
    // Atau gunakan uuid jika diperlukan
    // { id: uuidv4(), ... }
  ];

  const fitur = [
    {
      id: "fitur1",
      icon: <IconFitur1 w={80} />,
      text: "Pendamping belajar cermat",
      description: (
        <p className="font-regular mt-[-.5rem] text-[.85rem] text-main-gray-text">
          Gunakan metode strategi revolusi belajar yang{" "}
          <span className="font-medium text-main">terpersonalisasi</span>{" "}
          berdasarkan kemampuanmu.
        </p>
      ),
    },
    {
      id: "fitur2",
      icon: <IconFitur2 w={80} />,
      text: "Pembelajaran aktif dan terarah",
      description: (
        <p className="font-regular mt-[-.5rem] text-[.85rem] text-main-gray-text">
          Manfaatkan teknologi{" "}
          <span className="font-medium text-main">
            Active AI-Based Learning
          </span>{" "}
          untuk mendapatkan pendamping belajar yang interaktif dan efektif.
        </p>
      ),
    },
    {
      id: "fitur3",
      icon: <IconFitur3 w={80} />,
      text: "Akses materi variatif dan lengkap",
      description: (
        <p className="font-regular mt-[-.5rem] text-[.85rem] text-main-gray-text">
          Nikmati akses ke{" "}
          <span className="font-medium text-main">materi kurasi terbaru</span>{" "}
          yang variatif dan lengkap kapan saja, di mana saja dengan teknologi
          tertinggi.{" "}
        </p>
      ),
    },
  ];

  return (
    <div id="tryout" className="relative w-full gap-[5rem] py-8">
      <h1 className="mb-8 mt-2 text-center text-3xl font-bold">
        <AnimatedGradientText>Inovasi Belajar Berbasis AI</AnimatedGradientText>
      </h1>
      <motion.div
        className="relative z-10 mx-auto max-w-md px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative overflow-hidden rounded-2xl bg-white/50 p-6 shadow-md outline outline-main">
          <div className="relative z-10">
            <div
              className={cn(
                "absolute -top-6 right-2 mx-auto flex -rotate-12 transform items-center gap-1 rounded-full border border-yellow-200 bg-yellow-100/30 p-1 shadow-md"
              )}
            >
              <Sparkles className="inline-block h-4 w-4 fill-current text-yellow-400" />
              <span className="text-sm font-bold text-yellow-400">
                <AnimatedGradientText className="animate-gradient bg-gradient-to-r from-[#ffaa40] via-main to-[#ffaa40]">
                  GRATIS!
                </AnimatedGradientText>
              </span>
            </div>
            <motion.h1
              className="relative mb-8 mt-8 text-center text-2xl font-bold md:text-3xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <AnimatedGradientText>
                Try Out SNBT/UTBK Vol.2
              </AnimatedGradientText>
            </motion.h1>
            <motion.div
              className="mb-4 grid grid-cols-2 gap-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {timelineItems.map((item) => (
                <motion.div
                  key={item.id}
                  className="flex items-center space-x-2 rounded-xl border border-main bg-white p-2"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                  <div className="flex flex-1 items-center justify-between">
                    <span className="text-xs font-semibold text-blue-500">
                      {item.title}
                    </span>
                    <span className="text-xs text-blue-500">{item.date}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h4 className="mb-2 text-center text-sm font-bold text-blue-700">
                ✨ Apa yang kamu dapatkan? ✨
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature) => (
                  <motion.div
                    key={feature.id}
                    className="flex items-center space-x-2 rounded-xl border border-main bg-white p-2"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="h-4 w-4 flex-shrink-0 text-blue-500" />
                    <span className="text-xs font-medium text-blue-500">
                      {feature.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <Button
              className="mx-auto flex items-center justify-center rounded-full bg-greenUpgrade py-2 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-main hover:text-blue-100"
              onClick={handleStartClick}
            >
              Daftar Sekarang!
            </Button>
          </div>
        </div>
      </motion.div>
      <div
        id="fitur"
        className="mx-auto mt-[-2rem] grid w-full max-w-[1024px] grid-cols-1 gap-y-4 bg-transparent py-[3rem] md:mt-[0] md:grid-cols-3 md:gap-x-[1.5rem] md:gap-y-0"
      >
        {fitur.map((item) => (
          <div
            key={item.id} // Sekarang menggunakan id yang unik
            className="mx-[1rem] flex flex-col items-center justify-center gap-[1rem] rounded-[2rem] bg-white/50 p-[1rem] text-center md:gap-[1.5rem] lg:mx-[unset]"
          >
            {item.icon}
            <p className="font-bold">{item.text}</p>
            {item.description}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tryout;
