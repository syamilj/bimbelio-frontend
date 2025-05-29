'use client';

import Login from '@/components/_shared/auth/login';
import SignUp from '@/components/_shared/auth/sign-up';
import Navbar from '@/components/_shared/navbar';
import AnimatedGradientText from '@/components/magicui/animated-gradient-text';
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
import { useGet, UseGetDataType } from '@/lib/fetch-helper/useGet';
import { getDateString } from '@/lib/utils';
import { BlogStatusEnum } from '@/types/database';
import {
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  Search,
  SearchIcon,
  ShareIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
} from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';

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
  const [showAuth, setShowAuth] = useState<Auth>({
    login: false,
    signUp: false,
  });
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'updated'>(
    'recent',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab] = useState('semua');

  // const { data: blogs, isLoading } = api.blog.getBlog.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });

  const {
    data: blogs,
    isLoading,
    refetch,
  }: UseGetDataType<BlogPost[]> = useGet('/blog/getBlog');

  useEffect(() => {
    document.body.style.overflow =
      showAuth.login || showAuth.signUp ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAuth]);

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
      <Navbar
        showAuth={showAuth}
        setShowAuth={setShowAuth}
      />
      {showAuth.login && (
        <Login
          showAuth={showAuth}
          setShowAuth={setShowAuth}
        />
      )}
      {showAuth.signUp && (
        <SignUp
          showAuth={showAuth}
          setShowAuth={setShowAuth}
        />
      )}
      <Head>
        <title>Blog SNBT dan UTBK</title>
        <meta
          name="description"
          content="Temukan inspirasi, wawasan, dan strategi terkini untuk sukses dalam seleksi SNBT/UTBK. Baca Blog-Blog pilihan dari para ahli yang dibuat oleh TutorSNBT."
        />
        <meta
          name="keywords"
          content="SNBT, SNBP, TutorSNBT. UTBK, tips belajar, persiapan ujian, strategi ujian"
        />
      </Head>
      <div className="container mx-auto px-4 py-8 pt-[7rem] bg-workspace">
        <h1 className="mb-4 text-center text-3xl font-bold">
          <AnimatedGradientText>Blog</AnimatedGradientText>
        </h1>
        <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
          Temukan inspirasi, wawasan, dan strategi terkini untuk sukses dalam
          seleksi SNBT/UTBK.
        </p>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="px-4">
              <div className="flex items-center justify-between">
                <h2>
                  <AnimatedGradientText className="text-xl font-semibold flex items-center gap-1">
                    <SparklesIcon className="text-xl text-blue-500" />
                    {sortBy === 'recent'
                      ? 'Terbaru'
                      : sortBy === 'popular'
                        ? 'Terpopuler'
                        : 'Diperbarui'}
                  </AnimatedGradientText>
                </h2>
                <Select
                  value={sortBy}
                  onValueChange={(value: 'recent' | 'popular' | 'updated') =>
                    setSortBy(value)
                  }
                >
                  <SelectTrigger className="w-[180px] rounded-xl bg-white shadow-sm">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="recent">Terbaru</SelectItem>
                    <SelectItem value="popular">Terpopuler</SelectItem>
                    <SelectItem value="updated">Terakhir Diperbarui</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-b mt-4"></div>
            </div>
            {isLoading ? (
              <Card className="p-8 text-center">
                <p className="text-xl text-muted-foreground">Memuat Blog...</p>
              </Card>
            ) : filteredPosts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {filteredPosts.map((post: BlogPost) => (
                  <BlogPostCard
                    key={post.id}
                    post={post}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center bg-transparent">
                <p className="text-xl text-muted-foreground">
                  Tidak ada Blog yang ditemukan.
                </p>
              </Card>
            )}
          </div>
          <div className="lg:col-span-1">
            <Sidebar
              posts={blogs ?? []}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group flex h-full cursor-pointer flex-col rounded-xl overflow-hidden transition-all duration-300 hover:shadow-sm">
        <div className="relative aspect-[16/9]">
          <Image
            src={post.thumbnail}
            alt={post.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
          {post.isEditorPick && (
            <Badge
              variant="secondary"
              className="absolute right-2 top-2 bg-yellow-500 text-yellow-950"
            >
              <StarIcon className="mr-1 h-3 w-3" />
              Pilihan Editor
            </Badge>
          )}
        </div>
        <CardContent className="flex-grow p-6">
          <div className="mb-3 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
          <CardTitle className="mb-2 line-clamp-2 text-xl transition-colors group-hover:text-primary">
            {post.title}
          </CardTitle>
          <CardDescription className="mb-4 line-clamp-2">
            {post.description}
          </CardDescription>
          <div className="mt-auto flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4" />
              {getDateString(post.createdAt.toString())}
            </span>
            <span className="flex items-center">
              <ClockIcon className="mr-1 h-4 w-4" />
              {estimateReadingTime(post.value)} menit baca
            </span>
            <span className="flex items-center">
              <EyeIcon className="mr-1 h-4 w-4" />
              {post.views.toLocaleString()} dilihat
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-6 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            Baca Selengkapnya
          </Button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  <ShareIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Bagikan</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardFooter>
      </Card>
    </Link>
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
  return (
    <div className="space-y-8">
      <Card className="overflow-hidden rounded-xl">
        <CardHeader className="bg-blue-100 text-primary">
          <CardTitle className="flex items-center">
            <SearchIcon className="mr-2 h-5 w-5" />
            Cari Blog
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <form className="flex space-x-2">
            <Input
              placeholder="Kata kunci..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow rounded-xl"
            />
            <Button
              type="submit"
              className="bg-main rounded-full"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="bg-green-100 text-black rounded-t-xl">
          <CardTitle className="flex items-center">
            <TagIcon className="mr-2 h-5 w-5" />
            Tag Populer
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {getPopularTags(posts).map((tag: string) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer transition-colors hover:bg-main hover:text-primary-foreground"
                onClick={() => setSearchQuery(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="bg-yellow-50 text-black rounded-t-xl">
          <CardTitle className="flex items-center">
            <StarIcon className="mr-2 h-5 w-5" />
            Blog Terpopuler
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {getPopularPosts(posts).map((post: BlogPost, index: number) => (
              <Link
                href={`/blog/${post.slug}`}
                key={post.slug}
              >
                <div className="group flex items-start space-x-3">
                  <span className="text-2xl font-bold text-main-gray-text2 transition-colors group-hover:text-primary">
                    {index + 1}
                  </span>
                  <div className="mb-2">
                    <p className="line-clamp-2 font-medium transition-colors group-hover:text-primary">
                      {post.title}
                    </p>
                    <div className="mt-1 flex items-center space-x-2 text-sm text-muted-foreground">
                      <EyeIcon className="h-4 w-4" />
                      <span>{post.views.toLocaleString()} dilihat</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
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
