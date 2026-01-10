"use client";

import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { Sparkles } from "lucide-react";

interface WelcomeSectionProps {
  userName: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const firstName = userName?.split(" ")[0] || "User";

  return (
    <div className="flex items-center gap-2">
      <Sparkles className="w-5 h-5" style={{ color: mainColor }} />
      <div>
        <p className="text-sm text-gray-500">{getGreeting()},</p>
        <h1 className="text-lg font-semibold text-gray-900">{firstName}</h1>
      </div>
    </div>
  );
}
