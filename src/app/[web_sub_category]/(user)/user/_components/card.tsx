'use client';

import ButtonPayment from '@/app/[web_sub_category]/(user)/user/_components/button-payment';
import { useSession } from '@/components/provider/session-provider-auth';
import { env } from '@/env.mjs';
import { website_sub_category_id } from '@/hooks/use-web-sub-category-id';
import { IconLock } from '@/styles/icon';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface card {
  data: any;
  href: string;
  noCategory?: boolean;
}

export default function Card({ data, href, noCategory }: card) {
  const router = useRouter();

  const { data: session } = useSession();

  // const [docData, setDocData] = useState<any>([]);

  // console.log('data', data)

  const [showUpgrade, setShowUpgrade] = useState<number>(99999);

  // const getDate = (date: any) => {
  //   const Dates = new Date(date);
  //   const year = Dates.getFullYear();
  //   return year;
  // };

  const handleClick = (id: string, category: string, premium: boolean) => {
    const LinkButton = document.getElementById('hrefLink') as HTMLButtonElement;
    if (premium) {
      if (session?.user.role !== 'USER') {
        if (noCategory) {
          LinkButton.click();
        } else {
          router.push(`${href}/${id}?tab=chat`);
        }
      }
    } else {
      if (noCategory) {
        LinkButton.click();
      } else {
        router.push(`${href}/${id}?tab=chat`);
      }
    }
  };

  return (
    <>
      {data?.length > 0 &&
        data?.map((item: any, i: number) => (
          <div
            className="relative"
            key={i}
            onMouseOver={() => {
              setShowUpgrade(i);
            }}
            onMouseLeave={() => {
              setShowUpgrade(9999);
            }}
          >
            {item.premium && !session?.user.tier && (
              <>
                <div className="absolute left-0 top-0 z-[2] flex h-full w-full items-center justify-center rounded-xl bg-[#ffffff73]">
                  <IconLock
                    w={60}
                    className="text-[#6e717b9d]"
                  />
                </div>
                {showUpgrade === i && (
                  <div className="absolute bottom-[50%] left-[50%] z-[10] flex w-[250px] flex-col gap-[1rem] rounded-xl bg-[#1A1E25] p-[1rem] text-main-gray-text2">
                    <h1 className="font-regular text-white">Limit material</h1>
                    <p className="mt-[-.5rem] text-[.9rem]">
                      Limit kamu terbatas.{' '}
                      <span className="font-regular text-main">
                        Upgrade akun
                      </span>{' '}
                      untuk mendapatkan akses material lengkap.
                    </p>
                    <ButtonPayment text="Subscription" />
                    <div className="absolute bottom-[-8px] left-[2rem] h-[20px] w-[20px] rotate-45 bg-[#1A1E25]" />
                  </div>
                )}
              </>
            )}
            <Link
              id="hrefLink"
              href={`/${website_sub_category_id}/user/workspace/${item.categoryId}/${item.id}?tab=chat`}
              className="hidden"
            />
            <div
              id="card"
              className={
                'relative flex h-[160px] cursor-pointer flex-col items-center justify-start overflow-hidden rounded-xl shadow-sm bg-white duration-300 hover:shadow-inner mb:h-[200px] md:h-[200px] md:hover:scale-105 md:active:scale-100 md2:h-[180px] xl:h-[250px] xxxl:h-[300px]'
              }
              onClick={() =>
                handleClick(item.id, item.categoryId, item.premium)
              }
            >
              <div className="h-auto w-full bg-[#E8EBF4] p-[1.5rem]">
                <Image
                  src={`${env.NEXT_PUBLIC_SUPABASE_IMG_URL}/document/${item.img}`}
                  className="h-auto w-full rounded-xl"
                  layout="responsive"
                  width={500}
                  height={300}
                  alt="Bimbelio - Bimbel AI untuk PTN dan Kedinasan"
                />
              </div>
              <div
                id="text-container"
                className="absolute bottom-0 left-0 z-[1] flex w-full shrink-0 flex-col gap-[.5rem] border-t border-main-border bg-white px-[1rem] pb-[1rem] pt-[.5rem] backdrop-blur-[5px]"
              >
                <p
                  id="title"
                  className="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-black"
                >
                  {`${
                    item.title?.length > 50
                      ? `${item.title.slice(0, 50)}...`
                      : item.title
                  }`}{' '}
                </p>
                <div className="flex items-center gap-[.5rem] flex-wrap">
                  <div className="flex shrink-0 items-center justify-center rounded-xl bg-main px-[.6rem] py-[.2rem] text-[.6rem] text-white md:px-[1rem] md:py-[.35rem] md:text-[.8rem]">
                    <p>{item.category?.name}</p>
                  </div>
                  <div className="flex shrink-0 items-center justify-center rounded-xl border border-main-gray-input bg-bg-layout px-[.6rem] py-[.2rem] text-[.6rem] md:px-[1rem] md:py-[.35rem] md:text-[.8rem]">
                    <p>{item.subCategory?.name}</p>
                  </div>
                </div>
              </div>
              <div className="absolute right-[1rem] top-[.5rem] flex items-center gap-[.5rem]">
                {item.new && (
                  <div className="rounded-xl bg-main-yellow px-[.8rem] text-[.9rem] font-medium text-black">
                    Baru!
                  </div>
                )}
                {item.videoId && (
                  <div className="rounded-xl bg-main px-[.8rem] text-[.9rem] font-medium text-white">
                    Video
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
