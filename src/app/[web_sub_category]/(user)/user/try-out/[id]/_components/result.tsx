// 'use client';

// import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import ReactMarkdown from '@/components/ui/react-markdown';
// import { SpinnerPageCentered } from '@/components/ui/spinner';
// import { motion } from 'framer-motion';
// import {
//   Award,
//   BarChart3,
//   BookOpen,
//   CheckCircle2,
//   Clock,
//   Download,
//   Home,
//   Medal,
//   Star,
//   Target,
//   TrendingUp,
//   Trophy,
//   Users,
// } from 'lucide-react';
// import { useState } from 'react';

// import { cn, replaceLatexNotation } from '@/lib/utils';
// import {
//   TryoutAnswer,
//   TryoutQuestion,
//   TryoutSession,
//   TryoutSessionParticipant,
//   TryoutUserAnswer,
// } from '@/types/database';
// import 'katex/dist/katex.min.css';

// interface QuestionWithAnswers extends TryoutQuestion {
//   TryoutAnswers: TryoutAnswer[];
// }

// interface UserAnswerWithAnswerQuestion extends TryoutUserAnswer {
//   TryoutAnswers: TryoutAnswer | null;
//   TryoutQuestion: QuestionWithAnswers;
// }

// interface SessionResult extends TryoutSessionParticipant {
//   TryoutSession: TryoutSession;
//   TryoutUserAnswer: UserAnswerWithAnswerQuestion[];
// }

// interface ResultProps {
//   sessionResult: SessionResult;
//   isLoading: boolean;
//   resultDate: Date;
//   assessmentType: string;
// }

// const TryoutResult = ({
//   sessionResult,
//   isLoading,
//   resultDate,
//   assessmentType,
// }: ResultProps) => {
//   const { data: session } = useSession();
//   const { websiteSubCategory } = useWebsiteSubCategory();
//   const [activeTab, setActiveTab] = useState<
//     'overview' | 'detailed' | 'analysis'
//   >('overview');

//   // Get dynamic colors
//   const mainColor = websiteSubCategory?.main_color || '#0091FF';
//   const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

//   if (isLoading) return <SpinnerPageCentered />;

//   const getIsCorrect = (userAnswerIndex: number): boolean => {
//     if (!sessionResult) return false;

//     const userAnswer = sessionResult.TryoutUserAnswer[userAnswerIndex];
//     if (!userAnswer || !userAnswer.TryoutAnswers) return false;

//     switch (assessmentType) {
//       case '1-5':
//       case '+5/0':
//         return userAnswer.TryoutAnswers.value === 5;
//       case 'IRT':
//         const weight =
//           sessionResult.TryoutUserAnswer.find(
//             (item) => item.TryoutAnswers?.value !== 0,
//           )?.TryoutAnswers?.value || 0;
//         return userAnswer.TryoutAnswers.value === weight;
//       case '+4/-1/0':
//         return userAnswer.TryoutAnswers.value === 4;
//       default:
//         return false;
//     }
//   };

//   const correctAnswer =
//     sessionResult?.TryoutUserAnswer.filter((item) =>
//       getIsCorrect(sessionResult.TryoutUserAnswer.indexOf(item)),
//     ).length || 0;

//   const showResult = new Date(resultDate) < new Date();

//   const getSessionDuration = (): string => {
//     if (!sessionResult.endSession) return 'Coming Soon';
//     const startSession = new Date(sessionResult.startSession);
//     const endSession = new Date(sessionResult.endSession);
//     const diffInMilliseconds = endSession.getTime() - startSession.getTime();
//     const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
//     const minutes = Math.floor(diffInSeconds / 60);
//     const seconds = diffInSeconds % 60;
//     return `${minutes.toString().padStart(2, '0')}:${seconds
//       .toString()
//       .padStart(2, '0')}`;
//   };

