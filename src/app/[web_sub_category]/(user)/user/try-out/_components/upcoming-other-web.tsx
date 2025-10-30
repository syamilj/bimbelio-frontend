import CardNotFound from '@/app/[web_sub_category]/(user)/user/_components/card-not-found';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Skeleton } from '@/components/ui/skeleton';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import CardTryOut, { CardTryoutProps } from './ui/card-tryout';

export default function UpcomingOtherWeb({ id }: { id: string }) {
  const { data: session } = useSession();
  const { websiteSubCategory } = useWebsiteSubCategory();

  // Get dynamic colors from the selected category
  const mainColor = websiteSubCategory?.main_color || '#0091FF';

  const [cards, setCards] = useState<CardTryoutProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getData = async () => {
    if (!session) return;
    const res = await getGeneral(
      `/tryout/getTryOutCardUpcomingAnotherWeb?userId=${session?.user.id}`,
      {
        setData: setCards,
        setLoading: setIsLoading,
      },
    );
  };

  useEffect(() => {
    getData();
  }, [session]);

  if (!cards && !isLoading) {
    return <div>Error</div>;
  }

  return (
    <section className="mb-12">
      {/* Section Header - Match Dashboard Style */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: mainColor }}
        >
          <Globe className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Try Out Lainnya</h2>
      </div>

      {/* Cards Grid */}
      {!isLoading && cards && cards.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CardTryOut
            data={cards}
            userTryOutId={id}
            isPrivate
            refresh={getData}
          />
        </div>
      )}

      {!isLoading && cards?.length === 0 && (
        <div className="flex justify-center">
          <CardNotFound title="Belum tersedia" />
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i: number) => (
            <Skeleton
              key={i}
              className="h-80 w-full rounded-3xl"
            />
          ))}
        </div>
      )}
    </section>
  );
}
