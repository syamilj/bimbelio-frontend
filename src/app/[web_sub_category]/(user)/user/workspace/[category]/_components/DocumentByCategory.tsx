'use client';

import Card from '@/app/(user)/user/_components/card';
import CardNotFound from '@/app/(user)/user/_components/card-not-found';
import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function DocumentByCategory({
  subCategoryId,
  docsData,
  setDocsData,
  sort,
}: any) {
  const params = useParams();

  // const [loading, setLoading] = useState<boolean>(true);

  const { data: documentByCategory, isLoading } =
    api.document.getDocumentByCategoryId.useQuery(`${params?.category}`, {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    });

  const { data: documentByCategoryAndSubcategory, refetch }: any =
    api.document.getDocumentByCategoryAndSubId.useQuery(
      {
        categoryId: `${params?.category}`,
        subCategoryId: subCategoryId,
      },
      { refetchOnWindowFocus: false },
    );

  useEffect(() => {
    // setLoading(true);
    refetch();
  }, [subCategoryId]);

  useEffect(() => {
    if (!sort) {
      if (subCategoryId) {
        setDocsData(documentByCategoryAndSubcategory);
        // setLoading(false);
      } else {
        setDocsData(documentByCategory);
        // setLoading(false);
      }
    }
  }, [documentByCategory, documentByCategoryAndSubcategory, sort]);

  return (
    <>
      {docsData?.length !== 0 ? (
        <div className="grid grid-cols-2 gap-[1rem] font-semibold md2:grid-cols-4">
          <Card
            data={docsData}
            href={`/user/workspace/${params?.category}`}
          />
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center h-full w-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          ) : (
            <>
              {docsData?.length === 0 && (
                <div className="grid grid-cols-2 gap-[1rem] md2:grid-cols-4">
                  <CardNotFound />
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
