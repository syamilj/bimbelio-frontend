'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import type { LiveClassAccessTypeEnum } from '@/types/database';
import {
  ArrowUp,
  Check,
  ExternalLink,
  Heart,
  Instagram,
  Loader2,
  MessageCircle,
  Share2,
  Trophy,
  Users,
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { useMutation } from '@/lib/fetch-helper/useMutation';

interface ProofItem {
  id: string;
  title: string;
  instruction: string;
  icon: ReactNode;
  link: string;
  points: number;
  required: boolean;
  step: number;
  completed: boolean;
  uploaded: boolean;
  loading: boolean;
  fileName: string;
  uploadType?: 'action' | 'file';
}

const instagramLink = '';

export const DialogLiveClassRegister = ({
  children,
  liveClassId,
  onFinish,
  liveClassAccessType,
}: {
  children: ReactNode;
  liveClassId: string;
  liveClassAccessType: LiveClassAccessTypeEnum;
  onFinish: () => Promise<void>;
}) => {
  const { userLimitation, checkLimitation } = useUserLimitation();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [step, setStep] = useState<number>(1);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [selectTypeRegistration, setSelectTypeRegistration] = useState<
    'free' | 'premium'
  >('free');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [proofItems, setProofItems] = useState<ProofItem[]>([]);

  useEffect(() => {
    // Generate proof items based on showDetail
    const items: ProofItem[] = [
      {
        id: 'instagram_follow',
        title: 'Follow Instagram',
        instruction: 'Klik Follow di profil Instagram',
        icon: <Instagram className="h-5 w-5" />,
        link: 'https://www.instagram.com/bimbelio.official',
        points: 10,
        required: true,
        step: 1,
        completed: false,
        uploaded: false,
        loading: false,
        fileName: '',
        uploadType: 'file',
      },
      {
        id: 'tiktok_follow',
        title: 'Follow TikTok',
        instruction: 'Klik Follow di profil TikTok',
        icon: <MessageCircle className="h-5 w-5" />,
        link: 'https://www.tiktok.com/@bimbelio.official',
        points: 10,
        required: true,
        step: 2,
        completed: false,
        uploaded: false,
        loading: false,
        fileName: '',
        uploadType: 'file',
      },
    ];

    // Add Instagram-specific tasks if instagram link exists
    if (instagramLink.length > 0) {
      items.push(
        {
          id: 'like_post',
          title: 'Like Postingan',
          instruction: 'Klik ❤️ di postingan',
          icon: <Heart className="h-5 w-5" />,
          link: instagramLink,
          points: 5,
          required: true,
          step: 3,
          completed: false,
          uploaded: false,
          loading: false,
          fileName: '',
          uploadType: 'file',
        },
        {
          id: 'tag_friends',
          title: 'Tag 3 Teman',
          instruction: 'Tulis komentar dan tag 3 teman dengan @username',
          icon: <Users className="h-5 w-5" />,
          link: instagramLink,
          points: 20,
          required: true,
          step: 4,
          completed: false,
          uploaded: false,
          loading: false,
          fileName: '',
          uploadType: 'file',
        },
        {
          id: 'share_story',
          title: 'Share ke Story',
          instruction: 'Klik Share → Add to Story',
          icon: <Share2 className="h-5 w-5" />,
          link: instagramLink,
          points: 15,
          required: true,
          step: 5,
          completed: false,
          uploaded: false,
          loading: false,
          fileName: '',
          uploadType: 'file',
        },
        {
          id: 'share_groups',
          title: 'Share ke 3 Grup WA',
          instruction: 'Copy link dan kirim ke 3 grup WhatsApp',
          icon: <Share2 className="h-5 w-5" />,
          link: instagramLink,
          points: 25,
          required: true,
          step: 6,
          completed: false,
          uploaded: false,
          loading: false,
          fileName: '',
          uploadType: 'file',
        },
      );
    }

    // Add WhatsApp group join task
    items.push({
      id: 'discord_join',
      title: 'Join Grup Belajar',
      instruction: 'Klik Join Group di Discord',
      icon: <Users className="h-5 w-5" />,
      link: 'https://discord.com/invite/5Fy3fnVaE9',
      points: 15,
      required: true,
      step: items.length + 1,
      completed: false,
      uploaded: false,
      loading: false,
      fileName: '',
      uploadType: 'file',
    });

    setProofItems(items);
  }, []);

  //   const [pricing, setPricing] = useState<Pricing>();
  //   const [pricingIsLoading, setPricingIsLoading] = useState<boolean>(true);
  //   useEffect(() => {
  //     getGeneral(`/pricing/getPricingBySlug?slug=tryout_unlock`, {
  //       setData: setPricing,
  //       setLoading: setPricingIsLoading,
  //     });
  //   }, []);

  const { mutate: registerLiveClass } = useMutation(
    '/liveClass/addLiveClassRegistration',
    'post',
    {
      payload: { liveClassId },
      async onSuccess() {
        await onFinish();
        setIsLoading(false);
      },
      onError() {
        setIsLoading(false);
      },
    },
  );

  const isPremium = session?.user.subsList.some(
    (item) => item.websiteSubCategoryId === website_sub_category_id_params,
  );

  const totalPoints = proofItems.reduce((sum, i) => sum + i.points, 0);
  const earnedPoints = proofItems.reduce(
    (sum, i) => sum + (i.uploaded ? i.points : 0),
    0,
  );
  const completedCount = proofItems.filter((i) => i.uploaded).length;
  const progress =
    proofItems.length > 0 ? (completedCount / proofItems.length) * 100 : 0;

  const handleAction = (id: string) => {
    const item = proofItems.find((i) => i.id === id);
    if (!item) return;

    if (!item.completed) {
      window.open(item.link, '_blank');
      setProofItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, loading: true } : i)),
      );
      setTimeout(
        () =>
          setProofItems((prev) =>
            prev.map((i) =>
              i.id === id ? { ...i, completed: true, loading: false } : i,
            ),
          ),
        3000,
      );
    } else if (!item.uploaded) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file?.type.includes('image'))
          setProofItems((prev) =>
            prev.map((i) =>
              i.id === id ? { ...i, uploaded: true, fileName: file.name } : i,
            ),
          );
        else if (file)
          toaster({
            title: 'Error',
            condition: 'warning',
            description: 'File harus berupa gambar!',
            duration: 3000,
          });
      };
      input.click();
    }
  };

  const handleRegister = () => {
    if (
      (isPremium || liveClassAccessType === 'FREE_NO_REGISTRATION') &&
      step == 1
    ) {
      setIsLoading(true);
      registerLiveClass();
    } else if (step === 2) {
      setIsLoading(true);
      registerLiveClass();
    } else {
      setStep(2);
    }
  };

  const handleSubmitProof = async () => {
    console.log('Submit proof items: ', proofItems);
    if (step !== 2) {
      return;
    }
    if (earnedPoints !== totalPoints) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: `Total poin harus ${totalPoints}, sekarang ${earnedPoints}`,
        duration: 3000,
      });
      return;
    }
    const missing = proofItems.filter((i) => !i.uploaded);
    if (missing.length) {
      toaster({
        title: 'Error',
        condition: 'warning',
        description: 'Lengkapi semua tugas terlebih dahulu!',
        duration: 3000,
      });
      return;
    }
    setIsLoading(true);
    handleRegister();
    // await onRegistrationComplete(false);
  };

  const renderButton = (item: ProofItem) => {
    if (item.loading)
      return (
        <>
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          <span>Tunggu...</span>
        </>
      );
    if (item.uploaded)
      return (
        <>
          <Check className="h-4 w-4 mr-2" />
          <span>Selesai</span>
        </>
      );
    if (item.completed)
      return (
        <>
          <ArrowUp className="h-4 w-4 mr-2" />
          <span>Upload</span>
        </>
      );
    return (
      <>
        <ExternalLink className="h-4 w-4 mr-2" />
        <span>Lakukan</span>
      </>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col items-center gap-3">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Daftar Kelas Live Learning
          </h2>
        </DialogHeader>
        {step === 2 && (
          <>
            <Card className="border-2 border-gray-100">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Progress Tugas
                    </span>
                    <span className="text-sm text-gray-500">
                      {completedCount}/{proofItems.length}
                    </span>
                  </div>
                  <Progress
                    value={progress}
                    className="h-2"
                  />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: mainColor }}
                      >
                        {earnedPoints}
                      </div>
                      <div className="text-xs text-gray-500">
                        Poin Terkumpul
                      </div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-600">
                        {totalPoints}
                      </div>
                      <div className="text-xs text-gray-500">Total Target</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proofItems.map((item) => (
                <Card
                  key={item.id}
                  className={cn(
                    'transition-all duration-300 border-2',
                    item.uploaded
                      ? 'border-green-300 bg-green-50 shadow-green-100'
                      : item.completed
                        ? 'border-blue-300 bg-blue-50 shadow-blue-100'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md',
                  )}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center',
                            item.uploaded
                              ? 'bg-green-100'
                              : item.completed
                                ? 'bg-blue-100'
                                : 'bg-gray-100',
                          )}
                        >
                          {item.uploaded ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            item.icon
                          )}
                        </div>
                        <Badge
                          className={cn(
                            'text-xs',
                            item.uploaded
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-gray-100 text-gray-700 border-gray-200',
                          )}
                        >
                          +{item.points} poin
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-sm">{item.title}</h3>
                        <p className="text-xs text-gray-600">
                          {item.instruction}
                        </p>

                        {/* Status Messages */}
                        {item.completed && !item.uploaded && (
                          <div className="flex items-center gap-1 text-blue-600 text-xs">
                            <ArrowUp className="w-3 h-3" />
                            <span>Siap upload bukti screenshot</span>
                          </div>
                        )}
                        {item.uploaded && (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <Check className="w-3 h-3" />
                            <span>
                              {item.fileName
                                ? `Terupload: ${item.fileName}`
                                : 'Tugas selesai'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button
                        className={cn(
                          'w-full text-xs h-8',
                          item.uploaded
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : item.completed
                              ? 'bg-blue-500 hover:bg-blue-600 text-white'
                              : 'bg-gray-500 hover:bg-gray-600 text-white',
                        )}
                        onClick={() => handleAction(item.id)}
                        disabled={item.loading || item.uploaded}
                      >
                        {renderButton(item)}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        <Card className="border-2 border-gray-100">
          <CardContent className="p-4">
            {step === 1 && (
              <Button
                className="w-full h-12 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>Daftar Live Learning</span>
                  </div>
                )}
              </Button>
            )}
            {step === 2 && (
              <Button
                className="w-full h-12 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
                }}
                onClick={handleSubmitProof}
                disabled={isLoading || earnedPoints !== totalPoints}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span>
                      Daftar Live Learning{' '}
                      {step === 2 && `(${earnedPoints} poin)`}
                    </span>
                  </div>
                )}
              </Button>
            )}
            {earnedPoints !== totalPoints && step == 2 && (
              <p className="text-center text-xs text-gray-500 mt-2">
                Lengkapi semua tugas untuk melanjutkan
              </p>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
