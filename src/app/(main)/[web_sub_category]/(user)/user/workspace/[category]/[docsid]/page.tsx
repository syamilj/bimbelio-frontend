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
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import ButtonUpgradeTryout from '../../../try-out/_components/ui/button-upgrade-tryout';
import LeftComponent from './_components/left-component';
import { RightComponent } from './_components/right-component';

const DocViewer = dynamic(() => import('@/components/pdf-reader'), {
  ssr: false,
});

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
          `/${data.website_sub_category_id}/user/try-out?id=${data.tryoutId}`,
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

  const { mobileScreen, setSidebarMobile, setTransactionPopUp } =
    useAppContext();

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
      <div className="flex justify-center items-center w-full h-full min-h-[90vh] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <Card className="max-w-[95%] md:max-w-4xl w-full border-0 shadow-2xl overflow-hidden backdrop-blur-sm bg-white/95 relative z-10">
          {/* Gradient Border Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 opacity-75 blur-xl" />
          <div className="absolute inset-[2px] bg-white rounded-xl" />

          <CardContent className="relative p-8 md:p-12 z-10 max-h-[90vh] md:max-h-[95vh] overflow-y-auto">
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-float"
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
            <div className="flex items-center justify-center mb-8 relative">
              <div className="relative">
                {/* Multiple Animated Rings */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl opacity-40 animate-ping" />
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full blur-xl opacity-30 animate-pulse" />

                {/* Main Lock Container */}
                <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-8 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-500 hover:rotate-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-600 rounded-3xl animate-pulse opacity-50" />
                  <LockIcon className="h-20 w-20 text-white drop-shadow-2xl relative z-10 animate-bounce" />
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-3 -right-3 bg-gradient-to-br from-yellow-400 to-amber-500 p-3 rounded-full shadow-lg animate-bounce">
                  <CrownIcon className="h-6 w-6 text-white" />
                </div>

                {/* Sparkle Effects */}
                <Sparkles className="absolute -top-1 -left-1 h-6 w-6 text-yellow-400 animate-ping" />
                <Sparkles className="absolute -bottom-1 -right-1 h-5 w-5 text-orange-400 animate-pulse" />
              </div>
            </div>

            {/* Content with Animated Gradient Text */}
            <div className="text-center space-y-4 mb-8">
              <h2 className="text-xl md:text-2xl font-extrabold bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 bg-clip-text text-transparent animate-gradient-x">
                {error}
              </h2>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 blur-lg opacity-50" />
                <p className="relative text-base md:text-lg text-gray-700 max-w-md mx-auto leading-relaxed font-medium">
                  Dapatkan akses penuh ke pembahasan detail, analisis skor
                  mendalam, dan fitur premium lainnya
                </p>
              </div>
            </div>

            {/* Enhanced Features List with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { title: 'Pembahasan Lengkap', color: 'amber', icon: '📚' },
                { title: 'Analisis Mendalam', color: 'orange', icon: '🎯' },
                { title: 'Fitur Premium', color: 'red', icon: '⭐' },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br from-white to-${feature.color}-50 backdrop-blur-sm p-4 rounded-xl border-2 border-${feature.color}-200 hover:border-${feature.color}-400 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-${feature.color}-400 to-${feature.color}-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className={`bg-gradient-to-br from-${feature.color}-100 to-${feature.color}-200 p-2.5 rounded-lg transform group-hover:rotate-12 transition-transform duration-300`}
                    >
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {feature.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Premium Benefits */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-8 border-2 border-amber-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center gap-2">
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
                    <div className="bg-green-500 rounded-full p-1">
                      <svg
                        className="w-3 h-3 text-white"
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {status === 400 && (
                <>
                  <ButtonUpgradeTryout tryoutId={tryoutId || ''}>
                    <Button
                      size="lg"
                      className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold px-10 py-7 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group rounded-2xl"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                      <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 animate-shimmer" />
                      <div className="relative flex items-center gap-3 z-10">
                        <CrownIcon className="h-6 w-6 group-hover:rotate-12 group-hover:scale-125 transition-all duration-300" />
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
                      className="w-full border-3 border-amber-400 text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:border-amber-500 font-bold px-10 py-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group rounded-2xl"
                    >
                      <PlayIcon className="mr-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                      <span className="text-lg">Ikut Tryout</span>
                    </Button>
                  </Link>
                </>
              )}

              {status === 401 && (
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold px-10 py-7 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group w-full sm:w-auto rounded-2xl"
                  onClick={() => setTransactionPopUp(true)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 animate-shimmer" />
                  <div className="relative flex items-center justify-center gap-3 z-10">
                    <Sparkles className="h-6 w-6 group-hover:rotate-45 group-hover:scale-125 transition-all duration-300" />
                    <span className="text-lg">Beli Subscription</span>
                    <CrownIcon className="h-5 w-5 animate-bounce" />
                  </div>
                </Button>
              )}
            </div>

            {/* Enhanced Bottom Note */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
                <p className="text-sm text-gray-600 font-medium">
                  Butuh bantuan?{' '}
                  <SupportDialog>
                    <button className="text-amber-600 font-bold hover:text-orange-600 transition-colors hover:underline decoration-wavy decoration-2 underline-offset-4 cursor-pointer">
                      Hubungi Support
                    </button>
                  </SupportDialog>
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-400" />
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  100% Aman
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Support 24/7
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
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
    <div className="h-full flex flex-col">
      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        <ResizablePanelGroup
          autoSaveId="workspace-layout"
          direction={isMobile ? 'vertical' : 'horizontal'}
          onLayout={() => {}}
          className="h-full"
        >
          <ResizablePanel
            defaultSize={50}
            minSize={30}
            className={cn(
              `DocumentContainer relative`,
              !isMobile && 'border-r border-gray-200',
              isMobile && 'border-b border-gray-200',
            )}
          >
            <LeftComponent doc={doc} />
          </ResizablePanel>
          <ResizableHandleComponent />
          <ResizablePanel
            defaultSize={50}
            minSize={30}
            className="chatAIContainer relative"
          >
            <RightComponent docId={docId} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default DocViewerPage;

const ResizableHandleComponent = () => {
  const isMobile = useMedia({ maxWidth: '768px' });

  return (
    <div className="relative flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors">
      <ResizableHandle
        className="relative z-42 h-full w-[4px] bg-gray-300 duration-300 data-[panel-group-direction=vertical]:h-[4px] data-[panel-group-direction=vertical]:w-full hover:bg-blue-400 active:bg-blue-500"
        withHandle
      />
      <div className="absolute z-41 h-[40px] w-[12px] rounded-full bg-gray-400 md:h-[12px] md:w-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
