// 'use client';

// import { Loader2 } from 'lucide-react';
// import { useEffect } from 'react';

// export default function DiscordJoinPage() {
//   const discordLink = 'https://www.bimbelio.com/l/wa-grup';

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       window.location.href = discordLink;
//     }, 1500);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#5865F2] via-blue-600 to-purple-700 flex items-center justify-center fixed w-full top-0 left-0 z-[1]">
//       <div className="text-center">
//         {/* Loading Animation */}
//         <div className="mb-8 flex justify-center">
//           <div className="relative">
//             <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20">
//               <Loader2 className="w-12 h-12 text-white animate-spin" />
//             </div>

//             {/* Discord Logo */}
//             <div className="absolute inset-0 flex items-center justify-center">
//               <svg
//                 width="48"
//                 height="48"
//                 viewBox="0 0 24 24"
//                 fill="white"
//                 className="opacity-80"
//               >
//                 <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* Loading Text */}
//         <h1 className="text-4xl font-bold text-white mb-2">
//           Memproses Redirect
//         </h1>
//         <p className="text-xl text-blue-100 mb-2">
//           Membuka Discord Community...
//         </p>

//         {/* Loading Dots */}
//         <div className="flex justify-center gap-2 mt-6">
//           <div
//             className="w-2 h-2 bg-white rounded-full animate-bounce"
//             style={{ animationDelay: '0s' }}
//           ></div>
//           <div
//             className="w-2 h-2 bg-white rounded-full animate-bounce"
//             style={{ animationDelay: '0.2s' }}
//           ></div>
//           <div
//             className="w-2 h-2 bg-white rounded-full animate-bounce"
//             style={{ animationDelay: '0.4s' }}
//           ></div>
//         </div>

//         {/* Fallback Message */}
//         <p className="text-blue-200 text-sm mt-8">
//           Jika halaman tidak otomatis membuka,{' '}
//           <a
//             href={discordLink}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="underline hover:text-white transition-colors font-semibold"
//           >
//             klik di sini
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// // 'use client';

// // import { Badge } from '@/components/ui/badge';
// // import { Button } from '@/components/ui/button';
// // import { Card, CardContent } from '@/components/ui/card';
// // import {
// //   ArrowRight,
// //   BookOpen,
// //   Calendar,
// //   CheckCircle,
// //   Crown,
// //   FileText,
// //   GraduationCap,
// //   Heart,
// //   MessageSquare,
// //   Sparkles,
// //   Star,
// //   Trophy,
// //   Users,
// //   Video,
// //   Zap,
// // } from 'lucide-react';
// // import Link from 'next/link';

// // export default function DiscordJoinPage() {
// //   const discordLink = 'https://www.bimbelio.com/l/wa-grup';
// //   const communityBenefits = [
// //     {
// //       icon: <Users className="w-6 h-6" />,
// //       title: 'Komunitas Belajar',
// //       description: 'Bergabung dengan ribuan siswa yang sedang belajar bersama',
// //     },
// //     {
// //       icon: <MessageSquare className="w-6 h-6" />,
// //       title: 'Diskusi Real-time',
// //       description: 'Tanya jawab langsung dengan mentor dan sesama siswa',
// //     },
// //     {
// //       icon: <BookOpen className="w-6 h-6" />,
// //       title: 'Materi Premium',
// //       description: 'Akses materi eksklusif dan tips belajar dari expert',
// //     },
// //     {
// //       icon: <Trophy className="w-6 h-6" />,
// //       title: 'Event & Challenge',
// //       description: 'Ikuti event menarik dan tantangan belajar bersama',
// //     },
// //   ];

// //   const premiumFeatures = [
// //     {
// //       icon: <GraduationCap className="w-5 h-5" />,
// //       text: 'Live Class Premium',
// //     },
// //     {
// //       icon: <FileText className="w-5 h-5" />,
// //       text: 'Document & Notes',
// //     },
// //     {
// //       icon: <Video className="w-5 h-5" />,
// //       text: 'Video Tutorial',
// //     },
// //     {
// //       icon: <Calendar className="w-5 h-5" />,
// //       text: 'Study Schedule',
// //     },
// //   ];

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
// //       {/* Hero Section */}
// //       <div className="relative overflow-hidden">
// //         {/* Background Pattern */}
// //         <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
// //         <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-400/20 to-purple-600/20 rounded-full blur-3xl -z-10" />
// //         <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl -z-10" />

