"use client"

import { motion, useAnimation, useInView } from "framer-motion"
import {
  ArrowRight,
  ShoppingCart,
  Star,
  Clock,
  FileText,
  Calendar,
  Users,
  Percent,
  Check,
  Award,
  Gift,
  Sparkles,
} from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import AnimatedGradientText from "@/components/magicui/animated-gradient-text"

interface TryOutCardProps {
  id: string
  title: string
  description: string
  image: string
  category: string
  duration: string
  questions: number
  participants: number
  difficulty: "Mudah" | "Sedang" | "Sulit"
  rating: number
  tags: string[]
  isFree: boolean
  isPopular?: boolean
  isNew?: boolean
  price?: number
  startDate: string
  endDate: string
  posterImage?: string
  passingRate: number
  onClick: () => void
  isBundling?: boolean
  bundlingItems?: string[]
  discount?: number
  originalPrice?: number
}

const featuredTryOuts: TryOutCardProps[] = [
  {
    id: "to-1",
    title: "Try Out SIMAK UI 2025",
    description: "Simulasi SIMAK UI terbaru dengan prediksi soal yang akurat berdasarkan pola tahun sebelumnya.",
    image: "/placeholder.svg?key=iqa23",
    posterImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TO%20UI-ZPKq78RY0e5c0M6ziRdpNAembIqkza.webp",
    category: "SIMAK UI",
    duration: "180 menit",
    questions: 120,
    participants: 5240,
    difficulty: "Sedang",
    rating: 4.8,
    tags: ["Terbaru", "Populer", "Prediksi"],
    isFree: false,
    price: 35000,
    isPopular: true,
    startDate: "25 April 2025",
    endDate: "5 Mei 2025",
    passingRate: 78,
    onClick: () => { },
    isBundling: false,
  },
  {
    id: "to-2",
    title: "Try Out UM UGM 2025",
    description: "Persiapkan diri untuk ujian masuk UGM dengan soal-soal yang mirip dengan ujian asli.",
    image: "/placeholder.svg?key=n6djy",
    posterImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TO%20UGM-rn7jLZwyejh5xDmFggXdP2cbR33KUQ.webp",
    category: "UM UGM",
    duration: "150 menit",
    questions: 100,
    participants: 3150,
    difficulty: "Sulit",
    rating: 4.7,
    tags: ["Saintek", "Soshum", "Prediksi"],
    isFree: false,
    price: 35000,
    startDate: "25 April 2025",
    endDate: "12 Mei 2025",
    passingRate: 72,
    onClick: () => { },
    isBundling: false,
  },
  {
    id: "to-3",
    title: "Try Out PKN STAN 2025",
    description: "Latihan soal untuk persiapan ujian masuk Sekolah Tinggi Akuntansi Negara.",
    image: "/placeholder.svg?key=tjdty",
    posterImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TO%20STAN-aQmfbcI8l9HErBhljd6aIbEGj60Bfd.webp",
    category: "PKN STAN",
    duration: "150 menit",
    questions: 110,
    participants: 2780,
    difficulty: "Sedang",
    rating: 4.6,
    tags: ["Kedinasan", "Akuntansi", "Perpajakan"],
    isFree: false,
    price: 35000,
    isNew: true,
    startDate: "25 April 2025",
    endDate: "12 Mei 2025",
    passingRate: 75,
    onClick: () => { },
    isBundling: false,
  },
  {
    id: "to-4",
    title: "Paket Bundling Spesial",
    description:
      "Paket lengkap Try Out untuk pejuang PTN & STAN dengan harga spesial! Hemat hingga 30% dengan membeli paket ini.",
    image: "/placeholder.svg?key=uk0su",
    posterImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/TO%20BUNDLING-wYrZBaI0oiKehqB8pOHiAu6BP1LEot.webp",
    category: "Bundling",
    duration: "Bervariasi",
    questions: 330,
    participants: 4120,
    difficulty: "Sedang",
    rating: 4.9,
    tags: ["Bundling", "Hemat", "Lengkap"],
    isFree: false,
    price: 85000,
    originalPrice: 105000,
    discount: 30,
    isPopular: true,
    startDate: "25 April 2025",
    endDate: "12 Mei 2025",
    passingRate: 80,
    onClick: () => { },
    isBundling: true,
    bundlingItems: [
      "Try Out SIMAK UI 2025",
      "Try Out UM UGM 2025",
      "Try Out PKN STAN 2025",
      "Pembahasan Lengkap",
      "Konsultasi Gratis",
      "Akses 3 Bulan",
    ],
  },
]