//   const getFinalScore = () => {
//     const thresholdValue = sessionResult.TryoutSession.thresholdValue || null;
//     const total = sessionResult.TryoutUserAnswer.reduce(
//       (acc, item) => acc + (item.TryoutAnswers?.value || 0),
//       0,
//     );
//     const totalCorrect = sessionResult.TryoutUserAnswer.filter((_, i) =>
//       getIsCorrect(i),
//     ).length;
//     const accuracy = (
//       (totalCorrect / sessionResult.TryoutUserAnswer.length) *
//       100
//     ).toFixed(2);
//     return { total, accuracy, thresholdValue };
//   };

//   const percentage =
//     (getFinalScore().total / (sessionResult.TryoutSession.maxScore || 1)) * 100;
//   const isAboveAverage =
//     getFinalScore().total > (sessionResult.TryoutSession.averageScore || 0);

//   const getRankBadge = () => {
//     if (sessionResult.rank <= 3) {
//       const badges = {
//         1: {
//           color: 'from-yellow-400 to-yellow-600',
//           icon: Trophy,
//           label: 'JUARA 1',
//         },
//         2: {
//           color: 'from-gray-300 to-gray-500',
//           icon: Medal,
//           label: 'JUARA 2',
//         },
//         3: {
//           color: 'from-orange-400 to-orange-600',
//           icon: Award,
//           label: 'JUARA 3',
//         },
//       };
//       return badges[sessionResult.rank as keyof typeof badges];
//     }
//     if (sessionResult.rank <= 10) {
//       return {
//         color: 'from-blue-400 to-blue-600',
//         icon: Star,
//         label: 'TOP 10',
//       };
//     }
//     if (percentage >= 80) {
//       return {
//         color: 'from-green-400 to-green-600',
//         icon: CheckCircle2,
//         label: 'EXCELLENT',
//       };
//     }
//     if (percentage >= 60) {
//       return {
//         color: 'from-blue-400 to-blue-600',
//         icon: Target,
//         label: 'GOOD',
//       };
//     }
//     return {
//       color: 'from-gray-400 to-gray-600',
//       icon: BookOpen,
//       label: 'FAIR',
//     };
//   };

//   const rankBadge = getRankBadge();
//   const IconComponent = rankBadge.icon;

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'overview':
//         return (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {/* Quick Stats */}
//             {[
//               {
//                 icon: Trophy,
//                 label: 'Peringkat Anda',
//                 value: `#${sessionResult.rank}`,
//                 color: '#FFD700',
//               },
//               {
//                 icon: Users,
//                 label: 'Total Peserta',
//                 value: sessionResult.totalParticipants,
//                 color: '#3B82F6',
//               },
//               {
//                 icon: Target,
//                 label: 'Akurasi',
//                 value: `${percentage.toFixed(1)}%`,
//                 color: '#10B981',
//               },
//               {
//                 icon: Clock,
//                 label: 'Tanggal Selesai',
//                 value: new Date(resultDate).toLocaleDateString('id-ID'),
//                 color: '#F59E0B',
//               },
//             ].map((stat, index) => (
//               <Card
//                 key={index}
//                 className="border-2 rounded-2xl hover:shadow-lg transition-all duration-300"
//                 style={{ borderColor: `${stat.color}20` }}
//               >
//                 <CardContent className="p-6 text-center">
//                   <div
//                     className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
//                     style={{ backgroundColor: `${stat.color}15` }}
//                   >
//                     <stat.icon
//                       className="w-6 h-6"
//                       style={{ color: stat.color }}
//                     />
//                   </div>
//                   <div className="text-2xl font-bold text-gray-900 mb-2">
//                     {stat.value}
//                   </div>
//                   <div className="text-sm text-gray-600">{stat.label}</div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         );

