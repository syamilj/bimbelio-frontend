'use client';

import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Card from '../../../_components/card';
import CardNotFound from '../../../_components/card-not-found';

export default function DocumentByCategory({
  subCategoryId,
  docsData,
  setDocsData,
  sort,
}: any) {
  const params = useParams();

  const categoryId = params?.category as string | undefined;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [documentByCategory, setDocumentByCategory] = useState<any>();
  const [
    documentByCategoryAndSubcategory,
    setDocumentByCategoryAndSubcategory,
  ] = useState<any>();

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

  useEffect(() => {
    // refetch();
    if (!categoryId) return;
    getGeneral('/document/getDocumentByCategoryAndSubId', {
      setData: setDocsData,
      setLoading: setIsLoading,
      params: {
        categoryId,
        subCategoryId: subCategoryId.length > 0 ? subCategoryId : undefined,
      },
    });
  }, [subCategoryId, categoryId]);

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
                  <CardNotFound title="Document Not Found" />
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
