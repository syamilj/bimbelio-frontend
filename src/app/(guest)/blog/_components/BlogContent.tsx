'use client';

import AdminImage from '@/_assets/logo-minimize.png';
import Navbar from '@/components/_shared/navbar';
import ToC from '@/components/_shared/other/ToC';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ReactMarkdownBlog from '@/components/ui/react-markdown-blog';
import { useGet } from '@/lib/fetch-helper/useGet';
import { useMutation } from '@/lib/fetch-helper/useMutation';
import { cn } from '@/lib/utils';
import { ParseHTMLtoMarkdown } from '@/lib/utils/editor';
import {
  addIdsToHeadings,
  extractHeadings,
  Heading,
  removeIdsFromContent,
} from '@/lib/utils/toc';
import { IconLeft } from '@/styles/icon';
import { useCreateBlockNote } from '@blocknote/react';
import 'katex/dist/katex.min.css';

import { motion, useScroll, useTransform } from 'framer-motion';
import {
  BookOpen,
  ChevronUpIcon,
  EyeIcon,
  Loader2,
  ShareIcon,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';

const MarkdownPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center w-full">
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>
  ),
});

// Samakan interface BlogPost dengan data yang di-pass server
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  value: string;
  thumbnail: string;
  views: number;
  createdAt: Date;
  tags: string[];
  publishedAt: Date | null;
  updatedAt: Date;
  isEditorPick: boolean | null;
  website_sub_category_id: string;
}

// Tipe agar login & signUp modal tetap berfungsi
interface Auth {
  login: boolean;
  signUp: boolean;
}

