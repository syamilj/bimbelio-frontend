'use client';

import CardTryOut, {
  CardTryoutProps,
} from '@/app/(main)/[web_sub_category]/(user)/user/try-out/_components/ui/card-tryout';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { WebsiteSubCategory } from '@/types/database';
import { Target } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const TryoutSection: React.FC = () => {
  const { websiteSubCategory } = useWebsiteSubCategory();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const href = searchParams?.get('href');

  const ref = useRef(null);

  const [cards, setCards] = useState<
    (CardTryoutProps & { WebsiteSubCategory: WebsiteSubCategory })[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    await getGeneral(
      `/tryout/getTryOutCardUpcoming2?userId=${session?.user.id}`,
      {
        setData: setCards,
        setLoading: setIsLoading,
      },
    );
  };

  useEffect(() => {
    getData();
  }, [session]);

  useEffect(() => {
    if (href && href?.length > 0) {
      router.push(href);
    }
  }, [href]);

  // Get dynamic colors
  const pathname = usePathname();
  const isMainLandingPage = pathname === '/';
  const mainColor = isMainLandingPage
    ? '#0091FF'
    : (websiteSubCategory?.main_color ?? '#0091FF');

  return (
    <section
      id="tryout"
      className={cn(
        'py-16 md:py-24 relative overflow-hidden',
        !isLoading && cards.length === 0 && 'hidden',
      )}
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-white" />
      </div>

      <div
        className="container mx-auto px-4 max-w-7xl"
        ref={ref}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white mb-4"
            style={{ backgroundColor: mainColor }}
          >
            <Target className="w-4 h-4" />
            Try Out Gratis
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latihan <span style={{ color: mainColor }}>Sebelum Hari H</span>
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto">
            Try Out IRT-based dengan format resmi UTBK. Gratis untuk semua
            member. Track progress dan raih peringkat nasional!
          </p>
        </div>

        {/* Cards Grid */}
        <div
          className={cn(
            'grid gap-5 mb-8',
            cards.length === 1 && !isLoading
              ? 'grid-cols-1 max-w-md mx-auto'
              : cards.length === 2 && !isLoading
                ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
          )}
        >
          {/* Loading State */}
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border-2 border-gray-100 animate-pulse overflow-hidden"
              >
                <div className="h-48 lg:h-56 bg-gray-100" />
                <div className="p-4 lg:p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-gray-100 rounded-2xl"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-100 rounded-2xl"
                      />
                    ))}
                  </div>
                  <div className="h-12 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))
          ) : (
            <CardTryOut
              data={cards}
              userTryOutId={session?.user.id || ''}
              refresh={getData}
              reloadHref={isMainLandingPage}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TryoutSection;
export { TryoutSection };
