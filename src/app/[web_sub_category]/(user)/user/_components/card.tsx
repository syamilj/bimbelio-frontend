'use client';

import { useSession } from '@/components/provider/provider-session-auth';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CardProps {
  data: any;
  href: string;
  noCategory?: boolean;
}

export default function Card({ data, href, noCategory }: CardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showUpgrade, setShowUpgrade] = useState<number>(99999);

  const handleClick = (id: string, category: string, premium: boolean) => {
    const LinkButton = document.getElementById(
      `hrefLink-${id}`,
    ) as HTMLButtonElement;
    LinkButton.click();
  };

  return (
    <>
      {data?.length > 0 &&
        data?.map((item: any, i: number) => (
          <div
            className="relative group"
            key={i}
            onMouseOver={() => setShowUpgrade(i)}
            onMouseLeave={() => setShowUpgrade(9999)}
          >
            <Link
              id={`hrefLink-${item.id}`}
              href={`/${website_sub_category_id}/user/workspace/${item.categoryId}/${item.id}?tab=chat`}
              className="hidden"
            />

            <div
              id="card"
              className="relative flex cursor-pointer flex-col items-center justify-start overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5 mb-4"
              onClick={() =>
                handleClick(item.id, item.categoryId, item.premium)
              }
            >
              {/* Image Container */}
              <div className="relative h-90% h-full w-full overflow-hidden rounded-t-lg bg-white shadow-sm">
                <Image
                  src={`${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/document/${item.img}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={500}
                  height={300}
                  alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
                />
              </div>

              {/* Content Container */}
              <div
                id="text-container"
                className="flex w-full h-full flex-col justify-between border-t border-gray-100 bg-white px-4 py-3"
              >
                {/* Title */}
                <p
                  id="title"
                  className="text-sm font-semibold text-gray-900 leading-tight truncate whitespace-nowrap overflow-hidden text-ellipsis mb-2 group-hover:text-blue-600 transition-colors duration-200"
                >
                  {item.title}
                </p>

                {/* Categories */}
                <div className="flex gap-2 mb-2 flex-wrap">
                  <p
                    className={`
    text-sm font-semibold leading-tight truncate whitespace-nowrap overflow-hidden text-ellipsis
 transition-colors duration-200
    px-3 py-1.5 rounded-lg shadow-sm
    text-white
    ${
      item.category?.name === 'Bahasa Inggris'
        ? 'bg-blue-500'
        : item.category?.name === 'Bahasa Indonesia'
          ? 'bg-red-500'
          : item.category?.name === 'Matematika Dasar'
            ? 'bg-green-600'
            : 'bg-gray-400' // default warna kalau bukan ketiganya
    }
  `}
                    title={item.category?.name}
                  >
                    {item.category?.name}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <p className="text-sm font-semibold leading-tight truncate whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-blue-600 transition-colors duration-200 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200">
                    {item.subCategory?.name}
                  </p>
                </div>
              </div>

              {/* Top Badges */}
              <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-10">
                {item.new && (
                  <div className="rounded-lg bg-orange-400 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                    Baru!
                  </div>
                )}
                {item.videoId && (
                  <div className="rounded-lg bg-blue-500 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
                    Video
                  </div>
                )}
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>
        ))}
    </>
  );
}
