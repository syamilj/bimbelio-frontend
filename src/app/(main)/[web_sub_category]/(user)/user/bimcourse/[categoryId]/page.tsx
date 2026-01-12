'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { LoadingRetro } from '@/components/ui/loading-retro';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronRight, FileText, Lock, PlayCircle, Search, Trophy, Zap, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useProvider } from './_provider/provider';
import LeftComponent from './_component/left-component';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { differenceInCalendarDays } from 'date-fns';

export default function CourseOverviewPage() {
  const {
    useData: { Course, CourseLoading, CourseProgress, CourseAnalytics },
  } = useProvider();

  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  if (CourseLoading) return <LoadingRetro />;
  if (!Course && !CourseLoading) return <div className="p-8 text-center">Course data not found</div>;
  if (Course?.length === 0) return <div className="p-8 text-center">Belum ada materi</div>;

  // Filter Logic
  const filteredCourse = Course?.map((chapter) => ({
    ...chapter,
    CourseSubChapter: chapter.CourseSubChapter.filter((sub) =>
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  })).filter(
    (chapter) =>
      chapter.CourseSubChapter.length > 0 ||
      chapter.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Calculate real stats based on CourseProgress
  let totalSubChapters = 0;
  let completedCount = 0;
  let videoCount = 0;
  let videoCompleted = 0;
  let quizCount = 0;
  let quizCompleted = 0;

  // Use Analytics Data if available for Summary
  const analyticsSummary = CourseAnalytics?.summary || {};
  let totalSpendTime = analyticsSummary.totalMinutes || 0; // Use Server Calculation if avail

  // Initial Score Data from Analytics if available (more complete than local iteration)
  let scoreData: any[] = [];
  if (CourseAnalytics?.history && Array.isArray(CourseAnalytics.history)) {
      scoreData = CourseAnalytics.history.map((h: any) => ({
          name: h.title.substring(0, 10) + (h.title.length > 10 ? '...' : ''),
          fullName: h.title,
          score: Number(h.score)
      }));
  }

  const progressSet = new Set<string>();
  if (Array.isArray(CourseProgress)) {
      CourseProgress.forEach((p: any) => {
          if (p.courseSubChapterId) progressSet.add(p.courseSubChapterId);
      });
  }

  Course?.forEach(c => {
    totalSubChapters += c.CourseSubChapter.length;
    c.CourseSubChapter.forEach(s => {
        // Only use progressSet to avoid counting duplicates from s.CourseProgress relation
        const isCompleted = progressSet.has(s.id);

        // Count local check if analytics not ready
        if (!analyticsSummary.totalMinutes) {
             const time = s.spendTime || 0;
             if (isCompleted) totalSpendTime += time;
        }

        if (isCompleted) completedCount++;

        // Robust Type Checking for Stats
        // Video: Explicit Type OR has video link in 'video' field OR Document has videoId
        const hasVideo = s.type === 'VIDEO' ||
                         (typeof s.video === 'string' && s.video.length > 5) ||
                         (s.Document && !!s.Document.videoId);  // Check relation

        if (hasVideo) {
            videoCount++;
            if (isCompleted) videoCompleted++;
        }

        // Quiz: TRYOUT, PROGRESS_TEST, or presence of Tryout Session ID
        const isQuiz = s.type === 'TRYOUT' || s.type === 'PROGRESS_TEST' || !!s.tryoutSessionId;
        if (isQuiz) {
            quizCount++;
            if (isCompleted) quizCompleted++;

            // If Analytics History is empty/loading, fallback to local check
            if (scoreData.length === 0 && s.CourseProgress && s.CourseProgress.length > 0) {
                 const score = s.CourseProgress[0].totalScore;
                 if (typeof score === 'number' || typeof score === 'string') {
                    scoreData.push({
                        name: s.title.substring(0, 10) + (s.title.length > 10 ? '...' : ''),
                        fullName: s.title,
                        score: Number(score),
                    });
                 }
            }
        }
    });
  });

  const totalProgress = totalSubChapters > 0 ? Math.round((completedCount / totalSubChapters) * 100) : 0;

  // Real Streak Calculation
  let currentStreak = 0;
  if (Array.isArray(CourseProgress) && CourseProgress.length > 0) {
      // Get unique dates from progress
      const uniqueDates = Array.from(new Set(CourseProgress.map((p: any) => {
          const d = new Date(p.createdAt);
          return d.toISOString().split('T')[0]; // YYYY-MM-DD
      }))).sort().reverse(); // Descending

      if (uniqueDates.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

          // Check if streak is active (activity today or yesterday)
          if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
              currentStreak = 1;
              for (let i = 0; i < uniqueDates.length - 1; i++) {
                 const currDate = new Date(uniqueDates[i]);
                 const prevDate = new Date(uniqueDates[i+1]);
                 if (differenceInCalendarDays(currDate, prevDate) === 1) {
                     currentStreak++;
                 } else {
                     break;
                 }
              }
          }
      }
  }

  const handleStartLearning = () => {
    // Navigate to the first available content
    const firstChapter = Course?.[0];
    const firstSub = firstChapter?.CourseSubChapter?.[0];
    if (firstSub) {
      router.push(`${pathname}/study?sub=${firstSub.id}&tab=chat`);
    } else {
        // Fallback if no content
        router.push(`${pathname}/study`);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-8 min-h-screen pb-32">

      {/* Search & Filter Bar - Improved */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border-2 border-slate-100 shadow-sm">
         <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
               placeholder="Cari materi pembelajaran..."
               className="pl-12 h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white transition-all text-base"
               value={searchQuery}
               onChange={e => setSearchQuery(e.target.value)}
            />
         </div>
         <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <Badge className="h-10 px-4 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 cursor-pointer border-indigo-100 text-sm whitespace-nowrap">
                Semua Materi
             </Badge>
             <Badge className="h-10 px-4 rounded-xl bg-white text-slate-600 border-2 border-slate-100 hover:bg-slate-50 cursor-pointer text-sm whitespace-nowrap">
                <PlayCircle className="w-3.5 h-3.5 mr-2" /> Video
             </Badge>
             <Badge className="h-10 px-4 rounded-xl bg-white text-slate-600 border-2 border-slate-100 hover:bg-slate-50 cursor-pointer text-sm whitespace-nowrap">
                <Trophy className="w-3.5 h-3.5 mr-2" /> Latihan Soal
             </Badge>
         </div>
      </div>



      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content: Chapter List */}
        <div className="lg:col-span-2 space-y-8">

           {/* Course Title Card */}
           <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-bl from-blue-50 to-transparent rounded-bl-full -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                 <div className="flex flex-col md:flex-row justify-between gap-6">
                     <div className="flex-1">
                        <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">Module Pilihan</Badge>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-3">{Course?.[0]?.title}</h1>
                        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
                            Selesaikan semua chapter di bawah ini untuk menguasai skill baru dan mendapatkan sertifikat penyelesaian.
                        </p>
                     </div>

                     {/* Graphic / Chart Area - Replaced with Recharts */}
                     <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm self-start w-full md:w-auto overflow-hidden">
                        {scoreData.length > 0 ? (
                            <div className="flex flex-col">
                                <div className="flex items-center justify-between mb-2 gap-8">
                                    <div>
                                        <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-emerald-600" />
                                            Grafik Nilai
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium">Riwayat skor Tryout & Quiz</div>
                                    </div>
                                    <div className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        Max: {Math.max(...scoreData.map(d => d.score))}
                                    </div>
                                </div>
                                <div className="h-32 w-full md:w-72 mt-2 -ml-2">
                                     <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={scoreData.slice(-5)}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis dataKey="name" tick={{fontSize: 9}} axisLine={false} tickLine={false} interval={0} />
                                            <Tooltip
                                                cursor={{fill: '#f1f5f9'}}
                                                contentStyle={{borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                                itemStyle={{fontSize: '12px', fontWeight: 'bold', color: '#0f172a'}}
                                                labelStyle={{fontSize: '10px', color: '#64748b', marginBottom: '4px'}}
                                             />
                                            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                                {scoreData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.score >= 75 ? '#10b981' : entry.score >= 50 ? '#f59e0b' : '#ef4444'} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                     </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                             /* Fallback to Circular Progress if no scores yet */
                             <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 shrink-0">
                                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                                        <path className="text-slate-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor" strokeLinecap="round" />
                                        <path className="text-blue-500 transition-all duration-1000 ease-out" strokeDasharray={`${totalProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" stroke="currentColor" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-blue-600">
                                        {totalProgress}%
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Progress Belajar</div>
                                    <div className="text-xs text-slate-500 font-medium mt-0.5">{completedCount} dari {totalSubChapters} Selesai</div>
                                </div>
                             </div>
                        )}
                     </div>
                 </div>

                 <div className="mt-8 flex flex-col gap-5">
                    {/* Stats Row Details - Above Button */}
                    <div className="flex flex-wrap items-center gap-3">
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-indigo-100">
                           <PlayCircle className="w-4 h-4" /> {videoCount} Video
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-100">
                           <Trophy className="w-4 h-4" /> {quizCount} Quiz
                         </div>
                         <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold uppercase tracking-wider border border-orange-100">
                           <BookOpen className="w-4 h-4" /> {totalSubChapters} Materi
                         </div>
                    </div>

                    <Button onClick={handleStartLearning} size="lg" className="w-full sm:w-auto rounded-2xl font-bold h-12 px-8 text-base shadow-lg shadow-blue-500/20 hover:translate-y-0.5 transition-all" style={{ backgroundColor: mainColor }}>
                       Lanjut Belajar
                    </Button>
                 </div>
              </div>
           </div>

           {/* Chapter Accordions */}
           {filteredCourse?.map((chapter, index) => (
             <div key={chapter.id} className="space-y-4">
                <div className="flex items-center gap-4 px-2">
                   <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-sm">
                      {index + 1}
                   </div>
                   <h2 className="text-xl font-bold text-slate-800">{chapter.title}</h2>
                </div>

                {/* Subchapter List: Horizontal Scroll on Mobile, Grid on Desktop */}
                <div className="flex flex-row overflow-x-auto pb-6 -mx-4 px-4 gap-4 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-4 md:pb-0 md:overflow-visible md:mx-0 md:px-0">
                   {chapter.CourseSubChapter.map((sub) => {
                      // Only use progressSet to avoid counting duplicates
                      const isSubCompleted = progressSet.has(sub.id);

                      // Logic Image: User confirms NO YouTube. All logic priorities document.img
                      // "kalo yang dokumennya ada video maka gambar video dulu" -> implies using Document.img which acts as thumbnail
                      let displayImage = null;
                      if (sub.Document?.img) {
                          displayImage = `${process.env.NEXT_PUBLIC_SUPABASE_IMG_URL}/document/${sub.Document.img}`;
                      }

                      return (
                      <div
                        key={sub.id}

                        // Mobile: Snap item, fixed width. Desktop: auto width.
                        className="snap-center shrink-0 w-[85vw] sm:w-[320px] md:w-auto h-full"
                      >
                      <div
                        onClick={() => router.push(`${pathname}/study?sub=${sub.id}&tab=chat`)}
                        className="group relative bg-white rounded-2xl border-2 border-slate-100 overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer flex flex-col h-full active:scale-95 touch-manipulation"
                      >
                         {/* Thumbnail / Placeholder */}
                         <div className="h-36 sm:h-32 bg-slate-100 relative overflow-hidden">
                             {/* Image or Gradient */}
                             {displayImage ? (
                                <img
                                    src={displayImage}
                                    alt={sub.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                        e.currentTarget.parentElement?.classList.add('bg-linear-to-br', 'from-slate-200', 'to-slate-300');
                                    }}
                                />
                             ) : (
                                <div className={cn(
                                    "absolute inset-0 bg-linear-to-br opacity-80 transition-transform duration-500 group-hover:scale-110",
                                    sub.type === 'VIDEO' ? "from-indigo-400 to-purple-500" :
                                    sub.type === 'TRYOUT' ? "from-emerald-400 to-teal-500" :
                                    "from-orange-400 to-pink-500"
                                )} />
                             )}

                             {/* Dark Overlay for better text/icon visibility if image exists */}
                             {sub.Document?.img && <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />}

                             {/* Icon Overlay */}
                             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-sm ring-1 ring-white/40">
                                   {sub.type === 'VIDEO' ? <PlayCircle className="w-6 h-6 fill-current" /> :
                                    sub.type === 'TRYOUT' ? <Trophy className="w-6 h-6" /> :
                                    <FileText className="w-6 h-6" />}
                                </div>
                             </div>

                             {/* Lock Status or Progress Status */}
                             <div className="absolute top-3 right-3 flex gap-2">
                                {isSubCompleted && (
                                    <div className="h-7 px-2 rounded-full bg-emerald-500/90 backdrop-blur-md flex items-center gap-1 text-white shadow-sm" title="Sudah dikerjakan">
                                        <Zap className="w-3.5 h-3.5 fill-current" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Selesai</span>
                                    </div>
                                )}
                                {sub.premium && !isSubCompleted && (
                                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white">
                                       <Lock className="w-4 h-4" />
                                    </div>
                                )}
                             </div>
                         </div>

                         <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-bold text-slate-800 text-sm sm:text-base group-hover:text-blue-600 transition-colors line-clamp-2 mb-3 leading-snug">
                               {sub.title}
                            </h3>
                            <div className="mt-auto flex items-center justify-between text-xs text-slate-500 font-medium">
                               <span className={cn(
                                   "flex items-center gap-1.5 px-2 py-1 rounded-md",
                                   sub.type === 'VIDEO' ? "bg-indigo-50 text-indigo-600" :
                                   sub.type === 'TRYOUT' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                               )}>
                                 {sub.type === 'VIDEO' ? <PlayCircle className="w-3.5 h-3.5" /> :
                                  sub.type === 'TRYOUT' ? <Trophy className="w-3.5 h-3.5" /> :
                                  <FileText className="w-3.5 h-3.5" />}
                                 {sub.type}
                               </span>
                               {/* <span className="text-slate-400">10 min</span> */}
                            </div>
                         </div>
                      </div>
                      </div>
                   )})}
                </div>
             </div>
           ))}
        </div>

        {/* Right Sidebar: Stats & Info - Hidden on Mobile */}
        <div className="space-y-6 hidden lg:block">
           <Card className="rounded-3xl border-2 border-slate-100 shadow-none p-6 bg-white sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                    <TrendingUp className="w-5 h-5" />
                 </div>
                 <div>
                    <h3 className="font-bold text-slate-800 text-lg leading-none">Statistik Belajar</h3>
                    <p className="text-xs text-slate-500 font-medium mt-1">Update terakhir: Hari ini</p>
                 </div>
              </div>

              <div className="space-y-6">
                   {/* Video Stats */}
                 {(videoCount > 0) && (
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-sm font-bold text-slate-700">Video Progress</span>
                       <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">{videoCompleted}/{videoCount} Files</span>
                    </div>
                    <Progress value={videoCount > 0 ? (videoCompleted / videoCount) * 100 : 0} className="h-3 bg-slate-100 rounded-full" classNameThumb="bg-indigo-500" />
                 </div>
                 )}

                 {/* Quiz Stats */}
                 {(quizCount > 0) && (
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-sm font-bold text-slate-700">Quiz Progress</span>
                       <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">{quizCompleted}/{quizCount} Sesi</span>
                    </div>
                    <Progress value={quizCount > 0 ? (quizCompleted / quizCount) * 100 : 0} className="h-3 bg-slate-100 rounded-full" classNameThumb="bg-emerald-500" />
                 </div>
                 )}

                 {/* Score Average Badge (New) */}
                 {scoreData.length > 0 && (
                     <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between">
                         <div>
                             <div className="text-xs font-bold text-slate-500">Rata-rata Nilai</div>
                             <div className="text-xl font-black text-slate-800">
                                {Math.round(scoreData.reduce((acc, curr) => acc + curr.score, 0) / scoreData.length)}
                             </div>
                         </div>
                         <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                             {scoreData.length >= 5 ? 'A' : 'B'}
                         </div>
                     </div>
                 )}

                 {/* Material/Document Stats (Fallback if no video/quiz or specific docs exist) */}
                 {(videoCount === 0 && quizCount === 0 && totalSubChapters > 0) && (
                 <div>
                    <div className="flex justify-between items-end mb-2">
                       <span className="text-sm font-bold text-slate-700">Materi Progress</span>
                       <span className="text-xs font-bold bg-orange-50 text-orange-600 px-2 py-1 rounded-md">{completedCount}/{totalSubChapters} Chapter</span>
                    </div>
                    <Progress value={(completedCount / totalSubChapters) * 100} className="h-3 bg-slate-100 rounded-full" classNameThumb="bg-orange-500" />
                 </div>
                 )}
              </div>

              <div className="mt-8 pt-6 border-t-2 border-slate-50 space-y-4">
                   {/* Target Mingguan */}
                   <div className="bg-slate-50 rounded-2xl p-4">
                      <h4 className="font-bold text-slate-800 mb-2 text-sm flex items-center gap-2">
                         <Target className="w-4 h-4 text-slate-400" />
                         Target Mingguan
                      </h4>
                      <div className="flex items-center gap-3">
                         <div className="text-3xl font-black text-slate-800">{totalProgress}%</div>
                         <p className="text-xs text-slate-500 leading-tight">
                            Module terselesaikan. Semangat lanjut belajar!
                         </p>
                      </div>
                   </div>

                   {/* Badges / Gamification (New) */}
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-indigo-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 mb-2 shadow-sm">
                               <Zap className="w-4 h-4 fill-current" />
                           </div>
                           <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">Streak</div>
                           <div className="text-sm font-black text-indigo-700">{currentStreak} Hari</div>
                       </div>
                       <div className="bg-orange-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                           <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-orange-600 mb-2 shadow-sm">
                               <TrendingUp className="w-4 h-4" />
                           </div>
                           <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wide">Waktu Belajar</div>
                           <div className="text-sm font-black text-orange-700">{Math.round(totalSpendTime)} Menit</div>
                       </div>
                   </div>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}
