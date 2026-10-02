'use client';

import { useAppContext } from '@/components/provider/provider-app';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { SpinnerPage } from '@/components/ui/spinner';
import { getGeneral, mutateGeneral } from '@/lib/fetch-helper/fetch-helper';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useMedia from 'use-media';

import { SupportDialog } from '@/components/_shared/contact/support-dialog';
import { DocDataType } from '@/components/pdf-reader';
import { useSession } from '@/components/provider/provider-session-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackUnifiedEvent } from '@/lib/tracking/track';
import { cn } from '@/lib/utils';
import { CrownIcon, LockIcon, PlayIcon, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import ButtonUpgradeTryout from '../../../bimarena/try-out/_components/ui/button-upgrade-tryout';
import LeftComponent from './_components/left-component';
import { RightComponent } from './_components/right-component';

const DocViewerPage = () => {
  const pathname = usePathname();
  const router = useRouter();
  // const { query } = router;
  // const tab = query.tab as string;
  const searchParams = useSearchParams();
  const tab = searchParams?.get('tab');
  const pathnameArray = pathname?.split('/');
  const docId = pathnameArray && pathnameArray[pathnameArray?.length - 1];
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [doc, setDoc] = useState<DocDataType>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [status, setStatus] = useState<number>(200);
  const [error, setError] = useState<string | null>(null);
  const [tryoutId, setTryoutId] = useState<string | null>(null);
  const [tryoutLink, setTryoutLink] = useState<string | null>(null);

  const fetchDocData = useDebouncedCallback(async () => {
    await getGeneral('/document/getDocData', {
      setData: setDoc,
      setLoading: setIsLoading,
      toast: { hideError: true },
      params: {
        docId: docId,
        userId: userId,
      },
      onError({ data: resData, message, status }) {
        const data = resData as {
          tryoutId: string;
          website_sub_category_id: string;
        };
        // const
        setError(message);
        setStatus(status);
        setTryoutId(data.tryoutId);
        setTryoutLink(
          `/${data.website_sub_category_id}/user/bimarena/try-out?id=${data.tryoutId}`,
        );
      },
    });
  }, 500);

  useEffect(() => {
    fetchDocData();
  }, []);

  useEffect(() => {
    if (!tab) {
      router.push(`${pathname}?tab=chat`);
    }
  }, [tab]);

  const { setTransactionPopUp } = useAppContext();

  const updateHistory = async (payload: { documentId: string }) => {
    await mutateGeneral('/document/updateHistory', {
      payload: {
        ...payload,
        userId: session?.user.id,
      },
      toast: {
        hideSuccess: true,
        hideError: true,
      },
      type: 'put',
      onSuccess: () => {
        //     await trpc.document.getHistoryByUser.refetch();
        //     await trpc.document.getDocumentTotalPage.refetch();
      },
    });
  };

  const test = useDebouncedCallback(() => {
    updateHistory({
      documentId: docId as string,
    });
  }, 1000);

  useEffect(() => {
    test();
  }, []);

  const isMobile = useMedia({ maxWidth: '768px' });

  useEffect(() => {
    trackUnifiedEvent({
      eventName: 'ViewContent',
      customData: {
        content_name: 'Workspace',
        content_type: 'page',
        content_id: `workspace_document_${docId}`,
      },
      user: session?.user
        ? {
            email: session.user.email,
            phone: session.user.phone || undefined,
            userId: session.user.id,
            firstName: session.user.name?.split(' ')[0],
            lastName: session.user.name?.split(' ').slice(1).join(' '),
          }
        : undefined,
    });
  }, [session, docId]);

  if (!docId) {
    return <p>Document ID not found in the URL.</p>;
  }

  if (error) {
    return (
      <div className="relative flex h-full min-h-[90vh] w-full items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="animate-blob absolute top-20 left-10 h-72 w-72 rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter" />
          <div className="animate-blob animation-delay-2000 absolute top-40 right-10 h-72 w-72 rounded-full bg-yellow-500 opacity-20 mix-blend-multiply blur-3xl filter" />
          <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-40 h-72 w-72 rounded-full bg-pink-500 opacity-20 mix-blend-multiply blur-3xl filter" />
        </div>

        <Card className="relative z-10 w-full max-w-[95%] overflow-hidden border-0 bg-white/95 shadow-2xl backdrop-blur-sm md:max-w-4xl">
          {/* Gradient Border Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-75 blur-xl" />
          <div className="absolute inset-[2px] rounded-3xl bg-white" />

          <CardContent className="relative z-10 max-h-[90vh] overflow-y-auto p-8 md:max-h-[95vh] md:p-12">
            {/* Floating Particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-1 w-1 animate-float rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 4}s`,
                  }}
                />
              ))}
            </div>

            {/* Icon Container */}
            <div className="relative mb-8 flex items-center justify-center">
              <div className="relative">
                {/* Multiple Animated Rings */}
                <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-amber-400 to-orange-500 opacity-40 blur-2xl" />
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-yellow-400 to-red-500 opacity-30 blur-xl" />

                {/* Main Lock Container */}
                <div className="relative transform rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-8 shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3">
                  <div className="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-br from-yellow-300 to-orange-600 opacity-50" />
                  <LockIcon className="relative z-10 h-20 w-20 animate-bounce text-white drop-shadow-2xl" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-3 -right-3 animate-bounce rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 p-3 shadow-lg">
                  <CrownIcon className="h-6 w-6 text-white" />
                </div>

                {/* Sparkle Effects */}
                <Sparkles className="absolute -top-1 -left-1 h-6 w-6 animate-ping text-yellow-400" />
                <Sparkles className="absolute -right-1 -bottom-1 h-5 w-5 animate-pulse text-orange-400" />
              </div>
            </div>

            {/* Content with Animated Gradient Text */}
            <div className="mb-8 space-y-4 text-center">
              <h2 className="animate-gradient-x bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-xl font-extrabold text-transparent md:text-2xl">
                {error}
              </h2>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 opacity-50 blur-lg" />
                <p className="relative mx-auto max-w-md text-base leading-relaxed font-medium text-gray-700 md:text-lg">
                  Dapatkan akses penuh ke pembahasan detail, analisis skor
                  mendalam, dan fitur premium lainnya
                </p>
              </div>
            </div>

            {/* Enhanced Features List with Icons */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                { title: 'Pembahasan Lengkap', color: 'amber', icon: '📚' },
                { title: 'Analisis Mendalam', color: 'orange', icon: '🎯' },
                { title: 'Fitur Premium', color: 'red', icon: '⭐' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br from-white to-${feature.color}-50 rounded-3xl border-2 p-4 backdrop-blur-sm border-${feature.color}-200 hover:border-${feature.color}-400 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-${feature.color}-400 to-${feature.color}-600 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className={`bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 transform rounded-3xl p-2.5 transition-transform duration-300 group-hover:rotate-12`}
                    >
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 transition-colors group-hover:text-gray-900">
                      {feature.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Benefits */}
            <div className="mb-8 rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
              <h3 className="mb-4 flex items-center justify-center gap-2 text-center text-lg font-bold text-gray-800">
                <CrownIcon className="h-5 w-5 text-amber-600" />
                Manfaat Premium
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Akses Unlimited',
                  'Video HD',
                  'Latihan Soal',
                  'AI Assistant',
                  'Sertifikat',
                  'Priority Support',
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <div className="rounded-full bg-green-500 p-1">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Action Buttons */}
            <div className="mb-6 flex flex-col justify-center gap-4 sm:flex-row">
              {status === 400 && (
                <>
                  <ButtonUpgradeTryout tryoutId={tryoutId || ''}>
                    <Button
                      size="lg"
                      className="hover:shadow-3xl group relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-10 py-7 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-amber-600 hover:via-orange-600 hover:to-red-600"
                    >
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute inset-0 animate-shimmer bg-white opacity-0 group-hover:opacity-20" />
                      <div className="relative z-10 flex items-center gap-3">
                        <CrownIcon className="h-6 w-6 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                        <span className="text-lg">Beli Tryout</span>
                        <Sparkles className="h-5 w-5 animate-pulse" />
                      </div>
                    </Button>
                  </ButtonUpgradeTryout>

                  <Link
                    href={tryoutLink || ''}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="group w-full rounded-3xl border-3 border-amber-400 px-10 py-7 font-bold text-amber-700 shadow-xl transition-all duration-300 hover:scale-105 hover:border-amber-500 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:shadow-2xl"
                    >
                      <PlayIcon className="mr-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                      <span className="text-lg">Ikut Tryout</span>
                    </Button>
                  </Link>
                </>
              )}

              {status === 401 && (
                <Button
                  size="lg"
                  className="hover:shadow-3xl group relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 px-10 py-7 font-bold text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 sm:w-auto"
                  onClick={() => setTransactionPopUp(true)}
                >
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 animate-shimmer bg-white opacity-0 group-hover:opacity-20" />
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <Sparkles className="h-6 w-6 transition-all duration-300 group-hover:scale-125 group-hover:rotate-45" />
                    <span className="text-lg">Beli Subscription</span>
                    <CrownIcon className="h-5 w-5 animate-bounce" />
                  </div>
                </Button>
              )}
            </div>

            {/* Enhanced Bottom Note */}
            <div className="space-y-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                <p className="text-sm font-medium text-gray-600">
                  Butuh bantuan?{' '}
                  <SupportDialog>
                    <button className="cursor-pointer font-bold text-amber-600 decoration-wavy decoration-2 underline-offset-4 transition-colors hover:text-orange-600 hover:underline">
                      Hubungi Support
                    </button>
                  </SupportDialog>
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  100% Aman
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                  Support 24/7
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-purple-500" />
                  Money Back
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add custom animations to your globals.css */}
        <style jsx>{`
          @keyframes blob {
            0%,
            100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0) translateX(0);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) translateX(20px);
              opacity: 0;
            }
          }
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          @keyframes gradient-x {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
          .animate-float {
            animation: float linear infinite;
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
          .animate-gradient-x {
            background-size: 200% auto;
            animation: gradient-x 3s ease infinite;
          }
        `}</style>
      </div>
    );
  }

  if (isLoading || !doc) {
    return <SpinnerPage />;
  }

  return (
    <div className="flex h-full flex-col bg-slate-50/50">
      {/* Main Content Area */}
      <div className="min-h-0 flex-1">
        <ResizablePanelGroup
          autoSaveId="workspace-layout"
          direction={isMobile ? 'vertical' : 'horizontal'}
          className="h-full"
        >
          <ResizablePanel
            defaultSize={50}
            minSize={30}
            className={cn('DocumentContainer relative bg-white')}
          >
            <LeftComponent doc={doc} />
          </ResizablePanel>
          <ResizableHandleComponent />
          <ResizablePanel
            defaultSize={50}
            minSize={30}
            className="chatAIContainer relative bg-slate-50/80"
          >
            <RightComponent />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DocViewerPage;

const ResizableHandleComponent = () => {
  return (
    <ResizableHandle
      className="relative z-42 w-[5px] bg-slate-200/80 transition-colors duration-200 hover:bg-blue-400 active:bg-blue-500 data-[panel-group-direction=vertical]:h-[5px] data-[panel-group-direction=vertical]:w-full"
      withHandle
    />
  );
};
