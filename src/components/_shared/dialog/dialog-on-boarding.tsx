'use client';

import ImgChangeCategory from '@/_assets/onboarding/first-buy/1-ganti-website-category.png';
import ImgSubscription from '@/_assets/onboarding/first-buy/2-kelola-subscription.png';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AlertCircle, ArrowRight, Check, Crown, Gift, Zap } from 'lucide-react';
import { useState } from 'react';

interface DialogOnBoardingProps {
  useOpen?: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
  };
  inviteLink: string | null;
  children?: React.ReactNode;
  /** Dipanggil saat siswa menekan tombol selesai di langkah terakhir. */
  onFinish?: () => void;
}

export const DialogOnBoarding = ({
  useOpen,
  children,
  inviteLink,
  onFinish,
}: DialogOnBoardingProps) => {
  const isOpen = useOpen?.isOpen;
  const onOpenChange = useOpen?.onOpenChange;

  const [open, setOpen] = useState(false);

  const [step, setStep] = useState(0);
  const { websiteSubCategory, webCategoryData } = useWebsiteSubCategory();

  const mainColor = websiteSubCategory?.main_color || '#0066FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#4C94FF';

  // Get categories from webCategoryData[0].WebsiteSubCategory
  const categories = (webCategoryData?.[0]?.WebsiteSubCategory || []).map(
    (subCategory) => ({
      id: subCategory.id,
      name: subCategory.name,
      description: subCategory.name,
      mainColor: subCategory.main_color,
      secondaryColor: subCategory.secondary_color,
    }),
  );

  const steps = [
    {
      title: 'Selamat Datang di Bimbelio',
      description:
        'Mari kita pelajari fitur-fitur penting untuk memaksimalkan pengalaman belajarmu',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Bimbelio menyediakan platform belajar lengkap untuk mempersiapkan
            dirimu menghadapi ujian masuk perguruan tinggi.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-start justify-between rounded-3xl p-4 transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: cat.mainColor + '15',
                  borderLeft: `4px solid ${cat.mainColor}`,
                }}
              >
                <div className="flex-1 text-left">
                  <p
                    className="text-sm font-bold"
                    style={{ color: cat.mainColor }}
                  >
                    {cat.name}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Kategori pembelajaran terbaik
                  </p>
                </div>
                <div
                  className="ml-3 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2"
                  style={{ borderColor: cat.mainColor }}
                >
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.mainColor }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="pt-2 text-xs text-gray-500">
            <Zap
              className="mr-1 inline h-4 w-4"
              style={{ color: mainColor }}
            />
            Kami memiliki 4 kategori ujian yang berbeda untuk memenuhi kebutuhan
            belajarmu
          </p>
        </div>
      ),
    },
    {
      title: 'Sistem Subscription',
      description: 'Pahami paket subscription yang tersedia',
      content: (
        <div className="space-y-4">
          <div
            className="rounded-3xl bg-gradient-to-r p-4 text-white"
            style={{
              backgroundImage: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
            }}
          >
            <p className="mb-2 flex items-center gap-2 font-semibold">
              <Gift className="h-4 w-4" />
              Paket Tersedia:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Crown className="mt-1 h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>Gratis:</strong> Akses terbatas ke fitur dasar dengan
                  batasan penggunaan
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Zap className="mt-1 h-4 w-4 flex-shrink-0" />
                <span>
                  <strong>Premium:</strong> Akses penuh ke semua fitur
                  berdasarkan produk yang kamu beli
                </span>
              </li>
            </ul>
          </div>
          <div
            className="flex items-start gap-2 rounded border-l-4 bg-blue-50 p-3"
            style={{ borderColor: mainColor }}
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              style={{ color: mainColor }}
            />
            <p className="text-sm text-gray-700">
              <strong>Tip:</strong> Dengan subscription premium, kamu akan
              mendapatkan akses penuh ke semua fitur termasuk chat AI unlimited,
              notes unlimited, quiz advanced, tryout lengkap, dan banyak lagi!
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Menukar Website Category',
      description: 'Cara mengubah kategori ujian yang ingin kamu pelajari',
      content: (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Gambar */}
          <div className="flex w-full justify-center overflow-hidden rounded-3xl border border-amber-200 bg-gray-100 p-1">
            <img
              src={ImgChangeCategory.src}
              alt="Cara Menukar Website Category"
              className="h-full w-auto"
            />
          </div>
          <div className="space-y-4">
            <div className="space-y-3 rounded-3xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 font-bold text-amber-900">
                  1
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Buka Sidebar Navigation
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Klik menu di sisi kiri atau gunakan hamburger menu di mobile
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 font-bold text-amber-900">
                  2
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Pilih Category
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Cari dan klik salah satu dari 4 kategori yang tersedia
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 font-bold text-amber-900">
                  3
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Sistem Otomatis
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    Dashboard dan konten akan secara otomatis berubah sesuai
                    kategori pilihan
                  </p>
                </div>
              </div>
            </div>

            <div
              className="flex items-start gap-2 rounded border-l-4 bg-blue-50 p-3"
              style={{ borderColor: mainColor }}
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 flex-shrink-0"
                style={{ color: mainColor }}
              />
              <p className="text-xs text-gray-700">
                Kamu bisa mengganti kategori kapan saja tanpa kehilangan data
                progress belajarmu
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Kelola Subscription Aktif',
      description: 'Cek dan kelola subscription kamu',
      content: (
        <div className="space-y-4">
          {/* Gambar */}
          <div className="flex w-full justify-center overflow-hidden rounded-3xl border border-green-200 bg-gray-100">
            <img
              src={ImgSubscription.src}
              alt="Cara Kelola Subscription Aktif"
              className="max-h-[300px] w-auto"
            />
          </div>

          <div className="space-y-3 rounded-3xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-200 font-bold text-green-900">
                1
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Lihat Status Subscription
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Di header kanan atas, ada button dengan badge yang menunjukkan
                  tier kamu saat ini (Gratis/Premium)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-200 font-bold text-green-900">
                2
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Hover Button Subscription
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Arahkan mouse ke button subscription di header, akan muncul
                  button &quot;Kelola Subscription&quot; dengan opsi lainnya
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-200 font-bold text-green-900">
                3
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Kelola Subscription
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Klik &quot;Kelola Subscription&quot; untuk melihat detail
                  subscription aktif, yang pending, dan upgrade/beli
                  subscription baru
                </p>
              </div>
            </div>
          </div>

          <div
            className="flex items-start gap-2 rounded border-l-4 bg-blue-50 p-3"
            style={{ borderColor: mainColor }}
          >
            <AlertCircle
              className="mt-0.5 h-4 w-4 flex-shrink-0"
              style={{ color: mainColor }}
            />
            <p className="text-sm text-gray-700">
              <strong>Fitur:</strong> Kamu bisa melihat subscription yang sedang
              aktif, expire date, subscription pending, dan membeli subscription
              baru kapan saja
            </p>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];
  const isLastStep = step === steps.length - 1;
  const isFirstStep = step === 0;

  return (
    <Dialog
      open={isOpen ? isOpen : open}
      onOpenChange={onOpenChange ? onOpenChange : setOpen}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="md:max-w-lg">
        {/* Header dengan progress indicator */}
        <div className="absolute top-0 right-0 left-0 h-1 overflow-hidden rounded-t-lg bg-gray-200">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((step + 1) / steps.length) * 100}%`,
              backgroundImage: `linear-gradient(90deg, ${secondaryColor}, ${mainColor})`,
            }}
          />
        </div>

        <DialogHeader className="pt-4">
          <DialogTitle className="text-xl font-bold">
            {currentStep.title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Step {step + 1} dari {steps.length}
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <div className="overflow-y-auto py-4">{currentStep.content}</div>

        {/* Footer dengan buttons */}
        <div className="flex items-center justify-between gap-3 border-t pt-4">
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {steps.map((_, index) => (
              <div
                key={index}
                className="h-2 w-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor:
                    index === step
                      ? mainColor
                      : index < step
                        ? mainColor
                        : '#e5e7eb',
                }}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            {!isFirstStep && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="gap-2"
              >
                Sebelumnya
              </Button>
            )}

            {!isLastStep ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="gap-2 text-white"
                style={{ backgroundColor: mainColor }}
              >
                Selanjutnya
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  if (onOpenChange) {
                    onOpenChange(false);
                  }
                  setOpen(false);
                  if (inviteLink) onFinish?.();
                }}
                className="gap-2 text-white"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${secondaryColor}, ${mainColor})`,
                }}
              >
                <Check className="h-4 w-4" />
                Selesai
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
