"use client";

import { useState } from "react";
import { useWebsiteSubCategory } from "@/components/provider/provider-website-category";
import { BimArena, BimCourse, BimLive, BimBrand } from "@/components/ui/bim-brand";
import {
  BookOpen,
  Target,
  Clock,
  CheckCircle,
  Search,
  Filter,
  MonitorPlay,
  PlayIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  ClockIcon,
  FileQuestionIcon,
  CheckIcon,
  ForwardIcon,
  ListIcon,
  InfoIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { website_sub_category_id } from "@/hooks/use-web-sub-category-id";
import { EmptyStateIllustrations } from "./EmptyStateIllustrations";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

interface BimLearningProgressProps {
  courses: Array<{
    id: string;
    name: string;
    category: string;
    progress: number;
    totalChapters: number;
    completedChapters: number;
    thumbnail: string | null;
  }>;
  tryouts: Array<{
    id: string;
    title: string;
    score: number | null;
    totalQuestions: number;
    answeredQuestions: number;
    status: "completed" | "in-progress" | "not-started";
    thumbnail: string | null;
    deadline: string | null;
    isCouponOnly?: boolean;
  }>;
  liveClasses: Array<{
    id: string;
    title: string;
    scheduleTime: string;
    duration: number;
    thumbnail: string | null;
    instructorName: string;
    instructorAvatar: string | null;
    isPremium: boolean;
    isRegistered: boolean;
  }>;
}

export default function BimLearningProgress({ courses, tryouts, liveClasses }: BimLearningProgressProps) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || "#0091FF";

  // Default tab to BimLive
  const [activeTab, setActiveTab] = useState<"live" | "courses" | "tryouts">("live");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "in-progress">("all");
  const [showBimPartnerInfo, setShowBimPartnerInfo] = useState(false);

  // Filter courses
  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(course => {
    if (filterStatus === "all") return true;
    if (filterStatus === "completed") return course.progress === 100;
    if (filterStatus === "in-progress") return course.progress > 0 && course.progress < 100;
    return true;
  });

  // Filter tryouts
  const filteredTryouts = tryouts.filter(tryout =>
    tryout.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(tryout => {
    if (filterStatus === "all") return true;
    if (filterStatus === "completed") return tryout.status === "completed";
    if (filterStatus === "in-progress") return tryout.status === "in-progress";
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            Selesai
          </span>
        );
      case "in-progress":
        return (
          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
            Sedang Berjalan
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            Belum Mulai
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-sm">
      {/* Header with Tabs */}
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-lg font-black text-slate-800">Progress Belajar</h2>

        <div className="inline-flex gap-2 bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-hide w-fit">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "live"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            <BimLive />
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "courses"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <BimCourse />
          </button>
          <button
            onClick={() => setActiveTab("tryouts")}
            className={`px-3 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "tryouts"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            <Target className="w-4 h-4" />
            <BimArena />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder={`Cari ${activeTab === "live" ? "BimLive" : activeTab === "courses" ? "BimCourse" : "BimArena"}...`}
            className="pl-10 h-10 rounded-full border-slate-200 bg-slate-50 focus:bg-white transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === "all"
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === "completed"
                ? "bg-emerald-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Selesai
          </button>
          <button
            onClick={() => setFilterStatus("in-progress")}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === "in-progress"
                ? "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Berlangsung
          </button>
        </div>
      </div>

      {/* Content - Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide -mx-6 px-6 py-4">
        {activeTab === "live" ? (
          liveClasses && liveClasses.length > 0 ? (
            <div className="flex gap-4 pb-4">
              {liveClasses.map((liveClass) => (
                <div
                  key={liveClass.id}
                  className="group relative rounded-2xl border-2 border-slate-100 overflow-hidden bg-white hover:border-slate-200 transition-all hover:shadow-lg flex-shrink-0 w-[280px]"
                >
                  {/* Thumbnail */}
                  <div className="relative h-96 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                    {liveClass.thumbnail ? (
                      <Image
                        src={liveClass.thumbnail}
                        alt={liveClass.title}
                        fill
                        className="object-cover h-full group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <MonitorPlay className="w-12 h-12 text-slate-400" />
                      </div>
                    )}

                    {/* Premium Badge */}
                    {liveClass.isPremium && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-yellow-500 text-white text-xs font-bold">
                        Premium
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-slate-900/80 text-white text-xs font-bold">
                      {liveClass.isRegistered ? 'Terdaftar' : 'Daftar'}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 mb-2">{liveClass.title}</h3>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-3">
                      {liveClass.instructorAvatar ? (
                        <Image
                          src={liveClass.instructorAvatar}
                          alt={liveClass.instructorName}
                          width={28}
                          height={28}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {liveClass.instructorName.charAt(0)}
                        </div>
                      )}
                      <span className="text-xs text-slate-600 font-medium">{liveClass.instructorName}</span>
                    </div>

                    {/* Schedule & Duration */}
                    <div className="space-y-1 text-xs text-slate-500">
                      <p>Jadwal: {new Date(liveClass.scheduleTime).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                      <p>Durasi: {liveClass.duration} menit</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <MonitorPlay className="w-16 h-16 text-slate-300 mb-4" />
              <p className="text-slate-500 text-center font-medium">Belum ada kelas live</p>
              <p className="text-slate-400 text-sm text-center mt-2">Kelas live akan ditampilkan di sini</p>
            </div>
          )
        ) : activeTab === "courses" ? (
          filteredCourses.length > 0 ? (
            <div className="flex gap-6 pb-4">
              {filteredCourses.map((course) => {
                const getStatusBadge = () => {
                  if (course.progress === 0) {
                    return (
                      <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                        <PlayIcon className="w-3 h-3 mr-1" />
                        Belum Dimulai
                      </Badge>
                    );
                  } else if (course.progress === 100) {
                    return (
                      <Badge className="bg-green-50 text-green-700 border-green-200 font-medium">
                        <CheckCircleIcon className="w-3 h-3 mr-1" />
                        Selesai
                      </Badge>
                    );
                  } else {
                    return (
                      <Badge className="bg-orange-50 text-orange-700 border-orange-200 font-medium">
                        <TrendingUpIcon className="w-3 h-3 mr-1" />
                        Berlangsung
                      </Badge>
                    );
                  }
                };

                return (
                  <div key={course.id} className="flex-shrink-0 w-[350px]">
                    <Card className="border-2 border-slate-100 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-visible h-full">
                      {/* Enhanced Progress Ring - Top Right */}
                      <div className="absolute -top-3 -right-3 z-10">
                        <div className="relative w-16 h-16">
                          {/* Background circle with shadow */}
                          <div className="absolute inset-0 bg-white rounded-full shadow-lg" />

                          {/* SVG Progress Ring */}
                          <svg
                            className="w-16 h-16 transform -rotate-90 relative z-10"
                            viewBox="0 0 36 36"
                          >
                            {/* Background track */}
                            <path
                              className="text-slate-200"
                              stroke="currentColor"
                              strokeWidth="3.5"
                              fill="transparent"
                              strokeDasharray="100, 100"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            {/* Progress arc */}
                            <path
                              stroke={mainColor}
                              strokeWidth="3.5"
                              fill="transparent"
                              strokeDasharray={`${Math.min(100, Math.round(course.progress || 0))}, 100`}
                              strokeLinecap="round"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              style={{
                                filter: `drop-shadow(0 2px 4px ${mainColor}40)`,
                              }}
                            />
                          </svg>

                          {/* Percentage Text */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span
                                className="text-xs font-black leading-none"
                                style={{ color: mainColor }}
                              >
                                {Math.min(100, Math.round(course.progress || 0))}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4 pr-16">
                          <div
                            className="w-12 h-12 rounded-3xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: mainColor }}
                          >
                            <BookOpen className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            {getStatusBadge()}
                            <CardTitle className="text-lg font-bold text-slate-900 mt-2 mb-1">
                              {course.name}
                            </CardTitle>
                            <p className="text-sm text-slate-600 line-clamp-2">
                              Tingkatkan kemampuan berpikir logis dan analitis untuk menghadapi tantangan SNBT
                            </p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6 pt-0 space-y-4">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-700">
                              Progress
                            </span>
                            <span className="font-bold text-slate-900">
                              {course.completedChapters}/{course.totalChapters} Sub Chapter
                            </span>
                          </div>
                          <Progress
                            value={course.progress}
                            className="h-2"
                            style={{
                              backgroundColor: `${mainColor}20`,
                            }}
                          />
                        </div>

                        {/* Stats Grid - Gradient Style */}
                        <div className="grid grid-cols-2 gap-3">
                          <div
                            className="p-4 rounded-3xl border-2"
                            style={{
                              background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
                              borderColor: 'rgb(191 219 254)',
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <ClockIcon className="w-4 h-4 text-blue-600" />
                              <span className="text-xs font-medium text-blue-600">
                                Bab
                              </span>
                            </div>
                            <div className="text-sm font-bold text-blue-700">
                              {course.totalChapters}
                            </div>
                          </div>

                          <div
                            className="p-4 rounded-3xl border-2"
                            style={{
                              background: `linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231))`,
                              borderColor: 'rgb(187 247 208)',
                            }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircleIcon className="w-4 h-4 text-green-600" />
                              <span className="text-xs font-medium text-green-600">
                                Selesai
                              </span>
                            </div>
                            <div className="text-sm font-bold text-green-700">
                              {course.completedChapters}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          {/* Detail Button */}
                          <Link
                            href={`/${website_sub_category_id}/user/bimcourse/${course.id}`}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full rounded-3xl border-2 border-slate-200 hover:border-slate-300"
                            >
                              <ListIcon className="w-4 h-4 mr-2" />
                              Detail
                            </Button>
                          </Link>

                          {/* Action Button based on progress */}
                          <Link
                            href={`/${website_sub_category_id}/user/bimcourse/${course.id}`}
                            className="flex-1"
                          >
                            {course.progress === 0 ? (
                              <Button
                                size="sm"
                                className="w-full rounded-3xl text-white border-0 font-semibold"
                                style={{ backgroundColor: mainColor }}
                              >
                                <PlayIcon className="w-4 h-4 mr-2" />
                                Mulai Belajar
                              </Button>
                            ) : course.progress === 100 ? (
                              <Button
                                size="sm"
                                className="w-full rounded-3xl bg-green-600 hover:bg-green-700 text-white border-0 font-semibold"
                              >
                                <CheckIcon className="w-4 h-4 mr-2" />
                                Selesai
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                className="w-full rounded-3xl bg-orange-600 hover:bg-orange-700 text-white border-0 font-semibold"
                              >
                                <ForwardIcon className="w-4 h-4 mr-2" />
                                Lanjutkan
                              </Button>
                            )}
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto mb-3">
                <EmptyStateIllustrations.NoCourses />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">
                {searchQuery ? "Tidak ada hasil" : <>Belum Ada <BimCourse /></>}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {searchQuery ? "Coba kata kunci lain" : <>Jelajahi <BimCourse /> yang tersedia dan mulai belajar</>}
              </p>
              {!searchQuery && (
                <Link
                  href={`/${website_sub_category_id}/user/bimcourse`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                  style={{ backgroundColor: mainColor }}
                >
                  Jelajahi <BimCourse />
                </Link>
              )}
            </div>
          )
        ) : (
          filteredTryouts.length > 0 ? (
            <div className="flex gap-4 pb-4">
              {filteredTryouts.map((tryout) => {
                const getStatusBadge = () => {
                  switch (tryout.status) {
                    case "completed":
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <CheckCircle className="w-3 h-3" />
                          Selesai
                        </span>
                      );
                    case "in-progress":
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          <Clock className="w-3 h-3" />
                          Berlangsung
                        </span>
                      );
                    default:
                      return (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <Target className="w-3 h-3" />
                          Belum Mulai
                        </span>
                      );
                  }
                };

                return (
                  <Link
                    key={tryout.id}
                    href={`/${website_sub_category_id}/user/bimarena/try-out/${tryout.id}`}
                    className="group relative bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all overflow-visible flex-shrink-0 w-[320px]"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-48 overflow-hidden rounded-t-3xl bg-slate-100">
                      {tryout.thumbnail ? (
                        <Image
                          src={tryout.thumbnail}
                          alt={tryout.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${mainColor}80)`,
                          }}
                        >
                          <Target className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}

                      {/* Score Badge - Top Right */}
                      {tryout.score && tryout.score > 0 && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white shadow-lg flex items-center gap-1.5 border" style={{ borderColor: mainColor }}>
                          <Target className="w-4 h-4" style={{ color: mainColor }} />
                          <span className="text-sm font-black" style={{ color: mainColor }}>
                            {Math.round(tryout.score)}
                          </span>
                        </div>
                      )}

                      {/* Coupon Only Badge */}
                      {tryout.isCouponOnly && (
                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                          <span>BimPartner</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setShowBimPartnerInfo(true);
                            }}
                            className="hover:bg-amber-600 rounded-full p-0.5 transition-colors"
                            title="Info BimPartner"
                          >
                            <InfoIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      {/* Status Badge - Bottom Left */}
                      <div className="absolute bottom-3 left-3">
                        {getStatusBadge()}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      {/* Title */}
                      <h3 className="font-bold text-base text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3rem]">
                        {tryout.title}
                      </h3>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Questions */}
                        <div
                          className="p-3 rounded-2xl border-2"
                          style={{
                            background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
                            borderColor: 'rgb(191 219 254)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">
                              Soal
                            </span>
                          </div>
                          <div className="text-lg font-black text-blue-700">
                            {tryout.totalQuestions}
                          </div>
                        </div>

                        {/* Answered */}
                        <div
                          className="p-3 rounded-2xl border-2"
                          style={{
                            background: `linear-gradient(to bottom right, rgb(255 247 237), rgb(254 237 213))`,
                            borderColor: 'rgb(254 215 170)',
                          }}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-orange-600" />
                            <span className="text-xs font-medium text-orange-600">
                              Terjawab
                            </span>
                          </div>
                          <div className="text-lg font-black text-orange-700">
                            {tryout.answeredQuestions}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-32 h-32 mx-auto mb-3">
                <EmptyStateIllustrations.NoTryouts />
              </div>
              <h3 className="text-lg font-black text-slate-800 mb-2">
                {searchQuery ? "Tidak ada hasil" : "Belum Ada Try Out"}
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {searchQuery ? "Coba kata kunci lain" : <>Mulai <BimArena /> untuk meningkatkan kemampuanmu</>}
              </p>
              {!searchQuery && (
                <Link
                  href={`/${website_sub_category_id}/user/bimarena/try-out`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white shadow-md hover:shadow-lg transition-all hover:scale-105"
                  style={{ backgroundColor: mainColor }}
                >
                  Mulai <BimArena />
                </Link>
              )}
            </div>
          )
        )}
      </div>

      {/* View All Link */}
      {((activeTab === "courses" && filteredCourses.length > 0) ||
        (activeTab === "tryouts" && filteredTryouts.length > 0)) && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <Link
            href={`/${website_sub_category_id}/user/${activeTab === "courses" ? "bimcourse" : "bimarena/try-out"}`}
            className="flex items-center justify-center gap-2 text-sm font-bold hover:gap-3 transition-all"
            style={{ color: mainColor }}
          >
            Lihat Semua {activeTab === "courses" ? <BimCourse /> : <BimArena />}
            <Target className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* BimPartner Info Dialog */}
      {showBimPartnerInfo && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowBimPartnerInfo(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-xl bg-amber-100">
                <InfoIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Apa itu BimPartner?</h3>
                <p className="text-sm text-slate-600">
                  BimPartner adalah program tryout eksklusif dari mitra resmi Bimbelio.
                </p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex gap-2 text-sm">
                <span className="text-amber-600 font-bold">•</span>
                <p className="text-slate-700">
                  Tryout ini <strong>hanya bisa diakses dengan kupon khusus</strong> yang diberikan oleh mitra Bimbelio
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowBimPartnerInfo(false)}
              className="w-full px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
