import CardNotFound from '@/app/[web_sub_category]/(user)/user/_components/card-not-found';
import { useSession } from '@/components/provider/provider-session-auth';
import { useWebsiteSubCategory } from '@/components/provider/provider-website-category';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden">
      <CardHeader
        className="pb-4 border-b border-gray-100"
        style={{ backgroundColor: `${mainColor}05` }}
      >
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${mainColor}15` }}
          >
            <Globe
              className="w-4 h-4"
              style={{ color: mainColor }}
            />
          </div>
          <span style={{ color: mainColor }}>Try Out Lainnya</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {!isLoading && cards && cards.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i: number) => (
              <Skeleton
                key={i}
                className="h-80 w-full rounded-xl"
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