//       case 'detailed':
//         return (
//           <div className="space-y-6">
//             {sessionResult.TryoutUserAnswer.map((item, i) => (
//               <div
//                 key={i}
//                 id={`question${i + 1}`}
//                 className={cn(
//                   'grid w-full grid-cols-1 gap-3 border-b border-main-gray-input p-6 md:grid-cols-2',
//                   i === sessionResult.TryoutUserAnswer.length - 1 &&
//                     'border-b-0',
//                 )}
//               >
//                 <div className="flex flex-col justify-between gap-2">
//                   <h1 className="text-lg font-medium">Soal Nomor {i + 1}</h1>
//                   <div className="text-sm text-main-gray-text">
//                     <ReactMarkdown
//                       value={replaceLatexNotation(item.TryoutQuestion.question)}
//                     />
//                   </div>
//                   <h1 className="text-sm">
//                     <span className="font-semibold">Jawaban:</span> <br />
//                     <ReactMarkdown
//                       value={replaceLatexNotation(
//                         showResult && assessmentType !== '+4/-1/0'
//                           ? item.TryoutQuestion.TryoutAnswers.find(
//                               (answer) => answer.value === 5,
//                             )?.answer || ''
//                           : showResult && assessmentType === '+4/-1/0'
//                             ? item.TryoutQuestion.TryoutAnswers.find(
//                                 (answer) => answer.value === 4,
//                               )?.answer || ''
//                             : '....',
//                       )}
//                     />
//                   </h1>
//                 </div>
//                 <div className="flex flex-col justify-start gap-2">
//                   <h1 className="text-lg font-medium">Jawabanmu</h1>
//                   {showResult ? (
//                     <div className="flex flex-col gap-2 text-sm text-black">
//                       {item.TryoutAnswers &&
//                       item.TryoutAnswers.answer !== '' ? (
//                         <>
//                           <p>{item.TryoutAnswers.answer}</p>
//                           {getIsCorrect(i) ? (
//                             <p className="font-semibold text-blue-600">
//                               Benar{' '}
//                               <span className="text-xs text-main-gray-text">
//                                 ( bobot : {item.TryoutAnswers.value} )
//                               </span>
//                             </p>
//                           ) : (
//                             <p className="font-semibold text-main-red">
//                               Salah{' '}
//                               <span className="text-xs text-main-gray-text">
//                                 ( bobot : {item.TryoutAnswers.value} )
//                               </span>
//                             </p>
//                           )}
//                         </>
//                       ) : (
//                         <p className="font-semibold text-main-gray-text2">
//                           Belum Dijawab{' '}
//                           <span className="text-xs text-main-gray-text">
//                             ( bobot : 0 )
//                           </span>
//                         </p>
//                       )}
//                     </div>
//                   ) : (
//                     '....'
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         );

//       case 'analysis':
//         return (
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Strengths & Weaknesses */}
//             <Card
//               className="border-2 rounded-2xl"
//               style={{ borderColor: `${mainColor}20` }}
//             >
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <TrendingUp
//                     className="w-5 h-5"
//                     style={{ color: mainColor }}
//                   />
//                   Analisis Performa
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div>
//                     <h4 className="font-bold text-green-600 mb-3">
//                       🎯 Kekuatan
//                     </h4>
//                     <ul className="space-y-2">
//                       {sessionResult.TryoutUserAnswer.filter((s) =>
//                         getIsCorrect(s),
//                       ).map((session, i) => (
//                         <li
//                           key={i}
//                           className="flex items-center gap-2 text-sm"
//                         >
//                           <CheckCircle2 className="w-4 h-4 text-green-600" />
//                           <span>
//                             {session.TryoutQuestion.category} (
//                             {session.TryoutAnswers?.value}%)
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>

