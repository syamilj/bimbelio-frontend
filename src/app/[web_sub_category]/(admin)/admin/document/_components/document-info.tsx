import { getGeneral } from '@/lib/fetch-helper';
import { useEffect, useState } from 'react';

export default function DocumentInfo() {
  const [data, setData] = useState<any[]>([]);

  const fetchDocumentInfo = async () => {
    await getGeneral('/document/getDocumentInfo', {
      setData: setData,
    });
  };

  useEffect(() => {
    fetchDocumentInfo();
  }, []);

  return (
    <>
      {data?.map((item: any, i: number) => (
        <div
          key={i}
          className="w-full rounded-[2rem] bg-white p-[2rem]"
        >
          <p className="font-regular text-[2rem]">{item.Document.length}</p>
          <p className="text-main-gray-text">{item.name}</p>
        </div>
      ))}
    </>
  );
}
