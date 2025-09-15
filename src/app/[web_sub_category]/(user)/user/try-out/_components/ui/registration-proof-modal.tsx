'use client';

import { PaymentTryout } from '@/components/_shared/payment/payment-tryout';
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
  Instagram,
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
  onRegistrationComplete: (isPremium?: boolean) => void;
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

  const { data: TryoutIrtData, isLoading: TryoutIrtDataIsLoading } = useGet<{
    isIrt: boolean;
    isDone: boolean;
  }>('/tryout/getIsTryoutIRT', {
    params: { tryoutId: showDetail.id },
    useEffectDependencies: [showDetail],
  });

  // Get dynamic colors
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const [step, setStep] = useState<number>(1);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [selectTypeRegistration, setSelectTypeRegistration] = useState<
    'free' | 'premium'
  >('free');
  const [pricing, setPricing] = useState<Pricing>();
  const [pricingIsLoading, setPricingIsLoading] = useState<boolean>(true);
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
      id: 'telegram_join',
      title: 'Join Grup Belajar',
      instruction: 'Klik Join Group di Telegram',
      icon: <Users className="h-5 w-5" />,
      link: 'https://t.me/bimbelio',
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
      | HTMLDivElement
      | undefined;
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

  if (step === 1) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Daftar Try Out</h2>
          <p className="text-gray-600 text-sm">
            Apakah kamu akan mengikuti try out ini?
          </p>
        </div>

        <Card className="border-2 border-gray-100">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-center text-gray-900">
                {showDetail.title}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <Trophy
                      className="w-4 h-4"
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
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${mainColor}15` }}
                  >
                    <Clock
                      className="w-4 h-4"
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
              ⚠️ Penilaian tryout ini menggunakan sistem <b>IRT</b>. Karena Anda
              mengerjakan setelah proses IRT selesai, maka nilai Anda hanya
              berupa skor biasa (0-1000) dan tidak akan dihitung di leaderboard.
            </CardContent>
          </Card>
        )}

        {/* Action Button */}
        <Button
          className="w-full h-12 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
          disabled={isLoading}
          onClick={async () => {
            if (session?.user.role !== 'USER') {
              onRegistrationComplete();
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
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Daftar Try Out</span>
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
        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
            }}
          >
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Pilih Tipe Pendaftaran
          </h2>
          <p className="text-gray-600 text-sm">
            Pilih opsi yang sesuai dengan kebutuhanmu
          </p>
        </div>

        {/* Top Up Option */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
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
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Top Up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Registration Options */}
        <div className="space-y-4">
          {/* Free Option */}
          {!showDetail?.isDone && (
            <Card
              onClick={() => setSelectTypeRegistration('free')}
              className={cn(
                'cursor-pointer transition-all duration-300 hover:shadow-lg border-2',
                selectTypeRegistration === 'free'
                  ? 'shadow-lg scale-[1.02]'
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
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${mainColor}15` }}
                    >
                      <Star
                        className="w-5 h-5"
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
                  <Badge className="bg-green-100 text-green-700 border-green-200">
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
                      <Check className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Premium Option */}
          <Card
            onClick={() => setSelectTypeRegistration('premium')}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:shadow-lg border-2 relative overflow-hidden',
              selectTypeRegistration === 'premium'
                ? 'shadow-lg scale-[1.02]'
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
              <Badge className="bg-linear-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
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
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-500">
                      Loading harga...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">
                      Rp {pricing.price.toLocaleString('id-ID')}
                    </span>
                    <Badge className="bg-red-100 text-red-700 border-red-200">
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
                    <Check className="w-4 h-4 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <Button
          className="w-full h-12 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
          onClick={() => {
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
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Bukti Pendaftaran Try Out
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetail(null)}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
          >
            <IconX className="w-4 h-4" />
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
                    <p className="text-xs text-gray-600">{item.instruction}</p>

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

        {/* Submit Button */}
        <Card className="border-2 border-gray-100">
          <CardContent className="p-4">
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
                  <span>Daftar Try Out ({earnedPoints} poin)</span>
                </div>
              )}
            </Button>
            {earnedPoints !== totalPoints && (
              <p className="text-center text-xs text-gray-500 mt-2">
                Lengkapi semua tugas untuk melanjutkan
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