//                   <div>
//                     <h4 className="font-bold text-orange-600 mb-3">
//                       📚 Area Pengembangan
//                     </h4>
//                     <ul className="space-y-2">
//                       {sessionResult.TryoutUserAnswer.filter(
//                         (s) => !getIsCorrect(s),
//                       ).map((session, i) => (
//                         <li
//                           key={i}
//                           className="flex items-center gap-2 text-sm"
//                         >
//                           <Target className="w-4 h-4 text-orange-600" />
//                           <span>
//                             {session.TryoutQuestion.category} (
//                             {session.TryoutAnswers?.value}%)
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Recommendations */}
//             <Card
//               className="border-2 rounded-2xl"
//               style={{ borderColor: `${secondaryColor}20` }}
//             >
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <BookOpen
//                     className="w-5 h-5"
//                     style={{ color: secondaryColor }}
//                   />
//                   Rekomendasi
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="p-4 bg-blue-50 rounded-xl">
//                     <h5 className="font-bold text-blue-800 mb-2">
//                       📈 Strategi Belajar
//                     </h5>
//                     <p className="text-sm text-blue-700">
//                       Fokus pada mata pelajaran dengan skor di bawah 70%.
//                       Alokasikan lebih banyak waktu untuk latihan soal.
//                     </p>
//                   </div>

//                   <div className="p-4 bg-green-50 rounded-xl">
//                     <h5 className="font-bold text-green-800 mb-2">
//                       🎯 Target Berikutnya
//                     </h5>
//                     <p className="text-sm text-green-700">
//                       Pertahankan performa yang sudah baik dan tingkatkan skor
//                       rata-rata menjadi{' '}
//                       {(sessionResult.TryoutSession.averageScore || 0) + 10}{' '}
//                       poin.
//                     </p>
//                   </div>

//                   <div className="p-4 bg-purple-50 rounded-xl">
//                     <h5 className="font-bold text-purple-800 mb-2">
//                       ⏰ Waktu Ideal
//                     </h5>
//                     <p className="text-sm text-purple-700">
//                       Lakukan try out rutin setiap minggu untuk mengukur
//                       progress dan membiasakan diri dengan soal.
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto max-w-7xl px-4">
//         {/* Celebration Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//            0.8 }}
//           className="text-center mb-12"
//         >
//           <div
//             className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center shadow-2xl"
//             style={{
//               background: `linear-gradient(135deg, ${rankBadge.color})`,
//             }}
//           >
//             <IconComponent className="w-12 h-12 text-white" />
//           </div>

//           <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Selamat! 🎉
//           </h1>
//           <p className="text-xl text-gray-600 mb-6">
//             Anda telah menyelesaikan try out dengan hasil yang{' '}
//             <span
//               className="font-bold"
//               style={{ color: mainColor }}
//             >
//               {percentage >= 80
//                 ? 'luar biasa'
//                 : percentage >= 60
//                   ? 'baik'
//                   : 'cukup baik'}
//             </span>
//           </p>

//           {/* Achievement Badge */}
//           <div
//             className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold shadow-lg"
//             style={{
//               background: `linear-gradient(135deg, ${rankBadge.color})`,
//             }}
//           >
//             <IconComponent className="w-5 h-5" />
//             {rankBadge.label}
//           </div>
//         </motion.div>

