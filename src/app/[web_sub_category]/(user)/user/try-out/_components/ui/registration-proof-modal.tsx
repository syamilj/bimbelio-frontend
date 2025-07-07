'use client';

import { PaymentTryout } from '@/components/_shared/payment/payment-tryout';
import { useUserLimitation } from '@/components/provider/provider-limitation';
import { useSession } from '@/components/provider/provider-session-auth';
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
import { Spinner } from '@/components/ui/spinner';
import { toaster } from '@/components/ui/toaster';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { IconTailedArrowUp45, IconX } from '@/styles/icon';
import type { Pricing } from '@/types/database';
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
import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';
import ButtonPayment from '../../../_components/button-payment';
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
    if (showPayment === false && step === 3) {
      setShowDetail(null);
      setStep(1);
    }
  }, [showPayment, setShowDetail, step]);

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
      <div>
        <p className="pt-[1rem] text-center text-[.9rem] text-main-gray-text">
          Apakah kamu akan mengikuti try out ini?
        </p>
        <div className="mt-[1rem] flex w-full items-center justify-center">
          <div
            className={cn(
              'flex h-[47px] w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-main text-center text-[.9rem] text-white hover:bg-main/80',
              isLoading && 'bg-main/80',
            )}
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
              <Spinner />
            ) : (
              <>
                Daftar try out
                <IconTailedArrowUp45 w={15} />
              </>
            )}
          </div>
        </div>
      </div>
    );
  } else if (step === 2) {
    return (
      <div className="flex w-full flex-col gap-[1rem]">
        <h1 className="text-center font-medium">Pilih Tipe Pendaftaran</h1>
        <div className="flex flex-col gap-[1rem]">
          <div
            className="cursor-pointer"
            onClick={() => {
              setShowDetail(null);
            }}
          >
            <ButtonPayment
              className="w-full flex justify-center items-center"
              text="Top up"
              type="modal"
            />
          </div>
          {!showDetail?.isDone && (
            <Card
              onClick={() => setSelectTypeRegistration('free')}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                selectTypeRegistration === 'free'
                  ? 'border-2 border-main'
                  : 'border-2 hover:border-main/70',
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Gratis
                  <span className="text-sm font-normal text-muted-foreground">
                    Rp 0
                  </span>
                </CardTitle>
                <CardDescription>
                  Daftar dengan mengikuti sosial media dan membagikan info Try
                  Out
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-sm">
                  <li>Akses ke semua materi Try Out</li>
                  <li>Hasil dan pembahasan setelah Try Out selesai</li>
                  <li>Peringkat nasional</li>
                </ul>
              </CardContent>
            </Card>
          )}
          <Card
            onClick={() => setSelectTypeRegistration('premium')}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selectTypeRegistration === 'premium'
                ? 'border-2 border-main'
                : 'border-2 hover:border-main/70',
            )}
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Premium
                {pricingIsLoading || !pricing ? (
                  <div className="">
                    <Loader2 className="animate-spin w-4 h-4" />
                  </div>
                ) : (
                  <span className="text-sm font-normal text-muted-foreground">
                    Rp{' '}
                    {pricing.price.toLocaleString('id-ID', {
                      style: 'decimal',
                    })}
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Daftar cepat dengan fitur tambahan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-1 text-sm">
                <li>Semua fitur Gratis</li>
                <li>Akses prioritas saat Try Out berlangsung</li>
                <li>Analisis detail performa dan rekomendasi belajar</li>
                <li>Konsultasi dengan tutor</li>
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="mt-[1rem] flex w-full items-center justify-center">
          <div
            className={cn(
              'flex h-[47px] w-full cursor-pointer items-center justify-center gap-[.5rem] rounded-[.8rem] bg-main text-center text-[.9rem] text-white hover:bg-main/80',
              isLoading && 'bg-main/80',
            )}
            onClick={() => {
              setStep(3);
              if (selectTypeRegistration === 'premium') setShowPayment(true);
            }}
          >
            Selanjutnya
          </div>
        </div>
      </div>
    );
  } else if (step === 3 && selectTypeRegistration === 'free') {
    return (
      <>
        <div
          className="absolute right-4 top-4"
          onClick={() => setShowDetail(null)}
        >
          <IconX className="cursor-pointer text-main-gray-text duration-200 md:hover:text-main-gray-text2" />
        </div>
        <div className="flex w-full flex-col gap-[1rem]">
          <h1 className="text-center font-medium">Bukti Pendaftaran Try Out</h1>
          <Progress
            value={progress}
            className="h-2 mb-3"
          />
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>
              {completedCount}/{proofItems.length} selesai
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {proofItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'border rounded-lg p-4 flex flex-col justify-between',
                  item.uploaded
                    ? 'border-green-300 bg-green-50'
                    : item.completed
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200',
                )}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="p-2 rounded-full bg-gray-100">
                      {item.icon}
                    </div>
                    <Badge className="text-xs">+{item.points} poin</Badge>
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.instruction}
                  </p>
                  {item.completed && !item.uploaded && (
                    <p className="text-blue-600 text-sm mb-2">
                      Siap upload bukti screenshot
                    </p>
                  )}
                  {item.uploaded && (
                    <p className="text-green-600 text-sm mb-2">
                      {item.fileName
                        ? `Bukti terupload: ${item.fileName}`
                        : 'Tugas selesai'}
                    </p>
                  )}
                </div>
                <Button
                  className="mt-2 w-full"
                  onClick={() => handleAction(item.id)}
                  disabled={item.loading || item.uploaded}
                >
                  {renderButton(item)}
                </Button>
              </div>
            ))}
          </div>
          <Button
            className="w-full py-2 bg-main hover:bg-main/80 text-white"
            onClick={handleSubmitProof}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2 inline" />
            ) : (
              <Trophy className="h-5 w-5 mr-2 inline" />
            )}
            {isLoading
              ? 'Memproses...'
              : `Daftar Try Out (${earnedPoints} poin)`}
          </Button>
        </div>
      </>
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
