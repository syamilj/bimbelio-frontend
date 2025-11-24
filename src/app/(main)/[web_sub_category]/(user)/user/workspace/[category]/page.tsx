'use client';

import { Fragment, useState } from 'react';
import SearchDeskstop from '../../_components/search-dekstop';
import DocumentByCategory from './_components/document-by-category';
import HeadingBahanAjar from './_components/heading';

export default function BahanAjarByCategory() {
  const [subCategoryId, setSubCategoryId] = useState<string>('');
  const [docsData, setDocsData] = useState<any[]>([]);
  const [sort, setSort] = useState<boolean>(false);

  return (
    <Fragment>
      <div className="mb-8 hidden w-full justify-center md:flex">
        <SearchDeskstop />
      </div>
      <div className="flex flex-col gap-4 px-4 md:px-0">
        <HeadingBahanAjar
          subCategoryId={subCategoryId}
          setSubCategoryId={setSubCategoryId}
          setDocsData={setDocsData}
          sort={sort}
          setSort={setSort}
        />
        <DocumentByCategory
          subCategoryId={subCategoryId}
          docsData={docsData}
          setDocsData={setDocsData}
          sort={sort}
        />
      </div>
    </Fragment>
  );
}