// //         <div className="container mx-auto px-4 py-16">
// //           <div className="max-w-4xl mx-auto text-center">
// //             {/* Discord Logo & Badge */}
// //             <div className="inline-flex items-center gap-3 mb-6">
// //               <div className="p-4 bg-[#5865F2] rounded-2xl shadow-lg shadow-[#5865F2]/25">
// //                 <svg
// //                   width="48"
// //                   height="48"
// //                   viewBox="0 0 24 24"
// //                   fill="white"
// //                 >
// //                   <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
// //                 </svg>
// //               </div>
// //               <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 text-sm font-semibold">
// //                 <Sparkles className="w-4 h-4 mr-1" />
// //                 Official Community
// //               </Badge>
// //             </div>

// //             {/* Main Heading */}
// //             <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
// //               Bergabung dengan{' '}
// //               <span className="bg-gradient-to-r from-[#5865F2] via-blue-600 to-purple-600 bg-clip-text text-transparent">
// //                 Bimbelio Community
// //               </span>
// //             </h1>

// //             {/* Subtitle */}
// //             <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
// //               Temukan teman belajar, dapatkan bantuan dari mentor expert, dan
// //               akses konten premium eksklusif di komunitas Discord terbesar untuk
// //               siswa Indonesia
// //             </p>

// //             {/* CTA Button */}
// //             <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
// //               <Button
// //                 size="lg"
// //                 className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg shadow-[#5865F2]/25 hover:shadow-xl hover:shadow-[#5865F2]/30 transition-all duration-300 hover:scale-105"
// //                 asChild
// //               >
// //                 <a
// //                   href={discordLink}
// //                   target="_blank"
// //                   rel="noopener noreferrer"
// //                 >
// //                   <svg
// //                     width="24"
// //                     height="24"
// //                     viewBox="0 0 24 24"
// //                     fill="currentColor"
// //                     className="mr-2"
// //                   >
// //                     <path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z" />
// //                   </svg>
// //                   Gabung Sekarang
// //                   <ArrowRight className="w-5 h-5 ml-2" />
// //                 </a>
// //               </Button>

// //               <Button
// //                 variant="outline"
// //                 size="lg"
// //                 className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg font-medium rounded-xl transition-all duration-300"
// //                 asChild
// //               >
// //                 <Link href="/">Kembali ke Beranda</Link>
// //               </Button>
// //             </div>

// //             {/* Stats */}
// //             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
// //               <div className="text-center">
// //                 <div className="text-2xl md:text-3xl font-bold text-[#5865F2] mb-1">
// //                   10K+
// //                 </div>
// //                 <div className="text-sm text-gray-600">Member Aktif</div>
// //               </div>
// //               <div className="text-center">
// //                 <div className="text-2xl md:text-3xl font-bold text-[#5865F2] mb-1">
// //                   500+
// //                 </div>
// //                 <div className="text-sm text-gray-600">Mentor Expert</div>
// //               </div>
// //               <div className="text-center">
// //                 <div className="text-2xl md:text-3xl font-bold text-[#5865F2] mb-1">
// //                   24/7
// //                 </div>
// //                 <div className="text-sm text-gray-600">Support</div>
// //               </div>
// //               <div className="text-center">
// //                 <div className="text-2xl md:text-3xl font-bold text-[#5865F2] mb-1">
// //                   100+
// //                 </div>
// //                 <div className="text-sm text-gray-600">Channel</div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Benefits Section */}
// //       <div className="py-16 bg-white">
// //         <div className="container mx-auto px-4">
// //           <div className="max-w-6xl mx-auto">
// //             <div className="text-center mb-12">
// //               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
// //                 Kenapa Harus Bergabung?
// //               </h2>
// //               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
// //                 Komunitas Discord Bimbelio dirancang khusus untuk membantu kamu
// //                 mencapai target akademik dengan dukungan penuh dari komunitas
// //               </p>
// //             </div>

