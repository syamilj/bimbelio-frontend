'use client';

import { useGet } from '@/lib/fetch-helper/useGet';
import { FileSearch, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { EmptyState } from '@/components/ds';
import Card from '../../../_components/card';

export default function DocumentByCategory({
  subCategoryId,
  docsData,
  setDocsData,
  sort,
}: any) {
  const params = useParams();

  const categoryId = params?.category as string | undefined;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // const { data: documentByCategory, isLoading } =
  //   api.document.getDocumentByCategoryId.useQuery(`${params?.category}`, {
  //     refetchOnWindowFocus: false,
  //     refetchOnMount: false,
  //   });

  // const { data: documentByCategoryAndSubcategory, refetch }: any =
  //   api.document.getDocumentByCategoryAndSubId.useQuery(
  //     {
  //       categoryId: `${params?.category}`,
  //       subCategoryId: subCategoryId,
  //     },
  //     { refetchOnWindowFocus: false },
  //   );

  useGet('/document/getDocumentByCategoryAndSubId', {
    enabled: !!categoryId,
    params: {
      categoryId,
      subCategoryId: subCategoryId.length > 0 ? subCategoryId : undefined,
    },
    useEffectDependencies: [subCategoryId, categoryId],
    onSuccess({ data }) {
      setDocsData(data ?? []);
    },
    onFinished() {
      setIsLoading(false);
    },
  });

  // useEffect(() => {
  //   if (!categoryId) return;
  //   getGeneral('/document/getDocumentByCategoryId', {
  //     setData: setDocumentByCategory,
  //     params: {
  //       categoryId,
  //     },
  //   });
  // }, [categoryId]);

  // useEffect(() => {
  //   if (!sort) {
  //     if (subCategoryId) {
  //       setDocsData(documentByCategoryAndSubcategory);
  //       // setLoading(false);
  //     } else {
  //       setDocsData(documentByCategory);
  //       // setLoading(false);
  //     }
  //   }
  // }, [documentByCategory, documentByCategoryAndSubcategory, sort]);

  return (
    <>
      {docsData?.length !== 0 ? (
        <div className="grid grid-cols-2 gap-4 font-semibold md2:grid-cols-4">
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
                <EmptyState
                  icon={FileSearch}
                  color="blue"
                  title="Document Not Found"
                  description="Belum ada dokumen di kategori ini"
                />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