// Menerima prop `blog` (server) agar bisa di-render di client
export default function BlogClient({ blog }: { blog: BlogPost }) {
  const router = useRouter();
  const editor = useCreateBlockNote();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { scrollY } = useScroll();

  // Transform values for parallax effect
  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0.8]);

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  // Data lain (blogs, dsb.) masih pakai TRPC / useQuery
  // const { data: blogs } = api.blog.getBlog.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });
  const { data: blogs } = useGet<BlogPost[]>('/blog/getBlog');

  // const incrementViewsMutation = api.blog.incrementViews.useMutation();

  const { mutate: updateViews } = useMutation('/blog/incrementViews', 'post', {
    params: {
      id: blog.id,
    },
    hideToast: true,
  });

  const [headings, setHeadings] = useState<Heading[]>([]);
  const [processedContent, setProcessedContent] = useState<string>('');
  const [viewCount, setViewCount] = useState<number>(blog.views);
  const [showBackToTop, setShowBackToTop] = useState(false);

  /**
   * 1) Back-to-top button logic
   */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setShowBackToTop(scrollTop > 300);
    };
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * 3) Process content & increment view (run once per blog ID)
   *    - Hindari loop: dependency => [blog?.id]
   *    - Set initial heading, markdown
   *    - Check & increment views (localStorage) sekali
   */

  const getToc = async () => {
    const convertToMarkdown = await ParseHTMLtoMarkdown(blog.value, editor);
    const contentWithIds = addIdsToHeadings(convertToMarkdown);
    const extracted = extractHeadings(contentWithIds);
    setHeadings(extracted.filter((heading) => heading.level === 2));
    const cleanContent = removeIdsFromContent(contentWithIds);
    // const convertToHtml = await ParseMarkdownToHTML(cleanContent, editor);
    setProcessedContent(blog.value);

    setViewCount(blog.views);

    // Increment view count

    await updateViews();
    setViewCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (blog) {
      getToc();
    }
  }, [blog]);

  /**
   * 4) Handler share
   */
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.log('Web Share API not supported');
    }
  };

  /**
   * 5) Sorting
   */
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
      default:
        return posts;
    }
  }

  /**
   * 6) Format date string
   */
  const getDateString = (date: any) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return new Date(date).toLocaleDateString('id-ID', options);
  };

  return (
    <Fragment>
      <Navbar />

      {/* Hero Background with Parallax */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50/30 to-white"
      />

      <main className="relative z-10 container mx-auto px-4 py-8 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-12"
        >
          {/* Left Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:col-span-2 lg:block"
          >
            <div className="sticky top-24 space-y-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="ghost"
                  className="flex w-full items-center space-x-2 hover:shadow-md rounded-xl transition-all duration-300 border-2 border-gray-100 hover:border-opacity-50"
                  onClick={() => router.push('/blog')}
                  style={
                    {
                      '--hover-bg': `${mainColor}08`,
                    } as React.CSSProperties
                  }
                >
                  <IconLeft
                    w={10}
                    className="font-medium"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-bold">Lihat semua posting</span>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card
                  className="bg-white shadow-sm border-2 overflow-hidden rounded-3xl hover:shadow-md transition-all"
                  style={{ borderColor: `${mainColor}20` }}
                >
                  {/* Top Accent Bar */}
                  <div
                    className="h-2 w-full"
                    style={{
                      background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                    }}
                  />

                  {/* Header dengan icon */}
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: mainColor }}
                      >
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="text-lg font-black text-gray-900">
                        Artikel Terkait
                      </h3>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-2.5">
                    {sortPosts(blogs ?? [], 'recent')
                      .filter((post) => post.slug !== blog.slug)
                      .slice(0, 5)
                      .map((post, index) => (
                        <motion.div
                          key={post.slug}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ x: 4 }}
                        >
                          <Link href={`/blog/${post.slug}`}>
                            <div
                              className="group flex items-start gap-2.5 p-3 rounded-2xl hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-opacity-40"
                              style={
                                {
                                  '--hover-border': `${mainColor}30`,
                                } as React.CSSProperties
                              }
                            >
                              {/* Ranking Badge */}
                              <span
                                className="text-xs font-black px-2.5 py-1.5 rounded-lg text-white shadow-sm flex-shrink-0"
                                style={{ backgroundColor: mainColor }}
                              >
                                {index + 1}
                              </span>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p className="line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-opacity-70 transition-colors leading-snug">
                                  {post.title}
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <EyeIcon className="h-3 w-3" />
                                    <span className="font-medium">
                                      {post.views > 1000
                                        ? (post.views / 1000).toFixed(1) + 'k'
                                        : post.views}
                                    </span>
                                  </div>
                                  <span className="text-gray-400">•</span>
                                  <span className="font-medium">
                                    {getDateString(post.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-8 md:space-y-12 lg:col-span-7"
          >
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8 max-w-4xl mx-auto px-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h1 className="mt-10 md:mt-2 text-3xl font-bold text-center leading-tight lg:text-4xl">
                  {blog.title}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative rounded-3xl bg-white shadow-lg border-2 overflow-hidden w-full"
                style={{ borderColor: `${mainColor}20` }}
              >
                {/* Top Accent Bar */}
                <div
                  className="h-2 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                  }}
                />

                <div className="p-6 space-y-5">
                  {/* Author Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <Avatar
                          className="h-16 w-16 border-2 shadow-md"
                          style={{ borderColor: mainColor }}
                        >
                          <Image
                            src={AdminImage}
                            alt="Admin avatar"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                          />
                        </Avatar>
                      </motion.div>
                      <div>
                        <span
                          className="text-base font-black block"
                          style={{ color: mainColor }}
                        >
                          Bimbelio
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          @admin
                        </span>
                      </div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        className="rounded-xl border-0 shadow-md font-bold hover:shadow-lg transition-all duration-300 text-white px-4 py-2"
                        onClick={handleShare}
                        style={{
                          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                        }}
                      >
                        <ShareIcon className="w-4 h-4 mr-2" />
                        Bagikan
                      </Button>
                    </motion.div>
                  </div>

                  {/* Meta Info Grid - 2 columns */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center"
                      style={{
                        background: `linear-gradient(to bottom right, rgb(239 246 255), rgb(219 234 254))`,
                        borderColor: 'rgb(191 219 254)',
                      }}
                    >
                      <p className="text-xs font-medium text-blue-600">
                        Dipublikasikan
                      </p>
                      <p className="text-sm font-bold text-blue-700">
                        {getDateString(blog.createdAt)}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center"
                      style={{
                        background: `linear-gradient(to bottom right, rgb(254 249 195), rgb(254 240 138))`,
                        borderColor: 'rgb(253 224 71)',
                      }}
                    >
                      <p className="text-xs font-medium text-yellow-600">
                        Telah Dibaca
                      </p>
                      <p className="text-sm font-bold text-yellow-700">
                        {viewCount.toLocaleString()} kali
                      </p>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap items-center justify-center gap-3 py-4"
              >
                {blog.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      className="px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 font-bold text-base border-2 cursor-pointer"
                      style={{
                        backgroundColor: `${mainColor}15`,
                        color: mainColor,
                        borderColor: `${mainColor}30`,
                      }}
                    >
                      #{tag}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                whileHover={{ scale: 1.01 }}
                className={cn('w-full rounded-2xl overflow-hidden shadow-2xl')}
              >
                <Image
                  className="w-full transition-transform duration-700 hover:scale-105"
                  src={blog.thumbnail}
                  alt={`Thumbnail for ${blog.title}`}
                  width={1200}
                  height={630}
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </motion.div>
            </motion.header>

            {/* Section Header - Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex items-center gap-3 px-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: mainColor }}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-black text-gray-900">
                Konten Artikel
              </h2>
            </motion.div>

            {/* Content dengan backdrop blur effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative bg-white rounded-3xl shadow-md border-2 overflow-hidden hover:shadow-lg transition-all"
              style={{ borderColor: `${mainColor}20` }}
            >
              {/* Top Accent Bar */}
              <div
                className="h-2 w-full"
                style={{
                  background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                }}
              />
              <div className="p-8 md:p-10 prose prose-lg max-w-none">
                <ReactMarkdownBlog value={processedContent} />
              </div>
            </motion.div>
          </motion.article>

          {/* Right Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="hidden lg:col-span-3 lg:block"
          >
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-white rounded-2xl shadow-lg border-2 overflow-hidden"
                style={{ borderColor: `${mainColor}20` }}
              >
                {/* Top Accent Bar */}
                <div
                  className="h-2 w-full"
                  style={{
                    background: `linear-gradient(90deg, ${mainColor}, ${secondaryColor})`,
                  }}
                />
                <div className="p-4">
                  <ToC headings={headings} />
                </div>
              </motion.div>
            </div>
          </motion.aside>
        </motion.div>
      </main>

      {/* Enhanced Back to Top Button */}
      {showBackToTop && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              className="rounded-full p-3 shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300"
              onClick={scrollToTop}
              aria-label="Back to top"
              style={
                {
                  backgroundColor: mainColor,
                  '--hover-bg': secondaryColor,
                } as React.CSSProperties
              }
            >
              <ChevronUpIcon className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </Fragment>
  );
}