// //             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
// //               {communityBenefits.map((benefit, index) => (
// //                 <Card
// //                   key={index}
// //                   className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
// //                 >
// //                   <CardContent className="p-6 text-center">
// //                     <div className="w-12 h-12 bg-gradient-to-br from-[#5865F2] to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
// //                       {benefit.icon}
// //                     </div>
// //                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
// //                       {benefit.title}
// //                     </h3>
// //                     <p className="text-sm text-gray-600">
// //                       {benefit.description}
// //                     </p>
// //                   </CardContent>
// //                 </Card>
// //               ))}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Premium Features Section */}
// //       <div className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
// //         <div className="container mx-auto px-4">
// //           <div className="max-w-4xl mx-auto">
// //             <div className="text-center mb-12">
// //               <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
// //                 <Crown className="w-4 h-4" />
// //                 Premium Member Only
// //               </div>
// //               <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
// //                 Akses Konten Premium
// //               </h2>
// //               <p className="text-lg text-gray-600">
// //                 Member premium mendapatkan akses eksklusif ke channel khusus
// //                 dengan konten premium dan dukungan prioritas
// //               </p>
// //             </div>

// //             <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
// //               <CardContent className="p-8">
// //                 <div className="grid md:grid-cols-2 gap-8 items-center">
// //                   <div>
// //                     <h3 className="text-2xl font-bold text-gray-900 mb-4">
// //                       Channel Premium Member
// //                     </h3>
// //                     <div className="space-y-3 mb-6">
// //                       {premiumFeatures.map((feature, index) => (
// //                         <div
// //                           key={index}
// //                           className="flex items-center gap-3"
// //                         >
// //                           <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center text-white">
// //                             {feature.icon}
// //                           </div>
// //                           <span className="text-gray-700 font-medium">
// //                             {feature.text}
// //                           </span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                     <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
// //                       <CheckCircle className="w-4 h-4" />
// //                       Akses 24/7 dengan dukungan prioritas
// //                     </div>
// //                   </div>

// //                   <div className="text-center">
// //                     <div className="w-32 h-32 bg-gradient-to-br from-[#5865F2] to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
// //                       <Crown className="w-16 h-16 text-white" />
// //                     </div>
// //                     <Button
// //                       className="bg-gradient-to-r from-[#5865F2] to-purple-600 hover:from-[#4752C4] hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
// //                       asChild
// //                     >
// //                       <Link href="/price">
// //                         Upgrade ke Premium
// //                         <Star className="w-4 h-4 ml-2" />
// //                       </Link>
// //                     </Button>
// //                   </div>
// //                 </div>
// //               </CardContent>
// //             </Card>
// //           </div>
// //         </div>
// //       </div>

// //       {/* CTA Section */}
// //       <div className="py-16 bg-gradient-to-br from-[#5865F2] via-blue-600 to-purple-700">
// //         <div className="container mx-auto px-4 text-center">
// //           <div className="max-w-3xl mx-auto">
// //             <div className="mb-6">
// //               <Heart className="w-16 h-16 text-white mx-auto mb-4" />
// //               <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
// //                 Siap Bergabung?
// //               </h2>
// //               <p className="text-xl text-blue-100 mb-8">
// //                 Jangan tunggu lagi! Bergabung sekarang dan mulai perjalanan
// //                 belajar kamu bersama ribuan siswa lainnya
// //               </p>
// //             </div>

// //             <Button
// //               size="lg"
// //               className="bg-white text-[#5865F2] hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
// //               asChild
// //             >
// //               <a
// //                 href={discordLink}
// //                 target="_blank"
// //                 rel="noopener noreferrer"
// //               >
// //                 <Zap className="w-5 h-5 mr-2" />
// //                 Gabung Bimbelio Discord
// //                 <ArrowRight className="w-5 h-5 ml-2" />
// //               </a>
// //             </Button>

// //             <p className="text-blue-200 text-sm mt-4">
// //               Gratis untuk semua • Tidak ada syarat khusus
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
