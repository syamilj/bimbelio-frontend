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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { website_sub_category_id } from "@/hooks/use-web-sub-category-id";
import { EmptyStateIllustrations } from "./EmptyStateIllustrations";
import { Input } from "@/components/ui/input";

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

        <div className="flex gap-2 bg-slate-100 p-1 rounded-full overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "live"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <MonitorPlay className="w-4 h-4" />
            <BimLive />
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "courses"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <BimCourse />
          </button>
          <button
            onClick={() => setActiveTab("tryouts")}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "tryouts"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
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

      {/* Content - Horizontal Scroll for Mobile, Grid for Desktop */}
      <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
        {activeTab === "live" ? (
          liveClasses && liveClasses.length > 0 ? (
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
              {liveClasses.map((liveClass) => (
                <div
                  key={liveClass.id}
                  className="group relative rounded-3xl border-2 border-slate-100 overflow-hidden bg-white hover:border-slate-200 transition-all hover:shadow-lg flex-shrink-0 w-[280px] md:w-auto"
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
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
              {filteredCourses.map((course) => {
                const getStatusBadge = () => {
                  if (course.progress === 0) {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                        <Clock className="w-3 h-3" />
                        Belum Dimulai
                      </span>
                    );
                  } else if (course.progress === 100) {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Selesai
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200">
                        <Target className="w-3 h-3" />
                        Berlangsung
                      </span>
                    );
                  }
                };

                return (
                  <Link
                    key={course.id}
                    href={`/${website_sub_category_id}/user/bimcourse/${course.id}`}
                    className="group relative bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all overflow-hidden flex-shrink-0 w-[280px] md:w-auto"
                  >
                    {/* Progress Ring - Top Right */}
                    <div className="absolute -top-2 -right-2 z-10">
                      <div className="relative w-14 h-14">
                        <div className="absolute inset-0 bg-white rounded-full shadow-md" />
                        <svg className="w-14 h-14 transform -rotate-90 relative z-10" viewBox="0 0 36 36">
                          <path
                            className="text-slate-200"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray="100, 100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            stroke={mainColor}
                            strokeWidth="3"
                            fill="transparent"
                            strokeDasharray={`${course.progress}, 100`}
                            strokeLinecap="round"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-black" style={{ color: mainColor }}>
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative h-36 overflow-hidden bg-slate-100">
                      {course.thumbnail ? (
                        <Image
                          src={course.thumbnail}
                          alt={course.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${mainColor}80)`,
                          }}
                        >
                          <BookOpen className="w-12 h-12 text-white opacity-50" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Status Badge */}
                      <div>{getStatusBadge()}</div>

                      {/* Title & Category */}
                      <div>
                        <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors mb-1">
                          {course.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium">
                          {course.category}
                        </p>
                      </div>

                      {/* Progress Info */}
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-3.5 h-3.5 opacity-70" />
                        <span className="font-bold">
                          {course.completedChapters}/{course.totalChapters} Bab Selesai
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${course.progress}%`,
                            backgroundColor: mainColor,
                          }}
                        />
                      </div>
                    </div>
                  </Link>
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
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide">
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
                    className="group relative bg-white rounded-3xl border-2 border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all overflow-hidden flex-shrink-0 w-[280px] md:w-auto"
                  >
                    {/* Score Badge - Top Right (if completed) */}
                    {tryout.score && tryout.score > 0 && (
                      <div className="absolute -top-2 -right-2 z-10">
                        <div className="bg-white rounded-full shadow-md px-3 py-2 flex items-center gap-1 border-2" style={{ borderColor: mainColor }}>
                          <Target className="w-3.5 h-3.5" style={{ color: mainColor }} />
                          <span className="text-xs font-black" style={{ color: mainColor }}>
                            {tryout.score}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Thumbnail */}
                    <div className="relative h-36 overflow-hidden bg-slate-100">
                      {tryout.thumbnail ? (
                        <Image
                          src={tryout.thumbnail}
                          alt={tryout.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${mainColor}, ${mainColor}80)`,
                          }}
                        >
                          <Target className="w-12 h-12 text-white opacity-50" />
                        </div>
                      )}
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Status Badge */}
                      <div>{getStatusBadge()}</div>

                      {/* Title */}
                      <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {tryout.title}
                      </h3>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {/* Questions */}
                        <div
                          className="p-2 rounded-xl border text-center"
                          style={{
                            background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
                            borderColor: 'rgb(191 219 254)',
                          }}
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-600 mx-auto mb-0.5" />
                          <div className="text-xs font-bold text-blue-700">
                            {tryout.totalQuestions}
                          </div>
                          <div className="text-[10px] text-blue-600 font-medium">
                            Soal
                          </div>
                        </div>

                        {/* Deadline or Progress */}
                        <div
                          className="p-2 rounded-xl border text-center"
                          style={{
                            background: tryout.deadline
                              ? `linear-gradient(to bottom right, rgb(255 247 237), rgb(254 237 213))`
                              : `linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231))`,
                            borderColor: tryout.deadline ? 'rgb(254 215 170)' : 'rgb(187 247 208)',
                          }}
                        >
                          <Clock className={`w-3.5 h-3.5 mx-auto mb-0.5 ${tryout.deadline ? 'text-orange-600' : 'text-green-600'}`} />
                          <div className={`text-xs font-bold ${tryout.deadline ? 'text-orange-700' : 'text-green-700'}`}>
                            {tryout.answeredQuestions}
                          </div>
                          <div className={`text-[10px] font-medium ${tryout.deadline ? 'text-orange-600' : 'text-green-600'}`}>
                            Terjawab
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
    </div>
  );
}
