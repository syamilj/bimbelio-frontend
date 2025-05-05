'use client';

import { toaster } from '@/components/ui/toaster';
// import axiosInstance from "@/lib/axios/axiosInstance";
import { getGeneral } from '@/lib/fetch-helper';
// import { response } from "@/lib/response";
import { cn, getDateString, getHours } from '@/lib/utils';
import { Tryout } from '@/types/database';
// import { api } from '@/trpc/react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { utils, writeFile } from 'xlsx';

interface TryoutData extends Tryout {
  TryoutSession: {
    TryoutCategory: { name: string };
    TryoutSubCategory: { name: string };
    TryoutSessionParticipant: { userId: string }[];
    TryoutQuestion: {
      number: number;
      a_discrimination: number;
      b_difficulty: number;
      c_guessing: number;
      subCategory: string | null;
      subSubCategory: string | null;
    }[];
  }[];
  _count: {
    TryoutRegistration: number;
  };
  totalRegistration: number;
  totalJoin: number;
  irt: boolean;
}

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tryout, setTryout] = useState<TryoutData[] | undefined>();

  useEffect(() => {
    getGeneral('/tryout/getTryout', {
      setData: setTryout,
      setLoading: setIsLoading,
    });
  }, []);

  console.log('tryout', tryout);

  const exportData = async ({
    downloadData,
    fileName,
  }: {
    downloadData: any[];
    fileName: string;
  }) => {
    let wb = utils.book_new(),
      ws = utils.json_to_sheet(downloadData);
    utils.book_append_sheet(wb, ws, 'items');
    writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div className="mt-[1rem] flex flex-col gap-[2rem]">
      <div className="grid grid-cols-3 gap-[1rem]">
        {Array.from({ length: 3 }).map((_: any, i: number) => (
          <div
            key={i}
            className="flex h-full w-full flex-col rounded-[1rem] bg-white p-[2rem]"
          >
            <h1 className="font-regular text-[2rem]">80</h1>
            <p className="text-main-gray-text">Peserta tryout saat ini</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[2rem]">
        <Link
          href={'/admin/tryout/testing/try-out'}
          className="flex w-fit cursor-pointer items-center justify-center rounded-[.8rem] bg-yellow-400 px-[1rem] py-[.6rem] text-white duration-300 md:hover:bg-yellow-300"
        >
          Test Tryout
        </Link>
        <div
          id="head"
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-[1rem]">
            <input
              type="text"
              className="w-[300px] rounded-[.8rem] border border-transparent px-[1rem] py-[.5rem] text-[.9rem] outline-none duration-300 focus:shadow-default md:hover:shadow-default"
              placeholder="Cari tryout.."
            />
            <div className="flex h-full items-center justify-center rounded-[.8rem] bg-white px-[2rem] py-[.5rem] text-[.9rem] text-main-gray-text outline-none duration-300 md:hover:shadow-default">
              Filter
            </div>
          </div>
          <div className="flex items-center gap-[1rem] text-[.9rem]">
            <div className="flex h-full cursor-pointer items-center justify-center px-[1rem] font-medium text-main-gray-text duration-300 md:hover:text-black">
              Export CSV
            </div>
            <Link
              href={'/admin/tryout/new'}
              className="flex cursor-pointer items-center justify-center rounded-[.8rem] bg-main px-[1rem] py-[.6rem] text-white duration-300 hover:bg-main/85"
            >
              Tambah try out
            </Link>
          </div>
        </div>
        <div
          id="table"
          className="w-full"
        >
          <table className="w-full rounded-[.8rem]">
            <thead>
              <tr>
                <th className="rounded-tl-[.8rem] bg-white py-[1rem] text-center">
                  No
                </th>
                <th className="bg-white py-[1rem] text-start">Judul</th>
                <th className="bg-white py-[1rem] text-start">ID</th>
                <th className="bg-white py-[1rem] text-center">Daftar</th>
                <th className="bg-white py-[1rem] text-center">Mengerjakan</th>
                <th className="bg-white py-[1rem] text-center">Tanggal</th>
                <th className="bg-white py-[1rem] text-start">Kategori</th>
                <th className="bg-white py-[1rem] text-start">Status</th>
                <th className="rounded-tr-[.8rem] bg-white py-[1rem] text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tryout?.map((item, i: number) => (
                <tr key={i}>
                  <td
                    className={cn(
                      'border-t bg-white px-[.5rem] py-[1rem] text-center text-[.9rem] text-main-gray-text',
                      i === tryout.length - 1 && 'rounded-bl-[.8rem]',
                    )}
                  >
                    {i + 1}
                  </td>
                  <td className="border-t bg-white px-[.5rem] py-[1rem] text-start text-[.9rem] text-main-gray-text">
                    {item.title}
                  </td>
                  <td className="border-t bg-white px-[.5rem] py-[1rem] text-start text-[.9rem] text-main-gray-text">
                    <button
                      className="rounded-[.5rem] bg-main-gray-input px-[.5rem] py-[.2rem] duration-300 md:hover:bg-main-gray-input2 md:active:bg-main-gray-input"
                      onClick={() => {
                        navigator.clipboard.writeText(`${item.id}`);
                        toaster({
                          title: 'Success',
                          description: `ID Tryout Berhasil Disalin \n (${item.id})`,
                          duration: 3000,
                        });
                      }}
                    >
                      Copy ID
                    </button>
                  </td>
                  <td className="border-t bg-white px-[.5rem] py-[1rem] text-center text-[.9rem] text-main-gray-text">
                    {item.totalRegistration}
                  </td>
                  <td className="border-t bg-white px-[.5rem] py-[1rem] text-center text-[.9rem] text-main-gray-text">
                    {item.totalJoin}
                  </td>
                  <td className="border-t bg-white px-[.5rem] py-[1rem] text-center text-[.9rem] text-main-gray-text">
                    {getDateString(item.startDate)} | {getHours(item.startDate)}
                  </td>
                  <td className="border-t bg-white px-[.5rem] py-[1rem] text-start text-[.9rem] text-main-gray-text">
                    <div className="flex items-center gap-[.5rem]">
                      {item.TryoutSession.map((item2, i: number) => {
                        return (
                          <div
                            key={i}
                            className="rounded-[1rem] bg-main px-[.5rem] text-[.9rem] text-white cursor-pointer"
                            onClick={() => {
                              const fileName = `${item2.TryoutCategory.name} - ${item2.TryoutSubCategory.name}`;
                              const data = item2.TryoutQuestion.map((quest) => {
                                return {
                                  Session: fileName,
                                  Question: quest.number,
                                  a: quest.a_discrimination,
                                  b: quest.b_difficulty,
                                  c: quest.c_guessing,
                                  SubCategory: quest.subCategory,
                                  SubSubCategory: quest.subSubCategory,
                                };
                              });
                              exportData({ downloadData: data, fileName });
                              console.log(item2);
                            }}
                          >
                            {item2.TryoutCategory?.name}
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td className="border-t bg-white px-[.5rem] py-[1rem] text-start text-[.9rem] text-main-gray-text">
                    {item.status}
                  </td>
                  <td
                    className={cn(
                      'border-t bg-white text-start text-[.9rem] text-main-gray-text',
                      i === tryout.length - 1 && 'rounded-br-[.8rem]',
                    )}
                  >
                    <div className="flex w-full justify-center gap-[1rem]">
                      <Link href={`/admin/tryout/edit/${item.id}`}>Edit</Link>
                      {item.irt && (
                        <Link href={`/admin/tryout/irt/${item.id}`}>IRT</Link>
                      )}
                      {/* {item.irt && (
                        <button
                          className=""
                          onClick={() =>
                            handleSaveIRT({
                              tryoutId: item.id,
                              title: item.title,
                            })
                          }
                        >
                          SaveIRT
                        </button>
                      )} */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isLoading && (
            <div className="flex justify-center items-center h-full w-full">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
