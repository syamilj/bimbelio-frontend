'use client';

import { PaymentTryout } from '@/components/_shared/payment/payment-tryout';
import { Instagram } from '@/components/icons/brand-icons';
import { useAppContext } from '@/components/provider/provider-app';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toaster } from '@/components/ui/toaster';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { useGet } from '@/lib/fetch-helper/useGet';
import { cn } from '@/lib/utils';
import { IconTailedArrowUp45, IconX } from '@/styles/icon';
import type { Pricing } from '@/types/database';
import {
  ArrowUp,
  Check,
  Clock,
  Crown,
  ExternalLink,
  Gift,
  Heart,
  Loader2,
  MessageCircle,
  Share2,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import type { CardTryoutProps } from './card-tryout';

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

interface RegistrationProofModalProps {
  showDetail: CardTryoutProps;
  setShowDetail: Dispatch<SetStateAction<CardTryoutProps | null>>;
  onRegistrationComplete: (
    isPremium?: boolean,
    couponCode?: string,
  ) => Promise<void>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function RegistrationProofModal({
  showDetail,
  setShowDetail,
  onRegistrationComplete,
  isLoading,
  setIsLoading,
}: RegistrationProofModalProps) {
  const { userLimitation, checkLimitation } = useUserLimitation();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { setTransactionPopUp } = useAppContext();

  const websiteSubCategoryId =
    websiteSubCategory?.id || showDetail.WebsiteSubCategory?.id;

  const [couponCode, setCouponCode] = useState<string>('');

  const { data: TryoutIrtData } = useGet<{
    isIrt: boolean;
    isDone: boolean;
  }>('/tryout/getIsTryoutIRT', {
    params: {
      tryoutId: showDetail.id,
      website_sub_category_id: websiteSubCategoryId,
    },
    useEffectDependencies: [showDetail, websiteSubCategoryId],
    enabled: !!websiteSubCategoryId,
  });

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [step, setStep] = useState<number>(1);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [selectTypeRegistration, setSelectTypeRegistration] = useState<
    'free' | 'premium' | 'coupon'
  >('free');
  const [pricing, setPricing] = useState<Pricing>();
  const [pricingIsLoading, setPricingIsLoading] = useState<boolean>(true);
  const [proofItems, setProofItems] = useState<ProofItem[]>([]);

  useEffect(() => {
    // Auto-select coupon if this is a coupon-only tryout
    if (showDetail?.isCouponOnly) {
      setSelectTypeRegistration('coupon');
    }
  }, [showDetail]);

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
    if (showDetail.instagram) {
      items.push(
        {
          id: 'like_post',
          title: 'Like Postingan',
          instruction: 'Klik ❤️ di postingan',
          icon: <Heart className="h-5 w-5" />,
          link: showDetail.instagram,
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
          link: showDetail.instagram,
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
          link: showDetail.instagram,
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
          link: showDetail.instagram,
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
      instruction: 'Klik Join Group di WA',
      icon: <Users className="h-5 w-5" />,
      link: 'https://www.bimbelio.com/link/komunitas',
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
  }, [showDetail]);

  useEffect(() => {
    getGeneral(`/pricing/getPricingBySlug?slug=tryout_unlock`, {
      setData: setPricing,
      setLoading: setPricingIsLoading,
    });
  }, []);

  useEffect(() => {
    // Fix: Only close modal when payment is cancelled AND we're in premium flow
    if (
      showPayment === false &&
      step === 3 &&
      selectTypeRegistration === 'premium'
    ) {
      setShowDetail(null);
      setStep(1);
    }
  }, [showPayment, setShowDetail, step, selectTypeRegistration]);

  useEffect(() => {
    const container = document.getElementById('register-tryout-modal') as
      HTMLDivElement | undefined;
    if (container && selectTypeRegistration === 'premium' && step === 3) {
      container.classList.remove('shadow-cardSoft');
      container.classList.remove('bg-white');
      container.classList.add('bg-transparent');
    } else if (container) {
      container.classList.remove('bg-transparent');
      container.classList.add('shadow-cardSoft');
      container.classList.add('bg-white');
    }
  }, [selectTypeRegistration, step]);

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

  const handleSubmitProof = async () => {
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
    await onRegistrationComplete(false);
  };

  const renderButton = (item: ProofItem) => {
    if (item.loading)
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Tunggu...</span>
        </>
      );
    if (item.uploaded)
      return (
        <>
          <Check className="mr-2 h-4 w-4" />
          <span>Selesai</span>
        </>
      );
    if (item.completed)
      return (
        <>
          <ArrowUp className="mr-2 h-4 w-4" />
          <span>Upload</span>
        </>
      );
    return (
      <>
        <ExternalLink className="mr-2 h-4 w-4" />
        <span>Lakukan</span>
      </>
    );
  };

  const endDate = new Date(showDetail.endDate).getTime();
  const nowDate = new Date().getTime();

  const isFinished =
    showDetail.id === 'cmkqjyg2w01iykuctdm6v3awh' && nowDate > endDate;

  if (step === 1) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Daftar Try Out</h2>
          <p className="text-sm text-gray-600">
            Apakah kamu akan mengikuti try out ini?
          </p>
        </div>

        <Card className="border-2 border-gray-100">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="text-center font-semibold text-gray-900">
                {showDetail.title}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-3xl"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <Trophy
                      className="h-4 w-4"
                      style={{ color: mainColor }}
                    />
                  </div>
                  <div>
                    <p className="text-gray-600">Peserta</p>
                    <p className="font-semibold">
                      {showDetail._count.TryoutRegistration}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-3xl"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <Clock
                      className="h-4 w-4"
                      style={{ color: mainColor }}
                    />
                  </div>
                  <div>
                    <p className="text-gray-600">Durasi</p>
                    <p className="font-semibold">
                      {showDetail.TryoutSession.reduce(
                        (acc, s) => acc + s.duration,
                        0,
                      )}{' '}
                      menit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {TryoutIrtData?.isDone && TryoutIrtData.isIrt && (
          <Card className="border-2 border-yellow-300 bg-yellow-50">
            <CardContent className="p-4 text-sm text-yellow-800">
              ⚠️ Penilaian tryout ini menggunakan sistem <b>IRT</b>. Karena Kamu
              mengerjakan setelah proses IRT selesai, maka nilai Kamu hanya
              berupa skor biasa (0-1000) dan tidak akan dihitung di leaderboard.
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <Button
          className="h-12 w-full rounded-3xl font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
          disabled={isLoading || isFinished}
          onClick={async () => {
            // 🔥 PENTING: Jika tryout coupon-only, WAJIB ke Step 2 untuk input kupon
            if (showDetail?.isCouponOnly) {
              setStep(2);
              return;
            }

            // Flow untuk tryout biasa (non-coupon-only)
            if (session?.user.role !== 'USER') {
              onRegistrationComplete(false);
            } else if (
              userLimitation &&
              userLimitation.tryout < userLimitation.tryoutLimit
            ) {
              setIsLoading(true);
              const check = await checkLimitation({ tryout: true });
              if (check && check.status) {
                onRegistrationComplete(true);
              } else {
                setIsLoading(false);
              }
            } else {
              toaster({
                title: 'Upss',
                condition: 'warning',
                description: 'Coin tryoutmu tidak cukup, coba opsi lain',
                duration: 3000,
              });
              setStep(2);
            }
          }}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memproses...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {isFinished ? (
                <span>Try Out telah selesai</span>
              ) : (
                <span>Daftar Try Out</span>
              )}

              <IconTailedArrowUp45 w={16} />
            </div>
          )}
        </Button>
      </div>
    );
  } else if (step === 2) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Gift className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Pilih Tipe Pendaftaran
          </h2>
          <p className="text-sm text-gray-600">
            Pilih opsi yang sesuai dengan kebutuhanmu
          </p>
        </div>

        {/* Top Up Option */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-blue-500">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">Top Up Coins</h3>
                  <p className="text-sm text-blue-700">
                    Langsung akses semua try out
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setShowDetail(null);
                  setTransactionPopUp(true);
                }}
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Top Up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registration Options */}
        <div className="space-y-4">
          {/* Info banner for coupon-only tryouts */}
          {showDetail?.isCouponOnly && (
            <Card className="border-2 border-purple-200 bg-purple-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Gift className="h-5 w-5 text-purple-600" />
                  <p className="text-sm font-medium text-purple-800">
                    Try out ini hanya bisa diakses menggunakan kupon. Silakan
                    masukkan kode kupon yang valid.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Premium Option */}
          {!showDetail?.isCouponOnly && (
            <Card
              onClick={() => setSelectTypeRegistration('premium')}
              className={cn(
                'relative cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:shadow-lg',
                selectTypeRegistration === 'premium'
                  ? 'scale-[1.02] shadow-lg'
                  : 'hover:scale-[1.01]',
              )}
              style={{
                borderColor:
                  selectTypeRegistration === 'premium' ? mainColor : '#e5e7eb',
                backgroundColor:
                  selectTypeRegistration === 'premium'
                    ? `${mainColor}05`
                    : 'white',
              }}
            >
              {/* Premium Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="border-0 bg-linear-to-r from-yellow-400 to-orange-500 text-white">
                  <Crown className="mr-1 h-3 w-3" />
                  Premium
                </Badge>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-linear-to-br from-yellow-400 to-orange-500">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Premium</CardTitle>
                    <CardDescription>
                      Daftar cepat dengan fitur eksklusif
                    </CardDescription>
                  </div>
                </div>
                <div className="mt-2">
                  {pricingIsLoading || !pricing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-500">
                        Loading harga...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        Rp {pricing.price.toLocaleString('id-ID')}
                      </span>
                      <Badge className="border-red-200 bg-red-100 text-red-700">
                        Sekali bayar
                      </Badge>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {[
                    'Semua fitur Gratis',
                    'Akses prioritas saat Try Out berlangsung',
                    'Analisis detail performa dan rekomendasi',
                    'Konsultasi dengan tutor',
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {/* Free Option */}
          {!showDetail?.isDone && !showDetail?.isCouponOnly && (
            <Card
              onClick={() => setSelectTypeRegistration('free')}
              className={cn(
                'cursor-pointer border-2 transition-all duration-300 hover:shadow-lg',
                selectTypeRegistration === 'free'
                  ? 'scale-[1.02] shadow-lg'
                  : 'hover:scale-[1.01]',
              )}
              style={{
                borderColor:
                  selectTypeRegistration === 'free' ? mainColor : '#e5e7eb',
                backgroundColor:
                  selectTypeRegistration === 'free'
                    ? `${mainColor}05`
                    : 'white',
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-3xl"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Star
                        className="h-5 w-5"
                        style={{ color: mainColor }}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Gratis</CardTitle>
                      <CardDescription>
                        Daftar dengan mengikuti tugas sosial media
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="border-green-200 bg-green-100 text-green-700">
                    FREE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {[
                    'Akses ke semua materi Try Out',
                    'Hasil dan pembahasan setelah Try Out selesai',
                    'Peringkat nasional',
                  ].map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-sm"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Coupon Option - Always shown, highlighted for coupon-only tryouts */}
          <Card
            onClick={() => setSelectTypeRegistration('coupon')}
            className={cn(
              'relative cursor-pointer overflow-hidden border-2 transition-all duration-300 hover:shadow-lg',
              selectTypeRegistration === 'coupon' || showDetail?.isCouponOnly
                ? 'scale-[1.02] shadow-lg'
                : 'hover:scale-[1.01]',
            )}
            style={{
              borderColor:
                selectTypeRegistration === 'coupon' || showDetail?.isCouponOnly
                  ? mainColor
                  : '#e5e7eb',
              backgroundColor:
                selectTypeRegistration === 'coupon' || showDetail?.isCouponOnly
                  ? `${mainColor}05`
                  : 'white',
            }}
          >
            {/* Premium Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="border-0 bg-linear-to-r from-green-400 to-blue-500 text-white">
                <Gift className="mr-1 h-3 w-3" />
                Coupon
              </Badge>
            </div>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-3xl bg-linear-to-br from-green-400 to-blue-500">
                  <Gift className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Coupon</CardTitle>
                  <CardDescription>
                    Gunakan kupon untuk mendapatkan diskon
                  </CardDescription>
                </div>
              </div>
              <div className="mt-2">
                {/* Placeholder for coupon input or discount info */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Masukkan kode kupon untuk diskon
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {[
                  'Daftar gratis dengan coupon',
                  'Akses prioritas saat Try Out berlangsung',
                  'Analisis detail performa dan rekomendasi',
                ].map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <Button
          className="h-12 w-full rounded-3xl font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
          onClick={() => {
            // Auto-select coupon for coupon-only tryouts
            if (showDetail?.isCouponOnly) {
              setSelectTypeRegistration('coupon');
              setStep(3);
              return;
            }
            setStep(3);
            if (selectTypeRegistration === 'premium') {
              setShowPayment(true);
            }
          }}
        >
          Selanjutnya
        </Button>
      </div>
    );
  } else if (step === 3 && selectTypeRegistration === 'free') {
    return (
      <div className="space-y-6">
        {/* Close Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Bukti Pendaftaran Try Out
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetail(null)}
            className="h-8 w-8 rounded-full p-0 hover:bg-gray-100"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>

        {/* Progress Section */}
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
                  <div className="text-xs text-gray-500">Poin Terkumpul</div>
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

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {proofItems.map((item) => (
            <Card
              key={item.id}
              className={cn(
                'border-2 transition-all duration-300',
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
                        'flex h-10 w-10 items-center justify-center rounded-3xl',
                        item.uploaded
                          ? 'bg-green-100'
                          : item.completed
                            ? 'bg-blue-100'
                            : 'bg-gray-100',
                      )}
                    >
                      {item.uploaded ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        item.icon
                      )}
                    </div>
                    <Badge
                      className={cn(
                        'text-xs',
                        item.uploaded
                          ? 'border-green-200 bg-green-100 text-green-700'
                          : 'border-gray-200 bg-gray-100 text-gray-700',
                      )}
                    >
                      +{item.points} poin
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.instruction}</p>

                    {/* Status Messages */}
                    {item.completed && !item.uploaded && (
                      <div className="flex items-center gap-1 text-xs text-blue-600">
                        <ArrowUp className="h-3 w-3" />
                        <span>Siap upload bukti screenshot</span>
                      </div>
                    )}
                    {item.uploaded && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <Check className="h-3 w-3" />
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
                      'h-8 w-full text-xs',
                      item.uploaded
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : item.completed
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-500 text-white hover:bg-gray-600',
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

        {/* Submit Button */}
        <Card className="border-2 border-gray-100">
          <CardContent className="p-4">
            <Button
              className="h-12 w-full rounded-3xl font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
              onClick={handleSubmitProof}
              disabled={isLoading || earnedPoints !== totalPoints}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memproses...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  <span>Daftar Try Out ({earnedPoints} poin)</span>
                </div>
              )}
            </Button>
            {earnedPoints !== totalPoints && (
              <p className="mt-2 text-center text-xs text-gray-500">
                Lengkapi semua tugas untuk melanjutkan
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } else if (step === 3 && selectTypeRegistration === 'coupon') {
    return (
      <div className="space-y-6">
        {/* Close Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Bukti Pendaftaran Try Out
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetail(null)}
            className="h-8 w-8 rounded-full p-0 hover:bg-gray-100"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>

        {/* Coupon Input Section */}
        <Card className="border-2 border-gray-100">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Kode Kupon
                </label>
                <input
                  type="text"
                  placeholder="Masukkan kode kupon Anda"
                  className="w-full rounded-3xl border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.trim())}
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500">
                Pastikan kode kupon valid dan belum kadaluarsa.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card className="border-2 border-gray-100">
          <CardContent className="p-4">
            <Button
              className="h-12 w-full rounded-3xl font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl"
              style={{
                background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
              }}
              onClick={() => {
                // Validasi kupon tidak kosong
                if (!couponCode || couponCode.trim().length === 0) {
                  toaster({
                    title: 'Error',
                    condition: 'warning',
                    description: 'Silakan masukkan kode kupon!',
                    duration: 3000,
                  });
                  return;
                }
                // isPremium = false because coupon is for free access
                onRegistrationComplete(false, couponCode);
              }}
              disabled={isLoading || !couponCode.trim()}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  <span>Daftar dengan Kupon</span>
                </div>
              )}
            </Button>
            {!couponCode && (
              <p className="mt-2 text-center text-xs text-gray-500">
                Masukkan kode kupon untuk melanjutkan
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  } else if (step === 3 && selectTypeRegistration === 'premium') {
    return (
      <PaymentTryout
        tryoutData={showDetail}
        setShow={setShowPayment}
        show={showPayment}
      />
    );
  }

  return null;
}
