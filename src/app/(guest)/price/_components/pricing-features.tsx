"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { MessageSquare, FileText, PenTool, BookOpen, Eye } from "lucide-react";

export default function PricingFeatures() {
  // oi mill angkek telpon ambo taek
  const coinColors = {
    Notes: "#3385ff",
    Chat: "#0066ff",
    Quiz: "#0099ff",
    Tryout: "#0052cc",
    Vision: "#00b8ff",
  };
  const { websiteSubCategory } = useWebsiteSubCategory();

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6 text-main" />,
      title: "Chat Coin",
      description:
        "Gunakan untuk mengakses fitur chat dengan AI Tutor yang siap menjawab pertanyaanmu",
      color: coinColors.Chat,
      usage: "1 coin per chat",
      gradient: `linear-gradient(135deg, ${coinColors.Chat}, ${coinColors.Chat}dd)`,
    },
    {
      icon: <FileText className="h-6 w-6 text-main" />,
      title: "Tryout Coin",
      description:
        "Gunakan untuk mengakses tryout dengan format yang sama dengan ujian SNBT/UTBK",
      color: coinColors.Tryout,
      usage: "1 coin per tryout",
      gradient: `linear-gradient(135deg, ${coinColors.Tryout}, ${coinColors.Tryout}dd)`,
    },
    {
      icon: <PenTool className="h-6 w-6 text-main" />,
      title: "Notes Coin",
      description:
        "Gunakan untuk membuat catatan belajar dengan fitur AI yang membantu mengorganisir materi",
      color: coinColors.Notes,
      usage: "1 coin per notes",
      gradient: `linear-gradient(135deg, ${coinColors.Notes}, ${coinColors.Notes}dd)`,
    },
    {
      icon: <BookOpen className="h-6 w-6 text-main" />,
      title: "Quiz Coin",
      description:
        "Gunakan untuk mengakses quiz interaktif yang disesuaikan dengan kemampuanmu",
      color: coinColors.Quiz,
      usage: "1 coin per quiz",
      gradient: `linear-gradient(135deg, ${coinColors.Quiz}, ${coinColors.Quiz}dd)`,
    },
    {
      icon: <Eye className="h-6 w-6 text-main" />,
      title: "Vision Coin",
      description:
        "Gunakan untuk mengakses fitur AI Vision yang membantu menyelesaikan soal dari gambar",
      color: coinColors.Vision,
      usage: "1 coin per penggunaan",
      gradient: `linear-gradient(135deg, ${coinColors.Vision}, ${coinColors.Vision}dd)`,
    },
  ];

  return (
    <div className="mt-20">
      <div className="text-center mb-12">
        <div className="inline-block bg-main/10 text-main rounded-full px-4 py-1 text-sm font-medium mb-4">
          Jenis Coin
        </div>
        <h2 className="text-3xl font-bold text-[#0a2540] mb-4">
          5 Jenis Coin untuk Fitur Berbeda
        </h2>
        <p className="text-[#4a5568] max-w-2xl mx-auto">
          TutorSNBT menggunakan 5 jenis coin berbeda untuk mengakses fitur-fitur
          interaktif yang akan membantu persiapan ujianmu
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex flex-col transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center mb-4">
              {feature.icon}
              <h3 className="text-xl font-semibold text-[#0a2540] ml-3">
                {feature.title}
              </h3>
            </div>
            <p className="text-[#4a5568] mb-6">{feature.description}</p>

            <div className="mt-auto pt-4 border-t border-gray-100">
              <div
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  backgroundColor: `${websiteSubCategory?.main_color}10`,
                }}
              >
                <div className="flex items-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke={websiteSubCategory?.main_color}
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="6"
                      fill={websiteSubCategory?.main_color}
                    />
                  </svg>
                  <span className="text-sm font-medium text-main">
                    Biaya penggunaan
                  </span>
                </div>
                <span
                  className="font-medium text-lg"
                  style={{ color: websiteSubCategory?.main_color }}
                >
                  {feature.usage}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-64 h-64 opacity-5"
          style={{
            background: `radial-gradient(circle, #0066ff 0%, transparent 70%)`,
            transform: "translate(20%, -30%)",
          }}
        ></div>
        <h3 className="text-2xl font-bold mb-6 text-[#0a2540]">
          Cara Kerja Sistem Coin
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-semibold mb-4 text-[#0a2540]">
              Penggunaan Coin
            </h4>
            <ul className="space-y-4">
              {[
                "Setiap fitur memerlukan jenis coin tertentu untuk digunakan",
                "Semakin tinggi paket berlangganan, semakin sedikit coin yang diperlukan",
                "Semua jenis coin akan tidak memiliki expire dan akan tereset kembali jika mencapai limit",
                "Coin tambahan dapat dibeli kapan saja",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 shrink-0 shadow-sm bg-gradient">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 12L10 17L20 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-[#4a5568]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-4 text-[#0a2540]">
              Contoh Penggunaan
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0]">
                <div className="flex items-center">
                  <MessageSquare
                    className="h-5 w-5 mr-3 text-main"
                    // style={{ color: coinColors.Chat }}
                  />
                  <span className="text-[#0a2540] font-medium">
                    1x Chat dengan AI Tutor
                  </span>
                </div>
                <span className="font-medium text-main bg-main/10 px-3 py-1 rounded-lg">
                  1 chat coin
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0]">
                <div className="flex items-center">
                  <FileText
                    className="h-5 w-5 mr-3 text-main"
                    // style={{ color: coinColors.Tryout }}
                  />
                  <span className="text-[#0a2540] font-medium">
                    1x Tryout Lengkap
                  </span>
                </div>
                <span className="font-medium text-main bg-main/10 px-3 py-1 rounded-lg">
                  1 tryout coin
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0]">
                <div className="flex items-center">
                  <PenTool
                    className="h-5 w-5 mr-3 text-main"
                    // style={{ color: coinColors.Notes }}
                  />
                  <span className="text-[#0a2540] font-medium">
                    1x Notes AI
                  </span>
                </div>
                <span className="font-medium text-main bg-main/10 px-3 py-1 rounded-lg">
                  1 notes coin
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0]">
                <div className="flex items-center">
                  <BookOpen
                    className="h-5 w-5 mr-3 text-main"
                    // style={{ color: coinColors.Quiz }}
                  />
                  <span className="text-[#0a2540] font-medium">
                    1x Quiz Latihan
                  </span>
                </div>
                <span className="font-medium text-main bg-main/10 px-3 py-1 rounded-lg">
                  1 quiz coin
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f8fafc] rounded-xl shadow-sm border border-[#e2e8f0]">
                <div className="flex items-center">
                  <Eye
                    className="h-5 w-5 mr-3 text-main"
                    // style={{ color: coinColors.Vision }}
                  />
                  <span className="text-[#0a2540] font-medium">
                    1x Penggunaan Vision AI
                  </span>
                </div>
                <span className="font-medium text-main bg-main/10 px-3 py-1 rounded-lg">
                  1 vision coin
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
