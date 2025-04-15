'use client';

import { useState } from 'react';

import {
  IconCheckList,
  IconCrown,
  // IconUser,
  IconX,
} from '@/styles/icon';

import { toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';

import { useAppContext } from '@/components/provider/provider-app';
import { Button } from '@/components/ui/button';
import { FeatureLimitation } from '@/config/limitation';
import { api } from '@/trpc/react';
import { PaymentPremium } from '@/trpc/router/payment';
import { useSession } from 'next-auth/react';

export const Payment = () => {
  const { setTransactionPopUp, setTransactionHistory, setPagesSetting } =
    useAppContext();
  const { data: session } = useSession();

  const [step, setStep] = useState<number>(1);
  const [telp, setTelp] = useState<string>('');
  const [type, setType] = useState<PaymentPremium | ''>('');
  const [buyingType, setBuyingType] = useState<'limitation' | 'premium' | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const { data: pricing, isLoading: pricingIsLoading } =
    api.pricing.getAllPricing.useQuery(undefined, {
      refetchOnWindowFocus: false,
    });

  const List = [
    {
      icon: <IconCheckList className="text-main-yellow" />,
      text: 'Akses lengkap seluruh bahan ajar',
    },
    {
      icon: <IconCheckList className="text-main-yellow" />,
      text: '2.000 pertanyaan fitur Chat AI',
    },
    {
      icon: <IconCheckList className="text-main-yellow" />,
      text: '2.000 limit kata fitur Notes',
    },
    {
      icon: <IconCheckList className="text-main-yellow" />,
      text: '500 kali generate Quiz',
    },
    {
      icon: <IconCheckList className="text-main-yellow" />,
      text: '500 aksi fitur Vision',
    },
    {
      icon: <IconCheckList className="text-main-yellow" />,
      text: 'Unlock All Course',
    },
  ];

  const addPayment = api.payment.addPayment.useMutation();

  const handlePayment = async () => {
    setLoading(true);
    console.log({ type });
    if (type === '') return;
    try {
      const data = await addPayment.mutateAsync({ telp, type });
      window.snap.pay(`${data?.token}`, {
        onClose: () => {
          setTransactionPopUp(false);
          setPagesSetting('rt');
          setTransactionHistory(true);
        },
      });
      setLoading(false);
    } catch (error) {
      toaster({
        title: 'Gagal',
        condition: 'warning',
        description: 'Coba lagi nanti!',
      });
      setLoading(false);
    }
  };

  const getPricing = (slug: string) => {
    if (!pricing) return '-';
    return `Rp. ${pricing
      .find((item) => item.slug === slug)
      ?.price.toLocaleString('id-ID', { style: 'decimal' })}`;
  };

  return (
    <div className="fixed left-0 top-0 z-[1001] flex h-full w-full items-center justify-center bg-[#0000007a]">
      <div className="mx-[1rem] w-[400px] overflow-hidden rounded-[1.5rem] bg-white md:mx-[1rem]">
        {/* Header */}
        <div className="flex items-center justify-between bg-main p-[1.5rem]">
          <div className="flex items-center gap-[.5rem] text-white">
            <p>
              {buyingType === 'premium' && 'Upgrade Premium'}
              {buyingType === 'limitation' && 'Upgrade Limitasi'}
            </p>
            <IconCrown className="text-main-yellow" />
          </div>
          <div
            onClick={() => {
              setTransactionPopUp(false);
            }}
          >
            <IconX className="cursor-pointer text-white duration-300 hover:text-main-gray-input" />
          </div>
        </div>

        {/* Content */}
        {pricingIsLoading || !pricing ? (
          <div className="flex justify-center items-center w-full py-8">
            <Loader2 className="animate-spin w-4 h-4" />
          </div>
        ) : (
          <>
            {step === 1 ? (
              <div className="flex items-center w-full gap-[1rem] p-[1.5rem]">
                {session?.user.role === 'USER' && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setStep(2);
                      setBuyingType('premium');
                    }}
                  >
                    Upgrade Premium
                  </Button>
                )}
                <Button
                  className="flex-1"
                  onClick={() => {
                    setStep(2);
                    setBuyingType('limitation');
                  }}
                >
                  Upgrade Limitasi
                </Button>
              </div>
            ) : step === 2 ? (
              <div className="flex flex-col gap-[2rem] p-[1.5rem]">
                <p>
                  {buyingType === 'premium' &&
                    'Akses lengkap seluruh bahan ajar premium, layanan terbaik, dan limitasi fitur AI yang jauh lebih banyak, sesuai kebutuhanmu.'}
                  {buyingType === 'limitation' && 'Upgrade limitation'}
                </p>
                {buyingType === 'premium' && (
                  <div className="flex flex-col gap-[.8rem]">
                    {List.map((item: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center gap-[.5rem]"
                      >
                        {item.icon}
                        <p>{item.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                {buyingType === 'premium' && (
                  <div className="flex flex-col gap-4">
                    <Button
                      className="rounded-[1rem] bg-main py-[1rem] text-white duration-300 hover:bg-main-hover active:bg-main"
                      onClick={() => {
                        setType('1-month');
                        setStep(3);
                      }}
                    >
                      Upgrade {getPricing('1-month')} / bulan
                    </Button>
                    <Button
                      className="rounded-[1rem] bg-main py-[1rem] text-white duration-300 hover:bg-main-hover active:bg-main"
                      onClick={() => {
                        setType('3-month');
                        setStep(3);
                      }}
                    >
                      Upgrade {getPricing('3-month')} / 3 bulan
                    </Button>
                  </div>
                )}{' '}
                {buyingType === 'limitation' && (
                  <div className="flex flex-col gap-4">
                    <Button
                      className="rounded-[1rem] bg-main py-[1rem] text-white duration-300 hover:bg-main-hover active:bg-main"
                      onClick={() => {
                        setType('limitasi_chat');
                        setStep(3);
                      }}
                    >
                      Upgrade {getPricing('limitasi_chat')} / +
                      {FeatureLimitation.premium.chat} Chat
                    </Button>
                    <Button
                      className="rounded-[1rem] bg-main py-[1rem] text-white duration-300 hover:bg-main-hover active:bg-main"
                      onClick={() => {
                        setType('limitasi_notes');
                        setStep(3);
                      }}
                    >
                      Upgrade {getPricing('limitasi_notes')} / +
                      {FeatureLimitation.premium.notes} Notes
                    </Button>
                    <Button
                      className="rounded-[1rem] bg-main py-[1rem] text-white duration-300 hover:bg-main-hover active:bg-main"
                      onClick={() => {
                        setType('limitasi_quiz');
                        setStep(3);
                      }}
                    >
                      Upgrade {getPricing('limitasi_quiz')} / +
                      {FeatureLimitation.premium.quiz} Quiz
                    </Button>
                    <Button
                      className="rounded-[1rem] bg-main py-[1rem] text-white duration-300 hover:bg-main-hover active:bg-main"
                      onClick={() => {
                        setType('limitasi_vision');
                        setStep(3);
                      }}
                    >
                      Upgrade {getPricing('limitasi_vision')} / +
                      {FeatureLimitation.premium.vision} Vision
                    </Button>
                    <Button
                      className="rounded-[2rem] bg-main py-[.5rem] text-white duration-300 hover:bg-main-hover active:bg-main h-[unset]"
                      onClick={() => {
                        setType('limitasi_all');
                        setStep(3);
                      }}
                    >
                      Upgrade {getPricing('limitasi_all')} <br /> +
                      {FeatureLimitation.premium.chat} Chat | +
                      {FeatureLimitation.premium.vision} Vision | +
                      {FeatureLimitation.premium.notes} Notes | +
                      {FeatureLimitation.premium.quiz} Quiz
                    </Button>
                  </div>
                )}
              </div>
            ) : step === 3 ? (
              <div className="flex flex-col gap-[2rem] p-[1.5rem]">
                <p className="text-[1.1rem] font-medium">
                  Konfirmasi Upgrade Akun
                </p>
                <div className="flex flex-col gap-[.8rem]">
                  <p className="font-regular">
                    Harap isi nomor teleponmu agar dapat lanjut ke laman
                    pembayaran.
                  </p>
                  <p className="text-[.8rem] text-main-gray-text">
                    *Nomor teleponmu dibutuhkan agar kami dapat menghubungi kamu
                    jika terdapat kendala tak terduga.
                  </p>
                  <input
                    type="number"
                    placeholder="Nomor Telepon"
                    required
                    className="rounded-[1rem] border-[1.5px] border-main-gray-input p-[1rem] outline-none"
                    onChange={(e) => setTelp(e.target.value)}
                    value={telp}
                  />
                  <Button
                    className={`${
                      telp.length === 0
                        ? 'cursor-default bg-main-gray-disabled'
                        : 'bg-main hover:bg-main-hover active:bg-main'
                    } flex h-[56px] w-full items-center justify-center rounded-[1rem] text-center text-white duration-300`}
                    onClick={() => {
                      if (telp.length > 0) {
                        handlePayment();
                      }
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Upgrade Akun'
                    )}
                  </Button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
};
