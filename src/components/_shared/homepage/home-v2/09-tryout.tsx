'use client';

import CardTryOut, {
  CardTryoutProps,
} from '@/app/(main)/[web_sub_category]/(user)/user/bimarena/try-out/_components/ui/card-tryout';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { WebsiteSubCategory } from '@/types/database';
import { ArrowRight, Target } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { autoScroll } from '../autoscroll';

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
      `/tryout/getTryOutCardUpcoming2?userId=${session?.user.id}&take=5`,
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
  const mainColor = websiteSubCategory?.main_color ?? '#0091FF';

  console.log('Tryout Section Rendered');

  autoScroll('tryout');

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
            'flex overflow-x-auto touch-pan-x gap-5 mb-8 px-4 -mx-4 md:px-0 md:mx-0 snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0',
            cards.length === 1 && !isLoading
              ? 'justify-center md:max-w-md md:mx-auto'
              : cards.length === 2 && !isLoading
                ? 'justify-center md:max-w-2xl md:mx-auto'
                : '',
          )}
        >
          {/* Loading State */}
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border-2 border-gray-100 animate-pulse overflow-hidden min-w-[85%] sm:min-w-[350px] md:min-w-0 snap-center"
              >
                <div className="h-48 lg:h-56 bg-gray-100" />
                <div className="p-4 lg:p-6 space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-20 bg-gray-100 rounded-3xl"
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-100 rounded-3xl"
                      />
                    ))}
                  </div>
                  <div className="h-12 bg-gray-100 rounded-3xl" />
                </div>
              </div>
            ))
          ) : (
            <CardTryOut
              data={cards}
              userTryOutId={session?.user.id || ''}
              refresh={getData}
              reloadHref={true}
            />
          )}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link
            href={`/${websiteSubCategory?.id || 'utbk'}/user/bimarena/try-out`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-white transition-transform active:scale-95 shadow-md hover:shadow-lg"
            style={{ backgroundColor: mainColor }}
          >
            Lihat Semua Try Out
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TryoutSection;
export { TryoutSection };
