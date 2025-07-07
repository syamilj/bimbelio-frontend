'use client';

import AdminImage from '@/_assets/logo-minimize.png';
import Footer from '@/components/_shared/footer';
import Navbar from '@/components/_shared/navbar';
import ToC from '@/components/_shared/other/ToC';
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

import {
  CalendarIcon,
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

  // Data lain (blogs, dsb.) masih pakai TRPC / useQuery
  // const { data: blogs } = api.blog.getBlog.useQuery(undefined, {
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  // });
  const { data: blogs } = useGet<BlogPost[]>('/blog/getBlog');

  // const incrementViewsMutation = api.blog.incrementViews.useMutation();

  const { mutate: updateViews } = useMutation('/blog/incrementViews', 'put', {
    payload: {
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

      <main className="container mx-auto px-4 py-8 md:py-[8rem]">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Sidebar */}
          <aside className="hidden lg:col-span-2 lg:block">
            <div className="sticky top-24 space-y-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <Button
                variant="ghost"
                className="flex w-full items-center space-x-2 hover:bg-main-gray-input2/50 rounded-xl"
                onClick={() => router.push('/blog')}
              >
                <IconLeft
                  w={10}
                  className="font-medium"
                  aria-hidden="true"
                />
                <span>Lihat semua posting</span>
              </Button>

              <Card>
                <CardHeader className="text-regular font-semibold px-4 py-2">
                  Artikel Lainnya
                </CardHeader>
                <CardContent className="px-2">
                  <div className="space-y-4">
                    {sortPosts(blogs ?? [], 'recent')
                      .filter((post) => post.slug !== blog.slug)
                      .slice(0, 5)
                      .map((post, index) => (
                        <Link
                          href={`/blog/${post.slug}`}
                          key={post.slug}
                        >
                          <div className="group flex items-start space-x-3">
                            <span className="text-l font-bold text-main-gray-text2 transition-colors group-hover:text-main-gray-text">
                              {index + 1}
                            </span>
                            <div className="mb-2">
                              <p className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-main-gray-text">
                                {post.title}
                              </p>
                              <div className="mt-1 flex items-center space-x-2 text-sm text-muted-foreground">
                                <EyeIcon className="h-4 w-4" />
                                <span>
                                  {post.views.toLocaleString()} dilihat
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>

          {/* Main Content */}
          <article className="space-y-6 md:space-y-8 lg:col-span-7">
            <header className="space-y-6 max-w-4xl mx-auto px-4">
              <h1 className="mt-10 md:mt-2 text-3xl font-bold text-center leading-tight lg:text-4xl">
                {blog.title}
              </h1>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10 border-2 border-main-gray-input">
                    <Image
                      src={AdminImage}
                      alt="Admin avatar"
                      sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             33vw"
                      style={{ objectFit: 'cover' }}
                    />
                  </Avatar>
                  <div>
                    <span className="text-sm font-medium">Bimbelio</span>
                    <span className="block text-xs text-main-gray-text">
                      @admin
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-main-gray-text">
                    <CalendarIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {getDateString(blog.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-main-gray-text">
                    <EyeIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {viewCount.toLocaleString()} dilihat
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl"
                    onClick={handleShare}
                  >
                    <ShareIcon className="mr-2 h-4 w-4" />
                    Bagikan
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {blog.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className={cn('w-full rounded-xl overflow-hidden')}>
                <Image
                  className="w-full"
                  src={blog.thumbnail}
                  alt={`Thumbnail for ${blog.title}`}
                  width={1200}
                  height={630}
                  // sizes="(max-width: 768px) 100vw,
                  //        (max-width: 1200px) 75vw,
                  //        50vw"
                  style={{ objectFit: 'cover', objectPosition: 'center' }}
                />
              </div>
            </header>

            {/* Markdown Preview */}
            {/* <MarkdownPreview
              source={processedContent}
              remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              wrapperElement={{ 'data-color-mode': 'light' }}
              className="
                ReactMarkdown
                max-w-none
                break-words
                leading-7
                text-main-black
              "
            /> */}

            <ReactMarkdownBlog value={processedContent} />
            {/* <BlocknoteEditor
              value={processedContent}
              viewOnly
            /> */}
          </article>

          {/* Right Sidebar */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-24">
              <ToC headings={headings} />
            </div>
          </aside>
        </div>
      </main>

      {showBackToTop && (
        <Button
          className="fixed bottom-8 right-8 rounded-full p-2 bg-main hover:bg-main-hover"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ChevronUpIcon className="h-6 w-6" />
        </Button>
      )}

      <Footer />
    </Fragment>
  );
}
