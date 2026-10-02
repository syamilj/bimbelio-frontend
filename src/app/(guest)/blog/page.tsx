'use client';

import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDateString } from '@/lib/utils';
import { BlogStatusEnum } from '@/types/database';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  BookOpen,
  CalendarIcon,
  EyeIcon,
  SearchIcon,
  StarIcon,
  TagIcon,
  TrendingUp,
  Users,
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useCallback, useMemo, useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  value: string;
  thumbnail: string;
  status: BlogStatusEnum;
  views: number;
  createdAt: Date;
  tags: string[];
  publishedAt: Date | null;
  updatedAt: Date;
  isEditorPick: boolean | null;
}

export default function BlogClient() {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'updated'>(
    'recent',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab] = useState('semua');

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const {
    data: blogs,
    isLoading,
    // refetch,
  } = useGet<BlogPost[]>('/blog/getBlog');

  const sortedBlogs = useCallback(() => {
    if (!blogs) return [];
    return sortPosts(blogs, sortBy);
  }, [blogs, sortBy]);

  const filteredPosts = useMemo(() => {
    const allPosts = sortedBlogs();
    return allPosts.filter(
      (post: BlogPost) =>
        (activeTab === 'semua' || post.tags.includes(activeTab)) &&
        (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }, [sortedBlogs, activeTab, searchQuery]);

  return (
    <Fragment>
      <Head>
        <title>Blog Bimbelio</title>
        <meta
          name="description"
          content="Temukan inspirasi, wawasan, dan strategi terkini untuk sukses dalam seleksi PTN dan Kedinasan. Baca Blog-Blog pilihan dari para ahli yang dibuat oleh Bimbelio."
        />
        <meta
          name="keywords"
          content="SNBT, SNBP, Bimbelio. UTBK, tips belajar, persiapan ujian, strategi ujian"
        />
      </Head>

      {/* Background with modern gradient */}
      <div className="relative min-h-screen bg-white">
        {/* Background decorative shapes - Matching homepage style */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Large Blue Circle - Top Right */}
          <div
            className="absolute -top-16 -right-16 h-96 w-96 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: mainColor }}
          />
          {/* Medium Pink Square - Top Left */}
          <div
            className="absolute top-32 left-20 h-40 w-40 rounded-3xl opacity-8 blur-2xl"
            style={{
              backgroundColor: secondaryColor,
              transform: 'rotate(15deg)',
            }}
          />
          {/* Small Circle - Bottom */}
          <div
            className="absolute bottom-20 left-1/2 h-64 w-64 rounded-full opacity-5 blur-2xl"
            style={{ backgroundColor: mainColor }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 pt-28 pb-16">
          {/* Modern Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16 px-4 text-center"
          >
            {/* Badge dengan gradient - matching homepage style */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6 flex justify-center"
            >
              <Badge
                variant="outline"
                className="border-none px-6 py-2 text-sm font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
              >
                <BookOpen className="mr-2 inline h-4 w-4" />
                Artikel & Insight
              </Badge>
            </motion.div>

            {/* Main Heading - matching homepage style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="mb-3 text-4xl font-black text-gray-900 md:text-5xl">
                Blog Bimbelio
              </h1>
              <h2
                className="bg-clip-text text-4xl font-black text-transparent md:text-5xl"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Tips & Strategi Lolos PTN
              </h2>
            </motion.div>

            {/* Subtext */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto max-w-3xl"
            >
              <p className="text-lg leading-relaxed text-gray-700">
                Temukan inspirasi, wawasan, dan strategi terkini untuk sukses
                dalam seleksi{' '}
                <span
                  className="font-bold"
                  style={{ color: mainColor }}
                >
                  PTN dan Kedinasan
                </span>{' '}
                dari para ahli.
              </p>
            </motion.div>
          </motion.div>

          {/* Content Container */}
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
              {/* Main Content - 3 cols */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8 lg:col-span-3"
              >
                {/* Filter Section - Enhanced design */}
                <Card
                  className="overflow-hidden rounded-3xl border-2 bg-white shadow-lg"
                  style={{ borderColor: `${mainColor}20` }}
                >
                  {/* Top Accent Bar */}
                  <div
                    className="h-2 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  />

                  <CardContent className="p-6">
                    <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-3xl p-3"
                          style={{ backgroundColor: `${mainColor}15` }}
                        >
                          <TrendingUp
                            className="h-6 w-6"
                            style={{ color: mainColor }}
                          />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-gray-900">
                            {sortBy === 'recent'
                              ? 'Artikel Terbaru'
                              : sortBy === 'popular'
                                ? 'Artikel Terpopuler'
                                : 'Terakhir Diperbarui'}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {filteredPosts.length} artikel ditemukan
                          </p>
                        </div>
                      </div>

                      <Select
                        value={sortBy}
                        onValueChange={(
                          value: 'recent' | 'popular' | 'updated',
                        ) => setSortBy(value)}
                      >
                        <SelectTrigger
                          className="w-[200px] rounded-3xl border-0 font-semibold shadow-sm"
                          style={{
                            backgroundColor: `${mainColor}10`,
                            color: mainColor,
                          }}
                        >
                          <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-3xl border-0 shadow-xl">
                          <SelectItem value="recent">📅 Terbaru</SelectItem>
                          <SelectItem value="popular">🔥 Terpopuler</SelectItem>
                          <SelectItem value="updated">
                            🔄 Terakhir Diperbarui
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts Grid */}
                {isLoading ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card
                        key={i}
                        className="overflow-hidden rounded-3xl border-2 bg-white shadow-lg"
                        style={{ borderColor: `${mainColor}20` }}
                      >
                        {/* Top Accent Bar Skeleton */}
                        <div
                          className="h-2 w-full animate-pulse"
                          style={{ backgroundColor: `${mainColor}40` }}
                        />

                        {/* Image Skeleton */}
                        <div className="aspect-video animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]" />

                        <CardContent className="space-y-4 p-6">
                          {/* Tags Skeleton */}
                          <div className="flex gap-2">
                            <div
                              className="h-6 w-16 animate-pulse rounded-full"
                              style={{ backgroundColor: `${mainColor}15` }}
                            />
                            <div
                              className="h-6 w-20 animate-pulse rounded-full"
                              style={{ backgroundColor: `${mainColor}15` }}
                            />
                          </div>

                          {/* Title Skeleton */}
                          <div className="space-y-2">
                            <div className="h-6 animate-pulse rounded-3xl bg-gray-200" />
                            <div className="h-6 w-3/4 animate-pulse rounded-3xl bg-gray-200" />
                          </div>

                          {/* Description Skeleton */}
                          <div className="space-y-2">
                            <div className="h-4 animate-pulse rounded bg-gray-100" />
                            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
                          </div>

                          {/* Meta Info Skeleton */}
                          <div className="flex justify-between pt-4">
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                          </div>
                        </CardContent>

                        {/* Button Skeleton */}
                        <CardFooter className="p-6 pt-0">
                          <div
                            className="h-12 w-full animate-pulse rounded-3xl"
                            style={{ backgroundColor: `${mainColor}40` }}
                          />
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="grid gap-6 md:grid-cols-2"
                  >
                    {filteredPosts.map((post: BlogPost) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card
                      className="overflow-hidden rounded-3xl border-2 bg-white p-12 text-center shadow-lg"
                      style={{ borderColor: `${mainColor}20` }}
                    >
                      {/* Top Accent Bar */}
                      <div
                        className="absolute top-0 right-0 left-0 h-2 w-full"
                        style={{
                          background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      />

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl"
                        style={{ backgroundColor: `${mainColor}15` }}
                      >
                        <SearchIcon
                          size={32}
                          style={{ color: mainColor }}
                        />
                      </motion.div>

                      <h3 className="mb-3 text-2xl font-black text-gray-900">
                        Tidak ada artikel ditemukan
                      </h3>
                      <p className="mb-6 leading-relaxed text-gray-600">
                        Coba ubah{' '}
                        <span className="font-bold text-gray-900">
                          kata kunci pencarian
                        </span>{' '}
                        atau{' '}
                        <span className="font-bold text-gray-900">filter</span>{' '}
                        yang dipilih.
                      </p>

                      <Button
                        onClick={() => {
                          setSearchQuery('');
                          setSortBy('recent');
                        }}
                        className="rounded-3xl border-0 px-6 py-3 font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                          color: 'white',
                        }}
                      >
                        Reset Filter
                      </Button>
                    </Card>
                  </motion.div>
                )}
              </motion.div>

              {/* Sidebar - 1 col */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <Sidebar
                  posts={blogs ?? []}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const readingTime = estimateReadingTime(post.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="group h-full cursor-pointer overflow-hidden rounded-3xl border-2 border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl">
          {/* Top Accent Bar */}
          <div
            className="h-2 w-full"
            style={{
              background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
            }}
          />

          {/* Image Section - Larger */}
          <div className="relative aspect-video overflow-hidden bg-gray-200">
            <Image
              src={post.thumbnail}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay Gradient - Always visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* Editor's Pick Badge - Top Right */}
            {post.isEditorPick && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="absolute top-4 right-4 z-20"
              >
                <Badge className="border-0 bg-yellow-500 px-3 py-1.5 text-sm font-black text-yellow-950 shadow-lg hover:bg-yellow-600">
                  <StarIcon className="mr-1.5 h-4 w-4 fill-current" />
                  Editor
                </Badge>
              </motion.div>
            )}

            {/* Title & Tag Overlay - Bottom */}
            <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-2"
              >
                {post.tags.length > 0 && (
                  <Badge className="rounded-full border-0 bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm backdrop-blur-sm">
                    #{post.tags[0]}
                  </Badge>
                )}
              </motion.div>
              <h3 className="line-clamp-2 text-xl leading-tight font-black drop-shadow-lg">
                {post.title}
              </h3>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-grow flex-col p-5">
            {/* Description */}
            <p className="mb-4 line-clamp-4 flex-grow text-sm leading-relaxed text-gray-600">
              {post.description}
            </p>

            {/* Info Badges Row - Horizontal Inside Card */}
            <div className="mb-4 grid grid-cols-3 gap-2.5">
              {/* Date Badge */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center justify-center rounded-3xl border-2 p-3 text-center transition-all"
                style={{
                  background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
                  borderColor: 'rgb(191 219 254)',
                }}
              >
                <p className="text-xs font-medium text-blue-600">
                  Dipublikasikan
                </p>
                <p className="line-clamp-1 text-sm font-bold text-blue-700">
                  {getDateString(post.createdAt.toString())}
                </p>
              </motion.div>

              {/* Reading Time Badge */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center justify-center rounded-3xl border-2 p-3 text-center transition-all"
                style={{
                  background: `linear-gradient(to bottom right, rgb(240 253 244), rgb(220 252 231))`,
                  borderColor: 'rgb(187 247 208)',
                }}
              >
                <p className="text-xs font-medium text-green-600">Waktu Baca</p>
                <p className="text-sm font-bold text-green-700">
                  {readingTime} menit
                </p>
              </motion.div>

              {/* Views Badge */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex flex-col items-center justify-center rounded-3xl border-2 p-3 text-center transition-all"
                style={{
                  background: `linear-gradient(to bottom right, rgb(254 249 195), rgb(254 240 138))`,
                  borderColor: 'rgb(253 224 71)',
                }}
              >
                <p className="text-xs font-medium text-yellow-600">
                  Telah Dibaca
                </p>
                <p className="text-sm font-bold text-yellow-700">
                  {post.views > 1000
                    ? (post.views / 1000).toFixed(1) + 'k'
                    : post.views.toLocaleString()}{' '}
                  kali
                </p>
              </motion.div>
            </div>

            {/* CTA Button */}
            <Button
              className="w-full rounded-3xl border-0 py-2.5 text-base font-bold text-white shadow-md transition-all duration-300 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
            >
              <ArrowRightIcon className="mr-2 h-5 w-5" />
              Baca Selengkapnya
            </Button>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function Sidebar({
  posts,
  searchQuery,
  setSearchQuery,
}: {
  posts: BlogPost[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  return (
    <div className="sticky top-32 space-y-6">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className="overflow-hidden rounded-3xl border-2 bg-white shadow-lg"
          style={{ borderColor: `${mainColor}20` }}
        >
          {/* Top Accent Bar */}
          <div
            className="h-2 w-full"
            style={{
              background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
            }}
          />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center font-black text-gray-900">
              <div
                className="mr-3 flex items-center justify-center rounded-3xl p-3"
                style={{ backgroundColor: `${mainColor}15` }}
              >
                <SearchIcon
                  className="h-5 w-5"
                  style={{ color: mainColor }}
                />
              </div>
              Cari Artikel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="relative">
              <SearchIcon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Masukkan kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-3xl border-2 bg-white pl-10 shadow-sm transition-all duration-300 focus:bg-gray-50"
                style={{ borderColor: `${mainColor}20` }}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Popular Tags */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card
          className="overflow-hidden rounded-3xl border-2 bg-white shadow-lg"
          style={{ borderColor: `${secondaryColor}20` }}
        >
          {/* Top Accent Bar */}
          <div
            className="h-2 w-full"
            style={{ backgroundColor: secondaryColor }}
          />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center font-black text-gray-900">
              <div
                className="mr-3 flex items-center justify-center rounded-3xl p-3"
                style={{ backgroundColor: `${secondaryColor}15` }}
              >
                <TagIcon
                  className="h-5 w-5"
                  style={{ color: secondaryColor }}
                />
              </div>
              Tag Populer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex flex-wrap gap-2">
              {getPopularTags(posts).map((tag: string, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer rounded-full border-0 px-3 py-1 font-bold shadow-sm transition-all duration-300"
                    style={{
                      backgroundColor: `${mainColor}15`,
                      color: mainColor,
                    }}
                    onClick={() => setSearchQuery(tag)}
                  >
                    #{tag}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Popular Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card
          className="overflow-hidden rounded-3xl border-2 bg-white shadow-lg"
          style={{ borderColor: '#fbbf2420' }}
        >
          {/* Top Accent Bar */}
          <div className="h-2 w-full bg-yellow-500" />
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center font-black text-gray-900">
              <div className="bg-opacity-15 mr-3 flex items-center justify-center rounded-3xl bg-yellow-500 p-3">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              Artikel Terpopuler
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="space-y-3">
              {getPopularPosts(posts).map((post: BlogPost, index: number) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group flex items-start gap-4 rounded-3xl border-2 border-transparent bg-gradient-to-r from-transparent p-4 transition-all duration-300 hover:border-yellow-200 hover:from-yellow-50 hover:shadow-md">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-base font-black text-white shadow-md">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="mb-2 line-clamp-2 leading-snug font-bold text-gray-900 transition-colors group-hover:text-yellow-700">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <EyeIcon className="h-3 w-3" />
                            <span className="font-medium">
                              {post.views.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-3 w-3" />
                            <span>
                              {getDateString(post.createdAt.toString())}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card
          className="overflow-hidden rounded-3xl border-2 bg-white shadow-lg"
          style={{ borderColor: `${mainColor}20` }}
        >
          {/* Top Accent Bar */}
          <div
            className="h-2 w-full"
            style={{
              background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
            }}
          />
          <CardContent className="p-6 text-center">
            <div
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Users
                className="h-8 w-8"
                style={{ color: mainColor }}
              />
            </div>
            <h3 className="mb-2 text-lg font-black text-gray-900">
              Komunitas Belajar
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              Bergabung dengan{' '}
              <span className="font-bold text-gray-900">ribuan pelajar</span>{' '}
              lain dalam mencapai impian{' '}
              <span
                className="font-bold"
                style={{ color: mainColor }}
              >
                PTN
              </span>
            </p>
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="rounded-3xl p-4"
                style={{ backgroundColor: `${secondaryColor}08` }}
              >
                <div className="mb-1 text-2xl font-black text-gray-900">
                  {posts.length}
                </div>
                <div className="text-xs font-medium text-gray-600">
                  Total Artikel
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Helper functions
function estimateReadingTime(content: string) {
  const wordsPerMinute = 300;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function sortPosts(
  posts: BlogPost[],
  sortBy: 'recent' | 'popular' | 'updated',
) {
  switch (sortBy) {
    case 'recent':
      return [...posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case 'popular':
      return [...posts].sort((a, b) => b.views - a.views);
    case 'updated':
      return [...posts].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }
}

function getPopularTags(posts: BlogPost[]) {
  const tagCounts = posts
    .flatMap((post) => post.tags || [])
    .reduce((acc: Record<string, number>, tag: string) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
  return Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);
}

function getPopularPosts(posts: BlogPost[]) {
  return [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
}
