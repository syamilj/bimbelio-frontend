'use client';

import Navbar from '@/components/_shared/navbar';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useGet } from '@/lib/fetch-helper/useGet';
import { getDateString } from '@/lib/utils';
import { BlogStatusEnum } from '@/types/database';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  SearchIcon,
  ShareIcon,
  StarIcon,
  TagIcon,
  TrendingUp,
  Users,
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useCallback, useMemo, useState } from 'react';

interface Auth {
  login: boolean;
  signUp: boolean;
}

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
    refetch,
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
      <Navbar />
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
      <div className="relative min-h-screen">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 right-10 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: mainColor }}
          />
          <div
            className="absolute bottom-20 left-10 w-64 h-64 rounded-full opacity-5 blur-2xl"
            style={{ backgroundColor: secondaryColor }}
          />
        </div>

        {/* Main Content */}
        <div className="relative z-10 pt-28 pb-16">
          {/* Modern Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 px-4"
          >
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6"
              style={{
                backgroundColor: `${mainColor}10`,
                color: mainColor,
              }}
            >
              <BookOpen size={16} />
              Artikel & Insight
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Blog Bimbelio
            </h1>

            <p className="mx-auto max-w-2xl text-xl text-gray-600 leading-relaxed">
              Temukan inspirasi, wawasan, dan strategi terkini untuk sukses
              dalam seleksi PTN dan Kedinasan dari para ahli.
            </p>
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
                {/* Filter Section */}
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${mainColor}15` }}
                        >
                          <TrendingUp
                            size={20}
                            style={{ color: mainColor }}
                          />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          {sortBy === 'recent'
                            ? 'Artikel Terbaru'
                            : sortBy === 'popular'
                              ? 'Artikel Terpopuler'
                              : 'Terakhir Diperbarui'}
                        </h2>
                      </div>

                      <Select
                        value={sortBy}
                        onValueChange={(
                          value: 'recent' | 'popular' | 'updated',
                        ) => setSortBy(value)}
                      >
                        <SelectTrigger
                          className="w-[180px] rounded-xl border-0 shadow-sm"
                          style={{ backgroundColor: `${mainColor}08` }}
                        >
                          <SelectValue placeholder="Urutkan" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-0 shadow-xl">
                          <SelectItem value="recent">Terbaru</SelectItem>
                          <SelectItem value="popular">Terpopuler</SelectItem>
                          <SelectItem value="updated">
                            Terakhir Diperbarui
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
                        className="border-0 shadow-lg rounded-2xl overflow-hidden"
                      >
                        <div className="aspect-video bg-gray-200 animate-pulse" />
                        <CardContent className="p-6 space-y-3">
                          <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                        </CardContent>
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
                    {filteredPosts.map((post: BlogPost, index) => (
                      <BlogPostCard
                        key={post.id}
                        post={post}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <Card className="border-0 shadow-lg rounded-2xl p-12 text-center bg-white/80 backdrop-blur-sm">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <SearchIcon
                        size={24}
                        style={{ color: mainColor }}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Tidak ada artikel ditemukan
                    </h3>
                    <p className="text-gray-600">
                      Coba ubah kata kunci pencarian atau filter yang dipilih.
                    </p>
                  </Card>
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="group h-full cursor-pointer border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={post.thumbnail}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {post.isEditorPick && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute right-3 top-3"
              >
                <Badge className="bg-yellow-500 hover:bg-yellow-500 text-yellow-950 font-semibold shadow-lg border-0">
                  <StarIcon className="mr-1 h-3 w-3 fill-current" />
                  Pilihan Editor
                </Badge>
              </motion.div>
            )}
          </div>

          <CardContent className="p-6 flex flex-col h-full">
            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge
                    variant="outline"
                    className="text-xs px-2 py-1 rounded-full border-0 font-medium"
                    style={{
                      backgroundColor: `${mainColor}15`,
                      color: mainColor,
                    }}
                  >
                    #{tag}
                  </Badge>
                </motion.div>
              ))}
            </div>

            {/* Title */}
            <CardTitle className="mb-3 line-clamp-2 text-xl font-bold leading-tight transition-colors group-hover:text-gray-600">
              {post.title}
            </CardTitle>

            {/* Description */}
            <CardDescription className="mb-6 line-clamp-3 text-gray-600 leading-relaxed flex-grow">
              {post.description}
            </CardDescription>

            {/* Meta info */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{getDateString(post.createdAt.toString())}</span>
                </div>
                <div className="flex items-center gap-1">
                  <EyeIcon className="h-4 w-4" />
                  <span>{post.views.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <ClockIcon className="h-4 w-4" />
                  <span>{estimateReadingTime(post.value)} menit baca</span>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          // Add share functionality
                        }}
                      >
                        <ShareIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Bagikan artikel</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardContent>

          {/* Read more CTA */}
          <CardFooter className="p-6 pt-0">
            <Button
              className="w-full rounded-xl font-semibold transition-all duration-300 border-0 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: mainColor,
                color: 'white',
              }}
            >
              Baca Selengkapnya
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                →
              </motion.div>
            </Button>
          </CardFooter>
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
    <div className="space-y-6 sticky top-32">
      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader
            className="pb-4"
            style={{
              background: `linear-gradient(135deg, ${mainColor}15, ${mainColor}08)`,
            }}
          >
            <CardTitle className="flex items-center text-gray-900">
              <div
                className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                style={{ backgroundColor: mainColor }}
              >
                <SearchIcon className="h-4 w-4 text-white" />
              </div>
              Cari Artikel
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Masukkan kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl border-0 shadow-sm bg-gray-50 focus:bg-white transition-colors"
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
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader
            className="pb-4"
            style={{
              background: `linear-gradient(135deg, ${secondaryColor}15, ${secondaryColor}08)`,
            }}
          >
            <CardTitle className="flex items-center text-gray-900">
              <div
                className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center"
                style={{ backgroundColor: secondaryColor }}
              >
                <TagIcon className="h-4 w-4 text-white" />
              </div>
              Tag Populer
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="flex flex-wrap gap-2">
              {getPopularTags(posts).map((tag: string, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer transition-all duration-300 hover:scale-105 border-0 shadow-sm"
                    style={{
                      backgroundColor: `${mainColor}10`,
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
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardHeader
            className="pb-4"
            style={{
              background: `linear-gradient(135deg, #fbbf2415, #fbbf2408)`,
            }}
          >
            <CardTitle className="flex items-center text-gray-900">
              <div className="w-8 h-8 rounded-lg mr-3 flex items-center justify-center bg-yellow-500">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              Artikel Terpopuler
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-4">
            <div className="space-y-4">
              {getPopularPosts(posts).map((post: BlogPost, index: number) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="group flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all duration-300">
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
                        style={{ backgroundColor: mainColor }}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-2 group-hover:text-gray-600 transition-colors mb-1">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <EyeIcon className="h-3 w-3" />
                            <span>{post.views.toLocaleString()}</span>
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
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: `${mainColor}15` }}
            >
              <Users
                className="h-6 w-6"
                style={{ color: mainColor }}
              />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Komunitas Belajar
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Bergabung dengan ribuan pelajar lain dalam mencapai impian PTN
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-900">15K+</div>
                <div className="text-xs text-gray-500">Member Aktif</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-900">
                  {posts.length}
                </div>
                <div className="text-xs text-gray-500">Total Artikel</div>
              </div>
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
