'use client';

import { PaymentTryout } from '@/components/_shared/payment/payment-tryout';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Button } from '@/components/ui/button';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { Crown, Sparkles } from 'lucide-react';
import { useParams } from 'next/navigation';
import {
  cloneElement,
  isValidElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';

interface ButtonUpgradeTryoutProps {
  children?: ReactNode;
  tryoutId?: string;
  className?: string;
  variant?: 'default' | 'compact' | 'banner';
}

export default function ButtonUpgradeTryout({
  children,
  tryoutId: id,
  className,
  variant = 'default',
}: ButtonUpgradeTryoutProps) {
  const params = useParams();
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();
  const [show, setShow] = useState<boolean>(false);

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';
  const secondaryColor = websiteSubCategory?.secondary_color || '#5aa4dd';

  const tryoutId = id ? id : params?.id;

  const [tryout, setTryout] = useState<any>();

  useEffect(() => {
    getGeneral(
      `/tryout/getTryoutDataById?userId=${session?.user.id}&tryoutId=${
        (tryoutId as string) || ''
      }`,
      {
        setData: setTryout,
      },
    );
  }, [params, session]);

  const handleClick = () => {
    setShow(true);
  };

  // If children are provided, clone them with click handler
  if (children && isValidElement(children)) {
    return (
      <>
        <PaymentTryout
          show={show}
          setShow={setShow}
          tryoutData={tryout === undefined ? null : tryout}
        />
        {cloneElement(
          children as React.ReactElement<{ onClick?: React.MouseEventHandler }>,
          {
            onClick: handleClick,
          },
        )}
      </>
    );
  }

  // Banner variant for above table
  if (variant === 'banner') {
    return (
      <>
        <PaymentTryout
          show={show}
          setShow={setShow}
          tryoutData={tryout === undefined ? null : tryout}
        />
        <div
          className={cn(
            'relative overflow-hidden rounded-xl md:rounded-2xl p-4 md:p-6 text-white shadow-lg border border-transparent',
            className,
          )}
          style={{
            background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-6 md:-right-8 -top-6 md:-top-8 w-16 md:w-20 h-16 md:h-20 bg-white rounded-full blur-sm" />
            <div className="absolute -left-4 md:-left-6 -bottom-4 md:-bottom-6 w-12 md:w-16 h-12 md:h-16 bg-white rounded-full blur-sm" />
            <div className="absolute right-8 md:right-12 bottom-8 md:bottom-12 w-2 h-2 bg-white rounded-full" />
            <div className="absolute right-6 md:right-8 bottom-6 md:bottom-8 w-1 h-1 bg-white rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start md:items-center gap-3 md:gap-4 flex-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Crown className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base md:text-lg font-bold mb-1">
                  Buka Fitur Premium
                </h3>
                <p className="text-white/90 text-sm md:text-base leading-relaxed">
                  Dapatkan akses lengkap ke detail skor per mata pelajaran dan
                  analisis mendalam
                </p>
              </div>
            </div>
            <Button
              onClick={handleClick}
              className="w-full md:w-auto bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm md:text-base">Upgrade Sekarang</span>
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <>
        <PaymentTryout
          show={show}
          setShow={setShow}
          tryoutData={tryout === undefined ? null : tryout}
        />
        <Button
          onClick={handleClick}
          size="sm"
          className={cn(
            'text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 text-xs md:text-sm',
            className,
          )}
          style={{ backgroundColor: mainColor }}
        >
          <Crown className="w-3 h-3 mr-1" />
          Upgrade
        </Button>
      </>
    );
  }

  // Default variant
  return (
    <>
      <PaymentTryout
        show={show}
        setShow={setShow}
        tryoutData={tryout === undefined ? null : tryout}
      />
      <Button
        onClick={handleClick}
        className={cn(
          'text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 text-sm md:text-base',
          className,
        )}
        style={{
          background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
        }}
      >
        <Crown className="w-4 h-4 mr-2" />
        Buka Premium
      </Button>
    </>
  );
}