//         {/* Main Score Card */}
//         <motion.div
//           initial={{ opacity: 0, y: 30 }}
//           animate={{ opacity: 1, y: 0 }}
//            0.8, delay: 0.2 }}
//           className="mb-12"
//         >
//           <Card
//             className="border-0 rounded-3xl overflow-hidden shadow-2xl"
//             style={{
//               background: `linear-gradient(135deg, ${mainColor}08, ${secondaryColor}08)`,
//             }}
//           >
//             <CardContent className="p-8 md:p-12">
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
//                 {/* Score Display */}
//                 <div className="text-center md:text-left">
//                   <div className="mb-4">
//                     <div
//                       className="text-6xl md:text-7xl font-black mb-2"
//                       style={{ color: mainColor }}
//                     >
//                       {getFinalScore().total.toFixed(0)}
//                     </div>
//                     <div className="text-xl text-gray-600">
//                       dari {sessionResult.TryoutSession.maxScore} poin
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Progress
//                       value={percentage}
//                       className="h-3 rounded-full"
//                     />
//                     <div className="flex justify-between text-sm text-gray-600">
//                       <span>0</span>
//                       <span className="font-bold">
//                         {percentage.toFixed(1)}%
//                       </span>
//                       <span>{sessionResult.TryoutSession.maxScore}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Stats */}
//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
//                     <div
//                       className="text-2xl font-bold"
//                       style={{ color: mainColor }}
//                     >
//                       #{sessionResult.rank}
//                     </div>
//                     <div className="text-sm text-gray-600">Peringkat</div>
//                   </div>
//                   <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
//                     <div className="text-2xl font-bold text-green-600">
//                       {sessionResult.totalParticipants}
//                     </div>
//                     <div className="text-sm text-gray-600">Peserta</div>
//                   </div>
//                   <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
//                     <div className="text-2xl font-bold text-orange-600">
//                       {sessionResult.TryoutSession.averageScore.toFixed(0)}
//                     </div>
//                     <div className="text-sm text-gray-600">Rata-rata</div>
//                   </div>
//                   <div className="text-center p-4 bg-white rounded-2xl shadow-sm">
//                     <div
//                       className={`text-2xl font-bold ${isAboveAverage ? 'text-green-600' : 'text-red-600'}`}
//                     >
//                       {isAboveAverage ? '+' : ''}
//                       {(
//                         getFinalScore().total -
//                         (sessionResult.TryoutSession.averageScore || 0)
//                       ).toFixed(0)}
//                     </div>
//                     <div className="text-sm text-gray-600">vs Avg</div>
//                   </div>
//                 </div>

//                 {/* Achievement Visual */}
//                 <div className="text-center">
//                   <div className="relative w-32 h-32 mx-auto mb-4">
//                     <svg
//                       className="w-32 h-32 transform -rotate-90"
//                       viewBox="0 0 100 100"
//                     >
//                       <circle
//                         cx="50"
//                         cy="50"
//                         r="45"
//                         stroke="#e5e7eb"
//                         strokeWidth="8"
//                         fill="none"
//                       />
//                       <circle
//                         cx="50"
//                         cy="50"
//                         r="45"
//                         stroke={mainColor}
//                         strokeWidth="8"
//                         fill="none"
//                         strokeLinecap="round"
//                         strokeDasharray={`${2 * Math.PI * 45}`}
//                         strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
//                         className="transition-all duration-2000 ease-out"
//                       />
//                     </svg>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-center">
//                         <div
//                           className="text-2xl font-bold"
//                           style={{ color: mainColor }}
//                         >
//                           {percentage.toFixed(0)}%
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="text-sm text-gray-600">Skor Persentase</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </motion.div>

//         {/* Tab Navigation */}
//         <div className="flex justify-center mb-8">
//           <div className="bg-white rounded-2xl p-1 shadow-lg border">
//             {[
//               { id: 'overview', label: 'Ringkasan', icon: BarChart3 },
//               { id: 'detailed', label: 'Detail Sesi', icon: BookOpen },
//               { id: 'analysis', label: 'Analisis', icon: TrendingUp },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id as any)}
//                 className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
//                   activeTab === tab.id
//                     ? 'text-white shadow-lg'
//                     : 'text-gray-600 hover:bg-gray-50'
//                 }`}
//                 style={{
//                   backgroundColor:
//                     activeTab === tab.id ? mainColor : 'transparent',
//                 }}
//               >
//                 <tab.icon className="w-4 h-4" />
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <motion.div
//           key={activeTab}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//
//         >
//           {renderTabContent()}
//         </motion.div>

//         {/* Action Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//            0.6, delay: 0.8 }}
//           className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
//         >
//           <button
//             className="px-8 py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 flex items-center gap-2"
//             style={{
//               background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
//             }}
//           >
//             <Download className="w-5 h-5" />
//             Download Hasil
//           </button>

//           <button
//             onClick={() => (window.location.href = '/user/try-out')}
//             className="px-8 py-4 rounded-2xl font-bold border-2 bg-white transition-all duration-300 flex items-center gap-2"
//             style={{ borderColor: mainColor, color: mainColor }}
//           >
//             <Home className="w-5 h-5" />
//             Try Out Lainnya
//           </button>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default TryoutResult;