const difficultyColors = {
  Mudah: "bg-green-100 text-green-700",
  Sedang: "bg-yellow-100 text-yellow-700",
  Sulit: "bg-red-100 text-red-700",
}

const FeaturedTryOutCard = ({ tryOut }: { tryOut: TryOutCardProps }) => {
  const [isHovered, setIsHovered] = useState(false)

  if (tryOut.isBundling) {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group relative overflow-hidden rounded-2xl bg-gradient shadow-lg transition-all duration-300 hover:shadow-xl border-4 border-dashed border-yellow-400 lg:col-span-2"
      >
        {/* Ribbon */}
        <div className="absolute -right-12 top-6 z-10 rotate-45 bg-gradient-to-r from-yellow-400 to-amber-500 px-12 py-2 text-center text-sm font-bold text-white shadow-md">
          HEMAT {tryOut.discount}%
        </div>

        {/* Special Badge */}
        <div className="absolute left-5 top-5 z-10 rounded-full bg-gradient p-0.5">
          <div className="rounded-full bg-white px-3 py-1">
            <span className="bg-gradient bg-clip-text text-sm font-bold text-transparent">
              BUNDLING SPESIAL
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="relative h-[240px] w-full overflow-hidden lg:h-auto lg:w-1/2">
            {tryOut.posterImage ? (
              <Image
                src={tryOut.posterImage || "/placeholder.svg"}
                alt={tryOut.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            ) : (
              <Image
                src={tryOut.image || "/placeholder.svg"}
                alt={tryOut.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

            {/* Animated Sparkles */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-yellow-300"
                  initial={{
                    x: Math.random() * 100 + "%",
                    y: Math.random() * 100 + "%",
                    scale: 0,
                  }}
                  animate={{
                    y: [null, Math.random() * -50 - 20],
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5 + Math.random(),
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>

            {/* Category Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1 text-sm font-medium text-white">
                <Gift className="mr-1 inline-block h-4 w-4" />
                {tryOut.category}
              </span>
            </div>
          </div>

          <div className="p-5 lg:w-1/2">
            <div className="mb-2 flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-yellow-500" />
              <h3 className="text-xl font-bold text-gray-900 md:text-2xl">{tryOut.title}</h3>
            </div>

            <p className="mb-4 text-sm text-gray-600 md:text-base">{tryOut.description}</p>

            {/* Price Section */}
            <div className="mb-4 flex items-center">
              <div className="mr-3">
                <span className="text-lg font-bold text-main md:text-xl">
                  Rp{tryOut.price?.toLocaleString("id-ID")}
                </span>
                {tryOut.originalPrice && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    Rp{tryOut.originalPrice.toLocaleString("id-ID")}
                  </span>
                )}
              </div>
              {tryOut.discount && (
                <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-bold text-red-600">
                  HEMAT {tryOut.discount}%
                </span>
              )}
            </div>

            {/* What's Included */}
            <div className="mb-4">
              <h4 className="mb-2 text-sm font-bold text-gray-700">Yang Kamu Dapatkan:</h4>
              <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {tryOut.bundlingItems?.map((item, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <Check className="mr-1 h-4 w-4 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="mb-4 grid grid-cols-2 gap-2 text-xs md:text-sm">
              <div className="flex items-center gap-1 text-gray-600">
                <FileText className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
                <span>{tryOut.questions} Soal Total</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
                <span>{tryOut.participants.toLocaleString()} Peserta</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
                <span>Hingga: {tryOut.endDate}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Award className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
                <span>Rating: {tryOut.rating.toFixed(1)}</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-center font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              onClick={tryOut.onClick}
            >
              Beli Paket Bundling
              <ShoppingCart className="ml-2 inline-block h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Tambahan badge promo */}
        <div className="absolute -bottom-3 -right-3 rotate-12">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-blue-900 shadow-lg">
            BEST DEAL!
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    // Card biasa tetap sama seperti sebelumnya
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      {/* Card konten tetap sama */}
      <div className="relative h-[200px] w-full overflow-hidden md:h-[240px]">
        {tryOut.posterImage ? (
          <Image
            src={tryOut.posterImage || "/placeholder.svg"}
            alt={tryOut.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <Image
            src={tryOut.image || "/placeholder.svg"}
            alt={tryOut.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Status Badges */}
        <div className="absolute left-0 top-0 flex flex-col gap-2 p-3">
          {tryOut.isFree && (
            <span className="rounded-lg bg-green-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg md:py-1">
              GRATIS
            </span>
          )}
          {!tryOut.isFree && tryOut.price && (
            <span className="rounded-lg bg-main px-2 py-0.5 text-xs font-bold text-white shadow-lg md:py-1">
              Rp{tryOut.price.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        <div className="absolute right-0 top-0 flex flex-col gap-2 p-3">
          {tryOut.isPopular && (
            <span className="rounded-lg bg-yellow-400 px-2 py-0.5 text-xs font-bold text-blue-800 shadow-lg md:py-1">
              POPULER
            </span>
          )}
          {tryOut.isNew && (
            <span className="rounded-lg bg-blue-400 px-2 py-0.5 text-xs font-bold text-white shadow-lg md:py-1">
              BARU
            </span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-block rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-white md:px-3 md:py-1">
            {tryOut.category}
          </span>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute bottom-4 right-4">
          <span
            className={cn(
              "inline-block rounded-full px-2 py-0.5 text-xs font-medium md:px-3 md:py-1",
              difficultyColors[tryOut.difficulty],
            )}
          >
            {tryOut.difficulty}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-5">
        <h3 className="mb-2 text-lg font-bold text-gray-900 md:text-xl">{tryOut.title}</h3>
        <p className="mb-3 text-xs text-gray-600 line-clamp-2 md:text-sm">{tryOut.description}</p>

        {/* Tags */}
        <div className="mb-3 flex flex-wrap gap-1">
          {tryOut.tags.map((tag, idx) => (
            <span key={idx} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              #{tag}
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="mb-3 flex items-center">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={cn(
                "h-3 w-3 md:h-4 md:w-4",
                idx < Math.floor(tryOut.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : idx < tryOut.rating
                    ? "fill-yellow-400 text-yellow-400 opacity-50"
                    : "text-gray-300",
              )}
            />
          ))}
          <span className="ml-1 text-xs font-medium text-gray-700 md:text-sm">{tryOut.rating.toFixed(1)}</span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
            <span>{tryOut.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <FileText className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
            <span>{tryOut.questions} Soal</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
            <span>Mulai: {tryOut.startDate}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="h-3 w-3 text-blue-600 md:h-4 md:w-4" />
            <span>{tryOut.participants.toLocaleString()} Peserta</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
            <Percent className="h-3 w-3" />
            <span>Kelulusan: {tryOut.passingRate}%</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-medium text-white md:gap-2 md:px-4 md:py-2 md:text-sm",
              tryOut.isFree
                ? "bg-gradient"
                : "bg-gradient",
            )}
            onClick={tryOut.onClick}
          >
            {tryOut.isFree ? (
              <>
                Mulai
                <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
              </>
            ) : (
              <>
                Beli
                <ShoppingCart className="h-3 w-3 md:h-4 md:w-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

const FeaturedTryoutSection = () => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [activeTab, setActiveTab] = useState<"all" | "bundling">("all")

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <section
      id="featured-tryout"
      className="relative overflow-hidden py-16 md:py-20"
    >
      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/3 -z-10 h-64 w-64 rounded-full bg-blue-100 opacity-30 blur-3xl"></div>
      <div className="absolute right-0 top-2/3 -z-10 h-64 w-64 rounded-full bg-yellow-100 opacity-30 blur-3xl"></div>
      <div className="absolute left-1/4 bottom-1/4 -z-10 h-32 w-32 rounded-full bg-purple-100 opacity-30 blur-2xl"></div>

      <div className="container mx-auto px-4" ref={ref}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.5 } },
          }}
          className="mb-4 text-center"
        >
          <span className="inline-block rounded-full bg-main/10 px-4 py-1 text-sm font-medium text-main">
            TRY OUT TERSEDIA
          </span>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } },
          }}
          className="mb-8 text-center"
        >
          <h2 className="text-center text-[1.5rem] font-bold md:text-[2.5rem]">
            <AnimatedGradientText>
              Pilih Try Out Terbaikmu
            </AnimatedGradientText>
          </h2>
          {/* <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Pilih{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Try Out</span>{" "}
            Terbaikmu
          </h2> */}
          <p className="mx-auto max-w-2xl text-gray-600">
            Kami menyediakan berbagai Try Out berkualitas untuk membantu persiapan ujian masuk PTN dan sekolah kedinasan
            favoritmu.
          </p>
        </motion.div>

        {/* Special Promo Banner for Bundling */}
        {activeTab === "bundling" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mb-8 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 p-1.5 shadow-lg"
          >
            <div className="relative overflow-hidden rounded-lg bg-white p-6 text-center">
              {/* Background decoration */}
              <div className="absolute top-0 left-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-100 opacity-50"></div>
              <div className="absolute bottom-0 right-0 h-20 w-20 translate-x-1/2 translate-y-1/2 rounded-full bg-blue-100 opacity-50"></div>

              <h3 className="mb-3 text-2xl font-bold text-gray-900">🎁 PROMO SPESIAL BUNDLING 🎁</h3>
              <p className="mx-auto max-w-2xl text-gray-600">
                Dapatkan akses ke semua Try Out dengan harga spesial! Hemat hingga{" "}
                <span className="font-bold text-red-500">30%</span> dengan membeli paket bundling.
              </p>

              <div className="mt-4 inline-block rounded-full bg-yellow-100 px-4 py-1.5 text-sm font-semibold text-yellow-700">
                Terbatas sampai {new Date().getDate() + 7} {new Date().toLocaleString("id-ID", { month: "long" })}{" "}
                {new Date().getFullYear()}!
              </div>
            </div>
          </motion.div>
        )}


        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2, staggerChildren: 0.1 } },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl"
        >
          {
            featuredTryOuts.filter((tryOut) => !tryOut.isBundling).map((tryOut, idx) => (
              <motion.div
                key={tryOut.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className={cn(tryOut.isBundling ? "lg:col-span-2" : "")}
              >
                <FeaturedTryOutCard tryOut={tryOut} />
              </motion.div>
            ))
          }
        </motion.div>

        {/* <div className="justify-center w-full flex mt-12">
          {featuredTryOuts
            .filter((tryOut) => tryOut.isBundling)
            .map((tryOut, idx) => (
              <motion.div
                key={tryOut.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="col-span-2 lg:col-span-4"
              >
                <FeaturedTryOutCard tryOut={tryOut} />
              </motion.div>
            ))
          }
        </div> */}

        {/* Comparison Table - Only shown in bundling tab */}
        {activeTab === "bundling" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md"
          >
            <div className="bg-blue-50 p-4 text-center">
              <h3 className="text-xl font-bold text-gray-900">Perbandingan Paket</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left font-medium text-gray-600">Fitur</th>
                    <th className="p-4 text-center font-medium text-gray-600">Try Out Satuan</th>
                    <th className="p-4 text-center font-medium text-gray-600">Paket Bundling</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium">Harga</td>
                    <td className="p-4 text-center">Rp35.000 / Try Out</td>
                    <td className="p-4 text-center font-bold text-blue-600">Rp85.000 (Hemat 30%)</td>
                  </tr>
                  <tr className="border-t border-gray-200 bg-gray-50">
                    <td className="p-4 font-medium">Jumlah Try Out</td>
                    <td className="p-4 text-center">1 Try Out</td>
                    <td className="p-4 text-center font-bold text-blue-600">3 Try Out</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium">Pembahasan Lengkap</td>
                    <td className="p-4 text-center">
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    </td>
                    <td className="p-4 text-center">
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200 bg-gray-50">
                    <td className="p-4 font-medium">Konsultasi Gratis</td>
                    <td className="p-4 text-center">
                      <div className="mx-auto h-5 w-5 text-red-500">-</div>
                    </td>
                    <td className="p-4 text-center">
                      <Check className="mx-auto h-5 w-5 text-green-500" />
                    </td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="p-4 font-medium">Masa Akses</td>
                    <td className="p-4 text-center">1 Bulan</td>
                    <td className="p-4 text-center font-bold text-blue-600">3 Bulan</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Testimonial - Only shown in bundling tab */}
        {activeTab === "bundling" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 rounded-xl bg-gradient-to-b from-blue-50 to-white p-0.5 shadow-lg border border-blue-100"
          >
            <div className="rounded-lg bg-white p-6">
              <div className="flex flex-col items-center md:flex-row md:items-start">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-yellow-400 p-0.5">
                    <Image
                      src="/diverse-student-portraits.png"
                      alt="Testimonial"
                      width={64}
                      height={64}
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-3 text-lg italic text-gray-600">
                    "Paket bundling ini sangat membantu persiapan saya untuk SIMAK UI dan UM UGM. Dengan harga yang
                    terjangkau, saya bisa mencoba berbagai jenis soal dan mendapatkan pembahasan lengkap. Alhamdulillah
                    saya lulus di UGM!"
                  </p>
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold text-gray-900">Anisa Rahma</p>
                      <p className="text-sm text-gray-500">Mahasiswa Kedokteran UGM 2024</p>
                    </div>
                    <div className="ml-auto">
                      <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Verified User
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.6 } },
          }}
          className="mt-12 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-gradient px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Lihat Semua Try Out
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedTryoutSection


// 'use client';

// import { useGuest } from '@/components/layout/layoutGuest';
// import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
// import { useSession } from '@/components/provider/session-provider-auth';
// import { cn } from '@/lib/utils';
// import { IconFitur1, IconFitur2, IconFitur3 } from '@/styles/icon';
// import { motion } from 'framer-motion';
// import {
//   Award,
//   Building2,
//   Calendar,
//   Clock,
//   FileText,
//   Sparkles,
//   Users,
//   Video,
// } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import AnimatedGradientText from '../../magicui/animated-gradient-text';
// import { Button } from '../../ui/button';

// // Jika Kamu memilih untuk menggunakan UUID
// // import { v4 as uuidv4 } from 'uuid';

// const Tryout: React.FC = () => {
//   const { setShowAuth } = useGuest();
//   const { websiteSubCategory } = useWebsiteSubCategory();
//   const router = useRouter();
//   const { data: session } = useSession();

//   const handleStartClick = () => {
//     if (!session) {
//       setShowAuth({ signUp: false, login: true });
//     } else {
//       router.push('/user/try-out');
//     }
//   };

//   const timelineItems = [
//     {
//       id: 'pendaftaran',
//       icon: Calendar,
//       title: 'Pendaftaran',
//       date: '1-8 Feb',
//     },
//     { id: 'pelaksanaan', icon: Users, title: 'Pelaksanaan', date: '9-12 Feb' },
//     { id: 'live-class', icon: Clock, title: 'Live Class', date: '12 Feb' },
//     { id: 'hasil', icon: Award, title: 'Hasil', date: '12 Feb' },
//     // Atau gunakan uuid jika diperlukan
//     // { id: uuidv4(), ... }
//   ];

//   const features = [
//     { id: 'analisis-360', icon: Sparkles, title: 'Analisis 360°' },
//     { id: 'soal-standar', icon: FileText, title: 'Soal Standar SNBT/UTBK' },
//     { id: 'hasil-pembahasan', icon: Building2, title: 'Hasil & Pembahasan' },
//     { id: 'live-class-zoom', icon: Video, title: 'Live Class (Zoom)' },
//     // Atau gunakan uuid jika diperlukan
//     // { id: uuidv4(), ... }
//   ];

//   const fitur = [
//     {
//       id: 'fitur1',
//       icon: <IconFitur1 w={80} />,
//       text: 'Pendamping belajar cermat',
//       description: (
//         <p className="font-regular mt-[-.5rem] text-[.85rem] text-main-gray-text">
//           Gunakan metode strategi revolusi belajar yang{' '}
//           <span className="font-medium text-main">terpersonalisasi</span>{' '}
//           berdasarkan kemampuanmu.
//         </p>
//       ),
//     },
//     {
//       id: 'fitur2',
//       icon: <IconFitur2 w={80} />,
//       text: 'Pembelajaran aktif dan terarah',
//       description: (
//         <p className="font-regular mt-[-.5rem] text-[.85rem] text-main-gray-text">
//           Manfaatkan teknologi{' '}
//           <span className="font-medium text-main">
//             Active AI-Based Learning
//           </span>{' '}
//           untuk mendapatkan pendamping belajar yang interaktif dan efektif.
//         </p>
//       ),
//     },
//     {
//       id: 'fitur3',
//       icon: <IconFitur3 w={80} />,
//       text: 'Akses materi variatif dan lengkap',
//       description: (
//         <p className="font-regular mt-[-.5rem] text-[.85rem] text-main-gray-text">
//           Nikmati akses ke{' '}
//           <span className="font-medium text-main">materi kurasi terbaru</span>{' '}
//           yang variatif dan lengkap kapan saja, di mana saja dengan teknologi
//           tertinggi.{' '}
//         </p>
//       ),
//     },
//   ];

//   return (
//     <div
//       id="tryout"
//       className="relative w-full gap-[5rem] py-8"
//     >
//       <h1 className="mb-8 mt-2 text-center text-3xl font-bold">
//         <AnimatedGradientText>Inovasi Belajar Berbasis AI</AnimatedGradientText>
//       </h1>
//       <motion.div
//         className="relative z-10 mx-auto max-w-md px-4"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="relative overflow-hidden rounded-2xl bg-white/50 p-6 shadow-md outline outline-main">
//           <div className="relative z-10">
//             <div
//               className={cn(
//                 'absolute -top-6 right-2 mx-auto flex -rotate-12 transform items-center gap-1 rounded-full border border-yellow-200 bg-yellow-100/30 p-1 shadow-md',
//               )}
//             >
//               <Sparkles className="inline-block h-4 w-4 fill-current text-yellow-400" />
//               <span className="text-sm font-bold text-yellow-400">
//                 <AnimatedGradientText className="animate-gradient bg-gradient-to-r from-[#ffaa40] via-main to-[#ffaa40]">
//                   GRATIS!
//                 </AnimatedGradientText>
//               </span>
//             </div>
//             <motion.h1
//               className="relative mb-8 mt-8 text-center text-2xl font-bold md:text-3xl"
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.2, duration: 0.5 }}
//             >
//               <AnimatedGradientText>
//                 Try Out SNBT/UTBK Vol.2
//               </AnimatedGradientText>
//             </motion.h1>
//             <motion.div
//               className="mb-4 grid grid-cols-2 gap-2"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.4, duration: 0.5 }}
//             >
//               {timelineItems.map((item) => (
//                 <motion.div
//                   key={item.id}
//                   className="flex items-center space-x-2 rounded-xl border border-main bg-white p-2"
//                   whileHover={{ scale: 1.03 }}
//                   transition={{ type: 'spring', stiffness: 300 }}
//                 >
//                   <item.icon
//                     className="h-4 w-4 flex-shrink-0"
//                     style={{
//                       color: websiteSubCategory?.main_color,
//                     }}
//                   />
//                   <div className="flex flex-1 items-center justify-between">
//                     <span
//                       className="text-xs font-semibold"
//                       style={{
//                         color: websiteSubCategory?.main_color,
//                       }}
//                     >
//                       {item.title}
//                     </span>
//                     <span
//                       className="text-xs"
//                       style={{
//                         color: websiteSubCategory?.main_color,
//                       }}
//                     >
//                       {item.date}
//                     </span>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>

//             <motion.div
//               className="mb-4"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.6, duration: 0.5 }}
//             >
//               <h4
//                 className="mb-2 text-center text-sm font-bold"
//                 style={{
//                   color: websiteSubCategory?.main_color,
//                 }}
//               >
//                 ✨ Apa yang kamu dapatkan? ✨
//               </h4>
//               <div className="grid grid-cols-2 gap-2">
//                 {features.map((feature) => (
//                   <motion.div
//                     key={feature.id}
//                     className="flex items-center space-x-2 rounded-xl border border-main bg-white p-2"
//                     whileHover={{ scale: 1.03 }}
//                     transition={{ type: 'spring', stiffness: 300 }}
//                   >
//                     <feature.icon
//                       className="h-4 w-4 flex-shrink-0"
//                       style={{
//                         color: websiteSubCategory?.main_color,
//                       }}
//                     />
//                     <span
//                       className="text-xs font-medium"
//                       style={{
//                         color: websiteSubCategory?.main_color,
//                       }}
//                     >
//                       {feature.title}
//                     </span>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>

//             <Button
//               className="mx-auto flex items-center justify-center rounded-full py-2 text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-main hover:text-blue-100"
//               style={{
//                 backgroundColor: `linear-gradient(145deg, ${websiteSubCategory?.secondary_color}, ${websiteSubCategory?.main_color})`,
//               }}
//               onClick={handleStartClick}
//             >
//               Daftar Sekarang!
//             </Button>
//           </div>
//         </div>
//       </motion.div>
//       <div
//         id="fitur"
//         className="mx-auto mt-[-2rem] grid w-full max-w-[1024px] grid-cols-1 gap-y-4 bg-transparent py-[3rem] md:mt-[0] md:grid-cols-3 md:gap-x-[1.5rem] md:gap-y-0"
//       >
//         {fitur.map((item) => (
//           <div
//             key={item.id} // Sekarang menggunakan id yang unik
//             className="mx-[1rem] flex flex-col items-center justify-center gap-[1rem] rounded-[2rem] bg-white/50 p-[1rem] text-center md:gap-[1.5rem] lg:mx-[unset]"
//           >
//             <div className="text-main">{item.icon}</div>
//             <p className="font-bold">{item.text}</p>
//             {item.description}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Tryout;
